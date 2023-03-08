"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_frames", "devtools/client/debugger/src/utils/pause/frames/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const IGNORED_SOURCE_URLS = ["debugger eval code"];

class PreviewFunction extends _react.Component {
  static get propTypes() {
    return {
      func: _propTypes.default.object.isRequired
    };
  }

  renderFunctionName(func) {
    const {
      l10n
    } = this.context;
    const name = (0, _frames.formatDisplayName)(func, undefined, l10n);
    return _react.default.createElement("span", {
      className: "function-name"
    }, name);
  }

  renderParams(func) {
    const {
      parameterNames = []
    } = func;
    return parameterNames.filter(Boolean).map((param, i, arr) => {
      const elements = [_react.default.createElement("span", {
        className: "param",
        key: param
      }, param)]; // if this isn't the last param, add a comma

      if (i !== arr.length - 1) {
        elements.push(_react.default.createElement("span", {
          className: "delimiter",
          key: i
        }, ", "));
      }

      return elements;
    }).flat();
  }

  jumpToDefinitionButton(func) {
    const {
      location
    } = func;

    if (!(location === null || location === void 0 ? void 0 : location.url) || IGNORED_SOURCE_URLS.includes(location.url)) {
      return null;
    }

    const lastIndex = location.url.lastIndexOf("/");
    return _react.default.createElement("button", {
      className: "jump-definition",
      draggable: "false",
      title: `${location.url.slice(lastIndex + 1)}:${location.line}`
    });
  }

  render() {
    const {
      func
    } = this.props;
    return _react.default.createElement("span", {
      className: "function-signature"
    }, this.renderFunctionName(func), _react.default.createElement("span", {
      className: "paren"
    }, "("), this.renderParams(func), _react.default.createElement("span", {
      className: "paren"
    }, ")"), this.jumpToDefinitionButton(func));
  }

}

exports.default = PreviewFunction;
PreviewFunction.contextTypes = {
  l10n: _propTypes.default.object
};