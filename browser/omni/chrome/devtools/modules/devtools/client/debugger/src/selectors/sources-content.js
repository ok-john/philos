"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSourceTextContent = getSourceTextContent;
exports.getSettledSourceTextContent = getSettledSourceTextContent;
exports.getSelectedSourceTextContent = getSelectedSourceTextContent;
exports.getSourcesEpoch = getSourcesEpoch;
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/selectors/sources");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getSourceTextContent(state, location) {
  let {
    sourceId,
    sourceActorId
  } = location;
  const source = (0, _sources.getSource)(state, sourceId);

  if (!source) {
    return null;
  }

  if (source.isOriginal) {
    return state.sourcesContent.mutableOriginalSourceTextContentMap.get(sourceId);
  }

  if (!sourceActorId) {
    const sourceActor = (0, _sources.getFirstSourceActorForGeneratedSource)(state, sourceId);
    sourceActorId = sourceActor.actor;
  }

  return state.sourcesContent.mutableGeneratedSourceTextContentMap.get(sourceActorId);
}

function getSettledSourceTextContent(state, location) {
  const content = getSourceTextContent(state, location);
  return (0, _asyncValue.asSettled)(content);
}

function getSelectedSourceTextContent(state) {
  const location = (0, _sources.getSelectedLocation)(state);

  if (!location) {
    return null;
  }

  return getSourceTextContent(state, location);
}

function getSourcesEpoch(state) {
  return state.sourcesContent.epoch;
}