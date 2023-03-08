"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasSource = hasSource;
exports.getSource = getSource;
exports.getSourceFromId = getSourceFromId;
exports.getLocationSource = getLocationSource;
exports.getSourceByActorId = getSourceByActorId;
exports.getSourceByURL = getSourceByURL;
exports.getSpecificSourceByURL = getSpecificSourceByURL;
exports.getGeneratedSourceByURL = getGeneratedSourceByURL;
exports.getGeneratedSource = getGeneratedSource;
exports.getPendingSelectedLocation = getPendingSelectedLocation;
exports.getPrettySource = getPrettySource;
exports.getSourcesMap = getSourcesMap;
exports.getSourceCount = getSourceCount;
exports.getSelectedLocation = getSelectedLocation;
exports.getSelectedSourceId = getSelectedSourceId;
exports.getFirstSourceActorForGeneratedSource = getFirstSourceActorForGeneratedSource;
exports.getSourceActorsForSource = getSourceActorsForSource;
exports.isSourceWithMap = isSourceWithMap;
exports.canPrettyPrintSource = canPrettyPrintSource;
exports.getPrettyPrintMessage = getPrettyPrintMessage;
exports.getBreakpointPositions = getBreakpointPositions;
exports.getBreakpointPositionsForSource = getBreakpointPositionsForSource;
exports.hasBreakpointPositions = hasBreakpointPositions;
exports.getBreakpointPositionsForLine = getBreakpointPositionsForLine;
exports.getBreakpointPositionsForLocation = getBreakpointPositionsForLocation;
exports.getBreakableLines = getBreakableLines;
exports.getSelectedBreakableLines = exports.getSelectedSource = exports.getSourceList = void 0;

var _reselect = require("devtools/client/shared/vendor/reselect");

loader.lazyRequireGetter(this, "_shallowEqual", "devtools/client/debugger/src/utils/shallow-equal");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_breakpointPositions", "devtools/client/debugger/src/utils/breakpoint/breakpointPositions");
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");

var _index = require("devtools/client/shared/source-map-loader/index");

loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_sourceActors", "devtools/client/debugger/src/selectors/source-actors");
loader.lazyRequireGetter(this, "_sourcesContent", "devtools/client/debugger/src/selectors/sources-content");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function hasSource(state, id) {
  return state.sources.sources.has(id);
}

function getSource(state, id) {
  return state.sources.sources.get(id);
}

function getSourceFromId(state, id) {
  const source = getSource(state, id);

  if (!source) {
    console.warn(`source ${id} does not exist`);
  }

  return source;
}

function getLocationSource(state, location) {
  return getSource(state, location.sourceId);
}

function getSourceByActorId(state, actorId) {
  if (!(0, _sourceActors.hasSourceActor)(state, actorId)) {
    return null;
  }

  return getSource(state, (0, _sourceActors.getSourceActor)(state, actorId).source);
}

function getSourcesByURL(state, url) {
  const urls = getUrls(state);

  if (!url || !urls[url]) {
    return [];
  }

  return urls[url].map(id => getSource(state, id));
}

function getSourceByURL(state, url) {
  const foundSources = getSourcesByURL(state, url);
  return foundSources ? foundSources[0] : null;
} // This is used by tabs selectors


function getSpecificSourceByURL(state, url, isOriginal) {
  const foundSources = getSourcesByURL(state, url);

  if (foundSources) {
    return foundSources.find(source => source.isOriginal == isOriginal);
  }

  return null;
}

function getOriginalSourceByURL(state, url) {
  return getSpecificSourceByURL(state, url, true);
}

function getGeneratedSourceByURL(state, url) {
  return getSpecificSourceByURL(state, url, false);
}

function getGeneratedSource(state, source) {
  if (!source) {
    return null;
  }

  if ((0, _source.isGenerated)(source)) {
    return source;
  }

  return getSourceFromId(state, (0, _index.originalToGeneratedId)(source.id));
}

function getPendingSelectedLocation(state) {
  return state.sources.pendingSelectedLocation;
}

function getPrettySource(state, id) {
  if (!id) {
    return null;
  }

  const source = getSource(state, id);

  if (!source) {
    return null;
  }

  return getOriginalSourceByURL(state, (0, _source.getPrettySourceURL)(source.url));
} // This is only used externaly by tabs and breakpointSources selectors


function getSourcesMap(state) {
  return state.sources.sources;
}

function getUrls(state) {
  return state.sources.urls;
}

const getSourceList = (0, _reselect.createSelector)(getSourcesMap, sourcesMap => {
  return [...sourcesMap.values()];
}, {
  equalityCheck: _shallowEqual.shallowEqual,
  resultEqualityCheck: _shallowEqual.shallowEqual
}); // This is only used by tests

exports.getSourceList = getSourceList;

function getSourceCount(state) {
  return getSourcesMap(state).size;
}

function getSelectedLocation(state) {
  return state.sources.selectedLocation;
}

const getSelectedSource = (0, _reselect.createSelector)(getSelectedLocation, getSourcesMap, (selectedLocation, sourcesMap) => {
  if (!selectedLocation) {
    return undefined;
  }

  return sourcesMap.get(selectedLocation.sourceId);
}); // This is used by tests and pause reducers

exports.getSelectedSource = getSelectedSource;

function getSelectedSourceId(state) {
  const source = getSelectedSource(state);
  return source === null || source === void 0 ? void 0 : source.id;
}
/**
 * Gets the first source actor for the source and/or thread
 * provided.
 *
 * @param {Object} state
 * @param {String} sourceId
 *         The source used
 * @param {String} [threadId]
 *         The thread to check, this is optional.
 * @param {Object} sourceActor
 *
 */


function getFirstSourceActorForGeneratedSource(state, sourceId, threadId) {
  let source = getSource(state, sourceId);

  if (source.isOriginal) {
    source = getSource(state, (0, _index.originalToGeneratedId)(source.id));
  }

  let actorsInfo = state.sources.actors[source.id];

  if (!actorsInfo || !actorsInfo.length) {
    return null;
  }

  if (threadId) {
    actorsInfo = actorsInfo.filter(actorInfo => actorInfo.thread == threadId);
  }

  return actorsInfo.length ? (0, _sourceActors.getSourceActor)(state, actorsInfo[0].id) : null;
}
/**
 * Get the source actor of the source
 *
 * @param {Object} state
 * @param {String} id
 *        The source id
 * @return {Array<Object>}
 *         List of source actors
 */


function getSourceActorsForSource(state, id) {
  const actorsInfo = state.sources.actors[id];

  if (!actorsInfo) {
    return [];
  }

  return actorsInfo.map(actorInfo => (0, _sourceActors.getSourceActor)(state, actorInfo.id)).filter(actor => !!actor);
}

function isSourceWithMap(state, id) {
  return getSourceActorsForSource(state, id).some(sourceActor => sourceActor.sourceMapURL);
}

function canPrettyPrintSource(state, location) {
  const {
    sourceId
  } = location;
  const source = getSource(state, sourceId);

  if (!source || (0, _source.isPretty)(source) || source.isOriginal || _prefs.prefs.clientSourceMapsEnabled && isSourceWithMap(state, sourceId)) {
    return false;
  }

  const content = (0, _sourcesContent.getSourceTextContent)(state, location);
  const sourceContent = content && (0, _asyncValue.isFulfilled)(content) ? content.value : null;

  if (!sourceContent || !(0, _source.isJavaScript)(source, sourceContent)) {
    return false;
  }

  return true;
}

function getPrettyPrintMessage(state, location) {
  const source = getSource(state, location.sourceId);

  if (!source) {
    return L10N.getStr("sourceTabs.prettyPrint");
  }

  if ((0, _source.isPretty)(source)) {
    return L10N.getStr("sourceFooter.prettyPrint.isPrettyPrintedMessage");
  }

  if (source.isOriginal) {
    return L10N.getStr("sourceFooter.prettyPrint.isOriginalMessage");
  }

  if (_prefs.prefs.clientSourceMapsEnabled && isSourceWithMap(state, source.id)) {
    return L10N.getStr("sourceFooter.prettyPrint.hasSourceMapMessage");
  }

  const content = (0, _sourcesContent.getSourceTextContent)(state, location);
  const sourceContent = content && (0, _asyncValue.isFulfilled)(content) ? content.value : null;

  if (!sourceContent) {
    return L10N.getStr("sourceFooter.prettyPrint.noContentMessage");
  }

  if (!(0, _source.isJavaScript)(source, sourceContent)) {
    return L10N.getStr("sourceFooter.prettyPrint.isNotJavascriptMessage");
  }

  return L10N.getStr("sourceTabs.prettyPrint");
} // Used by visibleColumnBreakpoints selectors


function getBreakpointPositions(state) {
  return state.sources.breakpointPositions;
}

function getBreakpointPositionsForSource(state, sourceId) {
  const positions = getBreakpointPositions(state);
  return positions === null || positions === void 0 ? void 0 : positions[sourceId];
} // This is only used by one test


function hasBreakpointPositions(state, sourceId) {
  return !!getBreakpointPositionsForSource(state, sourceId);
}

function getBreakpointPositionsForLine(state, sourceId, line) {
  const positions = getBreakpointPositionsForSource(state, sourceId);
  return positions === null || positions === void 0 ? void 0 : positions[line];
}

function getBreakpointPositionsForLocation(state, location) {
  const {
    sourceId
  } = location;
  const positions = getBreakpointPositionsForSource(state, sourceId);
  return (0, _breakpointPositions.findPosition)(positions, location);
}

function getBreakableLines(state, sourceId) {
  if (!sourceId) {
    return null;
  }

  const source = getSource(state, sourceId);

  if (!source) {
    return null;
  }

  if (source.isOriginal) {
    return state.sources.breakableLines[sourceId];
  }

  const sourceActorsInfo = state.sources.actors[sourceId];

  if (!(sourceActorsInfo === null || sourceActorsInfo === void 0 ? void 0 : sourceActorsInfo.length)) {
    return null;
  } // We pull generated file breakable lines directly from the source actors
  // so that breakable lines can be added as new source actors on HTML loads.


  return (0, _sourceActors.getBreakableLinesForSourceActors)(state, sourceActorsInfo.map(actorInfo => actorInfo.id), source.isHTML);
}

const getSelectedBreakableLines = (0, _reselect.createSelector)(state => {
  const sourceId = getSelectedSourceId(state);
  return sourceId && getBreakableLines(state, sourceId);
}, breakableLines => new Set(breakableLines || []));
exports.getSelectedBreakableLines = getSelectedBreakableLines;