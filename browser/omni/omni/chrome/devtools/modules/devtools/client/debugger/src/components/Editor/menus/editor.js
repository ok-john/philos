"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.editorMenuItems = editorMenuItems;
exports.editorItemActions = editorItemActions;
exports.blackBoxLineMenuItem = exports.continueToHereItem = void 0;

var _redux = require("devtools/client/shared/vendor/redux");

loader.lazyRequireGetter(this, "_clipboard", "devtools/client/debugger/src/utils/clipboard");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_editor", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_utils", "devtools/client/debugger/src/utils/utils");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");

var _actions = _interopRequireDefault(require("../../../actions/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
// Menu Items
const continueToHereItem = (cx, location, isPaused, editorActions) => ({
  accesskey: L10N.getStr("editor.continueToHere.accesskey"),
  disabled: !isPaused,
  click: () => editorActions.continueToHere(cx, location),
  id: "node-menu-continue-to-here",
  label: L10N.getStr("editor.continueToHere.label")
});

exports.continueToHereItem = continueToHereItem;

const copyToClipboardItem = (selectionText, editorActions) => ({
  id: "node-menu-copy-to-clipboard",
  label: L10N.getStr("copyToClipboard.label"),
  accesskey: L10N.getStr("copyToClipboard.accesskey"),
  disabled: selectionText.length === 0,
  click: () => (0, _clipboard.copyToTheClipboard)(selectionText)
});

const copySourceItem = (selectedContent, editorActions) => ({
  id: "node-menu-copy-source",
  label: L10N.getStr("copySource.label"),
  accesskey: L10N.getStr("copySource.accesskey"),
  disabled: false,
  click: () => selectedContent.type === "text" && (0, _clipboard.copyToTheClipboard)(selectedContent.value)
});

const copySourceUri2Item = (selectedSource, editorActions) => ({
  id: "node-menu-copy-source-url",
  label: L10N.getStr("copySourceUri2"),
  accesskey: L10N.getStr("copySourceUri2.accesskey"),
  disabled: !selectedSource.url,
  click: () => (0, _clipboard.copyToTheClipboard)((0, _source.getRawSourceURL)(selectedSource.url))
});

const jumpToMappedLocationItem = (cx, selectedSource, location, hasMappedLocation, editorActions) => ({
  id: "node-menu-jump",
  label: L10N.getFormatStr("editor.jumpToMappedLocation1", selectedSource.isOriginal ? L10N.getStr("generated") : L10N.getStr("original")),
  accesskey: L10N.getStr("editor.jumpToMappedLocation1.accesskey"),
  disabled: !hasMappedLocation,
  click: () => editorActions.jumpToMappedLocation(cx, location)
});

const showSourceMenuItem = (cx, selectedSource, editorActions) => ({
  id: "node-menu-show-source",
  label: L10N.getStr("sourceTabs.revealInTree"),
  accesskey: L10N.getStr("sourceTabs.revealInTree.accesskey"),
  disabled: !selectedSource.url,
  click: () => editorActions.showSource(cx, selectedSource.id)
});

const blackBoxMenuItem = (cx, selectedSource, blackboxedRanges, editorActions) => {
  const isBlackBoxed = !!blackboxedRanges[selectedSource.url];
  return {
    id: "node-menu-blackbox",
    label: isBlackBoxed ? L10N.getStr("ignoreContextItem.unignore") : L10N.getStr("ignoreContextItem.ignore"),
    accesskey: isBlackBoxed ? L10N.getStr("ignoreContextItem.unignore.accesskey") : L10N.getStr("ignoreContextItem.ignore.accesskey"),
    disabled: !(0, _source.shouldBlackbox)(selectedSource),
    click: () => editorActions.toggleBlackBox(cx, selectedSource)
  };
};

const blackBoxLineMenuItem = (cx, selectedSource, editorActions, editor, blackboxedRanges, // the clickedLine is passed when the context menu
// is opened from the gutter, it is not available when the
// the context menu is opened from the editor.
clickedLine = null) => {
  const {
    codeMirror
  } = editor;
  const from = codeMirror.getCursor("from");
  const to = codeMirror.getCursor("to");
  const startLine = clickedLine ?? (0, _editor.toSourceLine)(selectedSource.id, from.line);
  const endLine = clickedLine ?? (0, _editor.toSourceLine)(selectedSource.id, to.line);
  const blackboxRange = (0, _source.findBlackBoxRange)(selectedSource, blackboxedRanges, {
    start: startLine,
    end: endLine
  });
  const selectedLineIsBlackBoxed = !!blackboxRange;
  const isSingleLine = selectedLineIsBlackBoxed ? blackboxRange.start.line == blackboxRange.end.line : startLine == endLine; // The ignore/unignore line context menu item should be disabled when
  // 1) The whole source is blackboxed or
  // 2) Multiple lines are blackboxed or
  // 3) Multiple lines are selected in the editor

  const shouldDisable = blackboxedRanges[selectedSource.url] && !blackboxedRanges[selectedSource.url].length || !isSingleLine;
  return {
    id: "node-menu-blackbox-line",
    label: !selectedLineIsBlackBoxed ? L10N.getStr("ignoreContextItem.ignoreLine") : L10N.getStr("ignoreContextItem.unignoreLine"),
    accesskey: !selectedLineIsBlackBoxed ? L10N.getStr("ignoreContextItem.ignoreLine.accesskey") : L10N.getStr("ignoreContextItem.unignoreLine.accesskey"),
    disabled: shouldDisable,
    click: () => {
      const selectionRange = {
        start: {
          line: startLine,
          column: clickedLine == null ? from.ch : 0
        },
        end: {
          line: endLine,
          column: clickedLine == null ? to.ch : 0
        }
      };
      editorActions.toggleBlackBox(cx, selectedSource, !selectedLineIsBlackBoxed, selectedLineIsBlackBoxed ? [blackboxRange] : [selectionRange]);
    }
  };
};

exports.blackBoxLineMenuItem = blackBoxLineMenuItem;

const blackBoxLinesMenuItem = (cx, selectedSource, editorActions, editor, blackboxedRanges) => {
  const {
    codeMirror
  } = editor;
  const from = codeMirror.getCursor("from");
  const to = codeMirror.getCursor("to");
  const startLine = (0, _editor.toSourceLine)(selectedSource.id, from.line);
  const endLine = (0, _editor.toSourceLine)(selectedSource.id, to.line);
  const blackboxRange = (0, _source.findBlackBoxRange)(selectedSource, blackboxedRanges, {
    start: startLine,
    end: endLine
  });
  const selectedLinesAreBlackBoxed = !!blackboxRange;
  return {
    id: "node-menu-blackbox-lines",
    label: !selectedLinesAreBlackBoxed ? L10N.getStr("ignoreContextItem.ignoreLines") : L10N.getStr("ignoreContextItem.unignoreLines"),
    accesskey: !selectedLinesAreBlackBoxed ? L10N.getStr("ignoreContextItem.ignoreLines.accesskey") : L10N.getStr("ignoreContextItem.unignoreLines.accesskey"),
    disabled: false,
    click: () => {
      const selectionRange = {
        start: {
          line: startLine,
          column: from.ch
        },
        end: {
          line: endLine,
          column: to.ch
        }
      }; // removes the current selection

      codeMirror.replaceSelection(codeMirror.getSelection(), "start");
      editorActions.toggleBlackBox(cx, selectedSource, !selectedLinesAreBlackBoxed, selectedLinesAreBlackBoxed ? [blackboxRange] : [selectionRange]);
    }
  };
};

const watchExpressionItem = (cx, selectedSource, selectionText, editorActions) => ({
  id: "node-menu-add-watch-expression",
  label: L10N.getStr("expressions.label"),
  accesskey: L10N.getStr("expressions.accesskey"),
  click: () => editorActions.addExpression(cx, selectionText)
});

const evaluateInConsoleItem = (selectedSource, selectionText, editorActions) => ({
  id: "node-menu-evaluate-in-console",
  label: L10N.getStr("evaluateInConsole.label"),
  click: () => editorActions.evaluateInConsole(selectionText)
});

const downloadFileItem = (selectedSource, selectedContent, editorActions) => ({
  id: "node-menu-download-file",
  label: L10N.getStr("downloadFile.label"),
  accesskey: L10N.getStr("downloadFile.accesskey"),
  click: () => (0, _utils.downloadFile)(selectedContent, (0, _source.getFilename)(selectedSource))
});

const inlinePreviewItem = editorActions => ({
  id: "node-menu-inline-preview",
  label: _prefs.features.inlinePreview ? L10N.getStr("inlinePreview.hide.label") : L10N.getStr("inlinePreview.show.label"),
  click: () => editorActions.toggleInlinePreview(!_prefs.features.inlinePreview)
});

const editorWrappingItem = (editorActions, editorWrappingEnabled) => ({
  id: "node-menu-editor-wrapping",
  label: editorWrappingEnabled ? L10N.getStr("editorWrapping.hide.label") : L10N.getStr("editorWrapping.show.label"),
  click: () => editorActions.toggleEditorWrapping(!editorWrappingEnabled)
});

function editorMenuItems({
  cx,
  editorActions,
  selectedSource,
  blackboxedRanges,
  location,
  selectionText,
  hasMappedLocation,
  isTextSelected,
  isPaused,
  editorWrappingEnabled,
  editor
}) {
  const items = [];
  const content = selectedSource.content && (0, _asyncValue.isFulfilled)(selectedSource.content) ? selectedSource.content.value : null;
  items.push(jumpToMappedLocationItem(cx, selectedSource, location, hasMappedLocation, editorActions), continueToHereItem(cx, location, isPaused, editorActions), {
    type: "separator"
  }, copyToClipboardItem(selectionText, editorActions), ...(!selectedSource.isWasm ? [...(content ? [copySourceItem(content, editorActions)] : []), copySourceUri2Item(selectedSource, editorActions)] : []), ...(content ? [downloadFileItem(selectedSource, content, editorActions)] : []), {
    type: "separator"
  }, showSourceMenuItem(cx, selectedSource, editorActions), {
    type: "separator"
  }, blackBoxMenuItem(cx, selectedSource, blackboxedRanges, editorActions));

  if (_prefs.features.blackboxLines) {
    const startLine = (0, _editor.toSourceLine)(selectedSource.id, editor.codeMirror.getCursor("from").line);
    const endLine = (0, _editor.toSourceLine)(selectedSource.id, editor.codeMirror.getCursor("to").line); // Find any blackbox ranges that exist for the selected lines

    const blackboxRange = (0, _source.findBlackBoxRange)(selectedSource, blackboxedRanges, {
      start: startLine,
      end: endLine
    });
    const isMultiLineSelection = blackboxRange ? blackboxRange.start.line !== blackboxRange.end.line : startLine !== endLine; // When the range is defined and is an empty array,
    // the whole source is blackboxed

    const theWholeSourceIsBlackBoxed = blackboxedRanges[selectedSource.url] && !blackboxedRanges[selectedSource.url].length;

    if (!theWholeSourceIsBlackBoxed) {
      const blackBoxSourceLinesMenuItem = isMultiLineSelection ? blackBoxLinesMenuItem : blackBoxLineMenuItem;
      items.push(blackBoxSourceLinesMenuItem(cx, selectedSource, editorActions, editor, blackboxedRanges));
    }
  }

  if (isTextSelected) {
    items.push({
      type: "separator"
    }, watchExpressionItem(cx, selectedSource, selectionText, editorActions), evaluateInConsoleItem(selectedSource, selectionText, editorActions));
  }

  items.push({
    type: "separator"
  }, inlinePreviewItem(editorActions), editorWrappingItem(editorActions, editorWrappingEnabled));
  return items;
}

function editorItemActions(dispatch) {
  return (0, _redux.bindActionCreators)({
    addExpression: _actions.default.addExpression,
    continueToHere: _actions.default.continueToHere,
    evaluateInConsole: _actions.default.evaluateInConsole,
    flashLineRange: _actions.default.flashLineRange,
    jumpToMappedLocation: _actions.default.jumpToMappedLocation,
    showSource: _actions.default.showSource,
    toggleBlackBox: _actions.default.toggleBlackBox,
    toggleBlackBoxLines: _actions.default.toggleBlackBoxLines,
    toggleInlinePreview: _actions.default.toggleInlinePreview,
    toggleEditorWrapping: _actions.default.toggleEditorWrapping
  }, dispatch);
}