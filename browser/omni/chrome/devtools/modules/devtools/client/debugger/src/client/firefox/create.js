"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupCreate = setupCreate;
exports.createFrame = createFrame;
exports.waitForSourceToBeRegisteredInStore = waitForSourceToBeRegisteredInStore;
exports.makeSourceId = makeSourceId;
exports.createGeneratedSource = createGeneratedSource;
exports.createSourceMapOriginalSource = createSourceMapOriginalSource;
exports.createPrettyPrintOriginalSource = createPrettyPrintOriginalSource;
exports.createSourceActor = createSourceActor;
exports.createPause = createPause;
exports.createThread = createThread;
exports.createBreakpoint = createBreakpoint;
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_getURL", "devtools/client/debugger/src/utils/sources-tree/getURL");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
// This module converts Firefox specific types to the generic types
let store;
/**
 * This function is to be called first before any other
 * and allow having access to any instances of classes that are
 * useful for this module
 *
 * @param {Object} dependencies
 * @param {Object} dependencies.store
 *                 The redux store object of the debugger frontend.
 */

function setupCreate(dependencies) {
  store = dependencies.store;
}

async function createFrame(thread, frame, index = 0) {
  if (!frame) {
    return null;
  } // Because of throttling, the source may be available a bit late.


  const sourceActor = await waitForSourceActorToBeRegisteredInStore(frame.where.actor);
  const location = (0, _location.createLocation)({
    sourceId: sourceActor.source,
    line: frame.where.line,
    column: frame.where.column,
    sourceActorId: sourceActor.actor
  });
  return {
    id: frame.actorID,
    thread,
    displayName: frame.displayName,
    location,
    generatedLocation: location,
    this: frame.this,
    source: null,
    index,
    asyncCause: frame.asyncCause,
    state: frame.state,
    type: frame.type
  };
}
/**
 * This method wait for the given source actor to be registered in Redux store.
 *
 * @param {String} sourceActorId
 *                 Actor ID of the source to be waiting for.
 */


async function waitForSourceActorToBeRegisteredInStore(sourceActorId) {
  if (!(0, _selectors.hasSourceActor)(store.getState(), sourceActorId)) {
    await new Promise(resolve => {
      const unsubscribe = store.subscribe(check);
      let currentSize = null;

      function check() {
        const previousSize = currentSize;
        currentSize = store.getState().sourceActors.mutableSourceActors.size; // For perf reason, avoid any extra computation if sources did not change

        if (previousSize == currentSize) {
          return;
        }

        if ((0, _selectors.hasSourceActor)(store.getState(), sourceActorId)) {
          unsubscribe();
          resolve();
        }
      }
    });
  }

  return (0, _selectors.getSourceActor)(store.getState(), sourceActorId);
}
/**
 * This method wait for the given source to be registered in Redux store.
 *
 * @param {String} sourceId
 *                 The id of the source to be waiting for.
 */


async function waitForSourceToBeRegisteredInStore(sourceId) {
  return new Promise(resolve => {
    if ((0, _selectors.hasSource)(store.getState(), sourceId)) {
      resolve();
      return;
    }

    const unsubscribe = store.subscribe(check);
    let currentSize = null;

    function check() {
      const previousSize = currentSize;
      currentSize = (0, _selectors.getSourcesMap)(store.getState()).size; // For perf reason, avoid any extra computation if sources did not change

      if (previousSize == currentSize) {
        return;
      }

      if ((0, _selectors.hasSource)(store.getState(), sourceId)) {
        unsubscribe();
        resolve();
      }
    }
  });
} // Compute the reducer's source ID for a given source front/resource.
//
// We have four kind of "sources":
//   * "sources" in sources.js reducer, which map to 1 or many:
//   * "source actors" in source-actors.js reducer, which map 1 for 1 with:
//   * "SOURCE" resources coming from ResourceCommand API
//   * SourceFront, which are retrieved via `ThreadFront.source(sourceResource)`
//
// Note that SOURCE resources are actually the "form" of the SourceActor,
// with the addition of `resourceType` and `targetFront` attributes.
//
// Unfortunately, the debugger frontend interacts with these 4 type of objects.
// The last three actually try to represent the exact same thing.
//
// Here this method received a SOURCE resource (the 3rd bullet point)


function makeSourceId(sourceResource) {
  // Allows Jest to use custom, simplier IDs
  if ("mockedJestID" in sourceResource) {
    return sourceResource.mockedJestID;
  } // By default, within a given target, all sources will be grouped by URL.
  // You will be having a unique Source object in sources.js reducer,
  // while you might have many Source Actor objects in source-actors.js reducer.
  //
  // There is two distinct usecases here:
  // * HTML pages, which will have one source object which represents the whole HTML page
  //   and it will relate to many source actors. One for each inline <script> tag.
  //   Each script tag's source actor will actually return the whole content of the html page
  //   and not only this one script tag content.
  // * Scripts with the same URL injected many times.
  //   For example, two <script src=""> with the same location
  //   Or by using eval("...// # SourceURL=")
  //   All the scripts will be grouped under a unique Source object, while having dedicated
  //   Source Actor objects.
  //   An important point this time is that each actor may have a different source text content.
  //   For now, the debugger arbitrarily picks the first source actor's text content and never
  //   updates it. (See bug 1751063)


  if (sourceResource.url) {
    return `source-url-${sourceResource.url}`;
  } // Otherwise, we are processing a source without URL.
  // This is typically evals, console evaluations, setTimeout/setInterval strings,
  // DOM event handler strings (i.e. `<div onclick="foo">`), ...
  // The main way to interact with them is to use a debugger statement from them,
  // or have other panels ask the debugger to open them (like DOM event handlers from the inspector).
  // We can register transient breakpoints against them (i.e. they will only apply to the current source actor instance)


  return `source-actor-${sourceResource.actor}`;
}
/**
 * Create the source object for a generated source that is stored in sources.js reducer.
 * These generated sources relate to JS code which run in the
 * debugged runtime (as oppose to original sources
 * which are only available in debugger's environment).
 *
 * @param {SOURCE} sourceResource
 *        SOURCE resource coming from the ResourceCommand API.
 *        This represents the `SourceActor` from the server codebase.
 */


function createGeneratedSource(sourceResource) {
  return createSourceObject({
    id: makeSourceId(sourceResource),
    url: sourceResource.url,
    extensionName: sourceResource.extensionName,
    isWasm: !!_prefs.features.wasm && sourceResource.introductionType === "wasm",
    isExtension: sourceResource.url && (0, _source.isUrlExtension)(sourceResource.url) || false,
    isHTML: !!sourceResource.isInlineSource
  });
}
/**
 * Create the source object that is stored in sources.js reducer.
 *
 * This is an internal helper to this module to ensure all sources have the same shape.
 * Do not use it outside of this module!
 */


function createSourceObject({
  id,
  url,
  extensionName = null,
  isWasm = false,
  isExtension = false,
  isPrettyPrinted = false,
  isOriginal = false,
  isHTML = false
}) {
  return {
    // The ID, computed by:
    // * `makeSourceId` for generated,
    // * `generatedToOriginalId` for both source map and pretty printed original,
    id,
    // Absolute URL for the source. This may be a fake URL for pretty printed sources
    url,
    // A (slightly tweaked) URL object to represent the source URL.
    // The URL object is augmented of a "group" attribute and some other standard attributes
    // are modified from their typical value. See getDisplayURL implementation.
    displayURL: (0, _getURL.getDisplayURL)(url, extensionName),
    // Only set for generated sources that are WebExtension sources.
    // This is especially useful to display the extension name for content scripts
    // that executes against the page we are debugging.
    extensionName,
    // Will be true if the source URL starts with moz-extension://,
    // which most likely means the source is a content script.
    // (Note that when debugging an add-on all generated sources will most likely have this flag set to true)
    isExtension,
    // True if WASM is enabled *and* the generated source is a WASM source
    isWasm,
    // True if this source is an HTML and relates to many sources actors,
    // one for each of its inline <script>
    isHTML,
    // True, if this is an original pretty printed source
    isPrettyPrinted,
    // True for source map original files, as well as pretty printed sources
    isOriginal
  };
}
/**
 * Create the source object for a source mapped original source that is stored in sources.js reducer.
 * These original sources referred to by source maps.
 * This isn't code that runs in the runtime, so it isn't associated with anything
 * on the server side. It is associated with a generated source for the related bundle file
 * which itself relates to an actual code that runs in the runtime.
 *
 * @param {String} id
 *        The ID of the source, computed by source map codebase.
 * @param {String} url
 *        The URL of the original source file.
 */


function createSourceMapOriginalSource(id, url) {
  return createSourceObject({
    id,
    url,
    isOriginal: true
  });
}
/**
 * Create the source object for a pretty printed original source that is stored in sources.js reducer.
 * These original pretty printed sources aren't code that run in the runtime,
 * so it isn't associated with anything on the server side.
 * It is associated with a generated source for the non-pretty-printed file
 * which itself relates to an actual code that runs in the runtime.
 *
 * @param {String} id
 *        The ID of the source, computed by pretty print.
 * @param {String} url
 *        The URL of the pretty-printed source file.
 *        This URL doesn't work. It is the URL of the non-pretty-printed file with ":formated" suffix.
 */


function createPrettyPrintOriginalSource(id, url) {
  return createSourceObject({
    id,
    url,
    isOriginal: true,
    isPrettyPrinted: true
  });
}
/**
 * Create the "source actor" object that is stored in source-actor.js reducer.
 * This will represent server's source actor in the reducer universe.
 *
 * @param {SOURCE} sourceResource
 *        SOURCE resource coming from the ResourceCommand API.
 *        This represents the `SourceActor` from the server codebase.
 * @param {Object} sourceObject
 *        Source object stored in redux, i.e. created via createSourceObject.
 */


function createSourceActor(sourceResource, sourceObject) {
  const actorId = sourceResource.actor;
  return {
    id: actorId,
    actor: actorId,
    // As sourceResource is only SourceActor's form and not the SourceFront,
    // we have to go through the target to retrieve the related ThreadActor's ID.
    thread: sourceResource.targetFront.getCachedFront("thread").actorID,
    // `source` is the reducer source ID
    source: makeSourceId(sourceResource),
    sourceObject,
    sourceMapBaseURL: sourceResource.sourceMapBaseURL,
    sourceMapURL: sourceResource.sourceMapURL,
    url: sourceResource.url,
    introductionType: sourceResource.introductionType
  };
}

async function createPause(thread, packet) {
  const frame = await createFrame(thread, packet.frame);
  return { ...packet,
    thread,
    frame
  };
}

function createThread(targetFront) {
  const name = targetFront.isTopLevel ? L10N.getStr("mainThread") : targetFront.name;
  return {
    actor: targetFront.targetForm.threadActor,
    url: targetFront.url,
    isTopLevel: targetFront.isTopLevel,
    targetType: targetFront.targetType,
    name,
    serviceWorkerStatus: targetFront.debuggerServiceWorkerStatus,
    isWebExtension: targetFront.isWebExtension,
    processID: targetFront.processID
  };
}
/**
 * Defines the shape of a breakpoint
 */


function createBreakpoint({
  id,
  thread,
  disabled = false,
  options = {},
  location,
  generatedLocation,
  text,
  originalText
}) {
  return {
    // The unique identifier (string) for the breakpoint, for details on its format and creation See `makeBreakpointId`
    id,
    // The thread actor id (string) which the source this breakpoint is created in belongs to
    thread,
    // This (boolean) specifies if the breakpoint is disabled or not
    disabled,
    // This (object) stores extra information about the breakpoint, which defines the type of the breakpoint (i.e conditional breakpoints, log points)
    // {
    //    condition: <Boolean>,
    //    logValue: <String>,
    //    hidden: <Boolean>
    // }
    options,
    // The location (object) information for the original source, for details on its format and structure See `makeBreakpointLocation`
    location,
    // The location (object) information for the generated source, for details on its format and structure See `makeBreakpointLocation`
    generatedLocation,
    // The text (string) on the line which the brekpoint is set in the generated source
    text,
    // The text (string) on the line which the breakpoint is set in the original source
    originalText
  };
}