"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.comparePosition = comparePosition;
exports.createLocation = createLocation;
exports.sortSelectedLocations = sortSelectedLocations;
loader.lazyRequireGetter(this, "_selectedLocation", "devtools/client/debugger/src/utils/selected-location");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function comparePosition(a, b) {
  return a && b && a.line == b.line && a.column == b.column;
}

function createLocation({
  sourceId,
  // Line 0 represents no specific line chosen for action
  line = 0,
  column,
  sourceUrl = "",
  sourceActorId = null
}) {
  return {
    sourceId,
    line,
    column,
    sourceUrl,
    sourceActorId
  };
}

function sortSelectedLocations(locations, selectedSource) {
  return Array.from(locations).sort((locationA, locationB) => {
    const aSelected = (0, _selectedLocation.getSelectedLocation)(locationA, selectedSource);
    const bSelected = (0, _selectedLocation.getSelectedLocation)(locationB, selectedSource); // Order the locations by line number…

    if (aSelected.line < bSelected.line) {
      return -1;
    }

    if (aSelected.line > bSelected.line) {
      return 1;
    } // … and if we have the same line, we want to return location with undefined columns
    // first, and then order them by column


    if (aSelected.column == bSelected.column) {
      return 0;
    }

    if (aSelected.column === undefined) {
      return -1;
    }

    if (bSelected.column === undefined) {
      return 1;
    }

    return aSelected.column < bSelected.column ? -1 : 1;
  });
}