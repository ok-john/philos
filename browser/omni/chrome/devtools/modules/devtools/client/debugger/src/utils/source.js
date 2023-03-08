"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shouldBlackbox = shouldBlackbox;
exports.isFrameBlackBoxed = isFrameBlackBoxed;
exports.findBlackBoxRange = findBlackBoxRange;
exports.isJavaScript = isJavaScript;
exports.isPretty = isPretty;
exports.isPrettyURL = isPrettyURL;
exports.getPrettySourceURL = getPrettySourceURL;
exports.getRawSourceURL = getRawSourceURL;
exports.getFormattedSourceId = getFormattedSourceId;
exports.getFilename = getFilename;
exports.getTruncatedFileName = getTruncatedFileName;
exports.getDisplayPath = getDisplayPath;
exports.getFileURL = getFileURL;
exports.getSourcePath = getSourcePath;
exports.getSourceLineCount = getSourceLineCount;
exports.isInlineScript = isInlineScript;
exports.getTextAtPosition = getTextAtPosition;
exports.getSourceClassnames = getSourceClassnames;
exports.getRelativeUrl = getRelativeUrl;
exports.removeThreadActorId = removeThreadActorId;
exports.isDescendantOfRoot = isDescendantOfRoot;
exports.isGenerated = isGenerated;
exports.getSourceQueryString = getSourceQueryString;
exports.isUrlExtension = isUrlExtension;
Object.defineProperty(exports, "isMinified", {
  enumerable: true,
  get: function () {
    return _isMinified.isMinified;
  }
});
exports.getLineText = exports.javascriptLikeExtensions = exports.sourceTypes = void 0;
loader.lazyRequireGetter(this, "_utils", "devtools/client/debugger/src/utils/utils");
loader.lazyRequireGetter(this, "_text", "devtools/client/debugger/src/utils/text");
loader.lazyRequireGetter(this, "_url", "devtools/client/debugger/src/utils/url");
loader.lazyRequireGetter(this, "_memoizeLast", "devtools/client/debugger/src/utils/memoizeLast");
loader.lazyRequireGetter(this, "_wasm", "devtools/client/debugger/src/utils/wasm");
loader.lazyRequireGetter(this, "_editor", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_isMinified", "devtools/client/debugger/src/utils/isMinified");
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Utils for working with Source URLs
 * @module utils/source
 */
const {
  getUnicodeUrl
} = require("devtools/client/shared/unicode-url");

const sourceTypes = {
  coffee: "coffeescript",
  js: "javascript",
  jsx: "react",
  ts: "typescript",
  tsx: "typescript",
  vue: "vue"
};
exports.sourceTypes = sourceTypes;
const javascriptLikeExtensions = new Set(["marko", "es6", "vue", "jsm"]);
exports.javascriptLikeExtensions = javascriptLikeExtensions;

function getPath(source) {
  const {
    path
  } = source.displayURL;
  let lastIndex = path.lastIndexOf("/");
  let nextToLastIndex = path.lastIndexOf("/", lastIndex - 1);
  const result = [];

  do {
    result.push(path.slice(nextToLastIndex + 1, lastIndex));
    lastIndex = nextToLastIndex;
    nextToLastIndex = path.lastIndexOf("/", lastIndex - 1);
  } while (lastIndex !== nextToLastIndex);

  result.push("");
  return result;
}

function shouldBlackbox(source) {
  if (!source) {
    return false;
  }

  if (!source.url) {
    return false;
  }

  return true;
}
/**
 * Checks if the frame is within a line ranges which are blackboxed
 * in the source.
 *
 * @param {Object}  frame
 *                  The current frame
 * @param {Object}  source
 *                  The source related to the frame
 * @param {Object}  blackboxedRanges
 *                  The currently blackboxedRanges for all the sources.
 * @param {Boolean} isFrameBlackBoxed
 *                  If the frame is within the blackboxed range
 *                  or not.
 */


function isFrameBlackBoxed(frame, source, blackboxedRanges) {
  return source && !!blackboxedRanges[source.url] && (!blackboxedRanges[source.url].length || !!findBlackBoxRange(source, blackboxedRanges, {
    start: frame.location.line,
    end: frame.location.line
  }));
}
/**
 * Checks if a blackbox range exist for the line range.
 * That is if any start and end lines overlap any of the
 * blackbox ranges
 *
 * @param {Object}  source
 *                  The current selected source
 * @param {Object}  blackboxedRanges
 *                  The store of blackboxedRanges
 * @param {Object}  lineRange
 *                  The start/end line range `{ start: <Number>, end: <Number> }`
 * @return {Object} blackboxRange
 *                  The first matching blackbox range that all or part of the
 *                  specified lineRange sits within.
 */


function findBlackBoxRange(source, blackboxedRanges, lineRange) {
  const ranges = blackboxedRanges[source.url];

  if (!ranges || !ranges.length) {
    return null;
  }

  return ranges.find(range => lineRange.start >= range.start.line && lineRange.start <= range.end.line || lineRange.end >= range.start.line && lineRange.end <= range.end.line);
}
/**
 * Returns true if the specified url and/or content type are specific to
 * javascript files.
 *
 * @return boolean
 *         True if the source is likely javascript.
 *
 * @memberof utils/source
 * @static
 */


function isJavaScript(source, content) {
  const extension = source.displayURL.fileExtension;
  const contentType = content.type === "wasm" ? null : content.contentType;
  return javascriptLikeExtensions.has(extension) || !!(contentType && contentType.includes("javascript"));
}
/**
 * @memberof utils/source
 * @static
 */


function isPretty(source) {
  return isPrettyURL(source.url);
}

function isPrettyURL(url) {
  return url ? url.endsWith(":formatted") : false;
}
/**
 * @memberof utils/source
 * @static
 */


function getPrettySourceURL(url) {
  if (!url) {
    url = "";
  }

  return `${url}:formatted`;
}
/**
 * @memberof utils/source
 * @static
 */


function getRawSourceURL(url) {
  return url && url.endsWith(":formatted") ? url.slice(0, -":formatted".length) : url;
}

function resolveFileURL(url, transformUrl = initialUrl => initialUrl, truncate = true) {
  url = getRawSourceURL(url || "");
  const name = transformUrl(url);

  if (!truncate) {
    return name;
  }

  return (0, _utils.endTruncateStr)(name, 50);
}

function getFormattedSourceId(id) {
  return id.substring(id.lastIndexOf("/") + 1);
}
/**
 * Gets a readable filename from a source URL for display purposes.
 * If the source does not have a URL, the source ID will be returned instead.
 *
 * @memberof utils/source
 * @static
 */


function getFilename(source, rawSourceURL = getRawSourceURL(source.url)) {
  const {
    id
  } = source;

  if (!rawSourceURL) {
    return getFormattedSourceId(id);
  }

  const {
    filename
  } = source.displayURL;
  return getRawSourceURL(filename);
}
/**
 * Provides a middle-trunated filename
 *
 * @memberof utils/source
 * @static
 */


function getTruncatedFileName(source, querystring = "", length = 30) {
  return (0, _text.truncateMiddleText)(`${getFilename(source)}${querystring}`, length);
}
/* Gets path for files with same filename for editor tabs, breakpoints, etc.
 * Pass the source, and list of other sources
 *
 * @memberof utils/source
 * @static
 */


function getDisplayPath(mySource, sources) {
  const rawSourceURL = getRawSourceURL(mySource.url);
  const filename = getFilename(mySource, rawSourceURL); // Find sources that have the same filename, but different paths
  // as the original source

  const similarSources = sources.filter(source => {
    const rawSource = getRawSourceURL(source.url);
    return rawSourceURL != rawSource && filename == getFilename(source, rawSource);
  });

  if (!similarSources.length) {
    return undefined;
  } // get an array of source path directories e.g. ['a/b/c.html'] => [['b', 'a']]


  const paths = new Array(similarSources.length + 1);
  paths[0] = getPath(mySource);

  for (let i = 0; i < similarSources.length; ++i) {
    paths[i + 1] = getPath(similarSources[i]);
  } // create an array of similar path directories and one dis-similar directory
  // for example [`a/b/c.html`, `a1/b/c.html`] => ['b', 'a']
  // where 'b' is the similar directory and 'a' is the dis-similar directory.


  let displayPath = "";

  for (let i = 0; i < paths[0].length; i++) {
    let similar = false;

    for (let k = 1; k < paths.length; ++k) {
      if (paths[k][i] === paths[0][i]) {
        similar = true;
        break;
      }
    }

    displayPath = paths[0][i] + (i !== 0 ? "/" : "") + displayPath;

    if (!similar) {
      break;
    }
  }

  return displayPath;
}
/**
 * Gets a readable source URL for display purposes.
 * If the source does not have a URL, the source ID will be returned instead.
 *
 * @memberof utils/source
 * @static
 */


function getFileURL(source, truncate = true) {
  const {
    url,
    id
  } = source;

  if (!url) {
    return getFormattedSourceId(id);
  }

  return resolveFileURL(url, getUnicodeUrl, truncate);
}

function getSourcePath(url) {
  if (!url) {
    return "";
  }

  const {
    path,
    href
  } = (0, _url.parse)(url); // for URLs like "about:home" the path is null so we pass the full href

  return path || href;
}
/**
 * Returns amount of lines in the source. If source is a WebAssembly binary,
 * the function returns amount of bytes.
 */


function getSourceLineCount(content) {
  if (content.type === "wasm") {
    const {
      binary
    } = content.value;
    return binary.length;
  }

  let count = 0;

  for (let i = 0; i < content.value.length; ++i) {
    if (content.value[i] === "\n") {
      ++count;
    }
  }

  return count + 1;
}

function isInlineScript(source) {
  return source.introductionType === "scriptElement";
}

function getNthLine(str, lineNum) {
  let startIndex = -1;
  let newLinesFound = 0;

  while (newLinesFound < lineNum) {
    const nextIndex = str.indexOf("\n", startIndex + 1);

    if (nextIndex === -1) {
      return null;
    }

    startIndex = nextIndex;
    newLinesFound++;
  }

  const endIndex = str.indexOf("\n", startIndex + 1);

  if (endIndex === -1) {
    return str.slice(startIndex + 1);
  }

  return str.slice(startIndex + 1, endIndex);
}

const getLineText = (0, _memoizeLast.memoizeLast)((sourceId, asyncContent, line) => {
  if (!asyncContent || !(0, _asyncValue.isFulfilled)(asyncContent)) {
    return "";
  }

  const content = asyncContent.value;

  if (content.type === "wasm") {
    const editorLine = (0, _editor.toEditorLine)(sourceId, line);
    const lines = (0, _wasm.renderWasmText)(sourceId, content);
    return lines[editorLine] || "";
  }

  const lineText = getNthLine(content.value, line - 1);
  return lineText || "";
});
exports.getLineText = getLineText;

function getTextAtPosition(sourceId, asyncContent, location) {
  const {
    column,
    line = 0
  } = location;
  const lineText = getLineText(sourceId, asyncContent, line);
  return lineText.slice(column, column + 100).trim();
}
/**
 * Compute the CSS classname string to use for the icon of a given source.
 *
 * @param {Object} source
 *        The reducer source object.
 * @param {Object} symbols
 *        The reducer symbol object for the given source.
 * @param {Boolean} isBlackBoxed
 *        To be set to true, when the given source is blackboxed.
 * @param {Boolean} hasPrettyTab
 *        To be set to true, if the given source isn't the pretty printed one,
 *        but another tab for that source is opened pretty printed.
 * @return String
 *        The classname to use.
 */


function getSourceClassnames(source, symbols, isBlackBoxed, hasPrettyTab = false) {
  // Conditionals should be ordered by priority of icon!
  const defaultClassName = "file";

  if (!source || !source.url) {
    return defaultClassName;
  } // In the SourceTree, we don't show the pretty printed sources,
  // but still want to show the pretty print icon when a pretty printed tab
  // for the current source is opened.


  if (isPretty(source) || hasPrettyTab) {
    return "prettyPrint";
  }

  if (isBlackBoxed) {
    return "blackBox";
  }

  if (symbols && symbols.framework) {
    return symbols.framework.toLowerCase();
  }

  if (isUrlExtension(source.url)) {
    return "extension";
  }

  return sourceTypes[source.displayURL.fileExtension] || defaultClassName;
}

function getRelativeUrl(source, root) {
  const {
    group,
    path
  } = source.displayURL;

  if (!root) {
    return path;
  } // + 1 removes the leading "/"


  const url = group + path;
  return url.slice(url.indexOf(root) + root.length + 1);
}
/**
 * source.url doesn't include thread actor ID, so before calling underRoot(), the thread actor ID
 * must be removed from the root, which this function handles.
 * @param {string} root The root url to be cleaned
 * @param {Set<Thread>} threads The list of threads
 * @returns {string} The root url with thread actor IDs removed
 */


function removeThreadActorId(root, threads) {
  threads.forEach(thread => {
    if (root.includes(thread.actor)) {
      root = root.slice(thread.actor.length + 1);
    }
  });
  return root;
}
/**
 * Checks if the source is descendant of the root identified by the
 * root url specified. The root might likely be projectDirectoryRoot which
 * is a defined by a pref that allows users restrict the source tree to
 * a subset of sources.
 *
 * @param {Object} source
 *                  The source object
 * @param {String} rootUrlWithoutThreadActor
 *                 The url for the root node, without the thread actor ID. This can be obtained
 *                 by calling removeThreadActorId()
 */


function isDescendantOfRoot(source, rootUrlWithoutThreadActor) {
  if (source.url && source.url.includes("chrome://")) {
    const {
      group,
      path
    } = source.displayURL;
    return (group + path).includes(rootUrlWithoutThreadActor);
  }

  return !!source.url && source.url.includes(rootUrlWithoutThreadActor);
}

function isGenerated(source) {
  return !source.isOriginal;
}

function getSourceQueryString(source) {
  if (!source) {
    return "";
  }

  return (0, _url.parse)(getRawSourceURL(source.url)).search;
}

function isUrlExtension(url) {
  return url.includes("moz-extension:") || url.includes("chrome-extension");
}