"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _classnames = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["classnames"]);

loader.lazyRequireGetter(this, "_menu", "devtools/client/debugger/src/context-menu/menu");

var _SourceIcon = _interopRequireDefault(require("../shared/SourceIcon"));

var _AccessibleImage = _interopRequireDefault(require("../shared/AccessibleImage"));

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

var _actions = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_clipboard", "devtools/client/debugger/src/utils/clipboard");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_utils", "devtools/client/debugger/src/utils/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class SourceTreeItem extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "onClick", e => {
      const {
        item,
        focusItem,
        selectSourceItem
      } = this.props;
      focusItem(item);

      if (item.type == "source") {
        selectSourceItem(item);
      }
    });

    _defineProperty(this, "onContextMenu", event => {
      const copySourceUri2Label = L10N.getStr("copySourceUri2");
      const copySourceUri2Key = L10N.getStr("copySourceUri2.accesskey");
      const setDirectoryRootLabel = L10N.getStr("setDirectoryRoot.label");
      const setDirectoryRootKey = L10N.getStr("setDirectoryRoot.accesskey");
      const removeDirectoryRootLabel = L10N.getStr("removeDirectoryRoot.label");
      event.stopPropagation();
      event.preventDefault();
      const menuOptions = [];
      const {
        item
      } = this.props;

      if (item.type == "source") {
        const {
          source
        } = item;
        const copySourceUri2 = {
          id: "node-menu-copy-source",
          label: copySourceUri2Label,
          accesskey: copySourceUri2Key,
          disabled: false,
          click: () => (0, _clipboard.copyToTheClipboard)(source.url)
        };
        const {
          cx
        } = this.props;
        const blackBoxMenuItem = {
          id: "node-menu-blackbox",
          label: this.props.isSourceBlackBoxed ? L10N.getStr("ignoreContextItem.unignore") : L10N.getStr("ignoreContextItem.ignore"),
          accesskey: this.props.isSourceBlackBoxed ? L10N.getStr("ignoreContextItem.unignore.accesskey") : L10N.getStr("ignoreContextItem.ignore.accesskey"),
          disabled: !(0, _source.shouldBlackbox)(source),
          click: () => this.props.toggleBlackBox(cx, source)
        };
        const downloadFileItem = {
          id: "node-menu-download-file",
          label: L10N.getStr("downloadFile.label"),
          accesskey: L10N.getStr("downloadFile.accesskey"),
          disabled: false,
          click: () => this.handleDownloadFile(cx, source)
        };
        menuOptions.push(copySourceUri2, blackBoxMenuItem, downloadFileItem);
      } // All other types other than source are folder-like


      if (item.type != "source") {
        this.addCollapseExpandAllOptions(menuOptions, item);

        if (_prefs.features.root) {
          const {
            cx,
            depth,
            projectRoot
          } = this.props;

          if (projectRoot == item.uniquePath) {
            menuOptions.push({
              id: "node-remove-directory-root",
              label: removeDirectoryRootLabel,
              disabled: false,
              click: () => this.props.clearProjectDirectoryRoot(cx)
            });
          } else {
            menuOptions.push({
              id: "node-set-directory-root",
              label: setDirectoryRootLabel,
              accesskey: setDirectoryRootKey,
              disabled: false,
              click: () => this.props.setProjectDirectoryRoot(cx, item.uniquePath, this.renderItemName(depth))
            });
          }
        }

        this.addBlackboxAllOption(menuOptions, item);
      }

      (0, _menu.showMenu)(event, menuOptions);
    });

    _defineProperty(this, "handleDownloadFile", async (cx, source) => {
      if (!source) {
        return;
      }

      const data = await this.props.loadSourceText(cx, source);

      if (!data) {
        return;
      }

      (0, _utils.downloadFile)(data.value, source.displayURL.filename);
    });

    _defineProperty(this, "addBlackboxAllOption", (menuOptions, item) => {
      const {
        cx,
        depth,
        projectRoot
      } = this.props;
      const {
        sourcesInside,
        sourcesOutside,
        allInsideBlackBoxed,
        allOutsideBlackBoxed
      } = this.props.getBlackBoxSourcesGroups(item);
      let blackBoxInsideMenuItemLabel;
      let blackBoxOutsideMenuItemLabel;

      if (depth === 0 || depth === 1 && projectRoot === "") {
        blackBoxInsideMenuItemLabel = allInsideBlackBoxed ? L10N.getStr("unignoreAllInGroup.label") : L10N.getStr("ignoreAllInGroup.label");

        if (sourcesOutside.length) {
          blackBoxOutsideMenuItemLabel = allOutsideBlackBoxed ? L10N.getStr("unignoreAllOutsideGroup.label") : L10N.getStr("ignoreAllOutsideGroup.label");
        }
      } else {
        blackBoxInsideMenuItemLabel = allInsideBlackBoxed ? L10N.getStr("unignoreAllInDir.label") : L10N.getStr("ignoreAllInDir.label");

        if (sourcesOutside.length) {
          blackBoxOutsideMenuItemLabel = allOutsideBlackBoxed ? L10N.getStr("unignoreAllOutsideDir.label") : L10N.getStr("ignoreAllOutsideDir.label");
        }
      }

      const blackBoxInsideMenuItem = {
        id: allInsideBlackBoxed ? "node-unblackbox-all-inside" : "node-blackbox-all-inside",
        label: blackBoxInsideMenuItemLabel,
        disabled: false,
        click: () => this.props.blackBoxSources(cx, sourcesInside, !allInsideBlackBoxed)
      };

      if (sourcesOutside.length) {
        menuOptions.push({
          id: "node-blackbox-all",
          label: L10N.getStr("ignoreAll.label"),
          submenu: [blackBoxInsideMenuItem, {
            id: allOutsideBlackBoxed ? "node-unblackbox-all-outside" : "node-blackbox-all-outside",
            label: blackBoxOutsideMenuItemLabel,
            disabled: false,
            click: () => this.props.blackBoxSources(cx, sourcesOutside, !allOutsideBlackBoxed)
          }]
        });
      } else {
        menuOptions.push(blackBoxInsideMenuItem);
      }
    });

    _defineProperty(this, "addCollapseExpandAllOptions", (menuOptions, item) => {
      const {
        setExpanded
      } = this.props;
      menuOptions.push({
        id: "node-menu-collapse-all",
        label: L10N.getStr("collapseAll.label"),
        disabled: false,
        click: () => setExpanded(item, false, true)
      });
      menuOptions.push({
        id: "node-menu-expand-all",
        label: L10N.getStr("expandAll.label"),
        disabled: false,
        click: () => setExpanded(item, true, true)
      });
    });
  }

  static get propTypes() {
    return {
      autoExpand: _propTypes.default.bool.isRequired,
      blackBoxSources: _propTypes.default.func.isRequired,
      clearProjectDirectoryRoot: _propTypes.default.func.isRequired,
      cx: _propTypes.default.object.isRequired,
      depth: _propTypes.default.number.isRequired,
      expanded: _propTypes.default.bool.isRequired,
      focusItem: _propTypes.default.func.isRequired,
      focused: _propTypes.default.bool.isRequired,
      getBlackBoxSourcesGroups: _propTypes.default.func.isRequired,
      hasMatchingGeneratedSource: _propTypes.default.bool.isRequired,
      item: _propTypes.default.object.isRequired,
      loadSourceText: _propTypes.default.func.isRequired,
      getFirstSourceActorForGeneratedSource: _propTypes.default.func.isRequired,
      projectRoot: _propTypes.default.string.isRequired,
      selectSourceItem: _propTypes.default.func.isRequired,
      setExpanded: _propTypes.default.func.isRequired,
      setProjectDirectoryRoot: _propTypes.default.func.isRequired,
      toggleBlackBox: _propTypes.default.func.isRequired,
      isSourceBlackBoxed: _propTypes.default.bool.isRequired,
      getParent: _propTypes.default.func.isRequired
    };
  }

  componentDidMount() {
    const {
      autoExpand,
      item
    } = this.props;

    if (autoExpand) {
      this.props.setExpanded(item, true, false);
    }
  }

  renderItemArrow() {
    const {
      item,
      expanded
    } = this.props;
    return item.type != "source" ? _react.default.createElement(_AccessibleImage.default, {
      className: (0, _classnames.default)("arrow", {
        expanded
      })
    }) : _react.default.createElement("span", {
      className: "img no-arrow"
    });
  }

  renderIcon(item, depth) {
    if (item.type == "thread") {
      const icon = item.thread.targetType.includes("worker") ? "worker" : "window";
      return _react.default.createElement(_AccessibleImage.default, {
        className: (0, _classnames.default)(icon)
      });
    }

    if (item.type == "group") {
      if (item.groupName === "Webpack") {
        return _react.default.createElement(_AccessibleImage.default, {
          className: "webpack"
        });
      } else if (item.groupName === "Angular") {
        return _react.default.createElement(_AccessibleImage.default, {
          className: "angular"
        });
      } // Check if the group relates to an extension.
      // This happens when a webextension injects a content script.


      if (item.isForExtensionSource) {
        return _react.default.createElement(_AccessibleImage.default, {
          className: "extension"
        });
      }

      return _react.default.createElement(_AccessibleImage.default, {
        className: "globe-small"
      });
    }

    if (item.type == "directory") {
      return _react.default.createElement(_AccessibleImage.default, {
        className: "folder"
      });
    }

    if (item.type == "source") {
      const {
        source
      } = item;
      return _react.default.createElement(_SourceIcon.default, {
        source: source,
        modifier: icon => // In the SourceTree, extension files should use the file-extension based icon,
        // whereas we use the extension icon in other Components (eg. source tabs and breakpoints pane).
        icon === "extension" ? _source.sourceTypes[source.displayURL.fileExtension] || "javascript" : icon
      });
    }

    return null;
  }

  renderItemName(depth) {
    const {
      item
    } = this.props;

    if (item.type == "thread") {
      const {
        thread
      } = item;
      return thread.name + (thread.serviceWorkerStatus ? ` (${thread.serviceWorkerStatus})` : "");
    }

    if (item.type == "group") {
      return unescape(item.groupName);
    }

    if (item.type == "directory") {
      const parentItem = this.props.getParent(item);
      return item.path.replace(parentItem.path, "").replace(/^\//, "");
    }

    if (item.type == "source") {
      const {
        displayURL
      } = item.source;
      const name = displayURL.filename + (displayURL.search ? displayURL.search : "");
      return unescape(name);
    }

    return null;
  }

  renderItemTooltip() {
    const {
      item
    } = this.props;

    if (item.type == "thread") {
      return item.thread.name;
    }

    if (item.type == "group") {
      return item.groupName;
    }

    if (item.type == "directory") {
      return item.path;
    }

    if (item.type == "source") {
      return item.source.url;
    }

    return null;
  }

  render() {
    const {
      item,
      depth,
      focused,
      hasMatchingGeneratedSource
    } = this.props;
    const suffix = hasMatchingGeneratedSource ? _react.default.createElement("span", {
      className: "suffix"
    }, L10N.getStr("sourceFooter.mappedSuffix")) : null;
    return _react.default.createElement("div", {
      className: (0, _classnames.default)("node", {
        focused
      }),
      key: item.path,
      onClick: this.onClick,
      onContextMenu: this.onContextMenu,
      title: this.renderItemTooltip()
    }, this.renderItemArrow(), this.renderIcon(item, depth), _react.default.createElement("span", {
      className: "label"
    }, this.renderItemName(depth), suffix));
  }

}

function getHasMatchingGeneratedSource(state, source) {
  if (!source || !source.isOriginal) {
    return false;
  }

  return !!(0, _selectors.getGeneratedSourceByURL)(state, source.url);
}

const mapStateToProps = (state, props) => {
  const {
    item
  } = props;

  if (item.type == "source") {
    const {
      source
    } = item;
    return {
      cx: (0, _selectors.getContext)(state),
      hasMatchingGeneratedSource: getHasMatchingGeneratedSource(state, source),
      getFirstSourceActorForGeneratedSource: (sourceId, threadId) => (0, _selectors.getFirstSourceActorForGeneratedSource)(state, sourceId, threadId)
    };
  }

  return {
    cx: (0, _selectors.getContext)(state),
    getFirstSourceActorForGeneratedSource: (sourceId, threadId) => (0, _selectors.getFirstSourceActorForGeneratedSource)(state, sourceId, threadId)
  };
};

var _default = (0, _connect.connect)(mapStateToProps, {
  setProjectDirectoryRoot: _actions.default.setProjectDirectoryRoot,
  clearProjectDirectoryRoot: _actions.default.clearProjectDirectoryRoot,
  toggleBlackBox: _actions.default.toggleBlackBox,
  loadSourceText: _actions.default.loadSourceText,
  blackBoxSources: _actions.default.blackBoxSources,
  setBlackBoxAllOutside: _actions.default.setBlackBoxAllOutside
})(SourceTreeItem);

exports.default = _default;