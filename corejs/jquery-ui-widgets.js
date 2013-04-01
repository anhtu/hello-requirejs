/**
 * Author: tuna
 * Date: 4/1/13
 * Time: 5:31 PM
 */
/*!
 * jQuery UI Widget 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function (b, d) {
    if (b.cleanData) {
        var c = b.cleanData;
        b.cleanData = function (e) {
            for (var f = 0, g;
                 (g = e[f]) != null; f++) {
                b(g).triggerHandler("remove")
            }
            c(e)
        }
    } else {
        var a = b.fn.remove;
        b.fn.remove = function (e, f) {
            return this.each(function () {
                if (!f) {
                    if (!e || b.filter(e, [this]).length) {
                        b("*", this).add([this]).each(function () {
                            b(this).triggerHandler("remove")
                        })
                    }
                }
                return a.call(b(this), e, f)
            })
        }
    }
    b.widget = function (f, h, e) {
        var g = f.split(".")[0],
            k;
        f = f.split(".")[1];
        k = g + "-" + f;
        if (!e) {
            e = h;
            h = b.Widget
        }
        b.expr[":"][k] = function (l) {
            return !!b.data(l, f)
        };
        b[g] = b[g] || {};
        b[g][f] = function (l, m) {
            if (arguments.length) {
                this._createWidget(l, m)
            }
        };
        var j = new h();
        j.options = b.extend(true, {}, j.options);
        b[g][f].prototype = b.extend(true, j, {
            namespace: g,
            widgetName: f,
            widgetEventPrefix: b[g][f].prototype.widgetEventPrefix || f,
            widgetBaseClass: k
        }, e);
        b.widget.bridge(f, b[g][f])
    };
    b.widget.bridge = function (f, e) {
        b.fn[f] = function (j) {
            var g = typeof j === "string",
                h = Array.prototype.slice.call(arguments, 1),
                k = this;
            j = !g && h.length ? b.extend.apply(null, [true, j].concat(h)) : j;
            if (g && j.charAt(0) === "_") {
                return k
            }
            if (g) {
                this.each(function () {
                    var l = b.data(this, f),
                        m = l && b.isFunction(l[j]) ? l[j].apply(l, h) : l;
                    if (m !== l && m !== d) {
                        k = m;
                        return false
                    }
                })
            } else {
                this.each(function () {
                    var l = b.data(this, f);
                    if (l) {
                        l.option(j || {})._init()
                    } else {
                        b.data(this, f, new e(j, this))
                    }
                })
            }
            return k
        }
    };
    b.Widget = function (e, f) {
        if (arguments.length) {
            this._createWidget(e, f)
        }
    };
    b.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        options: {
            disabled: false
        },
        _createWidget: function (f, g) {
            b.data(g, this.widgetName, this);
            this.element = b(g);
            this.options = b.extend(true, {}, this.options, this._getCreateOptions(), f);
            var e = this;
            this.element.bind("remove." + this.widgetName, function () {
                e.destroy()
            });
            this._create();
            this._trigger("create");
            this._init()
        },
        _getCreateOptions: function () {
            return b.metadata && b.metadata.get(this.element[0])[this.widgetName]
        },
        _create: function () {},
        _init: function () {},
        destroy: function () {
            this.element.unbind("." + this.widgetName).removeData(this.widgetName);
            this.widget().unbind("." + this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass + "-disabled ui-state-disabled")
        },
        widget: function () {
            return this.element
        },
        option: function (f, g) {
            var e = f;
            if (arguments.length === 0) {
                return b.extend({}, this.options)
            }
            if (typeof f === "string") {
                if (g === d) {
                    return this.options[f]
                }
                e = {};
                e[f] = g
            }
            this._setOptions(e);
            return this
        },
        _setOptions: function (f) {
            var e = this;
            b.each(f, function (g, h) {
                e._setOption(g, h)
            });
            return this
        },
        _setOption: function (e, f) {
            this.options[e] = f;
            if (e === "disabled") {
                this.widget()[f ? "addClass" : "removeClass"](this.widgetBaseClass + "-disabled ui-state-disabled").attr("aria-disabled", f)
            }
            return this
        },
        enable: function () {
            return this._setOption("disabled", false)
        },
        disable: function () {
            return this._setOption("disabled", true)
        },
        _trigger: function (f, g, h) {
            var k = this.options[f];
            g = b.Event(g);
            g.type = (f === this.widgetEventPrefix ? f : this.widgetEventPrefix + f).toLowerCase();
            h = h || {};
            if (g.originalEvent) {
                for (var e = b.event.props.length, j; e;) {
                    j = b.event.props[--e];
                    g[j] = g.originalEvent[j]
                }
            }
            this.element.trigger(g, h);
            return !(b.isFunction(k) && k.call(this.element[0], g, h) === false || g.isDefaultPrevented())
        }
    }
})(jQuery);
(function (f, g) {
    f.ui = f.ui || {};
    var d = /left|center|right/,
        e = /top|center|bottom/,
        a = "center",
        b = f.fn.position,
        c = f.fn.offset;
    f.fn.position = function (j) {
        if (!j || !j.of) {
            return b.apply(this, arguments)
        }
        j = f.extend({}, j);
        var n = f(j.of),
            m = n[0],
            p = (j.collision || "flip").split(" "),
            o = j.offset ? j.offset.split(" ") : [0, 0],
            l, h, k;
        if (m.nodeType === 9) {
            l = n.width();
            h = n.height();
            k = {
                top: 0,
                left: 0
            }
        } else {
            if (m.setTimeout) {
                l = n.width();
                h = n.height();
                k = {
                    top: n.scrollTop(),
                    left: n.scrollLeft()
                }
            } else {
                if (m.preventDefault) {
                    j.at = "left top";
                    l = h = 0;
                    k = {
                        top: j.of.pageY,
                        left: j.of.pageX
                    }
                } else {
                    l = n.outerWidth();
                    h = n.outerHeight();
                    k = n.offset()
                }
            }
        }
        f.each(["my", "at"], function () {
            var q = (j[this] || "").split(" ");
            if (q.length === 1) {
                q = d.test(q[0]) ? q.concat([a]) : e.test(q[0]) ? [a].concat(q) : [a, a]
            }
            q[0] = d.test(q[0]) ? q[0] : a;
            q[1] = e.test(q[1]) ? q[1] : a;
            j[this] = q
        });
        if (p.length === 1) {
            p[1] = p[0]
        }
        o[0] = parseInt(o[0], 10) || 0;
        if (o.length === 1) {
            o[1] = o[0]
        }
        o[1] = parseInt(o[1], 10) || 0;
        if (j.at[0] === "right") {
            k.left += l
        } else {
            if (j.at[0] === a) {
                k.left += l / 2
            }
        } if (j.at[1] === "bottom") {
            k.top += h
        } else {
            if (j.at[1] === a) {
                k.top += h / 2
            }
        }
        k.left += o[0];
        k.top += o[1];
        return this.each(function () {
            var t = f(this),
                v = t.outerWidth(),
                s = t.outerHeight(),
                u = parseInt(f.curCSS(this, "marginLeft", true)) || 0,
                r = parseInt(f.curCSS(this, "marginTop", true)) || 0,
                x = v + u + (parseInt(f.curCSS(this, "marginRight", true)) || 0),
                y = s + r + (parseInt(f.curCSS(this, "marginBottom", true)) || 0),
                w = f.extend({}, k),
                q;
            if (j.my[0] === "right") {
                w.left -= v
            } else {
                if (j.my[0] === a) {
                    w.left -= v / 2
                }
            } if (j.my[1] === "bottom") {
                w.top -= s
            } else {
                if (j.my[1] === a) {
                    w.top -= s / 2
                }
            }
            w.left = Math.round(w.left);
            w.top = Math.round(w.top);
            q = {
                left: w.left - u,
                top: w.top - r
            };
            f.each(["left", "top"], function (A, z) {
                if (f.ui.position[p[A]]) {
                    f.ui.position[p[A]][z](w, {
                        targetWidth: l,
                        targetHeight: h,
                        elemWidth: v,
                        elemHeight: s,
                        collisionPosition: q,
                        collisionWidth: x,
                        collisionHeight: y,
                        offset: o,
                        my: j.my,
                        at: j.at
                    })
                }
            });
            if (f.fn.bgiframe) {
                t.bgiframe()
            }
            t.offset(f.extend(w, {
                using: j.using
            }))
        })
    };
    f.ui.position = {
        fit: {
            left: function (h, j) {
                var l = f(window),
                    k = j.collisionPosition.left + j.collisionWidth - l.width() - l.scrollLeft();
                h.left = k > 0 ? h.left - k : Math.max(h.left - j.collisionPosition.left, h.left)
            },
            top: function (h, j) {
                var l = f(window),
                    k = j.collisionPosition.top + j.collisionHeight - l.height() - l.scrollTop();
                h.top = k > 0 ? h.top - k : Math.max(h.top - j.collisionPosition.top, h.top)
            }
        },
        flip: {
            left: function (j, l) {
                if (l.at[0] === a) {
                    return
                }
                var n = f(window),
                    m = l.collisionPosition.left + l.collisionWidth - n.width() - n.scrollLeft(),
                    h = l.my[0] === "left" ? -l.elemWidth : l.my[0] === "right" ? l.elemWidth : 0,
                    k = l.at[0] === "left" ? l.targetWidth : -l.targetWidth,
                    o = -2 * l.offset[0];
                j.left += l.collisionPosition.left < 0 ? h + k + o : m > 0 ? h + k + o : 0
            },
            top: function (j, l) {
                if (l.at[1] === a) {
                    return
                }
                var n = f(window),
                    m = l.collisionPosition.top + l.collisionHeight - n.height() - n.scrollTop(),
                    h = l.my[1] === "top" ? -l.elemHeight : l.my[1] === "bottom" ? l.elemHeight : 0,
                    k = l.at[1] === "top" ? l.targetHeight : -l.targetHeight,
                    o = -2 * l.offset[1];
                j.top += l.collisionPosition.top < 0 ? h + k + o : m > 0 ? h + k + o : 0
            }
        }
    };
    if (!f.offset.setOffset) {
        f.offset.setOffset = function (m, j) {
            if (/static/.test(f.curCSS(m, "position"))) {
                m.style.position = "relative"
            }
            var l = f(m),
                o = l.offset(),
                h = parseInt(f.curCSS(m, "top", true), 10) || 0,
                n = parseInt(f.curCSS(m, "left", true), 10) || 0,
                k = {
                    top: (j.top - o.top) + h,
                    left: (j.left - o.left) + n
                };
            if ("using" in j) {
                j.using.call(m, k)
            } else {
                l.css(k)
            }
        };
        f.fn.offset = function (h) {
            var j = this[0];
            if (!j || !j.ownerDocument) {
                return null
            }
            if (h) {
                return this.each(function () {
                    f.offset.setOffset(this, h)
                })
            }
            return c.call(this)
        }
    }
}(jQuery));