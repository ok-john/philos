"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _Popup = _interopRequireDefault(require("./Popup"));

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

var _actions = _interopRequireDefault(require("../../../actions/index"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const EXCEPTION_MARKER = "mark-text-exception";

class Preview extends _react.PureComponent {
  constructor(props) {
    super(props);

    _defineProperty(this, "target", null);

    _defineProperty(this, "onTokenEnter", ({
      target,
      tokenPos
    }) => {
      const {
        cx,
        editor,
        updatePreview,
        highlightedCalls,
        setExceptionPreview
      } = this.props;
      const isTargetException = target.classList.contains(EXCEPTION_MARKER);

      if (isTargetException) {
        setExceptionPreview(cx, target, tokenPos, editor.codeMirror);
        return;
      }

      if (this.props.isPaused && !this.state.selecting && highlightedCalls === null && !isTargetException) {
        updatePreview(cx, target, tokenPos, editor.codeMirror);
      }
    });

    _defineProperty(this, "onMouseUp", () => {
      if (this.props.isPaused) {
        this.setState({
          selecting: false
        });
      }
    });

    _defineProperty(this, "onMouseDown", () => {
      if (this.props.isPaused) {
        this.setState({
          selecting: true
        });
      }
    });

    _defineProperty(this, "onScroll", () => {
      if (this.props.isPaused) {
        this.props.clearPreview(this.props.cx);
      }
    });

    this.state = {
      selecting: false
    };
  }

  static get propTypes() {
    return {
      clearPreview: _propTypes.default.func.isRequired,
      cx: _propTypes.default.object.isRequired,
      editor: _propTypes.default.object.isRequired,
      editorRef: _propTypes.default.object.isRequired,
      highlightedCalls: _propTypes.default.array,
      isPaused: _propTypes.default.bool.isRequired,
      preview: _propTypes.default.object,
      setExceptionPreview: _propTypes.default.func.isRequired,
      updatePreview: _propTypes.default.func.isRequired
    };
  }

  componentDidMount() {
    this.updateListeners();
  }

  componentWillUnmount() {
    const {
      codeMirror
    } = this.props.editor;
    const codeMirrorWrapper = codeMirror.getWrapperElement();
    codeMirror.off("tokenenter", this.onTokenEnter);
    codeMirror.off("scroll", this.onScroll);
    codeMirrorWrapper.removeEventListener("mouseup", this.onMouseUp);
    codeMirrorWrapper.removeEventListener("mousedown", this.onMouseDown);
  }

  updateListeners(prevProps) {
    const {
      codeMirror
    } = this.props.editor;
    const codeMirrorWrapper = codeMirror.getWrapperElement();
    codeMirror.on("tokenenter", this.onTokenEnter);
    codeMirror.on("scroll", this.onScroll);
    codeMirrorWrapper.addEventListener("mouseup", this.onMouseUp);
    codeMirrorWrapper.addEventListener("mousedown", this.onMouseDown);
  }

  render() {
    const {
      preview
    } = this.props;

    if (!preview || this.state.selecting) {
      return null;
    }

    return _react.default.createElement(_Popup.default, {
      preview: preview,
      editor: this.props.editor,
      editorRef: this.props.editorRef
    });
  }

}

const mapStateToProps = state => {
  const thread = (0, _selectors.getCurrentThread)(state);
  return {
    highlightedCalls: (0, _selectors.getHighlightedCalls)(state, thread),
    cx: (0, _selectors.getThreadContext)(state),
    preview: (0, _selectors.getPreview)(state),
    isPaused: (0, _selectors.getIsCurrentThreadPaused)(state)
  };
};

var _default = (0, _connect.connect)(mapStateToProps, {
  clearPreview: _actions.default.clearPreview,
  addExpression: _actions.default.addExpression,
  updatePreview: _actions.default.updatePreview,
  setExceptionPreview: _actions.default.setExceptionPreview
})(Preview);

exports.default = _default;