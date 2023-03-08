"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _classnames = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["classnames"]);

loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

var _index = require("devtools/client/shared/components/reps/index");

var _actions = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_expressions", "devtools/client/debugger/src/utils/expressions");
loader.lazyRequireGetter(this, "_evaluationResult", "devtools/client/debugger/src/utils/evaluation-result");
loader.lazyRequireGetter(this, "_Button", "devtools/client/debugger/src/components/shared/Button/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  debounce
} = require("devtools/shared/debounce");

const {
  ObjectInspector
} = _index.objectInspector;

class Expressions extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "clear", () => {
      this.setState(() => {
        this.props.clearExpressionError();
        return {
          editing: false,
          editIndex: -1,
          inputValue: "",
          focused: false
        };
      });
    });

    _defineProperty(this, "handleChange", e => {
      const {
        target
      } = e;

      if (_prefs.features.autocompleteExpression) {
        this.findAutocompleteMatches(target.value, target.selectionStart);
      }

      this.setState({
        inputValue: target.value
      });
    });

    _defineProperty(this, "findAutocompleteMatches", debounce((value, selectionStart) => {
      const {
        autocomplete
      } = this.props;
      autocomplete(this.props.cx, value, selectionStart);
    }, 250));

    _defineProperty(this, "handleKeyDown", e => {
      if (e.key === "Escape") {
        this.clear();
      }
    });

    _defineProperty(this, "hideInput", () => {
      this.setState({
        focused: false
      });
      this.props.onExpressionAdded();
      this.props.clearExpressionError();
    });

    _defineProperty(this, "createElement", element => {
      return document.createElement(element);
    });

    _defineProperty(this, "onFocus", () => {
      this.setState({
        focused: true
      });
    });

    _defineProperty(this, "handleExistingSubmit", async (e, expression) => {
      e.preventDefault();
      e.stopPropagation();
      this.props.updateExpression(this.props.cx, this.state.inputValue, expression);
    });

    _defineProperty(this, "handleNewSubmit", async e => {
      const {
        inputValue
      } = this.state;
      e.preventDefault();
      e.stopPropagation();
      this.props.clearExpressionError();
      await this.props.addExpression(this.props.cx, this.state.inputValue);
      this.setState({
        editing: false,
        editIndex: -1,
        inputValue: this.props.expressionError ? inputValue : ""
      });
      this.props.clearAutocomplete();
    });

    _defineProperty(this, "renderExpression", (expression, index) => {
      const {
        expressionError,
        openLink,
        openElementInInspector,
        highlightDomElement,
        unHighlightDomElement
      } = this.props;
      const {
        editing,
        editIndex
      } = this.state;
      const {
        input,
        updating
      } = expression;
      const isEditingExpr = editing && editIndex === index;

      if (isEditingExpr || isEditingExpr && expressionError) {
        return this.renderExpressionEditInput(expression);
      }

      if (updating) {
        return null;
      }

      let value = (0, _expressions.getValue)(expression);
      let front = null;

      if (value && value.unavailable !== true) {
        value = (0, _evaluationResult.getGrip)(value);
        front = (0, _evaluationResult.getFront)(value);
      }

      const root = {
        name: expression.input,
        path: input,
        contents: {
          value,
          front
        }
      };
      return _react.default.createElement("li", {
        className: "expression-container",
        key: input,
        title: expression.input
      }, _react.default.createElement("div", {
        className: "expression-content"
      }, _react.default.createElement(ObjectInspector, {
        roots: [root],
        autoExpandDepth: 0,
        disableWrap: true,
        openLink: openLink,
        createElement: this.createElement,
        onDoubleClick: (items, {
          depth
        }) => {
          if (depth === 0) {
            this.editExpression(expression, index);
          }
        },
        onDOMNodeClick: grip => openElementInInspector(grip),
        onInspectIconClick: grip => openElementInInspector(grip),
        onDOMNodeMouseOver: grip => highlightDomElement(grip),
        onDOMNodeMouseOut: grip => unHighlightDomElement(grip),
        shouldRenderTooltip: true,
        mayUseCustomFormatter: true
      }), _react.default.createElement("div", {
        className: "expression-container__close-btn"
      }, _react.default.createElement(_Button.CloseButton, {
        handleClick: e => this.deleteExpression(e, expression),
        tooltip: L10N.getStr("expressions.remove.tooltip")
      }))));
    });

    this.state = {
      editing: false,
      editIndex: -1,
      inputValue: "",
      focused: false
    };
  }

  static get propTypes() {
    return {
      addExpression: _propTypes.default.func.isRequired,
      autocomplete: _propTypes.default.func.isRequired,
      autocompleteMatches: _propTypes.default.array,
      clearAutocomplete: _propTypes.default.func.isRequired,
      clearExpressionError: _propTypes.default.func.isRequired,
      cx: _propTypes.default.object.isRequired,
      deleteExpression: _propTypes.default.func.isRequired,
      expressionError: _propTypes.default.bool.isRequired,
      expressions: _propTypes.default.array.isRequired,
      highlightDomElement: _propTypes.default.func.isRequired,
      onExpressionAdded: _propTypes.default.func.isRequired,
      openElementInInspector: _propTypes.default.func.isRequired,
      openLink: _propTypes.default.any.isRequired,
      showInput: _propTypes.default.bool.isRequired,
      unHighlightDomElement: _propTypes.default.func.isRequired,
      updateExpression: _propTypes.default.func.isRequired
    };
  }

  componentDidMount() {
    const {
      showInput
    } = this.props; // Ensures that the input is focused when the "+"
    // is clicked while the panel is collapsed

    if (showInput && this._input) {
      this._input.focus();
    }
  }

  // FIXME: https://bugzilla.mozilla.org/show_bug.cgi?id=1774507
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.editing && !nextProps.expressionError) {
      this.clear();
    } // Ensures that the add watch expression input
    // is no longer visible when the new watch expression is rendered


    if (this.props.expressions.length < nextProps.expressions.length) {
      this.hideInput();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      editing,
      inputValue,
      focused
    } = this.state;
    const {
      expressions,
      expressionError,
      showInput,
      autocompleteMatches
    } = this.props;
    return autocompleteMatches !== nextProps.autocompleteMatches || expressions !== nextProps.expressions || expressionError !== nextProps.expressionError || editing !== nextState.editing || inputValue !== nextState.inputValue || nextProps.showInput !== showInput || focused !== nextState.focused;
  }

  componentDidUpdate(prevProps, prevState) {
    const input = this._input;

    if (!input) {
      return;
    }

    if (!prevState.editing && this.state.editing) {
      input.setSelectionRange(0, input.value.length);
      input.focus();
    } else if (this.props.showInput && !this.state.focused) {
      input.focus();
    }
  }

  editExpression(expression, index) {
    this.setState({
      inputValue: expression.input,
      editing: true,
      editIndex: index
    });
  }

  deleteExpression(e, expression) {
    e.stopPropagation();
    const {
      deleteExpression
    } = this.props;
    deleteExpression(expression);
  }

  onBlur() {
    this.clear();
    this.hideInput();
  }

  renderExpressions() {
    const {
      expressions,
      showInput
    } = this.props;
    return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("ul", {
      className: "pane expressions-list"
    }, expressions.map(this.renderExpression)), showInput && this.renderNewExpressionInput());
  }

  renderAutoCompleteMatches() {
    if (!_prefs.features.autocompleteExpression) {
      return null;
    }

    const {
      autocompleteMatches
    } = this.props;

    if (autocompleteMatches) {
      return _react.default.createElement("datalist", {
        id: "autocomplete-matches"
      }, autocompleteMatches.map((match, index) => {
        return _react.default.createElement("option", {
          key: index,
          value: match
        });
      }));
    }

    return _react.default.createElement("datalist", {
      id: "autocomplete-matches"
    });
  }

  renderNewExpressionInput() {
    const {
      expressionError
    } = this.props;
    const {
      editing,
      inputValue,
      focused
    } = this.state;
    const error = editing === false && expressionError === true;
    const placeholder = error ? L10N.getStr("expressions.errorMsg") : L10N.getStr("expressions.placeholder");
    return _react.default.createElement("form", {
      className: (0, _classnames.default)("expression-input-container expression-input-form", {
        focused,
        error
      }),
      onSubmit: this.handleNewSubmit
    }, _react.default.createElement("input", _extends({
      className: "input-expression",
      type: "text",
      placeholder: placeholder,
      onChange: this.handleChange,
      onBlur: this.hideInput,
      onKeyDown: this.handleKeyDown,
      onFocus: this.onFocus,
      value: !editing ? inputValue : "",
      ref: c => this._input = c
    }, _prefs.features.autocompleteExpression && {
      list: "autocomplete-matches"
    })), this.renderAutoCompleteMatches(), _react.default.createElement("input", {
      type: "submit",
      style: {
        display: "none"
      }
    }));
  }

  renderExpressionEditInput(expression) {
    const {
      expressionError
    } = this.props;
    const {
      inputValue,
      editing,
      focused
    } = this.state;
    const error = editing === true && expressionError === true;
    return _react.default.createElement("form", {
      key: expression.input,
      className: (0, _classnames.default)("expression-input-container expression-input-form", {
        focused,
        error
      }),
      onSubmit: e => this.handleExistingSubmit(e, expression)
    }, _react.default.createElement("input", _extends({
      className: (0, _classnames.default)("input-expression", {
        error
      }),
      type: "text",
      onChange: this.handleChange,
      onBlur: this.clear,
      onKeyDown: this.handleKeyDown,
      onFocus: this.onFocus,
      value: editing ? inputValue : expression.input,
      ref: c => this._input = c
    }, _prefs.features.autocompleteExpression && {
      list: "autocomplete-matches"
    })), this.renderAutoCompleteMatches(), _react.default.createElement("input", {
      type: "submit",
      style: {
        display: "none"
      }
    }));
  }

  render() {
    const {
      expressions
    } = this.props;

    if (expressions.length === 0) {
      return this.renderNewExpressionInput();
    }

    return this.renderExpressions();
  }

}

const mapStateToProps = state => ({
  cx: (0, _selectors.getThreadContext)(state),
  autocompleteMatches: (0, _selectors.getAutocompleteMatchset)(state),
  expressions: (0, _selectors.getExpressions)(state),
  expressionError: (0, _selectors.getExpressionError)(state)
});

var _default = (0, _connect.connect)(mapStateToProps, {
  autocomplete: _actions.default.autocomplete,
  clearAutocomplete: _actions.default.clearAutocomplete,
  addExpression: _actions.default.addExpression,
  clearExpressionError: _actions.default.clearExpressionError,
  updateExpression: _actions.default.updateExpression,
  deleteExpression: _actions.default.deleteExpression,
  openLink: _actions.default.openLink,
  openElementInInspector: _actions.default.openElementInInspectorCommand,
  highlightDomElement: _actions.default.highlightDomElement,
  unHighlightDomElement: _actions.default.unHighlightDomElement
})(Expressions);

exports.default = _default;