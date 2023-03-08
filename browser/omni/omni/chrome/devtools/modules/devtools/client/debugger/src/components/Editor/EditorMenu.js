"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("devtools/client/shared/vendor/react");

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");
loader.lazyRequireGetter(this, "_menu", "devtools/client/debugger/src/context-menu/menu");
loader.lazyRequireGetter(this, "_editor", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_editor2", "devtools/client/debugger/src/components/Editor/menus/editor");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
class EditorMenu extends _react.Component {
  static get propTypes() {
    return {
      clearContextMenu: _propTypes.default.func.isRequired,
      contextMenu: _propTypes.default.object
    };
  } // FIXME: https://bugzilla.mozilla.org/show_bug.cgi?id=1774507


  UNSAFE_componentWillUpdate(nextProps) {
    this.props.clearContextMenu();

    if (nextProps.contextMenu) {
      this.showMenu(nextProps);
    }
  }

  showMenu(props) {
    const {
      cx,
      editor,
      selectedSource,
      blackboxedRanges,
      editorActions,
      hasMappedLocation,
      isPaused,
      editorWrappingEnabled,
      contextMenu: event
    } = props;
    const location = (0, _editor.getSourceLocationFromMouseEvent)(editor, selectedSource, // Use a coercion, as contextMenu is optional
    event);
    (0, _menu.showMenu)(event, (0, _editor2.editorMenuItems)({
      cx,
      editorActions,
      selectedSource,
      blackboxedRanges,
      hasMappedLocation,
      location,
      isPaused,
      editorWrappingEnabled,
      selectionText: editor.codeMirror.getSelection().trim(),
      isTextSelected: editor.codeMirror.somethingSelected(),
      editor
    }));
  }

  render() {
    return null;
  }

}

const mapStateToProps = (state, props) => {
  // This component is a no-op when contextmenu is false
  if (!props.contextMenu) {
    return {};
  }

  return {
    cx: (0, _selectors.getThreadContext)(state),
    blackboxedRanges: (0, _selectors.getBlackBoxRanges)(state),
    isPaused: (0, _selectors.getIsCurrentThreadPaused)(state),
    hasMappedLocation: (props.selectedSource.isOriginal || (0, _selectors.isSourceWithMap)(state, props.selectedSource.id) || (0, _source.isPretty)(props.selectedSource)) && !(0, _selectors.getPrettySource)(state, props.selectedSource.id)
  };
};

const mapDispatchToProps = dispatch => ({
  editorActions: (0, _editor2.editorItemActions)(dispatch)
});

var _default = (0, _connect.connect)(mapStateToProps, mapDispatchToProps)(EditorMenu);

exports.default = _default;