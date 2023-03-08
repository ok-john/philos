"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addExpression = addExpression;
exports.autocomplete = autocomplete;
exports.clearAutocomplete = clearAutocomplete;
exports.clearExpressionError = clearExpressionError;
exports.updateExpression = updateExpression;
exports.deleteExpression = deleteExpression;
exports.evaluateExpressions = evaluateExpressions;
exports.getMappedExpression = getMappedExpression;
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_promise", "devtools/client/debugger/src/actions/utils/middleware/promise");
loader.lazyRequireGetter(this, "_expressions", "devtools/client/debugger/src/utils/expressions");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Add expression for debugger to watch
 *
 * @param {object} expression
 * @param {number} expression.id
 * @memberof actions/pause
 * @static
 */
function addExpression(cx, input) {
  return async ({
    dispatch,
    getState,
    parserWorker
  }) => {
    if (!input) {
      return null;
    }

    const expressionError = await parserWorker.hasSyntaxError(input);
    const expression = (0, _selectors.getExpression)(getState(), input);

    if (expression) {
      return dispatch(evaluateExpression(cx, expression));
    }

    dispatch({
      type: "ADD_EXPRESSION",
      cx,
      input,
      expressionError
    });
    const newExpression = (0, _selectors.getExpression)(getState(), input);

    if (newExpression) {
      return dispatch(evaluateExpression(cx, newExpression));
    }

    return null;
  };
}

function autocomplete(cx, input, cursor) {
  return async ({
    dispatch,
    getState,
    client
  }) => {
    if (!input) {
      return;
    }

    const frameId = (0, _selectors.getSelectedFrameId)(getState(), cx.thread);
    const result = await client.autocomplete(input, cursor, frameId);
    dispatch({
      type: "AUTOCOMPLETE",
      cx,
      input,
      result
    });
  };
}

function clearAutocomplete() {
  return {
    type: "CLEAR_AUTOCOMPLETE"
  };
}

function clearExpressionError() {
  return {
    type: "CLEAR_EXPRESSION_ERROR"
  };
}

function updateExpression(cx, input, expression) {
  return async ({
    dispatch,
    getState,
    parserWorker
  }) => {
    if (!input) {
      return;
    }

    const expressionError = await parserWorker.hasSyntaxError(input);
    dispatch({
      type: "UPDATE_EXPRESSION",
      cx,
      expression,
      input: expressionError ? expression.input : input,
      expressionError
    });
    dispatch(evaluateExpressions(cx));
  };
}
/**
 *
 * @param {object} expression
 * @param {number} expression.id
 * @memberof actions/pause
 * @static
 */


function deleteExpression(expression) {
  return ({
    dispatch
  }) => {
    dispatch({
      type: "DELETE_EXPRESSION",
      input: expression.input
    });
  };
}
/**
 *
 * @memberof actions/pause
 * @param {number} selectedFrameId
 * @static
 */


function evaluateExpressions(cx) {
  return async function ({
    dispatch,
    getState,
    client
  }) {
    const expressions = (0, _selectors.getExpressions)(getState());
    const inputs = expressions.map(({
      input
    }) => input);
    const frameId = (0, _selectors.getSelectedFrameId)(getState(), cx.thread);
    const results = await client.evaluateExpressions(inputs, {
      frameId,
      threadId: cx.thread
    });
    dispatch({
      type: "EVALUATE_EXPRESSIONS",
      cx,
      inputs,
      results
    });
  };
}

function evaluateExpression(cx, expression) {
  return async function ({
    dispatch,
    getState,
    client
  }) {
    if (!expression.input) {
      console.warn("Expressions should not be empty");
      return null;
    }

    let {
      input
    } = expression;
    const frame = (0, _selectors.getSelectedFrame)(getState(), cx.thread);

    if (frame) {
      const source = (0, _selectors.getLocationSource)(getState(), frame.location);
      const selectedSource = (0, _selectors.getSelectedSource)(getState());

      if (selectedSource && source.isOriginal && selectedSource.isOriginal) {
        const mapResult = await dispatch(getMappedExpression(input));

        if (mapResult) {
          input = mapResult.expression;
        }
      }
    }

    const frameId = (0, _selectors.getSelectedFrameId)(getState(), cx.thread);
    return dispatch({
      type: "EVALUATE_EXPRESSION",
      cx,
      thread: cx.thread,
      input: expression.input,
      [_promise.PROMISE]: client.evaluate((0, _expressions.wrapExpression)(input), {
        frameId
      })
    });
  };
}
/**
 * Gets information about original variable names from the source map
 * and replaces all posible generated names.
 */


function getMappedExpression(expression) {
  return async function ({
    dispatch,
    getState,
    parserWorker
  }) {
    const thread = (0, _selectors.getCurrentThread)(getState());
    const mappings = (0, _selectors.getSelectedScopeMappings)(getState(), thread);
    const bindings = (0, _selectors.getSelectedFrameBindings)(getState(), thread); // We bail early if we do not need to map the expression. This is important
    // because mapping an expression can be slow if the parserWorker
    // worker is busy doing other work.
    //
    // 1. there are no mappings - we do not need to map original expressions
    // 2. does not contain `await` - we do not need to map top level awaits
    // 3. does not contain `=` - we do not need to map assignments

    const shouldMapScopes = (0, _selectors.isMapScopesEnabled)(getState()) && mappings;

    if (!shouldMapScopes && !expression.match(/(await|=)/)) {
      return null;
    }

    return parserWorker.mapExpression(expression, mappings, bindings || [], _prefs.features.mapExpressionBindings && (0, _selectors.getIsPaused)(getState(), thread), _prefs.features.mapAwaitExpression);
  };
}