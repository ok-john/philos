"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _redux = require("devtools/client/shared/vendor/redux");

var _reactDom = _interopRequireDefault(require("devtools/client/shared/vendor/react-dom"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _classnames = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["classnames"]);

loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_indentation", "devtools/client/debugger/src/utils/indentation");
loader.lazyRequireGetter(this, "_menu", "devtools/client/debugger/src/context-menu/menu");
loader.lazyRequireGetter(this, "_breakpoints", "devtools/client/debugger/src/components/Editor/menus/breakpoints");
loader.lazyRequireGetter(this, "_editor", "devtools/client/debugger/src/components/Editor/menus/editor");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

var _actions = _interopRequireDefault(require("../../actions/index"));

var _SearchBar = _interopRequireDefault(require("./SearchBar"));

var _HighlightLines = _interopRequireDefault(require("./HighlightLines"));

var _Preview = _interopRequireDefault(require("./Preview/index"));

var _Breakpoints = _interopRequireDefault(require("./Breakpoints"));

var _ColumnBreakpoints = _interopRequireDefault(require("./ColumnBreakpoints"));

var _DebugLine = _interopRequireDefault(require("./DebugLine"));

var _HighlightLine = _interopRequireDefault(require("./HighlightLine"));

var _EmptyLines = _interopRequireDefault(require("./EmptyLines"));

var _EditorMenu = _interopRequireDefault(require("./EditorMenu"));

var _ConditionalPanel = _interopRequireDefault(require("./ConditionalPanel"));

var _InlinePreviews = _interopRequireDefault(require("./InlinePreviews"));

var _HighlightCalls = _interopRequireDefault(require("./HighlightCalls"));

var _Exceptions = _interopRequireDefault(require("./Exceptions"));

var _BlackboxLines = _interopRequireDefault(require("./BlackboxLines"));

loader.lazyRequireGetter(this, "_editor2", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_ui", "devtools/client/debugger/src/utils/ui");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  debounce
} = require("devtools/shared/debounce");

const {
  appinfo
} = Services;
const isMacOS = appinfo.OS === "Darwin";

function isSecondary(ev) {
  return isMacOS && ev.ctrlKey && ev.button === 0;
}

function isCmd(ev) {
  return isMacOS ? ev.metaKey : ev.ctrlKey;
}

const cssVars = {
  searchbarHeight: "var(--editor-searchbar-height)"
};

class Editor extends _react.PureComponent {
  static get propTypes() {
    return {
      selectedSource: _propTypes.default.object,
      selectedSourceTextContent: _propTypes.default.object,
      selectedSourceIsBlackBoxed: _propTypes.default.bool,
      cx: _propTypes.default.object.isRequired,
      closeTab: _propTypes.default.func.isRequired,
      toggleBreakpointAtLine: _propTypes.default.func.isRequired,
      conditionalPanelLocation: _propTypes.default.object,
      closeConditionalPanel: _propTypes.default.func.isRequired,
      openConditionalPanel: _propTypes.default.func.isRequired,
      updateViewport: _propTypes.default.func.isRequired,
      isPaused: _propTypes.default.bool.isRequired,
      highlightCalls: _propTypes.default.func.isRequired,
      unhighlightCalls: _propTypes.default.func.isRequired,
      breakpointActions: _propTypes.default.object.isRequired,
      editorActions: _propTypes.default.object.isRequired,
      addBreakpointAtLine: _propTypes.default.func.isRequired,
      continueToHere: _propTypes.default.func.isRequired,
      toggleBlackBox: _propTypes.default.func.isRequired,
      updateCursorPosition: _propTypes.default.func.isRequired,
      jumpToMappedLocation: _propTypes.default.func.isRequired,
      selectedLocation: _propTypes.default.object,
      symbols: _propTypes.default.object,
      startPanelSize: _propTypes.default.number.isRequired,
      endPanelSize: _propTypes.default.number.isRequired,
      searchOn: _propTypes.default.bool.isRequired,
      inlinePreviewEnabled: _propTypes.default.bool.isRequired,
      editorWrappingEnabled: _propTypes.default.bool.isRequired,
      skipPausing: _propTypes.default.bool.isRequired,
      blackboxedRanges: _propTypes.default.object.isRequired,
      breakableLines: _propTypes.default.object.isRequired
    };
  }

  constructor(props) {
    super(props);

    _defineProperty(this, "$editorWrapper", void 0);

    _defineProperty(this, "onCloseShortcutPress", e => {
      const {
        cx,
        selectedSource
      } = this.props;

      if (selectedSource) {
        e.preventDefault();
        e.stopPropagation();
        this.props.closeTab(cx, selectedSource, "shortcut");
      }
    });

    _defineProperty(this, "onToggleBreakpoint", e => {
      e.preventDefault();
      e.stopPropagation();
      const line = this.getCurrentLine();

      if (typeof line !== "number") {
        return;
      }

      this.props.toggleBreakpointAtLine(this.props.cx, line);
    });

    _defineProperty(this, "onToggleConditionalPanel", e => {
      e.stopPropagation();
      e.preventDefault();
      const {
        conditionalPanelLocation,
        closeConditionalPanel,
        openConditionalPanel,
        selectedSource
      } = this.props;
      const line = this.getCurrentLine();
      const {
        codeMirror
      } = this.state.editor; // add one to column for correct position in editor.

      const column = (0, _editor2.getCursorColumn)(codeMirror) + 1;

      if (conditionalPanelLocation) {
        return closeConditionalPanel();
      }

      if (!selectedSource || typeof line !== "number") {
        return null;
      }

      return openConditionalPanel({
        line,
        column,
        sourceId: selectedSource.id
      }, false);
    });

    _defineProperty(this, "onEditorScroll", debounce(this.props.updateViewport, 75));

    _defineProperty(this, "commandKeyDown", e => {
      const {
        key
      } = e;

      if (this.props.isPaused && key === "Meta") {
        const {
          cx,
          highlightCalls
        } = this.props;
        highlightCalls(cx);
      }
    });

    _defineProperty(this, "commandKeyUp", e => {
      const {
        key
      } = e;

      if (key === "Meta") {
        const {
          cx,
          unhighlightCalls
        } = this.props;
        unhighlightCalls(cx);
      }
    });

    _defineProperty(this, "onEscape", e => {
      if (!this.state.editor) {
        return;
      }

      const {
        codeMirror
      } = this.state.editor;

      if (codeMirror.listSelections().length > 1) {
        codeMirror.execCommand("singleSelection");
        e.preventDefault();
      }
    });

    _defineProperty(this, "clearContextMenu", () => {
      this.setState({
        contextMenu: null
      });
    });

    _defineProperty(this, "onGutterClick", (cm, line, gutter, ev) => {
      const {
        cx,
        selectedSource,
        conditionalPanelLocation,
        closeConditionalPanel,
        addBreakpointAtLine,
        continueToHere,
        toggleBlackBox,
        breakableLines
      } = this.props; // ignore right clicks in the gutter

      if (isSecondary(ev) || ev.button === 2 || !selectedSource) {
        return;
      } // if user clicks gutter to set breakpoint on blackboxed source, un-blackbox the source.


      if (this.props.selectedSourceIsBlackBoxed) {
        toggleBlackBox(cx, selectedSource);
      }

      if (conditionalPanelLocation) {
        closeConditionalPanel();
        return;
      }

      if (gutter === "CodeMirror-foldgutter") {
        return;
      }

      const sourceLine = (0, _editor2.toSourceLine)(selectedSource.id, line);

      if (typeof sourceLine !== "number") {
        return;
      } // ignore clicks on a non-breakable line


      if (!breakableLines.has(sourceLine)) {
        return;
      }

      if (isCmd(ev)) {
        continueToHere(cx, {
          line: sourceLine,
          column: undefined,
          sourceId: selectedSource.id
        });
        return;
      }

      addBreakpointAtLine(cx, sourceLine, ev.altKey, ev.shiftKey);
    });

    _defineProperty(this, "onGutterContextMenu", event => {
      this.openMenu(event);
    });

    this.state = {
      highlightedLineRange: null,
      editor: null,
      contextMenu: null
    };
  } // FIXME: https://bugzilla.mozilla.org/show_bug.cgi?id=1774507


  UNSAFE_componentWillReceiveProps(nextProps) {
    let {
      editor
    } = this.state;

    if (!editor && nextProps.selectedSource) {
      editor = this.setupEditor();
    }

    const shouldUpdateText = nextProps.selectedSource !== this.props.selectedSource || nextProps.selectedSourceTextContent !== this.props.selectedSourceTextContent || nextProps.symbols !== this.props.symbols;
    const shouldUpdateSize = nextProps.startPanelSize !== this.props.startPanelSize || nextProps.endPanelSize !== this.props.endPanelSize;
    const shouldScroll = nextProps.selectedLocation && this.shouldScrollToLocation(nextProps, editor);

    if (shouldUpdateText || shouldUpdateSize || shouldScroll) {
      (0, _editor2.startOperation)();

      if (shouldUpdateText) {
        this.setText(nextProps, editor);
      }

      if (shouldUpdateSize) {
        editor.codeMirror.setSize();
      }

      if (shouldScroll) {
        this.scrollToLocation(nextProps, editor);
      }

      (0, _editor2.endOperation)();
    }

    if (this.props.selectedSource != nextProps.selectedSource) {
      this.props.updateViewport();
      (0, _ui.resizeBreakpointGutter)(editor.codeMirror);
      (0, _ui.resizeToggleButton)(editor.codeMirror);
    }
  }

  setupEditor() {
    const editor = (0, _editor2.getEditor)(); // disables the default search shortcuts

    editor._initShortcuts = () => {};

    const node = _reactDom.default.findDOMNode(this);

    if (node instanceof HTMLElement) {
      editor.appendToLocalElement(node.querySelector(".editor-mount"));
    }

    const {
      codeMirror
    } = editor;
    const codeMirrorWrapper = codeMirror.getWrapperElement();
    codeMirror.on("gutterClick", this.onGutterClick);

    if (_prefs.features.commandClick) {
      document.addEventListener("keydown", this.commandKeyDown);
      document.addEventListener("keyup", this.commandKeyUp);
    } // Set code editor wrapper to be focusable


    codeMirrorWrapper.tabIndex = 0;
    codeMirrorWrapper.addEventListener("keydown", e => this.onKeyDown(e));
    codeMirrorWrapper.addEventListener("click", e => this.onClick(e));
    codeMirrorWrapper.addEventListener("mouseover", (0, _editor2.onMouseOver)(codeMirror));

    const toggleFoldMarkerVisibility = e => {
      if (node instanceof HTMLElement) {
        node.querySelectorAll(".CodeMirror-guttermarker-subtle").forEach(elem => {
          elem.classList.toggle("visible");
        });
      }
    };

    const codeMirrorGutter = codeMirror.getGutterElement();
    codeMirrorGutter.addEventListener("mouseleave", toggleFoldMarkerVisibility);
    codeMirrorGutter.addEventListener("mouseenter", toggleFoldMarkerVisibility);
    codeMirrorWrapper.addEventListener("contextmenu", event => this.openMenu(event));
    codeMirror.on("scroll", this.onEditorScroll);
    this.onEditorScroll();
    this.setState({
      editor
    });
    return editor;
  }

  componentDidMount() {
    const {
      shortcuts
    } = this.context;
    shortcuts.on(L10N.getStr("toggleBreakpoint.key"), this.onToggleBreakpoint);
    shortcuts.on(L10N.getStr("toggleCondPanel.breakpoint.key"), this.onToggleConditionalPanel);
    shortcuts.on(L10N.getStr("toggleCondPanel.logPoint.key"), this.onToggleConditionalPanel);
    shortcuts.on(L10N.getStr("sourceTabs.closeTab.key"), this.onCloseShortcutPress);
    shortcuts.on("Esc", this.onEscape);
  }

  componentWillUnmount() {
    const {
      editor
    } = this.state;

    if (editor) {
      editor.destroy();
      editor.codeMirror.off("scroll", this.onEditorScroll);
      this.setState({
        editor: null
      });
    }

    const {
      shortcuts
    } = this.context;
    shortcuts.off(L10N.getStr("sourceTabs.closeTab.key"));
    shortcuts.off(L10N.getStr("toggleBreakpoint.key"));
    shortcuts.off(L10N.getStr("toggleCondPanel.breakpoint.key"));
    shortcuts.off(L10N.getStr("toggleCondPanel.logPoint.key"));
  }

  getCurrentLine() {
    const {
      codeMirror
    } = this.state.editor;
    const {
      selectedSource
    } = this.props;

    if (!selectedSource) {
      return null;
    }

    const line = (0, _editor2.getCursorLine)(codeMirror);
    return (0, _editor2.toSourceLine)(selectedSource.id, line);
  }

  onKeyDown(e) {
    const {
      codeMirror
    } = this.state.editor;
    const {
      key,
      target
    } = e;
    const codeWrapper = codeMirror.getWrapperElement();
    const textArea = codeWrapper.querySelector("textArea");

    if (key === "Escape" && target == textArea) {
      e.stopPropagation();
      e.preventDefault();
      codeWrapper.focus();
    } else if (key === "Enter" && target == codeWrapper) {
      e.preventDefault(); // Focus into editor's text area

      textArea.focus();
    }
  }
  /*
   * The default Esc command is overridden in the CodeMirror keymap to allow
   * the Esc keypress event to be catched by the toolbox and trigger the
   * split console. Restore it here, but preventDefault if and only if there
   * is a multiselection.
   */


  openMenu(event) {
    event.stopPropagation();
    event.preventDefault();
    const {
      cx,
      selectedSource,
      selectedSourceTextContent,
      breakpointActions,
      editorActions,
      isPaused,
      conditionalPanelLocation,
      closeConditionalPanel,
      blackboxedRanges
    } = this.props;
    const {
      editor
    } = this.state;

    if (!selectedSource || !editor) {
      return;
    } // only allow one conditionalPanel location.


    if (conditionalPanelLocation) {
      closeConditionalPanel();
    }

    const target = event.target;
    const {
      id: sourceId
    } = selectedSource;
    const line = (0, _editor2.lineAtHeight)(editor, sourceId, event);

    if (typeof line != "number") {
      return;
    }

    const location = {
      line,
      column: undefined,
      sourceId
    };

    if (target.classList.contains("CodeMirror-linenumber")) {
      const lineText = (0, _source.getLineText)(sourceId, selectedSourceTextContent, line).trim();
      (0, _menu.showMenu)(event, [...(0, _breakpoints.createBreakpointItems)(cx, location, breakpointActions, lineText), {
        type: "separator"
      }, (0, _editor.continueToHereItem)(cx, location, isPaused, editorActions), {
        type: "separator"
      }, (0, _editor.blackBoxLineMenuItem)(cx, selectedSource, editorActions, editor, blackboxedRanges, line)]);
      return;
    }

    if (target.getAttribute("id") === "columnmarker") {
      return;
    }

    this.setState({
      contextMenu: event
    });
  }

  onClick(e) {
    const {
      cx,
      selectedSource,
      updateCursorPosition,
      jumpToMappedLocation
    } = this.props;

    if (selectedSource) {
      const sourceLocation = (0, _editor2.getSourceLocationFromMouseEvent)(this.state.editor, selectedSource, e);

      if (e.metaKey && e.altKey) {
        jumpToMappedLocation(cx, sourceLocation);
      }

      updateCursorPosition(sourceLocation);
    }
  }

  shouldScrollToLocation(nextProps, editor) {
    const {
      selectedLocation,
      selectedSource,
      selectedSourceTextContent
    } = this.props;

    if (!editor || !nextProps.selectedSource || !nextProps.selectedLocation || !nextProps.selectedLocation.line || !nextProps.selectedSourceTextContent) {
      return false;
    }

    const isFirstLoad = (!selectedSource || !selectedSourceTextContent) && nextProps.selectedSourceTextContent;
    const locationChanged = selectedLocation !== nextProps.selectedLocation;
    const symbolsChanged = nextProps.symbols != this.props.symbols;
    return isFirstLoad || locationChanged || symbolsChanged;
  }

  scrollToLocation(nextProps, editor) {
    const {
      selectedLocation,
      selectedSource
    } = nextProps;
    let {
      line,
      column
    } = (0, _editor2.toEditorPosition)(selectedLocation);

    if (selectedSource && (0, _editor2.hasDocument)(selectedSource.id)) {
      const doc = (0, _editor2.getDocument)(selectedSource.id);
      const lineText = doc.getLine(line);
      column = Math.max(column, (0, _indentation.getIndentation)(lineText));
    }

    (0, _editor2.scrollToColumn)(editor.codeMirror, line, column);
  }

  setText(props, editor) {
    const {
      selectedSource,
      selectedSourceTextContent,
      symbols
    } = props;

    if (!editor) {
      return;
    } // check if we previously had a selected source


    if (!selectedSource) {
      this.clearEditor();
      return;
    }

    if (!(selectedSourceTextContent === null || selectedSourceTextContent === void 0 ? void 0 : selectedSourceTextContent.value)) {
      (0, _editor2.showLoading)(editor);
      return;
    }

    if (selectedSourceTextContent.state === "rejected") {
      let {
        value
      } = selectedSourceTextContent;

      if (typeof value !== "string") {
        value = "Unexpected source error";
      }

      this.showErrorMessage(value);
      return;
    }

    (0, _editor2.showSourceText)(editor, selectedSource, selectedSourceTextContent, symbols);
  }

  clearEditor() {
    const {
      editor
    } = this.state;

    if (!editor) {
      return;
    }

    (0, _editor2.clearEditor)(editor);
  }

  showErrorMessage(msg) {
    const {
      editor
    } = this.state;

    if (!editor) {
      return;
    }

    (0, _editor2.showErrorMessage)(editor, msg);
  }

  getInlineEditorStyles() {
    const {
      searchOn
    } = this.props;

    if (searchOn) {
      return {
        height: `calc(100% - ${cssVars.searchbarHeight})`
      };
    }

    return {
      height: "100%"
    };
  }

  renderItems() {
    const {
      cx,
      selectedSource,
      conditionalPanelLocation,
      isPaused,
      inlinePreviewEnabled,
      editorWrappingEnabled
    } = this.props;
    const {
      editor,
      contextMenu
    } = this.state;

    if (!selectedSource || !editor || !(0, _editor2.getDocument)(selectedSource.id)) {
      return null;
    }

    return _react.default.createElement("div", null, _react.default.createElement(_HighlightCalls.default, {
      editor: editor,
      selectedSource: selectedSource
    }), _react.default.createElement(_DebugLine.default, null), _react.default.createElement(_HighlightLine.default, null), _react.default.createElement(_EmptyLines.default, {
      editor: editor
    }), _react.default.createElement(_Breakpoints.default, {
      editor: editor,
      cx: cx
    }), _react.default.createElement(_Preview.default, {
      editor: editor,
      editorRef: this.$editorWrapper
    }), _react.default.createElement(_HighlightLines.default, {
      editor: editor
    }), _prefs.features.blackboxLines ? _react.default.createElement(_BlackboxLines.default, {
      editor: editor
    }) : null, _react.default.createElement(_Exceptions.default, null), _react.default.createElement(_EditorMenu.default, {
      editor: editor,
      contextMenu: contextMenu,
      clearContextMenu: this.clearContextMenu,
      selectedSource: selectedSource,
      editorWrappingEnabled: editorWrappingEnabled
    }), conditionalPanelLocation ? _react.default.createElement(_ConditionalPanel.default, {
      editor: editor
    }) : null, _prefs.features.columnBreakpoints ? _react.default.createElement(_ColumnBreakpoints.default, {
      editor: editor
    }) : null, isPaused && inlinePreviewEnabled ? _react.default.createElement(_InlinePreviews.default, {
      editor: editor,
      selectedSource: selectedSource
    }) : null);
  }

  renderSearchBar() {
    const {
      editor
    } = this.state;

    if (!this.props.selectedSource) {
      return null;
    }

    return _react.default.createElement(_SearchBar.default, {
      editor: editor
    });
  }

  render() {
    const {
      selectedSourceIsBlackBoxed,
      skipPausing
    } = this.props;
    return _react.default.createElement("div", {
      className: (0, _classnames.default)("editor-wrapper", {
        blackboxed: selectedSourceIsBlackBoxed,
        "skip-pausing": skipPausing
      }),
      ref: c => this.$editorWrapper = c
    }, _react.default.createElement("div", {
      className: "editor-mount devtools-monospace",
      style: this.getInlineEditorStyles()
    }), this.renderSearchBar(), this.renderItems());
  }

}

Editor.contextTypes = {
  shortcuts: _propTypes.default.object
};

const mapStateToProps = state => {
  const selectedSource = (0, _selectors.getSelectedSource)(state);
  return {
    cx: (0, _selectors.getThreadContext)(state),
    selectedLocation: (0, _selectors.getSelectedLocation)(state),
    selectedSource,
    selectedSourceTextContent: (0, _selectors.getSelectedSourceTextContent)(state),
    selectedSourceIsBlackBoxed: selectedSource ? (0, _selectors.isSourceBlackBoxed)(state, selectedSource) : null,
    searchOn: (0, _selectors.getActiveSearch)(state) === "file",
    conditionalPanelLocation: (0, _selectors.getConditionalPanelLocation)(state),
    symbols: (0, _selectors.getSymbols)(state, selectedSource),
    isPaused: (0, _selectors.getIsCurrentThreadPaused)(state),
    skipPausing: (0, _selectors.getSkipPausing)(state),
    inlinePreviewEnabled: (0, _selectors.getInlinePreview)(state),
    editorWrappingEnabled: (0, _selectors.getEditorWrapping)(state),
    highlightedCalls: (0, _selectors.getHighlightedCalls)(state, (0, _selectors.getCurrentThread)(state)),
    blackboxedRanges: (0, _selectors.getBlackBoxRanges)(state),
    breakableLines: (0, _selectors.getSelectedBreakableLines)(state)
  };
};

const mapDispatchToProps = dispatch => ({ ...(0, _redux.bindActionCreators)({
    openConditionalPanel: _actions.default.openConditionalPanel,
    closeConditionalPanel: _actions.default.closeConditionalPanel,
    continueToHere: _actions.default.continueToHere,
    toggleBreakpointAtLine: _actions.default.toggleBreakpointAtLine,
    addBreakpointAtLine: _actions.default.addBreakpointAtLine,
    jumpToMappedLocation: _actions.default.jumpToMappedLocation,
    traverseResults: _actions.default.traverseResults,
    updateViewport: _actions.default.updateViewport,
    updateCursorPosition: _actions.default.updateCursorPosition,
    closeTab: _actions.default.closeTab,
    toggleBlackBox: _actions.default.toggleBlackBox,
    highlightCalls: _actions.default.highlightCalls,
    unhighlightCalls: _actions.default.unhighlightCalls
  }, dispatch),
  breakpointActions: (0, _breakpoints.breakpointItemActions)(dispatch),
  editorActions: (0, _editor.editorItemActions)(dispatch)
});

var _default = (0, _connect.connect)(mapStateToProps, mapDispatchToProps)(Editor);

exports.default = _default;