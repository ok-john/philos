! function(e, t) {
//     "object" == typeof exports && "undefined" != typeof module ? t(exports, require("react"), require("react-dom")) : "function" == typeof define && define.amd ? define(["exports", "react", "react-dom"], t) : t((e = "undefined" != typeof globalThis ? globalThis : e || self).ReactRedux = {}, e.React, e.ReactDOM)
// }(this, (function(e, t, r) {
//     "use strict";

//     function n(e) {
//         return e && "object" == typeof e && "default" in e ? e : {
//             default: e
//         }
//     }
//     var o = n(t);

//     function u() {}

//     function a() {}
//     a.resetWarningCache = u;
//     ! function() {
//         function e(e, t, r, n, o, u) {
//             if ("SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED" !== u) {
//                 var a = Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");
//                 throw a.name = "Invariant Violation", a
//             }
//         }

//         function t() {
//             return e
//         }
//         e.isRequired = e;
//         var r = {
//             array: e,
//             bool: e,
//             func: e,
//             number: e,
//             object: e,
//             string: e,
//             symbol: e,
//             any: e,
//             arrayOf: t,
//             element: e,
//             elementType: e,
//             instanceOf: t,
//             node: e,
//             objectOf: t,
//             oneOf: t,
//             oneOfType: t,
//             shape: t,
//             exact: t,
//             checkPropTypes: a,
//             resetWarningCache: u
//         };
//         r.PropTypes = r
//     }();
//     var c = o.default.createContext(null);
//     var i = function(e) {
//             e()
//         },
//         f = function() {
//             return i
//         };
//     var s = {
//         notify: function() {},
//         get: function() {
//             return []
//         }
//     };

//     function p(e, t) {
//         var r, n = s;

//         function o() {
//             a.onStateChange && a.onStateChange()
//         }

//         function u() {
//             r || (r = t ? t.addNestedSub(o) : e.subscribe(o), n = function() {
//                 var e = f(),
//                     t = null,
//                     r = null;
//                 return {
//                     clear: function() {
//                         t = null, r = null
//                     },
//                     notify: function() {
//                         e((function() {
//                             for (var e = t; e;) e.callback(), e = e.next
//                         }))
//                     },
//                     get: function() {
//                         for (var e = [], r = t; r;) e.push(r), r = r.next;
//                         return e
//                     },
//                     subscribe: function(e) {
//                         var n = !0,
//                             o = r = {
//                                 callback: e,
//                                 next: null,
//                                 prev: r
//                             };
//                         return o.prev ? o.prev.next = o : t = o,
//                             function() {
//                                 n && null !== t && (n = !1, o.next ? o.next.prev = o.prev : r = o.prev, o.prev ? o.prev.next = o.next : t = o.next)
//                             }
//                     }
//                 }
//             }())
//         }
//         var a = {
//             addNestedSub: function(e) {
//                 return u(), n.subscribe(e)
//             },
//             notifyNestedSubs: function() {
//                 n.notify()
//             },
//             handleChangeWrapper: o,
//             isSubscribed: function() {
//                 return !!r
//             },
//             trySubscribe: u,
//             tryUnsubscribe: function() {
//                 r && (r(), r = void 0, n.clear(), n = s)
//             },
//             getListeners: function() {
//                 return n
//             }
//         };
//         return a
//     }
//     var l = "undefined" != typeof window && void 0 !== window.document && void 0 !== window.document.createElement ? t.useLayoutEffect : t.useEffect;

//     function d() {
//         return d = Object.assign || function(e) {
//             for (var t = 1; arguments.length > t; t++) {
//                 var r = arguments[t];
//                 for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n])
//             }
//             return e
//         }, d.apply(this, arguments)
//     }

//     function y(e, t) {
//         if (null == e) return {};
//         var r, n, o = {},
//             u = Object.keys(e);
//         for (n = 0; u.length > n; n++) 0 > t.indexOf(r = u[n]) && (o[r] = e[r]);
//         return o
//     }
//     var v = {
//             exports: {}
//         },
//         m = {},
//         b = "function" == typeof Symbol && Symbol.for,
//         S = b ? Symbol.for("react.element") : 60103,
//         h = b ? Symbol.for("react.portal") : 60106,
//         P = b ? Symbol.for("react.fragment") : 60107,
//         g = b ? Symbol.for("react.strict_mode") : 60108,
//         O = b ? Symbol.for("react.profiler") : 60114,
//         w = b ? Symbol.for("react.provider") : 60109,
//         C = b ? Symbol.for("react.context") : 60110,
//         x = b ? Symbol.for("react.async_mode") : 60111,
//         $ = b ? Symbol.for("react.concurrent_mode") : 60111,
//         M = b ? Symbol.for("react.forward_ref") : 60112,
//         E = b ? Symbol.for("react.suspense") : 60113,
//         T = b ? Symbol.for("react.suspense_list") : 60120,
//         R = b ? Symbol.for("react.memo") : 60115,
//         j = b ? Symbol.for("react.lazy") : 60116,
//         N = b ? Symbol.for("react.block") : 60121,
//         _ = b ? Symbol.for("react.fundamental") : 60117,
//         D = b ? Symbol.for("react.responder") : 60118,
//         q = b ? Symbol.for("react.scope") : 60119;

//     function F(e) {
//         if ("object" == typeof e && null !== e) {
//             var t = e.$$typeof;
//             switch (t) {
//                 case S:
//                     switch (e = e.type) {
//                         case x:
//                         case $:
//                         case P:
//                         case O:
//                         case g:
//                         case E:
//                             return e;
//                         default:
//                             switch (e = e && e.$$typeof) {
//                                 case C:
//                                 case M:
//                                 case j:
//                                 case R:
//                                 case w:
//                                     return e;
//                                 default:
//                                     return t
//                             }
//                     }
//                 case h:
//                     return t
//             }
//         }
//     }

//     function k(e) {
//         return F(e) === $
//     }
//     m.AsyncMode = x, m.ConcurrentMode = $, m.ContextConsumer = C, m.ContextProvider = w, m.Element = S, m.ForwardRef = M, m.Fragment = P, m.Lazy = j, m.Memo = R, m.Portal = h, m.Profiler = O, m.StrictMode = g, m.Suspense = E, m.isAsyncMode = function(e) {
//         return k(e) || F(e) === x
//     }, m.isConcurrentMode = k, m.isContextConsumer = function(e) {
//         return F(e) === C
//     }, m.isContextProvider = function(e) {
//         return F(e) === w
//     }, m.isElement = function(e) {
//         return "object" == typeof e && null !== e && e.$$typeof === S
//     }, m.isForwardRef = function(e) {
//         return F(e) === M
//     }, m.isFragment = function(e) {
//         return F(e) === P
//     }, m.isLazy = function(e) {
//         return F(e) === j
//     }, m.isMemo = function(e) {
//         return F(e) === R
//     }, m.isPortal = function(e) {
//         return F(e) === h
//     }, m.isProfiler = function(e) {
//         return F(e) === O
//     }, m.isStrictMode = function(e) {
//         return F(e) === g
//     }, m.isSuspense = function(e) {
//         return F(e) === E
//     }, m.isValidElementType = function(e) {
//         return "string" == typeof e || "function" == typeof e || e === P || e === $ || e === O || e === g || e === E || e === T || "object" == typeof e && null !== e && (e.$$typeof === j || e.$$typeof === R || e.$$typeof === w || e.$$typeof === C || e.$$typeof === M || e.$$typeof === _ || e.$$typeof === D || e.$$typeof === q || e.$$typeof === N)
//     }, m.typeOf = F, v.exports = m;
//     var H = v.exports,
//         U = {
//             childContextTypes: !0,
//             contextType: !0,
//             contextTypes: !0,
//             defaultProps: !0,
//             displayName: !0,
//             getDefaultProps: !0,
//             getDerivedStateFromError: !0,
//             getDerivedStateFromProps: !0,
//             mixins: !0,
//             propTypes: !0,
//             type: !0
//         },
//         A = {
//             name: !0,
//             length: !0,
//             prototype: !0,
//             caller: !0,
//             callee: !0,
//             arguments: !0,
//             arity: !0
//         },
//         L = {
//             $$typeof: !0,
//             compare: !0,
//             defaultProps: !0,
//             displayName: !0,
//             propTypes: !0,
//             type: !0
//         },
//         W = {};

//     function z(e) {
//         return H.isMemo(e) ? L : W[e.$$typeof] || U
//     }
//     W[H.ForwardRef] = {
//         $$typeof: !0,
//         render: !0,
//         defaultProps: !0,
//         displayName: !0,
//         propTypes: !0
//     }, W[H.Memo] = L;
//     var I = Object.defineProperty,
//         V = Object.getOwnPropertyNames,
//         K = Object.getOwnPropertySymbols,
//         B = Object.getOwnPropertyDescriptor,
//         Y = Object.getPrototypeOf,
//         G = Object.prototype;
//     var J = function e(t, r, n) {
//             if ("string" != typeof r) {
//                 if (G) {
//                     var o = Y(r);
//                     o && o !== G && e(t, o, n)
//                 }
//                 var u = V(r);
//                 K && (u = u.concat(K(r)));
//                 for (var a = z(t), c = z(r), i = 0; u.length > i; ++i) {
//                     var f = u[i];
//                     if (!(A[f] || n && n[f] || c && c[f] || a && a[f])) {
//                         var s = B(r, f);
//                         try {
//                             I(t, f, s)
//                         } catch (e) {}
//                     }
//                 }
//             }
//             return t
//         },
//         Q = {
//             exports: {}
//         },
//         X = {},
//         Z = 60103,
//         ee = 60106,
//         te = 60107,
//         re = 60108,
//         ne = 60114,
//         oe = 60109,
//         ue = 60110,
//         ae = 60112,
//         ce = 60113,
//         ie = 60120,
//         fe = 60115,
//         se = 60116,
//         pe = 60121,
//         le = 60122,
//         de = 60117,
//         ye = 60129,
//         ve = 60131;
//     if ("function" == typeof Symbol && Symbol.for) {
//         var me = Symbol.for;
//         Z = me("react.element"), ee = me("react.portal"), te = me("react.fragment"), re = me("react.strict_mode"), ne = me("react.profiler"), oe = me("react.provider"), ue = me("react.context"), ae = me("react.forward_ref"), ce = me("react.suspense"), ie = me("react.suspense_list"), fe = me("react.memo"), se = me("react.lazy"), pe = me("react.block"), le = me("react.server.block"), de = me("react.fundamental"), ye = me("react.debug_trace_mode"), ve = me("react.legacy_hidden")
//     }

//     function be(e) {
//         if ("object" == typeof e && null !== e) {
//             var t = e.$$typeof;
//             switch (t) {
//                 case Z:
//                     switch (e = e.type) {
//                         case te:
//                         case ne:
//                         case re:
//                         case ce:
//                         case ie:
//                             return e;
//                         default:
//                             switch (e = e && e.$$typeof) {
//                                 case ue:
//                                 case ae:
//                                 case se:
//                                 case fe:
//                                 case oe:
//                                     return e;
//                                 default:
//                                     return t
//                             }
//                     }
//                 case ee:
//                     return t
//             }
//         }
//     }
//     var Se = oe,
//         he = Z,
//         Pe = ae,
//         ge = te,
//         Oe = se,
//         we = fe,
//         Ce = ee,
//         xe = ne,
//         $e = re,
//         Me = ce;
//     X.ContextConsumer = ue, X.ContextProvider = Se, X.Element = he, X.ForwardRef = Pe, X.Fragment = ge, X.Lazy = Oe, X.Memo = we, X.Portal = Ce, X.Profiler = xe, X.StrictMode = $e, X.Suspense = Me, X.isAsyncMode = function() {
//         return !1
//     }, X.isConcurrentMode = function() {
//         return !1
//     }, X.isContextConsumer = function(e) {
//         return be(e) === ue
//     }, X.isContextProvider = function(e) {
//         return be(e) === oe
//     }, X.isElement = function(e) {
//         return "object" == typeof e && null !== e && e.$$typeof === Z
//     }, X.isForwardRef = function(e) {
//         return be(e) === ae
//     }, X.isFragment = function(e) {
//         return be(e) === te
//     }, X.isLazy = function(e) {
//         return be(e) === se
//     }, X.isMemo = function(e) {
//         return be(e) === fe
//     }, X.isPortal = function(e) {
//         return be(e) === ee
//     }, X.isProfiler = function(e) {
//         return be(e) === ne
//     }, X.isStrictMode = function(e) {
//         return be(e) === re
//     }, X.isSuspense = function(e) {
//         return be(e) === ce
//     }, X.isValidElementType = function(e) {
//         return "string" == typeof e || "function" == typeof e || e === te || e === ne || e === ye || e === re || e === ce || e === ie || e === ve || "object" == typeof e && null !== e && (e.$$typeof === se || e.$$typeof === fe || e.$$typeof === oe || e.$$typeof === ue || e.$$typeof === ae || e.$$typeof === de || e.$$typeof === pe || e[0] === le)
//     }, X.typeOf = be, Q.exports = X;
//     var Ee = ["getDisplayName", "methodName", "renderCountProp", "shouldHandleStateChanges", "storeKey", "withRef", "forwardRef", "context"],
//         Te = ["reactReduxForwardedRef"],
//         Re = [],
//         je = [null, null];

//     function Ne(e, t) {
//         return [t.payload, e[1] + 1]
//     }

//     function _e(e, t, r) {
//         l((function() {
//             return e.apply(void 0, t)
//         }), r)
//     }

//     function De(e, t, r, n, o, u, a) {
//         e.current = n, t.current = o, r.current = !1, u.current && (u.current = null, a())
//     }

//     function qe(e, t, r, n, o, u, a, c, i, f) {
//         if (e) {
//             var s = !1,
//                 p = null,
//                 l = function() {
//                     if (!s) {
//                         var e, r, l = t.getState();
//                         try {
//                             e = n(l, o.current)
//                         } catch (e) {
//                             r = e, p = e
//                         }
//                         r || (p = null), e === u.current ? a.current || i() : (u.current = e, c.current = e, a.current = !0, f({
//                             type: "STORE_UPDATED",
//                             payload: {
//                                 error: r
//                             }
//                         }))
//                     }
//                 };
//             r.onStateChange = l, r.trySubscribe(), l();
//             return function() {
//                 if (s = !0, r.tryUnsubscribe(), r.onStateChange = null, p) throw p
//             }
//         }
//     }
//     var Fe = function() {
//         return [null, 0]
//     };

//     function ke(e, r) {
//         void 0 === r && (r = {});
//         var n = r,
//             u = n.getDisplayName,
//             a = void 0 === u ? function(e) {
//                 return "ConnectAdvanced(" + e + ")"
//             } : u,
//             i = n.methodName,
//             f = void 0 === i ? "connectAdvanced" : i,
//             s = n.renderCountProp,
//             l = void 0 === s ? void 0 : s,
//             v = n.shouldHandleStateChanges,
//             m = void 0 === v || v,
//             b = n.storeKey,
//             S = void 0 === b ? "store" : b,
//             h = n.forwardRef,
//             P = void 0 !== h && h,
//             g = n.context,
//             O = void 0 === g ? c : g,
//             w = y(n, Ee),
//             C = O;
//         return function(r) {
//             var n = r.displayName || r.name || "Component",
//                 u = a(n),
//                 c = d({}, w, {
//                     getDisplayName: a,
//                     methodName: f,
//                     renderCountProp: l,
//                     shouldHandleStateChanges: m,
//                     storeKey: S,
//                     displayName: u,
//                     wrappedComponentName: n,
//                     WrappedComponent: r
//                 }),
//                 i = w.pure;
//             var s = i ? t.useMemo : function(e) {
//                 return e()
//             };

//             function v(n) {
//                 var u = t.useMemo((function() {
//                         var e = n.reactReduxForwardedRef,
//                             t = y(n, Te);
//                         return [n.context, e, t]
//                     }), [n]),
//                     a = u[0],
//                     i = u[1],
//                     f = u[2],
//                     l = t.useMemo((function() {
//                         return a && a.Consumer && Q.exports.isContextConsumer(o.default.createElement(a.Consumer, null)) ? a : C
//                     }), [a, C]),
//                     v = t.useContext(l),
//                     b = !!n.store && !!n.store.getState && !!n.store.dispatch,
//                     S = b ? n.store : v.store,
//                     h = t.useMemo((function() {
//                         return function(t) {
//                             return e(t.dispatch, c)
//                         }(S)
//                     }), [S]),
//                     P = t.useMemo((function() {
//                         if (!m) return je;
//                         var e = p(S, b ? null : v.subscription),
//                             t = e.notifyNestedSubs.bind(e);
//                         return [e, t]
//                     }), [S, b, v]),
//                     g = P[0],
//                     O = P[1],
//                     w = t.useMemo((function() {
//                         return b ? v : d({}, v, {
//                             subscription: g
//                         })
//                     }), [b, v, g]),
//                     x = t.useReducer(Ne, Re, Fe),
//                     $ = x[0][0],
//                     M = x[1];
//                 if ($ && $.error) throw $.error;
//                 var E = t.useRef(),
//                     T = t.useRef(f),
//                     R = t.useRef(),
//                     j = t.useRef(!1),
//                     N = s((function() {
//                         return R.current && f === T.current ? R.current : h(S.getState(), f)
//                     }), [S, $, f]);
//                 _e(De, [T, E, j, f, N, R, O]), _e(qe, [m, S, g, h, T, E, j, R, O, M], [S, g, h]);
//                 var _ = t.useMemo((function() {
//                     return o.default.createElement(r, d({}, N, {
//                         ref: i
//                     }))
//                 }), [i, r, N]);
//                 return t.useMemo((function() {
//                     return m ? o.default.createElement(l.Provider, {
//                         value: w
//                     }, _) : _
//                 }), [l, _, w])
//             }
//             var b = i ? o.default.memo(v) : v;
//             if (b.WrappedComponent = r, b.displayName = v.displayName = u, P) {
//                 var h = o.default.forwardRef((function(e, t) {
//                     return o.default.createElement(b, d({}, e, {
//                         reactReduxForwardedRef: t
//                     }))
//                 }));
//                 return h.displayName = u, h.WrappedComponent = r, J(h, r)
//             }
//             return J(b, r)
//         }
//     }

//     function He(e, t) {
//         return e === t ? 0 !== e || 0 !== t || 1 / e == 1 / t : e != e && t != t
//     }

//     function Ue(e, t) {
//         if (He(e, t)) return !0;
//         if ("object" != typeof e || null === e || "object" != typeof t || null === t) return !1;
//         var r = Object.keys(e);
//         if (r.length !== Object.keys(t).length) return !1;
//         for (var n = 0; r.length > n; n++)
//             if (!Object.prototype.hasOwnProperty.call(t, r[n]) || !He(e[r[n]], t[r[n]])) return !1;
//         return !0
//     }

//     function Ae(e) {
//         return function(t, r) {
//             var n = e(t, r);

//             function o() {
//                 return n
//             }
//             return o.dependsOnOwnProps = !1, o
//         }
//     }

//     function Le(e) {
//         return null != e.dependsOnOwnProps ? !!e.dependsOnOwnProps : 1 !== e.length
//     }

//     function We(e, t) {
//         return function(t, r) {
//             var n = function(e, t) {
//                 return n.dependsOnOwnProps ? n.mapToProps(e, t) : n.mapToProps(e)
//             };
//             return n.dependsOnOwnProps = !0, n.mapToProps = function(t, r) {
//                 n.mapToProps = e, n.dependsOnOwnProps = Le(e);
//                 var o = n(t, r);
//                 return "function" == typeof o && (n.mapToProps = o, n.dependsOnOwnProps = Le(o), o = n(t, r)), o
//             }, n
//         }
//     }
//     var ze = [function(e) {
//         return "function" == typeof e ? We(e) : void 0
//     }, function(e) {
//         return e ? void 0 : Ae((function(e) {
//             return {
//                 dispatch: e
//             }
//         }))
//     }, function(e) {
//         return e && "object" == typeof e ? Ae((function(t) {
//             return function(e, t) {
//                 var r = {},
//                     n = function(n) {
//                         var o = e[n];
//                         "function" == typeof o && (r[n] = function() {
//                             return t(o.apply(void 0, arguments))
//                         })
//                     };
//                 for (var o in e) n(o);
//                 return r
//             }(e, t)
//         })) : void 0
//     }];
//     var Ie = [function(e) {
//         return "function" == typeof e ? We(e) : void 0
//     }, function(e) {
//         return e ? void 0 : Ae((function() {
//             return {}
//         }))
//     }];

//     function Ve(e, t, r) {
//         return d({}, r, e, t)
//     }
//     var Ke = [function(e) {
//             return "function" == typeof e ? function(e) {
//                 return function(t, r) {
//                     var n, o = r.pure,
//                         u = r.areMergedPropsEqual,
//                         a = !1;
//                     return function(t, r, c) {
//                         var i = e(t, r, c);
//                         return a ? o && u(i, n) || (n = i) : (a = !0, n = i), n
//                     }
//                 }
//             }(e) : void 0
//         }, function(e) {
//             return e ? void 0 : function() {
//                 return Ve
//             }
//         }],
//         Be = ["initMapStateToProps", "initMapDispatchToProps", "initMergeProps"];

//     function Ye(e, t, r, n) {
//         return function(o, u) {
//             return r(e(o, u), t(n, u), u)
//         }
//     }

//     function Ge(e, t, r, n, o) {
//         var u, a, c, i, f, s = o.areStatesEqual,
//             p = o.areOwnPropsEqual,
//             l = o.areStatePropsEqual,
//             d = !1;

//         function y(o, d) {
//             var y, v, m = !p(d, a),
//                 b = !s(o, u);
//             return u = o, a = d, m && b ? (c = e(u, a), t.dependsOnOwnProps && (i = t(n, a)), f = r(c, i, a)) : m ? (e.dependsOnOwnProps && (c = e(u, a)), t.dependsOnOwnProps && (i = t(n, a)), f = r(c, i, a)) : b ? (y = e(u, a), v = !l(y, c), c = y, v && (f = r(c, i, a)), f) : f
//         }
//         return function(o, s) {
//             return d ? y(o, s) : (c = e(u = o, a = s), i = t(n, a), f = r(c, i, a), d = !0, f)
//         }
//     }

//     function Je(e, t) {
//         var r = t.initMapStateToProps,
//             n = t.initMapDispatchToProps,
//             o = t.initMergeProps,
//             u = y(t, Be),
//             a = r(e, u),
//             c = n(e, u),
//             i = o(e, u);
//         return (u.pure ? Ge : Ye)(a, c, i, e, u)
//     }
//     var Qe = ["pure", "areStatesEqual", "areOwnPropsEqual", "areStatePropsEqual", "areMergedPropsEqual"];

//     function Xe(e, t, r) {
//         for (var n = t.length - 1; n >= 0; n--) {
//             var o = t[n](e);
//             if (o) return o
//         }
//         return function(t, n) {
//             throw Error("Invalid value of type " + typeof e + " for " + r + " argument when connecting component " + n.wrappedComponentName + ".")
//         }
//     }

//     function Ze(e, t) {
//         return e === t
//     }

//     function et(e) {
//         var t = void 0 === e ? {} : e,
//             r = t.connectHOC,
//             n = void 0 === r ? ke : r,
//             o = t.mapStateToPropsFactories,
//             u = void 0 === o ? Ie : o,
//             a = t.mapDispatchToPropsFactories,
//             c = void 0 === a ? ze : a,
//             i = t.mergePropsFactories,
//             f = void 0 === i ? Ke : i,
//             s = t.selectorFactory,
//             p = void 0 === s ? Je : s;
//         return function(e, t, r, o) {
//             void 0 === o && (o = {});
//             var a = o.pure,
//                 i = void 0 === a || a,
//                 s = o.areStatesEqual,
//                 l = void 0 === s ? Ze : s,
//                 v = o.areOwnPropsEqual,
//                 m = void 0 === v ? Ue : v,
//                 b = o.areStatePropsEqual,
//                 S = void 0 === b ? Ue : b,
//                 h = o.areMergedPropsEqual,
//                 P = void 0 === h ? Ue : h,
//                 g = y(o, Qe),
//                 O = Xe(e, u, "mapStateToProps"),
//                 w = Xe(t, c, "mapDispatchToProps"),
//                 C = Xe(r, f, "mergeProps");
//             return n(p, d({
//                 methodName: "connect",
//                 getDisplayName: function(e) {
//                     return "Connect(" + e + ")"
//                 },
//                 shouldHandleStateChanges: !!e,
//                 initMapStateToProps: O,
//                 initMapDispatchToProps: w,
//                 initMergeProps: C,
//                 pure: i,
//                 areStatesEqual: l,
//                 areOwnPropsEqual: m,
//                 areStatePropsEqual: S,
//                 areMergedPropsEqual: P
//             }, g))
//         }
//     }
//     var tt = et();

//     function rt() {
//         return t.useContext(c)
//     }

//     function nt(e) {
//         void 0 === e && (e = c);
//         var r = e === c ? rt : function() {
//             return t.useContext(e)
//         };
//         return function() {
//             return r().store
//         }
//     }
//     var ot = nt();

//     function ut(e) {
//         void 0 === e && (e = c);
//         var t = e === c ? ot : nt(e);
//         return function() {
//             return t().dispatch
//         }
//     }
//     var at = ut(),
//         ct = function(e, t) {
//             return e === t
//         };

//     function it(e) {
//         void 0 === e && (e = c);
//         var r = e === c ? rt : function() {
//             return t.useContext(e)
//         };
//         return function(e, n) {
//             void 0 === n && (n = ct);
//             var o = r(),
//                 u = function(e, r, n, o) {
//                     var u, a = t.useReducer((function(e) {
//                             return e + 1
//                         }), 0)[1],
//                         c = t.useMemo((function() {
//                             return p(n, o)
//                         }), [n, o]),
//                         i = t.useRef(),
//                         f = t.useRef(),
//                         s = t.useRef(),
//                         d = t.useRef(),
//                         y = n.getState();
//                     try {
//                         if (e !== f.current || y !== s.current || i.current) {
//                             var v = e(y);
//                             u = void 0 !== d.current && r(v, d.current) ? d.current : v
//                         } else u = d.current
//                     } catch (e) {
//                         throw i.current && (e.message += "\nThe error may be correlated with this previous error:\n" + i.current.stack + "\n\n"), e
//                     }
//                     return l((function() {
//                         f.current = e, s.current = y, d.current = u, i.current = void 0
//                     })), l((function() {
//                         function e() {
//                             try {
//                                 var e = n.getState();
//                                 if (e === s.current) return;
//                                 var t = f.current(e);
//                                 if (r(t, d.current)) return;
//                                 d.current = t, s.current = e
//                             } catch (e) {
//                                 i.current = e
//                             }
//                             a()
//                         }
//                         return c.onStateChange = e, c.trySubscribe(), e(),
//                             function() {
//                                 return c.tryUnsubscribe()
//                             }
//                     }), [n, c]), u
//                 }(e, n, o.store, o.subscription);
//             return t.useDebugValue(u), u
//         }
//     }
//     var ft = it();
//     i = r.unstable_batchedUpdates, Object.defineProperty(e, "batch", {
//         enumerable: !0,
//         get: function() {
//             return r.unstable_batchedUpdates
//         }
//     }), e.Provider = function(e) {
//         var r = e.store,
//             n = e.context,
//             u = e.children,
//             a = t.useMemo((function() {
//                 var e = p(r);
//                 return e.onStateChange = e.notifyNestedSubs, {
//                     store: r,
//                     subscription: e
//                 }
//             }), [r]),
//             i = t.useMemo((function() {
//                 return r.getState()
//             }), [r]);
//         return l((function() {
//             var e = a.subscription;
//             return e.trySubscribe(), i !== r.getState() && e.notifyNestedSubs(),
//                 function() {
//                     e.tryUnsubscribe(), e.onStateChange = null
//                 }
//         }), [a, i]), o.default.createElement((n || c).Provider, {
//             value: a
//         }, u)
//     }, e.ReactReduxContext = c, e.connect = tt, e.connectAdvanced = ke, e.createDispatchHook = ut, e.createSelectorHook = it, e.createStoreHook = nt, e.shallowEqual = Ue, e.useDispatch = at, e.useSelector = ft, e.useStore = ot, Object.defineProperty(e, "__esModule", {
//         value: !0
//     })
};