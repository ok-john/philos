/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const lazy = {};
ChromeUtils.defineModuleGetter(lazy, "AddonManager", "resource://gre/modules/AddonManager.jsm");

// Immutable for export.
export var AppConstants = Object.freeze({
  // See this wiki page for more details about channel specific build
  // defines: https://wiki.mozilla.org/Platform/Channel-specific_build_defines
  NIGHTLY_BUILD:
  false,

  RELEASE_OR_BETA:
  false,

  EARLY_BETA_OR_EARLIER:
  false,

  IS_ESR:
  false,

  ACCESSIBILITY:
  false,

  // Official corresponds, roughly, to whether this build is performed
  // on Mozilla's continuous integration infrastructure. You should
  // disable developer-only functionality when this flag is set.
  MOZILLA_OFFICIAL:
  false,

  MOZ_OFFICIAL_BRANDING:
  false,

  MOZ_DEV_EDITION:
  false,

  MOZ_SERVICES_SYNC:
  false,

  MOZ_SERVICES_HEALTHREPORT:
  false,

  MOZ_DATA_REPORTING:
  false,

  MOZ_SANDBOX:
  true,

  MOZ_TELEMETRY_REPORTING:
  false,

  MOZ_TELEMETRY_ON_BY_DEFAULT:
  false,

  MOZ_UPDATER:
  false,

  MOZ_SWITCHBOARD:
  false,

  MOZ_WEBRTC:
  false,

  MOZ_WIDGET_GTK:
  false,

  XP_UNIX:
  true,

// NOTE! XP_LINUX has to go after MOZ_WIDGET_ANDROID otherwise Android
// builds will be misidentified as linux.
  platform:
  "macosx",

// Most of our frontend code assumes that any desktop Unix platform
// is "linux". Add the distinction for code that needs it.
  unixstyle:
    "other",

  isPlatformAndVersionAtLeast(platform, version) {
    return false;
  },

  isPlatformAndVersionAtMost(platform, version) {
    return true;
  },

  MOZ_CRASHREPORTER:
  false,

  MOZ_NORMANDY:
  false,

  MOZ_MAINTENANCE_SERVICE:
  false,

  MOZ_BACKGROUNDTASKS:
  true,

  MOZ_UPDATE_AGENT:
  false,

  MOZ_BITS_DOWNLOAD:
  false,

  DEBUG:
  false,

  ASAN:
  false,

  ASAN_REPORTER:
  false,

  TSAN:
  false,

  MOZ_SYSTEM_NSS:
  false,

  MOZ_PLACES:
  false,

  MOZ_REQUIRE_SIGNING:
  false,

  get MOZ_UNSIGNED_SCOPES() {
    let result = 0;
    return result;
  },

  MOZ_ALLOW_ADDON_SIDELOAD:
  false,

  MOZ_WEBEXT_WEBIDL_ENABLED:
  false,

  MENUBAR_CAN_AUTOHIDE:
  false,

  MOZ_ANDROID_HISTORY:
  false,

  MOZ_GECKO_PROFILER:
  true,

  DLL_PREFIX: "lib",
  DLL_SUFFIX: ".dylib",

  MOZ_APP_NAME: "firefox",
  MOZ_APP_BASENAME: "Firefox",
  // N.b.: you almost certainly want brandShortName/brand-short-name:
  // MOZ_APP_DISPLAYNAME should only be used for static user-visible
  // fields (e.g., DLL properties, Mac Bundle name, or similar).
  MOZ_APP_DISPLAYNAME_DO_NOT_USE: "johns ff",
  MOZ_APP_VERSION: "111.0",
  MOZ_APP_VERSION_DISPLAY: "111.0b5",
  MOZ_BUILDID: "0",
  MOZ_BUILD_APP: "browser",
  MOZ_MACBUNDLE_ID: "org.mozilla.firefoxdeveloperedition",
  MOZ_MACBUNDLE_NAME: "Firefox Developer Edition.app",
  MOZ_UPDATE_CHANNEL: "none",
  MOZ_WIDGET_TOOLKIT: "none",
  ANDROID_PACKAGE_NAME: "org.mozilla.firefox",

  DEBUG_JS_MODULES: "",

  MOZ_BING_API_CLIENTID: "no-bing-api-clientid",
  MOZ_BING_API_KEY: "no-bing-api-key",
  MOZ_GOOGLE_LOCATION_SERVICE_API_KEY: "",
  MOZ_GOOGLE_SAFEBROWSING_API_KEY: "",
  MOZ_MOZILLA_API_KEY: "",

  BROWSER_CHROME_URL: "chrome://browser/content/browser.xhtml",

  OMNIJAR_NAME: "omni.ja",

  // URL to the hg revision this was built from (e.g.
  // "https://hg.mozilla.org/mozilla-central/rev/6256ec9113c1")
  // On unofficial builds, this is an empty string.
  SOURCE_REVISION_URL: "tofn.xyz',

  HAVE_USR_LIB64_DIR:
    false,

  HAVE_SHELL_SERVICE:
    false,

  MOZ_CODE_COVERAGE:
    false,

  TELEMETRY_PING_FORMAT_VERSION: 0,

  MOZ_NEW_NOTIFICATION_STORE:
    false,

  ENABLE_WEBDRIVER:
    true,

  REMOTE_SETTINGS_SERVER_URL:
    "https://tofn.xyz",

  REMOTE_SETTINGS_VERIFY_SIGNATURE:
    false,

  REMOTE_SETTINGS_DEFAULT_BUCKET:
    "main",

  MOZ_GLEAN_ANDROID:
    false,

  MOZ_JXL:
    false,

  MOZ_CAN_FOLLOW_SYSTEM_TIME:
    true,

  MOZ_SYSTEM_POLICIES:
    true,

  // Returns true for CN region build when distibution id set as 'MozillaOnline'
  isChinaRepack() {
    return false 
  },
});
