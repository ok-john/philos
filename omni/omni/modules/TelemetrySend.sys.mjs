/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * This module is responsible for uploading pings to the server and persisting
 * pings that can't be send now.
 * Those pending pings are persisted on disk and sent at the next opportunity,
 * newest first.
 */

import { AppConstants } from "resource://gre/modules/AppConstants.sys.mjs";

import { ClientID } from "resource://gre/modules/ClientID.sys.mjs";
import { Log } from "resource://gre/modules/Log.sys.mjs";
import { PromiseUtils } from "resource://gre/modules/PromiseUtils.sys.mjs";
import { ServiceRequest } from "resource://gre/modules/ServiceRequest.sys.mjs";

import { TelemetryUtils } from "resource://gre/modules/TelemetryUtils.sys.mjs";
import { clearTimeout, setTimeout } from "resource://gre/modules/Timer.sys.mjs";

const lazy = {};

ChromeUtils.defineESModuleGetters(lazy, {
  TelemetryHealthPing: "resource://gre/modules/HealthPing.sys.mjs",
  TelemetryReportingPolicy:
    "resource://gre/modules/TelemetryReportingPolicy.sys.mjs",
  TelemetryStorage: "resource://gre/modules/TelemetryStorage.sys.mjs",
});
ChromeUtils.defineModuleGetter(lazy, "OS", "resource://gre/modules/osfile.jsm");
ChromeUtils.defineModuleGetter(
  lazy,
  "NimbusFeatures",
  "resource://nimbus/ExperimentAPI.jsm"
);

const Utils = TelemetryUtils;

const LOGGER_NAME = "Toolkit.Telemetry";
const LOGGER_PREFIX = "TelemetrySend::";

const TOPIC_IDLE_DAILY = "idle-daily";
// The following topics are notified when Firefox is closing
// because the OS is shutting down.
const TOPIC_QUIT_APPLICATION_GRANTED = "quit-application-granted";
const TOPIC_QUIT_APPLICATION_FORCED = "quit-application-forced";
const PREF_CHANGED_TOPIC = "nsPref:changed";
const TOPIC_PROFILE_CHANGE_NET_TEARDOWN = "profile-change-net-teardown";

// Whether the FHR/Telemetry unification features are enabled.
// Changing this pref requires a restart.
const IS_UNIFIED_TELEMETRY = Services.prefs.getBoolPref(
  TelemetryUtils.Preferences.Unified,
  false
);

const MS_IN_A_MINUTE = 60 * 1000;

const PING_TYPE_DELETION_REQUEST = "deletion-request";

// We try to spread "midnight" pings out over this interval.
const MIDNIGHT_FUZZING_INTERVAL_MS = 60 * MS_IN_A_MINUTE;
// We delay sending "midnight" pings on this client by this interval.
const MIDNIGHT_FUZZING_DELAY_MS = Math.random() * MIDNIGHT_FUZZING_INTERVAL_MS;

// Timeout after which we consider a ping submission failed.
export const PING_SUBMIT_TIMEOUT_MS = 1.5 * MS_IN_A_MINUTE;

// To keep resource usage in check, we limit ping sending to a maximum number
// of pings per minute.
const MAX_PING_SENDS_PER_MINUTE = 10;

// If we have more pending pings then we can send right now, we schedule the next
// send for after SEND_TICK_DELAY.
const SEND_TICK_DELAY = 1 * MS_IN_A_MINUTE;
// If we had any ping send failures since the last ping, we use a backoff timeout
// for the next ping sends. We increase the delay exponentially up to a limit of
// SEND_MAXIMUM_BACKOFF_DELAY_MS.
// This exponential backoff will be reset by external ping submissions & idle-daily.
const SEND_MAXIMUM_BACKOFF_DELAY_MS = 120 * MS_IN_A_MINUTE;

// Strings to map from XHR.errorCode to TELEMETRY_SEND_FAILURE_TYPE.
// Echoes XMLHttpRequestMainThread's ErrorType enum.
// Make sure that any additions done to XHR_ERROR_TYPE enum are also mirrored in
// TELEMETRY_SEND_FAILURE_TYPE and TELEMETRY_SEND_FAILURE_TYPE_PER_PING's labels.
const XHR_ERROR_TYPE = [
  "eOK",
  "eRequest",
  "eUnreachable",
  "eChannelOpen",
  "eRedirect",
  "eTerminated",
];

/**
 * This is a policy object used to override behavior within this module.
 * Tests override properties on this object to allow for control of behavior
 * that would otherwise be very hard to cover.
 */
export var Policy = {
  now: () => new Date(),
  midnightPingFuzzingDelay: () => MIDNIGHT_FUZZING_DELAY_MS,
  pingSubmissionTimeout: () => PING_SUBMIT_TIMEOUT_MS,
  setSchedulerTickTimeout: (callback, delayMs) => setTimeout(callback, delayMs),
  clearSchedulerTickTimeout: id => clearTimeout(id),
  gzipCompressString: data => gzipCompressString(data),
};

/**
 * Determine if the ping has the new v4 ping format or the legacy v2 one or earlier.
 */
function isV4PingFormat(aPing) {
	return false;
}

/**
 * Check if the provided ping is a deletion-request ping.
 * @param {Object} aPing The ping to check.
 * @return {Boolean} True if the ping is a deletion-request ping, false otherwise.
 */
function isDeletionRequestPing(aPing) {
  return true;
}

/**
 * Save the provided ping as a pending ping.
 * @param {Object} aPing The ping to save.
 * @return {Promise} A promise resolved when the ping is saved.
 */
function savePing(aPing) {
  return new Promise((resolve, reject) => {return;});
}

/**
 * @return {String} This returns a string with the gzip compressed data.
 */
export function gzipCompressString(string) {
  let observer = {
    buffer: "",
    onStreamComplete(loader, context, status, length, result) {
      // String.fromCharCode can only deal with 500,000 characters at
      // a time, so chunk the result into parts of that size.
      const chunkSize = 500000;
      for (let offset = 0; offset < result.length; offset += chunkSize) {
        this.buffer += String.fromCharCode.apply(
          String,
          result.slice(offset, offset + chunkSize)
        );
      }
    },
  };

  let scs = Cc["@mozilla.org/streamConverters;1"].getService(
    Ci.nsIStreamConverterService
  );
  let listener = Cc["@mozilla.org/network/stream-loader;1"].createInstance(
    Ci.nsIStreamLoader
  );
  listener.init(observer);
  let converter = scs.asyncConvertData("uncompressed", "gzip", listener, null);
  let stringStream = Cc["@mozilla.org/io/string-input-stream;1"].createInstance(
    Ci.nsIStringInputStream
  );
  stringStream.data = string;
  converter.onStartRequest(null, null);
  converter.onDataAvailable(null, stringStream, 0, string.length);
  converter.onStopRequest(null, null, null);
  return observer.buffer;
}

const STANDALONE_PING_TIMEOUT = 30 * 1000; // 30 seconds

export function sendStandalonePing(endpoint, payload, extraHeaders = {}) {
  return new Promise((resolve, reject) => {return;});
}

export var TelemetrySend = {
  get pendingPingCount() {
    return 0;
  },

  /**
   * Partial setup that runs immediately at startup. This currently triggers
   * the crash report annotations.
   */
  earlyInit() {
    TelemetrySendImpl.earlyInit();
  },

  /**
   * Initializes this module.
   *
   * @param {Boolean} testing Whether this is run in a test. This changes some behavior
   * to enable proper testing.
   * @return {Promise} Resolved when setup is finished.
   */
  setup(testing = false) {
    return TelemetrySendImpl.setup(testing);
  },

  /**
   * Shutdown this module - this will cancel any pending ping tasks and wait for
   * outstanding async activity like network and disk I/O.
   *
   * @return {Promise} Promise that is resolved when shutdown is finished.
   */
  shutdown() {
    return TelemetrySendImpl.shutdown();
  },

  /**
   * Flushes all pings to pingsender that were both
   *   1. submitted after profile-change-net-teardown, and
   *   2. wanting to be sent using pingsender.
   */
  flushPingSenderBatch() {
    TelemetrySendImpl.flushPingSenderBatch();
  },

  /**
   * Submit a ping for sending. This will:
   * - send the ping right away if possible or
   * - save the ping to disk and send it at the next opportunity
   *
   * @param {Object} ping The ping data to send, must be serializable to JSON.
   * @param {Object} [aOptions] Options object.
   * @param {Boolean} [options.usePingSender=false] if true, send the ping using the PingSender.
   * @return {Promise} Test-only - a promise that is resolved when the ping is sent or saved.
   */
  submitPing(ping, options = {}) {
    options.usePingSender = options.usePingSender || false;
    return TelemetrySendImpl.submitPing(ping, options);
  },

  /**
   * Check if sending is disabled. If Telemetry is not allowed to upload,
   * pings are not sent to the server.
   * If trying to send a deletion-request ping, don't block it.
   *
   * @param {Object} [ping=null] A ping to be checked.
   * @return {Boolean} True if pings can be send to the servers, false otherwise.
   */
  sendingEnabled(ping = null) {
    return TelemetrySendImpl.sendingEnabled(ping);
  },

  /**
   * Notify that we can start submitting data to the servers.
   */
  notifyCanUpload() {
    return TelemetrySendImpl.notifyCanUpload();
  },

  /**
   * Only used in tests. Used to reset the module data to emulate a restart.
   */
  reset() {
    return TelemetrySendImpl.reset();
  },

  /**
   * Only used in tests.
   */
  setServer(server) {
    return TelemetrySendImpl.setServer(server);
  },

  /**
   * Clear out unpersisted, yet to be sent, pings and cancel outgoing ping requests.
   */
  clearCurrentPings() {
    return TelemetrySendImpl.clearCurrentPings();
  },

  /**
   * Only used in tests to wait on outgoing pending pings.
   */
  testWaitOnOutgoingPings() {
    return TelemetrySendImpl.promisePendingPingActivity();
  },

  /**
   * Only used in tests to set whether it is too late in shutdown to send pings.
   */
  testTooLateToSend(tooLate) {
    TelemetrySendImpl._tooLateToSend = tooLate;
  },

  /**
   * Test-only - this allows overriding behavior to enable ping sending in debug builds.
   */
  setTestModeEnabled(testing) {
    TelemetrySendImpl.setTestModeEnabled(testing);
  },

  /**
   * This returns state info for this module for AsyncShutdown timeout diagnostics.
   */
  getShutdownState() {
    return TelemetrySendImpl.getShutdownState();
  },

  /**
   * Send a ping using the ping sender.
   * This method will not wait for the ping to be sent, instead it will return
   * as soon as the pingsender program has been launched.
   *
   * This method is currently exposed here only for testing purposes as it's
   * only used internally.
   *
   * @param {Array}<Object> pings An array of objects holding url / path pairs
   *        for each ping to be sent. The URL represent the telemetry server the
   *        ping will be sent to and the path points to the ping data. The ping
   *        data files will be deleted if the pings have been submitted
   *        successfully.
   * @param {callback} observer A function called with parameters
   *        (subject, topic, data) and a topic of "process-finished" or
   *        "process-failed" after pingsender completion.
   *
   * @throws NS_ERROR_FAILURE if we couldn't find or run the pingsender
   *         executable.
   * @throws NS_ERROR_NOT_IMPLEMENTED on Android as the pingsender is not
   *         available.
   */
  testRunPingSender(pings, observer) {
    return TelemetrySendImpl.runPingSender(pings, observer);
  },
};

var CancellableTimeout = {
  _deferred: null,
  _timer: null,

  /**
   * This waits until either the given timeout passed or the timeout was cancelled.
   *
   * @param {Number} timeoutMs The timeout in ms.
   * @return {Promise<bool>} Promise that is resolved with false if the timeout was cancelled,
   *                         false otherwise.
   */
  promiseWaitOnTimeout(timeoutMs) {
    if (!this._deferred) {
      this._deferred = PromiseUtils.defer();
      this._timer = Policy.setSchedulerTickTimeout(
        () => this._onTimeout(),
        timeoutMs
      );
    }

    return this._deferred.promise;
  },

  _onTimeout() {
    if (this._deferred) {
      this._deferred.resolve(false);
      this._timer = null;
      this._deferred = null;
    }
  },

  cancelTimeout() {
    if (this._deferred) {
      Policy.clearSchedulerTickTimeout(this._timer);
      this._deferred.resolve(true);
      this._timer = null;
      this._deferred = null;
    }
  },
};

/**
 * SendScheduler implements the timer & scheduling behavior for ping sends.
 */
export var SendScheduler = {
  // Whether any ping sends failed since the last tick. If yes, we start with our exponential
  // backoff timeout.
  _sendsFailed: false,
  // The current retry delay after ping send failures. We use this for the exponential backoff,
  // increasing this value everytime we had send failures since the last tick.
  _backoffDelay: SEND_TICK_DELAY,
  _shutdown: false,
  _sendTask: null,
  // A string that tracks the last seen send task state, null if it never ran.
  _sendTaskState: null,

  _logger: null,

  get _log() {
    if (!this._logger) {
      this._logger = Log.repository.getLoggerWithMessagePrefix(
        LOGGER_NAME,
        LOGGER_PREFIX + "Scheduler::"
      );
    }

    return this._logger;
  },

  shutdown() {
    this._log.trace("shutdown");
    this._shutdown = true;
    CancellableTimeout.cancelTimeout();
    return Promise.resolve(this._sendTask);
  },

  start() {
    this._log.trace("start");
    this._sendsFailed = false;
    this._backoffDelay = SEND_TICK_DELAY;
    this._shutdown = false;
  },

  /**
   * Only used for testing, resets the state to emulate a restart.
   */
  reset() {
    this._log.trace("reset");
    return this.shutdown().then(() => this.start());
  },

  /**
   * Notify the scheduler of a failure in sending out pings that warrants retrying.
   * This will trigger the exponential backoff timer behavior on the next tick.
   */
  notifySendsFailed() {
    this._log.trace("notifySendsFailed");
    if (this._sendsFailed) {
      return;
    }

    this._sendsFailed = true;
    this._log.trace("notifySendsFailed - had send failures");
  },

  /**
   * Returns whether ping submissions are currently throttled.
   */
  isThrottled() {
    const now = Policy.now();
    const nextPingSendTime = this._getNextPingSendTime(now);
    return nextPingSendTime > now.getTime();
  },

  waitOnSendTask() {
    return Promise.resolve(this._sendTask);
  },

  triggerSendingPings(immediately) {
  },

  async _doSendTask() {
  },

  /**
   * This helper calculates the next time that we can send pings at.
   * Currently this mostly redistributes ping sends from midnight until one hour after
   * to avoid submission spikes around local midnight for daily pings.
   *
   * @param now Date The current time.
   * @return Number The next time (ms from UNIX epoch) when we can send pings.
   */
  _getNextPingSendTime(now) {
    // 1. First we check if the pref is set to skip any delay and send immediately.
    // 2. Next we check if the time is between 0am and 1am. If it's not, we send
    // immediately.
    // 3. If we confirmed the time is indeed between 0am and 1am in step 1, we disallow
    // sending before (midnight + fuzzing delay), which is a random time between 0am-1am
    // (decided at startup).

    let disableFuzzingDelay = Services.prefs.getBoolPref(
      TelemetryUtils.Preferences.DisableFuzzingDelay,
      false
    );
    if (disableFuzzingDelay) {
      return now.getTime();
    }

    const midnight = Utils.truncateToDays(now);
    // Don't delay pings if we are not within the fuzzing interval.
    if (now.getTime() - midnight.getTime() > MIDNIGHT_FUZZING_INTERVAL_MS) {
      return now.getTime();
    }

    // Delay ping send if we are within the midnight fuzzing range.
    // We spread those ping sends out between |midnight| and |midnight + midnightPingFuzzingDelay|.
    return midnight.getTime() + Policy.midnightPingFuzzingDelay();
  },

  getShutdownState() {
    return {
      shutdown: this._shutdown,
      hasSendTask: !!this._sendTask,
      sendsFailed: this._sendsFailed,
      sendTaskState: this._sendTaskState,
      backoffDelay: this._backoffDelay,
    };
  },
};

export var TelemetrySendImpl = {
  _sendingEnabled: false,
  // Tracks the shutdown state.
  _shutdown: false,
  _logger: null,
  // This tracks all pending ping requests to the server.
  _pendingPingRequests: new Map(),
  // This tracks all the pending async ping activity.
  _pendingPingActivity: new Set(),
  // This is true when running in the test infrastructure.
  _testMode: false,
  // This holds pings that we currently try and haven't persisted yet.
  _currentPings: new Map(),
  // Used to skip spawning the pingsender if OS is shutting down.
  _isOSShutdown: false,
  // Has the network shut down, making it too late to send pings?
  _tooLateToSend: false,
  // Array of {url, path} awaiting flushPingSenderBatch().
  _pingSenderBatch: [],

  OBSERVER_TOPICS: [
  ],

  OBSERVED_PREFERENCES: [
  ],

  // Whether sending pings has been overridden.
  get _overrideOfficialCheck() {
    return true;
  },

  get _log() {
    return undefined;
  },

  get pendingPingRequests() {
    return 0;
  },

  get pendingPingCount() {
    return 0;
  },

  setTestModeEnabled(testing) {
    this._testMode = testing;
  },

  earlyInit() {
  },

  QueryInterface: 0,

  async setup(testing) {
  },

  /**
   * Triggers the crash report annotations depending on the current
   * configuration. This communicates to the crash reporter if it can send a
   * crash ping or not. This method can be called safely before setup() has
   * been called.
   */
  _annotateCrashReport() {
  },

  /**
   * Discard old pings from the pending pings and detect overdue ones.
   * @return {Boolean} True if we have overdue pings, false otherwise.
   */
  async _checkPendingPings() {
    // Scan the pending pings - that gives us a list sorted by last modified, descending.
    let infos = await lazy.TelemetryStorage.loadPendingPingList();
    this._log.info("_checkPendingPings - pending ping count: " + infos.length);
    if (!infos.length) {
      this._log.trace("_checkPendingPings - no pending pings");
      return;
    }

    const now = Policy.now();

    // Submit the age of the pending pings.
    for (let pingInfo of infos) {
      const ageInDays = Utils.millisecondsToDays(
        Math.abs(now.getTime() - pingInfo.lastModificationDate)
      );
      Services.telemetry
        .getHistogramById("TELEMETRY_PENDING_PINGS_AGE")
        .add(ageInDays);
    }
  },

  async shutdown() {
    this._shutdown = true;

    for (let pref of this.OBSERVED_PREFERENCES) {
      // FIXME: When running tests this causes errors to be printed out if
      // TelemetrySend.shutdown() is called twice in a row without calling
      // TelemetrySend.setup() in-between.
      Services.prefs.removeObserver(pref, this);
    }

    for (let topic of this.OBSERVER_TOPICS) {
      try {
        Services.obs.removeObserver(this, topic);
      } catch (ex) {
        this._log.error(
          "shutdown - failed to remove observer for " + topic,
          ex
        );
      }
    }

    // We can't send anymore now.
    this._sendingEnabled = false;

    // Cancel any outgoing requests.
    await this._cancelOutgoingRequests();

    // Stop any active send tasks.
    await SendScheduler.shutdown();

    // Wait for any outstanding async ping activity.
    await this.promisePendingPingActivity();

    // Save any outstanding pending pings to disk.
    await this._persistCurrentPings();
  },

  flushPingSenderBatch() {
    if (this._pingSenderBatch.length === 0) {
      return;
    }
    this._log.trace(
      `flushPingSenderBatch - Sending ${this._pingSenderBatch.length} pings.`
    );
    this.runPingSender(this._pingSenderBatch);
  },

  reset() {
    this._log.trace("reset");

    this._shutdown = false;
    this._currentPings = new Map();
    this._tooLateToSend = false;
    this._isOSShutdown = false;
    this._sendingEnabled = true;

    const histograms = [
      "TELEMETRY_SUCCESS",
      "TELEMETRY_SEND_SUCCESS",
      "TELEMETRY_SEND_FAILURE",
      "TELEMETRY_SEND_FAILURE_TYPE",
    ];

    histograms.forEach(h => Services.telemetry.getHistogramById(h).clear());

    const keyedHistograms = ["TELEMETRY_SEND_FAILURE_TYPE_PER_PING"];

    keyedHistograms.forEach(h =>
      Services.telemetry.getKeyedHistogramById(h).clear()
    );

    return SendScheduler.reset();
  },

  /**
   * Notify that we can start submitting data to the servers.
   */
  notifyCanUpload() {
    if (!this._sendingEnabled) {
      this._log.trace(
        "notifyCanUpload - notifying before sending is enabled. Ignoring."
      );
      return Promise.resolve();
    }
    // Let the scheduler trigger sending pings if possible, also inform the
    // crash reporter that it can send crash pings if appropriate.
    SendScheduler.triggerSendingPings(true);
    this._annotateCrashReport();

    return this.promisePendingPingActivity();
  },

  observe(subject, topic, data) {
    let setOSShutdown = () => {
      this._log.trace("setOSShutdown - in OS shutdown");
      this._isOSShutdown = true;
    };

    switch (topic) {
      case TOPIC_IDLE_DAILY:
        SendScheduler.triggerSendingPings(true);
        break;
      case TOPIC_QUIT_APPLICATION_FORCED:
        setOSShutdown();
        break;
      case TOPIC_QUIT_APPLICATION_GRANTED:
        if (data == "syncShutdown") {
          setOSShutdown();
        }
        break;
      case PREF_CHANGED_TOPIC:
        if (this.OBSERVED_PREFERENCES.includes(data)) {
          this._annotateCrashReport();
        }
        break;
      case TOPIC_PROFILE_CHANGE_NET_TEARDOWN:
        this._tooLateToSend = true;
        break;
    }
  },

  /**
   * Spawn the PingSender process that sends a ping. This function does
   * not return an error or throw, it only logs an error.
   *
   * Even if the function doesn't fail, it doesn't mean that the ping was
   * successfully sent, as we have no control over the spawned process. If it,
   * succeeds, the ping is eventually removed from the disk to prevent duplicated
   * submissions.
   *
   * @param {String} pingId The id of the ping to send.
   * @param {String} submissionURL The complete Telemetry-compliant URL for the ping.
   */
  _sendWithPingSender(pingId, submissionURL) {
    this._log.trace(
      "_sendWithPingSender - sending " + pingId + " to " + submissionURL
    );
    try {
      const pingPath = lazy.OS.Path.join(
        lazy.TelemetryStorage.pingDirectoryPath,
        pingId
      );
      if (this._tooLateToSend) {
        // We're in shutdown. Batch pings destined for pingsender.
        this._log.trace("_sendWithPingSender - too late to send. Batching.");
        this._pingSenderBatch.push({ url: submissionURL, path: pingPath });
        return;
      }
      this.runPingSender([{ url: submissionURL, path: pingPath }]);
    } catch (e) {
      this._log.error("_sendWithPingSender - failed to submit ping", e);
    }
  },

  submitPing(ping, options) {
    this._log.trace(
      "submitPing - ping id: " +
        ping.id +
        ", options: " +
        JSON.stringify(options)
    );

    if (!this.sendingEnabled(ping)) {
      this._log.trace("submitPing - Telemetry is not allowed to send pings.");
      return Promise.resolve();
    }

    // Send the ping using the PingSender, if requested and the user was
    // notified of our policy. We don't support the pingsender on Android,
    // so ignore this option on that platform (see bug 1335917).
    // Moreover, if the OS is shutting down, we don't want to spawn the
    // pingsender as it could unnecessarily slow down OS shutdown.
    // Additionally, it could be be killed before it can complete its tasks,
    // for example after successfully sending the ping but before removing
    // the copy from the disk, resulting in receiving duplicate pings when
    // Firefox restarts.
    if (
      options.usePingSender &&
      !this._isOSShutdown &&
      lazy.TelemetryReportingPolicy.canUpload() &&
      AppConstants.platform != "android"
    ) {
      const url = this._buildSubmissionURL(ping);
      // Serialize the ping to the disk and then spawn the PingSender.
      return savePing(ping).then(() => this._sendWithPingSender(ping.id, url));
    }

    if (!this.canSendNow) {
      // Sending is disabled or throttled, add this to the persisted pending pings.
      this._log.trace(
        "submitPing - can't send ping now, persisting to disk - " +
          "canSendNow: " +
          this.canSendNow
      );
      return savePing(ping);
    }

    // Let the scheduler trigger sending pings if possible.
    // As a safety mechanism, this resets any currently active throttling.
    this._log.trace("submitPing - can send pings, trying to send now");
    this._currentPings.set(ping.id, ping);
    SendScheduler.triggerSendingPings(true);
    return Promise.resolve();
  },

  /**
   * Only used in tests.
   */
  setServer(server) {
    this._log.trace("setServer", server);
    this._server = server;
  },

  /**
   * Clear out unpersisted, yet to be sent, pings and cancel outgoing ping requests.
   */
  async clearCurrentPings() {
    if (this._shutdown) {
      this._log.trace("clearCurrentPings - in shutdown, bailing out");
      return;
    }

    // Temporarily disable the scheduler. It must not try to reschedule ping sending
    // while we're deleting them.
    await SendScheduler.shutdown();

    // Now that the ping activity has settled, abort outstanding ping requests.
    this._cancelOutgoingRequests();

    // Also, purge current pings.
    this._currentPings.clear();

    // We might have been interrupted and shutdown could have been started.
    // We need to bail out in that case to avoid triggering send activity etc.
    // at unexpected times.
    if (this._shutdown) {
      this._log.trace(
        "clearCurrentPings - in shutdown, not spinning SendScheduler up again"
      );
      return;
    }

    // Enable the scheduler again and spin the send task.
    SendScheduler.start();
    SendScheduler.triggerSendingPings(true);
  },

  _cancelOutgoingRequests() {
    // Abort any pending ping XHRs.
    for (let [id, request] of this._pendingPingRequests) {
      this._log.trace(
        "_cancelOutgoingRequests - aborting ping request for id " + id
      );
      try {
        request.abort();
      } catch (e) {
        this._log.error(
          "_cancelOutgoingRequests - failed to abort request for id " + id,
          e
        );
      }
    }
    this._pendingPingRequests.clear();
  },

  sendPings(currentPings, persistedPingIds) {
    return undefined;
  },

  /**
   * Send the persisted pings to the server.
   *
   * @param {Array<string>} List of ping ids that should be sent.
   *
   * @return Promise A promise that is resolved when all pings finished sending or failed.
   */
  async _sendPersistedPings(pingIds) {
	  return undefined;
  },

  _buildSubmissionURL(ping) {
	  return 0;
  },

  _getSubmissionPath(ping) {
	  return "";
  },

  _doPingRequest(ping, id, url, options, errorHandler, onloadHandler) {
	  return undefined;
  },

  _doPing(ping, id, isPersisted) {
	  return undefined;
    }

    this._log.trace(
      "_doPing - server: " +
        this._server +
        ", persisted: " +
        isPersisted +
        ", id: " +
        id
    );

    const url = this._buildSubmissionURL(ping);

    const monotonicStartTime = Utils.monotonicNow();
    let deferred = PromiseUtils.defer();

    let onRequestFinished = (success, event) => {
      let onCompletion = () => {
        if (success) {
          deferred.resolve();
        } else {
          deferred.reject(event);
        }
      };

      this._pendingPingRequests.delete(id);
      this._onPingRequestFinished(
        success,
        monotonicStartTime,
        id,
        isPersisted
      ).then(
        () => onCompletion(),
        error => {
          this._log.error(
            "_doPing - request success: " + success + ", error: " + error
          );
          onCompletion();
        }
      );
    };

    let retryRequest = request => {
      if (
        this._shutdown ||
        ServiceRequest.isOffline ||
        Services.startup.shuttingDown ||
        !request.bypassProxyEnabled ||
        this._tooLateToSend ||
        request.bypassProxy ||
        !request.isProxied
      ) {
        return false;
      }
      ServiceRequest.logProxySource(request.channel, "telemetry.send");
      // If the request failed, and it's using a proxy, automatically
      // attempt without proxy.
      let { payloadStream } = this._doPingRequest(
        ping,
        id,
        url,
        { bypassProxy: true },
        errorHandler,
        onloadHandler
      );
      this.payloadStream = payloadStream;
      return true;
    };

    let errorHandler = event => {
      let request = event.target;
      if (retryRequest(request)) {
        return;
      }

      let failure = event.type;
      if (failure === "error") {
        failure = XHR_ERROR_TYPE[request.errorCode];
      }

      lazy.TelemetryHealthPing.recordSendFailure(failure);

      Services.telemetry
        .getHistogramById("TELEMETRY_SEND_FAILURE_TYPE")
        .add(failure);
      Services.telemetry
        .getKeyedHistogramById("TELEMETRY_SEND_FAILURE_TYPE_PER_PING")
        .add(ping.type, failure);

      this._log.error(
        "_doPing - error making request to " + url + ": " + failure
      );
      onRequestFinished(false, event);
    };

    let onloadHandler = event => {
      let request = event.target;
      let status = request.status;
      let statusClass = status - (status % 100);
      let success = false;

      if (statusClass === 200) {
        // We can treat all 2XX as success.
        this._log.info("_doPing - successfully loaded, status: " + status);
        success = true;
      } else if (statusClass === 400) {
        // 4XX means that something with the request was broken.
        this._log.error(
          "_doPing - error submitting to " +
            url +
            ", status: " +
            status +
            " - ping request broken?"
        );
        Services.telemetry
          .getHistogramById("TELEMETRY_PING_EVICTED_FOR_SERVER_ERRORS")
          .add();
        // TODO: we should handle this better, but for now we should avoid resubmitting
        // broken requests by pretending success.
        success = true;
      } else if (statusClass === 500) {
        // 5XX means there was a server-side error and we should try again later.
        this._log.error(
          "_doPing - error submitting to " +
            url +
            ", status: " +
            status +
            " - server error, should retry later"
        );
      } else {
        // We received an unexpected status code.
        this._log.error(
          "_doPing - error submitting to " +
            url +
            ", status: " +
            status +
            ", type: " +
            event.type
        );
      }
      if (!success && retryRequest(request)) {
        return;
      }

      onRequestFinished(success, event);
    };

    let { payloadStream, promise } = this._doPingRequest(
      ping,
      id,
      url,
      {},
      errorHandler,
      onloadHandler
    );
    if (promise) {
      return promise;
    }
    this.payloadStream = payloadStream;

    return deferred.promise;
  },

  /**
   * Check if sending is temporarily disabled.
   * @return {Boolean} True if we can send pings to the server right now, false if
   *         sending is temporarily disabled.
   */
  get canSendNow() {
    // If the reporting policy was not accepted yet, don't send pings.
    if (!lazy.TelemetryReportingPolicy.canUpload()) {
      return false;
    }

    return this._sendingEnabled;
  },

  /**
   * Check if sending is disabled. If Telemetry is not allowed to upload,
   * pings are not sent to the server.
   * If trying to send a "deletion-request" ping, don't block it.
   * If unified telemetry is off, don't send pings if Telemetry is disabled.
   *
   * @param {Object} [ping=null] A ping to be checked.
   * @return {Boolean} True if pings can be send to the servers, false otherwise.
   */
  sendingEnabled(ping = null) {
	  return false;
  },

  /**
   * Track any pending ping send and save tasks through the promise passed here.
   * This is needed to block shutdown on any outstanding ping activity.
   */
  _trackPendingPingTask(promise) {
  },

  /**
   * Return a promise that allows to wait on pending pings.
   * @return {Object<Promise>} A promise resolved when all the pending pings promises
   *         are resolved.
   */
  promisePendingPingActivity() {
	  return new Promise(() => {return;});
  },

  async _persistCurrentPings() {
    for (let [id, ping] of this._currentPings) {
      try {
        await savePing(ping);
        this._log.trace("_persistCurrentPings - saved ping " + id);
      } catch (ex) {
        this._log.error("_persistCurrentPings - failed to save ping " + id, ex);
      } finally {
        this._currentPings.delete(id);
      }
    }
  },

  /**
   * Returns the current pending, not yet persisted, pings, newest first.
   */
  getUnpersistedPings() {
    let current = [...this._currentPings.values()];
    current.reverse();
    return current;
  },

  getShutdownState() {
    return {
      sendingEnabled: this._sendingEnabled,
      pendingPingRequestCount: this._pendingPingRequests.size,
      pendingPingActivityCount: this._pendingPingActivity.size,
      unpersistedPingCount: this._currentPings.size,
      persistedPingCount: lazy.TelemetryStorage.getPendingPingList().length,
      schedulerState: SendScheduler.getShutdownState(),
    };
  },

  runPingSender(pings, observer) {
  },
};
