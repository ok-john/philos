"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_menu", "devtools/client/debugger/src/context-menu/menu");
loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _actions = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_scopes", "devtools/client/debugger/src/utils/pause/scopes/index");
loader.lazyRequireGetter(this, "_utils", "devtools/client/debugger/src/utils/pause/scopes/utils");

var _index = require("devtools/client/shared/components/reps/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  ObjectInspector
} = _index.objectInspector;

class Scopes extends _react.PureComponent {
  constructor(props) {
    const {
      why,
      selectedFrame,
      originalFrameScopes,
      generatedFrameScopes
    } = props;
    super(props);

    _defineProperty(this, "onToggleMapScopes", () => {
      this.props.toggleMapScopes();
    });

    _defineProperty(this, "onContextMenu", (event, item) => {
      const {
        addWatchpoint,
        removeWatchpoint
      } = this.props;

      if (!item.parent || !item.contents.configurable) {
        return;
      }

      if (!item.contents || item.contents.watchpoint) {
        const removeWatchpointLabel = L10N.getStr("watchpoints.removeWatchpoint");
        const removeWatchpointItem = {
          id: "node-menu-remove-watchpoint",
          label: removeWatchpointLabel,
          disabled: false,
          click: () => removeWatchpoint(item)
        };
        const menuItems = [removeWatchpointItem];
        (0, _menu.showMenu)(event, menuItems);
        return;
      }

      const addSetWatchpointLabel = L10N.getStr("watchpoints.setWatchpoint");
      const addGetWatchpointLabel = L10N.getStr("watchpoints.getWatchpoint");
      const addGetOrSetWatchpointLabel = L10N.getStr("watchpoints.getOrSetWatchpoint");
      const watchpointsSubmenuLabel = L10N.getStr("watchpoints.submenu");
      const addSetWatchpointItem = {
        id: "node-menu-add-set-watchpoint",
        label: addSetWatchpointLabel,
        disabled: false,
        click: () => addWatchpoint(item, "set")
      };
      const addGetWatchpointItem = {
        id: "node-menu-add-get-watchpoint",
        label: addGetWatchpointLabel,
        disabled: false,
        click: () => addWatchpoint(item, "get")
      };
      const addGetOrSetWatchpointItem = {
        id: "node-menu-add-get-watchpoint",
        label: addGetOrSetWatchpointLabel,
        disabled: false,
        click: () => addWatchpoint(item, "getorset")
      };
      const watchpointsSubmenuItem = {
        id: "node-menu-watchpoints",
        label: watchpointsSubmenuLabel,
        disabled: false,
        click: () => addWatchpoint(item, "set"),
        submenu: [addSetWatchpointItem, addGetWatchpointItem, addGetOrSetWatchpointItem]
      };
      const menuItems = [watchpointsSubmenuItem];
      (0, _menu.showMenu)(event, menuItems);
    });

    _defineProperty(this, "renderWatchpointButton", item => {
      const {
        removeWatchpoint
      } = this.props;

      if (!item || !item.contents || !item.contents.watchpoint || typeof L10N === "undefined") {
        return null;
      }

      const {
        watchpoint
      } = item.contents;
      return _react.default.createElement("button", {
        className: `remove-watchpoint-${watchpoint}`,
        title: L10N.getStr("watchpoints.removeWatchpointTooltip"),
        onClick: e => {
          e.stopPropagation();
          removeWatchpoint(item);
        }
      });
    });

    this.state = {
      originalScopes: (0, _scopes.getScopes)(why, selectedFrame, originalFrameScopes),
      generatedScopes: (0, _scopes.getScopes)(why, selectedFrame, generatedFrameScopes),
      showOriginal: true
    };
  }

  static get propTypes() {
    return {
      addWatchpoint: _propTypes.default.func.isRequired,
      cx: _propTypes.default.object.isRequired,
      expandedScopes: _propTypes.default.array.isRequired,
      generatedFrameScopes: _propTypes.default.object,
      highlightDomElement: _propTypes.default.func.isRequired,
      isLoading: _propTypes.default.bool.isRequired,
      isPaused: _propTypes.default.bool.isRequired,
      mapScopesEnabled: _propTypes.default.bool.isRequired,
      openElementInInspector: _propTypes.default.func.isRequired,
      openLink: _propTypes.default.func.isRequired,
      originalFrameScopes: _propTypes.default.object,
      removeWatchpoint: _propTypes.default.func.isRequired,
      selectedFrame: _propTypes.default.object.isRequired,
      setExpandedScope: _propTypes.default.func.isRequired,
      toggleMapScopes: _propTypes.default.func.isRequired,
      unHighlightDomElement: _propTypes.default.func.isRequired,
      why: _propTypes.default.object.isRequired
    };
  } // FIXME: https://bugzilla.mozilla.org/show_bug.cgi?id=1774507


  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      selectedFrame,
      originalFrameScopes,
      generatedFrameScopes,
      isPaused
    } = this.props;
    const isPausedChanged = isPaused !== nextProps.isPaused;
    const selectedFrameChanged = selectedFrame !== nextProps.selectedFrame;
    const originalFrameScopesChanged = originalFrameScopes !== nextProps.originalFrameScopes;
    const generatedFrameScopesChanged = generatedFrameScopes !== nextProps.generatedFrameScopes;

    if (isPausedChanged || selectedFrameChanged || originalFrameScopesChanged || generatedFrameScopesChanged) {
      this.setState({
        originalScopes: (0, _scopes.getScopes)(nextProps.why, nextProps.selectedFrame, nextProps.originalFrameScopes),
        generatedScopes: (0, _scopes.getScopes)(nextProps.why, nextProps.selectedFrame, nextProps.generatedFrameScopes)
      });
    }
  }

  renderScopesList() {
    const {
      cx,
      isLoading,
      openLink,
      openElementInInspector,
      highlightDomElement,
      unHighlightDomElement,
      mapScopesEnabled,
      setExpandedScope,
      expandedScopes
    } = this.props;
    const {
      originalScopes,
      generatedScopes,
      showOriginal
    } = this.state;
    const scopes = showOriginal && mapScopesEnabled && originalScopes || generatedScopes;

    function initiallyExpanded(item) {
      return expandedScopes.some(path => path == (0, _utils.getScopeItemPath)(item));
    }

    if (scopes && !!scopes.length && !isLoading) {
      return _react.default.createElement("div", {
        className: "pane scopes-list"
      }, _react.default.createElement(ObjectInspector, {
        roots: scopes,
        autoExpandAll: false,
        autoExpandDepth: 1,
        disableWrap: true,
        dimTopLevelWindow: true,
        openLink: openLink,
        onDOMNodeClick: grip => openElementInInspector(grip),
        onInspectIconClick: grip => openElementInInspector(grip),
        onDOMNodeMouseOver: grip => highlightDomElement(grip),
        onDOMNodeMouseOut: grip => unHighlightDomElement(grip),
        onContextMenu: this.onContextMenu,
        setExpanded: (path, expand) => setExpandedScope(cx, path, expand),
        initiallyExpanded: initiallyExpanded,
        renderItemActions: this.renderWatchpointButton,
        shouldRenderTooltip: true
      }));
    }

    let stateText = L10N.getStr("scopes.notPaused");

    if (this.props.isPaused) {
      if (isLoading) {
        stateText = L10N.getStr("loadingText");
      } else {
        stateText = L10N.getStr("scopes.notAvailable");
      }
    }

    return _react.default.createElement("div", {
      className: "pane scopes-list"
    }, _react.default.createElement("div", {
      className: "pane-info"
    }, stateText));
  }

  render() {
    return _react.default.createElement("div", {
      className: "scopes-content"
    }, this.renderScopesList());
  }

}

const mapStateToProps = state => {
  const cx = (0, _selectors.getThreadContext)(state);
  const selectedFrame = (0, _selectors.getSelectedFrame)(state, cx.thread);
  const selectedSource = (0, _selectors.getSelectedSource)(state);
  const {
    scope: originalFrameScopes,
    pending: originalPending
  } = (0, _selectors.getOriginalFrameScope)(state, cx.thread, selectedSource === null || selectedSource === void 0 ? void 0 : selectedSource.id, selectedFrame === null || selectedFrame === void 0 ? void 0 : selectedFrame.id) || {
    scope: null,
    pending: false
  };
  const {
    scope: generatedFrameScopes,
    pending: generatedPending
  } = (0, _selectors.getGeneratedFrameScope)(state, cx.thread, selectedFrame === null || selectedFrame === void 0 ? void 0 : selectedFrame.id) || {
    scope: null,
    pending: false
  };
  return {
    cx,
    selectedFrame,
    mapScopesEnabled: (0, _selectors.isMapScopesEnabled)(state),
    isLoading: generatedPending || originalPending,
    why: (0, _selectors.getPauseReason)(state, cx.thread),
    originalFrameScopes,
    generatedFrameScopes,
    expandedScopes: (0, _selectors.getLastExpandedScopes)(state, cx.thread),
    isPaused: (0, _selectors.getIsCurrentThreadPaused)(state)
  };
};

var _default = (0, _connect.connect)(mapStateToProps, {
  openLink: _actions.default.openLink,
  openElementInInspector: _actions.default.openElementInInspectorCommand,
  highlightDomElement: _actions.default.highlightDomElement,
  unHighlightDomElement: _actions.default.unHighlightDomElement,
  toggleMapScopes: _actions.default.toggleMapScopes,
  setExpandedScope: _actions.default.setExpandedScope,
  addWatchpoint: _actions.default.addWatchpoint,
  removeWatchpoint: _actions.default.removeWatchpoint
})(Scopes);

exports.default = _default;