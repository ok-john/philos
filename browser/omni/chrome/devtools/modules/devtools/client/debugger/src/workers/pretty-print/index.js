"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PrettyPrintDispatcher = void 0;
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

var _workerUtils = require("devtools/client/shared/worker-utils");

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

const WORKER_URL = "resource://devtools/client/debugger/dist/pretty-print-worker.js";

class PrettyPrintDispatcher extends _workerUtils.WorkerDispatcher {
  constructor(jestUrl) {
    super(jestUrl || WORKER_URL);

    _prettyPrintTask.set(this, {
      writable: true,
      value: this.task("prettyPrint")
    });
  }

  prettyPrint({
    url,
    text
  }) {
    return _classPrivateFieldGet(this, _prettyPrintTask).call(this, {
      url,
      indent: _prefs.prefs.indentSize,
      sourceText: text
    });
  }

}

exports.PrettyPrintDispatcher = PrettyPrintDispatcher;

var _prettyPrintTask = new WeakMap();