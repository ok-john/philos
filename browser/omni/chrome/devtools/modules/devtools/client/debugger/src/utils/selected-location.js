"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSelectedLocation = getSelectedLocation;

var _index = require("devtools/client/shared/source-map-loader/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getSelectedLocation(mappedLocation, context) {
  if (!context) {
    return mappedLocation.location;
  }

  const sourceId = context.sourceId || context.id;
  return (0, _index.isOriginalId)(sourceId) ? mappedLocation.location : mappedLocation.generatedLocation;
}