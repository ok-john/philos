"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addTarget = addTarget;
exports.removeTarget = removeTarget;
exports.toggleJavaScriptEnabled = toggleJavaScriptEnabled;
loader.lazyRequireGetter(this, "_create", "devtools/client/debugger/src/client/firefox/create");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function addTarget(targetFront) {
  return {
    type: "INSERT_THREAD",
    newThread: (0, _create.createThread)(targetFront)
  };
}

function removeTarget(targetFront) {
  return {
    type: "REMOVE_THREAD",
    threadActorID: targetFront.targetForm.threadActor
  };
}

function toggleJavaScriptEnabled(enabled) {
  return async ({
    panel,
    dispatch,
    client
  }) => {
    await client.toggleJavaScriptEnabled(enabled);
    dispatch({
      type: "TOGGLE_JAVASCRIPT_ENABLED",
      value: enabled
    });
  };
}