"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateFrameLocation = updateFrameLocation;
exports.mapFrames = mapFrames;
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");

var _assert = _interopRequireDefault(require("../../utils/assert"));

var _index = require("devtools/client/shared/source-map-loader/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getSelectedFrameId(state, thread, frames) {
  var _selectedFrame;

  let selectedFrame = (0, _selectors.getSelectedFrame)(state, thread);
  const blackboxedRanges = (0, _selectors.getBlackBoxRanges)(state);

  if (selectedFrame && !(0, _source.isFrameBlackBoxed)(selectedFrame, (0, _selectors.getLocationSource)(state, selectedFrame.location), blackboxedRanges)) {
    return selectedFrame.id;
  }

  selectedFrame = frames.find(frame => {
    const frameSource = (0, _selectors.getLocationSource)(state, frame.location);
    return !(0, _source.isFrameBlackBoxed)(frame, frameSource, blackboxedRanges);
  });
  return (_selectedFrame = selectedFrame) === null || _selectedFrame === void 0 ? void 0 : _selectedFrame.id;
}

function updateFrameLocation(frame, sourceMapLoader) {
  if (frame.isOriginal) {
    return Promise.resolve(frame);
  }

  return sourceMapLoader.getOriginalLocation(frame.location).then(loc => ({ ...frame,
    location: loc,
    generatedLocation: frame.generatedLocation || frame.location
  }));
}

function updateFrameLocations(frames, sourceMapLoader) {
  if (!frames || !frames.length) {
    return Promise.resolve(frames);
  }

  return Promise.all(frames.map(frame => updateFrameLocation(frame, sourceMapLoader)));
}

function isWasmOriginalSourceFrame(frame, getState) {
  if ((0, _index.isGeneratedId)(frame.location.sourceId)) {
    return false;
  }

  const generatedSource = (0, _selectors.getLocationSource)(getState(), frame.generatedLocation);
  return Boolean(generatedSource === null || generatedSource === void 0 ? void 0 : generatedSource.isWasm);
}

async function expandFrames(frames, sourceMapLoader, getState) {
  const result = [];

  for (let i = 0; i < frames.length; ++i) {
    const frame = frames[i];

    if (frame.isOriginal || !isWasmOriginalSourceFrame(frame, getState)) {
      result.push(frame);
      continue;
    }

    const originalFrames = await sourceMapLoader.getOriginalStackFrames(frame.generatedLocation);

    if (!originalFrames) {
      result.push(frame);
      continue;
    }

    (0, _assert.default)(!!originalFrames.length, "Expected at least one original frame"); // First entry has not specific location -- use one from original frame.

    originalFrames[0] = { ...originalFrames[0],
      location: frame.location
    };
    originalFrames.forEach((originalFrame, j) => {
      if (!originalFrame.location) {
        return;
      } // Keep outer most frame with true actor ID, and generate uniquie
      // one for the nested frames.


      const id = j == 0 ? frame.id : `${frame.id}-originalFrame${j}`;
      result.push({
        id,
        displayName: originalFrame.displayName,
        location: originalFrame.location,
        index: frame.index,
        source: null,
        thread: frame.thread,
        scope: frame.scope,
        this: frame.this,
        isOriginal: true,
        // More fields that will be added by the mapDisplayNames and
        // updateFrameLocation.
        generatedLocation: frame.generatedLocation,
        originalDisplayName: originalFrame.displayName,
        originalVariables: originalFrame.variables,
        asyncCause: frame.asyncCause,
        state: frame.state
      });
    });
  }

  return result;
}
/**
 * Map call stack frame locations and display names to originals.
 * e.g.
 * 1. When the debuggee pauses
 * 2. When a source is pretty printed
 * 3. When symbols are loaded
 * @memberof actions/pause
 * @static
 */


function mapFrames(cx) {
  return async function (thunkArgs) {
    const {
      dispatch,
      getState,
      sourceMapLoader
    } = thunkArgs;
    const frames = (0, _selectors.getFrames)(getState(), cx.thread);

    if (!frames) {
      return;
    }

    let mappedFrames = await updateFrameLocations(frames, sourceMapLoader);
    mappedFrames = await expandFrames(mappedFrames, sourceMapLoader, getState);
    const selectedFrameId = getSelectedFrameId(getState(), cx.thread, mappedFrames);
    dispatch({
      type: "MAP_FRAMES",
      cx,
      thread: cx.thread,
      frames: mappedFrames,
      selectedFrameId
    });
  };
}