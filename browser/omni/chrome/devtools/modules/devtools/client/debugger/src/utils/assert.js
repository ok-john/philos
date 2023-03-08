"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = assert;
loader.lazyRequireGetter(this, "_environment", "devtools/client/debugger/src/utils/environment");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function assert(condition, message) {
  if ((0, _environment.isNodeTest)() && !condition) {
    throw new Error(`Assertion failure: ${message}`);
  }
}