! function(e, t) {
//     "object" == typeof exports && "undefined" != typeof module ? t(exports, require("react"), require("react-dom")) : "function" == typeof define && define.amd ? define(["exports", "react", "react-dom"], t) : t((e = e || self).ReactTransitionGroup = {}, e.React, e.ReactDOM)
// }(this, (function(e, t, n) {
//     "use strict";
//     var r = "default" in t ? t.default : t;

//     function o() {
//         return (o = Object.assign || function(e) {
//             for (var t = 1; t < arguments.length; t++) {
//                 var n = arguments[t];
//                 for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
//             }
//             return e
//         }).apply(this, arguments)
//     }

//     function i(e, t) {
//         if (null == e) return {};
//         var n, r, o = {},
//             i = Object.keys(e);
//         for (r = 0; r < i.length; r++) n = i[r], t.indexOf(n) >= 0 || (o[n] = e[n]);
//         return o
//     }

//     function a(e, t) {
//         e.prototype = Object.create(t.prototype), e.prototype.constructor = e, e.__proto__ = t
//     }

//     function s(e, t) {
//         return e(t = {
//             exports: {}
//         }, t.exports), t.exports
//         /** @license React v16.13.1
//          * react-is.production.min.js
//          *
//          * Copyright (c) Facebook, Inc. and its affiliates.
//          *
//          * This source code is licensed under the MIT license found in the
//          * LICENSE file in the root directory of this source tree.
//          */
//     }
//     n = n && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
//     var c = "function" == typeof Symbol && Symbol.for,
//         l = c ? Symbol.for("react.element") : 60103,
//         u = c ? Symbol.for("react.portal") : 60106,
//         p = c ? Symbol.for("react.fragment") : 60107,
//         d = c ? Symbol.for("react.strict_mode") : 60108,
//         f = c ? Symbol.for("react.profiler") : 60114,
//         h = c ? Symbol.for("react.provider") : 60109,
//         m = c ? Symbol.for("react.context") : 60110,
//         E = c ? Symbol.for("react.async_mode") : 60111,
//         y = c ? Symbol.for("react.concurrent_mode") : 60111,
//         x = c ? Symbol.for("react.forward_ref") : 60112,
//         v = c ? Symbol.for("react.suspense") : 60113,
//         g = c ? Symbol.for("react.suspense_list") : 60120,
//         b = c ? Symbol.for("react.memo") : 60115,
//         C = c ? Symbol.for("react.lazy") : 60116,
//         S = c ? Symbol.for("react.block") : 60121,
//         O = c ? Symbol.for("react.fundamental") : 60117,
//         N = c ? Symbol.for("react.responder") : 60118,
//         T = c ? Symbol.for("react.scope") : 60119;

//     function k(e) {
//         if ("object" == typeof e && null !== e) {
//             var t = e.$$typeof;
//             switch (t) {
//                 case l:
//                     switch (e = e.type) {
//                         case E:
//                         case y:
//                         case p:
//                         case f:
//                         case d:
//                         case v:
//                             return e;
//                         default:
//                             switch (e = e && e.$$typeof) {
//                                 case m:
//                                 case x:
//                                 case C:
//                                 case b:
//                                 case h:
//                                     return e;
//                                 default:
//                                     return t
//                             }
//                     }
//                 case u:
//                     return t
//             }
//         }
//     }

//     function P(e) {
//         return k(e) === y
//     }
//     var w = {
//             AsyncMode: E,
//             ConcurrentMode: y,
//             ContextConsumer: m,
//             ContextProvider: h,
//             Element: l,
//             ForwardRef: x,
//             Fragment: p,
//             Lazy: C,
//             Memo: b,
//             Portal: u,
//             Profiler: f,
//             StrictMode: d,
//             Suspense: v,
//             isAsyncMode: function(e) {
//                 return P(e) || k(e) === E
//             },
//             isConcurrentMode: P,
//             isContextConsumer: function(e) {
//                 return k(e) === m
//             },
//             isContextProvider: function(e) {
//                 return k(e) === h
//             },
//             isElement: function(e) {
//                 return "object" == typeof e && null !== e && e.$$typeof === l
//             },
//             isForwardRef: function(e) {
//                 return k(e) === x
//             },
//             isFragment: function(e) {
//                 return k(e) === p
//             },
//             isLazy: function(e) {
//                 return k(e) === C
//             },
//             isMemo: function(e) {
//                 return k(e) === b
//             },
//             isPortal: function(e) {
//                 return k(e) === u
//             },
//             isProfiler: function(e) {
//                 return k(e) === f
//             },
//             isStrictMode: function(e) {
//                 return k(e) === d
//             },
//             isSuspense: function(e) {
//                 return k(e) === v
//             },
//             isValidElementType: function(e) {
//                 return "string" == typeof e || "function" == typeof e || e === p || e === y || e === f || e === d || e === v || e === g || "object" == typeof e && null !== e && (e.$$typeof === C || e.$$typeof === b || e.$$typeof === h || e.$$typeof === m || e.$$typeof === x || e.$$typeof === O || e.$$typeof === N || e.$$typeof === T || e.$$typeof === S)
//             },
//             typeOf: k
//         },
//         j = s((function(e, t) {})),
//         M = (j.AsyncMode, j.ConcurrentMode, j.ContextConsumer, j.ContextProvider, j.Element, j.ForwardRef, j.Fragment, j.Lazy, j.Memo, j.Portal, j.Profiler, j.StrictMode, j.Suspense, j.isAsyncMode, j.isConcurrentMode, j.isContextConsumer, j.isContextProvider, j.isElement, j.isForwardRef, j.isFragment, j.isLazy, j.isMemo, j.isPortal, j.isProfiler, j.isStrictMode, j.isSuspense, j.isValidElementType, j.typeOf, s((function(e) {
//             e.exports = w
//         })), Object.getOwnPropertySymbols),
//         R = Object.prototype.hasOwnProperty,
//         $ = Object.prototype.propertyIsEnumerable;

//     function A(e) {
//         if (null == e) throw new TypeError("Object.assign cannot be called with null or undefined");
//         return Object(e)
//     }(function() {
//         try {
//             if (!Object.assign) return !1;
//             var e = new String("abc");
//             if (e[5] = "de", "5" === Object.getOwnPropertyNames(e)[0]) return !1;
//             for (var t = {}, n = 0; n < 10; n++) t["_" + String.fromCharCode(n)] = n;
//             if ("0123456789" !== Object.getOwnPropertyNames(t).map((function(e) {
//                     return t[e]
//                 })).join("")) return !1;
//             var r = {};
//             return "abcdefghijklmnopqrst".split("").forEach((function(e) {
//                 r[e] = e
//             })), "abcdefghijklmnopqrst" === Object.keys(Object.assign({}, r)).join("")
//         } catch (e) {
//             return !1
//         }
//     })() && Object.assign, Function.call.bind(Object.prototype.hasOwnProperty);

//     function L() {}

//     function _() {}
//     _.resetWarningCache = L;
//     var D = s((function(e) {
//         e.exports = function() {
//             function e(e, t, n, r, o, i) {
//                 if ("SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED" !== i) {
//                     var a = new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");
//                     throw a.name = "Invariant Violation", a
//                 }
//             }

//             function t() {
//                 return e
//             }
//             e.isRequired = e;
//             var n = {
//                 array: e,
//                 bool: e,
//                 func: e,
//                 number: e,
//                 object: e,
//                 string: e,
//                 symbol: e,
//                 any: e,
//                 arrayOf: t,
//                 element: e,
//                 elementType: e,
//                 instanceOf: t,
//                 node: e,
//                 objectOf: t,
//                 oneOf: t,
//                 oneOfType: t,
//                 shape: t,
//                 exact: t,
//                 checkPropTypes: _,
//                 resetWarningCache: L
//             };
//             return n.PropTypes = n, n
//         }()
//     }));
//     D.object, D.oneOfType, D.element, D.bool, D.func;

//     function F(e, t) {
//         return e.replace(new RegExp("(^|\\s)" + t + "(?:\\s|$)", "g"), "$1").replace(/\s+/g, " ").replace(/^\s*|\s*$/g, "")
//     }
//     var V = {
//             disabled: !1
//         },
//         I = r.createContext(null),
//         U = "entering",
//         q = "entered",
//         z = function(e) {
//             function t(t, n) {
//                 var r;
//                 r = e.call(this, t, n) || this;
//                 var o, i = n && !n.isMounting ? t.enter : t.appear;
//                 return r.appearStatus = null, t.in ? i ? (o = "exited", r.appearStatus = U) : o = q : o = t.unmountOnExit || t.mountOnEnter ? "unmounted" : "exited", r.state = {
//                     status: o
//                 }, r.nextCallback = null, r
//             }
//             a(t, e), t.getDerivedStateFromProps = function(e, t) {
//                 return e.in && "unmounted" === t.status ? {
//                     status: "exited"
//                 } : null
//             };
//             var o = t.prototype;
//             return o.componentDidMount = function() {
//                 this.updateStatus(!0, this.appearStatus)
//             }, o.componentDidUpdate = function(e) {
//                 var t = null;
//                 if (e !== this.props) {
//                     var n = this.state.status;
//                     this.props.in ? n !== U && n !== q && (t = U) : n !== U && n !== q || (t = "exiting")
//                 }
//                 this.updateStatus(!1, t)
//             }, o.componentWillUnmount = function() {
//                 this.cancelNextCallback()
//             }, o.getTimeouts = function() {
//                 var e, t, n, r = this.props.timeout;
//                 return e = t = n = r, null != r && "number" != typeof r && (e = r.exit, t = r.enter, n = void 0 !== r.appear ? r.appear : t), {
//                     exit: e,
//                     enter: t,
//                     appear: n
//                 }
//             }, o.updateStatus = function(e, t) {
//                 void 0 === e && (e = !1), null !== t ? (this.cancelNextCallback(), t === U ? this.performEnter(e) : this.performExit()) : this.props.unmountOnExit && "exited" === this.state.status && this.setState({
//                     status: "unmounted"
//                 })
//             }, o.performEnter = function(e) {
//                 var t = this,
//                     r = this.props.enter,
//                     o = this.context ? this.context.isMounting : e,
//                     i = this.props.nodeRef ? [o] : [n.findDOMNode(this), o],
//                     a = i[0],
//                     s = i[1],
//                     c = this.getTimeouts(),
//                     l = o ? c.appear : c.enter;
//                 !e && !r || V.disabled ? this.safeSetState({
//                     status: q
//                 }, (function() {
//                     t.props.onEntered(a)
//                 })) : (this.props.onEnter(a, s), this.safeSetState({
//                     status: U
//                 }, (function() {
//                     t.props.onEntering(a, s), t.onTransitionEnd(l, (function() {
//                         t.safeSetState({
//                             status: q
//                         }, (function() {
//                             t.props.onEntered(a, s)
//                         }))
//                     }))
//                 })))
//             }, o.performExit = function() {
//                 var e = this,
//                     t = this.props.exit,
//                     r = this.getTimeouts(),
//                     o = this.props.nodeRef ? void 0 : n.findDOMNode(this);
//                 t && !V.disabled ? (this.props.onExit(o), this.safeSetState({
//                     status: "exiting"
//                 }, (function() {
//                     e.props.onExiting(o), e.onTransitionEnd(r.exit, (function() {
//                         e.safeSetState({
//                             status: "exited"
//                         }, (function() {
//                             e.props.onExited(o)
//                         }))
//                     }))
//                 }))) : this.safeSetState({
//                     status: "exited"
//                 }, (function() {
//                     e.props.onExited(o)
//                 }))
//             }, o.cancelNextCallback = function() {
//                 null !== this.nextCallback && (this.nextCallback.cancel(), this.nextCallback = null)
//             }, o.safeSetState = function(e, t) {
//                 t = this.setNextCallback(t), this.setState(e, t)
//             }, o.setNextCallback = function(e) {
//                 var t = this,
//                     n = !0;
//                 return this.nextCallback = function(r) {
//                     n && (n = !1, t.nextCallback = null, e(r))
//                 }, this.nextCallback.cancel = function() {
//                     n = !1
//                 }, this.nextCallback
//             }, o.onTransitionEnd = function(e, t) {
//                 this.setNextCallback(t);
//                 var r = this.props.nodeRef ? this.props.nodeRef.current : n.findDOMNode(this),
//                     o = null == e && !this.props.addEndListener;
//                 if (r && !o) {
//                     if (this.props.addEndListener) {
//                         var i = this.props.nodeRef ? [this.nextCallback] : [r, this.nextCallback],
//                             a = i[0],
//                             s = i[1];
//                         this.props.addEndListener(a, s)
//                     }
//                     null != e && setTimeout(this.nextCallback, e)
//                 } else setTimeout(this.nextCallback, 0)
//             }, o.render = function() {
//                 var e = this.state.status;
//                 if ("unmounted" === e) return null;
//                 var t = this.props,
//                     n = t.children,
//                     o = (t.in, t.mountOnEnter, t.unmountOnExit, t.appear, t.enter, t.exit, t.timeout, t.addEndListener, t.onEnter, t.onEntering, t.onEntered, t.onExit, t.onExiting, t.onExited, t.nodeRef, i(t, ["children", "in", "mountOnEnter", "unmountOnExit", "appear", "enter", "exit", "timeout", "addEndListener", "onEnter", "onEntering", "onEntered", "onExit", "onExiting", "onExited", "nodeRef"]));
//                 return r.createElement(I.Provider, {
//                     value: null
//                 }, "function" == typeof n ? n(e, o) : r.cloneElement(r.Children.only(n), o))
//             }, t
//         }(r.Component);

//     function W() {}
//     z.contextType = I, z.propTypes = {}, z.defaultProps = {
//         in: !1,
//         mountOnEnter: !1,
//         unmountOnExit: !1,
//         appear: !1,
//         enter: !0,
//         exit: !0,
//         onEnter: W,
//         onEntering: W,
//         onEntered: W,
//         onExit: W,
//         onExiting: W,
//         onExited: W
//     }, z.UNMOUNTED = "unmounted", z.EXITED = "exited", z.ENTERING = U, z.ENTERED = q, z.EXITING = "exiting";
//     var G = function(e, t) {
//             return e && t && t.split(" ").forEach((function(t) {
//                 return r = t, void((n = e).classList ? n.classList.add(r) : function(e, t) {
//                     return e.classList ? !!t && e.classList.contains(t) : -1 !== (" " + (e.className.baseVal || e.className) + " ").indexOf(" " + t + " ")
//                 }(n, r) || ("string" == typeof n.className ? n.className = n.className + " " + r : n.setAttribute("class", (n.className && n.className.baseVal || "") + " " + r)));
//                 var n, r
//             }))
//         },
//         X = function(e, t) {
//             return e && t && t.split(" ").forEach((function(t) {
//                 return r = t, void((n = e).classList ? n.classList.remove(r) : "string" == typeof n.className ? n.className = F(n.className, r) : n.setAttribute("class", F(n.className && n.className.baseVal || "", r)));
//                 var n, r
//             }))
//         },
//         B = function(e) {
//             function t() {
//                 for (var t, n = arguments.length, r = new Array(n), o = 0; o < n; o++) r[o] = arguments[o];
//                 return (t = e.call.apply(e, [this].concat(r)) || this).appliedClasses = {
//                     appear: {},
//                     enter: {},
//                     exit: {}
//                 }, t.onEnter = function(e, n) {
//                     var r = t.resolveArguments(e, n),
//                         o = r[0],
//                         i = r[1];
//                     t.removeClasses(o, "exit"), t.addClass(o, i ? "appear" : "enter", "base"), t.props.onEnter && t.props.onEnter(e, n)
//                 }, t.onEntering = function(e, n) {
//                     var r = t.resolveArguments(e, n),
//                         o = r[0],
//                         i = r[1] ? "appear" : "enter";
//                     t.addClass(o, i, "active"), t.props.onEntering && t.props.onEntering(e, n)
//                 }, t.onEntered = function(e, n) {
//                     var r = t.resolveArguments(e, n),
//                         o = r[0],
//                         i = r[1] ? "appear" : "enter";
//                     t.removeClasses(o, i), t.addClass(o, i, "done"), t.props.onEntered && t.props.onEntered(e, n)
//                 }, t.onExit = function(e) {
//                     var n = t.resolveArguments(e)[0];
//                     t.removeClasses(n, "appear"), t.removeClasses(n, "enter"), t.addClass(n, "exit", "base"), t.props.onExit && t.props.onExit(e)
//                 }, t.onExiting = function(e) {
//                     var n = t.resolveArguments(e)[0];
//                     t.addClass(n, "exit", "active"), t.props.onExiting && t.props.onExiting(e)
//                 }, t.onExited = function(e) {
//                     var n = t.resolveArguments(e)[0];
//                     t.removeClasses(n, "exit"), t.addClass(n, "exit", "done"), t.props.onExited && t.props.onExited(e)
//                 }, t.resolveArguments = function(e, n) {
//                     return t.props.nodeRef ? [t.props.nodeRef.current, e] : [e, n]
//                 }, t.getClassNames = function(e) {
//                     var n = t.props.classNames,
//                         r = "string" == typeof n,
//                         o = r ? "" + (r && n ? n + "-" : "") + e : n[e];
//                     return {
//                         baseClassName: o,
//                         activeClassName: r ? o + "-active" : n[e + "Active"],
//                         doneClassName: r ? o + "-done" : n[e + "Done"]
//                     }
//                 }, t
//             }
//             a(t, e);
//             var n = t.prototype;
//             return n.addClass = function(e, t, n) {
//                 var r = this.getClassNames(t)[n + "ClassName"],
//                     o = this.getClassNames("enter").doneClassName;
//                 "appear" === t && "done" === n && o && (r += " " + o), "active" === n && e && e.scrollTop, r && (this.appliedClasses[t][n] = r, G(e, r))
//             }, n.removeClasses = function(e, t) {
//                 var n = this.appliedClasses[t],
//                     r = n.base,
//                     o = n.active,
//                     i = n.done;
//                 this.appliedClasses[t] = {}, r && X(e, r), o && X(e, o), i && X(e, i)
//             }, n.render = function() {
//                 var e = this.props,
//                     t = (e.classNames, i(e, ["classNames"]));
//                 return r.createElement(z, o({}, t, {
//                     onEnter: this.onEnter,
//                     onEntered: this.onEntered,
//                     onEntering: this.onEntering,
//                     onExit: this.onExit,
//                     onExiting: this.onExiting,
//                     onExited: this.onExited
//                 }))
//             }, t
//         }(r.Component);

//     function H(e, n) {
//         var r = Object.create(null);
//         return e && t.Children.map(e, (function(e) {
//             return e
//         })).forEach((function(e) {
//             r[e.key] = function(e) {
//                 return n && t.isValidElement(e) ? n(e) : e
//             }(e)
//         })), r
//     }

//     function Y(e, t, n) {
//         return null != n[t] ? n[t] : e.props[t]
//     }

//     function J(e, n, r) {
//         var o = H(e.children),
//             i = function(e, t) {
//                 function n(n) {
//                     return n in t ? t[n] : e[n]
//                 }
//                 e = e || {}, t = t || {};
//                 var r, o = Object.create(null),
//                     i = [];
//                 for (var a in e) a in t ? i.length && (o[a] = i, i = []) : i.push(a);
//                 var s = {};
//                 for (var c in t) {
//                     if (o[c])
//                         for (r = 0; r < o[c].length; r++) {
//                             var l = o[c][r];
//                             s[o[c][r]] = n(l)
//                         }
//                     s[c] = n(c)
//                 }
//                 for (r = 0; r < i.length; r++) s[i[r]] = n(i[r]);
//                 return s
//             }(n, o);
//         return Object.keys(i).forEach((function(a) {
//             var s = i[a];
//             if (t.isValidElement(s)) {
//                 var c = a in n,
//                     l = a in o,
//                     u = n[a],
//                     p = t.isValidElement(u) && !u.props.in;
//                 !l || c && !p ? l || !c || p ? l && c && t.isValidElement(u) && (i[a] = t.cloneElement(s, {
//                     onExited: r.bind(null, s),
//                     in: u.props.in,
//                     exit: Y(s, "exit", e),
//                     enter: Y(s, "enter", e)
//                 })) : i[a] = t.cloneElement(s, {
//                     in: !1
//                 }) : i[a] = t.cloneElement(s, {
//                     onExited: r.bind(null, s),
//                     in: !0,
//                     exit: Y(s, "exit", e),
//                     enter: Y(s, "enter", e)
//                 })
//             }
//         })), i
//     }
//     B.defaultProps = {
//         classNames: ""
//     }, B.propTypes = {};
//     var K = Object.values || function(e) {
//             return Object.keys(e).map((function(t) {
//                 return e[t]
//             }))
//         },
//         Q = function(e) {
//             function n(t, n) {
//                 var r, o = (r = e.call(this, t, n) || this).handleExited.bind(function(e) {
//                     if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
//                     return e
//                 }(r));
//                 return r.state = {
//                     contextValue: {
//                         isMounting: !0
//                     },
//                     handleExited: o,
//                     firstRender: !0
//                 }, r
//             }
//             a(n, e);
//             var s = n.prototype;
//             return s.componentDidMount = function() {
//                 this.mounted = !0, this.setState({
//                     contextValue: {
//                         isMounting: !1
//                     }
//                 })
//             }, s.componentWillUnmount = function() {
//                 this.mounted = !1
//             }, n.getDerivedStateFromProps = function(e, n) {
//                 var r, o, i = n.children,
//                     a = n.handleExited;
//                 return {
//                     children: n.firstRender ? (r = e, o = a, H(r.children, (function(e) {
//                         return t.cloneElement(e, {
//                             onExited: o.bind(null, e),
//                             in: !0,
//                             appear: Y(e, "appear", r),
//                             enter: Y(e, "enter", r),
//                             exit: Y(e, "exit", r)
//                         })
//                     }))) : J(e, i, a),
//                     firstRender: !1
//                 }
//             }, s.handleExited = function(e, t) {
//                 var n = H(this.props.children);
//                 e.key in n || (e.props.onExited && e.props.onExited(t), this.mounted && this.setState((function(t) {
//                     var n = o({}, t.children);
//                     return delete n[e.key], {
//                         children: n
//                     }
//                 })))
//             }, s.render = function() {
//                 var e = this.props,
//                     t = e.component,
//                     n = e.childFactory,
//                     o = i(e, ["component", "childFactory"]),
//                     a = this.state.contextValue,
//                     s = K(this.state.children).map(n);
//                 return delete o.appear, delete o.enter, delete o.exit, null === t ? r.createElement(I.Provider, {
//                     value: a
//                 }, s) : r.createElement(I.Provider, {
//                     value: a
//                 }, r.createElement(t, o, s))
//             }, n
//         }(r.Component);
//     Q.propTypes = {}, Q.defaultProps = {
//         component: "div",
//         childFactory: function(e) {
//             return e
//         }
//     };
//     var Z, ee, te = function(e) {
//         function t() {
//             for (var t, n = arguments.length, r = new Array(n), o = 0; o < n; o++) r[o] = arguments[o];
//             return (t = e.call.apply(e, [this].concat(r)) || this).handleEnter = function() {
//                 for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++) n[r] = arguments[r];
//                 return t.handleLifecycle("onEnter", 0, n)
//             }, t.handleEntering = function() {
//                 for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++) n[r] = arguments[r];
//                 return t.handleLifecycle("onEntering", 0, n)
//             }, t.handleEntered = function() {
//                 for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++) n[r] = arguments[r];
//                 return t.handleLifecycle("onEntered", 0, n)
//             }, t.handleExit = function() {
//                 for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++) n[r] = arguments[r];
//                 return t.handleLifecycle("onExit", 1, n)
//             }, t.handleExiting = function() {
//                 for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++) n[r] = arguments[r];
//                 return t.handleLifecycle("onExiting", 1, n)
//             }, t.handleExited = function() {
//                 for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++) n[r] = arguments[r];
//                 return t.handleLifecycle("onExited", 1, n)
//             }, t
//         }
//         a(t, e);
//         var o = t.prototype;
//         return o.handleLifecycle = function(e, t, o) {
//             var i, a = this.props.children,
//                 s = r.Children.toArray(a)[t];
//             if (s.props[e] && (i = s.props)[e].apply(i, o), this.props[e]) {
//                 var c = s.props.nodeRef ? void 0 : n.findDOMNode(this);
//                 this.props[e](c)
//             }
//         }, o.render = function() {
//             var e = this.props,
//                 t = e.children,
//                 n = e.in,
//                 o = i(e, ["children", "in"]),
//                 a = r.Children.toArray(t),
//                 s = a[0],
//                 c = a[1];
//             return delete o.onEnter, delete o.onEntering, delete o.onEntered, delete o.onExit, delete o.onExiting, delete o.onExited, r.createElement(Q, o, n ? r.cloneElement(s, {
//                 key: "first",
//                 onEnter: this.handleEnter,
//                 onEntering: this.handleEntering,
//                 onEntered: this.handleEntered
//             }) : r.cloneElement(c, {
//                 key: "second",
//                 onEnter: this.handleExit,
//                 onEntering: this.handleExiting,
//                 onEntered: this.handleExited
//             }))
//         }, t
//     }(r.Component);
//     te.propTypes = {};
//     var ne = "out-in",
//         re = "in-out",
//         oe = function(e, t, n) {
//             return function() {
//                 var r;
//                 e.props[t] && (r = e.props)[t].apply(r, arguments), n()
//             }
//         },
//         ie = ((Z = {})[ne] = function(e) {
//             var t = e.current,
//                 n = e.changeState;
//             return r.cloneElement(t, {
//                 in: !1,
//                 onExited: oe(t, "onExited", (function() {
//                     n(U, null)
//                 }))
//             })
//         }, Z[re] = function(e) {
//             var t = e.current,
//                 n = e.changeState,
//                 o = e.children;
//             return [t, r.cloneElement(o, {
//                 in: !0,
//                 onEntered: oe(o, "onEntered", (function() {
//                     n(U)
//                 }))
//             })]
//         }, Z),
//         ae = ((ee = {})[ne] = function(e) {
//             var t = e.children,
//                 n = e.changeState;
//             return r.cloneElement(t, {
//                 in: !0,
//                 onEntered: oe(t, "onEntered", (function() {
//                     n(q, r.cloneElement(t, {
//                         in: !0
//                     }))
//                 }))
//             })
//         }, ee[re] = function(e) {
//             var t = e.current,
//                 n = e.children,
//                 o = e.changeState;
//             return [r.cloneElement(t, {
//                 in: !1,
//                 onExited: oe(t, "onExited", (function() {
//                     o(q, r.cloneElement(n, {
//                         in: !0
//                     }))
//                 }))
//             }), r.cloneElement(n, {
//                 in: !0
//             })]
//         }, ee),
//         se = function(e) {
//             function t() {
//                 for (var t, n = arguments.length, r = new Array(n), o = 0; o < n; o++) r[o] = arguments[o];
//                 return (t = e.call.apply(e, [this].concat(r)) || this).state = {
//                     status: q,
//                     current: null
//                 }, t.appeared = !1, t.changeState = function(e, n) {
//                     void 0 === n && (n = t.state.current), t.setState({
//                         status: e,
//                         current: n
//                     })
//                 }, t
//             }
//             a(t, e);
//             var n = t.prototype;
//             return n.componentDidMount = function() {
//                 this.appeared = !0
//             }, t.getDerivedStateFromProps = function(e, t) {
//                 return null == e.children ? {
//                     current: null
//                 } : t.status === U && e.mode === re ? {
//                     status: U
//                 } : !t.current || (n = t.current, o = e.children, n === o || r.isValidElement(n) && r.isValidElement(o) && null != n.key && n.key === o.key) ? {
//                     current: r.cloneElement(e.children, {
//                         in: !0
//                     })
//                 } : {
//                     status: "exiting"
//                 };
//                 var n, o
//             }, n.render = function() {
//                 var e, t = this.props,
//                     n = t.children,
//                     o = t.mode,
//                     i = this.state,
//                     a = i.status,
//                     s = i.current,
//                     c = {
//                         children: n,
//                         current: s,
//                         changeState: this.changeState,
//                         status: a
//                     };
//                 switch (a) {
//                     case U:
//                         e = ae[o](c);
//                         break;
//                     case "exiting":
//                         e = ie[o](c);
//                         break;
//                     case q:
//                         e = s
//                 }
//                 return r.createElement(I.Provider, {
//                     value: {
//                         isMounting: !this.appeared
//                     }
//                 }, e)
//             }, t
//         }(r.Component);
//     se.propTypes = {}, se.defaultProps = {
//         mode: ne
//     }, e.CSSTransition = B, e.ReplaceTransition = te, e.SwitchTransition = se, e.Transition = z, e.TransitionGroup = Q, e.config = V, Object.defineProperty(e, "__esModule", {
//         value: !0
//     })
};