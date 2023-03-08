"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleBlackBox = toggleBlackBox;
exports.blackBoxSources = blackBoxSources;

var _index = require("devtools/client/shared/source-map-loader/index");

loader.lazyRequireGetter(this, "_telemetry", "devtools/client/debugger/src/utils/telemetry");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_promise", "devtools/client/debugger/src/actions/utils/middleware/promise");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Redux actions for the sources state
 * @module actions/sources
 */
async function blackboxSourceActors(thunkArgs, sources, shouldBlackBox, ranges) {
  const {
    getState,
    client,
    sourceMapLoader
  } = thunkArgs;
  const blackboxSources = await Promise.all(sources.map(async source => {
    let sourceId = source.id; // If the source is the original, then get the source id of its generated file
    // and the range for where the original is represented in the generated file
    // (which might be a bundle including other files).

    if ((0, _index.isOriginalId)(source.id)) {
      sourceId = (0, _index.originalToGeneratedId)(source.id);
      const range = await sourceMapLoader.getFileGeneratedRange(source.id);
      ranges = [];

      if (range) {
        ranges.push(range); // TODO bug 1752108: Investigate blackboxing lines in original files,
        // there is likely to be issues as the whole genrated file
        // representing the original file will always be blackboxed.

        console.warn("The might be unxpected issues when ignoring lines in an original file. " + "The whole original source is being blackboxed.");
      }
    }

    for (const actor of (0, _selectors.getSourceActorsForSource)(getState(), sourceId)) {
      await client.blackBox(actor, shouldBlackBox, ranges);
    }

    return {
      source,
      shouldBlackBox,
      ranges
    };
  }));

  if (shouldBlackBox) {
    (0, _telemetry.recordEvent)("blackbox");
  }

  return {
    blackboxSources
  };
}
/**
 * Toggle blackboxing for the whole source or for specific lines in a source
 *
 * @param {Object} cx
 * @param {Object} source - The source to be blackboxed/unblackboxed.
 * @param {Boolean} [shouldBlackBox] - Specifies if the source should be blackboxed (true
 *                                     or unblackboxed (false). When this is not provided
 *                                     option is decided based on the blackboxed state
 *                                     of the source.
 * @param {Array} [ranges] - List of line/column offsets to blackbox, these
 *                           are provided only when blackboxing lines.
 *                           The range structure:
 *                           const range = {
 *                            start: { line: 1, column: 5 },
 *                            end: { line: 3, column: 4 },
 *                           }
 */


function toggleBlackBox(cx, source, shouldBlackBox, ranges) {
  return async thunkArgs => {
    const {
      dispatch,
      getState
    } = thunkArgs;
    shouldBlackBox = typeof shouldBlackBox == "boolean" ? shouldBlackBox : !(0, _selectors.isSourceBlackBoxed)(getState(), source);
    return dispatch({
      type: "BLACKBOX",
      cx,
      [_promise.PROMISE]: blackboxSourceActors(thunkArgs, [source], shouldBlackBox, ranges ? ranges : [])
    });
  };
}
/*
 * Blackboxes a group of sources together
 *
 * @param {Object} cx
 * @param {Array} sourcesToBlackBox - The list of sources to blackbox
 * @param {Boolean} shouldBlackbox - Specifies if the sources should blackboxed (true)
 *                                   or unblackboxed (false).
 */


function blackBoxSources(cx, sourcesToBlackBox, shouldBlackBox) {
  return async thunkArgs => {
    const {
      dispatch,
      getState
    } = thunkArgs;
    const sources = sourcesToBlackBox.filter(source => (0, _selectors.isSourceBlackBoxed)(getState(), source) !== shouldBlackBox);
    return dispatch({
      type: "BLACKBOX",
      cx,
      [_promise.PROMISE]: blackboxSourceActors(thunkArgs, sources, shouldBlackBox, [])
    });
  };
}