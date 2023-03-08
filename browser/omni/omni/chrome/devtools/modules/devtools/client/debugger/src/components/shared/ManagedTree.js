"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const Tree = require("devtools/client/shared/components/Tree");

class ManagedTree extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "setExpanded", (item, isExpanded, shouldIncludeChildren) => {
      const {
        expanded
      } = this.state;
      let changed = false;

      const expandItem = i => {
        const path = this.props.getPath(i);

        if (isExpanded) {
          changed |= !expanded.has(path);
          expanded.add(path);
        } else {
          changed |= expanded.has(path);
          expanded.delete(path);
        }
      };

      expandItem(item);

      if (shouldIncludeChildren) {
        let parents = [item];

        while (parents.length) {
          const children = [];

          for (const parent of parents) {
            for (const child of this.props.getChildren(parent)) {
              expandItem(child);
              children.push(child);
            }
          }

          parents = children;
        }
      }

      if (changed) {
        this.setState({
          expanded
        });

        if (isExpanded && this.props.onExpand) {
          this.props.onExpand(item, expanded);
        } else if (!isExpanded && this.props.onCollapse) {
          this.props.onCollapse(item, expanded);
        }
      }
    });

    this.state = {
      expanded: props.expanded || new Set()
    };
  }

  static get propTypes() {
    return {
      expanded: _propTypes.default.object,
      focused: _propTypes.default.any,
      getPath: _propTypes.default.func.isRequired,
      highlightItems: _propTypes.default.array,
      onCollapse: _propTypes.default.func.isRequired,
      onExpand: _propTypes.default.func.isRequired,
      onFocus: _propTypes.default.func.isRequired,
      renderItem: _propTypes.default.func.isRequired
    };
  } // FIXME: https://bugzilla.mozilla.org/show_bug.cgi?id=1774507


  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      highlightItems
    } = this.props;

    if (nextProps.highlightItems && nextProps.highlightItems != highlightItems && nextProps.highlightItems.length) {
      this.highlightItem(nextProps.highlightItems);
    }
  }

  highlightItem(highlightItems) {
    const {
      expanded
    } = this.state;
    highlightItems.forEach(item => {
      expanded.add(this.props.getPath(item));
    });
    this.props.onFocus(highlightItems[0]);
    this.setState({
      expanded
    });
  }

  render() {
    const {
      expanded
    } = this.state;
    return _react.default.createElement("div", {
      className: "managed-tree"
    }, _react.default.createElement(Tree, _extends({}, this.props, {
      isExpanded: item => expanded.has(this.props.getPath(item)),
      focused: this.props.focused,
      getKey: this.props.getPath,
      onExpand: (item, shouldIncludeChildren) => this.setExpanded(item, true, shouldIncludeChildren),
      onCollapse: (item, shouldIncludeChildren) => this.setExpanded(item, false, shouldIncludeChildren),
      onFocus: this.props.onFocus,
      renderItem: (...args) => this.props.renderItem(...args, {
        setExpanded: this.setExpanded
      })
    })));
  }

}

_defineProperty(ManagedTree, "defaultProps", {
  onFocus: () => {}
});

var _default = ManagedTree;
exports.default = _default;