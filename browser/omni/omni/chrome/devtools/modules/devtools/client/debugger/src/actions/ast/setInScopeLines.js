"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setInScopeLines = setInScopeLines;
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getOutOfScopeLines(outOfScopeLocations) {
  if (!outOfScopeLocations) {
    return null;
  }

  const uniqueLines = new Set();

  for (const location of outOfScopeLocations) {
    for (let i = location.start.line; i < location.end.line; i++) {
      uniqueLines.add(i);
    }
  }

  return uniqueLines;
}

async function getInScopeLines(cx, location, {
  dispatch,
  getState,
  parserWorker
}) {
  const source = (0, _selectors.getLocationSource)(getState(), location);
  const sourceTextContent = (0, _selectors.getSourceTextContent)(getState(), location);
  let locations = null;

  if (location.line && source && !source.isWasm) {
    locations = await parserWorker.findOutOfScopeLocations(source.id, location);
  }

  const linesOutOfScope = getOutOfScopeLines(locations);
  const sourceNumLines = !sourceTextContent || !(0, _asyncValue.isFulfilled)(sourceTextContent) ? 0 : (0, _source.getSourceLineCount)(sourceTextContent.value);
  const noLinesOutOfScope = linesOutOfScope == null || linesOutOfScope.size == 0; // This operation can be very costly for large files so we sacrifice a bit of readability
  // for performance sake.
  // We initialize an array with a fixed size and we'll directly assign value for lines
  // that are not out of scope. This is much faster than having an empty array and pushing
  // into it.

  const sourceLines = new Array(sourceNumLines);

  for (let i = 0; i < sourceNumLines; i++) {
    const line = i + 1;

    if (noLinesOutOfScope || !linesOutOfScope.has(line)) {
      sourceLines[i] = line;
    }
  } // Finally we need to remove any undefined values, i.e. the ones that were matching
  // out of scope lines.


  return sourceLines.filter(i => i != undefined);
}

function setInScopeLines(cx) {
  return async thunkArgs => {
    const {
      getState,
      dispatch
    } = thunkArgs;
    const visibleFrame = (0, _selectors.getVisibleSelectedFrame)(getState());

    if (!visibleFrame) {
      return;
    }

    const {
      location
    } = visibleFrame;
    const sourceTextContent = (0, _selectors.getSourceTextContent)(getState(), location);

    if ((0, _selectors.hasInScopeLines)(getState(), location) || !sourceTextContent) {
      return;
    }

    const lines = await getInScopeLines(cx, location, thunkArgs);
    dispatch({
      type: "IN_SCOPE_LINES",
      cx,
      location,
      lines
    });
  };
}