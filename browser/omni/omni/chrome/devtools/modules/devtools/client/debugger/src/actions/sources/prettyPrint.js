"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prettyPrintSource = prettyPrintSource;
exports.createPrettySource = createPrettySource;
exports.togglePrettyPrint = togglePrettyPrint;

var _index = require("devtools/client/shared/source-map-loader/index");

var _assert = _interopRequireDefault(require("../../utils/assert"));

loader.lazyRequireGetter(this, "_telemetry", "devtools/client/debugger/src/utils/telemetry");
loader.lazyRequireGetter(this, "_breakpoints", "devtools/client/debugger/src/actions/breakpoints/index");
loader.lazyRequireGetter(this, "_symbols", "devtools/client/debugger/src/actions/sources/symbols");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");
loader.lazyRequireGetter(this, "_loadSourceText", "devtools/client/debugger/src/actions/sources/loadSourceText");
loader.lazyRequireGetter(this, "_pause", "devtools/client/debugger/src/actions/pause/index");
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/actions/sources/index");
loader.lazyRequireGetter(this, "_create", "devtools/client/debugger/src/client/firefox/create");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_select", "devtools/client/debugger/src/actions/sources/select");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getPrettyOriginalSourceURL(generatedSource) {
  return (0, _source.getPrettySourceURL)(generatedSource.url || generatedSource.id);
}

async function prettyPrintSource(sourceMapLoader, prettyPrintWorker, generatedSource, content, actors) {
  if (!content || !(0, _asyncValue.isFulfilled)(content)) {
    throw new Error("Cannot pretty-print a file that has not loaded");
  }

  const contentValue = content.value;

  if (!(0, _source.isJavaScript)(generatedSource, contentValue) || contentValue.type !== "text") {
    throw new Error("Can't prettify non-javascript files.");
  }

  const url = getPrettyOriginalSourceURL(generatedSource);
  const {
    code,
    sourceMap
  } = await prettyPrintWorker.prettyPrint({
    text: contentValue.value,
    url
  }); // The source map URL service used by other devtools listens to changes to
  // sources based on their actor IDs, so apply the sourceMap there too.

  const generatedSourceIds = [generatedSource.id, ...actors.map(item => item.actor)];
  await sourceMapLoader.setSourceMapForGeneratedSources(generatedSourceIds, sourceMap);
  return {
    text: code,
    contentType: "text/javascript"
  };
}

function createPrettySource(cx, sourceId) {
  return async ({
    dispatch,
    getState
  }) => {
    const source = (0, _selectors.getSourceFromId)(getState(), sourceId);
    const url = getPrettyOriginalSourceURL(source);
    const id = (0, _index.generatedToOriginalId)(sourceId, url);
    const prettySource = (0, _create.createPrettyPrintOriginalSource)(id, url);
    dispatch({
      type: "ADD_ORIGINAL_SOURCES",
      cx,
      originalSources: [prettySource]
    });
    await dispatch((0, _select.selectSource)(cx, id));
    return prettySource;
  };
}

function selectPrettyLocation(cx, prettySource, generatedLocation) {
  return async ({
    dispatch,
    sourceMapLoader,
    getState
  }) => {
    let location = generatedLocation ? generatedLocation : (0, _selectors.getSelectedLocation)(getState());

    if (location && location.line >= 1) {
      location = await sourceMapLoader.getOriginalLocation(location);
      return dispatch((0, _sources.selectSpecificLocation)(cx, { ...location,
        sourceId: prettySource.id
      }));
    }

    return dispatch((0, _select.selectSource)(cx, prettySource.id));
  };
}
/**
 * Toggle the pretty printing of a source's text. All subsequent calls to
 * |getText| will return the pretty-toggled text. Nothing will happen for
 * non-javascript files.
 *
 * @memberof actions/sources
 * @static
 * @param string id The source form from the RDP.
 * @returns Promise
 *          A promise that resolves to [aSource, prettyText] or rejects to
 *          [aSource, error].
 */


function togglePrettyPrint(cx, sourceId) {
  return async ({
    dispatch,
    getState
  }) => {
    const source = (0, _selectors.getSource)(getState(), sourceId);

    if (!source) {
      return {};
    }

    if (!source.isPrettyPrinted) {
      (0, _telemetry.recordEvent)("pretty_print");
    }

    (0, _assert.default)((0, _source.isGenerated)(source), "Pretty-printing only allowed on generated sources");
    const sourceActor = (0, _selectors.getFirstSourceActorForGeneratedSource)(getState(), source.id);
    await dispatch((0, _loadSourceText.loadGeneratedSourceText)({
      cx,
      sourceActor
    }));
    const url = (0, _source.getPrettySourceURL)(source.url);
    const prettySource = (0, _selectors.getSourceByURL)(getState(), url);

    if (prettySource) {
      return dispatch(selectPrettyLocation(cx, prettySource));
    }

    const selectedLocation = (0, _selectors.getSelectedLocation)(getState());
    const newPrettySource = await dispatch(createPrettySource(cx, sourceId));
    await dispatch(selectPrettyLocation(cx, newPrettySource, selectedLocation));
    const threadcx = (0, _selectors.getThreadContext)(getState());
    await dispatch((0, _pause.mapFrames)(threadcx));
    await dispatch((0, _symbols.setSymbols)({
      cx,
      source: newPrettySource,
      sourceActor
    }));
    await dispatch((0, _breakpoints.updateBreakpointsForNewPrettyPrintedSource)(cx, sourceId));
    return newPrettySource;
  };
}