"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadSourceText = loadSourceText;
exports.loadOriginalSourceText = exports.loadGeneratedSourceText = void 0;
loader.lazyRequireGetter(this, "_promise", "devtools/client/debugger/src/actions/utils/middleware/promise");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_breakpoints", "devtools/client/debugger/src/actions/breakpoints/index");
loader.lazyRequireGetter(this, "_prettyPrint", "devtools/client/debugger/src/actions/sources/prettyPrint");
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_memoizableAction", "devtools/client/debugger/src/utils/memoizableAction");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
async function loadGeneratedSource(state, sourceActor, client) {
  // If no source actor can be found then the text for the
  // source cannot be loaded.
  if (!sourceActor) {
    throw new Error("Source actor is null or not defined");
  }

  let response;

  try {
    response = await client.sourceContents(sourceActor);
  } catch (e) {
    throw new Error(`sourceContents failed: ${e}`);
  }

  return {
    text: response.source,
    contentType: response.contentType || "text/javascript"
  };
}

async function loadOriginalSource(state, source, client, sourceMapLoader, prettyPrintWorker) {
  if ((0, _source.isPretty)(source)) {
    const generatedSource = (0, _selectors.getGeneratedSource)(state, source);

    if (!generatedSource) {
      throw new Error("Unable to find minified original.");
    }

    const content = (0, _selectors.getSettledSourceTextContent)(state, (0, _location.createLocation)({
      sourceId: generatedSource.id
    }));
    return (0, _prettyPrint.prettyPrintSource)(sourceMapLoader, prettyPrintWorker, generatedSource, content, (0, _selectors.getSourceActorsForSource)(state, generatedSource.id));
  }

  const result = await sourceMapLoader.getOriginalSourceText(source.id);

  if (!result) {
    // The way we currently try to load and select a pending
    // selected location, it is possible that we will try to fetch the
    // original source text right after the source map has been cleared
    // after a navigation event.
    throw new Error("Original source text unavailable");
  }

  return result;
}

async function loadGeneratedSourceTextPromise(cx, sourceActor, {
  dispatch,
  getState,
  client,
  parserWorker
}) {
  const epoch = (0, _selectors.getSourcesEpoch)(getState());
  await dispatch({
    type: "LOAD_GENERATED_SOURCE_TEXT",
    sourceActorId: sourceActor.actor,
    epoch,
    [_promise.PROMISE]: loadGeneratedSource(getState(), sourceActor, client)
  });
  await setParserAndBreakpointsTextContent(cx, sourceActor.source, sourceActor.actor, {
    state: getState(),
    parserWorker,
    dispatch
  });
}

async function loadOriginalSourceTextPromise(cx, source, {
  dispatch,
  getState,
  client,
  sourceMapLoader,
  parserWorker,
  prettyPrintWorker
}) {
  const epoch = (0, _selectors.getSourcesEpoch)(getState());
  await dispatch({
    type: "LOAD_ORIGINAL_SOURCE_TEXT",
    sourceId: source.id,
    epoch,
    [_promise.PROMISE]: loadOriginalSource(getState(), source, client, sourceMapLoader, prettyPrintWorker)
  });
  await setParserAndBreakpointsTextContent(cx, source.id, null, {
    state: getState(),
    parserWorker,
    dispatch
  });
}

async function setParserAndBreakpointsTextContent(cx, sourceId, sourceActorId, {
  dispatch,
  state,
  parserWorker
}) {
  const source = (0, _selectors.getSource)(state, sourceId);

  if (!source) {
    return;
  }

  const content = (0, _selectors.getSettledSourceTextContent)(state, (0, _location.createLocation)({
    sourceId: source.id,
    sourceActorId
  }));

  if (!source.isWasm && content) {
    parserWorker.setSource(source.id, (0, _asyncValue.isFulfilled)(content) ? content.value : {
      type: "text",
      value: "",
      contentType: undefined
    }); // Update the text in any breakpoints for this source by re-adding them.

    const breakpoints = (0, _selectors.getBreakpointsForSource)(state, source.id);

    for (const {
      location,
      options,
      disabled
    } of breakpoints) {
      await dispatch((0, _breakpoints.addBreakpoint)(cx, location, options, disabled));
    }
  }
}
/**
 * Loads the source text for the generated source based of the source actor
 * @param {Object} sourceActor
 *                 There can be more than one source actor per source
 *                 so the source actor needs to be specified. This is
 *                 required for generated sources but will be null for
 *                 original/pretty printed sources.
 */


const loadGeneratedSourceText = (0, _memoizableAction.memoizeableAction)("loadGeneratedSourceText", {
  getValue: ({
    sourceActor
  }, {
    getState
  }) => {
    if (!sourceActor) {
      return null;
    }

    const sourceTextContent = (0, _selectors.getSourceTextContent)(getState(), (0, _location.createLocation)({
      sourceId: sourceActor.source,
      sourceActorId: sourceActor.actor
    }));

    if (!sourceTextContent || sourceTextContent.state === "pending") {
      return sourceTextContent;
    } // This currently swallows source-load-failure since we return fulfilled
    // here when content.state === "rejected". In an ideal world we should
    // propagate that error upward.


    return (0, _asyncValue.fulfilled)(sourceTextContent);
  },
  createKey: ({
    sourceActor
  }, {
    getState
  }) => {
    const epoch = (0, _selectors.getSourcesEpoch)(getState());
    return `${epoch}:${sourceActor.actor}`;
  },
  action: ({
    cx,
    sourceActor
  }, thunkArgs) => loadGeneratedSourceTextPromise(cx, sourceActor, thunkArgs)
});
/**
 * Loads the source text for an original source and source actor
 * @param {Object} source
 *                 The original source to load the source text
 */

exports.loadGeneratedSourceText = loadGeneratedSourceText;
const loadOriginalSourceText = (0, _memoizableAction.memoizeableAction)("loadOriginalSourceText", {
  getValue: ({
    source
  }, {
    getState
  }) => {
    if (!source) {
      return null;
    }

    const sourceTextContent = (0, _selectors.getSourceTextContent)(getState(), (0, _location.createLocation)({
      sourceId: source.id
    }));

    if (!sourceTextContent || sourceTextContent.state === "pending") {
      return sourceTextContent;
    } // This currently swallows source-load-failure since we return fulfilled
    // here when content.state === "rejected". In an ideal world we should
    // propagate that error upward.


    return (0, _asyncValue.fulfilled)(sourceTextContent);
  },
  createKey: ({
    source
  }, {
    getState
  }) => {
    const epoch = (0, _selectors.getSourcesEpoch)(getState());
    return `${epoch}:${source.id}`;
  },
  action: ({
    cx,
    source
  }, thunkArgs) => loadOriginalSourceTextPromise(cx, source, thunkArgs)
});
exports.loadOriginalSourceText = loadOriginalSourceText;

function loadSourceText(cx, source, sourceActor) {
  return async ({
    dispatch,
    getState
  }) => {
    if (!source) {
      return null;
    }

    if (source.isOriginal) {
      return dispatch(loadOriginalSourceText({
        cx,
        source
      }));
    }

    if (!sourceActor) {
      sourceActor = (0, _selectors.getFirstSourceActorForGeneratedSource)(getState(), source.id, source.thread);
    }

    return dispatch(loadGeneratedSourceText({
      cx,
      sourceActor
    }));
  };
}