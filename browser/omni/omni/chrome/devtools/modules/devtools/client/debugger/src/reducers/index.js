"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialState = initialState;
exports.default = void 0;

var _expressions = _interopRequireWildcard(require("./expressions"));

var _sourceActors = _interopRequireWildcard(require("./source-actors"));

var _sources = _interopRequireWildcard(require("./sources"));

var _sourceBlackbox = _interopRequireWildcard(require("./source-blackbox"));

var _sourcesContent = _interopRequireWildcard(require("./sources-content"));

var _tabs = _interopRequireWildcard(require("./tabs"));

var _breakpoints = _interopRequireWildcard(require("./breakpoints"));

var _pendingBreakpoints = _interopRequireDefault(require("./pending-breakpoints"));

var _asyncRequests = _interopRequireDefault(require("./async-requests"));

var _pause = _interopRequireWildcard(require("./pause"));

var _ui = _interopRequireWildcard(require("./ui"));

var _fileSearch = _interopRequireWildcard(require("./file-search"));

var _ast = _interopRequireWildcard(require("./ast"));

var _preview = _interopRequireWildcard(require("./preview"));

var _projectTextSearch = _interopRequireWildcard(require("./project-text-search"));

var _quickOpen = _interopRequireWildcard(require("./quick-open"));

var _sourcesTree = _interopRequireWildcard(require("./sources-tree"));

var _threads = _interopRequireWildcard(require("./threads"));

var _eventListeners = _interopRequireWildcard(require("./event-listeners"));

var _exceptions = _interopRequireWildcard(require("./exceptions"));

var _index = require("devtools/client/shared/components/reps/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Reducer index
 * @module reducers/index
 */

/**
 * Note that this is only used by jest tests.
 *
 * Production is using loadInitialState() in main.js
 */
function initialState() {
  return {
    sources: (0, _sources.initialSourcesState)(),
    sourcesContent: (0, _sourcesContent.initialSourcesContentState)(),
    expressions: (0, _expressions.initialExpressionState)(),
    sourceActors: (0, _sourceActors.initialSourceActorsState)(),
    sourceBlackBox: (0, _sourceBlackbox.initialSourceBlackBoxState)(),
    tabs: (0, _tabs.initialTabState)(),
    breakpoints: (0, _breakpoints.initialBreakpointsState)(),
    pendingBreakpoints: {},
    asyncRequests: [],
    pause: (0, _pause.initialPauseState)(),
    ui: (0, _ui.initialUIState)(),
    fileSearch: (0, _fileSearch.initialFileSearchState)(),
    ast: (0, _ast.initialASTState)(),
    projectTextSearch: (0, _projectTextSearch.initialProjectTextSearchState)(),
    quickOpen: (0, _quickOpen.initialQuickOpenState)(),
    sourcesTree: (0, _sourcesTree.initialSourcesTreeState)(),
    threads: (0, _threads.initialThreadsState)(),
    objectInspector: _index.objectInspector.reducer.initialOIState(),
    eventListenerBreakpoints: (0, _eventListeners.initialEventListenerState)(),
    preview: (0, _preview.initialPreviewState)(),
    exceptions: (0, _exceptions.initialExceptionsState)()
  };
}

var _default = {
  expressions: _expressions.default,
  sourceActors: _sourceActors.default,
  sourceBlackBox: _sourceBlackbox.default,
  sourcesContent: _sourcesContent.default,
  sources: _sources.default,
  tabs: _tabs.default,
  breakpoints: _breakpoints.default,
  pendingBreakpoints: _pendingBreakpoints.default,
  asyncRequests: _asyncRequests.default,
  pause: _pause.default,
  ui: _ui.default,
  fileSearch: _fileSearch.default,
  ast: _ast.default,
  projectTextSearch: _projectTextSearch.default,
  quickOpen: _quickOpen.default,
  sourcesTree: _sourcesTree.default,
  threads: _threads.default,
  objectInspector: _index.objectInspector.reducer.default,
  eventListenerBreakpoints: _eventListeners.default,
  preview: _preview.default,
  exceptions: _exceptions.default
};
exports.default = _default;