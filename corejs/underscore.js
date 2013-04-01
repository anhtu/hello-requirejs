/**
 * Author: tuna
 * Date: 4/1/13
 * Time: 4:33 PM
 */
/* first portion of corejs */
(function(){
    window.dc={};
    dc.controllers={}; // Routers
    dc.model={};       // Models
    dc.app={};         // Common to the app
    dc.ui={}           // UI
})();

/* underscore js */
(function () {
    var y = this;
    var u = y._;
    var b = {};
    var k = Array.prototype,
        E = Object.prototype,
        H = Function.prototype;
    var w = k.slice,
        A = k.unshift,
        z = E.toString,
        q = E.hasOwnProperty;
    var o = k.forEach,
        j = k.map,
        C = k.reduce,
        e = k.reduceRight,
        n = k.filter,
        a = k.every,
        B = k.some,
        x = k.indexOf,
        f = k.lastIndexOf,
        c = Array.isArray,
        D = Object.keys,
        l = H.bind;
    var G = function (J) {
        return new g(J)
    };
    if (typeof exports !== "undefined") {
        if (typeof module !== "undefined" && module.exports) {
            exports = module.exports = G
        }
        exports._ = G
    } else {
        y._ = G
    }
    G.VERSION = "1.3.1";
    var d = G.each = G.forEach = function (O, N, M) {
        if (O == null) {
            return
        }
        if (o && O.forEach === o) {
            O.forEach(N, M)
        } else {
            if (O.length === +O.length) {
                for (var L = 0, J = O.length; L < J; L++) {
                    if (L in O && N.call(M, O[L], L, O) === b) {
                        return
                    }
                }
            } else {
                for (var K in O) {
                    if (G.has(O, K)) {
                        if (N.call(M, O[K], K, O) === b) {
                            return
                        }
                    }
                }
            }
        }
    };
    G.map = G.collect = function (M, L, K) {
        var J = [];
        if (M == null) {
            return J
        }
        if (j && M.map === j) {
            return M.map(L, K)
        }
        d(M, function (P, N, O) {
            J[J.length] = L.call(K, P, N, O)
        });
        if (M.length === +M.length) {
            J.length = M.length
        }
        return J
    };
    G.reduce = G.foldl = G.inject = function (N, M, J, L) {
        var K = arguments.length > 2;
        if (N == null) {
            N = []
        }
        if (C && N.reduce === C) {
            if (L) {
                M = G.bind(M, L)
            }
            return K ? N.reduce(M, J) : N.reduce(M)
        }
        d(N, function (Q, O, P) {
            if (!K) {
                J = Q;
                K = true
            } else {
                J = M.call(L, J, Q, O, P)
            }
        });
        if (!K) {
            throw new TypeError("Reduce of empty array with no initial value")
        }
        return J
    };
    G.reduceRight = G.foldr = function (N, M, J, L) {
        var K = arguments.length > 2;
        if (N == null) {
            N = []
        }
        if (e && N.reduceRight === e) {
            if (L) {
                M = G.bind(M, L)
            }
            return K ? N.reduceRight(M, J) : N.reduceRight(M)
        }
        var O = G.toArray(N).reverse();
        if (L && !K) {
            M = G.bind(M, L)
        }
        return K ? G.reduce(O, M, J, L) : G.reduce(O, M)
    };
    G.find = G.detect = function (M, L, K) {
        var J;
        s(M, function (P, N, O) {
            if (L.call(K, P, N, O)) {
                J = P;
                return true
            }
        });
        return J
    };
    G.filter = G.select = function (M, L, K) {
        var J = [];
        if (M == null) {
            return J
        }
        if (n && M.filter === n) {
            return M.filter(L, K)
        }
        d(M, function (P, N, O) {
            if (L.call(K, P, N, O)) {
                J[J.length] = P
            }
        });
        return J
    };
    G.reject = function (M, L, K) {
        var J = [];
        if (M == null) {
            return J
        }
        d(M, function (P, N, O) {
            if (!L.call(K, P, N, O)) {
                J[J.length] = P
            }
        });
        return J
    };
    G.every = G.all = function (M, L, K) {
        var J = true;
        if (M == null) {
            return J
        }
        if (a && M.every === a) {
            return M.every(L, K)
        }
        d(M, function (P, N, O) {
            if (!(J = J && L.call(K, P, N, O))) {
                return b
            }
        });
        return J
    };
    var s = G.some = G.any = function (M, L, K) {
        L || (L = G.identity);
        var J = false;
        if (M == null) {
            return J
        }
        if (B && M.some === B) {
            return M.some(L, K)
        }
        d(M, function (P, N, O) {
            if (J || (J = L.call(K, P, N, O))) {
                return b
            }
        });
        return !!J
    };
    G.include = G.contains = function (L, K) {
        var J = false;
        if (L == null) {
            return J
        }
        if (x && L.indexOf === x) {
            return L.indexOf(K) != -1
        }
        J = s(L, function (M) {
            return M === K
        });
        return J
    };
    G.invoke = function (K, L) {
        var J = w.call(arguments, 2);
        return G.map(K, function (M) {
            return (G.isFunction(L) ? L || M : M[L]).apply(M, J)
        })
    };
    G.pluck = function (K, J) {
        return G.map(K, function (L) {
            return L[J]
        })
    };
    G.max = function (M, L, K) {
        if (!L && G.isArray(M) && M[0] === +M[0]) {
            return Math.max.apply(Math, M)
        }
        if (!L && G.isEmpty(M)) {
            return -Infinity
        }
        var J = {
            computed: -Infinity
        };
        d(M, function (Q, N, P) {
            var O = L ? L.call(K, Q, N, P) : Q;
            O >= J.computed && (J = {
                value: Q,
                computed: O
            })
        });
        return J.value
    };
    G.min = function (M, L, K) {
        if (!L && G.isArray(M) && M[0] === +M[0]) {
            return Math.min.apply(Math, M)
        }
        if (!L && G.isEmpty(M)) {
            return Infinity
        }
        var J = {
            computed: Infinity
        };
        d(M, function (Q, N, P) {
            var O = L ? L.call(K, Q, N, P) : Q;
            O < J.computed && (J = {
                value: Q,
                computed: O
            })
        });
        return J.value
    };
    G.shuffle = function (L) {
        var J = [],
            K;
        d(L, function (O, M, N) {
            if (M == 0) {
                J[0] = O
            } else {
                K = Math.floor(Math.random() * (M + 1));
                J[M] = J[K];
                J[K] = O
            }
        });
        return J
    };
    G.sortBy = function (L, K, J) {
        return G.pluck(G.map(L, function (O, M, N) {
            return {
                value: O,
                criteria: K.call(J, O, M, N)
            }
        }).sort(function (P, O) {
                var N = P.criteria,
                    M = O.criteria;
                return N < M ? -1 : N > M ? 1 : 0
            }), "value")
    };
    G.groupBy = function (L, M) {
        var J = {};
        var K = G.isFunction(M) ? M : function (N) {
            return N[M]
        };
        d(L, function (P, N) {
            var O = K(P, N);
            (J[O] || (J[O] = [])).push(P)
        });
        return J
    };
    G.sortedIndex = function (O, N, L) {
        L || (L = G.identity);
        var J = 0,
            M = O.length;
        while (J < M) {
            var K = (J + M) >> 1;
            L(O[K]) < L(N) ? J = K + 1 : M = K
        }
        return J
    };
    G.toArray = function (J) {
        if (!J) {
            return []
        }
        if (J.toArray) {
            return J.toArray()
        }
        if (G.isArray(J)) {
            return w.call(J)
        }
        if (G.isArguments(J)) {
            return w.call(J)
        }
        return G.values(J)
    };
    G.size = function (J) {
        return G.toArray(J).length
    };
    G.first = G.head = function (L, K, J) {
        return (K != null) && !J ? w.call(L, 0, K) : L[0]
    };
    G.initial = function (L, K, J) {
        return w.call(L, 0, L.length - ((K == null) || J ? 1 : K))
    };
    G.last = function (L, K, J) {
        if ((K != null) && !J) {
            return w.call(L, Math.max(L.length - K, 0))
        } else {
            return L[L.length - 1]
        }
    };
    G.rest = G.tail = function (L, J, K) {
        return w.call(L, (J == null) || K ? 1 : J)
    };
    G.compact = function (J) {
        return G.filter(J, function (K) {
            return !!K
        })
    };
    G.flatten = function (K, J) {
        return G.reduce(K, function (L, M) {
            if (G.isArray(M)) {
                return L.concat(J ? M : G.flatten(M))
            }
            L[L.length] = M;
            return L
        }, [])
    };
    G.without = function (J) {
        return G.difference(J, w.call(arguments, 1))
    };
    G.uniq = G.unique = function (N, M, L) {
        var K = L ? G.map(N, L) : N;
        var J = [];
        G.reduce(K, function (O, Q, P) {
            if (0 == P || (M === true ? G.last(O) != Q : !G.include(O, Q))) {
                O[O.length] = Q;
                J[J.length] = N[P]
            }
            return O
        }, []);
        return J
    };
    G.union = function () {
        return G.uniq(G.flatten(arguments, true))
    };
    G.intersection = G.intersect = function (K) {
        var J = w.call(arguments, 1);
        return G.filter(G.uniq(K), function (L) {
            return G.every(J, function (M) {
                return G.indexOf(M, L) >= 0
            })
        })
    };
    G.difference = function (K) {
        var J = G.flatten(w.call(arguments, 1));
        return G.filter(K, function (L) {
            return !G.include(J, L)
        })
    };
    G.zip = function () {
        var J = w.call(arguments);
        var M = G.max(G.pluck(J, "length"));
        var L = new Array(M);
        for (var K = 0; K < M; K++) {
            L[K] = G.pluck(J, "" + K)
        }
        return L
    };
    G.indexOf = function (N, L, M) {
        if (N == null) {
            return -1
        }
        var K, J;
        if (M) {
            K = G.sortedIndex(N, L);
            return N[K] === L ? K : -1
        }
        if (x && N.indexOf === x) {
            return N.indexOf(L)
        }
        for (K = 0, J = N.length; K < J; K++) {
            if (K in N && N[K] === L) {
                return K
            }
        }
        return -1
    };
    G.lastIndexOf = function (L, K) {
        if (L == null) {
            return -1
        }
        if (f && L.lastIndexOf === f) {
            return L.lastIndexOf(K)
        }
        var J = L.length;
        while (J--) {
            if (J in L && L[J] === K) {
                return J
            }
        }
        return -1
    };
    G.range = function (O, M, N) {
        if (arguments.length <= 1) {
            M = O || 0;
            O = 0
        }
        N = arguments[2] || 1;
        var K = Math.max(Math.ceil((M - O) / N), 0);
        var J = 0;
        var L = new Array(K);
        while (J < K) {
            L[J++] = O;
            O += N
        }
        return L
    };
    var h = function () {};
    G.bind = function I(M, K) {
        var L, J;
        if (M.bind === l && l) {
            return l.apply(M, w.call(arguments, 1))
        }
        if (!G.isFunction(M)) {
            throw new TypeError
        }
        J = w.call(arguments, 2);
        return L = function () {
            if (!(this instanceof L)) {
                return M.apply(K, J.concat(w.call(arguments)))
            }
            h.prototype = M.prototype;
            var O = new h;
            var N = M.apply(O, J.concat(w.call(arguments)));
            if (Object(N) === N) {
                return N
            }
            return O
        }
    };
    G.bindAll = function (K) {
        var J = w.call(arguments, 1);
        if (J.length == 0) {
            J = G.functions(K)
        }
        d(J, function (L) {
            K[L] = G.bind(K[L], K)
        });
        return K
    };
    G.memoize = function (L, K) {
        var J = {};
        K || (K = G.identity);
        return function () {
            var M = K.apply(this, arguments);
            return G.has(J, M) ? J[M] : (J[M] = L.apply(this, arguments))
        }
    };
    G.delay = function (K, L) {
        var J = w.call(arguments, 2);
        return setTimeout(function () {
            return K.apply(K, J)
        }, L)
    };
    G.defer = function (J) {
        return G.delay.apply(G, [J, 1].concat(w.call(arguments, 1)))
    };
    G.throttle = function (O, Q) {
        var M, J, P, N, L;
        var K = G.debounce(function () {
            L = N = false
        }, Q);
        return function () {
            M = this;
            J = arguments;
            var R = function () {
                P = null;
                if (L) {
                    O.apply(M, J)
                }
                K()
            };
            if (!P) {
                P = setTimeout(R, Q)
            }
            if (N) {
                L = true
            } else {
                O.apply(M, J)
            }
            K();
            N = true
        }
    };
    G.debounce = function (J, L) {
        var K;
        return function () {
            var O = this,
                N = arguments;
            var M = function () {
                K = null;
                J.apply(O, N)
            };
            clearTimeout(K);
            K = setTimeout(M, L)
        }
    };
    G.once = function (L) {
        var J = false,
            K;
        return function () {
            if (J) {
                return K
            }
            J = true;
            return K = L.apply(this, arguments)
        }
    };
    G.wrap = function (J, K) {
        return function () {
            var L = [J].concat(w.call(arguments, 0));
            return K.apply(this, L)
        }
    };
    G.compose = function () {
        var J = arguments;
        return function () {
            var K = arguments;
            for (var L = J.length - 1; L >= 0; L--) {
                K = [J[L].apply(this, K)]
            }
            return K[0]
        }
    };
    G.after = function (K, J) {
        if (K <= 0) {
            return J()
        }
        return function () {
            if (--K < 1) {
                return J.apply(this, arguments)
            }
        }
    };
    G.keys = D || function (L) {
        if (L !== Object(L)) {
            throw new TypeError("Invalid object")
        }
        var K = [];
        for (var J in L) {
            if (G.has(L, J)) {
                K[K.length] = J
            }
        }
        return K
    };
    G.values = function (J) {
        return G.map(J, G.identity)
    };
    G.functions = G.methods = function (L) {
        var K = [];
        for (var J in L) {
            if (G.isFunction(L[J])) {
                K.push(J)
            }
        }
        return K.sort()
    };
    G.extend = function (J) {
        d(w.call(arguments, 1), function (K) {
            for (var L in K) {
                J[L] = K[L]
            }
        });
        return J
    };
    G.defaults = function (J) {
        d(w.call(arguments, 1), function (K) {
            for (var L in K) {
                if (J[L] == null) {
                    J[L] = K[L]
                }
            }
        });
        return J
    };
    G.clone = function (J) {
        if (!G.isObject(J)) {
            return J
        }
        return G.isArray(J) ? J.slice() : G.extend({}, J)
    };
    G.tap = function (K, J) {
        J(K);
        return K
    };

    function F(M, L, K) {
        if (M === L) {
            return M !== 0 || 1 / M == 1 / L
        }
        if (M == null || L == null) {
            return M === L
        }
        if (M._chain) {
            M = M._wrapped
        }
        if (L._chain) {
            L = L._wrapped
        }
        if (M.isEqual && G.isFunction(M.isEqual)) {
            return M.isEqual(L)
        }
        if (L.isEqual && G.isFunction(L.isEqual)) {
            return L.isEqual(M)
        }
        var P = z.call(M);
        if (P != z.call(L)) {
            return false
        }
        switch (P) {
            case "[object String]":
                return M == String(L);
            case "[object Number]":
                return M != +M ? L != +L : (M == 0 ? 1 / M == 1 / L : M == +L);
            case "[object Date]":
            case "[object Boolean]":
                return +M == +L;
            case "[object RegExp]":
                return M.source == L.source && M.global == L.global && M.multiline == L.multiline && M.ignoreCase == L.ignoreCase
        }
        if (typeof M != "object" || typeof L != "object") {
            return false
        }
        var Q = K.length;
        while (Q--) {
            if (K[Q] == M) {
                return true
            }
        }
        K.push(M);
        var O = 0,
            J = true;
        if (P == "[object Array]") {
            O = M.length;
            J = O == L.length;
            if (J) {
                while (O--) {
                    if (!(J = O in M == O in L && F(M[O], L[O], K))) {
                        break
                    }
                }
            }
        } else {
            if ("constructor" in M != "constructor" in L || M.constructor != L.constructor) {
                return false
            }
            for (var N in M) {
                if (G.has(M, N)) {
                    O++;
                    if (!(J = G.has(L, N) && F(M[N], L[N], K))) {
                        break
                    }
                }
            }
            if (J) {
                for (N in L) {
                    if (G.has(L, N) && !(O--)) {
                        break
                    }
                }
                J = !O
            }
        }
        K.pop();
        return J
    }
    G.isEqual = function (K, J) {
        return F(K, J, [])
    };
    G.isEmpty = function (K) {
        if (G.isArray(K) || G.isString(K)) {
            return K.length === 0
        }
        for (var J in K) {
            if (G.has(K, J)) {
                return false
            }
        }
        return true
    };
    G.isElement = function (J) {
        return !!(J && J.nodeType == 1)
    };
    G.isArray = c || function (J) {
        return z.call(J) == "[object Array]"
    };
    G.isObject = function (J) {
        return J === Object(J)
    };
    G.isArguments = function (J) {
        return z.call(J) == "[object Arguments]"
    };
    if (!G.isArguments(arguments)) {
        G.isArguments = function (J) {
            return !!(J && G.has(J, "callee"))
        }
    }
    G.isFunction = function (J) {
        return z.call(J) == "[object Function]"
    };
    G.isString = function (J) {
        return z.call(J) == "[object String]"
    };
    G.isNumber = function (J) {
        return z.call(J) == "[object Number]"
    };
    G.isNaN = function (J) {
        return J !== J
    };
    G.isBoolean = function (J) {
        return J === true || J === false || z.call(J) == "[object Boolean]"
    };
    G.isDate = function (J) {
        return z.call(J) == "[object Date]"
    };
    G.isRegExp = function (J) {
        return z.call(J) == "[object RegExp]"
    };
    G.isNull = function (J) {
        return J === null
    };
    G.isUndefined = function (J) {
        return J === void 0
    };
    G.has = function (K, J) {
        return q.call(K, J)
    };
    G.noConflict = function () {
        y._ = u;
        return this
    };
    G.identity = function (J) {
        return J
    };
    G.times = function (M, L, K) {
        for (var J = 0; J < M; J++) {
            L.call(K, J)
        }
    };
    G.escape = function (J) {
        return ("" + J).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;")
    };
    G.mixin = function (J) {
        d(G.functions(J), function (K) {
            t(K, G[K] = J[K])
        })
    };
    var m = 0;
    G.uniqueId = function (J) {
        var K = m++;
        return J ? J + K : K
    };
    G.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };
    var v = /.^/;
    var r = function (J) {
        return J.replace(/\\\\/g, "\\").replace(/\\'/g, "'")
    };
    G.template = function (M, L) {
        var N = G.templateSettings;
        var J = "var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('" + M.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(N.escape || v, function (O, P) {
            return "',_.escape(" + r(P) + "),'"
        }).replace(N.interpolate || v, function (O, P) {
                return "'," + r(P) + ",'"
            }).replace(N.evaluate || v, function (O, P) {
                return "');" + r(P).replace(/[\r\n\t]/g, " ") + ";__p.push('"
            }).replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t") + "');}return __p.join('');";
        var K = new Function("obj", "_", J);
        if (L) {
            return K(L, G)
        }
        return function (O) {
            return K.call(this, O, G)
        }
    };
    G.chain = function (J) {
        return G(J).chain()
    };
    var g = function (J) {
        this._wrapped = J
    };
    G.prototype = g.prototype;
    var p = function (K, J) {
        return J ? G(K).chain() : K
    };
    var t = function (J, K) {
        g.prototype[J] = function () {
            var L = w.call(arguments);
            A.call(L, this._wrapped);
            return p(K.apply(G, L), this._chain)
        }
    };
    G.mixin(G);
    d(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (J) {
        var K = k[J];
        g.prototype[J] = function () {
            var L = this._wrapped;
            K.apply(L, arguments);
            var M = L.length;
            if ((J == "shift" || J == "splice") && M === 0) {
                delete L[0]
            }
            return p(L, this._chain)
        }
    });
    d(["concat", "join", "slice"], function (J) {
        var K = k[J];
        g.prototype[J] = function () {
            return p(K.apply(this._wrapped, arguments), this._chain)
        }
    });
    g.prototype.chain = function () {
        this._chain = true;
        return this
    };
    g.prototype.value = function () {
        return this._wrapped
    }
}).call(this);