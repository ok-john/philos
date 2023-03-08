"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("devtools/client/shared/vendor/react");

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class HighlightLines extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "highlightLineRange", () => {
      const {
        highlightedLineRange,
        editor
      } = this.props;
      const {
        codeMirror
      } = editor;

      if (!highlightedLineRange || !codeMirror) {
        return;
      }

      const {
        start,
        end
      } = highlightedLineRange;
      codeMirror.operation(() => {
        editor.alignLine(start);

        for (let line = start - 1; line < end; line++) {
          codeMirror.addLineClass(line, "wrapClass", "highlight-lines");
        }
      });
    });
  }

  static get propTypes() {
    return {
      editor: _propTypes.default.object.isRequired,
      highlightedLineRange: _propTypes.default.object
    };
  }

  componentDidMount() {
    this.highlightLineRange();
  } // FIXME: https://bugzilla.mozilla.org/show_bug.cgi?id=1774507


  UNSAFE_componentWillUpdate() {
    this.clearHighlightRange();
  }

  componentDidUpdate() {
    this.highlightLineRange();
  }

  componentWillUnmount() {
    this.clearHighlightRange();
  }

  clearHighlightRange() {
    const {
      highlightedLineRange,
      editor
    } = this.props;
    const {
      codeMirror
    } = editor;

    if (!highlightedLineRange || !codeMirror) {
      return;
    }

    const {
      start,
      end
    } = highlightedLineRange;
    codeMirror.operation(() => {
      for (let line = start - 1; line < end; line++) {
        codeMirror.removeLineClass(line, "wrapClass", "highlight-lines");
      }
    });
  }

  render() {
    return null;
  }

}

var _default = (0, _connect.connect)(state => ({
  highlightedLineRange: (0, _selectors.getHighlightedLineRange)(state)
}))(HighlightLines);

exports.default = _default;