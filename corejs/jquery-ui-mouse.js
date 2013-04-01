/*!
 * jQuery UI Mouse 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Mouse
 *
 * Depends:
 *	jquery.ui.widget.js
 */
(function (b, c) {
    var a = false;
    b(document).mousedown(function (d) {
        a = false
    });
    b.widget("ui.mouse", {
        options: {
            cancel: ":input,option",
            distance: 1,
            delay: 0
        },
        _mouseInit: function () {
            var d = this;
            this.element.bind("mousedown." + this.widgetName, function (e) {
                return d._mouseDown(e)
            }).bind("click." + this.widgetName, function (e) {
                    if (true === b.data(e.target, d.widgetName + ".preventClickEvent")) {
                        b.removeData(e.target, d.widgetName + ".preventClickEvent");
                        e.stopImmediatePropagation();
                        return false
                    }
                });
            this.started = false
        },
        _mouseDestroy: function () {
            this.element.unbind("." + this.widgetName)
        },
        _mouseDown: function (f) {
            if (a) {
                return
            }(this._mouseStarted && this._mouseUp(f));
            this._mouseDownEvent = f;
            var e = this,
                g = (f.which == 1),
                d = (typeof this.options.cancel == "string" ? b(f.target).parents().add(f.target).filter(this.options.cancel).length : false);
            if (!g || d || !this._mouseCapture(f)) {
                return true
            }
            this.mouseDelayMet = !this.options.delay;
            if (!this.mouseDelayMet) {
                this._mouseDelayTimer = setTimeout(function () {
                    e.mouseDelayMet = true
                }, this.options.delay)
            }
            if (this._mouseDistanceMet(f) && this._mouseDelayMet(f)) {
                this._mouseStarted = (this._mouseStart(f) !== false);
                if (!this._mouseStarted) {
                    f.preventDefault();
                    return true
                }
            }
            if (true === b.data(f.target, this.widgetName + ".preventClickEvent")) {
                b.removeData(f.target, this.widgetName + ".preventClickEvent")
            }
            this._mouseMoveDelegate = function (h) {
                return e._mouseMove(h)
            };
            this._mouseUpDelegate = function (h) {
                return e._mouseUp(h)
            };
            b(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate);
            f.preventDefault();
            a = true;
            return true
        },
        _mouseMove: function (d) {
            if (b.browser.msie && !(document.documentMode >= 9) && !d.button) {
                return this._mouseUp(d)
            }
            if (this._mouseStarted) {
                this._mouseDrag(d);
                return d.preventDefault()
            }
            if (this._mouseDistanceMet(d) && this._mouseDelayMet(d)) {
                this._mouseStarted = (this._mouseStart(this._mouseDownEvent, d) !== false);
                (this._mouseStarted ? this._mouseDrag(d) : this._mouseUp(d))
            }
            return !this._mouseStarted
        },
        _mouseUp: function (d) {
            b(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
            if (this._mouseStarted) {
                this._mouseStarted = false;
                if (d.target == this._mouseDownEvent.target) {
                    b.data(d.target, this.widgetName + ".preventClickEvent", true)
                }
                this._mouseStop(d)
            }
            return false
        },
        _mouseDistanceMet: function (d) {
            return (Math.max(Math.abs(this._mouseDownEvent.pageX - d.pageX), Math.abs(this._mouseDownEvent.pageY - d.pageY)) >= this.options.distance)
        },
        _mouseDelayMet: function (d) {
            return this.mouseDelayMet
        },
        _mouseStart: function (d) {},
        _mouseDrag: function (d) {},
        _mouseStop: function (d) {},
        _mouseCapture: function (d) {
            return true
        }
    })
})(jQuery);
(function (a, b) {
    a.widget("ui.sortable", a.ui.mouse, {
        widgetEventPrefix: "sort",
        options: {
            appendTo: "parent",
            axis: false,
            connectWith: false,
            containment: false,
            cursor: "auto",
            cursorAt: false,
            dropOnEmpty: true,
            forcePlaceholderSize: false,
            forceHelperSize: false,
            grid: false,
            handle: false,
            helper: "original",
            items: "> *",
            opacity: false,
            placeholder: false,
            revert: false,
            scroll: true,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            scope: "default",
            tolerance: "intersect",
            zIndex: 1000
        },
        _create: function () {
            var c = this.options;
            this.containerCache = {};
            this.element.addClass("ui-sortable");
            this.refresh();
            this.floating = this.items.length ? c.axis === "x" || (/left|right/).test(this.items[0].item.css("float")) || (/inline|table-cell/).test(this.items[0].item.css("display")) : false;
            this.offset = this.element.offset();
            this._mouseInit()
        },
        destroy: function () {
            this.element.removeClass("ui-sortable ui-sortable-disabled").removeData("sortable").unbind(".sortable");
            this._mouseDestroy();
            for (var c = this.items.length - 1; c >= 0; c--) {
                this.items[c].item.removeData("sortable-item")
            }
            return this
        },
        _setOption: function (c, d) {
            if (c === "disabled") {
                this.options[c] = d;
                this.widget()[d ? "addClass" : "removeClass"]("ui-sortable-disabled")
            } else {
                a.Widget.prototype._setOption.apply(this, arguments)
            }
        },
        _mouseCapture: function (f, g) {
            if (this.reverting) {
                return false
            }
            if (this.options.disabled || this.options.type == "static") {
                return false
            }
            this._refreshItems(f);
            var e = null,
                d = this,
                c = a(f.target).parents().each(function () {
                    if (a.data(this, "sortable-item") == d) {
                        e = a(this);
                        return false
                    }
                });
            if (a.data(f.target, "sortable-item") == d) {
                e = a(f.target)
            }
            if (!e) {
                return false
            }
            if (this.options.handle && !g) {
                var h = false;
                a(this.options.handle, e).find("*").andSelf().each(function () {
                    if (this == f.target) {
                        h = true
                    }
                });
                if (!h) {
                    return false
                }
            }
            this.currentItem = e;
            this._removeCurrentsFromItems();
            return true
        },
        _mouseStart: function (f, g, c) {
            var h = this.options,
                d = this;
            this.currentContainer = this;
            this.refreshPositions();
            this.helper = this._createHelper(f);
            this._cacheHelperProportions();
            this._cacheMargins();
            this.scrollParent = this.helper.scrollParent();
            this.offset = this.currentItem.offset();
            this.offset = {
                top: this.offset.top - this.margins.top,
                left: this.offset.left - this.margins.left
            };
            this.helper.css("position", "absolute");
            this.cssPosition = this.helper.css("position");
            a.extend(this.offset, {
                click: {
                    left: f.pageX - this.offset.left,
                    top: f.pageY - this.offset.top
                },
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            });
            this.originalPosition = this._generatePosition(f);
            this.originalPageX = f.pageX;
            this.originalPageY = f.pageY;
            (h.cursorAt && this._adjustOffsetFromHelper(h.cursorAt));
            this.domPosition = {
                prev: this.currentItem.prev()[0],
                parent: this.currentItem.parent()[0]
            };
            if (this.helper[0] != this.currentItem[0]) {
                this.currentItem.hide()
            }
            this._createPlaceholder();
            if (h.containment) {
                this._setContainment()
            }
            if (h.cursor) {
                if (a("body").css("cursor")) {
                    this._storedCursor = a("body").css("cursor")
                }
                a("body").css("cursor", h.cursor)
            }
            if (h.opacity) {
                if (this.helper.css("opacity")) {
                    this._storedOpacity = this.helper.css("opacity")
                }
                this.helper.css("opacity", h.opacity)
            }
            if (h.zIndex) {
                if (this.helper.css("zIndex")) {
                    this._storedZIndex = this.helper.css("zIndex")
                }
                this.helper.css("zIndex", h.zIndex)
            }
            if (this.scrollParent[0] != document && this.scrollParent[0].tagName != "HTML") {
                this.overflowOffset = this.scrollParent.offset()
            }
            this._trigger("start", f, this._uiHash());
            if (!this._preserveHelperProportions) {
                this._cacheHelperProportions()
            }
            if (!c) {
                for (var e = this.containers.length - 1; e >= 0; e--) {
                    this.containers[e]._trigger("activate", f, d._uiHash(this))
                }
            }
            if (a.ui.ddmanager) {
                a.ui.ddmanager.current = this
            }
            if (a.ui.ddmanager && !h.dropBehaviour) {
                a.ui.ddmanager.prepareOffsets(this, f)
            }
            this.dragging = true;
            this.helper.addClass("ui-sortable-helper");
            this._mouseDrag(f);
            return true
        },
        _mouseDrag: function (g) {
            this.position = this._generatePosition(g);
            this.positionAbs = this._convertPositionTo("absolute");
            if (!this.lastPositionAbs) {
                this.lastPositionAbs = this.positionAbs
            }
            if (this.options.scroll) {
                var h = this.options,
                    c = false;
                if (this.scrollParent[0] != document && this.scrollParent[0].tagName != "HTML") {
                    if ((this.overflowOffset.top + this.scrollParent[0].offsetHeight) - g.pageY < h.scrollSensitivity) {
                        this.scrollParent[0].scrollTop = c = this.scrollParent[0].scrollTop + h.scrollSpeed
                    } else {
                        if (g.pageY - this.overflowOffset.top < h.scrollSensitivity) {
                            this.scrollParent[0].scrollTop = c = this.scrollParent[0].scrollTop - h.scrollSpeed
                        }
                    } if ((this.overflowOffset.left + this.scrollParent[0].offsetWidth) - g.pageX < h.scrollSensitivity) {
                        this.scrollParent[0].scrollLeft = c = this.scrollParent[0].scrollLeft + h.scrollSpeed
                    } else {
                        if (g.pageX - this.overflowOffset.left < h.scrollSensitivity) {
                            this.scrollParent[0].scrollLeft = c = this.scrollParent[0].scrollLeft - h.scrollSpeed
                        }
                    }
                } else {
                    if (g.pageY - a(document).scrollTop() < h.scrollSensitivity) {
                        c = a(document).scrollTop(a(document).scrollTop() - h.scrollSpeed)
                    } else {
                        if (a(window).height() - (g.pageY - a(document).scrollTop()) < h.scrollSensitivity) {
                            c = a(document).scrollTop(a(document).scrollTop() + h.scrollSpeed)
                        }
                    } if (g.pageX - a(document).scrollLeft() < h.scrollSensitivity) {
                        c = a(document).scrollLeft(a(document).scrollLeft() - h.scrollSpeed)
                    } else {
                        if (a(window).width() - (g.pageX - a(document).scrollLeft()) < h.scrollSensitivity) {
                            c = a(document).scrollLeft(a(document).scrollLeft() + h.scrollSpeed)
                        }
                    }
                } if (c !== false && a.ui.ddmanager && !h.dropBehaviour) {
                    a.ui.ddmanager.prepareOffsets(this, g)
                }
            }
            this.positionAbs = this._convertPositionTo("absolute");
            if (!this.options.axis || this.options.axis != "y") {
                this.helper[0].style.left = this.position.left + "px"
            }
            if (!this.options.axis || this.options.axis != "x") {
                this.helper[0].style.top = this.position.top + "px"
            }
            for (var e = this.items.length - 1; e >= 0; e--) {
                var f = this.items[e],
                    d = f.item[0],
                    j = this._intersectsWithPointer(f);
                if (!j) {
                    continue
                }
                if (d != this.currentItem[0] && this.placeholder[j == 1 ? "next" : "prev"]()[0] != d && !a.ui.contains(this.placeholder[0], d) && (this.options.type == "semi-dynamic" ? !a.ui.contains(this.element[0], d) : true)) {
                    this.direction = j == 1 ? "down" : "up";
                    if (this.options.tolerance == "pointer" || this._intersectsWithSides(f)) {
                        this._rearrange(g, f)
                    } else {
                        break
                    }
                    this._trigger("change", g, this._uiHash());
                    break
                }
            }
            this._contactContainers(g);
            if (a.ui.ddmanager) {
                a.ui.ddmanager.drag(this, g)
            }
            this._trigger("sort", g, this._uiHash());
            this.lastPositionAbs = this.positionAbs;
            return false
        },
        _mouseStop: function (d, e) {
            if (!d) {
                return
            }
            if (a.ui.ddmanager && !this.options.dropBehaviour) {
                a.ui.ddmanager.drop(this, d)
            }
            if (this.options.revert) {
                var c = this;
                var f = c.placeholder.offset();
                c.reverting = true;
                a(this.helper).animate({
                    left: f.left - this.offset.parent.left - c.margins.left + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollLeft),
                    top: f.top - this.offset.parent.top - c.margins.top + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollTop)
                }, parseInt(this.options.revert, 10) || 500, function () {
                    c._clear(d)
                })
            } else {
                this._clear(d, e)
            }
            return false
        },
        cancel: function () {
            var c = this;
            if (this.dragging) {
                this._mouseUp({
                    target: null
                });
                if (this.options.helper == "original") {
                    this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")
                } else {
                    this.currentItem.show()
                }
                for (var d = this.containers.length - 1; d >= 0; d--) {
                    this.containers[d]._trigger("deactivate", null, c._uiHash(this));
                    if (this.containers[d].containerCache.over) {
                        this.containers[d]._trigger("out", null, c._uiHash(this));
                        this.containers[d].containerCache.over = 0
                    }
                }
            }
            if (this.placeholder) {
                if (this.placeholder[0].parentNode) {
                    this.placeholder[0].parentNode.removeChild(this.placeholder[0])
                }
                if (this.options.helper != "original" && this.helper && this.helper[0].parentNode) {
                    this.helper.remove()
                }
                a.extend(this, {
                    helper: null,
                    dragging: false,
                    reverting: false,
                    _noFinalSort: null
                });
                if (this.domPosition.prev) {
                    a(this.domPosition.prev).after(this.currentItem)
                } else {
                    a(this.domPosition.parent).prepend(this.currentItem)
                }
            }
            return this
        },
        serialize: function (e) {
            var c = this._getItemsAsjQuery(e && e.connected);
            var d = [];
            e = e || {};
            a(c).each(function () {
                var f = (a(e.item || this).attr(e.attribute || "id") || "").match(e.expression || (/(.+)[-=_](.+)/));
                if (f) {
                    d.push((e.key || f[1] + "[]") + "=" + (e.key && e.expression ? f[1] : f[2]))
                }
            });
            if (!d.length && e.key) {
                d.push(e.key + "=")
            }
            return d.join("&")
        },
        toArray: function (e) {
            var c = this._getItemsAsjQuery(e && e.connected);
            var d = [];
            e = e || {};
            c.each(function () {
                d.push(a(e.item || this).attr(e.attribute || "id") || "")
            });
            return d
        },
        _intersectsWith: function (n) {
            var e = this.positionAbs.left,
                d = e + this.helperProportions.width,
                m = this.positionAbs.top,
                k = m + this.helperProportions.height;
            var f = n.left,
                c = f + n.width,
                o = n.top,
                j = o + n.height;
            var p = this.offset.click.top,
                h = this.offset.click.left;
            var g = (m + p) > o && (m + p) < j && (e + h) > f && (e + h) < c;
            if (this.options.tolerance == "pointer" || this.options.forcePointerForContainers || (this.options.tolerance != "pointer" && this.helperProportions[this.floating ? "width" : "height"] > n[this.floating ? "width" : "height"])) {
                return g
            } else {
                return (f < e + (this.helperProportions.width / 2) && d - (this.helperProportions.width / 2) < c && o < m + (this.helperProportions.height / 2) && k - (this.helperProportions.height / 2) < j)
            }
        },
        _intersectsWithPointer: function (e) {
            var f = a.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, e.top, e.height),
                d = a.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, e.left, e.width),
                h = f && d,
                c = this._getDragVerticalDirection(),
                g = this._getDragHorizontalDirection();
            if (!h) {
                return false
            }
            return this.floating ? (((g && g == "right") || c == "down") ? 2 : 1) : (c && (c == "down" ? 2 : 1))
        },
        _intersectsWithSides: function (f) {
            var d = a.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, f.top + (f.height / 2), f.height),
                e = a.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, f.left + (f.width / 2), f.width),
                c = this._getDragVerticalDirection(),
                g = this._getDragHorizontalDirection();
            if (this.floating && g) {
                return ((g == "right" && e) || (g == "left" && !e))
            } else {
                return c && ((c == "down" && d) || (c == "up" && !d))
            }
        },
        _getDragVerticalDirection: function () {
            var c = this.positionAbs.top - this.lastPositionAbs.top;
            return c != 0 && (c > 0 ? "down" : "up")
        },
        _getDragHorizontalDirection: function () {
            var c = this.positionAbs.left - this.lastPositionAbs.left;
            return c != 0 && (c > 0 ? "right" : "left")
        },
        refresh: function (c) {
            this._refreshItems(c);
            this.refreshPositions();
            return this
        },
        _connectWith: function () {
            var c = this.options;
            return c.connectWith.constructor == String ? [c.connectWith] : c.connectWith
        },
        _getItemsAsjQuery: function (c) {
            var m = this;
            var h = [];
            var f = [];
            var k = this._connectWith();
            if (k && c) {
                for (var e = k.length - 1; e >= 0; e--) {
                    var l = a(k[e]);
                    for (var d = l.length - 1; d >= 0; d--) {
                        var g = a.data(l[d], "sortable");
                        if (g && g != this && !g.options.disabled) {
                            f.push([a.isFunction(g.options.items) ? g.options.items.call(g.element) : a(g.options.items, g.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), g])
                        }
                    }
                }
            }
            f.push([a.isFunction(this.options.items) ? this.options.items.call(this.element, null, {
                options: this.options,
                item: this.currentItem
            }) : a(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]);
            for (var e = f.length - 1; e >= 0; e--) {
                f[e][0].each(function () {
                    h.push(this)
                })
            }
            return a(h)
        },
        _removeCurrentsFromItems: function () {
            var e = this.currentItem.find(":data(sortable-item)");
            for (var d = 0; d < this.items.length; d++) {
                for (var c = 0; c < e.length; c++) {
                    if (e[c] == this.items[d].item[0]) {
                        this.items.splice(d, 1)
                    }
                }
            }
        },
        _refreshItems: function (c) {
            this.items = [];
            this.containers = [this];
            var k = this.items;
            var q = this;
            var g = [
                [a.isFunction(this.options.items) ? this.options.items.call(this.element[0], c, {
                    item: this.currentItem
                }) : a(this.options.items, this.element), this]
            ];
            var m = this._connectWith();
            if (m) {
                for (var f = m.length - 1; f >= 0; f--) {
                    var n = a(m[f]);
                    for (var e = n.length - 1; e >= 0; e--) {
                        var h = a.data(n[e], "sortable");
                        if (h && h != this && !h.options.disabled) {
                            g.push([a.isFunction(h.options.items) ? h.options.items.call(h.element[0], c, {
                                item: this.currentItem
                            }) : a(h.options.items, h.element), h]);
                            this.containers.push(h)
                        }
                    }
                }
            }
            for (var f = g.length - 1; f >= 0; f--) {
                var l = g[f][1];
                var d = g[f][0];
                for (var e = 0, o = d.length; e < o; e++) {
                    var p = a(d[e]);
                    p.data("sortable-item", l);
                    k.push({
                        item: p,
                        instance: l,
                        width: 0,
                        height: 0,
                        left: 0,
                        top: 0
                    })
                }
            }
        },
        refreshPositions: function (c) {
            if (this.offsetParent && this.helper) {
                this.offset.parent = this._getParentOffset()
            }
            for (var e = this.items.length - 1; e >= 0; e--) {
                var f = this.items[e];
                if (f.instance != this.currentContainer && this.currentContainer && f.item[0] != this.currentItem[0]) {
                    continue
                }
                var d = this.options.toleranceElement ? a(this.options.toleranceElement, f.item) : f.item;
                if (!c) {
                    f.width = d.outerWidth();
                    f.height = d.outerHeight()
                }
                var g = d.offset();
                f.left = g.left;
                f.top = g.top
            }
            if (this.options.custom && this.options.custom.refreshContainers) {
                this.options.custom.refreshContainers.call(this)
            } else {
                for (var e = this.containers.length - 1; e >= 0; e--) {
                    var g = this.containers[e].element.offset();
                    this.containers[e].containerCache.left = g.left;
                    this.containers[e].containerCache.top = g.top;
                    this.containers[e].containerCache.width = this.containers[e].element.outerWidth();
                    this.containers[e].containerCache.height = this.containers[e].element.outerHeight()
                }
            }
            return this
        },
        _createPlaceholder: function (e) {
            var c = e || this,
                f = c.options;
            if (!f.placeholder || f.placeholder.constructor == String) {
                var d = f.placeholder;
                f.placeholder = {
                    element: function () {
                        var g = a(document.createElement(c.currentItem[0].nodeName)).addClass(d || c.currentItem[0].className + " ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];
                        if (!d) {
                            g.style.visibility = "hidden"
                        }
                        return g
                    },
                    update: function (g, h) {
                        if (d && !f.forcePlaceholderSize) {
                            return
                        }
                        if (!h.height()) {
                            h.height(c.currentItem.innerHeight() - parseInt(c.currentItem.css("paddingTop") || 0, 10) - parseInt(c.currentItem.css("paddingBottom") || 0, 10))
                        }
                        if (!h.width()) {
                            h.width(c.currentItem.innerWidth() - parseInt(c.currentItem.css("paddingLeft") || 0, 10) - parseInt(c.currentItem.css("paddingRight") || 0, 10))
                        }
                    }
                }
            }
            c.placeholder = a(f.placeholder.element.call(c.element, c.currentItem));
            c.currentItem.after(c.placeholder);
            f.placeholder.update(c, c.placeholder)
        },
        _contactContainers: function (c) {
            var e = null,
                l = null;
            for (var g = this.containers.length - 1; g >= 0; g--) {
                if (a.ui.contains(this.currentItem[0], this.containers[g].element[0])) {
                    continue
                }
                if (this._intersectsWith(this.containers[g].containerCache)) {
                    if (e && a.ui.contains(this.containers[g].element[0], e.element[0])) {
                        continue
                    }
                    e = this.containers[g];
                    l = g
                } else {
                    if (this.containers[g].containerCache.over) {
                        this.containers[g]._trigger("out", c, this._uiHash(this));
                        this.containers[g].containerCache.over = 0
                    }
                }
            }
            if (!e) {
                return
            }
            if (this.containers.length === 1) {
                this.containers[l]._trigger("over", c, this._uiHash(this));
                this.containers[l].containerCache.over = 1
            } else {
                if (this.currentContainer != this.containers[l]) {
                    var k = 10000;
                    var h = null;
                    var d = this.positionAbs[this.containers[l].floating ? "left" : "top"];
                    for (var f = this.items.length - 1; f >= 0; f--) {
                        if (!a.ui.contains(this.containers[l].element[0], this.items[f].item[0])) {
                            continue
                        }
                        var m = this.items[f][this.containers[l].floating ? "left" : "top"];
                        if (Math.abs(m - d) < k) {
                            k = Math.abs(m - d);
                            h = this.items[f]
                        }
                    }
                    if (!h && !this.options.dropOnEmpty) {
                        return
                    }
                    this.currentContainer = this.containers[l];
                    h ? this._rearrange(c, h, null, true) : this._rearrange(c, null, this.containers[l].element, true);
                    this._trigger("change", c, this._uiHash());
                    this.containers[l]._trigger("change", c, this._uiHash(this));
                    this.options.placeholder.update(this.currentContainer, this.placeholder);
                    this.containers[l]._trigger("over", c, this._uiHash(this));
                    this.containers[l].containerCache.over = 1
                }
            }
        },
        _createHelper: function (d) {
            var e = this.options;
            var c = a.isFunction(e.helper) ? a(e.helper.apply(this.element[0], [d, this.currentItem])) : (e.helper == "clone" ? this.currentItem.clone() : this.currentItem);
            if (!c.parents("body").length) {
                a(e.appendTo != "parent" ? e.appendTo : this.currentItem[0].parentNode)[0].appendChild(c[0])
            }
            if (c[0] == this.currentItem[0]) {
                this._storedCSS = {
                    width: this.currentItem[0].style.width,
                    height: this.currentItem[0].style.height,
                    position: this.currentItem.css("position"),
                    top: this.currentItem.css("top"),
                    left: this.currentItem.css("left")
                }
            }
            if (c[0].style.width == "" || e.forceHelperSize) {
                c.width(this.currentItem.width())
            }
            if (c[0].style.height == "" || e.forceHelperSize) {
                c.height(this.currentItem.height())
            }
            return c
        },
        _adjustOffsetFromHelper: function (c) {
            if (typeof c == "string") {
                c = c.split(" ")
            }
            if (a.isArray(c)) {
                c = {
                    left: +c[0],
                    top: +c[1] || 0
                }
            }
            if ("left" in c) {
                this.offset.click.left = c.left + this.margins.left
            }
            if ("right" in c) {
                this.offset.click.left = this.helperProportions.width - c.right + this.margins.left
            }
            if ("top" in c) {
                this.offset.click.top = c.top + this.margins.top
            }
            if ("bottom" in c) {
                this.offset.click.top = this.helperProportions.height - c.bottom + this.margins.top
            }
        },
        _getParentOffset: function () {
            this.offsetParent = this.helper.offsetParent();
            var c = this.offsetParent.offset();
            if (this.cssPosition == "absolute" && this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
                c.left += this.scrollParent.scrollLeft();
                c.top += this.scrollParent.scrollTop()
            }
            if ((this.offsetParent[0] == document.body) || (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == "html" && a.browser.msie)) {
                c = {
                    top: 0,
                    left: 0
                }
            }
            return {
                top: c.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: c.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            }
        },
        _getRelativeOffset: function () {
            if (this.cssPosition == "relative") {
                var c = this.currentItem.position();
                return {
                    top: c.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
                    left: c.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
                }
            } else {
                return {
                    top: 0,
                    left: 0
                }
            }
        },
        _cacheMargins: function () {
            this.margins = {
                left: (parseInt(this.currentItem.css("marginLeft"), 10) || 0),
                top: (parseInt(this.currentItem.css("marginTop"), 10) || 0)
            }
        },
        _cacheHelperProportions: function () {
            this.helperProportions = {
                width: this.helper.outerWidth(),
                height: this.helper.outerHeight()
            }
        },
        _setContainment: function () {
            var f = this.options;
            if (f.containment == "parent") {
                f.containment = this.helper[0].parentNode
            }
            if (f.containment == "document" || f.containment == "window") {
                this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, a(f.containment == "document" ? document : window).width() - this.helperProportions.width - this.margins.left, (a(f.containment == "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]
            }
            if (!(/^(document|window|parent)$/).test(f.containment)) {
                var d = a(f.containment)[0];
                var e = a(f.containment).offset();
                var c = (a(d).css("overflow") != "hidden");
                this.containment = [e.left + (parseInt(a(d).css("borderLeftWidth"), 10) || 0) + (parseInt(a(d).css("paddingLeft"), 10) || 0) - this.margins.left, e.top + (parseInt(a(d).css("borderTopWidth"), 10) || 0) + (parseInt(a(d).css("paddingTop"), 10) || 0) - this.margins.top, e.left + (c ? Math.max(d.scrollWidth, d.offsetWidth) : d.offsetWidth) - (parseInt(a(d).css("borderLeftWidth"), 10) || 0) - (parseInt(a(d).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, e.top + (c ? Math.max(d.scrollHeight, d.offsetHeight) : d.offsetHeight) - (parseInt(a(d).css("borderTopWidth"), 10) || 0) - (parseInt(a(d).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top]
            }
        },
        _convertPositionTo: function (g, j) {
            if (!j) {
                j = this.position
            }
            var e = g == "absolute" ? 1 : -1;
            var f = this.options,
                c = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
                h = (/(html|body)/i).test(c[0].tagName);
            return {
                top: (j.top + this.offset.relative.top * e + this.offset.parent.top * e - (a.browser.safari && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : (h ? 0 : c.scrollTop())) * e)),
                left: (j.left + this.offset.relative.left * e + this.offset.parent.left * e - (a.browser.safari && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : h ? 0 : c.scrollLeft()) * e))
            }
        },
        _generatePosition: function (f) {
            var j = this.options,
                c = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
                k = (/(html|body)/i).test(c[0].tagName);
            if (this.cssPosition == "relative" && !(this.scrollParent[0] != document && this.scrollParent[0] != this.offsetParent[0])) {
                this.offset.relative = this._getRelativeOffset()
            }
            var e = f.pageX;
            var d = f.pageY;
            if (this.originalPosition) {
                if (this.containment) {
                    if (f.pageX - this.offset.click.left < this.containment[0]) {
                        e = this.containment[0] + this.offset.click.left
                    }
                    if (f.pageY - this.offset.click.top < this.containment[1]) {
                        d = this.containment[1] + this.offset.click.top
                    }
                    if (f.pageX - this.offset.click.left > this.containment[2]) {
                        e = this.containment[2] + this.offset.click.left
                    }
                    if (f.pageY - this.offset.click.top > this.containment[3]) {
                        d = this.containment[3] + this.offset.click.top
                    }
                }
                if (j.grid) {
                    var h = this.originalPageY + Math.round((d - this.originalPageY) / j.grid[1]) * j.grid[1];
                    d = this.containment ? (!(h - this.offset.click.top < this.containment[1] || h - this.offset.click.top > this.containment[3]) ? h : (!(h - this.offset.click.top < this.containment[1]) ? h - j.grid[1] : h + j.grid[1])) : h;
                    var g = this.originalPageX + Math.round((e - this.originalPageX) / j.grid[0]) * j.grid[0];
                    e = this.containment ? (!(g - this.offset.click.left < this.containment[0] || g - this.offset.click.left > this.containment[2]) ? g : (!(g - this.offset.click.left < this.containment[0]) ? g - j.grid[0] : g + j.grid[0])) : g
                }
            }
            return {
                top: (d - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (a.browser.safari && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : (k ? 0 : c.scrollTop())))),
                left: (e - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (a.browser.safari && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : k ? 0 : c.scrollLeft())))
            }
        },
        _rearrange: function (h, g, d, f) {
            d ? d[0].appendChild(this.placeholder[0]) : g.item[0].parentNode.insertBefore(this.placeholder[0], (this.direction == "down" ? g.item[0] : g.item[0].nextSibling));
            this.counter = this.counter ? ++this.counter : 1;
            var e = this,
                c = this.counter;
            window.setTimeout(function () {
                if (c == e.counter) {
                    e.refreshPositions(!f)
                }
            }, 0)
        },
        _clear: function (e, f) {
            this.reverting = false;
            var g = [],
                c = this;
            if (!this._noFinalSort && this.currentItem[0].parentNode) {
                this.placeholder.before(this.currentItem)
            }
            this._noFinalSort = null;
            if (this.helper[0] == this.currentItem[0]) {
                for (var d in this._storedCSS) {
                    if (this._storedCSS[d] == "auto" || this._storedCSS[d] == "static") {
                        this._storedCSS[d] = ""
                    }
                }
                this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")
            } else {
                this.currentItem.show()
            } if (this.fromOutside && !f) {
                g.push(function (h) {
                    this._trigger("receive", h, this._uiHash(this.fromOutside))
                })
            }
            if ((this.fromOutside || this.domPosition.prev != this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent != this.currentItem.parent()[0]) && !f) {
                g.push(function (h) {
                    this._trigger("update", h, this._uiHash())
                })
            }
            if (!a.ui.contains(this.element[0], this.currentItem[0])) {
                if (!f) {
                    g.push(function (h) {
                        this._trigger("remove", h, this._uiHash())
                    })
                }
                for (var d = this.containers.length - 1; d >= 0; d--) {
                    if (a.ui.contains(this.containers[d].element[0], this.currentItem[0]) && !f) {
                        g.push((function (h) {
                            return function (j) {
                                h._trigger("receive", j, this._uiHash(this))
                            }
                        }).call(this, this.containers[d]));
                        g.push((function (h) {
                            return function (j) {
                                h._trigger("update", j, this._uiHash(this))
                            }
                        }).call(this, this.containers[d]))
                    }
                }
            }
            for (var d = this.containers.length - 1; d >= 0; d--) {
                if (!f) {
                    g.push((function (h) {
                        return function (j) {
                            h._trigger("deactivate", j, this._uiHash(this))
                        }
                    }).call(this, this.containers[d]))
                }
                if (this.containers[d].containerCache.over) {
                    g.push((function (h) {
                        return function (j) {
                            h._trigger("out", j, this._uiHash(this))
                        }
                    }).call(this, this.containers[d]));
                    this.containers[d].containerCache.over = 0
                }
            }
            if (this._storedCursor) {
                a("body").css("cursor", this._storedCursor)
            }
            if (this._storedOpacity) {
                this.helper.css("opacity", this._storedOpacity)
            }
            if (this._storedZIndex) {
                this.helper.css("zIndex", this._storedZIndex == "auto" ? "" : this._storedZIndex)
            }
            this.dragging = false;
            if (this.cancelHelperRemoval) {
                if (!f) {
                    this._trigger("beforeStop", e, this._uiHash());
                    for (var d = 0; d < g.length; d++) {
                        g[d].call(this, e)
                    }
                    this._trigger("stop", e, this._uiHash())
                }
                return false
            }
            if (!f) {
                this._trigger("beforeStop", e, this._uiHash())
            }
            this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
            if (this.helper[0] != this.currentItem[0]) {
                this.helper.remove()
            }
            this.helper = null;
            if (!f) {
                for (var d = 0; d < g.length; d++) {
                    g[d].call(this, e)
                }
                this._trigger("stop", e, this._uiHash())
            }
            this.fromOutside = false;
            return true
        },
        _trigger: function () {
            if (a.Widget.prototype._trigger.apply(this, arguments) === false) {
                this.cancel()
            }
        },
        _uiHash: function (d) {
            var c = d || this;
            return {
                helper: c.helper,
                placeholder: c.placeholder || a([]),
                position: c.position,
                originalPosition: c.originalPosition,
                offset: c.positionAbs,
                item: c.currentItem,
                sender: d ? d.element : null
            }
        }
    });
    a.extend(a.ui.sortable, {
        version: "1.8.13"
    })
})(jQuery);
(function (a, b) {
    var c = 0;
    a.widget("ui.autocomplete", {
        options: {
            appendTo: "body",
            autoFocus: false,
            delay: 300,
            minLength: 1,
            position: {
                my: "left top",
                at: "left bottom",
                collision: "none"
            },
            source: null
        },
        pending: 0,
        _create: function () {
            var d = this,
                f = this.element[0].ownerDocument,
                e;
            this.element.addClass("ui-autocomplete-input").attr("autocomplete", "off").attr({
                role: "textbox",
                "aria-autocomplete": "list",
                "aria-haspopup": "true"
            }).bind("keydown.autocomplete", function (g) {
                    if (d.options.disabled || d.element.attr("readonly")) {
                        return
                    }
                    e = false;
                    var h = a.ui.keyCode;
                    switch (g.keyCode) {
                        case h.PAGE_UP:
                            d._move("previousPage", g);
                            break;
                        case h.PAGE_DOWN:
                            d._move("nextPage", g);
                            break;
                        case h.UP:
                            d._move("previous", g);
                            g.preventDefault();
                            break;
                        case h.DOWN:
                            d._move("next", g);
                            g.preventDefault();
                            break;
                        case h.ENTER:
                        case h.NUMPAD_ENTER:
                            if (d.menu.active) {
                                e = true;
                                g.preventDefault()
                            }
                        case h.TAB:
                            if (!d.menu.active) {
                                return
                            }
                            d.menu.select(g);
                            break;
                        case h.ESCAPE:
                            d.element.val(d.term);
                            d.close(g);
                            break;
                        default:
                            clearTimeout(d.searching);
                            d.searching = setTimeout(function () {
                                if (d.term != d.element.val()) {
                                    d.selectedItem = null;
                                    d.search(null, g)
                                }
                            }, d.options.delay);
                            break
                    }
                }).bind("keypress.autocomplete", function (g) {
                    if (e) {
                        e = false;
                        g.preventDefault()
                    }
                }).bind("focus.autocomplete", function () {
                    if (d.options.disabled) {
                        return
                    }
                    d.selectedItem = null;
                    d.previous = d.element.val()
                }).bind("blur.autocomplete", function (g) {
                    if (d.options.disabled) {
                        return
                    }
                    clearTimeout(d.searching);
                    d.closing = setTimeout(function () {
                        d.close(g);
                        d._change(g)
                    }, 150)
                });
            this._initSource();
            this.response = function () {
                return d._response.apply(d, arguments)
            };
            this.menu = a("<ul></ul>").addClass("ui-autocomplete").appendTo(a(this.options.appendTo || "body", f)[0]).mousedown(function (g) {
                var h = d.menu.element[0];
                if (!a(g.target).closest(".ui-menu-item").length) {
                    setTimeout(function () {
                        a(document).one("mousedown", function (j) {
                            if (j.target !== d.element[0] && j.target !== h && !a.ui.contains(h, j.target)) {
                                d.close()
                            }
                        })
                    }, 1)
                }
                setTimeout(function () {
                    clearTimeout(d.closing)
                }, 13)
            }).menu({
                    focus: function (h, j) {
                        var g = j.item.data("item.autocomplete");
                        if (false !== d._trigger("focus", h, {
                            item: g
                        })) {
                            if (/^key/.test(h.originalEvent.type)) {
                                d.element.val(g.value)
                            }
                        }
                    },
                    selected: function (j, k) {
                        var h = k.item.data("item.autocomplete"),
                            g = d.previous;
                        if (d.element[0] !== f.activeElement) {
                            d.element.focus();
                            d.previous = g;
                            setTimeout(function () {
                                d.previous = g;
                                d.selectedItem = h
                            }, 1)
                        }
                        if (false !== d._trigger("select", j, {
                            item: h
                        })) {
                            d.element.val(h.value)
                        }
                        d.term = d.element.val();
                        d.close(j);
                        d.selectedItem = h
                    },
                    blur: function (g, h) {
                        if (d.menu.element.is(":visible") && (d.element.val() !== d.term)) {
                            d.element.val(d.term)
                        }
                    }
                }).zIndex(this.element.zIndex() + 1).css({
                    top: 0,
                    left: 0
                }).hide().data("menu");
            if (a.fn.bgiframe) {
                this.menu.element.bgiframe()
            }
        },
        destroy: function () {
            this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete").removeAttr("role").removeAttr("aria-autocomplete").removeAttr("aria-haspopup");
            this.menu.element.remove();
            a.Widget.prototype.destroy.call(this)
        },
        _setOption: function (d, e) {
            a.Widget.prototype._setOption.apply(this, arguments);
            if (d === "source") {
                this._initSource()
            }
            if (d === "appendTo") {
                this.menu.element.appendTo(a(e || "body", this.element[0].ownerDocument)[0])
            }
            if (d === "disabled" && e && this.xhr) {
                this.xhr.abort()
            }
        },
        _initSource: function () {
            var d = this,
                f, e;
            if (a.isArray(this.options.source)) {
                f = this.options.source;
                this.source = function (h, g) {
                    g(a.ui.autocomplete.filter(f, h.term))
                }
            } else {
                if (typeof this.options.source === "string") {
                    e = this.options.source;
                    this.source = function (h, g) {
                        if (d.xhr) {
                            d.xhr.abort()
                        }
                        d.xhr = a.ajax({
                            url: e,
                            data: h,
                            dataType: "json",
                            autocompleteRequest: ++c,
                            success: function (k, j) {
                                if (this.autocompleteRequest === c) {
                                    g(k)
                                }
                            },
                            error: function () {
                                if (this.autocompleteRequest === c) {
                                    g([])
                                }
                            }
                        })
                    }
                } else {
                    this.source = this.options.source
                }
            }
        },
        search: function (e, d) {
            e = e != null ? e : this.element.val();
            this.term = this.element.val();
            if (e.length < this.options.minLength) {
                return this.close(d)
            }
            clearTimeout(this.closing);
            if (this._trigger("search", d) === false) {
                return
            }
            return this._search(e)
        },
        _search: function (d) {
            this.pending++;
            this.element.addClass("ui-autocomplete-loading");
            this.source({
                term: d
            }, this.response)
        },
        _response: function (d) {
            if (!this.options.disabled && d && d.length) {
                d = this._normalize(d);
                this._suggest(d);
                this._trigger("open")
            } else {
                this.close()
            }
            this.pending--;
            if (!this.pending) {
                this.element.removeClass("ui-autocomplete-loading")
            }
        },
        close: function (d) {
            clearTimeout(this.closing);
            if (this.menu.element.is(":visible")) {
                this.menu.element.hide();
                this.menu.deactivate();
                this._trigger("close", d)
            }
        },
        _change: function (d) {
            if (this.previous !== this.element.val()) {
                this._trigger("change", d, {
                    item: this.selectedItem
                })
            }
        },
        _normalize: function (d) {
            if (d.length && d[0].label && d[0].value) {
                return d
            }
            return a.map(d, function (e) {
                if (typeof e === "string") {
                    return {
                        label: e,
                        value: e
                    }
                }
                return a.extend({
                    label: e.label || e.value,
                    value: e.value || e.label
                }, e)
            })
        },
        _suggest: function (d) {
            var e = this.menu.element.empty().zIndex(this.element.zIndex() + 1);
            this._renderMenu(e, d);
            this.menu.deactivate();
            this.menu.refresh();
            e.show();
            this._resizeMenu();
            e.position(a.extend({
                of: this.element
            }, this.options.position));
            if (this.options.autoFocus) {
                this.menu.next(new a.Event("mouseover"))
            }
        },
        _resizeMenu: function () {
            var d = this.menu.element;
            d.outerWidth(Math.max(d.width("").outerWidth(), this.element.outerWidth()))
        },
        _renderMenu: function (f, e) {
            var d = this;
            a.each(e, function (g, h) {
                d._renderItem(f, h)
            })
        },
        _renderItem: function (d, e) {
            return a("<li></li>").data("item.autocomplete", e).append(a("<a></a>").text(e.label)).appendTo(d)
        },
        _move: function (e, d) {
            if (!this.menu.element.is(":visible")) {
                this.search(null, d);
                return
            }
            if (this.menu.first() && /^previous/.test(e) || this.menu.last() && /^next/.test(e)) {
                this.element.val(this.term);
                this.menu.deactivate();
                return
            }
            this.menu[e](d)
        },
        widget: function () {
            return this.menu.element
        }
    });
    a.extend(a.ui.autocomplete, {
        escapeRegex: function (d) {
            return d.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
        },
        filter: function (f, d) {
            var e = new RegExp(a.ui.autocomplete.escapeRegex(d), "i");
            return a.grep(f, function (g) {
                return e.test(g.label || g.value || g)
            })
        }
    })
}(jQuery));
(function (a) {
    a.widget("ui.menu", {
        _create: function () {
            var b = this;
            this.element.addClass("ui-menu ui-widget ui-widget-content ui-corner-all").attr({
                role: "listbox",
                "aria-activedescendant": "ui-active-menuitem"
            }).click(function (c) {
                    if (!a(c.target).closest(".ui-menu-item a").length) {
                        return
                    }
                    c.preventDefault();
                    b.select(c)
                });
            this.refresh()
        },
        refresh: function () {
            var c = this;
            var b = this.element.children("li:not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role", "menuitem");
            b.children("a").addClass("ui-corner-all").attr("tabindex", -1).mouseenter(function (d) {
                c.activate(d, a(this).parent())
            }).mouseleave(function () {
                    c.deactivate()
                })
        },
        activate: function (e, d) {
            this.deactivate();
            if (this.hasScroll()) {
                var f = d.offset().top - this.element.offset().top,
                    b = this.element.scrollTop(),
                    c = this.element.height();
                if (f < 0) {
                    this.element.scrollTop(b + f)
                } else {
                    if (f >= c) {
                        this.element.scrollTop(b + f - c + d.height())
                    }
                }
            }
            this.active = d.eq(0).children("a").addClass("ui-state-hover").attr("id", "ui-active-menuitem").end();
            this._trigger("focus", e, {
                item: d
            })
        },
        deactivate: function () {
            if (!this.active) {
                return
            }
            this.active.children("a").removeClass("ui-state-hover").removeAttr("id");
            this._trigger("blur");
            this.active = null
        },
        next: function (b) {
            this.move("next", ".ui-menu-item:first", b)
        },
        previous: function (b) {
            this.move("prev", ".ui-menu-item:last", b)
        },
        first: function () {
            return this.active && !this.active.prevAll(".ui-menu-item").length
        },
        last: function () {
            return this.active && !this.active.nextAll(".ui-menu-item").length
        },
        move: function (e, d, c) {
            if (!this.active) {
                this.activate(c, this.element.children(d));
                return
            }
            var b = this.active[e + "All"](".ui-menu-item").eq(0);
            if (b.length) {
                this.activate(c, b)
            } else {
                this.activate(c, this.element.children(d))
            }
        },
        nextPage: function (d) {
            if (this.hasScroll()) {
                if (!this.active || this.last()) {
                    this.activate(d, this.element.children(".ui-menu-item:first"));
                    return
                }
                var e = this.active.offset().top,
                    c = this.element.height(),
                    b = this.element.children(".ui-menu-item").filter(function () {
                        var f = a(this).offset().top - e - c + a(this).height();
                        return f < 10 && f > -10
                    });
                if (!b.length) {
                    b = this.element.children(".ui-menu-item:last")
                }
                this.activate(d, b)
            } else {
                this.activate(d, this.element.children(".ui-menu-item").filter(!this.active || this.last() ? ":first" : ":last"))
            }
        },
        previousPage: function (c) {
            if (this.hasScroll()) {
                if (!this.active || this.first()) {
                    this.activate(c, this.element.children(".ui-menu-item:last"));
                    return
                }
                var d = this.active.offset().top,
                    b = this.element.height();
                result = this.element.children(".ui-menu-item").filter(function () {
                    var e = a(this).offset().top - d + b - a(this).height();
                    return e < 10 && e > -10
                });
                if (!result.length) {
                    result = this.element.children(".ui-menu-item:first")
                }
                this.activate(c, result)
            } else {
                this.activate(c, this.element.children(".ui-menu-item").filter(!this.active || this.first() ? ":last" : ":first"))
            }
        },
        hasScroll: function () {
            return this.element.height() < this.element[a.fn.prop ? "prop" : "attr"]("scrollHeight")
        },
        select: function (b) {
            this._trigger("selected", b, {
                item: this.active
            })
        }
    })
}(jQuery));
(function () {
    var q = this;
    var p = q.Backbone;
    var y = Array.prototype.splice;
    var d;
    if (typeof exports !== "undefined") {
        d = exports
    } else {
        d = q.Backbone = {}
    }
    d.VERSION = "0.9.2";
    var A = q._;
    if (!A && (typeof require !== "undefined")) {
        A = require("underscore")
    }
    d.$ = q.jQuery || q.Zepto || q.ender;
    d.noConflict = function () {
        q.Backbone = p;
        return this
    };
    d.emulateHTTP = false;
    d.emulateJSON = false;
    var a = /\s+/;
    var o = d.Events = {
        on: function (E, H, D) {
            var C, F, G;
            if (!H) {
                return this
            }
            E = E.split(a);
            C = this._callbacks || (this._callbacks = {});
            while (F = E.shift()) {
                G = C[F] || (C[F] = []);
                G.push(H, D)
            }
            return this
        },
        off: function (F, I, E) {
            var G, D, H, C;
            if (!(D = this._callbacks)) {
                return this
            }
            if (!(F || I || E)) {
                delete this._callbacks;
                return this
            }
            F = F ? F.split(a) : A.keys(D);
            while (G = F.shift()) {
                if (!(H = D[G]) || !(I || E)) {
                    delete D[G];
                    continue
                }
                for (C = H.length - 2; C >= 0; C -= 2) {
                    if (!(I && H[C] !== I || E && H[C + 1] !== E)) {
                        H.splice(C, 2)
                    }
                }
            }
            return this
        },
        trigger: function (J) {
            var C, K, G, F, E, H, I, D;
            if (!(K = this._callbacks)) {
                return this
            }
            D = [];
            J = J.split(a);
            for (F = 1, E = arguments.length; F < E; F++) {
                D[F - 1] = arguments[F]
            }
            while (C = J.shift()) {
                if (I = K.all) {
                    I = I.slice()
                }
                if (G = K[C]) {
                    G = G.slice()
                }
                if (G) {
                    for (F = 0, E = G.length; F < E; F += 2) {
                        G[F].apply(G[F + 1] || this, D)
                    }
                }
                if (I) {
                    H = [C].concat(D);
                    for (F = 0, E = I.length; F < E; F += 2) {
                        I[F].apply(I[F + 1] || this, H)
                    }
                }
            }
            return this
        }
    };
    o.bind = o.on;
    o.unbind = o.off;
    var l = d.Model = function (C, D) {
        var E;
        C || (C = {});
        if (D && D.collection) {
            this.collection = D.collection
        }
        if (D && D.parse) {
            C = this.parse(C)
        }
        if (E = e(this, "defaults")) {
            C = A.extend({}, E, C)
        }
        this.attributes = {};
        this._escapedAttributes = {};
        this.cid = A.uniqueId("c");
        this.changed = {};
        this._silent = {};
        this._pending = {};
        this.set(C, {
            silent: true
        });
        this.changed = {};
        this._silent = {};
        this._pending = {};
        this._previousAttributes = A.clone(this.attributes);
        this.initialize.apply(this, arguments)
    };
    A.extend(l.prototype, o, {
        changed: null,
        _silent: null,
        _pending: null,
        idAttribute: "id",
        initialize: function () {},
        toJSON: function (C) {
            return A.clone(this.attributes)
        },
        sync: function () {
            return d.sync.apply(this, arguments)
        },
        get: function (C) {
            return this.attributes[C]
        },
        escape: function (C) {
            var D;
            if (D = this._escapedAttributes[C]) {
                return D
            }
            var E = this.get(C);
            return this._escapedAttributes[C] = A.escape(E == null ? "" : "" + E)
        },
        has: function (C) {
            return this.get(C) != null
        },
        set: function (J, I, L) {
            var K, G, E;
            if (A.isObject(J) || J == null) {
                K = J;
                L = I
            } else {
                K = {};
                K[J] = I
            }
            L || (L = {});
            if (!K) {
                return this
            }
            if (K instanceof l) {
                K = K.attributes
            }
            if (L.unset) {
                for (G in K) {
                    K[G] = void 0
                }
            }
            if (!this._validate(K, L)) {
                return false
            }
            if (this.idAttribute in K) {
                this.id = K[this.idAttribute]
            }
            var H = L.changes = {};
            var D = this.attributes;
            var C = this._escapedAttributes;
            var F = this._previousAttributes || {};
            for (G in K) {
                E = K[G];
                if (!A.isEqual(D[G], E) || (L.unset && A.has(D, G))) {
                    delete C[G];
                    (L.silent ? this._silent : H)[G] = true
                }
                L.unset ? delete D[G] : D[G] = E;
                if (!A.isEqual(F[G], E) || (A.has(D, G) !== A.has(F, G))) {
                    this.changed[G] = E;
                    if (!L.silent) {
                        this._pending[G] = true
                    }
                } else {
                    delete this.changed[G];
                    delete this._pending[G]
                }
            }
            if (!L.silent) {
                this.change(L)
            }
            return this
        },
        unset: function (C, D) {
            D = A.extend({}, D, {
                unset: true
            });
            return this.set(C, null, D)
        },
        clear: function (C) {
            C = A.extend({}, C, {
                unset: true
            });
            return this.set(A.clone(this.attributes), C)
        },
        fetch: function (D) {
            D = D ? A.clone(D) : {};
            var C = this;
            var E = D.success;
            D.success = function (H, F, G) {
                if (!C.set(C.parse(H, G), D)) {
                    return false
                }
                if (E) {
                    E(C, H, D)
                }
                C.trigger("sync", C, H, D)
            };
            D.error = d.wrapError(D.error, C, D);
            return this.sync("read", this, D)
        },
        save: function (H, G, L) {
            var I, F, C;
            if (A.isObject(H) || H == null) {
                I = H;
                L = G
            } else {
                I = {};
                I[H] = G
            }
            L = L ? A.clone(L) : {};
            if (L.wait) {
                if (!this._validate(I, L)) {
                    return false
                }
                F = A.clone(this.attributes)
            }
            var D = A.extend({}, L, {
                silent: true
            });
            if (I && !this.set(I, L.wait ? D : L)) {
                return false
            }
            if (!I && !this.isValid()) {
                return false
            }
            var E = this;
            var J = L.success;
            L.success = function (P, M, O) {
                C = true;
                var N = E.parse(P, O);
                if (L.wait) {
                    N = A.extend(I || {}, N)
                }
                if (!E.set(N, L)) {
                    return false
                }
                if (J) {
                    J(E, P, L)
                }
                E.trigger("sync", E, P, L)
            };
            L.error = d.wrapError(L.error, E, L);
            var K = this.sync(this.isNew() ? "create" : "update", this, L);
            if (!C && L.wait) {
                this.clear(D);
                this.set(F, D)
            }
            return K
        },
        destroy: function (D) {
            D = D ? A.clone(D) : {};
            var C = this;
            var G = D.success;
            var E = function () {
                C.trigger("destroy", C, C.collection, D)
            };
            D.success = function (H) {
                if (D.wait || C.isNew()) {
                    E()
                }
                if (G) {
                    G(C, H, D)
                }
                if (!C.isNew()) {
                    C.trigger("sync", C, H, D)
                }
            };
            if (this.isNew()) {
                D.success();
                return false
            }
            D.error = d.wrapError(D.error, C, D);
            var F = this.sync("delete", this, D);
            if (!D.wait) {
                E()
            }
            return F
        },
        url: function () {
            var C = e(this, "urlRoot") || e(this.collection, "url") || t();
            if (this.isNew()) {
                return C
            }
            return C + (C.charAt(C.length - 1) === "/" ? "" : "/") + encodeURIComponent(this.id)
        },
        parse: function (D, C) {
            return D
        },
        clone: function () {
            return new this.constructor(this.attributes)
        },
        isNew: function () {
            return this.id == null
        },
        change: function (D) {
            D || (D = {});
            var F = this._changing;
            this._changing = true;
            for (var C in this._silent) {
                this._pending[C] = true
            }
            var E = A.extend({}, D.changes, this._silent);
            this._silent = {};
            for (var C in E) {
                this.trigger("change:" + C, this, this.get(C), D)
            }
            if (F) {
                return this
            }
            while (!A.isEmpty(this._pending)) {
                this._pending = {};
                this.trigger("change", this, D);
                for (var C in this.changed) {
                    if (this._pending[C] || this._silent[C]) {
                        continue
                    }
                    delete this.changed[C]
                }
                this._previousAttributes = A.clone(this.attributes)
            }
            this._changing = false;
            return this
        },
        hasChanged: function (C) {
            if (C == null) {
                return !A.isEmpty(this.changed)
            }
            return A.has(this.changed, C)
        },
        changedAttributes: function (E) {
            if (!E) {
                return this.hasChanged() ? A.clone(this.changed) : false
            }
            var G, F = false,
                D = this._previousAttributes;
            for (var C in E) {
                if (A.isEqual(D[C], (G = E[C]))) {
                    continue
                }(F || (F = {}))[C] = G
            }
            return F
        },
        previous: function (C) {
            if (C == null || !this._previousAttributes) {
                return null
            }
            return this._previousAttributes[C]
        },
        previousAttributes: function () {
            return A.clone(this._previousAttributes)
        },
        isValid: function () {
            return !this.validate || !this.validate(this.attributes)
        },
        _validate: function (E, D) {
            if (D.silent || !this.validate) {
                return true
            }
            E = A.extend({}, this.attributes, E);
            var C = this.validate(E, D);
            if (!C) {
                return true
            }
            if (D && D.error) {
                D.error(this, C, D)
            } else {
                this.trigger("error", this, C, D)
            }
            return false
        }
    });
    var B = d.Collection = function (D, C) {
        C || (C = {});
        if (C.model) {
            this.model = C.model
        }
        if (C.comparator !== void 0) {
            this.comparator = C.comparator
        }
        this._reset();
        this.initialize.apply(this, arguments);
        if (D) {
            this.reset(D, {
                silent: true,
                parse: C.parse
            })
        }
    };
    A.extend(B.prototype, o, {
        model: l,
        initialize: function () {},
        toJSON: function (C) {
            return this.map(function (D) {
                return D.toJSON(C)
            })
        },
        sync: function () {
            return d.sync.apply(this, arguments)
        },
        add: function (D, M) {
            var I, K, F, J, L, E, G = {}, C = {}, H = [];
            M || (M = {});
            D = A.isArray(D) ? D.slice() : [D];
            for (I = 0, F = D.length; I < F; I++) {
                if (!(J = D[I] = this._prepareModel(D[I], M))) {
                    throw new Error("Can't add an invalid model to a collection")
                }
                L = J.cid;
                E = J.id;
                if (G[L] || this._byCid[L] || ((E != null) && (C[E] || this._byId[E]))) {
                    H.push(I);
                    continue
                }
                G[L] = C[E] = J
            }
            I = H.length;
            while (I--) {
                H[I] = D.splice(H[I], 1)[0]
            }
            for (I = 0, F = D.length; I < F; I++) {
                (J = D[I]).on("all", this._onModelEvent, this);
                this._byCid[J.cid] = J;
                if (J.id != null) {
                    this._byId[J.id] = J
                }
            }
            this.length += F;
            K = M.at != null ? M.at : this.models.length;
            y.apply(this.models, [K, 0].concat(D));
            if (M.merge) {
                for (I = 0, F = H.length; I < F; I++) {
                    if (J = this._byId[H[I].id]) {
                        J.set(H[I], M)
                    }
                }
            }
            if (this.comparator && M.at == null) {
                this.sort({
                    silent: true
                })
            }
            if (M.silent) {
                return this
            }
            for (I = 0, F = this.models.length; I < F; I++) {
                if (!G[(J = this.models[I]).cid]) {
                    continue
                }
                M.index = I;
                J.trigger("add", J, this, M)
            }
            return this
        },
        remove: function (H, F) {
            var G, C, E, D;
            F || (F = {});
            H = A.isArray(H) ? H.slice() : [H];
            for (G = 0, C = H.length; G < C; G++) {
                D = this.getByCid(H[G]) || this.get(H[G]);
                if (!D) {
                    continue
                }
                delete this._byId[D.id];
                delete this._byCid[D.cid];
                E = this.indexOf(D);
                this.models.splice(E, 1);
                this.length--;
                if (!F.silent) {
                    F.index = E;
                    D.trigger("remove", D, this, F)
                }
                this._removeReference(D)
            }
            return this
        },
        push: function (D, C) {
            D = this._prepareModel(D, C);
            this.add(D, C);
            return D
        },
        pop: function (D) {
            var C = this.at(this.length - 1);
            this.remove(C, D);
            return C
        },
        unshift: function (D, C) {
            D = this._prepareModel(D, C);
            this.add(D, A.extend({
                at: 0
            }, C));
            return D
        },
        shift: function (D) {
            var C = this.at(0);
            this.remove(C, D);
            return C
        },
        slice: function (D, C) {
            return this.models.slice(D, C)
        },
        get: function (C) {
            if (C == null) {
                return void 0
            }
            return this._byId[C.id != null ? C.id : C]
        },
        getByCid: function (C) {
            return C && this._byCid[C.cid || C]
        },
        at: function (C) {
            return this.models[C]
        },
        where: function (C) {
            if (A.isEmpty(C)) {
                return []
            }
            return this.filter(function (D) {
                for (var E in C) {
                    if (C[E] !== D.get(E)) {
                        return false
                    }
                }
                return true
            })
        },
        sort: function (D) {
            D || (D = {});
            if (!this.comparator) {
                throw new Error("Cannot sort a set without a comparator")
            }
            var C = A.bind(this.comparator, this);
            if (this.comparator.length === 1) {
                this.models = this.sortBy(C)
            } else {
                this.models.sort(C)
            } if (!D.silent) {
                this.trigger("reset", this, D)
            }
            return this
        },
        pluck: function (C) {
            return A.map(this.models, function (D) {
                return D.get(C)
            })
        },
        reset: function (F, D) {
            F || (F = []);
            D || (D = {});
            for (var E = 0, C = this.models.length; E < C; E++) {
                this._removeReference(this.models[E])
            }
            this._reset();
            this.add(F, A.extend({
                silent: true
            }, D));
            if (!D.silent) {
                this.trigger("reset", this, D)
            }
            return this
        },
        fetch: function (C) {
            C = C ? A.clone(C) : {};
            if (C.parse === void 0) {
                C.parse = true
            }
            var E = this;
            var D = C.success;
            C.success = function (H, F, G) {
                E[C.add ? "add" : "reset"](E.parse(H, G), C);
                if (D) {
                    D(E, H, C)
                }
                E.trigger("sync", E, H, C)
            };
            C.error = d.wrapError(C.error, E, C);
            return this.sync("read", this, C)
        },
        create: function (D, C) {
            var E = this;
            C = C ? A.clone(C) : {};
            D = this._prepareModel(D, C);
            if (!D) {
                return false
            }
            if (!C.wait) {
                E.add(D, C)
            }
            var F = C.success;
            C.success = function (H, I, G) {
                if (G.wait) {
                    E.add(H, G)
                }
                if (F) {
                    F(H, I, G)
                }
            };
            D.save(null, C);
            return D
        },
        parse: function (D, C) {
            return D
        },
        clone: function () {
            return new this.constructor(this.models)
        },
        chain: function () {
            return A(this.models).chain()
        },
        _reset: function (C) {
            this.length = 0;
            this.models = [];
            this._byId = {};
            this._byCid = {}
        },
        _prepareModel: function (E, D) {
            if (E instanceof l) {
                if (!E.collection) {
                    E.collection = this
                }
                return E
            }
            D || (D = {});
            D.collection = this;
            var C = new this.model(E, D);
            if (!C._validate(C.attributes, D)) {
                return false
            }
            return C
        },
        _removeReference: function (C) {
            if (this === C.collection) {
                delete C.collection
            }
            C.off("all", this._onModelEvent, this)
        },
        _onModelEvent: function (E, D, F, C) {
            if ((E === "add" || E === "remove") && F !== this) {
                return
            }
            if (E === "destroy") {
                this.remove(D, C)
            }
            if (D && E === "change:" + D.idAttribute) {
                delete this._byId[D.previous(D.idAttribute)];
                if (D.id != null) {
                    this._byId[D.id] = D
                }
            }
            this.trigger.apply(this, arguments)
        }
    });
    var w = ["forEach", "each", "map", "reduce", "reduceRight", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "max", "min", "sortBy", "sortedIndex", "toArray", "size", "first", "initial", "rest", "last", "without", "indexOf", "shuffle", "lastIndexOf", "isEmpty", "groupBy"];
    A.each(w, function (C) {
        B.prototype[C] = function () {
            return A[C].apply(A, [this.models].concat(A.toArray(arguments)))
        }
    });
    var z = d.Router = function (C) {
        C || (C = {});
        if (C.routes) {
            this.routes = C.routes
        }
        this._bindRoutes();
        this.initialize.apply(this, arguments)
    };
    var j = /:\w+/g;
    var x = /\*\w+/g;
    var f = /[-[\]{}()+?.,\\^$|#\s]/g;
    A.extend(z.prototype, o, {
        initialize: function () {},
        route: function (C, D, E) {
            d.history || (d.history = new b);
            if (!A.isRegExp(C)) {
                C = this._routeToRegExp(C)
            }
            if (!E) {
                E = this[D]
            }
            d.history.route(C, A.bind(function (G) {
                var F = this._extractParameters(C, G);
                E && E.apply(this, F);
                this.trigger.apply(this, ["route:" + D].concat(F));
                d.history.trigger("route", this, D, F)
            }, this));
            return this
        },
        navigate: function (D, C) {
            d.history.navigate(D, C)
        },
        _bindRoutes: function () {
            if (!this.routes) {
                return
            }
            var D = [];
            for (var E in this.routes) {
                D.unshift([E, this.routes[E]])
            }
            for (var F = 0, C = D.length; F < C; F++) {
                this.route(D[F][0], D[F][1], this[D[F][1]])
            }
        },
        _routeToRegExp: function (C) {
            C = C.replace(f, "\\$&").replace(j, "([^/]+)").replace(x, "(.*?)");
            return new RegExp("^" + C + "$")
        },
        _extractParameters: function (C, D) {
            return C.exec(D).slice(1)
        }
    });
    var b = d.History = function (C) {
        this.handlers = [];
        A.bindAll(this, "checkUrl");
        this.location = C && C.location || q.location;
        this.history = C && C.history || q.history
    };
    var n = /^[#\/]/;
    var k = /msie [\w.]+/;
    var c = /\/$/;
    b.started = false;
    A.extend(b.prototype, o, {
        interval: 50,
        getHash: function (D) {
            var C = (D || this).location.href.match(/#(.*)$/);
            return C ? C[1] : ""
        },
        getFragment: function (E, D) {
            if (E == null) {
                if (this._hasPushState || !this._wantsHashChange || D) {
                    E = this.location.pathname;
                    var C = this.options.root.replace(c, "");
                    if (!E.indexOf(C)) {
                        E = E.substr(C.length)
                    }
                } else {
                    E = this.getHash()
                }
            }
            return decodeURIComponent(E.replace(n, ""))
        },
        start: function (E) {
            if (b.started) {
                throw new Error("Backbone.history has already been started")
            }
            b.started = true;
            this.options = A.extend({}, {
                root: "/"
            }, this.options, E);
            this._wantsHashChange = this.options.hashChange !== false;
            this._wantsPushState = !! this.options.pushState;
            this._hasPushState = !! (this.options.pushState && this.history && this.history.pushState);
            var D = this.getFragment();
            var C = document.documentMode;
            var G = (k.exec(navigator.userAgent.toLowerCase()) && (!C || C <= 7));
            if (G && this._wantsHashChange) {
                this.iframe = d.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow;
                this.navigate(D)
            }
            if (this._hasPushState) {
                d.$(window).bind("popstate", this.checkUrl)
            } else {
                if (this._wantsHashChange && ("onhashchange" in window) && !G) {
                    d.$(window).bind("hashchange", this.checkUrl)
                } else {
                    if (this._wantsHashChange) {
                        this._checkUrlInterval = setInterval(this.checkUrl, this.interval)
                    }
                }
            }
            this.fragment = D;
            var H = this.location;
            var F = (H.pathname === this.options.root) && !H.search;
            if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !F) {
                this.fragment = this.getFragment(null, true);
                this.location.replace(this.options.root + this.location.search + "#" + this.fragment);
                return true
            } else {
                if (this._wantsPushState && this._hasPushState && F && H.hash) {
                    this.fragment = this.getHash().replace(n, "");
                    this.history.replaceState({}, document.title, H.protocol + "//" + H.host + this.options.root + this.fragment)
                }
            } if (!this.options.silent) {
                return this.loadUrl()
            }
        },
        stop: function () {
            d.$(window).unbind("popstate", this.checkUrl).unbind("hashchange", this.checkUrl);
            clearInterval(this._checkUrlInterval);
            b.started = false
        },
        route: function (C, D) {
            this.handlers.unshift({
                route: C,
                callback: D
            })
        },
        checkUrl: function (D) {
            var C = this.getFragment();
            if (C === this.fragment && this.iframe) {
                C = this.getFragment(this.getHash(this.iframe))
            }
            if (C === this.fragment) {
                return false
            }
            if (this.iframe) {
                this.navigate(C)
            }
            this.loadUrl() || this.loadUrl(this.getHash())
        },
        loadUrl: function (E) {
            var D = this.fragment = this.getFragment(E);
            var C = A.any(this.handlers, function (F) {
                if (F.route.test(D)) {
                    F.callback(D);
                    return true
                }
            });
            return C
        },
        navigate: function (E, D) {
            if (!b.started) {
                return false
            }
            if (!D || D === true) {
                D = {
                    trigger: D
                }
            }
            var F = (E || "").replace(n, "");
            if (this.fragment === F) {
                return
            }
            this.fragment = F;
            var C = (F.indexOf(this.options.root) !== 0 ? this.options.root : "") + F;
            if (this._hasPushState) {
                this.history[D.replace ? "replaceState" : "pushState"]({}, document.title, C)
            } else {
                if (this._wantsHashChange) {
                    this._updateHash(this.location, F, D.replace);
                    if (this.iframe && (F !== this.getFragment(this.getHash(this.iframe)))) {
                        if (!D.replace) {
                            this.iframe.document.open().close()
                        }
                        this._updateHash(this.iframe.location, F, D.replace)
                    }
                } else {
                    return this.location.assign(C)
                }
            } if (D.trigger) {
                this.loadUrl(E)
            }
        },
        _updateHash: function (C, D, E) {
            if (E) {
                C.replace(C.href.replace(/(javascript:|#).*$/, "") + "#" + D)
            } else {
                C.hash = D
            }
        }
    });
    var s = d.View = function (C) {
        this.cid = A.uniqueId("view");
        this._configure(C || {});
        this._ensureElement();
        this.initialize.apply(this, arguments);
        this.delegateEvents()
    };
    var g = /^(\S+)\s*(.*)$/;
    var u = ["model", "collection", "el", "id", "attributes", "className", "tagName"];
    A.extend(s.prototype, o, {
        tagName: "div",
        $: function (C) {
            return this.$el.find(C)
        },
        initialize: function () {},
        render: function () {
            return this
        },
        remove: function () {
            this.$el.remove();
            return this
        },
        make: function (D, C, F) {
            var E = document.createElement(D);
            if (C) {
                d.$(E).attr(C)
            }
            if (F != null) {
                d.$(E).html(F)
            }
            return E
        },
        setElement: function (C, D) {
            if (this.$el) {
                this.undelegateEvents()
            }
            this.$el = C instanceof d.$ ? C : d.$(C);
            this.el = this.$el[0];
            if (D !== false) {
                this.delegateEvents()
            }
            return this
        },
        delegateEvents: function (G) {
            if (!(G || (G = e(this, "events")))) {
                return
            }
            this.undelegateEvents();
            for (var F in G) {
                var H = G[F];
                if (!A.isFunction(H)) {
                    H = this[G[F]]
                }
                if (!H) {
                    throw new Error('Method "' + G[F] + '" does not exist')
                }
                var E = F.match(g);
                var D = E[1],
                    C = E[2];
                H = A.bind(H, this);
                D += ".delegateEvents" + this.cid;
                if (C === "") {
                    this.$el.bind(D, H)
                } else {
                    this.$el.delegate(C, D, H)
                }
            }
        },
        undelegateEvents: function () {
            this.$el.unbind(".delegateEvents" + this.cid)
        },
        _configure: function (E) {
            if (this.options) {
                E = A.extend({}, this.options, E)
            }
            for (var F = 0, D = u.length; F < D; F++) {
                var C = u[F];
                if (E[C]) {
                    this[C] = E[C]
                }
            }
            this.options = E
        },
        _ensureElement: function () {
            if (!this.el) {
                var C = A.extend({}, e(this, "attributes"));
                if (this.id) {
                    C.id = this.id
                }
                if (this.className) {
                    C["class"] = this.className
                }
                this.setElement(this.make(e(this, "tagName"), C), false)
            } else {
                this.setElement(this.el, false)
            }
        }
    });
    var v = function (C, D) {
        return m(this, C, D)
    };
    l.extend = B.extend = z.extend = s.extend = v;
    var r = {
        create: "POST",
        update: "PUT",
        "delete": "DELETE",
        read: "GET"
    };
    d.sync = function (G, D, C) {
        var E = r[G];
        C || (C = {});
        var F = {
            type: E,
            dataType: "json"
        };
        if (!C.url) {
            F.url = e(D, "url") || t()
        }
        if (!C.data && D && (G === "create" || G === "update")) {
            F.contentType = "application/json";
            F.data = JSON.stringify(D)
        }
        if (d.emulateJSON) {
            F.contentType = "application/x-www-form-urlencoded";
            F.data = F.data ? {
                model: F.data
            } : {}
        }
        if (d.emulateHTTP) {
            if (E === "PUT" || E === "DELETE") {
                if (d.emulateJSON) {
                    F.data._method = E
                }
                F.type = "POST";
                F.beforeSend = function (H) {
                    H.setRequestHeader("X-HTTP-Method-Override", E)
                }
            }
        }
        if (F.type !== "GET" && !d.emulateJSON) {
            F.processData = false
        }
        return d.ajax(A.extend(F, C))
    };
    d.ajax = function () {
        return d.$.ajax.apply(d.$, arguments)
    };
    d.wrapError = function (D, E, C) {
        return function (F, G) {
            G = F === E ? G : F;
            if (D) {
                D(E, G, C)
            } else {
                E.trigger("error", E, G, C)
            }
        }
    };
    var h = function () {};
    var m = function (D, C, E) {
        var F;
        if (C && C.hasOwnProperty("constructor")) {
            F = C.constructor
        } else {
            F = function () {
                D.apply(this, arguments)
            }
        }
        A.extend(F, D);
        h.prototype = D.prototype;
        F.prototype = new h();
        if (C) {
            A.extend(F.prototype, C)
        }
        if (E) {
            A.extend(F, E)
        }
        F.prototype.constructor = F;
        F.__super__ = D.prototype;
        return F
    };
    var e = function (C, D) {
        if (!(C && C[D])) {
            return null
        }
        return A.isFunction(C[D]) ? C[D]() : C[D]
    };
    var t = function () {
        throw new Error('A "url" property or function must be specified')
    }
}).call(this);
(function () {
    jQuery.color = {};
    jQuery.color.make = function (c, d, f, e) {
        var b = {};
        b.r = c || 0;
        b.g = d || 0;
        b.b = f || 0;
        b.a = e != null ? e : 1;
        b.add = function (g, h) {
            for (var j = 0; j < g.length; ++j) {
                b[g.charAt(j)] += h
            }
            return b.normalize()
        };
        b.scale = function (g, h) {
            for (var j = 0; j < g.length; ++j) {
                b[g.charAt(j)] *= h
            }
            return b.normalize()
        };
        b.toString = function () {
            if (b.a >= 1) {
                return "rgb(" + [b.r, b.g, b.b].join(",") + ")"
            } else {
                return "rgba(" + [b.r, b.g, b.b, b.a].join(",") + ")"
            }
        };
        b.normalize = function () {
            function g(j, h, k) {
                return h < j ? j : (h > k ? k : h)
            }
            b.r = g(0, parseInt(b.r), 255);
            b.g = g(0, parseInt(b.g), 255);
            b.b = g(0, parseInt(b.b), 255);
            b.a = g(0, b.a, 1);
            return b
        };
        b.clone = function () {
            return jQuery.color.make(b.r, b.b, b.g, b.a)
        };
        return b.normalize()
    };
    jQuery.color.extract = function (c, d) {
        var b;
        do {
            b = c.css(d).toLowerCase();
            if (b != "" && b != "transparent") {
                break
            }
            c = c.parent()
        } while (!jQuery.nodeName(c.get(0), "body"));
        if (b == "rgba(0, 0, 0, 0)") {
            b = "transparent"
        }
        return jQuery.color.parse(b)
    };
    jQuery.color.parse = function (b) {
        var c, e = jQuery.color.make;
        if (c = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(b)) {
            return e(parseInt(c[1], 10), parseInt(c[2], 10), parseInt(c[3], 10))
        }
        if (c = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(b)) {
            return e(parseInt(c[1], 10), parseInt(c[2], 10), parseInt(c[3], 10), parseFloat(c[4]))
        }
        if (c = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(b)) {
            return e(parseFloat(c[1]) * 2.55, parseFloat(c[2]) * 2.55, parseFloat(c[3]) * 2.55)
        }
        if (c = /rgba\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(b)) {
            return e(parseFloat(c[1]) * 2.55, parseFloat(c[2]) * 2.55, parseFloat(c[3]) * 2.55, parseFloat(c[4]))
        }
        if (c = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(b)) {
            return e(parseInt(c[1], 16), parseInt(c[2], 16), parseInt(c[3], 16))
        }
        if (c = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(b)) {
            return e(parseInt(c[1] + c[1], 16), parseInt(c[2] + c[2], 16), parseInt(c[3] + c[3], 16))
        }
        var d = jQuery.trim(b).toLowerCase();
        if (d == "transparent") {
            return e(255, 255, 255, 0)
        } else {
            c = a[d];
            return e(c[0], c[1], c[2])
        }
    };
    var a = {
        aqua: [0, 255, 255],
        azure: [240, 255, 255],
        beige: [245, 245, 220],
        black: [0, 0, 0],
        blue: [0, 0, 255],
        brown: [165, 42, 42],
        cyan: [0, 255, 255],
        darkblue: [0, 0, 139],
        darkcyan: [0, 139, 139],
        darkgrey: [169, 169, 169],
        darkgreen: [0, 100, 0],
        darkkhaki: [189, 183, 107],
        darkmagenta: [139, 0, 139],
        darkolivegreen: [85, 107, 47],
        darkorange: [255, 140, 0],
        darkorchid: [153, 50, 204],
        darkred: [139, 0, 0],
        darksalmon: [233, 150, 122],
        darkviolet: [148, 0, 211],
        fuchsia: [255, 0, 255],
        gold: [255, 215, 0],
        green: [0, 128, 0],
        indigo: [75, 0, 130],
        khaki: [240, 230, 140],
        lightblue: [173, 216, 230],
        lightcyan: [224, 255, 255],
        lightgreen: [144, 238, 144],
        lightgrey: [211, 211, 211],
        lightpink: [255, 182, 193],
        lightyellow: [255, 255, 224],
        lime: [0, 255, 0],
        magenta: [255, 0, 255],
        maroon: [128, 0, 0],
        navy: [0, 0, 128],
        olive: [128, 128, 0],
        orange: [255, 165, 0],
        pink: [255, 192, 203],
        purple: [128, 0, 128],
        violet: [128, 0, 128],
        red: [255, 0, 0],
        silver: [192, 192, 192],
        white: [255, 255, 255],
        yellow: [255, 255, 0]
    }
})();
(function (c) {
    function b(L, x, y, e) {
        var p = [],
            H = {
                colors: ["#edc240", "#afd8f8", "#cb4b4b", "#4da74d", "#9440ed"],
                legend: {
                    show: true,
                    noColumns: 1,
                    labelFormatter: null,
                    labelBoxBorderColor: "#ccc",
                    container: null,
                    position: "ne",
                    margin: 5,
                    backgroundColor: null,
                    backgroundOpacity: 0.85
                },
                xaxis: {
                    mode: null,
                    transform: null,
                    inverseTransform: null,
                    min: null,
                    max: null,
                    autoscaleMargin: null,
                    ticks: null,
                    tickFormatter: null,
                    labelWidth: null,
                    labelHeight: null,
                    tickDecimals: null,
                    tickSize: null,
                    minTickSize: null,
                    monthNames: null,
                    timeformat: null,
                    twelveHourClock: false
                },
                yaxis: {
                    autoscaleMargin: 0.02
                },
                x2axis: {
                    autoscaleMargin: null
                },
                y2axis: {
                    autoscaleMargin: 0.02
                },
                series: {
                    points: {
                        show: false,
                        radius: 3,
                        lineWidth: 2,
                        fill: true,
                        fillColor: "#ffffff"
                    },
                    lines: {
                        lineWidth: 2,
                        fill: false,
                        fillColor: null,
                        steps: false
                    },
                    bars: {
                        show: false,
                        lineWidth: 2,
                        barWidth: 1,
                        fill: true,
                        fillColor: null,
                        align: "left",
                        horizontal: false
                    },
                    shadowSize: 3
                },
                grid: {
                    show: true,
                    aboveData: false,
                    color: "#545454",
                    backgroundColor: null,
                    tickColor: "rgba(0,0,0,0.15)",
                    labelMargin: 5,
                    borderWidth: 2,
                    borderColor: null,
                    markings: null,
                    markingsColor: "#f4f4f4",
                    markingsLineWidth: 2,
                    clickable: false,
                    hoverable: false,
                    autoHighlight: true,
                    mouseActiveRadius: 10
                },
                hooks: {}
            }, q = null,
            ac = null,
            ad = null,
            z = null,
            aj = null,
            S = {
                xaxis: {},
                yaxis: {},
                x2axis: {},
                y2axis: {}
            }, F = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, Y = 0,
            r = 0,
            j = 0,
            T = 0,
            m = {
                processOptions: [],
                processRawData: [],
                processDatapoints: [],
                draw: [],
                bindEvents: [],
                drawOverlay: []
            }, g = this;
        g.setData = G;
        g.setupGrid = K;
        g.draw = ah;
        g.getPlaceholder = function () {
            return L
        };
        g.getCanvas = function () {
            return q
        };
        g.getPlotOffset = function () {
            return F
        };
        g.width = function () {
            return j
        };
        g.height = function () {
            return T
        };
        g.offset = function () {
            var ak = ad.offset();
            ak.left += F.left;
            ak.top += F.top;
            return ak
        };
        g.getData = function () {
            return p
        };
        g.getAxes = function () {
            return S
        };
        g.getOptions = function () {
            return H
        };
        g.highlight = ae;
        g.unhighlight = X;
        g.triggerRedrawOverlay = Q;
        g.pointOffset = function (ak) {
            return {
                left: parseInt(u(ak, "xaxis").p2c(+ak.x) + F.left),
                top: parseInt(u(ak, "yaxis").p2c(+ak.y) + F.top)
            }
        };
        g.hooks = m;
        C(g);
        R(y);
        D();
        G(x);
        K();
        ah();
        ag();

        function A(am, ak) {
            ak = [g].concat(ak);
            for (var al = 0; al < am.length; ++al) {
                am[al].apply(this, ak)
            }
        }

        function C() {
            for (var ak = 0; ak < e.length; ++ak) {
                var al = e[ak];
                al.init(g);
                if (al.options) {
                    c.extend(true, H, al.options)
                }
            }
        }

        function R(ak) {
            c.extend(true, H, ak);
            if (H.grid.borderColor == null) {
                H.grid.borderColor = H.grid.color
            }
            if (H.xaxis.noTicks && H.xaxis.ticks == null) {
                H.xaxis.ticks = H.xaxis.noTicks
            }
            if (H.yaxis.noTicks && H.yaxis.ticks == null) {
                H.yaxis.ticks = H.yaxis.noTicks
            }
            if (H.grid.coloredAreas) {
                H.grid.markings = H.grid.coloredAreas
            }
            if (H.grid.coloredAreasColor) {
                H.grid.markingsColor = H.grid.coloredAreasColor
            }
            if (H.lines) {
                c.extend(true, H.series.lines, H.lines)
            }
            if (H.points) {
                c.extend(true, H.series.points, H.points)
            }
            if (H.bars) {
                c.extend(true, H.series.bars, H.bars)
            }
            if (H.shadowSize) {
                H.series.shadowSize = H.shadowSize
            }
            for (var al in m) {
                if (H.hooks[al] && H.hooks[al].length) {
                    m[al] = m[al].concat(H.hooks[al])
                }
            }
            A(m.processOptions, [H])
        }

        function G(ak) {
            p = n(ak);
            v();
            M()
        }

        function n(an) {
            var al = [];
            for (var ak = 0; ak < an.length; ++ak) {
                var am = c.extend(true, {}, H.series);
                if (an[ak].data) {
                    am.data = an[ak].data;
                    delete an[ak].data;
                    c.extend(true, am, an[ak]);
                    an[ak].data = am.data
                } else {
                    am.data = an[ak]
                }
                al.push(am)
            }
            return al
        }

        function u(am, ak) {
            var al = am[ak];
            if (!al || al == 1) {
                return S[ak]
            }
            if (typeof al == "number") {
                return S[ak.charAt(0) + al + ak.slice(1)]
            }
            return al
        }

        function v() {
            var ap;
            var aw = p.length,
                ak = [],
                an = [];
            for (ap = 0; ap < p.length; ++ap) {
                var at = p[ap].color;
                if (at != null) {
                    --aw;
                    if (typeof at == "number") {
                        an.push(at)
                    } else {
                        ak.push(c.color.parse(p[ap].color))
                    }
                }
            }
            for (ap = 0; ap < an.length; ++ap) {
                aw = Math.max(aw, an[ap] + 1)
            }
            var al = [],
                ao = 0;
            ap = 0;
            while (al.length < aw) {
                var ar;
                if (H.colors.length == ap) {
                    ar = c.color.make(100, 100, 100)
                } else {
                    ar = c.color.parse(H.colors[ap])
                }
                var am = ao % 2 == 1 ? -1 : 1;
                ar.scale("rgb", 1 + am * Math.ceil(ao / 2) * 0.2);
                al.push(ar);
                ++ap;
                if (ap >= H.colors.length) {
                    ap = 0;
                    ++ao
                }
            }
            var aq = 0,
                ax;
            for (ap = 0; ap < p.length; ++ap) {
                ax = p[ap];
                if (ax.color == null) {
                    ax.color = al[aq].toString();
                    ++aq
                } else {
                    if (typeof ax.color == "number") {
                        ax.color = al[ax.color].toString()
                    }
                } if (ax.lines.show == null) {
                    var av, au = true;
                    for (av in ax) {
                        if (ax[av].show) {
                            au = false;
                            break
                        }
                    }
                    if (au) {
                        ax.lines.show = true
                    }
                }
                ax.xaxis = u(ax, "xaxis");
                ax.yaxis = u(ax, "yaxis")
            }
        }

        function M() {
            var ax = Number.POSITIVE_INFINITY,
                aq = Number.NEGATIVE_INFINITY,
                aD, aB, aA, aw, al, ar, aC, ay, ap, ao, ak, aJ, aG, au;
            for (ak in S) {
                S[ak].datamin = ax;
                S[ak].datamax = aq;
                S[ak].used = false
            }

            function an(aM, aL, aK) {
                if (aL < aM.datamin) {
                    aM.datamin = aL
                }
                if (aK > aM.datamax) {
                    aM.datamax = aK
                }
            }
            for (aD = 0; aD < p.length; ++aD) {
                ar = p[aD];
                ar.datapoints = {
                    points: []
                };
                A(m.processRawData, [ar, ar.data, ar.datapoints])
            }
            for (aD = 0; aD < p.length; ++aD) {
                ar = p[aD];
                var aI = ar.data,
                    aF = ar.datapoints.format;
                if (!aF) {
                    aF = [];
                    aF.push({
                        x: true,
                        number: true,
                        required: true
                    });
                    aF.push({
                        y: true,
                        number: true,
                        required: true
                    });
                    if (ar.bars.show) {
                        aF.push({
                            y: true,
                            number: true,
                            required: false,
                            defaultValue: 0
                        })
                    }
                    ar.datapoints.format = aF
                }
                if (ar.datapoints.pointsize != null) {
                    continue
                }
                if (ar.datapoints.pointsize == null) {
                    ar.datapoints.pointsize = aF.length
                }
                ay = ar.datapoints.pointsize;
                aC = ar.datapoints.points;
                insertSteps = ar.lines.show && ar.lines.steps;
                ar.xaxis.used = ar.yaxis.used = true;
                for (aB = aA = 0; aB < aI.length; ++aB, aA += ay) {
                    au = aI[aB];
                    var am = au == null;
                    if (!am) {
                        for (aw = 0; aw < ay; ++aw) {
                            aJ = au[aw];
                            aG = aF[aw];
                            if (aG) {
                                if (aG.number && aJ != null) {
                                    aJ = +aJ;
                                    if (isNaN(aJ)) {
                                        aJ = null
                                    }
                                }
                                if (aJ == null) {
                                    if (aG.required) {
                                        am = true
                                    }
                                    if (aG.defaultValue != null) {
                                        aJ = aG.defaultValue
                                    }
                                }
                            }
                            aC[aA + aw] = aJ
                        }
                    }
                    if (am) {
                        for (aw = 0; aw < ay; ++aw) {
                            aJ = aC[aA + aw];
                            if (aJ != null) {
                                aG = aF[aw];
                                if (aG.x) {
                                    an(ar.xaxis, aJ, aJ)
                                }
                                if (aG.y) {
                                    an(ar.yaxis, aJ, aJ)
                                }
                            }
                            aC[aA + aw] = null
                        }
                    } else {
                        if (insertSteps && aA > 0 && aC[aA - ay] != null && aC[aA - ay] != aC[aA] && aC[aA - ay + 1] != aC[aA + 1]) {
                            for (aw = 0; aw < ay; ++aw) {
                                aC[aA + ay + aw] = aC[aA + aw]
                            }
                            aC[aA + 1] = aC[aA - ay + 1];
                            aA += ay
                        }
                    }
                }
            }
            for (aD = 0; aD < p.length; ++aD) {
                ar = p[aD];
                A(m.processDatapoints, [ar, ar.datapoints])
            }
            for (aD = 0; aD < p.length; ++aD) {
                ar = p[aD];
                aC = ar.datapoints.points, ay = ar.datapoints.pointsize;
                var at = ax,
                    az = ax,
                    av = aq,
                    aE = aq;
                for (aB = 0; aB < aC.length; aB += ay) {
                    if (aC[aB] == null) {
                        continue
                    }
                    for (aw = 0; aw < ay; ++aw) {
                        aJ = aC[aB + aw];
                        aG = aF[aw];
                        if (!aG) {
                            continue
                        }
                        if (aG.x) {
                            if (aJ < at) {
                                at = aJ
                            }
                            if (aJ > av) {
                                av = aJ
                            }
                        }
                        if (aG.y) {
                            if (aJ < az) {
                                az = aJ
                            }
                            if (aJ > aE) {
                                aE = aJ
                            }
                        }
                    }
                }
                if (ar.bars.show) {
                    var aH = ar.bars.align == "left" ? 0 : -ar.bars.barWidth / 2;
                    if (ar.bars.horizontal) {
                        az += aH;
                        aE += aH + ar.bars.barWidth
                    } else {
                        at += aH;
                        av += aH + ar.bars.barWidth
                    }
                }
                an(ar.xaxis, at, av);
                an(ar.yaxis, az, aE)
            }
            for (ak in S) {
                if (S[ak].datamin == ax) {
                    S[ak].datamin = null
                }
                if (S[ak].datamax == aq) {
                    S[ak].datamax = null
                }
            }
        }

        function D() {
            function ak(am, al) {
                var an = document.createElement("canvas");
                an.width = am;
                an.height = al;
                if (c.browser.msie) {
                    an = window.G_vmlCanvasManager.initElement(an)
                }
                return an
            }
            Y = L.width();
            r = L.height();
            L.html("");
            if (L.css("position") == "static") {
                L.css("position", "relative")
            }
            if (Y <= 0 || r <= 0) {
                throw "Invalid dimensions for plot, width = " + Y + ", height = " + r
            }
            if (c.browser.msie) {
                window.G_vmlCanvasManager.init_(document)
            }
            q = c(ak(Y, r)).appendTo(L).get(0);
            z = q.getContext("2d");
            ac = c(ak(Y, r)).css({
                position: "absolute",
                left: 0,
                top: 0
            }).appendTo(L).get(0);
            aj = ac.getContext("2d");
            aj.stroke()
        }

        function ag() {
            ad = c([ac, q]);
            if (H.grid.hoverable) {
                ad.mousemove(d)
            }
            if (H.grid.clickable) {
                ad.click(E)
            }
            A(m.bindEvents, [ad])
        }

        function K() {
            function al(au, av) {
                function ap(aw) {
                    return aw
                }
                var at, ao, aq = av.transform || ap,
                    ar = av.inverseTransform;
                if (au == S.xaxis || au == S.x2axis) {
                    at = au.scale = j / (aq(au.max) - aq(au.min));
                    ao = aq(au.min);
                    if (aq == ap) {
                        au.p2c = function (aw) {
                            return (aw - ao) * at
                        }
                    } else {
                        au.p2c = function (aw) {
                            return (aq(aw) - ao) * at
                        }
                    } if (!ar) {
                        au.c2p = function (aw) {
                            return ao + aw / at
                        }
                    } else {
                        au.c2p = function (aw) {
                            return ar(ao + aw / at)
                        }
                    }
                } else {
                    at = au.scale = T / (aq(au.max) - aq(au.min));
                    ao = aq(au.max);
                    if (aq == ap) {
                        au.p2c = function (aw) {
                            return (ao - aw) * at
                        }
                    } else {
                        au.p2c = function (aw) {
                            return (ao - aq(aw)) * at
                        }
                    } if (!ar) {
                        au.c2p = function (aw) {
                            return ao - aw / at
                        }
                    } else {
                        au.c2p = function (aw) {
                            return ar(ao - aw / at)
                        }
                    }
                }
            }

            function an(ar, au) {
                var aq, at = [],
                    ap;
                ar.labelWidth = au.labelWidth;
                ar.labelHeight = au.labelHeight;
                if (ar == S.xaxis || ar == S.x2axis) {
                    if (ar.labelWidth == null) {
                        ar.labelWidth = Y / (ar.ticks.length > 0 ? ar.ticks.length : 1)
                    }
                    if (ar.labelHeight == null) {
                        at = [];
                        for (aq = 0; aq < ar.ticks.length; ++aq) {
                            ap = ar.ticks[aq].label;
                            if (ap) {
                                at.push('<div class="tickLabel" style="float:left;width:' + ar.labelWidth + 'px">' + ap + "</div>")
                            }
                        }
                        if (at.length > 0) {
                            var ao = c('<div style="position:absolute;top:-10000px;width:10000px;font-size:smaller">' + at.join("") + '<div style="clear:left"></div></div>').appendTo(L);
                            ar.labelHeight = ao.height();
                            ao.remove()
                        }
                    }
                } else {
                    if (ar.labelWidth == null || ar.labelHeight == null) {
                        for (aq = 0; aq < ar.ticks.length; ++aq) {
                            ap = ar.ticks[aq].label;
                            if (ap) {
                                at.push('<div class="tickLabel">' + ap + "</div>")
                            }
                        }
                        if (at.length > 0) {
                            var ao = c('<div style="position:absolute;top:-10000px;font-size:smaller">' + at.join("") + "</div>").appendTo(L);
                            if (ar.labelWidth == null) {
                                ar.labelWidth = ao.width()
                            }
                            if (ar.labelHeight == null) {
                                ar.labelHeight = ao.find("div").height()
                            }
                            ao.remove()
                        }
                    }
                } if (ar.labelWidth == null) {
                    ar.labelWidth = 0
                }
                if (ar.labelHeight == null) {
                    ar.labelHeight = 0
                }
            }

            function am() {
                var ap = H.grid.borderWidth;
                for (i = 0; i < p.length; ++i) {
                    ap = Math.max(ap, 2 * (p[i].points.radius + p[i].points.lineWidth / 2))
                }
                F.left = F.right = F.top = F.bottom = ap;
                var ao = H.grid.labelMargin + H.grid.borderWidth;
                if (S.xaxis.labelHeight > 0) {
                    F.bottom = Math.max(ap, S.xaxis.labelHeight + ao)
                }
                if (S.yaxis.labelWidth > 0) {
                    F.left = Math.max(ap, S.yaxis.labelWidth + ao)
                }
                if (S.x2axis.labelHeight > 0) {
                    F.top = Math.max(ap, S.x2axis.labelHeight + ao)
                }
                if (S.y2axis.labelWidth > 0) {
                    F.right = Math.max(ap, S.y2axis.labelWidth + ao)
                }
                j = Y - F.left - F.right;
                T = r - F.bottom - F.top
            }
            var ak;
            for (ak in S) {
                l(S[ak], H[ak])
            }
            if (H.grid.show) {
                for (ak in S) {
                    f(S[ak], H[ak]);
                    P(S[ak], H[ak]);
                    an(S[ak], H[ak])
                }
                am()
            } else {
                F.left = F.right = F.top = F.bottom = 0;
                j = Y;
                T = r
            }
            for (ak in S) {
                al(S[ak], H[ak])
            }
            if (H.grid.show) {
                I()
            }
            ai()
        }

        function l(an, aq) {
            var am = +(aq.min != null ? aq.min : an.datamin),
                ak = +(aq.max != null ? aq.max : an.datamax),
                ap = ak - am;
            if (ap == 0) {
                var al = ak == 0 ? 1 : 0.01;
                if (aq.min == null) {
                    am -= al
                }
                if (aq.max == null || aq.min != null) {
                    ak += al
                }
            } else {
                var ao = aq.autoscaleMargin;
                if (ao != null) {
                    if (aq.min == null) {
                        am -= ap * ao;
                        if (am < 0 && an.datamin != null && an.datamin >= 0) {
                            am = 0
                        }
                    }
                    if (aq.max == null) {
                        ak += ap * ao;
                        if (ak > 0 && an.datamax != null && an.datamax <= 0) {
                            ak = 0
                        }
                    }
                }
            }
            an.min = am;
            an.max = ak
        }

        function f(ap, at) {
            var ao;
            if (typeof at.ticks == "number" && at.ticks > 0) {
                ao = at.ticks
            } else {
                if (ap == S.xaxis || ap == S.x2axis) {
                    ao = 0.3 * Math.sqrt(Y)
                } else {
                    ao = 0.3 * Math.sqrt(r)
                }
            }
            var ay = (ap.max - ap.min) / ao,
                aA, au, aw, ax, ar, am, al;
            if (at.mode == "time") {
                var av = {
                    second: 1000,
                    minute: 60 * 1000,
                    hour: 60 * 60 * 1000,
                    day: 24 * 60 * 60 * 1000,
                    month: 30 * 24 * 60 * 60 * 1000,
                    year: 365.2425 * 24 * 60 * 60 * 1000
                };
                var az = [
                    [1, "second"],
                    [2, "second"],
                    [5, "second"],
                    [10, "second"],
                    [30, "second"],
                    [1, "minute"],
                    [2, "minute"],
                    [5, "minute"],
                    [10, "minute"],
                    [30, "minute"],
                    [1, "hour"],
                    [2, "hour"],
                    [4, "hour"],
                    [8, "hour"],
                    [12, "hour"],
                    [1, "day"],
                    [2, "day"],
                    [3, "day"],
                    [0.25, "month"],
                    [0.5, "month"],
                    [1, "month"],
                    [2, "month"],
                    [3, "month"],
                    [6, "month"],
                    [1, "year"]
                ];
                var an = 0;
                if (at.minTickSize != null) {
                    if (typeof at.tickSize == "number") {
                        an = at.tickSize
                    } else {
                        an = at.minTickSize[0] * av[at.minTickSize[1]]
                    }
                }
                for (ar = 0; ar < az.length - 1; ++ar) {
                    if (ay < (az[ar][0] * av[az[ar][1]] + az[ar + 1][0] * av[az[ar + 1][1]]) / 2 && az[ar][0] * av[az[ar][1]] >= an) {
                        break
                    }
                }
                aA = az[ar][0];
                aw = az[ar][1];
                if (aw == "year") {
                    am = Math.pow(10, Math.floor(Math.log(ay / av.year) / Math.LN10));
                    al = (ay / av.year) / am;
                    if (al < 1.5) {
                        aA = 1
                    } else {
                        if (al < 3) {
                            aA = 2
                        } else {
                            if (al < 7.5) {
                                aA = 5
                            } else {
                                aA = 10
                            }
                        }
                    }
                    aA *= am
                }
                if (at.tickSize) {
                    aA = at.tickSize[0];
                    aw = at.tickSize[1]
                }
                au = function (aD) {
                    var aI = [],
                        aG = aD.tickSize[0],
                        aJ = aD.tickSize[1],
                        aH = new Date(aD.min);
                    var aC = aG * av[aJ];
                    if (aJ == "second") {
                        aH.setUTCSeconds(a(aH.getUTCSeconds(), aG))
                    }
                    if (aJ == "minute") {
                        aH.setUTCMinutes(a(aH.getUTCMinutes(), aG))
                    }
                    if (aJ == "hour") {
                        aH.setUTCHours(a(aH.getUTCHours(), aG))
                    }
                    if (aJ == "month") {
                        aH.setUTCMonth(a(aH.getUTCMonth(), aG))
                    }
                    if (aJ == "year") {
                        aH.setUTCFullYear(a(aH.getUTCFullYear(), aG))
                    }
                    aH.setUTCMilliseconds(0);
                    if (aC >= av.minute) {
                        aH.setUTCSeconds(0)
                    }
                    if (aC >= av.hour) {
                        aH.setUTCMinutes(0)
                    }
                    if (aC >= av.day) {
                        aH.setUTCHours(0)
                    }
                    if (aC >= av.day * 4) {
                        aH.setUTCDate(1)
                    }
                    if (aC >= av.year) {
                        aH.setUTCMonth(0)
                    }
                    var aL = 0,
                        aK = Number.NaN,
                        aE;
                    do {
                        aE = aK;
                        aK = aH.getTime();
                        aI.push({
                            v: aK,
                            label: aD.tickFormatter(aK, aD)
                        });
                        if (aJ == "month") {
                            if (aG < 1) {
                                aH.setUTCDate(1);
                                var aB = aH.getTime();
                                aH.setUTCMonth(aH.getUTCMonth() + 1);
                                var aF = aH.getTime();
                                aH.setTime(aK + aL * av.hour + (aF - aB) * aG);
                                aL = aH.getUTCHours();
                                aH.setUTCHours(0)
                            } else {
                                aH.setUTCMonth(aH.getUTCMonth() + aG)
                            }
                        } else {
                            if (aJ == "year") {
                                aH.setUTCFullYear(aH.getUTCFullYear() + aG)
                            } else {
                                aH.setTime(aK + aC)
                            }
                        }
                    } while (aK < aD.max && aK != aE);
                    return aI
                };
                ax = function (aB, aE) {
                    var aG = new Date(aB);
                    if (at.timeformat != null) {
                        return c.plot.formatDate(aG, at.timeformat, at.monthNames)
                    }
                    var aC = aE.tickSize[0] * av[aE.tickSize[1]];
                    var aD = aE.max - aE.min;
                    var aF = (at.twelveHourClock) ? " %p" : "";
                    if (aC < av.minute) {
                        fmt = "%h:%M:%S" + aF
                    } else {
                        if (aC < av.day) {
                            if (aD < 2 * av.day) {
                                fmt = "%h:%M" + aF
                            } else {
                                fmt = "%b %d %h:%M" + aF
                            }
                        } else {
                            if (aC < av.month) {
                                fmt = "%b %d"
                            } else {
                                if (aC < av.year) {
                                    if (aD < av.year) {
                                        fmt = "%b"
                                    } else {
                                        fmt = "%b %y"
                                    }
                                } else {
                                    fmt = "%y"
                                }
                            }
                        }
                    }
                    return c.plot.formatDate(aG, fmt, at.monthNames)
                }
            } else {
                var ak = at.tickDecimals;
                var aq = -Math.floor(Math.log(ay) / Math.LN10);
                if (ak != null && aq > ak) {
                    aq = ak
                }
                am = Math.pow(10, -aq);
                al = ay / am;
                if (al < 1.5) {
                    aA = 1
                } else {
                    if (al < 3) {
                        aA = 2;
                        if (al > 2.25 && (ak == null || aq + 1 <= ak)) {
                            aA = 2.5;
                            ++aq
                        }
                    } else {
                        if (al < 7.5) {
                            aA = 5
                        } else {
                            aA = 10
                        }
                    }
                }
                aA *= am;
                if (at.minTickSize != null && aA < at.minTickSize) {
                    aA = at.minTickSize
                }
                if (at.tickSize != null) {
                    aA = at.tickSize
                }
                ap.tickDecimals = Math.max(0, (ak != null) ? ak : aq);
                au = function (aD) {
                    var aF = [];
                    var aG = a(aD.min, aD.tickSize),
                        aC = 0,
                        aB = Number.NaN,
                        aE;
                    do {
                        aE = aB;
                        aB = aG + aC * aD.tickSize;
                        aF.push({
                            v: aB,
                            label: aD.tickFormatter(aB, aD)
                        });
                        ++aC
                    } while (aB < aD.max && aB != aE);
                    return aF
                };
                ax = function (aB, aC) {
                    return aB.toFixed(aC.tickDecimals)
                }
            }
            ap.tickSize = aw ? [aA, aw] : aA;
            ap.tickGenerator = au;
            if (c.isFunction(at.tickFormatter)) {
                ap.tickFormatter = function (aB, aC) {
                    return "" + at.tickFormatter(aB, aC)
                }
            } else {
                ap.tickFormatter = ax
            }
        }

        function P(ao, aq) {
            ao.ticks = [];
            if (!ao.used) {
                return
            }
            if (aq.ticks == null) {
                ao.ticks = ao.tickGenerator(ao)
            } else {
                if (typeof aq.ticks == "number") {
                    if (aq.ticks > 0) {
                        ao.ticks = ao.tickGenerator(ao)
                    }
                } else {
                    if (aq.ticks) {
                        var ap = aq.ticks;
                        if (c.isFunction(ap)) {
                            ap = ap({
                                min: ao.min,
                                max: ao.max
                            })
                        }
                        var an, ak;
                        for (an = 0; an < ap.length; ++an) {
                            var al = null;
                            var am = ap[an];
                            if (typeof am == "object") {
                                ak = am[0];
                                if (am.length > 1) {
                                    al = am[1]
                                }
                            } else {
                                ak = am
                            } if (al == null) {
                                al = ao.tickFormatter(ak, ao)
                            }
                            ao.ticks[an] = {
                                v: ak,
                                label: al
                            }
                        }
                    }
                }
            } if (aq.autoscaleMargin != null && ao.ticks.length > 0) {
                if (aq.min == null) {
                    ao.min = Math.min(ao.min, ao.ticks[0].v)
                }
                if (aq.max == null && ao.ticks.length > 1) {
                    ao.max = Math.max(ao.max, ao.ticks[ao.ticks.length - 1].v)
                }
            }
        }

        function ah() {
            z.clearRect(0, 0, Y, r);
            var al = H.grid;
            if (al.show && !al.aboveData) {
                t()
            }
            for (var ak = 0; ak < p.length; ++ak) {
                aa(p[ak])
            }
            A(m.draw, [z]);
            if (al.show && al.aboveData) {
                t()
            }
        }

        function o(al, ar) {
            var ao = ar + "axis",
                ak = ar + "2axis",
                an, aq, ap, am;
            if (al[ao]) {
                an = S[ao];
                aq = al[ao].from;
                ap = al[ao].to
            } else {
                if (al[ak]) {
                    an = S[ak];
                    aq = al[ak].from;
                    ap = al[ak].to
                } else {
                    an = S[ao];
                    aq = al[ar + "1"];
                    ap = al[ar + "2"]
                }
            } if (aq != null && ap != null && aq > ap) {
                return {
                    from: ap,
                    to: aq,
                    axis: an
                }
            }
            return {
                from: aq,
                to: ap,
                axis: an
            }
        }

        function t() {
            var ao;
            z.save();
            z.translate(F.left, F.top);
            if (H.grid.backgroundColor) {
                z.fillStyle = s(H.grid.backgroundColor, T, 0, "rgba(255, 255, 255, 0)");
                z.fillRect(0, 0, j, T)
            }
            var al = H.grid.markings;
            if (al) {
                if (c.isFunction(al)) {
                    al = al({
                        xmin: S.xaxis.min,
                        xmax: S.xaxis.max,
                        ymin: S.yaxis.min,
                        ymax: S.yaxis.max,
                        xaxis: S.xaxis,
                        yaxis: S.yaxis,
                        x2axis: S.x2axis,
                        y2axis: S.y2axis
                    })
                }
                for (ao = 0; ao < al.length; ++ao) {
                    var ak = al[ao],
                        aq = o(ak, "x"),
                        an = o(ak, "y");
                    if (aq.from == null) {
                        aq.from = aq.axis.min
                    }
                    if (aq.to == null) {
                        aq.to = aq.axis.max
                    }
                    if (an.from == null) {
                        an.from = an.axis.min
                    }
                    if (an.to == null) {
                        an.to = an.axis.max
                    }
                    if (aq.to < aq.axis.min || aq.from > aq.axis.max || an.to < an.axis.min || an.from > an.axis.max) {
                        continue
                    }
                    aq.from = Math.max(aq.from, aq.axis.min);
                    aq.to = Math.min(aq.to, aq.axis.max);
                    an.from = Math.max(an.from, an.axis.min);
                    an.to = Math.min(an.to, an.axis.max);
                    if (aq.from == aq.to && an.from == an.to) {
                        continue
                    }
                    aq.from = aq.axis.p2c(aq.from);
                    aq.to = aq.axis.p2c(aq.to);
                    an.from = an.axis.p2c(an.from);
                    an.to = an.axis.p2c(an.to);
                    if (aq.from == aq.to || an.from == an.to) {
                        z.beginPath();
                        z.strokeStyle = ak.color || H.grid.markingsColor;
                        z.lineWidth = ak.lineWidth || H.grid.markingsLineWidth;
                        z.moveTo(aq.from, an.from);
                        z.lineTo(aq.to, an.to);
                        z.stroke()
                    } else {
                        z.fillStyle = ak.color || H.grid.markingsColor;
                        z.fillRect(aq.from, an.to, aq.to - aq.from, an.from - an.to)
                    }
                }
            }
            z.lineWidth = 1;
            z.strokeStyle = H.grid.tickColor;
            z.beginPath();
            var am, ap = S.xaxis;
            for (ao = 0; ao < ap.ticks.length; ++ao) {
                am = ap.ticks[ao].v;
                if (am <= ap.min || am >= S.xaxis.max) {
                    continue
                }
                z.moveTo(Math.floor(ap.p2c(am)) + z.lineWidth / 2, 0);
                z.lineTo(Math.floor(ap.p2c(am)) + z.lineWidth / 2, T)
            }
            ap = S.yaxis;
            for (ao = 0; ao < ap.ticks.length; ++ao) {
                am = ap.ticks[ao].v;
                if (am <= ap.min || am >= ap.max) {
                    continue
                }
                z.moveTo(0, Math.floor(ap.p2c(am)) + z.lineWidth / 2);
                z.lineTo(j, Math.floor(ap.p2c(am)) + z.lineWidth / 2)
            }
            ap = S.x2axis;
            for (ao = 0; ao < ap.ticks.length; ++ao) {
                am = ap.ticks[ao].v;
                if (am <= ap.min || am >= ap.max) {
                    continue
                }
                z.moveTo(Math.floor(ap.p2c(am)) + z.lineWidth / 2, -5);
                z.lineTo(Math.floor(ap.p2c(am)) + z.lineWidth / 2, 5)
            }
            ap = S.y2axis;
            for (ao = 0; ao < ap.ticks.length; ++ao) {
                am = ap.ticks[ao].v;
                if (am <= ap.min || am >= ap.max) {
                    continue
                }
                z.moveTo(j - 5, Math.floor(ap.p2c(am)) + z.lineWidth / 2);
                z.lineTo(j + 5, Math.floor(ap.p2c(am)) + z.lineWidth / 2)
            }
            z.stroke();
            if (H.grid.borderWidth) {
                var ar = H.grid.borderWidth;
                z.lineWidth = ar;
                z.strokeStyle = H.grid.borderColor;
                z.strokeRect(-ar / 2, -ar / 2, j + ar, T + ar)
            }
            z.restore()
        }

        function I() {
            L.find(".tickLabels").remove();
            var ak = ['<div class="tickLabels" style="font-size:smaller;color:' + H.grid.color + '">'];

            function am(ap, aq) {
                for (var ao = 0; ao < ap.ticks.length; ++ao) {
                    var an = ap.ticks[ao];
                    if (!an.label || an.v < ap.min || an.v > ap.max) {
                        continue
                    }
                    ak.push(aq(an, ap))
                }
            }
            var al = H.grid.labelMargin + H.grid.borderWidth;
            am(S.xaxis, function (an, ao) {
                return '<div style="position:absolute;top:' + (F.top + T + al) + "px;left:" + Math.round(F.left + ao.p2c(an.v) - ao.labelWidth / 2) + "px;width:" + ao.labelWidth + 'px;text-align:center" class="tickLabel">' + an.label + "</div>"
            });
            am(S.yaxis, function (an, ao) {
                return '<div style="position:absolute;top:' + Math.round(F.top + ao.p2c(an.v) - ao.labelHeight / 2) + "px;right:" + (F.right + j + al) + "px;width:" + ao.labelWidth + 'px;text-align:right" class="tickLabel">' + an.label + "</div>"
            });
            am(S.x2axis, function (an, ao) {
                return '<div style="position:absolute;bottom:' + (F.bottom + T + al) + "px;left:" + Math.round(F.left + ao.p2c(an.v) - ao.labelWidth / 2) + "px;width:" + ao.labelWidth + 'px;text-align:center" class="tickLabel">' + an.label + "</div>"
            });
            am(S.y2axis, function (an, ao) {
                return '<div style="position:absolute;top:' + Math.round(F.top + ao.p2c(an.v) - ao.labelHeight / 2) + "px;left:" + (F.left + j + al) + "px;width:" + ao.labelWidth + 'px;text-align:left" class="tickLabel">' + an.label + "</div>"
            });
            ak.push("</div>");
            L.append(ak.join(""))
        }

        function aa(ak) {
            if (ak.lines.show) {
                B(ak)
            }
            if (ak.bars.show) {
                N(ak)
            }
            if (ak.points.show) {
                O(ak)
            }
        }

        function B(an) {
            function am(az, aA, ar, aE, aD) {
                var aF = az.points,
                    at = az.pointsize,
                    ax = null,
                    aw = null;
                z.beginPath();
                for (var ay = at; ay < aF.length; ay += at) {
                    var av = aF[ay - at],
                        aC = aF[ay - at + 1],
                        au = aF[ay],
                        aB = aF[ay + 1];
                    if (av == null || au == null) {
                        continue
                    }
                    if (aC <= aB && aC < aD.min) {
                        if (aB < aD.min) {
                            continue
                        }
                        av = (aD.min - aC) / (aB - aC) * (au - av) + av;
                        aC = aD.min
                    } else {
                        if (aB <= aC && aB < aD.min) {
                            if (aC < aD.min) {
                                continue
                            }
                            au = (aD.min - aC) / (aB - aC) * (au - av) + av;
                            aB = aD.min
                        }
                    } if (aC >= aB && aC > aD.max) {
                        if (aB > aD.max) {
                            continue
                        }
                        av = (aD.max - aC) / (aB - aC) * (au - av) + av;
                        aC = aD.max
                    } else {
                        if (aB >= aC && aB > aD.max) {
                            if (aC > aD.max) {
                                continue
                            }
                            au = (aD.max - aC) / (aB - aC) * (au - av) + av;
                            aB = aD.max
                        }
                    } if (av <= au && av < aE.min) {
                        if (au < aE.min) {
                            continue
                        }
                        aC = (aE.min - av) / (au - av) * (aB - aC) + aC;
                        av = aE.min
                    } else {
                        if (au <= av && au < aE.min) {
                            if (av < aE.min) {
                                continue
                            }
                            aB = (aE.min - av) / (au - av) * (aB - aC) + aC;
                            au = aE.min
                        }
                    } if (av >= au && av > aE.max) {
                        if (au > aE.max) {
                            continue
                        }
                        aC = (aE.max - av) / (au - av) * (aB - aC) + aC;
                        av = aE.max
                    } else {
                        if (au >= av && au > aE.max) {
                            if (av > aE.max) {
                                continue
                            }
                            aB = (aE.max - av) / (au - av) * (aB - aC) + aC;
                            au = aE.max
                        }
                    } if (av != ax || aC != aw) {
                        z.moveTo(aE.p2c(av) + aA, aD.p2c(aC) + ar)
                    }
                    ax = au;
                    aw = aB;
                    z.lineTo(aE.p2c(au) + aA, aD.p2c(aB) + ar)
                }
                z.stroke()
            }

            function ao(ay, aF, aD) {
                var aG = ay.points,
                    ar = ay.pointsize,
                    at = Math.min(Math.max(0, aD.min), aD.max),
                    aB, aw = 0,
                    aE = false;
                for (var ax = ar; ax < aG.length; ax += ar) {
                    var av = aG[ax - ar],
                        aC = aG[ax - ar + 1],
                        au = aG[ax],
                        aA = aG[ax + 1];
                    if (aE && av != null && au == null) {
                        z.lineTo(aF.p2c(aw), aD.p2c(at));
                        z.fill();
                        aE = false;
                        continue
                    }
                    if (av == null || au == null) {
                        continue
                    }
                    if (av <= au && av < aF.min) {
                        if (au < aF.min) {
                            continue
                        }
                        aC = (aF.min - av) / (au - av) * (aA - aC) + aC;
                        av = aF.min
                    } else {
                        if (au <= av && au < aF.min) {
                            if (av < aF.min) {
                                continue
                            }
                            aA = (aF.min - av) / (au - av) * (aA - aC) + aC;
                            au = aF.min
                        }
                    } if (av >= au && av > aF.max) {
                        if (au > aF.max) {
                            continue
                        }
                        aC = (aF.max - av) / (au - av) * (aA - aC) + aC;
                        av = aF.max
                    } else {
                        if (au >= av && au > aF.max) {
                            if (av > aF.max) {
                                continue
                            }
                            aA = (aF.max - av) / (au - av) * (aA - aC) + aC;
                            au = aF.max
                        }
                    } if (!aE) {
                        z.beginPath();
                        z.moveTo(aF.p2c(av), aD.p2c(at));
                        aE = true
                    }
                    if (aC >= aD.max && aA >= aD.max) {
                        z.lineTo(aF.p2c(av), aD.p2c(aD.max));
                        z.lineTo(aF.p2c(au), aD.p2c(aD.max));
                        aw = au;
                        continue
                    } else {
                        if (aC <= aD.min && aA <= aD.min) {
                            z.lineTo(aF.p2c(av), aD.p2c(aD.min));
                            z.lineTo(aF.p2c(au), aD.p2c(aD.min));
                            aw = au;
                            continue
                        }
                    }
                    var aH = av,
                        az = au;
                    if (aC <= aA && aC < aD.min && aA >= aD.min) {
                        av = (aD.min - aC) / (aA - aC) * (au - av) + av;
                        aC = aD.min
                    } else {
                        if (aA <= aC && aA < aD.min && aC >= aD.min) {
                            au = (aD.min - aC) / (aA - aC) * (au - av) + av;
                            aA = aD.min
                        }
                    } if (aC >= aA && aC > aD.max && aA <= aD.max) {
                        av = (aD.max - aC) / (aA - aC) * (au - av) + av;
                        aC = aD.max
                    } else {
                        if (aA >= aC && aA > aD.max && aC <= aD.max) {
                            au = (aD.max - aC) / (aA - aC) * (au - av) + av;
                            aA = aD.max
                        }
                    } if (av != aH) {
                        if (aC <= aD.min) {
                            aB = aD.min
                        } else {
                            aB = aD.max
                        }
                        z.lineTo(aF.p2c(aH), aD.p2c(aB));
                        z.lineTo(aF.p2c(av), aD.p2c(aB))
                    }
                    z.lineTo(aF.p2c(av), aD.p2c(aC));
                    z.lineTo(aF.p2c(au), aD.p2c(aA));
                    if (au != az) {
                        if (aA <= aD.min) {
                            aB = aD.min
                        } else {
                            aB = aD.max
                        }
                        z.lineTo(aF.p2c(au), aD.p2c(aB));
                        z.lineTo(aF.p2c(az), aD.p2c(aB))
                    }
                    aw = Math.max(au, az)
                }
                if (aE) {
                    z.lineTo(aF.p2c(aw), aD.p2c(at));
                    z.fill()
                }
            }
            z.save();
            z.translate(F.left, F.top);
            z.lineJoin = "round";
            var ap = an.lines.lineWidth,
                ak = an.shadowSize;
            if (ap > 0 && ak > 0) {
                z.lineWidth = ak;
                z.strokeStyle = "rgba(0,0,0,0.1)";
                var aq = Math.PI / 18;
                am(an.datapoints, Math.sin(aq) * (ap / 2 + ak / 2), Math.cos(aq) * (ap / 2 + ak / 2), an.xaxis, an.yaxis);
                z.lineWidth = ak / 2;
                am(an.datapoints, Math.sin(aq) * (ap / 2 + ak / 4), Math.cos(aq) * (ap / 2 + ak / 4), an.xaxis, an.yaxis)
            }
            z.lineWidth = ap;
            z.strokeStyle = an.color;
            var al = w(an.lines, an.color, 0, T);
            if (al) {
                z.fillStyle = al;
                ao(an.datapoints, an.xaxis, an.yaxis)
            }
            if (ap > 0) {
                am(an.datapoints, 0, 0, an.xaxis, an.yaxis)
            }
            z.restore()
        }

        function O(an) {
            function ap(av, au, aC, ar, aw, aA, az) {
                var aB = av.points,
                    aq = av.pointsize;
                for (var at = 0; at < aB.length; at += aq) {
                    var ay = aB[at],
                        ax = aB[at + 1];
                    if (ay == null || ay < aA.min || ay > aA.max || ax < az.min || ax > az.max) {
                        continue
                    }
                    z.beginPath();
                    z.arc(aA.p2c(ay), az.p2c(ax) + ar, au, 0, aw, false);
                    if (aC) {
                        z.fillStyle = aC;
                        z.fill()
                    }
                    z.stroke()
                }
            }
            z.save();
            z.translate(F.left, F.top);
            var ao = an.lines.lineWidth,
                al = an.shadowSize,
                ak = an.points.radius;
            if (ao > 0 && al > 0) {
                var am = al / 2;
                z.lineWidth = am;
                z.strokeStyle = "rgba(0,0,0,0.1)";
                ap(an.datapoints, ak, null, am + am / 2, Math.PI, an.xaxis, an.yaxis);
                z.strokeStyle = "rgba(0,0,0,0.2)";
                ap(an.datapoints, ak, null, am / 2, Math.PI, an.xaxis, an.yaxis)
            }
            z.lineWidth = ao;
            z.strokeStyle = an.color;
            ap(an.datapoints, ak, w(an.points, an.color), 0, 2 * Math.PI, an.xaxis, an.yaxis);
            z.restore()
        }

        function ab(aw, av, aE, aq, az, an, al, au, at, aD, aA) {
            var am, aC, ar, ay, ao, ak, ax, ap, aB;
            if (aA) {
                ap = ak = ax = true;
                ao = false;
                am = aE;
                aC = aw;
                ay = av + aq;
                ar = av + az;
                if (aC < am) {
                    aB = aC;
                    aC = am;
                    am = aB;
                    ao = true;
                    ak = false
                }
            } else {
                ao = ak = ax = true;
                ap = false;
                am = aw + aq;
                aC = aw + az;
                ar = aE;
                ay = av;
                if (ay < ar) {
                    aB = ay;
                    ay = ar;
                    ar = aB;
                    ap = true;
                    ax = false
                }
            } if (aC < au.min || am > au.max || ay < at.min || ar > at.max) {
                return
            }
            if (am < au.min) {
                am = au.min;
                ao = false
            }
            if (aC > au.max) {
                aC = au.max;
                ak = false
            }
            if (ar < at.min) {
                ar = at.min;
                ap = false
            }
            if (ay > at.max) {
                ay = at.max;
                ax = false
            }
            am = au.p2c(am);
            ar = at.p2c(ar);
            aC = au.p2c(aC);
            ay = at.p2c(ay);
            if (al) {
                aD.beginPath();
                aD.moveTo(am, ar);
                aD.lineTo(am, ay);
                aD.lineTo(aC, ay);
                aD.lineTo(aC, ar);
                aD.fillStyle = al(ar, ay);
                aD.fill()
            }
            if (ao || ak || ax || ap) {
                aD.beginPath();
                aD.moveTo(am, ar + an);
                if (ao) {
                    aD.lineTo(am, ay + an)
                } else {
                    aD.moveTo(am, ay + an)
                } if (ax) {
                    aD.lineTo(aC, ay + an)
                } else {
                    aD.moveTo(aC, ay + an)
                } if (ak) {
                    aD.lineTo(aC, ar + an)
                } else {
                    aD.moveTo(aC, ar + an)
                } if (ap) {
                    aD.lineTo(am, ar + an)
                } else {
                    aD.moveTo(am, ar + an)
                }
                aD.stroke()
            }
        }

        function N(am) {
            function al(at, ar, av, ap, au, ax, aw) {
                var ay = at.points,
                    ao = at.pointsize;
                for (var aq = 0; aq < ay.length; aq += ao) {
                    if (ay[aq] == null) {
                        continue
                    }
                    ab(ay[aq], ay[aq + 1], ay[aq + 2], ar, av, ap, au, ax, aw, z, am.bars.horizontal)
                }
            }
            z.save();
            z.translate(F.left, F.top);
            z.lineWidth = am.bars.lineWidth;
            z.strokeStyle = am.color;
            var ak = am.bars.align == "left" ? 0 : -am.bars.barWidth / 2;
            var an = am.bars.fill ? function (ao, ap) {
                return w(am.bars, am.color, ao, ap)
            } : null;
            al(am.datapoints, ak, ak + am.bars.barWidth, 0, an, am.xaxis, am.yaxis);
            z.restore()
        }

        function w(am, ak, al, ao) {
            var an = am.fill;
            if (!an) {
                return null
            }
            if (am.fillColor) {
                return s(am.fillColor, al, ao, ak)
            }
            var ap = c.color.parse(ak);
            ap.a = typeof an == "number" ? an : 0.4;
            ap.normalize();
            return ap.toString()
        }

        function ai() {
            L.find(".legend").remove();
            if (!H.legend.show) {
                return
            }
            var ap = [],
                an = false,
                aw = H.legend.labelFormatter,
                av, ar;
            for (i = 0; i < p.length; ++i) {
                av = p[i];
                ar = av.label;
                if (!ar) {
                    continue
                }
                if (i % H.legend.noColumns == 0) {
                    if (an) {
                        ap.push("</tr>")
                    }
                    ap.push("<tr>");
                    an = true
                }
                if (aw) {
                    ar = aw(ar, av)
                }
                ap.push('<td class="legendColorBox"><div style="border:1px solid ' + H.legend.labelBoxBorderColor + ';padding:1px"><div style="width:4px;height:0;border:5px solid ' + av.color + ';overflow:hidden"></div></div></td><td class="legendLabel">' + ar + "</td>")
            }
            if (an) {
                ap.push("</tr>")
            }
            if (ap.length == 0) {
                return
            }
            var au = '<table style="font-size:smaller;color:' + H.grid.color + '">' + ap.join("") + "</table>";
            if (H.legend.container != null) {
                c(H.legend.container).html(au)
            } else {
                var aq = "",
                    al = H.legend.position,
                    am = H.legend.margin;
                if (am[0] == null) {
                    am = [am, am]
                }
                if (al.charAt(0) == "n") {
                    aq += "top:" + (am[1] + F.top) + "px;"
                } else {
                    if (al.charAt(0) == "s") {
                        aq += "bottom:" + (am[1] + F.bottom) + "px;"
                    }
                } if (al.charAt(1) == "e") {
                    aq += "right:" + (am[0] + F.right) + "px;"
                } else {
                    if (al.charAt(1) == "w") {
                        aq += "left:" + (am[0] + F.left) + "px;"
                    }
                }
                var at = c('<div class="legend">' + au.replace('style="', 'style="position:absolute;' + aq + ";") + "</div>").appendTo(L);
                if (H.legend.backgroundOpacity != 0) {
                    var ao = H.legend.backgroundColor;
                    if (ao == null) {
                        ao = H.grid.backgroundColor;
                        if (ao && typeof ao == "string") {
                            ao = c.color.parse(ao)
                        } else {
                            ao = c.color.extract(at, "background-color")
                        }
                        ao.a = 1;
                        ao = ao.toString()
                    }
                    var ak = at.children();
                    c('<div style="position:absolute;width:' + ak.width() + "px;height:" + ak.height() + "px;" + aq + "background-color:" + ao + ';"> </div>').prependTo(at).css("opacity", H.legend.backgroundOpacity)
                }
            }
        }
        var W = [],
            k = null;

        function af(ar, ap, am) {
            var ay = H.grid.mouseActiveRadius,
                aK = ay * ay + 1,
                aI = null,
                aB = false,
                aG, aE;
            for (aG = 0; aG < p.length; ++aG) {
                if (!am(p[aG])) {
                    continue
                }
                var az = p[aG],
                    aq = az.xaxis,
                    ao = az.yaxis,
                    aF = az.datapoints.points,
                    aD = az.datapoints.pointsize,
                    aA = aq.c2p(ar),
                    ax = ao.c2p(ap),
                    al = ay / aq.scale,
                    ak = ay / ao.scale;
                if (az.lines.show || az.points.show) {
                    for (aE = 0; aE < aF.length; aE += aD) {
                        var au = aF[aE],
                            at = aF[aE + 1];
                        if (au == null) {
                            continue
                        }
                        if (au - aA > al || au - aA < -al || at - ax > ak || at - ax < -ak) {
                            continue
                        }
                        var aw = Math.abs(aq.p2c(au) - ar),
                            av = Math.abs(ao.p2c(at) - ap),
                            aC = aw * aw + av * av;
                        if (aC <= aK) {
                            aK = aC;
                            aI = [aG, aE / aD]
                        }
                    }
                }
                if (az.bars.show && !aI) {
                    var an = az.bars.align == "left" ? 0 : -az.bars.barWidth / 2,
                        aH = an + az.bars.barWidth;
                    for (aE = 0; aE < aF.length; aE += aD) {
                        var au = aF[aE],
                            at = aF[aE + 1],
                            aJ = aF[aE + 2];
                        if (au == null) {
                            continue
                        }
                        if (p[aG].bars.horizontal ? (aA <= Math.max(aJ, au) && aA >= Math.min(aJ, au) && ax >= at + an && ax <= at + aH) : (aA >= au + an && aA <= au + aH && ax >= Math.min(aJ, at) && ax <= Math.max(aJ, at))) {
                            aI = [aG, aE / aD]
                        }
                    }
                }
            }
            if (aI) {
                aG = aI[0];
                aE = aI[1];
                aD = p[aG].datapoints.pointsize;
                return {
                    datapoint: p[aG].datapoints.points.slice(aE * aD, (aE + 1) * aD),
                    dataIndex: aE,
                    series: p[aG],
                    seriesIndex: aG
                }
            }
            return null
        }

        function d(ak) {
            if (H.grid.hoverable) {
                h("plothover", ak, function (al) {
                    return al.hoverable != false
                })
            }
        }

        function E(ak) {
            h("plotclick", ak, function (al) {
                return al.clickable != false
            })
        }

        function h(al, ak, am) {
            var an = ad.offset(),
                at = {
                    pageX: ak.pageX,
                    pageY: ak.pageY
                }, aq = ak.pageX - an.left - F.left,
                ao = ak.pageY - an.top - F.top;
            if (S.xaxis.used) {
                at.x = S.xaxis.c2p(aq)
            }
            if (S.yaxis.used) {
                at.y = S.yaxis.c2p(ao)
            }
            if (S.x2axis.used) {
                at.x2 = S.x2axis.c2p(aq)
            }
            if (S.y2axis.used) {
                at.y2 = S.y2axis.c2p(ao)
            }
            var au = af(aq, ao, am);
            if (au) {
                au.pageX = parseInt(au.series.xaxis.p2c(au.datapoint[0]) + an.left + F.left);
                au.pageY = parseInt(au.series.yaxis.p2c(au.datapoint[1]) + an.top + F.top)
            }
            if (H.grid.autoHighlight) {
                for (var ap = 0; ap < W.length; ++ap) {
                    var ar = W[ap];
                    if (ar.auto == al && !(au && ar.series == au.series && ar.point == au.datapoint)) {
                        X(ar.series, ar.point)
                    }
                }
                if (au) {
                    ae(au.series, au.datapoint, al)
                }
            }
            L.trigger(al, [at, au])
        }

        function Q() {
            if (!k) {
                k = setTimeout(V, 30)
            }
        }

        function V() {
            k = null;
            aj.save();
            aj.clearRect(0, 0, Y, r);
            aj.translate(F.left, F.top);
            var al, ak;
            for (al = 0; al < W.length; ++al) {
                ak = W[al];
                if (ak.series.bars.show) {
                    Z(ak.series, ak.point)
                } else {
                    U(ak.series, ak.point)
                }
            }
            aj.restore();
            A(m.drawOverlay, [aj])
        }

        function ae(am, ak, an) {
            if (typeof am == "number") {
                am = p[am]
            }
            if (typeof ak == "number") {
                ak = am.data[ak]
            }
            var al = J(am, ak);
            if (al == -1) {
                W.push({
                    series: am,
                    point: ak,
                    auto: an
                });
                Q()
            } else {
                if (!an) {
                    W[al].auto = false
                }
            }
        }

        function X(am, ak) {
            if (am == null && ak == null) {
                W = [];
                Q()
            }
            if (typeof am == "number") {
                am = p[am]
            }
            if (typeof ak == "number") {
                ak = am.data[ak]
            }
            var al = J(am, ak);
            if (al != -1) {
                W.splice(al, 1);
                Q()
            }
        }

        function J(am, an) {
            for (var ak = 0; ak < W.length; ++ak) {
                var al = W[ak];
                if (al.series == am && al.point[0] == an[0] && al.point[1] == an[1]) {
                    return ak
                }
            }
            return -1
        }

        function U(an, am) {
            var al = am[0],
                ar = am[1],
                aq = an.xaxis,
                ap = an.yaxis;
            if (al < aq.min || al > aq.max || ar < ap.min || ar > ap.max) {
                return
            }
            var ao = an.points.radius + an.points.lineWidth / 2;
            aj.lineWidth = ao;
            aj.strokeStyle = c.color.parse(an.color).scale("a", 0.5).toString();
            var ak = 1.5 * ao;
            aj.beginPath();
            aj.arc(aq.p2c(al), ap.p2c(ar), ak, 0, 2 * Math.PI, false);
            aj.stroke()
        }

        function Z(an, ak) {
            aj.lineWidth = an.bars.lineWidth;
            aj.strokeStyle = c.color.parse(an.color).scale("a", 0.5).toString();
            var am = c.color.parse(an.color).scale("a", 0.5).toString();
            var al = an.bars.align == "left" ? 0 : -an.bars.barWidth / 2;
            ab(ak[0], ak[1], ak[2] || 0, al, al + an.bars.barWidth, 0, function () {
                return am
            }, an.xaxis, an.yaxis, aj, an.bars.horizontal)
        }

        function s(am, al, aq, ao) {
            if (typeof am == "string") {
                return am
            } else {
                var ap = z.createLinearGradient(0, aq, 0, al);
                for (var an = 0, ak = am.colors.length; an < ak; ++an) {
                    var ar = am.colors[an];
                    if (typeof ar != "string") {
                        ar = c.color.parse(ao).scale("rgb", ar.brightness);
                        ar.a *= ar.opacity;
                        ar = ar.toString()
                    }
                    ap.addColorStop(an / (ak - 1), ar)
                }
                return ap
            }
        }
    }
    c.plot = function (g, e, d) {
        var f = new b(c(g), e, d, c.plot.plugins);
        return f
    };
    c.plot.plugins = [];
    c.plot.formatDate = function (j, f, h) {
        var n = function (d) {
            d = "" + d;
            return d.length == 1 ? "0" + d : d
        };
        var e = [];
        var o = false;
        var m = j.getUTCHours();
        var k = m < 12;
        if (h == null) {
            h = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        }
        if (f.search(/%p|%P/) != -1) {
            if (m > 12) {
                m = m - 12
            } else {
                if (m == 0) {
                    m = 12
                }
            }
        }
        for (var g = 0; g < f.length; ++g) {
            var l = f.charAt(g);
            if (o) {
                switch (l) {
                    case "h":
                        l = "" + m;
                        break;
                    case "H":
                        l = n(m);
                        break;
                    case "M":
                        l = n(j.getUTCMinutes());
                        break;
                    case "S":
                        l = n(j.getUTCSeconds());
                        break;
                    case "d":
                        l = "" + j.getUTCDate();
                        break;
                    case "m":
                        l = "" + (j.getUTCMonth() + 1);
                        break;
                    case "y":
                        l = "" + j.getUTCFullYear();
                        break;
                    case "b":
                        l = "" + h[j.getUTCMonth()];
                        break;
                    case "p":
                        l = (k) ? ("am") : ("pm");
                        break;
                    case "P":
                        l = (k) ? ("AM") : ("PM");
                        break
                }
                e.push(l);
                o = false
            } else {
                if (l == "%") {
                    o = true
                } else {
                    e.push(l)
                }
            }
        }
        return e.join("")
    };

    function a(e, d) {
        return d * Math.floor(e / d)
    }
})(jQuery);
(function (a) {
    function b(k) {
        var p = {
            first: {
                x: -1,
                y: -1
            },
            second: {
                x: -1,
                y: -1
            },
            show: false,
            active: false
        };
        var m = {};

        function d(r) {
            if (p.active) {
                k.getPlaceholder().trigger("plotselecting", [f()]);
                l(r)
            }
        }

        function n(r) {
            if (r.which != 1) {
                return
            }
            document.body.focus();
            if (document.onselectstart !== undefined && m.onselectstart == null) {
                m.onselectstart = document.onselectstart;
                document.onselectstart = function () {
                    return false
                }
            }
            if (document.ondrag !== undefined && m.ondrag == null) {
                m.ondrag = document.ondrag;
                document.ondrag = function () {
                    return false
                }
            }
            c(p.first, r);
            p.active = true;
            a(document).one("mouseup", j)
        }

        function j(r) {
            if (document.onselectstart !== undefined) {
                document.onselectstart = m.onselectstart
            }
            if (document.ondrag !== undefined) {
                document.ondrag = m.ondrag
            }
            p.active = false;
            l(r);
            if (e()) {
                h()
            } else {
                k.getPlaceholder().trigger("plotunselected", []);
                k.getPlaceholder().trigger("plotselecting", [null])
            }
            return false
        }

        function f() {
            if (!e()) {
                return null
            }
            var t = Math.min(p.first.x, p.second.x),
                s = Math.max(p.first.x, p.second.x),
                v = Math.max(p.first.y, p.second.y),
                u = Math.min(p.first.y, p.second.y);
            var w = {};
            var x = k.getAxes();
            if (x.xaxis.used) {
                w.xaxis = {
                    from: x.xaxis.c2p(t),
                    to: x.xaxis.c2p(s)
                }
            }
            if (x.x2axis.used) {
                w.x2axis = {
                    from: x.x2axis.c2p(t),
                    to: x.x2axis.c2p(s)
                }
            }
            if (x.yaxis.used) {
                w.yaxis = {
                    from: x.yaxis.c2p(v),
                    to: x.yaxis.c2p(u)
                }
            }
            if (x.y2axis.used) {
                w.y2axis = {
                    from: x.y2axis.c2p(v),
                    to: x.y2axis.c2p(u)
                }
            }
            return w
        }

        function h() {
            var s = f();
            k.getPlaceholder().trigger("plotselected", [s]);
            var t = k.getAxes();
            if (t.xaxis.used && t.yaxis.used) {
                k.getPlaceholder().trigger("selected", [{
                    x1: s.xaxis.from,
                    y1: s.yaxis.from,
                    x2: s.xaxis.to,
                    y2: s.yaxis.to
                }
                ])
            }
        }

        function g(s, t, r) {
            return t < s ? s : (t > r ? r : t)
        }

        function c(v, s) {
            var u = k.getOptions();
            var t = k.getPlaceholder().offset();
            var r = k.getPlotOffset();
            v.x = g(0, s.pageX - t.left - r.left, k.width());
            v.y = g(0, s.pageY - t.top - r.top, k.height());
            if (u.selection.mode == "y") {
                v.x = v == p.first ? 0 : k.width()
            }
            if (u.selection.mode == "x") {
                v.y = v == p.first ? 0 : k.height()
            }
        }

        function l(r) {
            if (r.pageX == null) {
                return
            }
            c(p.second, r);
            if (e()) {
                p.show = true;
                k.triggerRedrawOverlay()
            } else {
                q(true)
            }
        }

        function q(r) {
            if (p.show) {
                p.show = false;
                k.triggerRedrawOverlay();
                if (!r) {
                    k.getPlaceholder().trigger("plotunselected", [])
                }
            }
        }

        function o(s, r) {
            var u, t, v = k.getAxes();
            var w = k.getOptions();
            if (w.selection.mode == "y") {
                p.first.x = 0;
                p.second.x = k.width()
            } else {
                u = s.xaxis ? v.xaxis : (s.x2axis ? v.x2axis : v.xaxis);
                t = s.xaxis || s.x2axis || {
                    from: s.x1,
                    to: s.x2
                };
                p.first.x = u.p2c(Math.min(t.from, t.to));
                p.second.x = u.p2c(Math.max(t.from, t.to))
            } if (w.selection.mode == "x") {
                p.first.y = 0;
                p.second.y = k.height()
            } else {
                u = s.yaxis ? v.yaxis : (s.y2axis ? v.y2axis : v.yaxis);
                t = s.yaxis || s.y2axis || {
                    from: s.y1,
                    to: s.y2
                };
                p.first.y = u.p2c(Math.min(t.from, t.to));
                p.second.y = u.p2c(Math.max(t.from, t.to))
            }
            p.show = true;
            k.triggerRedrawOverlay();
            if (!r) {
                h()
            }
        }

        function e() {
            var r = 5;
            return Math.abs(p.second.x - p.first.x) >= r && Math.abs(p.second.y - p.first.y) >= r
        }
        k.clearSelection = q;
        k.setSelection = o;
        k.getSelection = f;
        k.hooks.bindEvents.push(function (s, r) {
            var t = s.getOptions();
            if (t.selection.mode != null) {
                r.mousemove(d)
            }
            if (t.selection.mode != null) {
                r.mousedown(n)
            }
        });
        k.hooks.drawOverlay.push(function (u, C) {
            if (p.show && e()) {
                var s = u.getPlotOffset();
                var r = u.getOptions();
                C.save();
                C.translate(s.left, s.top);
                var v = a.color.parse(r.selection.color);
                C.strokeStyle = v.scale("a", 0.8).toString();
                C.lineWidth = 1;
                C.lineJoin = "round";
                C.fillStyle = v.scale("a", 0.4).toString();
                var A = Math.min(p.first.x, p.second.x),
                    z = Math.min(p.first.y, p.second.y),
                    B = Math.abs(p.second.x - p.first.x),
                    t = Math.abs(p.second.y - p.first.y);
                C.fillRect(A, z, B, t);
                C.strokeRect(A, z, B, t);
                C.restore()
            }
        })
    }
    a.plot.plugins.push({
        init: b,
        options: {
            selection: {
                mode: null,
                color: "#e8cfac"
            }
        },
        name: "selection",
        version: "1.0"
    })
})(jQuery);
(function (h) {
    var c = "file_upload",
        f = "undefined",
        g = "function",
        e = "number",
        a, d, b = function (l, j) {
            var k = 0;
            this.complete = function () {
                k += 1;
                if (k === j) {
                    l()
                }
            }
        };
    a = function (B) {
        var z = this,
            u, m, L = {
                namespace: c,
                uploadFormFilter: function (R) {
                    return true
                },
                fileInputFilter: function (R) {
                    return true
                },
                cssClass: c,
                dragDropSupport: true,
                dropZone: B,
                url: function (R) {
                    return R.attr("action")
                },
                method: function (R) {
                    return R.attr("method")
                },
                fieldName: function (R) {
                    return R.attr("name")
                },
                formData: function (R) {
                    return R.serializeArray()
                },
                multipart: true,
                multiFileRequest: false,
                withCredentials: false,
                forceIframeUpload: false
            }, l = {}, O = {}, w = /^http(s)?:\/\//,
            y, x = function () {
                return typeof XMLHttpRequest !== f && typeof File !== f && (!L.multipart || typeof FormData !== f || typeof FileReader !== f)
            }, H = function () {
                if (L.dragDropSupport) {
                    if (typeof L.onDocumentDragEnter === g) {
                        l["dragenter." + L.namespace] = function (R) {
                            L.onDocumentDragEnter(R)
                        }
                    }
                    if (typeof L.onDocumentDragLeave === g) {
                        l["dragleave." + L.namespace] = function (R) {
                            L.onDocumentDragLeave(R)
                        }
                    }
                    l["dragover." + L.namespace] = z.onDocumentDragOver;
                    l["drop." + L.namespace] = z.onDocumentDrop;
                    h(document).bind(l);
                    if (typeof L.onDragEnter === g) {
                        O["dragenter." + L.namespace] = function (R) {
                            L.onDragEnter(R)
                        }
                    }
                    if (typeof L.onDragLeave === g) {
                        O["dragleave." + L.namespace] = function (R) {
                            L.onDragLeave(R)
                        }
                    }
                    O["dragover." + L.namespace] = z.onDragOver;
                    O["drop." + L.namespace] = z.onDrop;
                    L.dropZone.bind(O)
                }
                m.bind("change." + L.namespace, z.onChange)
            }, k = function () {
                h.each(l, function (R, S) {
                    h(document).unbind(R, S)
                });
                h.each(O, function (R, S) {
                    L.dropZone.unbind(R, S)
                });
                m.unbind("change." + L.namespace)
            }, p = function (T, R, U, S) {
                if (typeof S.onProgress === g) {
                    U.upload.onprogress = function (V) {
                        S.onProgress(V, T, R, U, S)
                    }
                }
                if (typeof S.onLoad === g) {
                    U.onload = function (V) {
                        S.onLoad(V, T, R, U, S)
                    }
                }
                if (typeof S.onAbort === g) {
                    U.onabort = function (V) {
                        S.onAbort(V, T, R, U, S)
                    }
                }
                if (typeof S.onError === g) {
                    U.onerror = function (V) {
                        S.onError(V, T, R, U, S)
                    }
                }
            }, K = function (R) {
                if (typeof R.url === g) {
                    return R.url(R.uploadForm || u)
                }
                return R.url
            }, j = function (R) {
                if (typeof R.method === g) {
                    return R.method(R.uploadForm || u)
                }
                return R.method
            }, v = function (R) {
                if (typeof R.fieldName === g) {
                    return R.fieldName(R.fileInput || m)
                }
                return R.fieldName
            }, G = function (R) {
                var S;
                if (typeof R.formData === g) {
                    return R.formData(R.uploadForm || u)
                } else {
                    if (h.isArray(R.formData)) {
                        return R.formData
                    } else {
                        if (R.formData) {
                            S = [];
                            h.each(R.formData, function (T, U) {
                                S.push({
                                    name: T,
                                    value: U
                                })
                            });
                            return S
                        }
                    }
                }
                return []
            }, Q = function (U) {
                if (w.test(U)) {
                    var V = location.host,
                        T = location.protocol.length + 2,
                        S = U.indexOf(V, T),
                        R = S + V.length;
                    if ((S === T || S === U.indexOf("@", T) + 1) && (U.length === R || h.inArray(U.charAt(R), ["/", "?", "#"]) !== -1)) {
                        return true
                    }
                    return false
                }
                return true
            }, o = function (T, S, R) {
                if (R) {
                    T.setRequestHeader("X-Requested-With", "XMLHttpRequest")
                } else {
                    if (S.withCredentials) {
                        T.withCredentials = true
                    }
                } if (h.isArray(S.requestHeaders)) {
                    h.each(S.requestHeaders, function (U, V) {
                        T.setRequestHeader(V[0], V[1])
                    })
                } else {
                    if (S.requestHeaders) {
                        h.each(S.requestHeaders, function (U, V) {
                            T.setRequestHeader(U, V)
                        })
                    }
                }
            }, F = function (S, T, R) {
                if (R) {
                    T.setRequestHeader("X-File-Name", unescape(encodeURIComponent(S.name)))
                }
                T.setRequestHeader("Content-Type", S.type);
                T.send(S)
            }, r = function (T, V, S) {
                var U = new FormData(),
                    R;
                h.each(G(S), function (W, X) {
                    U.append(X.name, X.value)
                });
                for (R = 0; R < T.length; R += 1) {
                    U.append(v(S), T[R])
                }
                V.send(U)
            }, t = function (S, T) {
                var R = new FileReader();
                R.onload = function (U) {
                    S.content = U.target.result;
                    T()
                };
                R.readAsBinaryString(S)
            }, A = function (X, T, S, R) {
                var V = "--",
                    W = "\r\n",
                    U = "";
                h.each(R, function (Y, Z) {
                    U += V + X + W + 'Content-Disposition: form-data; name="' + unescape(encodeURIComponent(Z.name)) + '"' + W + W + unescape(encodeURIComponent(Z.value)) + W
                });
                h.each(T, function (Y, Z) {
                    U += V + X + W + 'Content-Disposition: form-data; name="' + unescape(encodeURIComponent(S)) + '"; filename="' + unescape(encodeURIComponent(Z.name)) + '"' + W + "Content-Type: " + Z.type + W + W + Z.content + W
                });
                U += V + X + V + W;
                return U
            }, q = function (U, V, T) {
                var W = "----MultiPartFormBoundary" + (new Date()).getTime(),
                    R, S;
                V.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + W);
                R = new b(function () {
                    V.sendAsBinary(A(W, U, v(T), G(T)))
                }, U.length);
                for (S = 0; S < U.length; S += 1) {
                    t(U[S], R.complete)
                }
            }, M = function (W, T, X, U) {
                var S = K(U),
                    R = Q(S),
                    V;
                p(W, T, X, U);
                X.open(j(U), S, true);
                o(X, U, R);
                if (!U.multipart) {
                    F(W[T], X, R)
                } else {
                    if (typeof T === e) {
                        V = [W[T]]
                    } else {
                        V = W
                    } if (typeof FormData !== f) {
                        r(V, X, U)
                    } else {
                        if (typeof FileReader !== f) {
                            q(V, X, U)
                        } else {
                            h.error("Browser does neither support FormData nor FileReader interface")
                        }
                    }
                }
            }, N = function (W, V, S, U, T) {
                var X = new XMLHttpRequest(),
                    R = h.extend({}, L);
                R.fileInput = S;
                R.uploadForm = U;
                if (typeof R.initUpload === g) {
                    R.initUpload(W, V, T, X, R, function () {
                        M(V, T, X, R)
                    })
                } else {
                    M(V, T, X, R)
                }
            }, P = function (V, U, R, T) {
                var S;
                if (L.multiFileRequest) {
                    N(V, U, R, T)
                } else {
                    for (S = 0; S < U.length; S += 1) {
                        N(V, U, R, T, S)
                    }
                }
            }, n = function (R, T, S) {
                var U = G(S);
                T.find(":input").not(":disabled").attr("disabled", true).addClass(S.namespace + "_disabled");
                h.each(U, function (V, W) {
                    h('<input type="hidden"/>').attr("name", W.name).val(W.value).addClass(S.namespace + "_form_data").appendTo(T)
                });
                R.attr("name", v(S)).appendTo(T)
            }, D = function (R, T, S) {
                R.detach();
                T.find("." + S.namespace + "_disabled").removeAttr("disabled").removeClass(S.namespace + "_disabled");
                T.find("." + S.namespace + "_form_data").remove()
            }, J = function (R, X, V, U) {
                var S = X.attr("action"),
                    W = X.attr("method"),
                    T = X.attr("target");
                V.unbind("abort").bind("abort", function (Y) {
                    V.readyState = 0;
                    V.unbind("load").attr("src", "javascript".concat(":false;"));
                    if (typeof U.onAbort === g) {
                        U.onAbort(Y, [{
                            name: R.val(),
                            type: null,
                            size: null
                        }
                        ], 0, V, U)
                    }
                }).unbind("load").bind("load", function (Y) {
                        V.readyState = 4;
                        if (typeof U.onLoad === g) {
                            U.onLoad(Y, [{
                                name: R.val(),
                                type: null,
                                size: null
                            }
                            ], 0, V, U)
                        }
                        h('<iframe src="javascript:false;" style="display:none"></iframe>').appendTo(X).remove()
                    });
                X.attr("action", K(U)).attr("method", j(U)).attr("target", V.attr("name"));
                n(R, X, U);
                V.readyState = 2;
                X.get(0).submit();
                D(R, X, U);
                X.attr("action", S).attr("method", W).attr("target", T)
            }, E = function (V, S, U) {
                var T = h('<iframe src="javascript:false;" style="display:none" name="iframe_' + L.namespace + "_" + (new Date()).getTime() + '"></iframe>'),
                    R = h.extend({}, L);
                R.fileInput = S;
                R.uploadForm = U;
                T.readyState = 0;
                T.abort = function () {
                    T.trigger("abort")
                };
                T.bind("load", function () {
                    T.unbind("load");
                    if (typeof R.initUpload === g) {
                        R.initUpload(V, [{
                            name: S.val(),
                            type: null,
                            size: null
                        }
                        ], 0, T, R, function () {
                            J(S, U, T, R)
                        })
                    } else {
                        J(S, U, T, R)
                    }
                }).appendTo(U)
            }, I = function () {
                u = (B.is("form") ? B : B.find("form")).filter(L.uploadFormFilter)
            }, s = function () {
                m = u.find("input:file").filter(L.fileInputFilter)
            }, C = function (R) {
                var S = R.clone(true);
                h("<form/>").append(S).get(0).reset();
                R.after(S).detach();
                s()
            };
        this.onDocumentDragOver = function (R) {
            if (typeof L.onDocumentDragOver === g && L.onDocumentDragOver(R) === false) {
                return false
            }
            R.preventDefault()
        };
        this.onDocumentDrop = function (R) {
            if (typeof L.onDocumentDrop === g && L.onDocumentDrop(R) === false) {
                return false
            }
            R.preventDefault()
        };
        this.onDragOver = function (S) {
            if (typeof L.onDragOver === g && L.onDragOver(S) === false) {
                return false
            }
            var R = S.originalEvent.dataTransfer;
            if (R && R.files) {
                R.dropEffect = R.effectAllowed = "copy";
                S.preventDefault()
            }
        };
        this.onDrop = function (S) {
            if (typeof L.onDrop === g && L.onDrop(S) === false) {
                return false
            }
            var R = S.originalEvent.dataTransfer;
            if (R && R.files && x()) {
                P(S, R.files)
            }
            S.preventDefault()
        };
        this.onChange = function (T) {
            if (typeof L.onChange === g && L.onChange(T) === false) {
                return false
            }
            var R = h(T.target),
                S = h(T.target.form);
            if (S.length === 1) {
                R.data(c + "_form", S);
                C(R)
            } else {
                S = R.data(c + "_form")
            } if (!L.forceIframeUpload && T.target.files && x()) {
                P(T, T.target.files, R, S)
            } else {
                E(T, R, S)
            }
        };
        this.init = function (R) {
            if (R) {
                h.extend(L, R);
                y = R
            }
            I();
            s();
            if (B.data(L.namespace)) {
                h.error('FileUpload with namespace "' + L.namespace + '" already assigned to this element');
                return
            }
            B.data(L.namespace, z).addClass(L.cssClass);
            L.dropZone.not(B).addClass(L.cssClass);
            H()
        };
        this.options = function (T) {
            var V, S, U, R;
            if (typeof T === f) {
                return h.extend({}, L)
            }
            if (y) {
                h.extend(y, T)
            }
            k();
            h.each(T, function (W, X) {
                switch (W) {
                    case "namespace":
                        h.error("The FileUpload namespace cannot be updated.");
                        return;
                    case "uploadFormFilter":
                        U = true;
                        R = true;
                        break;
                    case "fileInputFilter":
                        R = true;
                        break;
                    case "cssClass":
                        V = L.cssClass;
                        break;
                    case "dropZone":
                        S = L.dropZone;
                        break
                }
                L[W] = X
            });
            if (U) {
                I()
            }
            if (R) {
                s()
            }
            if (typeof V !== f) {
                B.removeClass(V).addClass(L.cssClass);
                (S ? S : L.dropZone).not(B).removeClass(V);
                L.dropZone.not(B).addClass(L.cssClass)
            } else {
                if (S) {
                    S.not(B).removeClass(L.cssClass);
                    L.dropZone.not(B).addClass(L.cssClass)
                }
            }
            H()
        };
        this.option = function (S, T) {
            var R;
            if (typeof T === f) {
                return L[S]
            }
            R = {};
            R[S] = T;
            z.options(R)
        };
        this.destroy = function () {
            k();
            B.removeData(L.namespace).removeClass(L.cssClass);
            L.dropZone.not(B).removeClass(L.cssClass)
        }
    };
    d = {
        init: function (j) {
            return this.each(function () {
                (new a(h(this))).init(j)
            })
        },
        option: function (l, m, k) {
            k = k ? k : c;
            var j = h(this).data(k);
            if (j) {
                if (typeof l === "string") {
                    return j.option(l, m)
                }
                return j.options(l)
            } else {
                h.error('No FileUpload with namespace "' + k + '" assigned to this element')
            }
        },
        destroy: function (j) {
            j = j ? j : c;
            return this.each(function () {
                var k = h(this).data(j);
                if (k) {
                    k.destroy()
                } else {
                    h.error('No FileUpload with namespace "' + j + '" assigned to this element')
                }
            })
        }
    };
    h.fn.fileUpload = function (j) {
        if (d[j]) {
            return d[j].apply(this, Array.prototype.slice.call(arguments, 1))
        } else {
            if (typeof j === "object" || !j) {
                return d.init.apply(this, arguments)
            } else {
                h.error("Method " + j + " does not exist on jQuery.fileUpload")
            }
        }
    }
}(jQuery));
if (!this.JSON) {
    this.JSON = {}
}(function () {
    function f(n) {
        return n < 10 ? "0" + n : n
    }
    if (typeof Date.prototype.toJSON !== "function") {
        Date.prototype.toJSON = function (key) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (key) {
            return this.valueOf()
        }
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap, indent, meta = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        }, rep;

    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + string + '"'
    }

    function str(key, holder) {
        var i, k, v, length, mind = gap,
            partial, value = holder[key];
        if (value && typeof value === "object" && typeof value.toJSON === "function") {
            value = value.toJSON(key)
        }
        if (typeof rep === "function") {
            value = rep.call(holder, key, value)
        }
        switch (typeof value) {
            case "string":
                return quote(value);
            case "number":
                return isFinite(value) ? String(value) : "null";
            case "boolean":
            case "null":
                return String(value);
            case "object":
                if (!value) {
                    return "null"
                }
                gap += indent;
                partial = [];
                if (Object.prototype.toString.apply(value) === "[object Array]") {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || "null"
                    }
                    v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                    gap = mind;
                    return v
                }
                if (rep && typeof rep === "object") {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === "string") {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v)
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v)
                            }
                        }
                    }
                }
                v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
                gap = mind;
                return v
        }
    }
    if (typeof JSON.stringify !== "function") {
        JSON.stringify = function (value, replacer, space) {
            var i;
            gap = "";
            indent = "";
            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " "
                }
            } else {
                if (typeof space === "string") {
                    indent = space
                }
            }
            rep = replacer;
            if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify")
            }
            return str("", {
                "": value
            })
        }
    }
    if (typeof JSON.parse !== "function") {
        JSON.parse = function (text, reviver) {
            var j;

            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v
                            } else {
                                delete value[k]
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value)
            }
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                })
            }
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                j = eval("(" + text + ")");
                return typeof reviver === "function" ? walk({
                    "": j
                }, "") : j
            }
            throw new SyntaxError("JSON.parse")
        }
    }
}());

/* vs stand for visual search */
(function () {
    var a = jQuery;
    if (!window.VS) {
        window.VS = {}
    }
    if (!VS.app) {
        VS.app = {}
    }
    if (!VS.ui) {
        VS.ui = {}
    }
    if (!VS.model) {
        VS.model = {}
    }
    if (!VS.utils) {
        VS.utils = {}
    }
    VS.VERSION = "0.1.0";
    VS.init = function (b) {
        var c = {
            container: "",
            query: "",
            unquotable: [],
            callbacks: {
                search: a.noop,
                focus: a.noop,
                facetMatches: a.noop,
                valueMatches: a.noop
            }
        };
        VS.options = _.extend({}, c, b);
        VS.options.callbacks = _.extend({}, c.callbacks, b.callbacks);
        VS.app.hotkeys.initialize();
        VS.app.searchQuery = new VS.model.SearchQuery();
        VS.app.searchBox = new VS.ui.SearchBox(b);
        if (b.container) {
            var d = VS.app.searchBox.render().el;
            a(b.container).html(d)
        }
        VS.app.searchBox.value(b.query || "");
        a(window).bind("unload", function (f) {});
        return VS.app.searchBox
    }
})();

(function () {
    var a = jQuery;
    VS.ui.SearchBox = Backbone.View.extend({
        id: "search",
        events: {
            "click .VS-cancel-search-box": "clearSearch",
            "mousedown .VS-search-box": "maybeFocusSearch",
            "dblclick .VS-search-box": "highlightSearch",
            "click .VS-search-box": "maybeTripleClick"
        },
        initialize: function () {
            this.flags = {
                allSelected: false
            };
            this.facetViews = [];
            this.inputViews = [];
            _.bindAll(this, "renderFacets", "_maybeDisableFacets", "disableFacets", "deselectAllFacets");
            VS.app.searchQuery.bind("reset", this.renderFacets);
            a(document).bind("keydown", this._maybeDisableFacets)
        },
        render: function () {
            a(this.el).append(JST.search_box({}));
            a(document.body).setMode("no", "search");
            return this
        },
        value: function (b) {
            if (b == null) {
                return this.getQuery()
            }
            return this.setQuery(b)
        },
        getQuery: function () {
            var c = [];
            var b = this.inputViews.length;
            VS.app.searchQuery.each(_.bind(function (e, d) {
                c.push(this.inputViews[d].value());
                c.push(e.serialize())
            }, this));
            if (b) {
                c.push(this.inputViews[b - 1].value())
            }
            return _.compact(c).join(" ")
        },
        setQuery: function (b) {
            this.currentQuery = b;
            VS.app.SearchParser.parse(b)
        },
        viewPosition: function (d) {
            var c = d.type == "facet" ? this.facetViews : this.inputViews;
            var b = _.indexOf(c, d);
            if (b == -1) {
                b = 0
            }
            return b
        },
        searchEvent: function (c) {
            var b = this.value();
            this.focusSearch(c);
            if (VS.options.callbacks.search(b) !== false) {
                this.value(b)
            }
        },
        addFacet: function (e, c, b) {
            e = VS.utils.inflector.trim(e);
            c = VS.utils.inflector.trim(c || "");
            if (!e) {
                return
            }
            var d = new VS.model.SearchFacet({
                category: e,
                value: c || ""
            });
            VS.app.searchQuery.add(d, {
                at: b
            });
            this.renderFacets();
            var f = _.detect(this.facetViews, function (g) {
                if (g.model == d) {
                    return true
                }
            });
            _.defer(function () {
                f.enableEdit()
            })
        },
        renderFacets: function () {
            this.facetViews = [];
            this.inputViews = [];
            this.$(".VS-search-inner").empty();
            VS.app.searchQuery.each(_.bind(function (c, b) {
                this.renderFacet(c, b)
            }, this));
            this.renderSearchInput()
        },
        renderFacet: function (d, b) {
            var c = new VS.ui.SearchFacet({
                model: d,
                order: b
            });
            this.renderSearchInput();
            this.facetViews.push(c);
            this.$(".VS-search-inner").children().eq(b * 2).after(c.render().el);
            c.calculateSize();
            _.defer(_.bind(c.calculateSize, c));
            return c
        },
        renderSearchInput: function () {
            var b = new VS.ui.SearchInput({
                position: this.inputViews.length
            });
            this.$(".VS-search-inner").append(b.render().el);
            this.inputViews.push(b)
        },
        clearSearch: function (b) {
            this.disableFacets();
            this.value("");
            this.flags.allSelected = false;
            this.focusSearch(b)
        },
        selectAllFacets: function () {
            this.flags.allSelected = true;
            a(document).one("click.selectAllFacets", this.deselectAllFacets);
            _.each(this.facetViews, function (c, b) {
                c.selectFacet()
            });
            _.each(this.inputViews, function (b, c) {
                b.selectText()
            })
        },
        allSelected: function (b) {
            if (b) {
                this.flags.allSelected = false
            }
            return this.flags.allSelected
        },
        deselectAllFacets: function (d) {
            this.disableFacets();
            if (this.$(d.target).is(".category,input")) {
                var c = a(d.target).closest(".search_facet,.search_input");
                var b = _.detect(this.facetViews.concat(this.inputViews), function (e) {
                    return e.setElement(c[0])
                });
                if (b.type == "facet") {
                    b.selectFacet()
                } else {
                    if (b.type == "input") {
                        _.defer(function () {
                            b.enableEdit(true)
                        })
                    }
                }
            }
        },
        disableFacets: function (b) {
            _.each(this.inputViews, function (c) {
                if (c && c != b && (c.modes.editing == "is" || c.modes.selected == "is")) {
                    c.disableEdit()
                }
            });
            _.each(this.facetViews, function (c) {
                if (c && c != b && (c.modes.editing == "is" || c.modes.selected == "is")) {
                    c.disableEdit();
                    c.deselectFacet()
                }
            });
            this.flags.allSelected = false;
            this.removeFocus();
            a(document).unbind("click.selectAllFacets")
        },
        resizeFacets: function (b) {
            _.each(this.facetViews, function (d, c) {
                if (!b || d == b) {
                    d.resize()
                }
            })
        },
        _maybeDisableFacets: function (b) {
            if (this.flags.allSelected && VS.app.hotkeys.key(b) == "backspace") {
                b.preventDefault();
                this.clearSearch(b);
                return false
            } else {
                if (this.flags.allSelected && VS.app.hotkeys.printable(b)) {
                    this.clearSearch(b)
                }
            }
        },
        focusNextFacet: function (h, g, d) {
            d = d || {};
            var f = this.facetViews.length;
            var c = d.viewPosition || this.viewPosition(h);
            if (!d.skipToFacet) {
                if (h.type == "text" && g > 0) {
                    g -= 1
                }
                if (h.type == "facet" && g < 0) {
                    g += 1
                }
            } else {
                if (d.skipToFacet && h.type == "text" && f == c && g >= 0) {
                    c = 0;
                    g = 0
                }
            }
            var b, e = Math.min(f, c + g);
            if (h.type == "text") {
                if (e >= 0 && e < f) {
                    b = this.facetViews[e]
                } else {
                    if (e == f) {
                        b = this.inputViews[this.inputViews.length - 1]
                    }
                } if (b && d.selectFacet && b.type == "facet") {
                    b.selectFacet()
                } else {
                    if (b) {
                        b.enableEdit();
                        b.setCursorAtEnd(g || d.startAtEnd)
                    }
                }
            } else {
                if (h.type == "facet") {
                    if (d.skipToFacet) {
                        if (e >= f || e < 0) {
                            b = _.last(this.inputViews);
                            b.enableEdit()
                        } else {
                            b = this.facetViews[e];
                            b.enableEdit();
                            b.setCursorAtEnd(g || d.startAtEnd)
                        }
                    } else {
                        b = this.inputViews[e];
                        b.enableEdit()
                    }
                }
            } if (d.selectText) {
                b.selectText()
            }
            this.resizeFacets()
        },
        maybeFocusSearch: function (b) {
            if (a(b.target).is(".VS-search-box") || a(b.target).is(".VS-search-inner") || b.type == "keydown") {
                this.focusSearch(b)
            }
        },
        focusSearch: function (d, c) {
            var b = this.inputViews[this.inputViews.length - 1];
            b.enableEdit(c);
            if (!c) {
                b.setCursorAtEnd(-1)
            }
            if (d.type == "keydown") {
                b.keydown(d);
                b.box.trigger("keydown")
            }
            _.defer(_.bind(function () {
                if (!this.$("input:focus").length) {
                    b.enableEdit(c)
                }
            }, this))
        },
        highlightSearch: function (c) {
            if (a(c.target).is(".VS-search-box") || a(c.target).is(".VS-search-inner") || c.type == "keydown") {
                var b = this.inputViews[this.inputViews.length - 1];
                b.startTripleClickTimer();
                this.focusSearch(c, true)
            }
        },
        maybeTripleClick: function (c) {
            var b = this.inputViews[this.inputViews.length - 1];
            return b.maybeTripleClick(c)
        },
        addFocus: function () {
            VS.options.callbacks.focus();
            this.$(".VS-search-box").addClass("VS-focus")
        },
        removeFocus: function () {
            var b = _.any(this.facetViews.concat(this.inputViews), function (c) {
                return c.isFocused()
            });
            if (!b) {
                this.$(".VS-search-box").removeClass("VS-focus")
            }
        },
        showFacetCategoryMenu: function (c) {
            c.preventDefault();
            c.stopPropagation();
            if (this.facetCategoryMenu && this.facetCategoryMenu.modes.open == "is") {
                return this.facetCategoryMenu.close()
            }
            var b = [{
                title: "Account",
                onClick: _.bind(this.addFacet, this, "account", "")
            }, {
                title: "Project",
                onClick: _.bind(this.addFacet, this, "project", "")
            }, {
                title: "Filter",
                onClick: _.bind(this.addFacet, this, "filter", "")
            }, {
                title: "Access",
                onClick: _.bind(this.addFacet, this, "access", "")
            }
            ];
            var d = this.facetCategoryMenu || (this.facetCategoryMenu = new dc.ui.Menu({
                items: b,
                standalone: true
            }));
            this.$(".VS-icon-search").after(d.render().open().content);
            return false
        }
    })
})();
(function () {
    var a = jQuery;
    VS.ui.SearchFacet = Backbone.View.extend({
        type: "facet",
        className: "search_facet",
        events: {
            "click .category": "selectFacet",
            "keydown input": "keydown",
            "mousedown input": "enableEdit",
            "mouseover .VS-icon-cancel": "showDelete",
            "mouseout .VS-icon-cancel": "hideDelete",
            "click .VS-icon-cancel": "remove"
        },
        initialize: function (b) {
            this.flags = {
                canClose: false
            };
            _.bindAll(this, "set", "keydown", "deselectFacet", "deferDisableEdit")
        },
        render: function () {
            a(this.el).html(JST.search_facet({
                model: this.model
            }));
            this.setMode("not", "editing");
            this.setMode("not", "selected");
            this.box = this.$("input");
            this.box.val(this.model.get("value"));
            this.box.bind("blur", this.deferDisableEdit);
            this.setupAutocomplete();
            return this
        },
        calculateSize: function () {
            this.box.autoGrowInput();
            this.box.unbind("updated.autogrow");
            this.box.bind("updated.autogrow", _.bind(this.moveAutocomplete, this))
        },
        resize: function (b) {
            this.box.trigger("resize.autogrow", b)
        },
        setupAutocomplete: function () {
            this.box.autocomplete({
                source: _.bind(this.autocompleteValues, this),
                minLength: 0,
                delay: 0,
                autoFocus: true,
                position: {
                    offset: "0 5"
                },
                select: _.bind(function (d, c) {
                    d.preventDefault();
                    var b = this.model.get("value");
                    this.set(c.item.value);
                    if (b != c.item.value || this.box.val() != c.item.value) {
                        this.search(d)
                    }
                    return false
                }, this)
            });
            this.box.autocomplete("widget").addClass("VS-interface")
        },
        moveAutocomplete: function () {
            var b = this.box.data("autocomplete");
            if (b) {
                b.menu.element.position({
                    my: "left top",
                    at: "left bottom",
                    of: this.box.data("autocomplete").element,
                    collision: "flip",
                    offset: "0 5"
                })
            }
        },
        searchAutocomplete: function (c) {
            var b = this.box.data("autocomplete");
            if (b) {
                var d = b.menu.element;
                b.search();
                d.outerWidth(Math.max(d.width("").outerWidth(), b.element.outerWidth()))
            }
        },
        closeAutocomplete: function () {
            var b = this.box.data("autocomplete");
            if (b) {
                b.close()
            }
        },
        autocompleteValues: function (d, f) {
            var c = this.model.get("category");
            var e = this.model.get("value");
            var b = d.term;
            VS.options.callbacks.valueMatches(c, b, function (h) {
                h = h || [];
                if (b && e != b) {
                    var g = VS.utils.inflector.escapeRegExp(b || "");
                    var j = new RegExp("\\b" + g, "i");
                    h = a.grep(h, function (k) {
                        return j.test(k) || j.test(k.value) || j.test(k.label)
                    })
                }
                f(_.sortBy(h, function (k) {
                    if (k == e || k.value == e) {
                        return ""
                    } else {
                        return k
                    }
                }))
            })
        },
        set: function (b) {
            if (!b) {
                return
            }
            this.model.set({
                value: b
            })
        },
        search: function (c, b) {
            if (!b) {
                b = 1
            }
            this.closeAutocomplete();
            VS.app.searchBox.searchEvent(c);
            _.defer(_.bind(function () {
                VS.app.searchBox.focusNextFacet(this, b, {
                    viewPosition: this.options.order
                })
            }, this))
        },
        enableEdit: function () {
            if (this.modes.editing != "is") {
                this.setMode("is", "editing");
                this.deselectFacet();
                if (this.box.val() == "") {
                    this.box.val(this.model.get("value"))
                }
            }
            this.flags.canClose = false;
            VS.app.searchBox.disableFacets(this);
            VS.app.searchBox.addFocus();
            _.defer(function () {
                VS.app.searchBox.addFocus()
            });
            this.resize();
            this.searchAutocomplete();
            this.box.focus()
        },
        deferDisableEdit: function () {
            this.flags.canClose = true;
            _.delay(_.bind(function () {
                if (this.flags.canClose && !this.box.is(":focus") && this.modes.editing == "is" && this.modes.selected != "is") {
                    this.disableEdit()
                }
            }, this), 250)
        },
        disableEdit: function () {
            var b = VS.utils.inflector.trim(this.box.val());
            if (b != this.model.get("value")) {
                this.set(b)
            }
            this.flags.canClose = false;
            this.box.selectRange(0, 0);
            this.box.blur();
            this.setMode("not", "editing");
            this.closeAutocomplete();
            VS.app.searchBox.removeFocus()
        },
        selectFacet: function (c) {
            if (c) {
                c.preventDefault()
            }
            var b = VS.app.searchBox.allSelected();
            if (this.modes.selected == "is") {
                return
            }
            if (this.box.is(":focus")) {
                this.box.setCursorPosition(0);
                this.box.blur()
            }
            this.flags.canClose = false;
            this.closeAutocomplete();
            this.setMode("is", "selected");
            this.setMode("not", "editing");
            if (!b || c) {
                a(document).unbind("keydown.facet", this.keydown);
                a(document).unbind("click.facet", this.deselectFacet);
                _.defer(_.bind(function () {
                    a(document).unbind("keydown.facet").bind("keydown.facet", this.keydown);
                    a(document).unbind("click.facet").one("click.facet", this.deselectFacet)
                }, this));
                VS.app.searchBox.disableFacets(this);
                VS.app.searchBox.addFocus()
            }
            return false
        },
        deselectFacet: function (b) {
            if (b) {
                b.preventDefault()
            }
            if (this.modes.selected == "is") {
                this.setMode("not", "selected");
                this.closeAutocomplete();
                VS.app.searchBox.removeFocus()
            }
            a(document).unbind("keydown.facet", this.keydown);
            a(document).unbind("click.facet", this.deselectFacet);
            return false
        },
        isFocused: function () {
            return this.box.is(":focus")
        },
        showDelete: function () {
            a(this.el).addClass("search_facet_maybe_delete")
        },
        hideDelete: function () {
            a(this.el).removeClass("search_facet_maybe_delete")
        },
        setCursorAtEnd: function (b) {
            if (b == -1) {
                this.box.setCursorPosition(this.box.val().length)
            } else {
                this.box.setCursorPosition(0)
            }
        },
        remove: function (c) {
            var b = this.model.get("value");
            this.deselectFacet();
            this.disableEdit();
            VS.app.searchQuery.remove(this.model);
            if (b) {
                this.search(c, -1)
            } else {
                VS.app.searchBox.renderFacets();
                VS.app.searchBox.focusNextFacet(this, -1, {
                    viewPosition: this.options.order
                })
            }
        },
        selectText: function () {
            this.box.selectRange(0, this.box.val().length)
        },
        keydown: function (c) {
            var b = VS.app.hotkeys.key(c);
            if (b == "enter" && this.box.val()) {
                this.disableEdit();
                this.search(c)
            } else {
                if (b == "left") {
                    if (this.modes.selected == "is") {
                        this.deselectFacet();
                        VS.app.searchBox.focusNextFacet(this, -1, {
                            startAtEnd: -1
                        })
                    } else {
                        if (this.box.getCursorPosition() == 0 && !this.box.getSelection().length) {
                            this.selectFacet()
                        }
                    }
                } else {
                    if (b == "right") {
                        if (this.modes.selected == "is") {
                            c.preventDefault();
                            this.deselectFacet();
                            this.setCursorAtEnd(0);
                            this.enableEdit()
                        } else {
                            if (this.box.getCursorPosition() == this.box.val().length) {
                                c.preventDefault();
                                this.disableEdit();
                                VS.app.searchBox.focusNextFacet(this, 1)
                            }
                        }
                    } else {
                        if (VS.app.hotkeys.shift && b == "tab") {
                            c.preventDefault();
                            VS.app.searchBox.focusNextFacet(this, -1, {
                                startAtEnd: -1,
                                skipToFacet: true,
                                selectText: true
                            })
                        } else {
                            if (b == "tab") {
                                c.preventDefault();
                                VS.app.searchBox.focusNextFacet(this, 1, {
                                    skipToFacet: true,
                                    selectText: true
                                })
                            } else {
                                if (VS.app.hotkeys.command && (c.which == 97 || c.which == 65)) {
                                    c.preventDefault();
                                    VS.app.searchBox.selectAllFacets();
                                    return false
                                } else {
                                    if (VS.app.hotkeys.printable(c) && this.modes.selected == "is") {
                                        VS.app.searchBox.focusNextFacet(this, -1, {
                                            startAtEnd: -1
                                        });
                                        this.remove(c)
                                    } else {
                                        if (b == "backspace") {
                                            if (this.modes.selected == "is") {
                                                c.preventDefault();
                                                this.remove(c)
                                            } else {
                                                if (this.box.getCursorPosition() == 0 && !this.box.getSelection().length) {
                                                    c.preventDefault();
                                                    this.selectFacet()
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            this.resize(c)
        }
    })
})();
(function () {
    var a = jQuery;
    VS.ui.SearchInput = Backbone.View.extend({
        type: "text",
        className: "search_input",
        events: {
            "keypress input": "keypress",
            "keydown input": "keydown",
            "click input": "maybeTripleClick",
            "dblclick input": "startTripleClickTimer"
        },
        initialize: function () {
            this.flags = {
                canClose: false
            };
            _.bindAll(this, "removeFocus", "addFocus", "moveAutocomplete", "deferDisableEdit")
        },
        render: function () {
            a(this.el).html(JST.search_input({}));
            this.setMode("not", "editing");
            this.setMode("not", "selected");
            this.box = this.$("input");
            this.box.autoGrowInput();
            this.box.bind("updated.autogrow", this.moveAutocomplete);
            this.box.bind("blur", this.deferDisableEdit);
            this.box.bind("focus", this.addFocus);
            this.setupAutocomplete();
            return this
        },
        setupAutocomplete: function () {
            this.box.autocomplete({
                minLength: 1,
                delay: 50,
                autoFocus: true,
                position: {
                    offset: "0 -1"
                },
                source: _.bind(this.autocompleteValues, this),
                select: _.bind(function (f, d) {
                    f.preventDefault();
                    f.stopPropagation();
                    var c = this.addTextFacetRemainder(d.item.value);
                    var b = this.options.position + (c ? 1 : 0);
                    VS.app.searchBox.addFacet(d.item.value, "", b);
                    return false
                }, this)
            });
            this.box.data("autocomplete")._renderMenu = function (c, b) {
                var d = "";
                _.each(b, _.bind(function (f, e) {
                    if (f.category && f.category != d) {
                        c.append('<li class="ui-autocomplete-category">' + f.category + "</li>");
                        d = f.category
                    }
                    this._renderItem(c, f)
                }, this))
            };
            this.box.autocomplete("widget").addClass("VS-interface")
        },
        autocompleteValues: function (d, f) {
            var b = d.term;
            var e = b.match(/\w+$/);
            var c = VS.utils.inflector.escapeRegExp(e && e[0] || " ");
            VS.options.callbacks.facetMatches(function (h) {
                h = h || [];
                var j = new RegExp("^" + c, "i");
                var g = a.grep(h, function (k) {
                    return k && j.test(k.label || k)
                });
                f(_.sortBy(g, function (k) {
                    if (k.label) {
                        return k.category + "-" + k.label
                    } else {
                        return k
                    }
                }))
            })
        },
        closeAutocomplete: function () {
            var b = this.box.data("autocomplete");
            if (b) {
                b.close()
            }
        },
        moveAutocomplete: function () {
            var b = this.box.data("autocomplete");
            if (b) {
                b.menu.element.position({
                    my: "left top",
                    at: "left bottom",
                    of: this.box.data("autocomplete").element,
                    collision: "none",
                    offset: "0 -1"
                })
            }
        },
        searchAutocomplete: function (c) {
            var b = this.box.data("autocomplete");
            if (b) {
                var d = b.menu.element;
                b.search();
                d.outerWidth(Math.max(d.width("").outerWidth(), b.element.outerWidth()))
            }
        },
        addTextFacetRemainder: function (e) {
            var d = this.box.val();
            var c = d.match(/\b(\w+)$/);
            var b = new RegExp(c[0], "i");
            if (c && e.search(b) == 0) {
                d = d.replace(/\b(\w+)$/, "")
            }
            d = d.replace("^s+|s+$", "");
            if (d) {
                VS.app.searchBox.addFacet("text", d, this.options.position)
            }
            return d
        },
        enableEdit: function (b) {
            this.addFocus();
            if (b) {
                this.selectText()
            }
            this.box.focus()
        },
        addFocus: function () {
            this.flags.canClose = false;
            if (!VS.app.searchBox.allSelected()) {
                VS.app.searchBox.disableFacets(this)
            }
            VS.app.searchBox.addFocus();
            this.setMode("is", "editing");
            this.setMode("not", "selected");
            this.searchAutocomplete()
        },
        disableEdit: function () {
            this.box.blur();
            this.removeFocus()
        },
        removeFocus: function () {
            this.flags.canClose = false;
            VS.app.searchBox.removeFocus();
            this.setMode("not", "editing");
            this.setMode("not", "selected");
            this.closeAutocomplete()
        },
        deferDisableEdit: function () {
            this.flags.canClose = true;
            _.delay(_.bind(function () {
                if (this.flags.canClose && !this.box.is(":focus") && this.modes.editing == "is") {
                    this.disableEdit()
                }
            }, this), 250)
        },
        startTripleClickTimer: function () {
            this.tripleClickTimer = setTimeout(_.bind(function () {
                this.tripleClickTimer = null
            }, this), 500)
        },
        maybeTripleClick: function (b) {
            if ( !! this.tripleClickTimer) {
                b.preventDefault();
                VS.app.searchBox.selectAllFacets();
                return false
            }
        },
        isFocused: function () {
            return this.box.is(":focus")
        },
        value: function () {
            return this.box.val()
        },
        setCursorAtEnd: function (b) {
            if (b == -1) {
                this.box.setCursorPosition(this.box.val().length)
            } else {
                this.box.setCursorPosition(0)
            }
        },
        selectText: function () {
            this.box.selectRange(0, this.box.val().length);
            if (!VS.app.searchBox.allSelected()) {
                this.box.focus()
            } else {
                this.setMode("is", "selected")
            }
        },
        search: function (c, b) {
            if (!b) {
                b = 0
            }
            this.closeAutocomplete();
            VS.app.searchBox.searchEvent(c);
            _.defer(_.bind(function () {
                VS.app.searchBox.focusNextFacet(this, b)
            }, this))
        },
        keypress: function (h) {
            var c = VS.app.hotkeys.key(h);
            if (c == "enter") {
                return this.search(h, 100)
            } else {
                if (VS.app.hotkeys.colon(h)) {
                    this.box.trigger("resize.autogrow", h);
                    var g = this.box.val();
                    var f = VS.options.callbacks.facetMatches() || [];
                    var j = _.map(f, function (e) {
                        if (e.label) {
                            return e.label
                        } else {
                            return e
                        }
                    });
                    if (_.contains(j, g)) {
                        h.preventDefault();
                        var d = this.addTextFacetRemainder(g);
                        var b = this.options.position + (d ? 1 : 0);
                        VS.app.searchBox.addFacet(g, "", b);
                        return false
                    }
                } else {
                    if (c == "backspace") {
                        if (this.box.getCursorPosition() == 0 && !this.box.getSelection().length) {
                            h.preventDefault();
                            h.stopPropagation();
                            h.stopImmediatePropagation();
                            VS.app.searchBox.resizeFacets();
                            return false
                        }
                    }
                }
            }
        },
        keydown: function (g) {
            var c = VS.app.hotkeys.key(g);
            if (c == "left") {
                if (this.box.getCursorPosition() == 0) {
                    g.preventDefault();
                    VS.app.searchBox.focusNextFacet(this, -1, {
                        startAtEnd: -1
                    })
                }
            } else {
                if (c == "right") {
                    if (this.box.getCursorPosition() == this.box.val().length) {
                        g.preventDefault();
                        VS.app.searchBox.focusNextFacet(this, 1, {
                            selectFacet: true
                        })
                    }
                } else {
                    if (VS.app.hotkeys.shift && c == "tab") {
                        g.preventDefault();
                        VS.app.searchBox.focusNextFacet(this, -1, {
                            selectText: true
                        })
                    } else {
                        if (c == "tab") {
                            g.preventDefault();
                            var f = this.box.val();
                            if (f.length) {
                                var d = this.addTextFacetRemainder(f);
                                var b = this.options.position + (d ? 1 : 0);
                                VS.app.searchBox.addFacet(f, "", b)
                            } else {
                                VS.app.searchBox.focusNextFacet(this, 0, {
                                    skipToFacet: true,
                                    selectText: true
                                })
                            }
                        } else {
                            if (VS.app.hotkeys.command && String.fromCharCode(g.which).toLowerCase() == "a") {
                                g.preventDefault();
                                VS.app.searchBox.selectAllFacets();
                                return false
                            } else {
                                if (c == "backspace" && !VS.app.searchBox.allSelected()) {
                                    if (this.box.getCursorPosition() == 0 && !this.box.getSelection().length) {
                                        g.preventDefault();
                                        VS.app.searchBox.focusNextFacet(this, -1, {
                                            backspace: true
                                        });
                                        return false
                                    }
                                }
                            }
                        }
                    }
                }
            }
            this.box.trigger("resize.autogrow", g)
        }
    })
})();
(function () {
    var a = jQuery;
    Backbone.View.prototype.setMode = function (c, b) {
        this.modes || (this.modes = {});
        if (this.modes[b] === c) {
            return
        }
        a(this.el).setMode(c, b);
        this.modes[b] = c
    }
})();
(function () {
    var a = jQuery;
    VS.app.hotkeys = {
        KEYS: {
            "16": "shift",
            "17": "command",
            "91": "command",
            "93": "command",
            "224": "command",
            "13": "enter",
            "37": "left",
            "38": "upArrow",
            "39": "right",
            "40": "downArrow",
            "46": "delete",
            "8": "backspace",
            "9": "tab",
            "188": "comma"
        },
        initialize: function () {
            _.bindAll(this, "down", "up", "blur");
            a(document).bind("keydown", this.down);
            a(document).bind("keyup", this.up);
            a(window).bind("blur", this.blur)
        },
        down: function (c) {
            var b = this.KEYS[c.which];
            if (b) {
                this[b] = true
            }
        },
        up: function (c) {
            var b = this.KEYS[c.which];
            if (b) {
                this[b] = false
            }
        },
        blur: function (c) {
            for (var b in this.KEYS) {
                this[this.KEYS[b]] = false
            }
        },
        key: function (b) {
            return this.KEYS[b.which]
        },
        colon: function (c) {
            var b = c.which;
            return b && String.fromCharCode(b) == ":"
        },
        printable: function (c) {
            var b = c.which;
            if (c.type == "keydown") {
                if (b == 32 || (b >= 48 && b <= 90) || (b >= 96 && b <= 111) || (b >= 186 && b <= 192) || (b >= 219 && b <= 222)) {
                    return true
                }
            } else {
                if ((b >= 32 && b <= 126) || (b >= 160 && b <= 500) || (String.fromCharCode(b) == ":")) {
                    return true
                }
            }
            return false
        }
    }
})();
(function () {
    var a = jQuery;
    VS.utils.inflector = {
        trim: function (b) {
            return b.trim ? b.trim() : b.replace(/^\s+|\s+$/g, "")
        },
        escapeRegExp: function (b) {
            return b.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1")
        }
    }
})();
(function () {
    var b = jQuery;
    b.fn.extend({
        setMode: function (d, e) {
            e = e || "mode";
            var c = new RegExp("\\w+_" + e + "(\\s|$)", "g");
            var f = (d === null) ? "" : d + "_" + e;
            this.each(function () {
                this.className = (this.className.replace(c, "") + " " + f).replace(/\s\s/g, " ")
            });
            return f
        },
        autoGrowInput: function () {
            return this.each(function () {
                var e = b(this);
                var d = b("<div />").css({
                    opacity: 0,
                    top: -9999,
                    left: -9999,
                    position: "absolute",
                    whiteSpace: "nowrap"
                }).addClass("VS-input-width-tester").addClass("VS-interface");
                var c = "keydown.autogrow keypress.autogrow resize.autogrow change.autogrow";
                e.next(".VS-input-width-tester").remove();
                e.after(d);
                e.unbind(c).bind(c, function (h, j) {
                    if (j) {
                        h = j
                    }
                    var g = e.val();
                    if (VS.app.hotkeys.key(h) == "backspace") {
                        var f = e.getCursorPosition();
                        if (f > 0) {
                            g = g.slice(0, f - 1) + g.slice(f, g.length)
                        }
                    } else {
                        if (VS.app.hotkeys.printable(h) && !VS.app.hotkeys.command) {
                            g += String.fromCharCode(h.which)
                        }
                    }
                    g = g.replace(/&/g, "&amp;").replace(/\s/g, "&nbsp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    d.html(g);
                    e.width(d.width() + 3);
                    e.trigger("updated.autogrow")
                });
                e.trigger("resize.autogrow")
            })
        },
        getCursorPosition: function () {
            var d = 0;
            var e = this.get(0);
            if (document.selection) {
                e.focus();
                var f = document.selection.createRange();
                var c = document.selection.createRange().text.length;
                f.moveStart("character", -e.value.length);
                d = f.text.length - c
            } else {
                if (e && b(e).is(":visible") && e.selectionStart != null) {
                    d = e.selectionStart
                }
            }
            return d
        },
        setCursorPosition: function (c) {
            return this.each(function () {
                return b(this).selectRange(c, c)
            })
        },
        selectRange: function (d, c) {
            return this.each(function () {
                if (this.setSelectionRange) {
                    this.focus();
                    this.setSelectionRange(d, c)
                } else {
                    if (this.createTextRange) {
                        var e = this.createTextRange();
                        e.collapse(true);
                        e.moveEnd("character", c);
                        e.moveStart("character", d);
                        if (c - d >= 0) {
                            e.select()
                        }
                    }
                }
            })
        },
        getSelection: function () {
            var e = this[0];
            if (e.selectionStart != null) {
                var h = e.selectionStart;
                var c = e.selectionEnd;
                return {
                    start: h,
                    end: c,
                    length: c - h,
                    text: e.value.substr(h, c - h)
                }
            } else {
                if (document.selection) {
                    var d = document.selection.createRange();
                    if (d) {
                        var f = e.createTextRange();
                        var g = f.duplicate();
                        f.moveToBookmark(d.getBookmark());
                        g.setEndPoint("EndToStart", f);
                        var h = g.text.length;
                        var c = h + d.text.length;
                        return {
                            start: h,
                            end: c,
                            length: c - h,
                            text: d.text
                        }
                    }
                }
            }
            return {
                start: 0,
                end: 0,
                length: 0
            }
        }
    });
    if (b.browser.msie && false) {
        window.console = {};
        var a;
        window.console.log = function (f) {
            if (_.isArray(f)) {
                var d = f[0];
                var e = _.map(f.slice(1), function (g) {
                    return JSON.stringify(g)
                }).join(" - ")
            }
            if (!a) {
                a = b("<div><ol></ol></div>").css({
                    position: "fixed",
                    bottom: 10,
                    left: 10,
                    zIndex: 20000,
                    width: b("body").width() - 80,
                    border: "1px solid #000",
                    padding: "10px",
                    backgroundColor: "#fff",
                    fontFamily: "arial,helvetica,sans-serif",
                    fontSize: "11px"
                });
                b("body").append(a)
            }
            var c = b("<li>" + d + " - " + e + "</li>").css({
                borderBottom: "1px solid #999999"
            });
            a.find("ol").append(c);
            _.delay(function () {
                c.fadeOut(500)
            }, 5000)
        }
    }
})();
(function () {
    var a = jQuery;
    VS.app.SearchParser = {
        ALL_FIELDS: /('.+?'|".+?"|[^'"\s]{2}\S*):\s*('.+?'|".+?"|[^'"\s]\S*)/g,
        CATEGORY: /('.+?'|".+?"|[^'"\s]{2}\S*):\s*/,
        parse: function (c) {
            var b = this._extractAllFacets(c);
            VS.app.searchQuery.reset(b);
            return b
        },
        _extractAllFacets: function (f) {
            var e = [];
            var b = f;
            while (f) {
                var c, d;
                b = f;
                var g = this._extractNextField(f);
                if (!g) {
                    c = "text";
                    d = this._extractSearchText(f);
                    f = VS.utils.inflector.trim(f.replace(d, ""))
                } else {
                    if (g.indexOf(":") != -1) {
                        c = g.match(this.CATEGORY)[1].replace(/(^['"]|['"]$)/g, "");
                        d = g.replace(this.CATEGORY, "").replace(/(^['"]|['"]$)/g, "");
                        f = VS.utils.inflector.trim(f.replace(g, ""))
                    } else {
                        if (g.indexOf(":") == -1) {
                            c = "text";
                            d = g;
                            f = VS.utils.inflector.trim(f.replace(d, ""))
                        }
                    }
                } if (c && d) {
                    var h = new VS.model.SearchFacet({
                        category: c,
                        value: VS.utils.inflector.trim(d)
                    });
                    e.push(h)
                }
                if (b == f) {
                    break
                }
            }
            return e
        },
        _extractNextField: function (d) {
            var b = /^\s*(\S+)\s+(?=\w+:\s?(('.+?'|".+?")|([^'"]{2}\S*)))/;
            var c = d.match(b);
            if (c && c.length >= 1) {
                return c[1]
            } else {
                return this._extractFirstField(d)
            }
        },
        _extractFirstField: function (c) {
            var b = c.match(this.ALL_FIELDS);
            return b && b.length && b[0]
        },
        _extractSearchText: function (b) {
            b = b || "";
            var c = VS.utils.inflector.trim(b.replace(this.ALL_FIELDS, ""));
            return c
        }
    }
})();

(function () {
    var a = jQuery;
    VS.model.SearchFacet = Backbone.Model.extend({
        serialize: function () {
            var b = this.quoteCategory(this.get("category"));
            var c = VS.utils.inflector.trim(this.get("value"));
            if (!c) {
                return ""
            }
            if (!_.contains(VS.options.unquotable || [], b) && b != "text") {
                c = this.quoteValue(c)
            }
            if (b != "text") {
                b = b + ": "
            } else {
                b = ""
            }
            return b + c
        },
        quoteCategory: function (d) {
            var e = (/"/).test(d);
            var b = (/'/).test(d);
            var c = (/\s/).test(d);
            if (e && !b) {
                return "'" + d + "'"
            } else {
                if (c || (b && !e)) {
                    return '"' + d + '"'
                } else {
                    return d
                }
            }
        },
        quoteValue: function (d) {
            var c = (/"/).test(d);
            var b = (/'/).test(d);
            if (c && !b) {
                return "'" + d + "'"
            } else {
                return '"' + d + '"'
            }
        }
    })
})();
(function () {
    var a = jQuery;
    VS.model.SearchQuery = Backbone.Collection.extend({
        model: VS.model.SearchFacet,
        value: function () {
            return this.map(function (b) {
                return b.serialize()
            }).join(" ")
        },
        find: function (b) {
            var c = this.detect(function (d) {
                return d.get("category") == b
            });
            return c && c.get("value")
        },
        count: function (b) {
            return this.select(function (c) {
                return c.get("category") == b
            }).length
        },
        values: function (b) {
            var c = this.select(function (d) {
                return d.get("category") == b
            });
            return _.map(c, function (d) {
                return d.get("value")
            })
        },
        has: function (b, c) {
            return this.any(function (e) {
                var d = e.get("category") == b;
                if (!c) {
                    return d
                }
                return d && e.get("value") == c
            })
        },
        withoutCategory: function (b) {
            return this.map(function (c) {
                if (c.get("category") != b) {
                    return c.serialize()
                }
            }).join(" ")
        }
    })
})();
(function () {
    window.JST = window.JST || {};
    window.JST.search_box = _.template('<div class="VS-search">\n  <div class="VS-search-box-wrapper VS-search-box">\n    <div class="VS-icon VS-icon-search"></div>\n    <div class="VS-search-inner"></div>\n    <div class="VS-icon VS-icon-cancel VS-cancel-search-box" title="clear search"></div>\n  </div>\n</div>');
    window.JST.search_facet = _.template('<% if (model.has(\'category\')) { %>\n  <div class="category"><%= model.get(\'category\') %>:</div>\n<% } %>\n\n<div class="search_facet_input_container">\n  <input type="text" class="search_facet_input VS-interface" value="" />\n</div>\n\n<div class="search_facet_remove VS-icon VS-icon-cancel"></div>');
    window.JST.search_input = _.template('<input type="text" />')
})();
(function () {
    Backbone.View.prototype.setMode = function (c, b) {
        this.modes || (this.modes = {});
        if (this.modes[b] === c) {
            return
        }
        $(this.el).setMode(c, b);
        this.modes[b] = c
    };
    var a = Backbone.Model.prototype.set;
    Backbone.Model.prototype.set = function (d, c) {
        var e = {};
        if (d) {
            for (var b in d) {
                e[b] = (d[b] !== "" ? d[b] : null)
            }
        }
        return a.call(this, e, c)
    }
})();
window.DateUtils = {
    RFC_EXTRACTOR: /(\d{4})-(\d{1,2})-(\d{1,2})(?:T(\d{1,2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|[+-](\d{2}):?(\d{2}))?)?/i,
    MONTHS: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    SHORT_MONTHS: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    DAYS: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    SHORT_DAYS: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    AMPM: ["AM", "PM", "am", "pm", "a", "p"],
    HOUR_SELECT: ["12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"],
    FORMATS: [
        [(/%A/g), "DateUtils.DAYS[d.getDay()]"],
        [(/%a/g), "DateUtils.SHORT_DAYS[d.getDay()]"],
        [(/%B/g), "DateUtils.MONTHS[d.getMonth()]"],
        [(/%b/g), "DateUtils.SHORT_MONTHS[d.getMonth()]"],
        [(/%d/g), "DateUtils.pad(d.getDate(), 2)"],
        [(/%e/g), "d.getDate()"],
        [(/%H/g), "DateUtils.pad(d.getHours(), 2)"],
        [(/%I/g), "DateUtils.pad((d.getHours() % 12) || 12, 2)"],
        [(/%k/g), "d.getHours()"],
        [(/%l/g), "(d.getHours() % 12) || 12"],
        [(/%M/g), "DateUtils.pad(d.getMinutes(), 2)"],
        [(/%m/g), "DateUtils.pad(d.getMonth()+1, 2)"],
        [(/%n/g), "d.getMonth()+1"],
        [(/%P/g), "d.getHours() < 12 ? DateUtils.AMPM[0] : DateUtils.AMPM[1]"],
        [(/%p/g), "d.getHours() < 12 ? DateUtils.AMPM[2] : DateUtils.AMPM[3]"],
        [(/%q/g), "d.getHours() < 12 ? DateUtils.AMPM[4] : DateUtils.AMPM[5]"],
        [(/%S/g), "DateUtils.pad(d.getSeconds(), 2)"],
        [(/%y/g), "DateUtils.pad(d.getFullYear() % 100, 2)"],
        [(/%Y/g), "d.getFullYear()"]
    ],
    pad: function (c, b, a) {
        var d = c.toString(a || 10);
        while (d.length < b) {
            d = "0" + d
        }
        return d
    },
    create: function (a) {
        a = a.replace(/\n/g, "\\n").replace(/"/g, '\\"');
        a = 'return "' + a.replace(/"/g, '\\"') + '"';
        _.each(this.FORMATS, function (b) {
            a = a.replace(b[0], '"\n+ (' + b[1] + ') +\n"')
        });
        return new Function("d", a)
    },
    parseRfc: function (g) {
        var j = this.RFC_EXTRACTOR.exec(g);
        if (!j) {
            throw new Error('Invalid RFC3339 Date: "' + g + '"')
        }
        var f = j[4] || 0,
            b = j[5] || 0,
            e = j[6] || 0;
        if (!j[7]) {
            return new Date(j[1], j[2] - 1, j[3], f, b, e)
        }
        var c = (j[8] || 0) * 1,
            a = (j[9] || 0) * 1;
        if (j[7].indexOf("-") >= 0) {
            c = -c;
            a = -a
        }
        f = f * 1 - c;
        b = b * 1 - a;
        return new Date(Date.UTC(j[1], j[2] - 1, j[3], f, b, e))
    }
};

window.dc || (window.dc = {});
dc.inflector = {
    small: "(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|v[.]?|via|vs[.]?)",
    punct: "([!\"#$%&'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]*)",
    titleize: function (e) {
        e = e.replace(/[-.\/_]/g, " ").replace(/\s+/gm, " ");
        var d = this.capitalize;
        var f = [],
            c = /[:.;?!] |(?: |^)["Ò]/g,
            b = 0;
        while (true) {
            var a = c.exec(e);
            f.push(e.substring(b, a ? a.index : e.length).replace(/\b([A-Za-z][a-z.'Õ]*)\b/g, function (g) {
                return (/[A-Za-z]\.[A-Za-z]/).test(g) ? g : d(g)
            }).replace(RegExp("\\b" + this.small + "\\b", "ig"), this.lowercase).replace(RegExp("^" + this.punct + this.small + "\\b", "ig"), function (g, h, j) {
                    return h + d(j)
                }).replace(RegExp("\\b" + this.small + this.punct + "$", "ig"), d));
            b = c.lastIndex;
            if (a) {
                f.push(a[0])
            } else {
                break
            }
        }
        return f.join("").replace(/ V(s?)\. /ig, " v$1. ").replace(/(['Õ])S\b/ig, "$1s").replace(/\b(AT&T|Q&A)\b/ig, function (g) {
            return g.toUpperCase()
        })
    },
    trim: function (a) {
        return a.trim ? a.trim() : a.replace(/^\s+|\s+$/g, "")
    },
    squeeze: function (a) {
        return a.replace(/\s+/g, " ")
    },
    trimExcerpt: function (a) {
        a = a.replace(/^([^<>]{0,100}?[.,!]|[^<>\s]+)/g, "");
        a = a.replace(/(([.,!]\s?)[^<>]{0,100}?|[^<>\s]+)$/g, "$2");
        return "&hellip;" + a + "&hellip;"
    },
    camelize: function (c) {
        var e = c.split("-"),
            a = e.length;
        if (a == 1) {
            return e[0]
        }
        var d = c.charAt(0) == "-" ? e[0].charAt(0).toUpperCase() + e[0].substring(1) : e[0];
        for (var b = 1; b < a; b++) {
            d += e[b].charAt(0).toUpperCase() + e[b].substring(1)
        }
        return d
    },
    lowercase: function (a) {
        return a.toLowerCase()
    },
    capitalize: function (a) {
        return a.charAt(0).toUpperCase() + a.substring(1).toLowerCase()
    },
    underscore: function (a) {
        return a.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/-/g, "_").toLowerCase()
    },
    spacify: function (a) {
        return a.replace(/_/g, " ")
    },
    dasherize: function (a) {
        return a.replace(/_/g, "-")
    },
    singularize: function (a) {
        return a.replace(/s$/, "")
    },
    pluralize: function (a, b) {
        if (b == 1) {
            return a
        }
        if (a == "this") {
            return "these"
        }
        if (a == "person") {
            return "people"
        }
        if (a.match(/day$/i)) {
            return a.replace(/day$/i, "days")
        }
        if (a.match(/y$/i)) {
            return a.replace(/y$/i, "ies")
        }
        return a + "s"
    },
    classify: function (a) {
        return this.camelize(this.capitalize(this.dasherize(this.singularize(a))))
    },
    possessivize: function (b) {
        var a = b.charAt(b.length - 1) == "s";
        return b + (a ? "'" : "'s")
    },
    truncate: function (b, c, a) {
        c = c || 30;
        a = a == null ? "..." : a;
        return b.length > c ? b.slice(0, c - a.length) + a : b
    },
    truncateWords: function (d, e, a) {
        e = e || 30;
        a = a == null ? "..." : a;
        if (d.length > e) {
            var c = d.substr(0, e).split("").reverse().join("");
            var b = c.search(/\W\w/);
            if (b != -1) {
                d = d.substr(0, e - b - 1) + a
            } else {
                d = this.truncate(d, e, a)
            }
        }
        return d
    },
    sluggify: function (a) {
        return this.trim(a.replace(/['"]+/g, "").replace(/\W+/g, " ")).toLowerCase().replace(/\s+/g, "-")
    },
    commify: function (e, c) {
        var g = [];
        for (var d = 0, b = e.length; d < b; d++) {
            var f = e[d];
            if (c.quote) {
                f = '"' + f + '"'
            }
            g.push(f);
            var a = d == e.length - 1 ? "" : (d == e.length - 2) && c.conjunction ? ", " + c.conjunction + " " : ", ";
            g.push(a)
        }
        return g.join("")
    },
    autolink: function (b, a) {
        b = b.replace(/(https?:\/\/([a-z0-9]([-a-z0-9]*[a-z0-9])?\.)+([a-zA-z]{2,6})(\/[a-zA-Z0-9$_.+!#*(),;\/?:@&~=%-]*)?)/g, '<a href="$1">$1</a>');
        if (a) {
            b = b.replace(/(^|\s)@(\w{1,15})/g, '$1<a href="http://twitter.com/$2">@$2</a>')
        }
        return b
    },
    bytesToMB: function (a) {
        var b = Math.round(a / 1024 * 100) * 0.01;
        var c = "KB";
        if (b > 1000) {
            b = Math.round(b * 0.001 * 100) * 0.01;
            c = "MB"
        }
        var d = b.toString().split(".");
        b = d[0] + (d.length > 1 ? "." + d[1].substr(0, 1) : "");
        return b + " " + c
    },
    normalizeUrl: function (a) {
        a = dc.inflector.trim(a);
        if (!a) {
            return null
        }
        return (/^https?:\/\//).test(a) ? a : "http://" + a
    },
    stripTags: function (a) {
        return a.replace(/<\w+(\s*("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, "")
    },
    escapeRegExp: function (a) {
        return a.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1")
    },
    escapeHTML: function (a) {
        return a.replace(/&(?!\w+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    }
};
(function (e) {
    e(document).ajaxSend(function (j, k, g) {
        var h = e("meta[name='csrf-token']").attr("content");
        k.setRequestHeader("X-CSRF-Token", h)
    });
    var d = document.createElement("input");
    var f = "placeholder" in d;
    e.fn.extend({
        align: function (p, t, n) {
            var j = this;
            t = t || "";
            n = n || {};
            var h = document.documentElement.scrollTop || document.body.scrollTop || 0;
            var m = document.documentElement.scrollLeft || document.body.scrollLeft || 0;
            var u = document.documentElement.clientWidth;
            var o = document.documentElement.clientHeight;
            if (p == window) {
                var s = {
                    left: m,
                    top: h,
                    width: e(window).width(),
                    height: e(window).height()
                }
            } else {
                p = e(p);
                var k = p.offset();
                var s = {
                    left: k.left,
                    top: k.top,
                    width: p.innerWidth(),
                    height: p.innerHeight()
                }
            }
            var g = {
                width: j.innerWidth(),
                height: j.innerHeight()
            };
            var l, r;
            if (t.indexOf("-left") >= 0) {
                l = s.left
            } else {
                if (t.indexOf("left") >= 0) {
                    l = s.left - g.width
                } else {
                    if (t.indexOf("-right") >= 0) {
                        l = s.left + s.width - g.width
                    } else {
                        if (t.indexOf("right") >= 0) {
                            l = s.left + s.width
                        } else {
                            l = s.left + (s.width - g.width) / 2
                        }
                    }
                }
            } if (t.indexOf("-top") >= 0) {
                r = s.top
            } else {
                if (t.indexOf("top") >= 0) {
                    r = s.top - g.height
                } else {
                    if (t.indexOf("-bottom") >= 0) {
                        r = s.top + s.height - g.height
                    } else {
                        if (t.indexOf("bottom") >= 0) {
                            r = s.top + s.height
                        } else {
                            r = s.top + (s.height - g.height) / 2
                        }
                    }
                }
            }
            var q = (t.indexOf("no-constraint") >= 0) ? false : true;
            l += n.left || 0;
            r += n.top || 0;
            if (q) {
                l = Math.max(m, Math.min(l, m + u - g.width));
                r = Math.max(h, Math.min(r, h + o - g.height))
            }
            e(j).css({
                position: "absolute",
                left: l + "px",
                top: r + "px"
            });
            return j
        },
        setMode: function (h, j) {
            j = j || "mode";
            var g = new RegExp("\\w+_" + j + "(\\s|$)", "g");
            var k = (h === null) ? "" : h + "_" + j;
            this.each(function () {
                this.className = (this.className.replace(g, "") + " " + k).replace(/\s\s/g, " ")
            });
            return k
        },
        serializeJSON: function () {
            return _.reduce(this.serializeArray(), function (g, h) {
                g[h.name] = h.value;
                return g
            }, {})
        },
        outerHTML: function () {
            return e("<div></div>").append(this.clone()).html()
        },
        autohide: function (g) {
            var h = this;
            g = _.extend({
                clickable: null,
                onHide: null
            }, g || {});
            h._autoignore = true;
            setTimeout(function () {
                delete h._autoignore
            }, 0);
            if (!h._autohider) {
                h.forceHide = function (j) {
                    if (!j && g.onHide) {
                        g.onHide()
                    }
                    h.hide();
                    e(document).unbind("click", h._autohider);
                    e(document).unbind("keypress", h._autohider);
                    h._autohider = null;
                    h.forceHide = null
                };
                h._autohider = function (j) {
                    if (j.which > 1) {
                        return
                    }
                    if (h._autoignore) {
                        return
                    }
                    if (g.clickable && (h[0] == j.target || _.include(e(j.target).parents(), h[0]))) {
                        return
                    }
                    if (g.onHide && !g.onHide(j)) {
                        return
                    }
                    h.forceHide(j)
                };
                e(document).bind("click", this._autohider);
                e(document).bind("keypress", this._autohider)
            }
        },
        draggable: function (g) {
            g || (g = {});
            this.each(function () {
                var h = this;
                var q = null,
                    p = null,
                    m = null;
                var k = function (r) {
                    r.stopPropagation();
                    r.preventDefault();
                    return false
                };
                var o = function (s) {
                    var t = e(s.target).closest("input, select, textarea, label, a, canvas, .tickLabel, .minibutton, .text_link, .selectable_text, .not_draggable").length;
                    if (t) {
                        return true
                    }
                    var r = e(s.target).parents(".is_draggable").andSelf().length;
                    if (!r) {
                        return true
                    }
                    return k(s)
                };
                var l = _.bind(function (r) {
                    if (!h._drag) {
                        return k(r)
                    }
                    if (q) {
                        q.css({
                            top: r.pageY - m,
                            left: r.pageX - p
                        })
                    } else {
                        h.style.left = h._drag.left + r.pageX - h._drag.x + "px";
                        h.style.top = h._drag.top + r.pageY - h._drag.y + "px"
                    }
                }, h);
                var j = _.bind(function (r) {
                    e(document.body).unbind("selectstart", k);
                    e(document.body).unbind("mouseup", j);
                    e(document.body).unbind("mousemove", l);
                    e(q || h).removeClass("dragging");
                    if (q) {
                        e(q).remove()
                    }
                    h._drag = null;
                    if (g.onDrop) {
                        g.onDrop(r)
                    }
                }, h);
                var n = _.bind(function (r) {
                    if (o(r)) {
                        return true
                    }
                    if (g.ghost) {
                        p = e(h).width() / 2;
                        m = e(h).height() / 2;
                        q = e(h).clone().css({
                            position: "absolute",
                            cursor: "copy",
                            "z-index": 1000,
                            top: r.pageY - m,
                            left: r.pageX - p
                        }).appendTo(document.body)
                    }
                    e(q || h).addClass("dragging");
                    h._drag = {
                        left: parseInt(h.style.left, 10) || 0,
                        top: parseInt(h.style.top, 10) || 0,
                        x: r.pageX,
                        y: r.pageY
                    };
                    e(document.body).bind("selectstart", k);
                    e(document.body).bind("mouseup", j);
                    e(document.body).bind("mousemove", l)
                }, h);
                e(h).bind(g.ghost ? "dragstart" : "mousedown", n)
            })
        },
        selectable: function (g) {
            var k = e(document);
            var j = 17;
            var h = e(".selection");
            e(this).bind("mousedown", _.bind(function (s) {
                if (s.which > 1) {
                    return
                }
                if (g.ignore && e(s.target).closest(g.ignore).length) {
                    return
                }
                var o = this.offset();
                if ((s.pageX > o.left + this.outerWidth() - j) || (s.pageY > o.top + this.outerHeight() - j)) {
                    return
                }
                s.preventDefault();
                if (dc.app.searchBox) {
                    dc.app.searchBox.removeFocus();
                    dc.app.searchBox.disableFacets()
                }
                var r = e(g.select);
                var u = this.scrollTop(),
                    p = this.scrollLeft();
                var m = s.pageX,
                    l = s.pageY;
                var v = function (w) {
                    return {
                        left: Math.min(m, w.pageX),
                        top: Math.min(l, w.pageY),
                        width: Math.abs(w.pageX - m),
                        height: Math.abs(w.pageY - l)
                    }
                };
                var t = function (D) {
                    if (D.pageX == m && D.pageY == l) {
                        return
                    }
                    var G = v(D);
                    var z = G.left + p,
                        I = G.top + u,
                        y = z + G.width,
                        H = I + G.height;
                    var B = [];
                    for (var C = 0; C < r.length; C++) {
                        var A = e(r[C]);
                        G = A.offset();
                        var x = G.left + p,
                            F = G.top + u,
                            w = x + A.outerWidth(),
                            E = F + A.outerHeight();
                        if (!(z > w || y < x || I > E || H < F)) {
                            B.push(A)
                        }
                    }
                    if (g.onSelect) {
                        g.onSelect(B)
                    }
                };
                var q = _.bind(function (w) {
                    w.stopPropagation();
                    w.preventDefault();
                    h.show().css(v(w));
                    t(w)
                }, this);
                var n = _.bind(function (w) {
                    w.stopPropagation();
                    w.preventDefault();
                    k.unbind("mouseup", n).unbind("mousemove", q);
                    t(w);
                    h.hide()
                }, this);
                k.bind("mouseup", n).bind("mousemove", q)
            }, this))
        },
        textWithNewlines: function (h) {
            var g = "";
            e.each(h || this, function () {
                e.each(this.childNodes, function () {
                    if (this.nodeType != 8) {
                        var j = this.tagName && this.tagName.toLowerCase();
                        if (j == "div" || j == "p" || j == "br") {
                            g += "\n"
                        }
                        g += this.nodeType != 1 ? this.nodeValue : e.fn.textWithNewlines([this])
                    }
                })
            });
            return g
        },
        placeholder: function (j) {
            if (f) {
                return
            }
            var g = e.extend({}, {
                className: "placeholder"
            }, j);
            var h;
            this.each(function () {
                var k = e(this);
                var l = k.attr("placeholder");
                var m = e('<div class="' + g.className + '">' + l + "</div>");
                m.hide().prependTo(k[0].parentNode);
                k.bind("blur", function () {
                    if (k.val() == "") {
                        m.show()
                    }
                });
                k.bind("focus", function () {
                    h = this;
                    m.hide()
                });
                m.bind("click", function () {
                    e(h).blur();
                    k.focus()
                });
                k.blur()
            })
        }
    });
    jQuery.expr[":"].focus = function (g) {
        return g === document.activeElement && (g.type || g.href)
    };
    var b = ["DOMMouseScroll", "mousewheel"];
    var c = null;
    var a = function (j) {
        var g = [].slice.call(arguments, 1),
            l = 0,
            h = true;
        j = e.event.fix(j || window.event);
        j.type = "mousewheel";
        var k = j.wheelDelta || j.originalEvent.wheelDelta;
        if (k) {
            l = k / 3
        } else {
            if (j.detail) {
                l = -j.detail * 9
            }
        }
        g.unshift(j, l);
        return e.event.handle.apply(this, g)
    };
    e.event.special.mousewheel = {
        setup: function () {
            if (this.addEventListener) {
                for (var g = b.length; g;) {
                    this.addEventListener(b[--g], a, false)
                }
            } else {
                this.onmousewheel = a
            }
        },
        teardown: function () {
            if (this.removeEventListener) {
                for (var g = b.length; g;) {
                    this.removeEventListener(b[--g], a, false)
                }
            } else {
                this.onmousewheel = null
            }
        }
    }
})(jQuery);

dc.model.Selectable = {
    firstSelection: null,
    selectedCount: 0,
    selectAll: function () {
        this.each(function (a) {
            a.set({
                selected: true
            })
        })
    },
    deselectAll: function () {
        this.each(function (a) {
            a.set({
                selected: false
            })
        })
    },
    selected: function () {
        return this.select(function (a) {
            return a.get("selected")
        })
    },
    firstSelected: function () {
        return this.detect(function (a) {
            return a.get("selected")
        })
    },
    selectedIds: function () {
        return _.pluck(this.selected(), "id")
    },
    _resetSelection: function () {
        this.firstSelection = null;
        this.selectedCount = 0
    },
    _add: function (c, b) {
        var a = c.attributes || c;
        if (a.selected == null) {
            a.selected = false
        }
        c = Backbone.Collection.prototype._add.call(this, c, b);
        if (c.get("selected")) {
            this.selectedCount += 1
        }
    },
    _remove: function (b, a) {
        b = Backbone.Collection.prototype._remove.call(this, b, a);
        if (this.selectedCount > 0 && b.get("selected")) {
            this.selectedCount -= 1
        }
    },
    _onModelEvent: function (d, b, a) {
        Backbone.Collection.prototype._onModelEvent.call(this, d, b, a);
        if (d != "change") {
            return
        }
        if (b.hasChanged("selected")) {
            var c = b.get("selected");
            if (c && this.selectedCount == 0) {
                this.firstSelection = b
            } else {
                if (!c && this.firstSelection == b) {
                    this.firstSelection = null
                }
            }
            this.selectedCount += c ? 1 : -1;
            _.defer(_(this.trigger).bind(this, "select", this))
        }
    }
};
dc.app.validator = {
    check: function (a, b) {
        return this[b].test(a)
    },
    url: /^(https?:)\/\/([a-z0-9]([-a-z0-9]*[a-z0-9])?\.)+([a-zA-z]{2,6})(\/[a-zA-Z0-9$_.+!#*(),;\/?:@&~=%-]*)?$/,
    email: /^([\w\.\-\+\=]+)@((?:[a-z0-9\-_]+\.)+[a-z]{2,6})$/i
};
dc.access = {
    DELETED: 0,
    PRIVATE: 1,
    ORGANIZATION: 2,
    EXCLUSIVE: 3,
    PUBLIC: 4,
    PENDING: 5,
    INVISIBLE: 6,
    ERROR: 7,
    NAMES: {
        0: "deleted",
        1: "private",
        2: "organization",
        3: "exclusive",
        4: "public",
        5: "pending",
        6: "invisible",
        7: "error"
    }
};
dc.model.Account = Backbone.Model.extend({
    DISABLED: 0,
    ADMINISTRATOR: 1,
    CONTRIBUTOR: 2,
    REVIEWER: 3,
    FREELANCER: 4,
    ROLE_NAMES: ["disabled", "administrator", "contributor", "reviewer", "freelancer"],
    GRAVATAR_BASE: location.protocol + (location.protocol == "https:" ? "//secure." : "//www.") + "gravatar.com/avatar/",
    DEFAULT_AVATAR: location.protocol + "//" + location.host + "/images/embed/icons/user_blue_32.png",
    defaults: {
        first_name: "",
        last_name: "",
        email: "",
        role: 2
    },
    initialize: function (a) {
        this.organizations = new dc.model.OrganizationSet();
        if (this.get("organizations")) {
            this.organizations.reset(this.get("organizations"))
        }
    },
    constructor: function (b, a) {
        Backbone.Model.call(this, b, a);
        this.organizations = new dc.model.OrganizationSet()
    },
    current_organization: function () {
        return this.organization()
    },
    organization: function () {
        return this.organizations.first()
    },
    addOrganization: function (b) {
        var a = new dc.model.Organization(b);
        this.organizations.add(a);
        Organizations.add(a);
        return a
    },
    openDocuments: function (a) {
        a || (a = {});
        var b = a.published ? " filter: published" : "";
        dc.app.searcher.search("account: " + this.get("slug") + b)
    },
    openOrganizationDocuments: function () {
        dc.app.searcher.search("group: " + dc.account.organization().get("slug"))
    },
    allowedToEdit: function (a) {
        return this.ownsOrOrganization(a) || this.collaborates(a)
    },
    ownsOrOrganization: function (a) {
        return (a.get("account_id") == this.id) || (a.get("organization_id") == this.get("organization_id") && (this.isAdmin() || this.isContributor()) && _.contains([dc.access.PUBLIC, dc.access.EXCLUSIVE, dc.access.ORGANIZATION, "public", "exclusive", "organization"], a.get("access")))
    },
    collaborates: function (h) {
        var b = h.get("document_id") || h.id;
        var c = h.get("project_ids");
        for (var g = 0, d = Projects.length; g < d; g++) {
            var m = Projects.models[g];
            if (_.contains(c, m.get("id")) && !m.get("hidden")) {
                for (var f = 0, e = m.collaborators.length; f < e; f++) {
                    var a = m.collaborators.models[f];
                    if (a.ownsOrOrganization(h)) {
                        return true
                    }
                }
            }
        }
        return false
    },
    fullName: function (b) {
        var a = this.get("first_name") + " " + this.get("last_name");
        return b ? a.replace(/\s/g, "&nbsp;") : a
    },
    documentsTitle: function () {
        return dc.inflector.possessivize(this.fullName()) + " Documents"
    },
    isAdmin: function () {
        return this.attributes.role == this.ADMINISTRATOR
    },
    isContributor: function () {
        return this.attributes.role == this.CONTRIBUTOR
    },
    isReviewer: function () {
        return this.attributes.role == this.REVIEWER
    },
    isReal: function () {
        var a = this.attributes.role;
        return a == this.ADMINISTRATOR || a == this.CONTRIBUTOR || a == this.FREELANCER
    },
    isPending: function () {
        return !!this.get("pending")
    },
    searchUrl: function () {
        return "/#search/" + encodeURIComponent("account: " + this.get("slug"))
    },
    gravatarUrl: function (a) {
        var b = this.get("hashed_email");
        var c = encodeURIComponent(this.DEFAULT_AVATAR);
        return this.GRAVATAR_BASE + b + ".jpg?s=" + a + "&d=" + c
    },
    resendWelcomeEmail: function (b) {
        var a = "/accounts/" + this.id + "/resend_welcome";
        $.ajax(_.extend(b || {}, {
            type: "POST",
            dataType: "json",
            url: a
        }))
    }
});
dc.model.AccountSet = Backbone.Collection.extend({
    model: dc.model.Account,
    url: "/accounts",
    comparator: function (a) {
        return (a.get("last_name") || "").toLowerCase() + " " + (a.get("first_name") || "").toLowerCase()
    },
    getBySlug: function (a) {
        return this.detect(function (b) {
            return b.get("slug") === a
        })
    },
    getByEmail: function (a) {
        return this.detect(function (b) {
            return b.get("email") === a
        })
    },
    getValidByEmail: function (a) {
        return this.detect(function (b) {
            return !b.invalid && b.get("email") === a
        })
    },
    current: function () {
        if (!dc.account) {
            return null
        }
        return this.get(dc.account.id)
    },
    others: function () {
        return this.filter(function (a) {
            return a.id !== dc.account.id
        })
    },
    forceLogout: function () {
        dc.ui.Dialog.alert("You are no longer logged in to DocumentCloud.", {
            onClose: function () {
                window.location = "/logout"
            }
        })
    }
});
window.Accounts = new dc.model.AccountSet();
dc.analytics = {
    initialize: function () {
        window._gaq = window._gaq || [];
        _gaq.push(["_setAccount", "UA-9312438-1"]);
        _gaq.push(["_trackPageview"]);
        var b = document.createElement("script");
        b.type = "text/javascript";
        b.async = true;
        b.src = ("https:" == document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js";
        var a = document.getElementsByTagName("script")[0];
        a.parentNode.insertBefore(b, a)
    },
    trackEvent: function (a) {
        if (a.indexOf("search/") != -1) {
            a = "search"
        }
        _gaq.push(["_trackPageview", "/#" + a])
    }
};
dc.model.Document = Backbone.Model.extend({
    constructor: function (b, a) {
        b.selected = false;
        b.selectable = true;
        if (b.annotation_count == null) {
            b.annotation_count = 0
        }
        Backbone.Model.call(this, b, a);
        var c = this.id;
        this.notes = new dc.model.NoteSet();
        this.notes.url = function () {
            return "/documents/" + c + "/annotations"
        };
        this.entities = new dc.model.EntitySet();
        if (this.get("annotations")) {
            this.notes.reset(this.get("annotations"))
        }
        this.pageEntities = new dc.model.EntitySet();
        this.reviewers = new dc.model.AccountSet()
    },
    url: function () {
        if (!this.collection) {
            return "/documents/" + this.id
        }
        return Backbone.Model.prototype.url.call(this)
    },
    viewerUrl: function () {
        var a = this.get("document_viewer_url").replace(/^https?:/, "");
        return window.location.protocol + a
    },
    publishedUrl: function () {
        return this.get("remote_url") || this.get("detected_remote_url")
    },
    publicUrl: function (a) {
        if (a.indexOf("s3.documentcloud.org") < 0) {
            return a
        }
        return a.replace("s://s3.amazonaws.com/", "://")
    },
    canonicalId: function () {
        return this.id + "-" + this.get("slug")
    },
    formatDay: DateUtils.create("%b %e, %Y"),
    formatTime: DateUtils.create("%l:%M %P"),
    publishAtDate: function () {
        var a = this.get("publish_at");
        return a && DateUtils.parseRfc(a)
    },
    formattedPublishAtDate: function () {
        var a = this.publishAtDate();
        return a && (this.formatDay(a) + " at " + this.formatTime(a))
    },
    mergeData: function (c, a) {
        var b = this.get("data");
        _.each(a, function (d) {
            delete b[d]
        });
        _.each(c, function (e, d) {
            e ? b[d] = e : delete b[d]
        });
        this.save({
            data: b
        });
        this.change()
    },
    sortedData: function () {
        return Documents.sortData(this.get("data"))
    },
    hasNotes: function () {
        return !!this.get("annotation_count")
    },
    hasLoadedNotes: function () {
        return this.notes.length && this.notes.length == this.get("annotation_count")
    },
    fetchMentions: function (a) {
        $.getJSON(this.url() + "/mentions", {
            q: a
        }, _.bind(function (b) {
            this.set(b)
        }, this))
    },
    reprocessText: function (a) {
        var b = {};
        if (a) {
            b.ocr = true
        }
        $.ajax({
            url: this.url() + "/reprocess_text",
            data: b,
            type: "POST",
            dataType: "json",
            success: _.bind(function (c) {
                this.set({
                    access: dc.access.PENDING
                })
            }, this)
        })
    },
    openViewer: function (a) {
        if (this.checkBusy()) {
            return
        }
        return window.open(this.viewerUrl() + (a || ""))
    },
    openEntity: function (b, a) {
        window.open(this.viewerUrl() + "?entity=" + b + "&offset=" + a)
    },
    openPublishedViewer: function () {
        if (this.checkBusy()) {
            return
        }
        if (!this.isPublished()) {
            return dc.ui.Dialog.alert('"' + this.get("title") + '" is not published.')
        }
        return window.open(this.publishedUrl())
    },
    openAppropriateVersion: function (a) {
        return (!dc.account && this.isPublished()) ? this.openPublishedViewer() : this.openViewer(a)
    },
    openText: function () {
        if (this.checkBusy()) {
            return
        }
        window.open(this.get("full_text_url"))
    },
    openPDF: function () {
        if (this.checkBusy()) {
            return
        }
        window.open(this.get("pdf_url"))
    },
    pageThumbnailURL: function (b, a) {
        a || (a = "thumbnail");
        return this.get("page_image_url").replace("{size}", a).replace("{page}", b)
    },
    allowedToEdit: function () {
        if (this.viewerEditable) {
            return true
        }
        var a = Accounts.current();
        return a && Accounts.current().allowedToEdit(this)
    },
    checkAllowedToEdit: function (a) {
        a = a || "You don't have permission to edit \"" + this.get("title") + '".';
        if (this.allowedToEdit()) {
            return true
        }
        dc.ui.Dialog.alert(a);
        return false
    },
    checkBusy: function () {
        if (!(this.get("access") == dc.access.PENDING)) {
            return false
        }
        dc.ui.Dialog.alert('"' + this.get("title") + '" is still being processed. Please wait for it to finish.');
        return true
    },
    uniquePageEntityValues: function () {
        return _.uniq(this.pageEntities.map(function (a) {
            return a.get("value")
        }))
    },
    isPending: function () {
        return this.get("access") == dc.access.PENDING
    },
    isPublic: function () {
        return this.get("access") == dc.access.PUBLIC
    },
    isPublished: function () {
        return this.isPublic() && this.publishedUrl()
    },
    ensurePerPageNoteCounts: function (a) {
        if (this.perPageNoteCounts) {
            a(this.perPageNoteCounts)
        } else {
            $.getJSON("/documents/" + this.id + "/per_page_note_counts", {}, _.bind(function (b) {
                a(this.perPageNoteCounts = b)
            }, this))
        }
    },
    decrementNotes: function () {
        var a = this.get("annotation_count");
        if (a <= 0) {
            return false
        }
        this.set({
            annotation_count: a - 1
        })
    },
    removePages: function (a) {
        Documents.removePages(this, a)
    },
    reorderPages: function (a) {
        Documents.reorderPages(this, a)
    },
    toString: function () {
        return "Document " + this.id + ' "' + this.get("title") + '"'
    }
});
dc.model.DocumentSet = Backbone.Collection.extend({
    model: dc.model.Document,
    EMBED_FORBIDDEN: "You don't have permission to embed that document.",
    POLL_INTERVAL: 10 * 1000,
    NUM_MENTIONS: 3,
    url: "/documents",
    constructor: function (a) {
        Backbone.Collection.call(this, a);
        this._polling = false;
        _.bindAll(this, "poll", "downloadViewers", "downloadSelectedPDF", "downloadSelectedFullText", "printNotes", "_onModelChanged");
        this.bind("change", this._onModelChanged)
    },
    comparator: function (a) {
        return a.get("index")
    },
    pending: function () {
        return this.select(function (a) {
            return a.isPending()
        })
    },
    subtitle: function (a) {
        return a > 1 ? a + " Documents" : ""
    },
    sharedAttribute: function (c, a) {
        var b = _.uniq(_.map(c, function (d) {
            return d.get(a)
        }));
        return b.length > 1 ? false : b[0]
    },
    sharedData: function (c) {
        c = _.clone(c);
        var b = c.shift();
        var a = _.clone(b.get("data"));
        _.each(c, function (e) {
            for (var d in a) {
                if (e.attributes.data[d] !== a[d]) {
                    delete a[d]
                }
            }
        });
        return a
    },
    sortData: function (c) {
        var b = [];
        for (var a in c) {
            b.push([a, c[a]])
        }
        return b.sort(function (e, d) {
            return e[0] > d[0] ? 1 : -1
        })
    },
    selectedPublicCount: function () {
        return _.reduce(this.selected(), function (a, b) {
            return a + b.isPublic() ? 1 : 0
        }, 0)
    },
    allowedToEdit: function (b, a) {
        return !_.any(b, function (c) {
            return !c.checkAllowedToEdit(a)
        })
    },
    chosen: function (a) {
        var b = this.selected();
        b = !a || _.include(b, a) ? b : [a];
        if (_.any(b, function (c) {
            return c.checkBusy()
        })) {
            return []
        }
        return b
    },
    downloadViewers: function (c) {
        var b = _.map(c, function (d) {
            return d.id
        });
        var a = dc.ui.Dialog.progress("Preparing " + dc.inflector.pluralize("document", b.length) + " for download...");
        dc.app.download("/download/" + b.join("/") + "/document_viewer.zip", function () {
            a.close()
        })
    },
    downloadSelectedPDF: function () {
        if (this.selectedCount <= 1) {
            return this.selected()[0].openPDF()
        }
        dc.app.download("/download/" + this.selectedIds().join("/") + "/original_documents.zip")
    },
    downloadSelectedFullText: function () {
        if (this.selectedCount <= 1) {
            return this.selected()[0].openText()
        }
        dc.app.download("/download/" + this.selectedIds().join("/") + "/document_text.zip")
    },
    printNotes: function () {
        var c = this.selected();
        if (!_.any(c, function (d) {
            return d.hasNotes()
        })) {
            return dc.ui.Dialog.alert('"' + c[0].get("title") + '" does not contain any printable notes.')
        }
        var b = _.map(c, function (d) {
            return "docs[]=" + d.id
        }).join("&");
        var a = window.open(SERVER_ROOT + "/notes/print?" + b)
    },
    startPolling: function () {
        this._polling = setInterval(this.poll, this.POLL_INTERVAL)
    },
    stopPolling: function () {
        clearInterval(this._polling);
        this._polling = null
    },
    poll: function () {
        var a = _.compact(_.pluck(this.pending(), "id"));
        if (!a.length) {
            return this.stopPolling()
        }
        if (a.length > 5) {
            a = [a.shift(), a.shift(), a[Math.floor(Math.random() * a.length)]]
        }
        $.get("/documents/status.json", {
            "ids[]": a
        }, _.bind(function (b) {
            _.each(b.documents, function (c) {
                var d = Documents.get(c.id);
                if (d && d.get("access") != c.access) {
                    d.set(c)
                }
            });
            if (!this.pending().length) {
                this.stopPolling()
            }
        }, this), "json")
    },
    verifyDestroy: function (b) {
        if (!this.allowedToEdit(b)) {
            return
        }
        var a = "Really delete " + b.length + " " + dc.inflector.pluralize("document", b.length) + "?";
        dc.ui.Dialog.confirm(a, _.bind(function () {
            var c = b.length;
            var d = dc.ui.Dialog.progress("Deleting Documents&hellip;");
            _(b).each(function (e) {
                e.destroy({
                    success: function () {
                        if (!--c) {
                            d.close()
                        }
                    }
                })
            });
            Projects.removeDocuments(b);
            return true
        }, this))
    },
    removePages: function (c, a, b) {
        b = b || {};
        $.ajax({
            url: "/" + this.resource + "/" + c.id + "/remove_pages",
            type: "POST",
            data: {
                pages: a
            },
            dataType: "json",
            success: function (d) {
                c.set(d);
                if (b.success) {
                    b.success(c, d)
                }
            },
            error: _.bind(function (d) {
                this._handleError(c, b.error, null, d)
            }, this)
        })
    },
    reorderPages: function (b, c, a) {
        a = a || {};
        $.ajax({
            url: "/" + this.resource + "/" + b.id + "/reorder_pages",
            type: "POST",
            data: {
                page_order: c
            },
            dataType: "json",
            success: function (d) {
                b.set(d);
                if (a.success) {
                    a.success(b, d)
                }
            },
            error: _.bind(function (d) {
                this._handleError(b, a.error, null, d)
            }, this)
        })
    },
    editAccess: function (c, d) {
        var a = {
            information: this.subtitle(c.length)
        };
        if (!this.allowedToEdit(c)) {
            return
        }
        var b = this.sharedAttribute(c, "access") || dc.access.PRIVATE;
        dc.ui.Dialog.choose("Access Level", [{
            text: "Public Access",
            description: "Anyone on the internet can search for and view the document.",
            value: dc.access.PUBLIC,
            selected: b == dc.access.PUBLIC
        }, {
            text: "Private Access",
            description: "Only people with explicit permission (via collaboration) have access.",
            value: dc.access.PRIVATE,
            selected: b == dc.access.PRIVATE
        }, {
            text: "Private to " + dc.account.organization().get("name"),
            description: "Only the people in your organization have access. (No freelancers.)",
            value: dc.access.ORGANIZATION,
            selected: b == dc.access.ORGANIZATION
        }
        ], function (e) {
            _.each(c, function (g) {
                g.save({
                    access: parseInt(e, 10)
                })
            });
            var f = "Access updated for " + c.length + " " + dc.inflector.pluralize("document", c.length);
            if (!_.any(c, function (g) {
                return g.suppressNotifier
            })) {
                dc.ui.notifier.show({
                    mode: "info",
                    text: f
                })
            }
            if (d) {
                d(e)
            }
            return true
        }, a)
    },
    add: function (b, a) {
        Backbone.Collection.prototype.add.call(this, b, a);
        this._checkForPending()
    },
    reset: function (b, a) {
        this._resetSelection();
        if (!this.pending().length) {
            this.stopPolling()
        }
        Backbone.Collection.prototype.reset.call(this, b, a)
    },
    _onModelChanged: function (a) {
        if (a.hasChanged("access") && a.isPending()) {
            this._checkForPending()
        }
    },
    _checkForPending: function () {
        if (this._polling) {
            return false
        }
        if (!this.pending().length) {
            return false
        }
        this.startPolling()
    }
}, {
    entitle: function (d) {
        var c = VS.app.searchQuery;
        var e, a, b, f;
        if (c.count("project") == 1) {
            e = c.find("project")
        } else {
            if (dc.account && c.find("account") == Accounts.current().get("slug")) {
                a = (c.find("filter") == "published") ? "your_published_documents" : "your_documents"
            } else {
                if (b = Accounts.getBySlug(c.find("account"))) {
                    e = b.documentsTitle()
                } else {
                    if (dc.account && c.find("group") == dc.account.organization().get("slug")) {
                        a = "org_documents"
                    } else {
                        if (c.has("group") && (f = Organizations.findBySlug(c.find("group")))) {
                            e = dc.inflector.possessivize(f.get("name")) + " Documents"
                        } else {
                            if (c.find("filter") == "published") {
                                a = "published_documents"
                            } else {
                                if (c.find("filter") == "popular") {
                                    a = "popular_documents"
                                } else {
                                    if (c.find("filter") == "annotated") {
                                        a = "annotated_documents"
                                    } else {
                                        a = "all_documents"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return e || dc.model.Project.topLevelTitle(a)
    }
});
_.extend(dc.model.DocumentSet.prototype, dc.model.Selectable);
window.Documents = new dc.model.DocumentSet();
dc.model.Entity = Backbone.Model.extend({
    DIMS: {
        height: 19,
        bucket: 3,
        min: 2,
        margin: 1
    },
    initialize: function () {
        this.excerpts = {}
    },
    occurrences: function () {
        if (!this._occurrences) {
            this._occurrences = _.map(this.get("occurrences").split(","), function (a) {
                a = a.split(":");
                return [parseInt(a[0], 10), parseInt(a[1], 10)]
            });
            this.occurrenceCount = this._occurrences.length
        }
        return this._occurrences
    },
    loadExcerpt: function (c, b) {
        var a;
        if (a = this.excerpts[c]) {
            return b(a)
        }
        $.get("/documents/occurrence.json", {
            id: this.id,
            occurrence: c
        }, _.bind(function (d) {
            b(this.excerpts[c] = d.excerpts[0])
        }, this), "json")
    },
    buckets: function (b) {
        var o = Documents.get(this.get("document_id"));
        var n = o.get("char_count");
        var q = Math.floor(b / (this.DIMS.bucket + this.DIMS.margin));
        var e = this.occurrences();
        var f = [];
        var a = 5;
        var p = function (l) {
            return Math.floor(l / (n / q))
        };
        for (var j = 0, g = e.length; j < g; j++) {
            var h = e[j];
            var m = p(h[0]);
            var c = f[m] || (f[m] = {
                height: 0,
                offset: 0,
                length: 0
            });
            var d = c.height += 1;
            if (c.length < h[1]) {
                c.offset = h[0];
                c.length = h[1]
            }
            if (a < d) {
                a = d
            }
        }
        var k = this.DIMS.height / a;
        for (var j = 0, g = f.length; j < g; j++) {
            var c = f[j];
            if (c) {
                c.height = (Math.round(((k * c.height) - 1) / 2) * 2 + 1) + this.DIMS.min
            }
        }
        return f
    }
}, {
    DISPLAY_NAME: {
        city: "Cities",
        country: "Countries",
        date: "Dates",
        phone: "Phone Numbers",
        email: "Email Addresses",
        organization: "Organizations",
        person: "People",
        place: "Places",
        state: "States",
        term: "Terms"
    },
    PER_PAGE: 10,
    ORDER: ["person", "organization", "place", "term", "email", "phone", "city", "state", "country"],
    SPARK_GRAPHS: ["person", "organization", "place", "term"],
    fetch: function (a, b, c) {
        this._fetch(Documents.pluck("id"), {
            kind: a,
            value: b
        }, c)
    },
    fetchId: function (b, a, c) {
        this._fetch([b], {
            entity_id: a
        }, c)
    },
    _fetch: function (b, a, d) {
        dc.ui.spinner.show();
        var c = _.extend({
            "ids[]": b
        }, a);
        $.get("/documents/entity.json", c, function (e) {
            d(_.map(e.entities, function (f) {
                return new dc.model.Entity(f)
            }));
            dc.ui.spinner.hide()
        }, "json")
    }
});
dc.model.EntitySet = Backbone.Collection.extend({
    model: dc.model.Entity,
    index: function () {
        if (!this._index) {
            var a = this._index = _.groupBy(this.models, function (b) {
                return b.attributes.kind
            });
            _.each(a, function (c, b) {
                a[b] = _.sortBy(c, function (d) {
                    return -d.occurrences().length
                })
            })
        }
        return this._index
    },
    sumOccurrences: function (d) {
        this.index();
        var c = 0,
            b = this.models.length;
        while (b--) {
            var a = this.models[b];
            if (!d || a.attributes.kind == d) {
                c += a.occurrenceCount
            }
        }
        return c
    }
}, {
    populateDocuments: function (b) {
        b = _.compact(_.map(b, function (d) {
            return Documents.get(d.id)
        }));
        var c = function () {
            _.each(b, function (d) {
                d.entities.trigger("load")
            })
        };
        var a = _.select(b, function (d) {
            return !d.entities.loaded
        });
        if (!a.length) {
            return c()
        }
        dc.ui.spinner.show();
        $.get("/documents/entities.json", {
            "ids[]": _.pluck(a, "id")
        }, function (e) {
            var d = _.groupBy(e.entities, "document_id");
            _.each(d, function (g, f) {
                var h = Documents.get(f).entities;
                h.loaded = true;
                h.reset(g)
            });
            dc.ui.spinner.hide();
            c()
        }, "json")
    }
});
window.EntityDates = new dc.model.EntitySet();
EntityDates.comparator = function (a) {
    return a.get("date")
};
dc.model.FeaturedReport = Backbone.Model.extend({
    defaults: {
        title: "",
        url: "",
        organization: "",
        article_date: "",
        writeup: "",
        writeup_html: "",
        other_links: "",
        other_links_html: ""
    }
});
dc.model.FeaturedReports = Backbone.Collection.extend({
    model: dc.model.FeaturedReport,
    url: "/featured"
});
dc.model.Note = Backbone.Model.extend({
    document: function () {
        return this._document = this._document || Documents.get(this.get("document_id"))
    },
    checkAllowedToEdit: function () {
        if (!dc.account) {
            return false
        }
        if (this.document().viewerEditable) {
            return true
        }
        return Accounts.current().allowedToEdit(this)
    },
    imageUrl: function () {
        return this._imageUrl = this._imageUrl || this.document().get("page_image_url").replace("{size}", "normal").replace("{page}", this.get("page"))
    },
    coordinates: function () {
        if (this._coordinates) {
            return this._coordinates
        }
        var b = this.get("location");
        if (!b) {
            return null
        }
        var a = _.map(b.image.split(","), function (c) {
            return parseInt(c, 10)
        });
        return this._coordinates = {
            top: a[0],
            left: a[3],
            right: a[1],
            height: a[2] - a[0],
            width: a[1] - a[3]
        }
    }
});
dc.model.NoteSet = Backbone.Collection.extend({
    model: dc.model.Note,
    url: "/notes",
    comparator: function (a) {
        var b = a.coordinates();
        return a.get("page") * 10000 + (b ? b.top : 0)
    },
    unrestricted: function () {
        return this.filter(function (a) {
            return a.get("access") != "private"
        })
    }
});
dc.model.Organization = Backbone.Model.extend({
    initialize: function (b, a) {
        this.members = new dc.model.AccountSet();
        this.members.reset(this.get("members"))
    },
    groupSearchUrl: function () {
        return "/#search/" + encodeURIComponent(this.query())
    },
    openDocuments: function () {
        dc.app.searcher.search(this.query())
    },
    query: function () {
        return "group: " + this.get("slug")
    },
    statistics: function () {
        var b = this.get("document_count");
        var a = this.get("note_count");
        return b + " " + dc.inflector.pluralize("document", b) + ", " + a + " " + dc.inflector.pluralize("note", a)
    }
});
dc.model.OrganizationSet = Backbone.Collection.extend({
    model: dc.model.Organization,
    url: "/organizations",
    comparator: function (a) {
        return a.get("name").toLowerCase().replace(/^the\s*/, "")
    },
    findBySlug: function (a) {
        return this.detect(function (b) {
            return b.get("slug") == a
        })
    }
});
window.Organizations = new dc.model.OrganizationSet();
dc.model.Project = Backbone.Model.extend({
    constructor: function (c, b) {
        var a = c.collaborators || [];
        delete c.collaborators;
        Backbone.Model.call(this, c, b);
        this.collaborators = new dc.model.AccountSet(a);
        this._setCollaboratorsResource()
    },
    set: function (b, a) {
        b || (b = {});
        if (b.title) {
            b.title = dc.inflector.trim(b.title).replace(/"/g, "")
        }
        if (b.account_id) {
            b.owner = b.account_id == dc.account.id
        }
        Backbone.Model.prototype.set.call(this, b, a);
        if (b.id) {
            this._setCollaboratorsResource()
        }
        return this
    },
    slug: function () {
        return this.id + "-" + dc.inflector.sluggify(this.get("title"))
    },
    open: function () {
        dc.app.searcher.search(this.toSearchParam())
    },
    edit: function () {
        $(document.body).append((new dc.ui.ProjectDialog({
            model: this
        })).render().el)
    },
    addDocuments: function (c) {
        var a = this.get("id");
        var b = _.uniq(_.pluck(c, "id"));
        var d = _.reduce(c, function (f, g) {
            var e = g.get("project_ids");
            if (!_.contains(e, a)) {
                g.set({
                    project_ids: e.concat([a])
                });
                f += 1
            }
            return f
        }, 0);
        if (d) {
            this.set({
                document_count: this.get("document_count") + d
            });
            this.notifyProjectChange(d, false);
            $.ajax({
                url: "/projects/" + a + "/add_documents",
                type: "POST",
                data: {
                    document_ids: b
                },
                success: _.bind(function (e) {
                    this.set(e)
                }, this)
            })
        }
    },
    removeDocuments: function (e, b) {
        var a = this.get("id");
        var d = _.uniq(_.pluck(e, "id"));
        var c = _.reduce(e, function (g, h) {
            var f = h.get("project_ids");
            if (_.contains(f, a)) {
                h.set({
                    project_ids: _.without(f, a)
                });
                g += 1
            }
            return g
        }, 0);
        if (c) {
            if (Projects.firstSelected() === this) {
                Documents.remove(e)
            }
            this.set({
                document_count: this.get("document_count") - c
            });
            this.notifyProjectChange(c, true);
            if (!b) {
                $.ajax({
                    url: "/projects/" + a + "/remove_documents",
                    type: "POST",
                    data: {
                        document_ids: d
                    },
                    success: _.bind(function (f) {
                        this.set(f)
                    }, this)
                })
            }
        }
    },
    notifyProjectChange: function (e, b) {
        var c = b ? "Removed " : "Added ";
        var a = b ? ' from "' : ' to "';
        var d = c + e + " " + dc.inflector.pluralize("document", e) + a + this.get("title") + '"';
        dc.ui.notifier.show({
            mode: "info",
            text: d
        })
    },
    contains: function (a) {
        return _.contains(a.get("project_ids"), this.get("id"))
    },
    containsAny: function (b) {
        var a = this;
        return _.any(b, function (c) {
            return a.contains(c)
        })
    },
    toSearchParam: function () {
        return "project: " + dc.app.searcher.quote(this.get("title"))
    },
    statistics: function () {
        var c = this.get("document_count");
        var b = this.get("annotation_count");
        var a = this.collaborators.length;
        return c + " " + dc.inflector.pluralize("document", c) + ", " + b + " " + dc.inflector.pluralize("note", b) + (a ? ", " + a + " " + dc.inflector.pluralize("collaborator", a) : "")
    },
    _setCollaboratorsResource: function () {
        if (!(this.collaborators && this.id)) {
            return
        }
        this.collaborators.url = "/projects/" + this.id + "/collaborators"
    }
});
dc.model.Project.topLevelTitle = function (a) {
    switch (a) {
        case "all_documents":
            return "All Documents";
        case "your_documents":
            return "Your Documents";
        case "annotated_documents":
            return "Annotated Documents";
        case "popular_documents":
            return "Popular Documents";
        case "published_documents":
            return "Published Documents";
        case "your_published_documents":
            return "Your Published Documents"
    }
};
dc.model.ProjectSet = Backbone.Collection.extend({
    model: dc.model.Project,
    url: "/projects",
    comparator: function (a) {
        return a.get("title").toLowerCase()
    },
    find: function (a) {
        return this.detect(function (b) {
            return b.get("title").toLowerCase() == a.toLowerCase()
        })
    },
    startingWith: function (a) {
        var b = new RegExp("^" + a);
        return this.select(function (c) {
            return !!c.get("title").match(b)
        })
    },
    incrementCountById: function (b) {
        var a = this.get(b);
        a.set({
            document_count: a.get("document_count") + 1
        })
    },
    removeDocuments: function (a) {
        this.each(function (b) {
            b.removeDocuments(a, true)
        })
    }
});
_.extend(dc.model.ProjectSet.prototype, dc.model.Selectable);
window.Projects = new dc.model.ProjectSet();
dc.model.SearchEmbed = Backbone.Model.extend({});
dc.model.SearchEmbeds = Backbone.Collection.extend({
    model: dc.model.SearchEmbed
});
dc.model.UploadDocument = Backbone.Model.extend({
    FILE_EXTENSION_MATCHER: /\.([^.]+)$/,
    MAX_FILE_SIZE: 419430400,
    set: function (a) {
        var b = a.file;
        if (b) {
            delete a.file;
            var d = b.fileName || b.name;
            d = d.match(/[^\/\\]+$/)[0];
            a.title = dc.inflector.titleize(d.replace(this.FILE_EXTENSION_MATCHER, ""));
            var c = d.match(this.FILE_EXTENSION_MATCHER);
            a.extension = c && c[1];
            a.size = b.fileSize || b.size || null
        }
        Backbone.Model.prototype.set.call(this, a);
        return this
    },
    overSizeLimit: function () {
        return this.get("size") >= this.MAX_FILE_SIZE
    }
});
dc.model.UploadDocumentSet = Backbone.Collection.extend({
    model: dc.model.UploadDocument,
    comparator: function (a) {
        return a.get("position")
    }
});
window.UploadDocuments = new dc.model.UploadDocumentSet();
dc.ui.Dialog = Backbone.View.extend({
    className: "dialog",
    options: {
        title: "Untitled Dialog",
        text: null,
        information: null,
        description: null,
        choices: null,
        password: false,
        editor: false,
        draggable: true
    },
    events: {
        "click .cancel": "cancel",
        "click .ok": "confirm",
        "focus input": "_addFocus",
        "focus textarea": "_addFocus",
        "blur input": "_removeFocus",
        "blur textarea": "_removeFocus"
    },
    render: function (b) {
        this.modes || (this.modes = {});
        b = b || {};
        if (this.options.mode) {
            this.setMode(this.options.mode, "dialog")
        }
        if (this.options.draggable) {
            this.setMode("is", "draggable")
        }
        _.bindAll(this, "close", "_maybeConfirm", "_maybeClose");
        $(this.el).html(JST["common/dialog"](_.extend({}, this.options, b)));
        var a = this.contentEl = this.$(".content");
        this._controls = this.$(".controls");
        this._information = this.$(".information");
        if (this.options.width) {
            $(this.el).css({
                width: this.options.width
            })
        }
        if (this.options.content) {
            a.val(this.options.content)
        }
        $(document.body).append(this.el);
        this.delegateEvents();
        this.center();
        if (this.options.draggable) {
            $(this.el).draggable()
        }
        if (this._returnCloses()) {
            $(document.body).bind("keypress", this._maybeConfirm)
        }
        $(document.body).bind("keydown", this._maybeClose);
        if (a[0]) {
            _.defer(function () {
                a.focus()
            })
        }
        if (!b.noOverlay && dc.app.workspace) {
            $(document.body).addClass("overlay")
        }
        return this
    },
    append: function (a) {
        this._controls.before(a)
    },
    addControl: function (a) {
        this._controls.prepend(a)
    },
    val: function () {
        return (this.options.choices && this.options.mode == "prompt") ? this.$("input:radio:checked").val() : this.contentEl.val()
    },
    title: function (a) {
        this.$(".title").text(a)
    },
    cancel: function () {
        if (this.options.onCancel) {
            this.options.onCancel(this)
        }
        this.close()
    },
    info: function (b, a) {
        this._information.removeClass("error").text(b).show();
        if (!a) {
            this._information.delay(3000).fadeOut()
        }
    },
    error: function (b, a) {
        this._information.stop().addClass("error").text(b).show();
        if (!a) {
            this._information.delay(3000).fadeOut()
        }
    },
    confirm: function () {
        if (this.options.onConfirm && !this.options.onConfirm(this)) {
            return false
        }
        this.close()
    },
    close: function () {
        if (this.options.onClose) {
            this.options.onClose(this)
        }
        $(this.el).remove();
        if (this._returnCloses()) {
            $(document.body).unbind("keypress", this._maybeConfirm)
        }
        $(document.body).unbind("keydown", this._maybeClose);
        $(document.body).removeClass("overlay")
    },
    center: function () {
        $(this.el).align(window, "", {
            top: -50
        })
    },
    showSpinner: function () {
        this.$(".spinner_dark").show()
    },
    hideSpinner: function () {
        this.$(".spinner_dark").hide()
    },
    validateUrl: function (a) {
        if (dc.app.validator.check(a, "url")) {
            return true
        }
        this.error("Please enter a valid URL.");
        return false
    },
    validateEmail: function (a) {
        if (dc.app.validator.check(a, "email")) {
            return true
        }
        this.error("Please enter a valid email address.");
        return false
    },
    _returnCloses: function () {
        return _.include(["alert", "short_prompt", "confirm"], this.options.mode)
    },
    _maybeClose: function (a) {
        if (a.which == 27) {
            this.close()
        }
    },
    _maybeConfirm: function (a) {
        if (a.which == 13) {
            this.confirm()
        }
    },
    _addFocus: function (a) {
        $(a.target).addClass("focus");
        $(this.el).css({
            zoom: 1
        })
    },
    _removeFocus: function (a) {
        $(a.target).removeClass("focus")
    }
});
_.extend(dc.ui.Dialog, {
    alert: function (b, a) {
        return new dc.ui.Dialog(_.extend({
            mode: "alert",
            title: null,
            text: b
        }, a)).render()
    },
    prompt: function (d, c, e, a) {
        var b = e && function (f) {
            return e(f.val(), f)
        };
        return new dc.ui.Dialog(_.extend({
            mode: "prompt",
            password: !! (a && a.password),
            title: d,
            text: "",
            content: c,
            onConfirm: b
        }, a)).render()
    },
    confirm: function (b, c, a) {
        return new dc.ui.Dialog(_.extend({
            mode: "confirm",
            title: null,
            text: b,
            onConfirm: c
        }, a)).render()
    },
    choose: function (b, d, c, a) {
        return new dc.ui.Dialog(_.extend({
            mode: "prompt",
            title: b,
            choices: d,
            text: "",
            onConfirm: c && function (e) {
                return c(e.val())
            }
        }, a)).render()
    },
    contact: function () {
        var b = function (c) {
            var d = {
                message: c.val()
            };
            if (!dc.account) {
                d.email = c.$(".contact_email").val();
                if (!c.validateEmail(d.email)) {
                    return false
                }
            }
            $.post("/ajax_help/contact_us", d, function () {
                dc.ui.notifier.show({
                    mode: "info",
                    text: "Your message was sent successfully."
                })
            });
            return true
        };
        var a = new dc.ui.Dialog({
            id: "contact_us",
            mode: "custom",
            title: "Contact Us",
            saveText: "Send",
            onConfirm: b
        });
        a.render();
        a.setMode("prompt", "dialog");
        a.$(".custom").html(JST["common/contact"]());
        a.contentEl = a.$(".content");
        a.$("input").placeholder();
        a.center()
    },
    progress: function (b, a) {
        return new dc.ui.Dialog(_.extend({
            mode: "progress",
            text: b,
            title: null
        }, a)).render()
    }
});
dc.ui.Menu = Backbone.View.extend({
    className: "minibutton menu",
    options: {
        id: null,
        standalone: false
    },
    events: {
        click: "open",
        selectstart: "_stopSelect"
    },
    constructor: function (a) {
        this.modes = {};
        _.bindAll(this, "close");
        Backbone.View.call(this, a);
        this.items = [];
        this.content = $(JST["common/menu"](this.options));
        this.itemsContainer = $(".menu_items", this.content);
        this.addIcon = $(".bullet_add", this.content);
        this.modes.open = "not";
        if (a.items) {
            this.addItems(a.items)
        }
    },
    render: function () {
        $(this.el).html(JST["common/menubutton"]({
            label: this.options.label
        }));
        this._label = this.$(".label");
        $(document.body).append(this.content);
        return this
    },
    open: function () {
        var a = this.content;
        if (this.modes.enabled == "not") {
            return false
        }
        if (this.modes.open == "is" && !this.options.standalone) {
            return this.close()
        }
        this.setMode("is", "open");
        if (this.options.onOpen) {
            this.options.onOpen(this)
        }
        a.show();
        a.align(this.el, "-left bottom no-constraint");
        a.autohide({
            onHide: this.close
        });
        return this
    },
    close: function (a) {
        if (a && this.options.onClose && !this.options.onClose(a)) {
            return false
        }
        this.setMode("not", "open");
        return true
    },
    enable: function () {
        this.setMode("is", "enabled")
    },
    disable: function () {
        this.setMode("not", "enabled")
    },
    activate: function (a) {
        this._activateCallback = a;
        this.setMode("is", "active")
    },
    deactivate: function (a) {
        if (this.modes.active == "is") {
            this.setMode("not", "active");
            if (this._activateCallback) {
                this._activateCallback()
            }
            return false
        }
    },
    clear: function () {
        this.items = [];
        $(this.itemsContainer).html("");
        this.content.setMode(null, "selected")
    },
    setLabel: function (a) {
        $(this._label).text(a || this.options.label)
    },
    addItems: function (a) {
        this.items = this.items.concat(a);
        var b = _(a).map(_.bind(function (e) {
            var c = e.attrs || {};
            _.extend(c, {
                "class": "menu_item " + (c["class"] || "")
            });
            var d = this.make("div", c, e.title);
            e.menuEl = $(d);
            if (e.onClick) {
                $(d).bind("click", function (f) {
                    if ($(d).hasClass("disabled")) {
                        return false
                    }
                    e.onClick(f)
                })
            }
            return d
        }, this));
        $(this.itemsContainer).append(b)
    },
    select: function (a) {
        this.selectedItem = a;
        a.menuEl.addClass("selected")
    },
    deselect: function () {
        if (this.selectedItem) {
            this.selectedItem.menuEl.removeClass("selected")
        }
        this.selectedItem = null
    },
    _stopSelect: function (a) {
        return false
    }
});
dc.ui.Notifier = Backbone.View.extend({
    id: "notifier",
    events: {
        click: "hide"
    },
    options: {
        position: "center center",
        text: "ok",
        left: 0,
        top: 0,
        duration: 2000,
        leaveOpen: false,
        mode: "warn"
    },
    constructor: function (a) {
        Backbone.View.call(this, a);
        $(document.body).append(this.el);
        _.bindAll(this, "show", "hide")
    },
    show: function (a) {
        a = _.extend({}, this.options, a);
        this.setMode(a.mode, "style");
        $(this.el).html(a.text).fadeIn("fast");
        $(this.el).show();
        if (this.timeout) {
            clearTimeout(this.timeout)
        }
        if (!a.leaveOpen) {
            this.timeout = setTimeout(this.hide, a.duration)
        }
    },
    hide: function (a) {
        this.timeout = null;
        a === true ? $(this.el).hide() : $(this.el).fadeOut("fast")
    }
});
dc.ui.Scroll = Backbone.View.extend({
    OVERLAP_MARGIN: 50,
    SPEED: 500,
    className: "scroll",
    events: {
        "click .scroll_up": "scrollUp",
        "click .scroll_down": "scrollDown",
        mousewheel: "_mouseScroll"
    },
    constructor: function (a) {
        Backbone.View.call(this);
        this.content = $(a);
        this.upButton = this.make("div", {
            "class": "scroll_up"
        });
        this.downButton = this.make("div", {
            "class": "scroll_down"
        });
        _.bindAll(this, "check")
    },
    render: function () {
        this.content.addClass("scroll_content");
        this.content.wrap(this.el);
        this.setElement($(this.content).closest(".scroll")[0]);
        this.content.before(this.upButton);
        this.content.after(this.downButton);
        $(window).resize(this.check);
        return this
    },
    scrollUp: function () {
        var b = this.content.innerHeight() - this.OVERLAP_MARGIN;
        var a = this.content[0].scrollTop - b;
        this.content.animate({
            scrollTop: a
        }, this.SPEED, null, _.bind(this.setPosition, this, a))
    },
    scrollDown: function () {
        var b = this.content.innerHeight() - this.OVERLAP_MARGIN;
        var a = this.content[0].scrollTop + b;
        this.content.animate({
            scrollTop: a
        }, this.SPEED, null, _.bind(this.setPosition, this, a))
    },
    check: function () {
        var a = this.hasOverflow();
        this.setMode(a ? "is" : "not", "active");
        if (!a) {
            this.setMode(null, "position")
        }
        this.setPosition(this.content[0].scrollTop)
    },
    checkLater: function () {
        _.defer(this.check)
    },
    hasOverflow: function () {
        return this.content.innerHeight() < this.content[0].scrollHeight
    },
    setPosition: function (a) {
        var b = a <= 0 ? "top" : a + this.content.innerHeight() >= this.content[0].scrollHeight ? "bottom" : "middle";
        if (this.modes.position == b) {
            return
        }
        this.setMode(b, "position")
    },
    _mouseScroll: function (b, c) {
        if (this.modes.active == "not" || (c >= 0 && this.modes.position == "top") || (c <= 0 && this.modes.position == "bottom")) {
            return
        }
        var a = this.content[0].scrollTop - c;
        this.content[0].scrollTop = a;
        this.setPosition(a);
        return false
    }
});
dc.ui.spinner = {
    show: function (a) {
        this.ensureElement();
        a = a || "Loading";
        this.el.stop(true, true).fadeIn("fast")
    },
    hide: function () {
        this.ensureElement();
        this.el.stop(true, true).fadeOut("fast", function () {
            $(this).css({
                display: "none"
            })
        })
    },
    ensureElement: function () {
        this.el || (this.el = $("#spinner"))
    }
};
_.bindAll(dc.ui.spinner, "show", "hide");
dc.ui.Tooltip = Backbone.View.extend({
    id: "tooltip",
    className: "interface",
    OFFSET: 5,
    MAX_WIDTH: 320,
    options: {
        text: "info",
        left: 0,
        top: 0
    },
    constructor: function (a) {
        Backbone.View.call(this, a);
        this._open = false;
        _.bindAll(this, "hide", "show");
        $(this.el).html(JST["common/tooltip"]());
        this._title = this.$("#tooltip_title");
        this._content = this.$("#tooltip_text");
        $(document.body).append(this.el)
    },
    show: function (b) {
        b = _.extend(this.options, b);
        b.top += this.OFFSET;
        this.setMode(b.mode, "style");
        this._title.html(b.title);
        this._content.html(b.text);
        var c = $(this.el).outerWidth();
        var a = $(window).width() - this.OFFSET - c;
        b.left += b.left < a ? this.OFFSET : -(c + 2);
        $(this.el).css({
            top: b.top,
            left: b.left
        });
        if (!this._open) {
            this.fadeIn()
        }
        if (!b.leaveOpen) {
            $(document).bind("mouseover", this.hide)
        }
        this._open = true
    },
    hide: function (a) {
        if (!this._open) {
            return
        }
        this._open = false;
        $(document).unbind("mouseover", this.hide);
        this.fadeOut()
    },
    fadeIn: function () {
        $.browser.msie ? $(this.el).show() : $(this.el).stop(true, true).fadeIn("fast")
    },
    fadeOut: function () {
        $.browser.msie ? $(this.el).hide() : $(this.el).stop(true, true).fadeOut("fast")
    }
});
dc.ui.AccountDialog = dc.ui.Dialog.extend({
    id: "account_list",
    className: "account_list dialog",
    events: {
        "click .ok": "close",
        "click .new_account": "newAccount"
    },
    constructor: function () {
        dc.ui.Dialog.call(this, {
            mode: "custom",
            title: "Manage Accounts: " + dc.account.organization().get("name"),
            information: "group: " + dc.account.organization().get("slug")
        });
        Accounts.bind("reset", _.bind(this._renderAccounts, this));
        this._rendered = false;
        this._open = false;
        $(this.el).hide()
    },
    render: function () {
        dc.ui.Dialog.prototype.render.call(this);
        this._rendered = true;
        this._container = this.$(".custom");
        this._container.setMode("not", "draggable");
        this._container.html(JST["account/dialog"]({}));
        if (Accounts.current().isAdmin()) {
            this.addControl(this.make("div", {
                "class": "minibutton dark new_account",
                style: "width: 90px;"
            }, "New Account"))
        }
        this.list = this.$(".account_list_content");
        this._renderAccounts();
        return this
    },
    open: function () {
        this._open = true;
        if (!this._rendered) {
            this.render();
            return
        }
        $(document.body).addClass("overlay");
        this.center();
        $(this.el).show()
    },
    close: function () {
        dc.ui.notifier.hide();
        $(this.el).hide();
        $(document.body).removeClass("overlay");
        this._open = false
    },
    isOpen: function () {
        return this._open
    },
    newAccount: function () {
        var a = new dc.ui.AccountView({
            model: new dc.model.Account(),
            kind: "row",
            dialog: this
        });
        this.list.append(a.render("edit").el);
        this._container[0].scrollTop = this._container[0].scrollHeight
    },
    _renderAccounts: function () {
        dc.ui.spinner.hide();
        var a = Accounts.map(function (b) {
            return (new dc.ui.AccountView({
                model: b,
                kind: "row"
            })).render().el
        });
        this.list.append(a);
        $(this.el).show();
        this.center()
    }
});
dc.ui.AccountView = Backbone.View.extend({
    AVATAR_SIZES: {
        badge: 30,
        row: 25,
        admin: 25,
        collaborator: 25,
        reviewer: 25
    },
    TAGS: {
        badge: "div",
        row: "tr",
        admin: "tr",
        collaborator: "tr",
        reviewer: "tr"
    },
    events: {
        "click .edit_account": "showEdit",
        "click .change_password": "promptPasswordChange",
        "click .resend_welcome": "resendWelcomeEmail",
        "click .admin_link": "_openAccounts",
        "click .save_changes": "_doneEditing",
        "click .cancel_changes": "_cancelEditing",
        "click .disable_account": "_disableAccount",
        "click .enable_account": "_enableAccount",
        "click .login_as .minibutton": "_loginAsAccount"
    },
    constructor: function (a) {
        this.modes = {};
        this.kind = a.kind;
        this.tagName = this.TAGS[this.kind];
        this.className = "account_view " + this.kind + (this.tagName == "tr" ? " not_draggable" : "");
        this.dialog = a.dialog || dc.app.accounts;
        Backbone.View.call(this, a);
        this.template = JST["account/" + this.kind];
        _.bindAll(this, "_onSuccess", "_onError");
        this._boundRender = _.bind(this.render, this, "display");
        this.observe(this.model)
    },
    observe: function (a) {
        if (this.model) {
            this.model.unbind("change", this._boundRender)
        }
        this.model = a;
        this.model.bind("change", this._boundRender)
    },
    render: function (c, b) {
        if (this.modes.view == "edit") {
            return
        }
        c = c || "display";
        b = b || {};
        var a = _.extend({
            account: this.model,
            email: this.model.get("email"),
            size: this.size(),
            current: Accounts.current()
        }, b);
        if (this.isRow()) {
            this.setMode(c, "view")
        }
        $(this.el).html(this.template(a));
        if (c == "edit") {
            this.$("option.role_" + this.model.get("role")).attr({
                selected: "selected"
            })
        }
        if (this.model.isPending()) {
            $(this.el).addClass("pending")
        }
        this._loadAvatar();
        this._setPlaceholders();
        this.setMode(this.model.ROLE_NAMES[this.model.get("role")], "role");
        return this
    },
    size: function () {
        return this.AVATAR_SIZES[this.kind]
    },
    isRow: function () {
        return this.kind == "row" || this.kind == "admin" || this.kind == "reviewer"
    },
    serialize: function () {
        var a = this.$("input, select").serializeJSON();
        if (a.role) {
            a.role = parseInt(a.role, 10)
        }
        return a
    },
    showEdit: function () {
        this.$("option.role_" + this.model.get("role")).attr({
            selected: "selected"
        });
        this.setMode("edit", "view")
    },
    promptPasswordChange: function () {
        this.dialog.close();
        var a = dc.ui.Dialog.prompt("Enter your new password:", "", _.bind(function (b) {
            if (b.length > 0) {
                this.model.save({
                    password: b
                }, {
                    success: _.bind(function () {
                        dc.ui.notifier.show({
                            text: "Password updated",
                            duration: 5000,
                            mode: "info"
                        })
                    }, this)
                });
                return true
            } else {
                dc.ui.Dialog.alert("Your password can't be blank")
            }
        }, this), {
            password: true,
            mode: "short_prompt"
        })
    },
    resendWelcomeEmail: function () {
        dc.ui.spinner.show();
        var a = this.model;
        a.resendWelcomeEmail({
            success: _.bind(function () {
                dc.ui.spinner.hide();
                dc.ui.notifier.show({
                    mode: "info",
                    text: "A welcome message has been sent to " + a.get("email") + "."
                })
            }, this)
        })
    },
    _setPlaceholders: function () {
        this.$("input[name=first_name], input[name=last_name], input[name=email]").placeholder()
    },
    _loadAvatar: function () {
        var a = new Image();
        var b = this.model.gravatarUrl(this.size());
        a.onload = _.bind(function () {
            this.$("img.avatar").attr({
                src: b
            })
        }, this);
        a.src = b
    },
    _openAccounts: function (a) {
        a.preventDefault();
        this.dialog.open()
    },
    _doneEditing: function () {
        var c = this;
        var a = this.serialize();
        var b = {
            success: this._onSuccess,
            error: this._onError
        };
        if (this.model.isNew()) {
            if (!a.email) {
                return $(this.el).remove()
            }
            if (Accounts.getValidByEmail(a.email)) {
                this.dialog.error("" + a.email + " already has an account");
                return
            }
            dc.ui.spinner.show();
            this.model.newRecord = true;
            this.model.set(a);
            Accounts.create(this.model, b)
        } else {
            if (!this.model.invalid && !this.model.changedAttributes(a)) {
                this.setMode("display", "view")
            } else {
                dc.ui.spinner.show();
                this.model.save(a, b)
            }
        }
    },
    _cancelEditing: function () {
        this.setMode("display", "view")
    },
    _disableAccount: function () {
        if (this.dialog.isOpen()) {
            this.dialog.close()
        }
        var a = dc.ui.Dialog.confirm(null, _.bind(function () {
            this.setMode("display", "view");
            this.model.save({
                role: this.model.DISABLED
            });
            dc.ui.notifier.show({
                text: this.model.fullName() + " has been disabled.",
                duration: 5000,
                mode: "info"
            });
            return true
        }, this), {
            id: "disable_account_confirm",
            title: "Really disable " + this.model.fullName() + "'s account?",
            description: this.model.fullName() + " will not be able to log in to DocumentCloud. Public documents and annotations provided by " + this.model.fullName() + ' will remain available. <span class="contact_support text_link">Contact support</span> to completely purge ' + this.model.fullName() + "'s account.",
            saveText: "Disable"
        });
        $(".contact_support", a.el).bind("click", function () {
            a.close();
            dc.ui.Dialog.contact()
        })
    },
    _enableAccount: function () {
        this.setMode("display", "view");
        this.model.save({
            role: this.model.CONTRIBUTOR
        })
    },
    _loginAsAccount: function () {
        window.location = "/admin/login_as?email=" + encodeURIComponent(this.model.get("email"))
    },
    _onSuccess: function (a, b) {
        this.model.invalid = false;
        this.setMode("display", "view");
        this.model.trigger("change");
        dc.ui.spinner.hide();
        if (this.model.newRecord) {
            this.model.newRecord = false;
            dc.ui.notifier.show({
                text: "Signup sent to " + a.get("email"),
                duration: 5000,
                mode: "info"
            })
        }
    },
    _onError: function (a, b) {
        b = JSON.parse(b.responseText);
        a.invalid = true;
        dc.ui.spinner.hide();
        this.showEdit();
        this.dialog.error(b.errors && b.errors[0] || "Could not add the account.")
    }
});
dc.ui.ShareDialog = dc.ui.Dialog.extend({
    id: "share_dialog",
    className: "dialog",
    events: {
        "click .close": "close",
        "click .preview": "previewEmail",
        "click .next": "_nextStep",
        "click .previous": "_previousStep",
        "click .add_reviewer": "_showEnterEmail",
        "click .cancel_add": "_cancelAddReviewer",
        "click .minibutton.add": "_submitAddReviewer",
        "click .remove_reviewer": "_removeReviewer",
        "click .resend_reviewer": "_resendInstructions",
        "keypress .reviewer_management_email": "_maybeAddReviewer",
        "keypress .reviewer_management_firstname": "_maybeAddReviewer",
        "keypress .reviewer_management_lastname": "_maybeAddReviewer"
    },
    EMAIL_DIALOG_OPTIONS: {
        mode: "short_prompt",
        description: "Enter the email address of the first reviewer to invite:",
        saveText: "Next",
        closeText: "Cancel"
    },
    initialize: function (a) {
        _.bindAll(this, "_renderReviewers", "_refreshReviewers", "_onAddSuccess", "_onAddError", "_onRemoveSuccess", "_onRemoveError", "_showEnterEmail", "_nextStep");
        this.renderedAccounts = {};
        this._boundRender = [];
        this.currentStep = 1;
        this.newReviewers = [];
        this.docs = new dc.model.DocumentSet(a.docs);
        $(this.el).hide().empty();
        dc.ui.spinner.show();
        this.fetchReviewers();
        if (this.docs.all(function (b) {
            return b.get("reviewer_count") == 0
        })) {
            this.renderEmailDialog()
        }
    },
    render: function () {
        dc.ui.Dialog.prototype.render.call(this);
        this.setMode("share", "dialog");
        this._container = this.$(".custom");
        this._container.html(JST["account/share_dialog"]({
            defaultAvatar: dc.model.Account.prototype.DEFAULT_AVATAR,
            docCount: this.docs.length
        }));
        this._next = this.$(".next");
        this._previous = this.$(".previous");
        this._emailEl = this.$(".reviewer_management input[name=email]");
        $(this.el).show();
        dc.ui.spinner.hide();
        this._setPlaceholders();
        this._setStep();
        this._enabledNextButton();
        this.center();
        return this
    },
    reviewers: function () {
        return _.flatten(this.docs.map(function (a) {
            return a.reviewers.models
        }))
    },
    accountsToEmail: function () {
        return _.uniq(_.filter(this.reviewers(), function (a) {
            return a.get("needsEmail")
        }))
    },
    eachReviewer: function (a) {
        _.each(this.reviewers(), _.bind(a, this))
    },
    docsForReviewers: function (a) {
        return this.docs.select(function (b) {
            return _.any(a, function (c) {
                return b.reviewers.get(c)
            })
        })
    },
    renderEmailDialog: function () {
        var b = this.docs.length;
        var a = "Share " + (this.docs.length == 1 ? '"' + dc.inflector.truncate(this.docs.first().get("title"), 35) + '"' : this.docs.length + " Documents");
        this.showingEmailDialog = true;
        dc.ui.spinner.hide();
        dc.ui.Dialog.prompt(a, "", _.bind(function (c) {
            this.showingEmailDialog = false;
            this._renderReviewers();
            this._showEnterEmail();
            this._focusEmail(c);
            this._submitAddReviewer();
            return true
        }, this), this.EMAIL_DIALOG_OPTIONS)
    },
    managementError: function (a, b) {
        this.$(".reviewer_management .error").toggleClass("error_white", !b).text(a)
    },
    customMessage: function () {
        return dc.inflector.trim(this.$(".email_message").val())
    },
    previewEmail: function () {
        var b = this.docsForReviewers(_.pluck(this.accountsToEmail(), "id"));
        var a = _.map(b, function (c) {
            return "document_ids[]=" + c.id
        }).join("&");
        window.open("/reviewers/preview_email?" + a + "&message=" + encodeURIComponent(this.customMessage()))
    },
    fetchReviewers: function () {
        $.ajax({
            url: "/reviewers",
            type: "GET",
            data: {
                document_ids: this.docs.pluck("id")
            },
            success: this._refreshReviewers,
            error: this._renderReviewers
        })
    },
    _refreshReviewers: function (a) {
        if (this.showingEmailDialog) {
            return
        }
        _.each(a.reviewers, _.bind(function (c, b) {
            this.docs.get(b).reviewers.reset(c)
        }, this));
        this._renderReviewers()
    },
    _renderReviewers: function () {
        this.render();
        var a = [];
        this._countDocuments();
        this.renderedAccounts = {};
        this.eachReviewer(function (c) {
            var b = this._renderReviewer(c);
            if (b) {
                a.push(b)
            }
        });
        this.$(".account_list_content tr:not(.reviewer_management)").remove();
        this.$(".account_list_content").prepend(a);
        this.$(".document_reviewers_empty").toggle(!_.keys(this.renderedAccounts).length);
        this._cancelAddReviewer()
    },
    _setPlaceholders: function () {
        this.$("input[name=first_name], input[name=last_name]").placeholder();
        this._emailEl.placeholder()
    },
    _countDocuments: function () {
        var a = this.accountDocumentCounts = {};
        this.eachReviewer(function (b) {
            a[b.id] = (a[b.id] || 0) + 1
        })
    },
    _renderReviewer: function (b) {
        if (this.renderedAccounts[b.id]) {
            return
        }
        var a = this.renderedAccounts[b.id] = new dc.ui.AccountView({
            model: b,
            kind: "reviewer",
            dialog: this
        });
        this._rerenderReviewer(b);
        b.bind("change:needsEmail", _.bind(this._enabledNextButton, this));
        b.bind("change:needsEmail", _.bind(this._rerenderReviewer, this, b));
        this._observeReviewer(b, a);
        return a.el
    },
    _rerenderReviewer: function (a) {
        this.renderedAccounts[a.id].render("display", {
            documentCount: this.accountDocumentCounts[a.id],
            documentsCount: this.docs.length
        })
    },
    _observeReviewer: function (b, a) {
        b.unbind("change", a._boundRender);
        if (this._boundRender[b.id]) {
            b.unbind("change", this._boundRender[b.id])
        }
        this._boundRender[b.id] = _.bind(this._rerenderReviewer, this, b);
        b.bind("change", this._boundRender[b.id])
    },
    _showEnterEmail: function () {
        if (this.showingManagement) {
            return this._submitAddReviewer(this._showEnterEmail)
        }
        this.showingManagement = true;
        this.$(".reviewer_management").show();
        this.$(".document_reviewers_empty").hide();
        this._focusEmail();
        this._enabledNextButton()
    },
    _focusEmail: function (b) {
        var a = this.$(".document_reviewers");
        a.attr("scrollTop", a.attr("scrollHeight") + 100);
        this._emailEl.focus();
        if (b) {
            this._emailEl.val(b)
        }
        var b = this._emailEl.val();
        if (!b) {
            this.managementError("Please enter an email address.")
        }
    },
    _cancelAddReviewer: function () {
        this.showingManagement = false;
        this.$(".reviewer_management").hide();
        this.$(".reviewer_management input").val("");
        this.$(".document_reviewers_empty").toggle(!_.keys(this.renderedAccounts).length);
        this._enabledNextButton()
    },
    _maybeAddReviewer: function (a) {
        if (a.which == 13) {
            this._submitAddReviewer()
        }
    },
    _submitAddReviewer: function (c, b) {
        var a = this._emailEl.val();
        if (!a.length && this.accountsToEmail().length && b) {
            this._cancelAddReviewer();
            return c()
        }
        if (!dc.app.validator.check(a, "email")) {
            this._focusEmail();
            this.managementError("Please enter a valid email address.", true);
            return false
        }
        this.showSpinner();
        $.ajax({
            url: "/reviewers",
            type: "POST",
            data: {
                email: dc.inflector.trim(a),
                first_name: dc.inflector.trim(this.$(".reviewer_management input[name=first_name]").val()),
                last_name: dc.inflector.trim(this.$(".reviewer_management input[name=last_name]").val()),
                document_ids: this.docs.pluck("id")
            },
            success: _.bind(function (d) {
                this._onAddSuccess(d, c)
            }, this),
            error: this._onAddError
        })
    },
    _onAddSuccess: function (b, c) {
        _.each(b.documents, function (d) {
            Documents.get(d.id).set(d)
        });
        var a = new dc.model.Account(b.account);
        this.docs.each(function (e) {
            var d = e.reviewers.get(a.id);
            if (!d) {
                e.reviewers.add(a)
            }(d || a).set({
                needsEmail: true
            })
        });
        this.showingManagement = false;
        this._renderReviewers();
        if (c) {
            c()
        }
        this._enabledNextButton()
    },
    _onAddError: function (b) {
        var a = b.status;
        b = JSON.parse(b.responseText);
        if (b.errors && _.any(b.errors, function (c) {
            c = c.toLowerCase();
            return c.indexOf("first name") != -1 || c.indexOf("last name") != -1
        })) {
            this._showReviewerNameInputs();
            this.managementError("Please provide the reviewer's name.")
        } else {
            if (b.errors) {
                this.managementError(b.errors[0], true)
            } else {
                if (a == 403) {
                    this.error("You are not allowed to add reviewers.")
                } else {
                    this.managementError("Please enter the email address of a reviewer.", true)
                }
            }
        }
        this.hideSpinner();
        this._focusEmail();
        this._enabledNextButton()
    },
    _showReviewerNameInputs: function () {
        this.$("input[name=first_name], input[name=last_name]").show();
        this.$(".enter_full_name_label").show();
        this.$(".enter_email_label").hide();
        this._setPlaceholders()
    },
    _removeReviewer: function (c) {
        this.showSpinner();
        var f = parseInt($(c.target).attr("data-account-id"), 10);
        var b = _.detect(this.reviewers(), function (e) {
            return e.id == f
        });
        var a = this.docsForReviewers([b.id]);
        var d = _.pluck(a, "id");
        $.ajax({
            url: "/reviewers/" + f,
            type: "DELETE",
            data: {
                account_id: f,
                document_ids: d
            },
            success: _.bind(function (e) {
                this._onRemoveSuccess(e, d, b)
            }, this),
            error: this._onRemoveError
        });
        this._enabledNextButton()
    },
    _onRemoveSuccess: function (c, b, a) {
        _.each(c, function (d) {
            Documents.get(d.id).set(d)
        });
        this.docs.each(_.bind(function (d) {
            if (_.contains(b, d.id)) {
                d.reviewers.remove(a)
            }
        }, this));
        dc.ui.notifier.show({
            text: a.get("email") + " is no longer a reviewer on " + b.length + dc.inflector.pluralize(" document", b.length),
            duration: 5000,
            mode: "info"
        });
        this._renderReviewers();
        this._enabledNextButton()
    },
    _onRemoveError: function (a) {
        this.hideSpinner();
        if (a.status == 403) {
            this.error("You are not allowed to remove reviewers.")
        } else {
            this.error("There was a problem removing the reviewer.")
        }
        this._enabledNextButton()
    },
    _resendInstructions: function (a) {
        var b = parseInt($(a.target).attr("data-account-id"), 10);
        this.eachReviewer(function (c) {
            if (c.id == b) {
                c.set({
                    needsEmail: true
                })
            }
        });
        this._enabledNextButton();
        this._nextStep()
    },
    _setEmailDescription: function () {
        var b = this.accountsToEmail();
        var a = "DocumentCloud will email reviewing instructions to " + dc.inflector.commify(_.map(b, function (c) {
            return c.fullName()
        }), {
            conjunction: "and"
        }) + ". If you wish, you may add a personal&nbsp;message.";
        this.$(".email_description").html(a)
    },
    _sendInstructions: function () {
        var d = this.accountsToEmail();
        this.showSpinner();
        this._next.setMode("not", "enabled");
        this._next.html("Sending...");
        var a = _.pluck(d, "id");
        var b = this.docsForReviewers(a);
        var e = _.pluck(b, "id");
        var c = this.customMessage();
        $.ajax({
            url: "/reviewers/send_email",
            type: "POST",
            data: {
                account_ids: a,
                document_ids: e,
                message: c
            },
            success: _.bind(function (g) {
                var f = "Instructions for reviewing " + (e.length == 1 ? '"' + dc.inflector.truncate(this.docs.get(e[0]).get("title"), 30) + '"' : e.length + " documents") + " sent to " + (d.length == 1 ? d[0].get("email") : d.length + " people") + ".";
                dc.ui.notifier.show({
                    text: f,
                    duration: 5000,
                    mode: "info"
                });
                this.hideSpinner();
                this.close()
            }, this),
            error: _.bind(function (f) {
                this.hideSpinner();
                this.error("Your instructions were not sent. Contact support for help troubleshooting.");
                this._setStep();
                this._enabledNextButton()
            }, this)
        })
    },
    _enabledNextButton: function () {
        this._nextEnabled = this.accountsToEmail().length || this.showingManagement;
        this._next.setMode(this._nextEnabled ? "is" : "not", "enabled")
    },
    _setStep: function () {
        var b = this._displayTitle();
        this.title(b);
        var a = this.currentStep == 2;
        this._next.html(a ? "Send" : "Next &raquo;");
        this.setMode("p" + this.currentStep, "step");
        if (a) {
            this._setEmailDescription()
        }
    },
    _displayTitle: function () {
        if (this.currentStep == 1) {
            return this.docs.length == 1 ? 'Share "' + dc.inflector.truncate(this.docs.first().get("title"), 30) + '"' : "Share " + this.docs.length + " Documents"
        } else {
            var a = this.accountsToEmail();
            return "Email Instructions to " + (a.length > 1 ? a.length + " Reviewers" : a[0].fullName())
        }
    },
    _nextStep: function () {
        if (!this._nextEnabled) {
            return
        }
        if (this.showingManagement) {
            return this._submitAddReviewer(this._nextStep, true)
        }
        if (this.currentStep >= 2) {
            this._sendInstructions()
        } else {
            this.currentStep += 1;
            this._setStep()
        }
    },
    _previousStep: function () {
        if (this.currentStep > 1) {
            this.currentStep -= 1
        }
        this._setStep()
    }
});
dc.ui.Document = Backbone.View.extend({
    PAGE_LIMIT: 50,
    ERROR_MESSAGE: '<span class="interface">Our system was unable to process     this document. We\'ve been notified of the problem and periodically review     these errors. Please review our     <span class="text_link troubleshoot">troubleshooting suggestions</span> or     <span class="text_link contact_us">contact us</span> for immediate assistance.</span>',
    className: "document",
    events: {
        "click .doc_title": "select",
        "contextmenu .doc_title": "showMenu",
        "dblclick .doc_title": "viewDocument",
        "click .icon.doc": "select",
        "contextmenu .icon.doc": "showMenu",
        "dblclick .icon.doc": "viewDocument",
        "click .show_notes": "toggleNotes",
        "click .title .edit_glyph": "openDialog",
        "click .datalines .edit_glyph": "openDataDialog",
        "click .title .lock": "editAccessLevel",
        "click .title .published": "viewPublishedDocuments",
        "click .page_icon": "_openPage",
        "click .reviewer_count": "_openShareDialog",
        "click .occurrence": "_openPage",
        "click .mention b": "_openPage",
        "click .pages .cancel_search": "_hidePages",
        "click .page_count": "_togglePageImages",
        "click .search_account": "searchAccount",
        "click .search_group": "searchOrganization",
        "click .search_source": "searchSource",
        "click .change_publish_at": "editPublishAt",
        "click .troubleshoot": "openTroubleshooting",
        "click .contact_us": "openContactUs",
        "click .open_pages": "openPagesInViewer",
        "click .show_mentions": "fetchAllMentions",
        "click .page_list .left": "previousPage",
        "click .page_list .right": "nextPage",
        "click .data_item": "searchData"
    },
    constructor: function (a) {
        Backbone.View.call(this, a);
        this.el.id = "document_" + this.model.id;
        this._currentPage = 0;
        this._showingPages = false;
        this.setMode(this.model.get("annotation_count") ? "owns" : "no", "notes");
        _.bindAll(this, "_onDocumentChange", "_onDrop", "_addNote", "_renderNotes", "_renderPages", "_renderEntities", "_setSelected", "viewDocuments", "viewPublishedDocuments", "openDialog", "setAccessLevelAll", "viewEntities", "hideNotes", "viewPages", "viewChosenPages", "deleteDocuments", "removeFromProject", "_openShareDialog", "openDataDialog", "focus");
        this.model.bind("change", this._onDocumentChange);
        this.model.bind("change:selected", this._setSelected);
        this.model.bind("focus", this.focus);
        this.model.bind("view:pages", this.viewPages);
        this.model.bind("notes:hide", this.hideNotes);
        this.model.notes.bind("add", this._addNote);
        this.model.notes.bind("reset", this._renderNotes);
        this.model.entities.bind("load", this._renderEntities);
        this.model.pageEntities.bind("reset", this._renderPages)
    },
    render: function (a) {
        a || (a = {});
        var b = this;
        var d = this.model.get("title");
        var c = _.extend(this.model.toJSON(), {
            model: this.model,
            created_at: this.model.get("created_at").replace(/\s/g, "&nbsp;"),
            icon: this._iconAttributes(),
            thumbnail_url: this._thumbnailURL(),
            data: this.model.sortedData()
        });
        if (dc.app.paginator && dc.app.paginator.mini) {
            c.title = dc.inflector.truncateWords(c.title, 50)
        }
        $(this.el).html(JST["document/tile"](c));
        this._displayDescription();
        if (dc.account) {
            this.$(".doc.icon").draggable({
                ghost: true,
                onDrop: this._onDrop
            })
        }
        this.notesEl = this.$(".notes");
        this.entitiesEl = this.$(".entities");
        this.pagesEl = this.$(".pages");
        this.entitiesView = new dc.ui.SparkEntities({
            model: this.model,
            parent: this,
            container: this.$(".entities")
        });
        this.model.notes.each(function (e) {
            b._addNote(e)
        });
        if (a.notes && this.model.hasLoadedNotes()) {
            this.setMode("has", "notes")
        }
        this.setMode(dc.access.NAMES[this.model.get("access")], "access");
        this.setMode(this.model.allowedToEdit() ? "is" : "not", "editable");
        this._setSelected();
        return this
    },
    select: function (h) {
        h.preventDefault();
        if (!this.model.get("selectable")) {
            return
        }
        var b = this.model.get("selected");
        var d = dc.app.hotkeys;
        var f = Documents.firstSelection || Documents.selected()[0];
        if (d.command || d.control) {
            this.model.set({
                selected: !b
            })
        } else {
            if (d.shift && f) {
                var a = Documents.indexOf(this.model),
                    g = Documents.indexOf(f);
                var j = Math.min(a, g),
                    c = Math.max(a, g);
                Documents.each(function (k, e) {
                    k.set({
                        selected: e >= j && e <= c
                    })
                })
            } else {
                Documents.deselectAll();
                this.model.set({
                    selected: true
                })
            }
        }
    },
    viewDocument: function (a) {
        this.model.openAppropriateVersion();
        return false
    },
    viewPublishedDocuments: function () {
        var a = Documents.chosen(this.model);
        if (!a.length) {
            return
        }
        _.each(a, function (b) {
            if (b.isPublished()) {
                b.openPublishedViewer()
            }
        })
    },
    viewDocuments: function () {
        var a = Documents.chosen(this.model);
        if (!a.length) {
            return
        }
        _.each(a, function (b) {
            b.openViewer()
        })
    },
    viewPDF: function () {
        this.model.openPDF()
    },
    viewFullText: function () {
        this.model.openText()
    },
    viewEntities: function () {
        var a = Documents.chosen(this.model);
        dc.app.paginator.ensureRows(function () {
            dc.model.EntitySet.populateDocuments(a)
        }, a[0])
    },
    hideNotes: function () {
        this.setMode(this.model.hasNotes() ? "owns" : "no", "notes")
    },
    downloadViewer: function () {
        if (this.checkBusy()) {
            return
        }
        this.model.downloadViewer()
    },
    openDialog: function (a) {
        if (!(this.modes.editable == "is")) {
            return
        }
        if (this.model.checkBusy()) {
            return
        }
        dc.ui.DocumentDialog.open(this.model)
    },
    openDataDialog: function (a) {
        if (!(this.modes.editable == "is")) {
            return
        }
        if (this.model.checkBusy()) {
            return
        }
        dc.ui.DocumentDataDialog.open(this.model)
    },
    openPagesInViewer: function () {
        this.model.openViewer("#pages")
    },
    fetchAllMentions: function () {
        this.model.fetchMentions(dc.app.searchBox.value())
    },
    previousPage: function () {
        this._currentPage--;
        this.viewPages()
    },
    nextPage: function () {
        this._currentPage++;
        this.viewPages()
    },
    toggleNotes: function (b) {
        b.stopPropagation();
        var a = _.bind(function () {
            var c = Documents.get(this.model.id);
            if (this.modes.notes == "has") {
                return this.setMode("owns", "notes")
            }
            if (c.checkBusy()) {
                return
            }
            if (c.hasLoadedNotes()) {
                this._renderNotes();
                return this.setMode("has", "notes")
            }
            dc.ui.spinner.show("loading notes");
            c.notes.fetch({
                success: function () {
                    dc.ui.spinner.hide();
                    window.scroll(0, $("#document_" + c.id).offset().top - 100)
                }
            })
        }, this);
        dc.app.paginator.mini ? dc.app.paginator.toggleSize(a, this.model) : a()
    },
    viewPages: function () {
        this._showingPages = true;
        this.model.ensurePerPageNoteCounts(_.bind(function (a) {
            var c = (this._currentPage * this.PAGE_LIMIT) + 1;
            var b = this.model.get("page_count");
            this.pagesEl.html(JST["document/page_images"]({
                doc: this.model,
                start: c,
                end: Math.min(c + this.PAGE_LIMIT - 1, b),
                total: b,
                limit: this.PAGE_LIMIT,
                notes: a
            }))
        }, this))
    },
    viewChosenPages: function () {
        var a = Documents.chosen(this.model);
        dc.app.paginator.ensureRows(function () {
            _.each(a, function (b) {
                if (b = Documents.get(b.id)) {
                    b.trigger("view:pages")
                }
            })
        }, a[0])
    },
    deleteDocuments: function () {
        Documents.verifyDestroy(Documents.chosen(this.model))
    },
    removeFromProject: function () {
        Projects.firstSelected().removeDocuments(Documents.chosen(this.model))
    },
    searchAccount: function () {
        dc.app.searcher.addToSearch("account", this.model.get("account_slug"))
    },
    searchOrganization: function () {
        dc.app.searcher.addToSearch("group", this.model.get("organization_slug"))
    },
    searchSource: function () {
        dc.app.searcher.addToSearch("source", this.model.get("source").replace(/"/g, '\\"'))
    },
    searchData: function (d) {
        var b = $(d.currentTarget);
        var a = b.find(".data_key").text().replace(/:$/, "");
        var c = b.find(".data_value").text();
        dc.app.searcher.toggleSearch(a, c)
    },
    editAccessLevel: function () {
        Documents.editAccess([this.model])
    },
    setAccessLevelAll: function () {
        Documents.editAccess(Documents.chosen(this.model))
    },
    editPublishAt: function () {
        new dc.ui.PublicationDateDialog([this.model])
    },
    focus: function () {
        window.scroll(0, $(this.el).offset().top - 100)
    },
    openTroubleshooting: function () {
        dc.app.workspace.help.openPage("troubleshooting")
    },
    openContactUs: function () {
        dc.ui.Dialog.contact()
    },
    _openShareDialog: function () {
        dc.app.shareDialog = new dc.ui.ShareDialog({
            docs: [this.model],
            mode: "custom"
        })
    },
    showMenu: function (f) {
        f.preventDefault();
        var g = dc.ui.Document.sharedMenu || (dc.ui.Document.sharedMenu = new dc.ui.Menu({
            id: "document_menu",
            standalone: true
        }));
        var c = Documents.chosen(this.model).length;
        if (!c) {
            return
        }
        var d = dc.inflector.pluralize("Delete Document", c);
        g.clear();
        var a = [{
            title: "Open",
            onClick: this.viewDocuments
        }
        ];
        if (this.model.isPublished()) {
            a.push({
                title: "Open Published Version",
                onClick: this.viewPublishedDocuments
            })
        }
        a.push({
            title: "View Entities",
            onClick: this.viewEntities
        });
        a.push({
            title: "View Pages",
            onClick: this.viewChosenPages
        });
        if (this.model.allowedToEdit()) {
            a = a.concat([{
                title: "Edit Document Information",
                onClick: this.openDialog
            }, {
                title: "Edit Document Data",
                onClick: this.openDataDialog
            }, {
                title: "Set Access Level",
                onClick: this.setAccessLevelAll
            }, {
                title: d,
                onClick: this.deleteDocuments,
                attrs: {
                    "class": "warn"
                }
            }
            ])
        }
        if (Projects.firstSelected()) {
            var b = a.length - (a[a.length - 1].onClick == this.deleteDocuments ? 1 : 0);
            a.splice(b, 0, {
                title: "Remove from this Project",
                onClick: this.removeFromProject
            })
        }
        g.addItems(a);
        g.render().open().content.css({
            top: f.pageY,
            left: f.pageX
        })
    },
    _iconAttributes: function () {
        var a = this.model.get("access");
        var b = "icon main_icon document_tool ";
        switch (a) {
            case dc.access.PENDING:
                return {
                    "class": b + "spinner",
                    title: "Uploading..."
                };
            case dc.access.ERROR:
                return {
                    "class": b + "alert_gray",
                    title: "Broken document"
                };
            case dc.access.ORGANIZATION:
                return {
                    "class": b + "lock",
                    title: "Private to " + (dc.account ? dc.account.organization().get("name") : "your organization")
                };
            case dc.access.PRIVATE:
                return {
                    "class": b + "lock",
                    title: "Private"
                };
            default:
                if (this.model.isPublished()) {
                    return {
                        "class": b + "published",
                        title: "Open Published Version"
                    }
                }
                return {
                    "class": b + "hidden",
                    iconless: true
                }
        }
    },
    _thumbnailURL: function () {
        var a = this.model.get("access");
        switch (a) {
            case dc.access.PENDING:
                return "/images/embed/documents/processing.png";
            case dc.access.ERROR:
                return "/images/embed/documents/failed.png";
            default:
                return this.model.get("thumbnail_url")
        }
    },
    _displayDescription: function () {
        var a = this.$(".description_text");
        if (this.model.get("access") == dc.access.ERROR) {
            return a.html(this.ERROR_MESSAGE)
        }
        a.text(dc.inflector.stripTags(this.model.get("description") || ""))
    },
    _setSelected: function () {
        var a = this.model.get("selected");
        this.setMode(a ? "is" : "not", "selected")
    },
    _onDocumentChange: function () {
        if (this.model.hasChanged("selected")) {
            return
        }
        this.render()
    },
    _addNote: function (b) {
        var a = new dc.ui.Note({
            model: b,
            collection: this.model.notes
        });
        this.notesEl.append(a.render().el);
        a.center()
    },
    _renderNotes: function () {
        this.notesEl.empty();
        this.model.notes.each(this._addNote);
        this.setMode(this.model.ignoreNotes ? "owns" : "has", "notes")
    },
    _renderEntities: function () {
        if (this.model.entities.length) {
            this.entitiesView.show()
        } else {
            dc.ui.Dialog.alert('"' + this.model.get("title") + '" has no entities to display.')
        }
    },
    _togglePageImages: function () {
        if (this._showingPages) {
            this._hidePages()
        } else {
            this.viewPages()
        }
    },
    _renderPages: function () {
        this._showingPages = false;
        this.pagesEl.html(JST["document/pages"]({
            doc: this.model
        }));
        this.focus()
    },
    _hidePages: function () {
        this._showingPages = false;
        this._currentPage = 0;
        this.pagesEl.html("")
    },
    _openPage: function (c) {
        var a = $(c.target).closest(".page");
        var b = a.attr("data-page");
        var f = a.attr("data-id");
        if (a.hasClass("mention")) {
            var d = a.find("b").text();
            this.model.openViewer("#search/p" + b + "/" + encodeURIComponent(d))
        } else {
            if (f) {
                this.model.openEntity(f, a.attr("data-offset"))
            } else {
                this.model.openViewer("#document/p" + b)
            }
        }
    },
    _onDrop: function (c) {
        var d = [this.model];
        var b = Documents.selected();
        if (b.length && _.include(b, this.model)) {
            d = b
        }
        var a = c.pageX,
            f = c.pageY;
        $("#organizer .project").each(function () {
            var j = $(this).offset().top,
                h = $(this).offset().left;
            var g = h + $(this).outerWidth(),
                e = j + $(this).outerHeight();
            if (h < a && g > a && j < f && e > f) {
                var k = Projects.getByCid($(this).attr("data-project-cid"));
                if (k) {
                    k.addDocuments(d)
                }
                return false
            }
        })
    }
});
dc.ui.DocumentDataDialog = dc.ui.Dialog.extend({
    className: "dialog datalog",
    dataEvents: {
        "click .minus": "_removeDatum",
        "click .plus": "_addDatum",
        "click .remove_all": "_removeAll"
    },
    constructor: function (a) {
        this.events = _.extend({}, this.events, this.dataEvents);
        this.docs = a;
        this.multiple = a.length > 1;
        this.originalData = Documents.sharedData(this.docs);
        this._rowTemplate = JST["document/data_dialog_row"];
        dc.ui.Dialog.call(this, {
            mode: "custom",
            title: "Edit Data for " + this._title(),
            saveText: "Save"
        });
        this.render();
        $(document.body).append(this.el)
    },
    render: function () {
        dc.ui.Dialog.prototype.render.call(this);
        var b = Documents.sortData(this.originalData);
        var a = _.any(this.docs, function (c) {
            return !_.isEmpty(c.get("data"))
        });
        this._container = this.$(".custom");
        this._container.html(JST["document/data_dialog"]({
            multiple: this.multiple,
            removeAll: a,
            data: b
        }));
        this.checkNoData();
        return this
    },
    checkNoData: function () {
        if (!this.$(".data_row").length) {
            var a = this._container.find(".rows");
            var b = a.html(this._rowTemplate({
                key: "",
                value: "",
                minus: false
            }) + this._rowTemplate({
                key: "",
                value: "",
                minus: true
            }) + this._rowTemplate({
                key: "",
                value: "",
                minus: true
            }))
        }
    },
    serialize: function () {
        var a = {};
        _.each(this.$(".data_row"), function (b) {
            a[$(b).find(".key").val()] = $(b).find(".value").val()
        });
        return a
    },
    confirm: function () {
        var c = this.serialize();
        var a = _.detect(_.keys(c), function (d) {
            return _.include(dc.searchPrefixes, d.toLowerCase())
        });
        if (a) {
            this.error('"' + a + '" cannot be used as a key')
        } else {
            var b = _.without.apply(_, [_.keys(this.originalData)].concat(_.keys(c)));
            _.each(this.docs, function (d) {
                d.mergeData(c, b)
            });
            this.close()
        }
    },
    _removeDatum: function (a) {
        $(a.target).closest(".data_row").remove();
        this.checkNoData()
    },
    _addDatum: function (b) {
        var a = $(this._rowTemplate({
            key: "",
            value: "",
            minus: true
        }));
        $(b.target).closest(".data_row").after(a);
        a.find(".key").focus();
        this.checkNoData()
    },
    _removeAll: function () {
        this.close();
        var b = this.docs;
        var a = "Are you sure you want to remove all data from " + this._title() + "?";
        dc.ui.Dialog.confirm(a, function () {
            _.each(b, function (c) {
                c.save({
                    data: {}
                })
            });
            return true
        });
        this.close()
    },
    _title: function () {
        if (this.multiple) {
            return this.docs.length + " Documents"
        }
        return '"' + dc.inflector.truncate(this.docs[0].get("title"), 25) + '"'
    },
    _returnCloses: function () {
        return true
    }
}, {
    open: function (a) {
        var b = Documents.chosen(a);
        if (!b.length) {
            return
        }
        if (!Documents.allowedToEdit(b)) {
            return
        }
        new dc.ui.DocumentDataDialog(b)
    }
});
dc.ui.DocumentDialog = dc.ui.Dialog.extend({
    ATTRIBUTES: ["title", "source", "description", "related_article", "remote_url", "access", "language"],
    id: "edit_document_dialog",
    className: "dialog docalog",
    events: {
        "click .cancel": "close",
        "click .ok": "save",
        "focus input": "_addFocus",
        "focus textarea": "_addFocus",
        "blur input": "_removeFocus",
        "blur textarea": "_removeFocus",
        "click .delete": "destroy",
        "change .attribute": "_markChanged"
    },
    constructor: function (b) {
        this.docs = b;
        this.multiple = b.length > 1;
        var a = "Edit " + this._title();
        dc.ui.Dialog.call(this, {
            mode: "custom",
            title: a,
            editor: true
        });
        this.render();
        $(document.body).append(this.el)
    },
    render: function () {
        dc.ui.Dialog.prototype.render.call(this);
        this._container = this.$(".custom");
        this._container.html(JST["document/document_dialog"]({
            docs: this.docs,
            multiple: this.multiple
        }));
        var a = this._sharedAttributes();
        a.access = a.access || dc.access.PRIVATE;
        _.each(this.ATTRIBUTES, _.bind(function (b) {
            $("#document_edit_" + b).val(a[b] || "")
        }, this));
        this.center();
        return this
    },
    save: function () {
        var a = this._sharedAttributes();
        var b = {};
        _.each(this.ATTRIBUTES, _.bind(function (d) {
            var f = this.$("#document_edit_" + d);
            if (!f.length) {
                return
            }
            var e = f.val();
            if (d == "access") {
                e = parseInt(e, 10)
            }
            if (d == "related_article" || d == "remote_url") {
                e = dc.inflector.normalizeUrl(e)
            }
            if (e != a[d] && f.hasClass("change")) {
                b[d] = e
            }
        }, this));
        var c = _.any(["related_article", "remote_url"], _.bind(function (d) {
            if (b[d] && !this.validateUrl(b[d])) {
                this.$("#document_edit_" + d).addClass("error");
                return true
            }
        }, this));
        if (c) {
            return false
        }
        this.close();
        if (!_.isEmpty(b)) {
            _.each(this.docs, function (d) {
                d.save(b)
            });
            if (!_.any(this.docs, function (d) {
                return d.suppressNotifier
            })) {
                dc.ui.notifier.show({
                    mode: "info",
                    text: "Updated " + this.docs.length + " " + dc.inflector.pluralize("document", this.docs.length)
                })
            }
        }
    },
    destroy: function () {
        this.close();
        if (Documents.selected().length == 0) {
            this.docs[0].set({
                selected: true
            })
        }
        Documents.verifyDestroy(Documents.selected())
    },
    _title: function () {
        if (this.multiple) {
            return this.docs.length + " Documents"
        }
        return '"' + dc.inflector.truncate(this.docs[0].get("title"), 35) + '"'
    },
    _markChanged: function (a) {
        $(a.target).addClass("change")
    },
    _sharedAttributes: function () {
        return _.reduce(this.ATTRIBUTES, _.bind(function (b, a) {
            b[a] = Documents.sharedAttribute(this.docs, a);
            return b
        }, this), {})
    }
}, {
    open: function (a) {
        var b = Documents.chosen(a);
        if (!b.length) {
            return
        }
        if (!Documents.allowedToEdit(b)) {
            return
        }
        new dc.ui.DocumentDialog(b)
    }
});
dc.ui.DocumentEmbedDialog = dc.ui.Dialog.extend({
    events: {
        "click .preview": "preview",
        "change select": "update",
        "click select": "update",
        "keyup input": "update",
        "focus input": "update",
        "click input": "update",
        "change input": "update",
        "change .viewer_open_to": "_renderOpenTo",
        "click .next": "nextStep",
        "click .previous": "previousStep",
        "click .close": "close",
        "click .snippet": "selectSnippet",
        "click .set_publish_at": "openPublishAtDialog",
        "click .edit_access": "editAccessLevel",
        "click .remove_lines": "removeLines"
    },
    totalSteps: 3,
    STEPS: [null, null, "Step Two: Configure the Document Viewer", "Step Three: Copy and Paste the Embed Code"],
    DEMO_ERROR: 'Demo accounts are not allowed to embed documents. <a href="/contact">Contact us</a> if you need a full featured account. View an example of the embed code <a href="/help/publishing">here</a>.',
    DEFAULT_OPTIONS: {
        width: null,
        height: null,
        sidebar: true,
        text: true
    },
    constructor: function (a) {
        this.model = a;
        this.currentStep = 1;
        dc.ui.Dialog.call(this, {
            mode: "custom",
            title: this.displayTitle()
        });
        this.render()
    },
    render: function () {
        if (dc.account.organization().get("demo")) {
            return dc.ui.Dialog.alert(this.DEMO_ERROR)
        }
        dc.ui.Dialog.prototype.render.call(this);
        this.$(".custom").html(JST["workspace/document_embed_dialog"]({
            doc: this.model
        }));
        this._next = this.$(".next");
        this._previous = this.$(".previous");
        this._widthEl = this.$("input[name=width]");
        this._heightEl = this.$("input[name=height]");
        this._viewerSizeEl = this.$("select[name=viewer_size]");
        this._sidebarEl = this.$("input[name=sidebar]");
        this._showTextEl = this.$("input[name=show_text]");
        this._showPDFEl = this.$("input[name=show_pdf]");
        this._openToEl = this.$(".open_to");
        if (dc.app.preferences.get("embed_options")) {
            this._loadPreferences()
        }
        this.setMode("document_embed", "dialog");
        this.update();
        this.setStep();
        this.center();
        return this
    },
    displayTitle: function () {
        if (this.currentStep == 1) {
            return 'Step One: Review "' + dc.inflector.truncate(this.model.get("title"), 25) + '"'
        }
        return this.STEPS[this.currentStep]
    },
    preview: function () {
        var b = encodeURIComponent(JSON.stringify(this.embedOptions()));
        var a = "/documents/" + this.model.canonicalId() + "/preview?options=" + b;
        window.open(a);
        return false
    },
    update: function () {
        this._toggleDimensions();
        this._savePreferences()
    },
    embedOptions: function () {
        var b = {};
        var f = this.$(".page_select").val();
        var c = this.$(".note_select").val();
        if (this._viewerSizeEl.val() == "fixed") {
            var e = parseInt(this._widthEl.val(), 10);
            var a = parseInt(this._heightEl.val(), 10);
            if (e) {
                b.width = e
            }
            if (a) {
                b.height = a
            }
        }
        if (!this._sidebarEl.is(":checked")) {
            b.sidebar = false
        }
        if (!this._showTextEl.is(":checked")) {
            b.text = false
        }
        if (!this._showPDFEl.is(":checked")) {
            b.pdf = false
        }
        if (f) {
            b.page = parseInt(f, 10)
        }
        if (c) {
            var d = this.model.notes.get(parseInt(c, 10));
            b.page = d.get("page");
            b.note = d.id
        }
        return b
    },
    editAccessLevel: function () {
        this.close();
        Documents.editAccess([this.model])
    },
    openPublishAtDialog: function () {
        this.close();
        new dc.ui.PublicationDateDialog([this.model])
    },
    removeLines: function () {
        this.$(".snippet").val(this.$(".snippet").val().replace(/[\r\n]/g, ""))
    },
    _savePreferences: function () {
        dc.app.preferences.set({
            document_embed_options: JSON.stringify(this.embedOptions())
        })
    },
    _loadPreferences: function () {
        var a = JSON.parse(dc.app.preferences.get("document_embed_options")) || this.DEFAULT_OPTIONS;
        if (a.width || a.height) {
            this._viewerSizeEl.val("fixed")
        }
        this._widthEl.val(a.width);
        this._heightEl.val(a.height);
        this._showPDFEl.attr("checked", a.pdf);
        this._sidebarEl.attr("checked", a.sidebar);
        this._showTextEl.attr("checked", a.text)
    },
    _renderOpenTo: function (a) {
        switch ($(a.currentTarget).val()) {
            case "first_page":
                return this._openToEl.empty();
            case "page":
                return this._openToEl.html(JST["document/page_select"]({
                    doc: this.model
                }));
            case "note":
                this.model.ignoreNotes = true;
                this.model.notes.fetch({
                    success: _.bind(function () {
                        this._openToEl.html(JST["document/note_select"]({
                            doc: this.model
                        }));
                        delete this.model.ignoreNotes
                    }, this)
                })
        }
    },
    _renderEmbedCode: function () {
        var a = this.embedOptions();
        a.container = '"#DV-viewer-' + this.model.canonicalId() + '"';
        var b = _.map(a, function (d, c) {
            return c + ": " + d
        });
        this.$(".publish_embed_code").html(JST["document/embed_code"]({
            doc: this.model,
            options: b.join(",\n    "),
            rawOptions: a
        }))
    },
    _toggleDimensions: function () {
        this.$(".dimensions").toggle(this._viewerSizeEl.val() == "fixed")
    },
    saveUpdatedAttributes: function () {
        var a = this.$("input[name=access_level]").is(":checked") ? dc.access.PUBLIC : this.model.get("access");
        var b = this.$("input[name=related_article]").removeClass("error").val();
        var c = {
            access: a,
            related_article: dc.inflector.normalizeUrl(b)
        };
        if (c = this.model.changedAttributes(c)) {
            var d = _.any(["related_article"], _.bind(function (e) {
                if (c[e] && !this.validateUrl(c[e])) {
                    this.$("input[name=" + e + "]").addClass("error");
                    return true
                }
            }, this));
            if (d) {
                return false
            }
            dc.ui.spinner.show();
            this.model.save(c, {
                success: function () {
                    dc.ui.spinner.hide()
                }
            })
        }
        return true
    },
    nextStep: function () {
        if (this.currentStep == 1 && !this.saveUpdatedAttributes()) {
            return false
        }
        if (this.currentStep >= this.totalSteps) {
            return this.close()
        }
        if (this.currentStep == 2) {
            this._renderEmbedCode()
        }
        this.currentStep += 1;
        this.setStep()
    },
    previousStep: function () {
        if (this.currentStep > 1) {
            this.currentStep -= 1
        }
        this.setStep()
    },
    setStep: function () {
        this.title(this.displayTitle());
        this.$(".publish_step").setMode("not", "enabled");
        this.$(".publish_step_" + this.currentStep).setMode("is", "enabled");
        this.info("Step " + this.currentStep + " of " + this.totalSteps, true);
        var b = this.currentStep == 1;
        var a = this.currentStep == this.totalSteps;
        this._previous.setMode(b ? "not" : "is", "enabled");
        this._next.html(a ? "Finish" : "Next &raquo;").setMode("is", "enabled")
    },
    selectSnippet: function () {
        this.$(".snippet").select()
    }
});
dc.ui.DocumentList = Backbone.View.extend({
    SLOP: 3,
    id: "document_list",
    events: {
        mousedown: "_startDeselect",
        click: "_endDeselect"
    },
    constructor: function (a) {
        Backbone.View.call(this, a);
        _.bindAll(this, "reset", "_removeDocument", "_addDocument", "_onSelect", "_maybeSelectOrDelete");
        $(document).bind("keydown", this._maybeSelectOrDelete);
        Documents.bind("reset", this.reset);
        Documents.bind("remove", this._removeDocument);
        Documents.bind("add", this._addDocument)
    },
    render: function () {
        $(".search_tab_content").selectable({
            ignore: ".noselect, .minibutton",
            select: ".icon.doc",
            onSelect: this._onSelect
        });
        return this
    },
    reset: function () {
        $(window).unbind("resize.entities");
        $(this.el).html("");
        var a = Documents.map(function (b) {
            return (new dc.ui.Document({
                model: b
            })).render({
                    notes: true
                }).el
        });
        $(this.el).append(a.concat(this.make("div", {
            "class": "clear"
        })))
    },
    _onSelect: function (a) {
        var b = {};
        _.each(a, function (c) {
            var d = $(c).attr("data-id");
            b[d] = true;
            Documents.get(d).set({
                selected: true
            })
        });
        if (!dc.app.hotkeys.shift && !dc.app.hotkeys.command) {
            _.each(Documents.selected(), function (c) {
                if (!b[c.id]) {
                    c.set({
                        selected: false
                    })
                }
            })
        }
    },
    _maybeSelectOrDelete: function (c) {
        var a = Documents.selectedCount && (c.which == 8);
        var b = dc.app.hotkeys.command && (c.which == 97 || c.which == 65);
        if (!(b || a) || $(c.target).closest("input, textarea").length) {
            return
        }
        if (b) {
            Documents.selectAll()
        } else {
            if (a) {
                Documents.verifyDestroy(Documents.selected())
            }
        }
        return false
    },
    _startDeselect: function (a) {
        this._pageX = a.pageX;
        this._pageY = a.pageY
    },
    _endDeselect: function (a) {
        if (dc.app.hotkeys.shift || dc.app.hotkeys.command || dc.app.hotkeys.control) {
            return
        }
        if ($(a.target).hasClass("doc_title") || $(a.target).hasClass("doc") || $(a.target).hasClass("edit_glyph")) {
            return
        }
        if ((Math.abs(a.pageX - this._pageX) > this.SLOP) || (Math.abs(a.pageY - this._pageY) > this.SLOP)) {
            return
        }
        Documents.deselectAll()
    },
    _addDocument: function (b) {
        var a = new dc.ui.Document({
            model: b
        });
        $(this.el).prepend(a.render().el)
    },
    _removeDocument: function (a) {
        $("#document_" + a.id).remove()
    }
});
dc.ui.Note = Backbone.View.extend({
    className: "note noselect",
    events: {
        "click .title_link": "viewNoteInDocument",
        "click .edit_note": "editNote",
        "click .cancel_note": "cancelNote",
        "click .save_note": "saveNote",
        "click .save_draft_note": "saveNote",
        "click .delete_note": "deleteNote"
    },
    constructor: function (a) {
        Backbone.View.call(this, a);
        _.bindAll(this, "render");
        this.model.bind("change", this.render)
    },
    render: function () {
        var a = _.extend(this.model.toJSON(), {
            note: this.model,
            ownsNote: true,
            disableLinks: this.options.disableLinks || false
        });
        $(this.el).html(JST["document/note"](a));
        this.setMode("display", "visible");
        this.setMode(this.model.get("access"), "access");
        this.setMode(this.model.checkAllowedToEdit() ? "is" : "not", "editable");
        return this
    },
    center: function () {
        var d = this.$(".note_excerpt");
        var c = this.model.coordinates();
        if (!c) {
            return
        }
        var e = c.left + (c.width / 2);
        var a = d.closest(".note_excerpt_wrap").width();
        var b = a / 2;
        if (c.left + c.width > a) {
            if (c.width > a) {
                d.css("left", -1 * c.left)
            } else {
                d.css("left", b - e)
            }
        }
    },
    viewNoteInDocument: function () {
        var a = "#document/p" + this.model.get("page") + "/a" + this.model.get("id");
        window.open(this.model.document().viewerUrl() + a)
    },
    editNote: function () {
        if (!this.model.checkAllowedToEdit()) {
            return dc.ui.Dialog.alert("You don't have permission to edit this note.")
        }
        this.$(".note_title_input").val(this.model.get("title"));
        this.$(".note_text_edit").val(this.model.get("content"));
        this.setMode("edit", "visible")
    },
    cancelNote: function () {
        this.setMode("display", "visible")
    },
    saveNote: function (b) {
        var a = this.model.get("access");
        if ($(b.target).hasClass("save_draft_note")) {
            a = "exclusive"
        } else {
            if (this.model.get("access") == "exclusive") {
                a = "public"
            }
        }
        this.model.save({
            title: this.$(".note_title_input").val(),
            content: this.$(".note_text_edit").val(),
            access: a
        });
        this.render()
    },
    deleteNote: function () {
        dc.ui.Dialog.confirm("Are you sure you want to delete this note?", _.bind(function () {
            this.model.destroy({
                success: _.bind(function () {
                    $(this.el).remove();
                    this.model.document().decrementNotes()
                }, this)
            });
            return true
        }, this))
    }
});
dc.ui.NoteEmbedDialog = dc.ui.Dialog.extend({
    events: {
        "change select": "update",
        "click select": "update",
        "click .next": "nextStep",
        "click .previous": "previousStep",
        "click .close": "close",
        "click .snippet": "selectSnippet",
        "click .set_publish_at": "openPublishAtDialog",
        "click .edit_access": "editAccessLevel",
        "click .remove_lines": "removeLines"
    },
    totalSteps: 2,
    STEPS: [null, "Step One: Select a Note to Embed", "Step Two: Copy and Paste the Embed Code"],
    DEMO_ERROR: 'Demo accounts are not allowed to embed notes. <a href="/contact">Contact us</a> if you need a full featured account. View an example of the embed code <a href="/help/publishing#step_5">here</a>.',
    DEFAULT_OPTIONS: {},
    constructor: function (a, b) {
        this.currentStep = 1;
        this.doc = a;
        this.initialNoteId = b;
        this.height = 0;
        dc.ui.Dialog.call(this, {
            mode: "custom",
            title: this.displayTitle()
        });
        dc.ui.spinner.show();
        this.fetchNotes()
    },
    fetchNotes: function () {
        this.doc.notes.fetch({
            silent: true,
            success: _.bind(function () {
                dc.ui.spinner.hide();
                this.render()
            }, this)
        })
    },
    render: function () {
        if (dc.account.organization().get("demo")) {
            return dc.ui.Dialog.alert(this.DEMO_ERROR)
        }
        dc.ui.Dialog.prototype.render.call(this);
        this.$(".custom").html(JST["workspace/note_embed_dialog"]({
            doc: this.doc,
            notes: this.doc.notes.select(function (a) {
                return a.get("access") == "public"
            }),
            initialNoteId: this.initialNoteId
        }));
        this._next = this.$(".next");
        this._previous = this.$(".previous");
        this._noteSelectEl = this.$("select[name=note]");
        this._preview = this.$(".note_preview");
        this.setMode("embed", "dialog");
        this.setMode("note_embed", "dialog");
        this.update();
        this.setStep();
        this.center();
        dc.ui.spinner.hide();
        return this
    },
    displayTitle: function () {
        return this.STEPS[this.currentStep]
    },
    update: function () {
        var a = parseInt(this._noteSelectEl.val(), 10);
        this.note = this.doc.notes.get(a);
        this._renderNote();
        this._renderEmbedCode();
        if (this._preview.height() > this.height) {
            this.center();
            this.height = this._preview.height()
        }
    },
    removeLines: function () {
        this.$(".snippet").val(this.$(".snippet").val().replace(/[\r\n]/g, ""))
    },
    _renderNote: function () {
        var a = new dc.ui.Note({
            model: this.note,
            collection: this.doc.notes,
            disableLinks: true
        });
        this.$(".note_preview").html(a.render().el);
        a.center()
    },
    embedOptions: function () {
        var a = {};
        return a
    },
    _renderEmbedCode: function () {
        var a = this.embedOptions();
        var b = _.map(a, function (d, c) {
            return c + ": " + d
        });
        this.$(".publish_embed_code").html(JST["workspace/note_embed_code"]({
            note: this.note,
            options: b.join(",\n    ")
        }))
    },
    nextStep: function () {
        this.currentStep += 1;
        if (this.currentStep > this.totalSteps) {
            return this.close()
        }
        if (this.currentStep == 2) {
            this.update()
        }
        this.setStep()
    },
    previousStep: function () {
        if (this.currentStep > 1) {
            this.currentStep -= 1
        }
        this.setStep()
    },
    setStep: function () {
        this.title(this.displayTitle());
        this.$(".publish_step").setMode("not", "enabled");
        this.$(".publish_step_" + this.currentStep).setMode("is", "enabled");
        this.info("Step " + this.currentStep + " of " + this.totalSteps, true);
        var b = this.currentStep == 1;
        var a = this.currentStep == this.totalSteps;
        this._previous.setMode(b ? "not" : "is", "enabled");
        this._next.html(a ? "Finish" : "Next &raquo;").setMode("is", "enabled")
    },
    selectSnippet: function () {
        this.$(".snippet").select()
    },
    editAccessLevel: function () {
        this.close();
        Documents.editAccess([this.doc])
    },
    openPublishAtDialog: function () {
        this.close();
        new dc.ui.PublicationDateDialog([this.doc])
    }
});
dc.ui.PublicationDateDialog = dc.ui.Dialog.extend({
    id: "pubdate_dialog",
    className: "dialog",
    events: {
        "click .cancel": "close",
        "click .ok": "save",
        "click .delete": "removeDate",
        "click .public_now": "editAccess"
    },
    constructor: function (b) {
        if (!Documents.allowedToEdit(b)) {
            return
        }
        this.docs = b;
        this.multiple = b.length > 1;
        var a = "Set Publication Date for " + this._title();
        dc.ui.Dialog.call(this, {
            mode: "custom",
            title: a,
            editor: true,
            closeText: "Cancel",
            deleteText: "Remove"
        });
        this.render();
        $(document.body).append(this.el)
    },
    render: function () {
        dc.ui.Dialog.prototype.render.call(this);
        this._container = this.$(".custom");
        var b = Documents.sharedAttribute(this.docs, "publish_at");
        var a = 60 * 60 * 1000;
        this._container.html(JST["document/publication_date_dialog"]({
            multiple: this.multiple,
            date: b ? DateUtils.parseRfc(b) : new Date(+(new Date) + a)
        }));
        this.center();
        return this
    },
    editAccess: function () {
        this.close();
        Documents.editAccess(this.docs)
    },
    save: function () {
        var a = this._getDate();
        if (a < new Date) {
            this.close();
            dc.ui.Dialog.alert("You can't set a document to be published in the past.");
            return
        }
        var b = JSON.stringify(a);
        _.each(this.docs, function (c) {
            c.save({
                publish_at: b
            })
        });
        this.close()
    },
    removeDate: function () {
        _.each(this.docs, function (a) {
            a.save({
                publish_at: null
            })
        });
        this.close()
    },
    _title: function () {
        if (this.multiple) {
            return this.docs.length + " Documents"
        }
        return '"' + dc.inflector.truncate(this.docs[0].get("title"), 35) + '"'
    },
    _getDate: function () {
        return new Date(this.$(".date_year").val(), parseInt(this.$(".date_month").val(), 10) - 1, this.$(".date_day").val(), this.$(".date_hour").val())
    }
});
dc.ui.SparkEntities = Backbone.View.extend({
    BLOCK_WIDTH: 275,
    LEFT_WIDTH: 120,
    RIGHT_MARGIN: 50,
    MAX_WIDTH: 700,
    TOOLTIP_DELAY: 200,
    RESIZE_DELAY: 333,
    SEARCH_DISTANCE: 5,
    events: {
        "click .cancel_search": "hide",
        "click .show_all": "renderKind",
        "click .entity_line_title": "_showPages",
        "click .entity_list_title": "_showPages",
        "click .entity_bucket_wrap": "_openEntity",
        "click .arrow.left": "render",
        "mouseleave .entity_buckets": "hideTooltip",
        "mouseenter .entity_bucket_wrap": "_onMouseEnter",
        "mouseleave .entity_bucket_wrap": "_onMouseLeave"
    },
    initialize: function () {
        this.template = JST["document/entities"];
        this.options.container.append(this.el);
        this.showLater = _.debounce(this.showLater, this.TOOLTIP_DELAY);
        this.rerenderLater = _.debounce(_.bind(this.rerender, this), this.RESIZE_DELAY);
        this._renderState = {
            doc: this.model,
            distance: this.SEARCH_DISTANCE
        }
    },
    show: function () {
        this._open = true;
        $(window).bind("resize.entities", this.rerenderLater);
        this.render()
    },
    render: function () {
        this._renderState.only = false;
        this.rerender();
        return this
    },
    renderKind: function (a) {
        this._renderState.only = $(a.currentTarget).attr("data-kind");
        this.rerender();
        this.model.trigger("focus")
    },
    calculateWidth: function () {
        var a = $(this.el).width();
        if (this._renderState.only) {
            return Math.min(a - (this.LEFT_WIDTH + this.RIGHT_MARGIN), this.MAX_WIDTH)
        } else {
            var b = Math.floor(a / (this.BLOCK_WIDTH + this.LEFT_WIDTH + this.RIGHT_MARGIN));
            return Math.min(Math.floor((a - ((this.LEFT_WIDTH + this.RIGHT_MARGIN) * b)) / b), this.MAX_WIDTH)
        }
    },
    rerender: function () {
        this.options.container.show();
        var a = _.extend(this._renderState, {
            width: this.calculateWidth()
        });
        $(this.el).html(this.template(a))
    },
    hide: function () {
        this._open = false;
        $(window).unbind("resize.entities", this.rerenderLater);
        $(this.el).html("");
        this.options.container.hide()
    },
    showTooltip: function () {
        if (!this._current) {
            return
        }
        var a;
        var b = _.bind(function (c) {
            if (this._current) {
                dc.ui.tooltip.show({
                    left: this._current.offset().left,
                    top: this._current.offset().top + 15,
                    title: this._entity.get("value"),
                    text: "<b>p." + c.page_number + "</b> " + dc.inflector.trimExcerpt(c.excerpt),
                    leaveOpen: true
                })
            }
        }, this);
        if (a = this._entity.excerpts[this._occurrence]) {
            b(a)
        } else {
            this.showLater(b)
        }
    },
    showLater: function (a) {
        if (this._current) {
            this._entity.loadExcerpt(this._occurrence, a)
        }
    },
    hideTooltip: function () {
        dc.ui.tooltip.hide()
    },
    _setCurrent: function (k) {
        var n;
        var g = "data-occurrence";
        var c = $(k.currentTarget);
        if (c.hasClass("occurs")) {
            var n = c
        } else {
            var j = c.index();
            var d = c.parent().children();
            for (var h = 1, f = this.SEARCH_DISTANCE; h <= f; h++) {
                var a = d[j + h],
                    m = d[j - h];
                if (c = ($(a).hasClass("occurs") && $(a)) || ($(m).hasClass("occurs") && $(m))) {
                    break
                }
            }
        } if (!c) {
            this.hideTooltip();
            return false
        }
        c.addClass("active");
        this._current = c;
        this._occurrence = c.find(".entity_bucket").attr(g);
        var b = c.closest(".entity_line").attr("data-id");
        this._entity = this.model.entities.get(b);
        return true
    },
    _openEntity: function (a) {
        if (!this._setCurrent(a)) {
            return
        }
        this.model.openEntity(this._entity.id, this._occurrence.split(":")[0])
    },
    _onMouseEnter: function (a) {
        if (!this._setCurrent(a)) {
            return
        }
        this.showTooltip()
    },
    _onMouseLeave: function () {
        if (this._current) {
            this._current.removeClass("active")
        }
        this._occurrence = this._entity = this._current = null
    },
    _showPages: function (a) {
        var b = $(a.currentTarget).closest("[data-id]").attr("data-id");
        dc.model.Entity.fetchId(this.model.id, b, _.bind(function (c) {
            this.hide();
            this.model.pageEntities.reset(c)
        }, this))
    }
});
dc.ui.UploadDialog = dc.ui.Dialog.extend({
    id: "upload_dialog",
    className: "dialog",
    INSERT_PAGES_MESSAGE: "This document will close while it's being rebuilt. Long documents may take a long time to rebuild.",
    constructor: function (a) {
        var b = {
            editable: true,
            insertPages: false,
            autostart: false,
            collection: UploadDocuments,
            mode: "custom",
            title: "Upload Documents",
            saveText: "Upload",
            closeText: "Cancel",
            multiFileUpload: false
        };
        a = _.extend({}, b, a);
        _.bindAll(this, "setupUpload", "_countDocuments", "cancelUpload", "_onSelect", "_onProgress", "_onComplete", "_onAllComplete");
        dc.ui.Dialog.call(this, a);
        if (a.autostart) {
            $(this.el).addClass("autostart")
        }
        if (dc.app.navigation) {
            dc.app.navigation.bind("tab:documents", _.bind(function () {
                _.defer(this.setupUpload)
            }, this))
        }
        this.collection.bind("add", this._countDocuments);
        this.collection.bind("remove", this._countDocuments)
    },
    render: function () {
        this.options.multiFileUpload = window.FileList && ($("input[type=file]")[0].files instanceof FileList);
        this._tiles = {};
        this._project = _.first(Projects.selected());
        var a = {};
        if (this._project) {
            var b = dc.inflector.truncate(this._project.get("title"), 35);
            a.information = "Project: " + b
        }
        dc.ui.Dialog.prototype.render.call(this, a);
        this.$(".custom").html(JST["document/upload_dialog"]());
        this._list = this.$(".upload_list");
        this._renderDocumentTiles();
        this._countDocuments();
        this.center();
        if (!this.options.autostart) {
            this.checkQueueLength()
        }
        return this
    },
    _renderDocumentTiles: function () {
        var a = this._tiles;
        var b = this.options.editable;
        var d = this.options.multiFileUpload;
        this.collection.each(function (f) {
            var e = new dc.ui.UploadDocumentTile({
                editable: b,
                model: f,
                multiFileUpload: d
            });
            a[f.id] = e.render()
        });
        var c = _.pluck(_.values(a), "el");
        this._list.append(c)
    },
    setupUpload: function () {
        if (this.form || (dc.app.navigation && !dc.app.navigation.isOpen("documents"))) {
            return
        }
        var a = "/import/upload_document";
        if (this.options.insertPages) {
            a = "/documents/" + this.options.documentId + "/upload_insert_document"
        }
        this.form = $("#new_document_form");
        this.form.fileUpload({
            url: a,
            onAbort: this.cancelUpload,
            initUpload: this._onSelect,
            onProgress: this._onProgress,
            onLoad: this._onComplete,
            dragDropSupport: true,
            dropZone: $("body")
        })
    },
    setupFileInput: function () {
        var a = $("#new_document_input");
        a.show().change(_.bind(function () {
            this._project = _.first(Projects.selected());
            $("#new_document_project").val(this._project ? this._project.id : "");
            $("#new_document_form").submit()
        }, this))
    },
    _onSelect: function (f, d, a, g, c, h) {
        var b = d[a];
        this.collection.add(new dc.model.UploadDocument({
            id: dc.inflector.sluggify(b.fileName || b.name),
            uploadIndex: a,
            file: b,
            position: a,
            handler: c,
            xhr: g,
            startUpload: h
        }));
        if (a != d.length - 1) {
            return
        }
        if (this.collection.any(function (e) {
            return e.overSizeLimit()
        })) {
            this.close();
            return dc.ui.Dialog.alert('You can only upload documents less than 200MB in size. Please <a href="/help/troubleshooting">optimize your document</a> before continuing.')
        }
        this.render();
        if (this.options.autostart) {
            this.startUpload(a)
        }
    },
    cancelUpload: function (a) {
        if (this.collection.length <= 1) {
            this.error("You must upload at least one document.");
            return false
        }
        return true
    },
    _uploadData: function (e, d) {
        var c = this._tiles[e].serialize();
        var b = this.collection.get(e);
        var a = this.options;
        b.set(c);
        if (a.multiFileUpload && b.get("size")) {
            c.multi_file_upload = true
        }
        c.authenticity_token = $("meta[name='csrf-token']").attr("content");
        if (this.$("#make_public").is(":checked")) {
            c.make_public = true
        }
        c.email_me = this.$("#email_on_complete").is(":checked") ? this.collection.length : 0;
        if (this._project) {
            c.project = this._project.id
        }
        if (_.isNumber(a.insertPageAt)) {
            c.insert_page_at = a.insertPageAt
        }
        if (_.isNumber(a.replacePagesStart)) {
            c.replace_pages_start = a.replacePagesStart
        }
        if (_.isNumber(a.replacePagesEnd)) {
            c.replace_pages_end = a.replacePagesEnd
        }
        if (a.documentId) {
            c.document_id = a.documentId
        }
        if (a.insertPages) {
            c.document_number = d + 1
        }
        if (a.insertPages) {
            c.document_count = this.collection.length
        }
        if (!a.autostart) {
            this.showSpinner()
        }
        this._list[0].scrollTop = 0;
        return c
    },
    _onProgress: function (f, d, b, g, c) {
        var h = dc.inflector.sluggify(d[b].fileName || d[b].name);
        var a = parseInt((f.loaded / f.total) * 100, 10);
        this._tiles[h].setProgress(a)
    },
    _onComplete: function (d, c, a, g, b) {
        var h = dc.inflector.sluggify(c[a].fileName || c[a].name);
        var f = g.responseText && JSON.parse(g.responseText);
        this._tiles[h].setProgress(100);
        if (f && f.bad_request) {
            return this.error("Upload failed.")
        } else {
            if (!this.options.insertPages && f) {
                Documents.add(new dc.model.Document(f));
                if (this._project) {
                    Projects.incrementCountById(this._project.id)
                }
            } else {
                if (this.options.insertPages && f) {
                    this.documentResponse = f
                }
            }
        }
        this._tiles[h].hide();
        if (a == this.collection.length - 1) {
            this._onAllComplete()
        } else {
            this.startUpload(a + 1)
        }
    },
    _onAllComplete: function () {
        this.hideSpinner();
        if (this.options.insertPages) {
            try {
                window.opener && window.opener.Documents && window.opener.Documents.get(this.options.documentId).set(this.documentResponse)
            } catch (a) {}
            dc.ui.Dialog.alert(this.INSERT_PAGES_MESSAGE, {
                onClose: function () {
                    window.close();
                    _.defer(dc.ui.Dialog.alert, "The pages are being processed. Please close this document.")
                }
            })
        }
        this.close()
    },
    _countDocuments: function () {
        var a = this.collection.length;
        this.title("Upload " + (a > 1 ? a : "") + dc.inflector.pluralize(" Document", a));
        var b = dc.inflector.pluralize("document", a);
        this.$(".upload_public_count").text(b);
        this.$(".upload_email_count").text("the " + b + (a == 1 ? " has" : " have"))
    },
    checkQueueLength: function () {
        $.getJSON("/documents/queue_length.json", {}, _.bind(function (b) {
            var a = b.queue_length;
            if (a <= 0) {
                return
            }
            var c = a > 1 ? "are" : "is";
            this.info("There " + c + " " + a + " " + dc.inflector.pluralize("document", a) + " currently being processed.", true)
        }, this))
    },
    insertPagesAttrs: function (a) {
        _.each(a, _.bind(function (c, b) {
            this.options[b] = c
        }, this))
    },
    confirm: function () {
        var a = _.select(this._tiles, function (c) {
            return c.ensureTitle()
        });
        if (a.length) {
            var b = this.collection.length;
            return this.error("Please enter a title for " + (b == 1 ? "the document." : "all documents."))
        }
        this.$(".ok").setMode("not", "enabled");
        this.startUpload(0)
    },
    startUpload: function (b) {
        var a = this._tiles;
        var c = this.collection.models[b];
        c.get("handler").formData = this._uploadData(c.get("id"), b);
        c.get("startUpload")();
        a[c.get("id")].startProgress()
    },
    cancel: function () {
        this.close()
    },
    close: function () {
        this.collection.reset();
        dc.ui.Dialog.prototype.close.call(this)
    }
});
dc.ui.UploadDocumentTile = Backbone.View.extend({
    className: "row",
    events: {
        "click .remove_queue": "removeUploadFile",
        "click .open_edit": "openEdit",
        "click .apply_all": "applyAll"
    },
    render: function () {
        var a = JST["document/upload_document_tile"]({
            editable: this.options.editable,
            autostart: this.options.autostart,
            model: this.model,
            multiFileUpload: this.options.multiFileUpload
        });
        $(this.el).html(a);
        this._title = this.$("input[name=title]");
        this._progress = this.$(".progress_bar");
        return this
    },
    serialize: function () {
        return {
            title: this._title.val(),
            description: this.$("textarea[name=description]").val(),
            source: this.$("input[name=source]").val(),
            access: this.$("select[name=access]").val(),
            language: this.$("select[name=language]").val()
        }
    },
    removeUploadFile: function () {
        if (dc.app.uploader.cancelUpload(this.model.get("uploadIndex"))) {
            this.hide();
            this.model.get("xhr").abort();
            UploadDocuments.remove(this.model)
        }
    },
    applyAll: function () {
        var b = dc.app.uploader.el;
        var a = this.serialize();
        $("textarea[name=description]", b).val(a.description);
        $("input[name=source]", b).val(a.source);
        $("select[name=access]", b).val(a.access);
        $("select[name=language]", b).val(a.language);
        dc.app.uploader.info("Update applied to all files.")
    },
    openEdit: function () {
        this.$(".upload_edit").toggle();
        this.$(".open_edit").toggleClass("active")
    },
    startProgress: function () {
        this._percentage = 0;
        if (this.options.multiFileUpload) {
            this._progress.show()
        }
    },
    setProgress: function (a) {
        if (a <= this._percentage) {
            return
        }
        this._percentage = a;
        this._progress.stop(true).animate({
            width: a + "%"
        }, {
            queue: false,
            duration: 400
        })
    },
    ensureTitle: function () {
        var a = dc.inflector.trim(this._title.val()) == "";
        this._title.closest(".text_input").toggleClass("error", a);
        return a
    },
    hide: function () {
        $(this.el).animate({
            opacity: 0
        }, 200).slideUp(200, function () {
                $(this).remove()
            })
    }
});
dc.ui.EntityList = Backbone.View.extend({
    id: "entities",
    events: {
        "click .row": "_filterFacet",
        "click .cancel_search": "_removeFacet",
        "click .more": "_loadFacet",
        "click .less": "_showLess",
        "click .show_pages": "_showPages"
    },
    ENTITY_KINDS: ["city", "country", "term", "state", "person", "place", "organization", "email", "phone"],
    renderFacets: function (d, a, c) {
        this._docCount = c;
        var b = this.extractEntities(dc.app.searchBox.value());
        _.each(b, function (f) {
            var g = d[f.type];
            if (!g) {
                return
            }
            var e = null;
            var h = _.detect(g, function (k, j) {
                e = j;
                return k.value.toLowerCase() == f.value.toLowerCase()
            });
            if (h) {
                h.active = true;
                g.splice(e, 1)
            } else {
                h = {
                    value: f.value,
                    count: c,
                    active: true
                };
                g.pop()
            }
            d[f.type].unshift(h)
        });
        this._facets = d;
        $(this.el).html(JST["workspace/entities"]({
            entities: d,
            limit: a
        }));
        dc.app.scroller.checkLater()
    },
    mergeFacets: function (c, a, b) {
        this.renderFacets(_.extend(this._facets, c), a, b)
    },
    _facetValueFor: function (b) {
        var d = $(b).closest(".row");
        var c = d.attr("data-value");
        var a = d.attr("data-category");
        return {
            category: a,
            value: c
        }
    },
    _filterFacet: function (a) {
        var b = this._facetValueFor(a.target);
        dc.app.searcher.addToSearch(b.category, b.value)
    },
    _removeFacet: function (a) {
        $(a.target).closest(".row").removeClass("active");
        var b = this._facetValueFor(a.target);
        dc.app.searcher.removeFromSearch(b.category);
        return false
    },
    _loadFacet: function (a) {
        $(a.target).html("loading &hellip;");
        dc.app.searcher.loadFacet($(a.target).attr("data-category"))
    },
    _showLess: function (b) {
        var a = $(b.target).attr("data-category");
        this._facets[a].splice(6);
        this.renderFacets(this._facets, 5, this._docCount)
    },
    _showPages: function (h) {
        var d = $(h.target).closest(".row");
        var c = d.attr("data-category");
        var f = d.attr("data-value");
        var g = d.hasClass("active");
        var a = _.bind(function () {
            dc.model.Entity.fetch(c, f, this._connectExcerpts)
        }, this);
        var b = a;
        if (!g) {
            var j = this._facetValueFor(d);
            b = _.bind(function () {
                dc.app.searcher.addToSearch(j.category, j.value, a)
            }, this)
        }
        dc.app.paginator.ensureRows(b);
        return false
    },
    _connectExcerpts: function (b) {
        var a = _.reduce(b, function (c, e) {
            var d = e.get("document_id");
            c[d] = c[d] || [];
            c[d].push(e);
            return c
        }, {});
        _.each(a, function (c) {
            Documents.get(c[0].get("document_id")).pageEntities.reset(c)
        })
    },
    extractEntities: function (a) {
        var b = VS.app.searchQuery.filter(_.bind(function (c) {
            return _.include(this.ENTITY_KINDS, c.get("category"))
        }, this));
        return _.sortBy(_.map(b, function (c) {
            return {
                type: c.get("category"),
                value: c.get("value")
            }
        }), function (c) {
            return c.value.toLowerCase()
        }).reverse()
    }
});
dc.ui.TimelineDialog = dc.ui.Dialog.extend({
    GRAPH_OPTIONS: {
        xaxis: {
            mode: "time",
            minTickSize: [1, "day"]
        },
        yaxis: {
            ticks: [],
            min: -0.5
        },
        selection: {
            mode: "x",
            color: "#09f"
        },
        legend: {
            show: false
        },
        series: {
            lines: {
                show: false
            },
            points: {
                show: true,
                radius: 4,
                fill: true,
                fillColor: "rgba(255, 255, 235, 0.7)"
            }
        },
        grid: {
            backgroundColor: "#fff",
            tickColor: "#ddd",
            borderWidth: 0,
            hoverable: true,
            clickable: true
        }
    },
    ROW_HEIGHT: 50,
    MIN_HEIGHT: 100,
    DATE_FORMAT: "%b %d, %y",
    POINT_COLOR: "#555",
    id: "timeline_dialog",
    events: {
        "click .zoom_out": "_zoomOut",
        "click .ok": "confirm",
        "plothover .timeline_plot": "_showTooltop",
        "plotselected .timeline_plot": "_zoomIn",
        "plotclick .timeline_plot": "_openPage"
    },
    constructor: function (a) {
        this.documents = a;
        dc.ui.Dialog.call(this, {
            mode: "custom",
            title: this.displayTitle(),
            information: "Drag a range of dates to zoom in."
        });
        dc.ui.spinner.show();
        this._loadDates()
    },
    render: function () {
        dc.ui.Dialog.prototype.render.call(this);
        this.$(".custom").html(JST["document/timeline"]({
            docs: this.documents,
            minHeight: this.MIN_HEIGHT,
            rowHeight: this.ROW_HEIGHT
        }));
        this._zoomButton = this.make("span", {
            "class": "minibutton zoom_out dark not_enabled"
        }, "Zoom Out");
        this.addControl(this._zoomButton);
        this.center();
        return this
    },
    displayTitle: function () {
        if (this.documents.length == 1) {
            return 'Timeline for "' + dc.inflector.truncate(this.documents[0].get("title"), 55) + '"'
        }
        return "Timeline for " + this.documents.length + " Documents"
    },
    drawPlot: function () {
        $.plot(this.$(".timeline_plot"), this._data, this._options)
    },
    _loadDates: function () {
        var a = _.pluck(this.documents, "id");
        $.getJSON("/documents/dates", {
            "ids[]": a
        }, _.bind(this._plotDates, this))
    },
    _plotDates: function (e) {
        dc.ui.spinner.hide();
        if (e.dates.length == 0) {
            return this._noDates()
        }
        this.render();
        var a = this.POINT_COLOR;
        var b = {}, d = {}, c = this._dateIds = {};
        _.each(this.documents, function (g, f) {
            c[g.id] = {};
            b[g.id] = [];
            d[g.id] = {
                pos: f,
                color: a
            }
        });
        _.each(e.dates, function (h) {
            var g = h.document_id;
            var f = h.date * 1000;
            c[g][f] = h.id;
            b[g].push([f, d[g].pos])
        });
        this._data = _.map(b, function (g, f) {
            return {
                data: g,
                color: d[f].color,
                docId: parseInt(f, 10)
            }
        });
        this._options = _.clone(this.GRAPH_OPTIONS);
        this._options.xaxis.min = null;
        this._options.xaxis.max = null;
        this._options.yaxis.max = this.documents.length - 0.5;
        this._options.yaxis.ticks = _.map(this.documents, function (f) {
            return [d[f.id].pos, dc.inflector.truncate(f.get("title"), 30)]
        });
        this.drawPlot()
    },
    _showTooltop: function (d, g, c) {
        this._pos = g;
        if (this._request) {
            return
        }
        if (!c) {
            return dc.ui.tooltip.hide()
        }
        var b = c.series.docId;
        var f = this._dateIds[b][c.datapoint[0]];
        var a = EntityDates.get(f);
        if (a) {
            return this._renderTooltip(a)
        }
        this._request = $.getJSON("/documents/dates", {
            id: f
        }, _.bind(function (h) {
            delete this._request;
            if (!h) {
                return
            }
            var e = new dc.model.Entity(h.date);
            EntityDates.add(e);
            this._renderTooltip(e)
        }, this))
    },
    _renderTooltip: function (b) {
        var c = dc.inflector.truncate(Documents.get(b.get("document_id")).get("title"), 45);
        var a = b.get("excerpts")[0];
        dc.ui.tooltip.show({
            left: this._pos.pageX,
            top: this._pos.pageY,
            title: c,
            text: "<b>p." + a.page_number + "</b> " + dc.inflector.trimExcerpt(a.excerpt)
        })
    },
    _openPage: function (d, f, a) {
        if (!a) {
            return
        }
        var c = a.datapoint[0] / 1000;
        var b = Documents.get(a.series.docId);
        window.open(b.viewerUrl() + "?date=" + c)
    },
    _zoomIn: function (b, a) {
        $(this._zoomButton).setMode("is", "enabled");
        this._options.xaxis.min = a.xaxis.from;
        this._options.xaxis.max = a.xaxis.to;
        this.drawPlot()
    },
    _zoomOut: function () {
        $(this._zoomButton).setMode("not", "enabled");
        this._options.xaxis.min = null;
        this._options.xaxis.max = null;
        this.drawPlot()
    },
    _noDates: function () {
        var b = this.documents.length;
        this.close();
        var a = "None of the " + b + " documents contained recognizable dates.";
        if (b <= 1) {
            a = 'We were unable to recognize any dates for "' + this.documents[0].get("title") + '"'
        }
        dc.ui.Dialog.alert(a)
    }
});
dc.ui.Organizer = Backbone.View.extend({
    id: "organizer",
    PRIVATE_SEARCHES: ["all_documents", "your_documents", "your_published_documents"],
    PUBLIC_SEARCHES: ["all_documents", "annotated_documents", "published_documents", "popular_documents"],
    events: {
        "click #new_project": "promptNewProject",
        "click .all_documents": "showAllDocuments",
        "click .your_documents": "showYourDocuments",
        "click .org_documents": "showOrganizationDocuments",
        "click .annotated_documents": "showAnnotatedDocuments",
        "click .published_documents": "showPublishedDocuments",
        "click .popular_documents": "showPopularDocuments",
        "click .your_published_documents": "showYourPublishedDocuments",
        "click .account_links .text_link": "showAccountDocuments",
        "click .toggle_account_links": "toggleAccountLinks",
        "click .organization.box": "showOtherOrgDocuments"
    },
    initialize: function (a) {
        _.bindAll(this, "_addSubView", "_removeSubView", "renderAccounts");
        this._bindToSets();
        this.subViews = []
    },
    render: function () {
        var a = dc.account ? this.PRIVATE_SEARCHES : this.PUBLIC_SEARCHES;
        $(this.el).append(JST["organizer/sidebar"]({
            searches: a
        }));
        this.projectInputEl = this.$("#project_input");
        this.projectList = this.$(".project_list");
        this.sidebar = $("#sidebar");
        this.renderAccounts();
        this.renderAll();
        return this
    },
    renderAll: function () {
        if (dc.account) {
            if (Projects.isEmpty()) {
                this.setMode("no", "projects")
            }
            Projects.each(this._addSubView)
        } else {
            this.$(".organization_list").html(JST["organizer/organizations"]())
        }
    },
    renderAccounts: function () {
        _.each(this.$(".account_links"), function (a) {
            a = $(a);
            a.html(JST["organizer/account_links"]({
                organization: Organizations.getByCid(a.attr("data-cid"))
            }))
        })
    },
    promptNewProject: function () {
        var a = this;
        dc.ui.Dialog.prompt("Create a New Project", "", function (d, b) {
            d = dc.inflector.trim(d);
            if (!d) {
                b.error("Please enter a title.");
                return
            }
            if (Projects.find(d)) {
                return a._warnAlreadyExists(d)
            }
            var c = _.inject(Documents.selected(), function (e, f) {
                return e + f.get("annotation_count")
            }, 0);
            Projects.create({
                title: d,
                annotation_count: c,
                document_ids: Documents.selectedIds(),
                owner: true
            }, {
                wait: true
            });
            return true
        }, {
            mode: "short_prompt"
        })
    },
    highlight: function (a, d) {
        Projects.deselectAll();
        this.$(".organization").removeClass("is_selected");
        if (dc.account) {
            var b = a && Projects.find(a);
            if (b) {
                return b.set({
                    selected: true
                })
            }
        } else {
            var c = d && Organizations.findBySlug(d);
            if (c) {
                this.$("#organization_" + c.id).addClass("is_selected")
            }
        }
    },
    showAllDocuments: function () {
        dc.app.searcher.search("")
    },
    showYourDocuments: function () {
        Accounts.current().openDocuments()
    },
    showAnnotatedDocuments: function () {
        dc.app.searcher.search("filter: annotated")
    },
    showPublishedDocuments: function () {
        dc.app.searcher.search("filter: published")
    },
    showPopularDocuments: function () {
        dc.app.searcher.search("filter: popular")
    },
    showAccountDocuments: function (a) {
        var b = $(a.target).attr("data-cid");
        Accounts.getByCid(b).openDocuments()
    },
    showYourPublishedDocuments: function () {
        Accounts.current().openDocuments({
            published: true
        })
    },
    showOrganizationDocuments: function () {
        this.setMode("show", "accounts");
        Accounts.current().openOrganizationDocuments()
    },
    showOtherOrgDocuments: function (b) {
        var a = $(b.currentTarget);
        Organizations.get(a.attr("data-id")).openDocuments()
    },
    toggleAccountLinks: function (a) {
        $(a.target).closest("div.organization").toggleClass("show_accounts")
    },
    _bindToSets: function () {
        Projects.bind("add", this._addSubView);
        Projects.bind("remove", this._removeSubView);
        Accounts.bind("all", this.renderAccounts)
    },
    _warnAlreadyExists: function (a) {
        dc.ui.notifier.show({
            text: 'A project named "' + a + '" already exists'
        });
        return false
    },
    _addSubView: function (c) {
        this.setMode("has", "projects");
        var a = new dc.ui.Project({
            model: c
        }).render();
        this.subViews.push(a);
        var b = Projects.indexOf(a.model);
        var d = Projects.at(b - 1);
        var e = d && d.view;
        if (b == 0 || !d || !e) {
            $(this.projectList).prepend(a.el)
        } else {
            $(e.el).after(a.el)
        }
        dc.app.scroller.checkLater()
    },
    _removeSubView: function (a) {
        this.subViews = _.without(this.subViews, a.view);
        $(a.view.el).remove();
        dc.app.scroller.checkLater()
    }
});
dc.ui.Project = Backbone.View.extend({
    className: "project box",
    events: {
        click: "showDocuments",
        "click .edit_glyph": "editProject"
    },
    constructor: function (a) {
        Backbone.View.call(this, a);
        _.bindAll(this, "render");
        this.model.bind("change", this.render);
        this.model.view = this
    },
    render: function () {
        var a = _.extend(this.model.toJSON(), {
            statistics: this.model.statistics()
        });
        $(this.el).html(JST["organizer/project"](a));
        $(this.el).attr({
            id: "project_" + this.model.cid,
            "data-project-cid": this.model.cid
        });
        this.setMode(this.model.get("selected") ? "is" : "not", "selected");
        return this
    },
    showDocuments: function (a) {
        if ($(a.target).hasClass("edit_glyph")) {
            return false
        }
        this.model.open()
    },
    editProject: function (a) {
        this.model.edit();
        return false
    }
});
dc.ui.ProjectDialog = dc.ui.Dialog.extend({
    id: "project_dialog",
    events: {
        "click .ok": "confirm",
        "click .cancel": "close",
        "click .delete": "_deleteProject",
        "click .add_collaborator": "_showEnterEmail",
        "click .minibutton.add": "_addCollaborator",
        "keypress #collaborator_email": "_maybeAddCollaborator",
        "click .remove": "_removeCollaborator"
    },
    constructor: function (a) {
        this.model = a.model;
        dc.ui.Dialog.call(this, {
            mode: "custom",
            title: "Edit Project"
        })
    },
    render: function (b) {
        if (!b) {
            $(this.el).hide()
        }
        dc.ui.Dialog.prototype.render.call(this, {
            editor: true,
            information: this.model.statistics()
        });
        this.$(".custom").html(JST["organizer/project_dialog"]({
            model: this.model
        }));
        this.$("#project_title").val(this.model.get("title"));
        this.$("#project_description").val(this.model.get("description") || "");
        if (!this.model.get("owner")) {
            this.$(".minibutton.delete").text("Remove")
        }
        if (this.model.collaborators.length) {
            var a = this.model.collaborators.map(_.bind(function (c) {
                return (new dc.ui.AccountView({
                    model: c,
                    kind: "collaborator"
                })).render(null, {
                        project: this.model
                    }).el
            }, this));
            this.$(".collaborator_list tbody").append(a);
            this.$(".collaborators").show()
        }
        $(this.el).show();
        this.center();
        this._setPlaceholders();
        return this
    },
    confirm: function () {
        var d = this.model;
        var c = this.$("#project_title").val();
        var a = this.$("#project_description").val();
        var b = Projects.any(function (e) {
            return (e !== d) && (e.get("title") == c)
        });
        if (!c) {
            return this.error("Please specify a project title.")
        }
        if (b) {
            return this.error("There is already a project with that title.")
        }
        this.model.save({
            title: c,
            description: a
        });
        this.close()
    },
    _setPlaceholders: function () {
        this.$("#project_title, #project_description").placeholder()
    },
    _deleteProject: function () {
        var b = Projects.selected()[0] == this.model;
        if (!this.model.get("owner")) {
            Projects.remove(this.model);
            var a = Accounts.current().clone();
            a.collection = this.model.collaborators;
            a.destroy()
        } else {
            this.model.destroy()
        }
        this.close();
        if (b && !dc.app.searcher.flags.outstandingSearch) {
            dc.app.searcher.loadDefault({
                clear: true
            })
        }
    },
    _maybeAddCollaborator: function (a) {
        if (a.which == 13) {
            this._addCollaborator()
        }
    },
    _addCollaborator: function () {
        var a = this.$("#collaborator_email").val();
        if (!a) {
            return this.error("Please enter an email address.")
        }
        this.showSpinner();
        this.model.collaborators.create({
            email: a
        }, {
            wait: true,
            success: _.bind(function (b, c) {
                this.model.change();
                this.render(true)
            }, this),
            error: _.bind(function (b, c) {
                errorResp = JSON.parse(c.responseText);
                if (errorResp.errors) {
                    this.error(errorResp.errors[0])
                } else {
                    this.error("No DocumentCloud account was found with that email.")
                }
                this.hideSpinner()
            }, this)
        })
    },
    _removeCollaborator: function (b) {
        this.showSpinner();
        var a = this.model.collaborators.get(parseInt($(b.target).attr("data-id"), 10));
        a.destroy({
            success: _.bind(function () {
                this.model.change();
                this.render(true)
            }, this)
        })
    },
    _showEnterEmail: function () {
        this.$(".add_collaborator").hide();
        this.$(".enter_email").show();
        this.$("#collaborator_email").focus()
    }
});
dc.ui.ProjectMenu = dc.ui.Menu.extend({
    constructor: function (a) {
        _.bindAll(this, "renderProjects");
        a = _.extend({
            id: "projects_menu",
            label: "Projects",
            onOpen: this.renderProjects
        }, a);
        dc.ui.Menu.call(this, a)
    },
    renderProjects: function (d) {
        d.clear();
        var c = Documents.selected();
        var b = !c.length ? " disabled" : "";
        var a = Projects.map(function (g, e) {
            var f = (g.containsAny(c) ? "checked" : "") + b;
            return {
                title: g.get("title"),
                attrs: {
                    "class": f
                },
                onClick: _.bind(d.options.onClick, d, g)
            }
        });
        a.unshift({
            title: "New Project",
            attrs: {
                "class": "plus"
            },
            onClick: function () {
                dc.app.organizer.promptNewProject()
            }
        });
        d.addItems(a)
    }
});
dc.ui.Paginator = Backbone.View.extend({
    DEFAULT_PER_PAGE: 10,
    MINI_PER_PAGE: 30,
    SORT_TEXT: {
        score: "by relevance",
        title: "by title",
        created_at: "by date",
        source: "by source",
        page_count: "by length"
    },
    id: "paginator",
    className: "interface",
    query: null,
    page: null,
    view: null,
    events: {
        "click .arrow.left": "previousPage",
        "click .arrow.right": "nextPage",
        "click .current_placeholder": "editPage",
        "change .current_page": "changePage",
        "click .sorter": "chooseSort"
    },
    constructor: function (a) {
        Backbone.View.call(this, a);
        this.setSize(dc.app.preferences.get("paginator_mini") || false);
        this.sortOrder = dc.app.preferences.get("sort_order") || "score"
    },
    setQuery: function (b, a) {
        this.query = b;
        this.page = b.page;
        $(document.body).addClass("paginated");
        this.render()
    },
    setSortOrder: function (a) {
        this.sortOrder = a;
        dc.app.preferences.set({
            sort_order: a
        });
        this.$(".sorter").text(this.SORT_TEXT[this.sortOrder]);
        dc.app.searcher.loadPage()
    },
    queryParams: function () {
        var a = {
            per_page: dc.app.paginator.pageSize(),
            order: dc.app.paginator.sortOrder
        };
        if (!this.mini) {
            a.mentions = Documents.NUM_MENTIONS
        }
        return a
    },
    hide: function () {
        $(document.body).removeClass("paginated")
    },
    pageSize: function () {
        return this.mini ? this.MINI_PER_PAGE : this.DEFAULT_PER_PAGE
    },
    pageFactor: function () {
        return this.mini ? this.MINI_PER_PAGE / this.DEFAULT_PER_PAGE : this.DEFAULT_PER_PAGE / this.MINI_PER_PAGE
    },
    pageCount: function () {
        return Math.ceil(this.query.total / this.pageSize())
    },
    render: function () {
        this.setMode("not", "editing");
        var a = $(this.el);
        a.html("");
        if (!this.query) {
            return this
        }
        a.html(JST["workspace/paginator"]({
            q: this.query,
            sort_text: this.SORT_TEXT[this.sortOrder],
            per_page: this.pageSize(),
            page_count: this.pageCount()
        }));
        return this
    },
    setSize: function (a) {
        this.mini = a;
        $(document.body).toggleClass("minidocs", this.mini)
    },
    ensureRows: function (b, a) {
        if (this.mini) {
            this.toggleSize(b, a)
        } else {
            b()
        }
    },
    toggleSize: function (c, b) {
        this.setSize(!this.mini);
        dc.app.preferences.set({
            paginator_mini: this.mini
        });
        c = _.isFunction(c) ? c : null;
        var a = Math.floor(((this.page || 1) - 1) / this.pageFactor()) + 1;
        if (b) {
            a += Math.floor(Documents.indexOf(b) / this.pageSize())
        }
        dc.app.searcher.loadPage(a, c)
    },
    chooseSort: function () {
        var a = dc.ui.Dialog.choose("Sort Documents By&hellip;", [{
            text: "Relevance",
            value: "score",
            selected: this.sortOrder == "score"
        }, {
            text: "Date Uploaded",
            value: "created_at",
            selected: this.sortOrder == "created_at"
        }, {
            text: "Title",
            value: "title",
            selected: this.sortOrder == "title"
        }, {
            text: "Source",
            value: "source",
            selected: this.sortOrder == "source"
        }, {
            text: "Length",
            value: "page_count",
            selected: this.sortOrder == "page_count"
        }
        ], _.bind(function (b) {
            this.setSortOrder(b);
            return true
        }, this), {
            mode: "short_prompt"
        });
        $(a.el).addClass("short_choice")
    },
    editPage: function () {
        this.setMode("is", "editing");
        this.$(".current_page").focus()
    },
    previousPage: function () {
        var a = (this.page || 1) - 1;
        dc.app.searcher.loadPage(a)
    },
    nextPage: function () {
        var a = (this.page || 1) + 1;
        dc.app.searcher.loadPage(a)
    },
    changePage: function (b) {
        var a = parseInt($(b.target).val(), 10);
        if (a == this.page) {
            return
        }
        dc.app.searcher.loadPage(a)
    }
});
dc.ui.SearchEmbedDialog = dc.ui.Dialog.extend({
    events: {
        "click .preview": "preview",
        "change select": "update",
        "click select": "update",
        "keyup input": "update",
        "focus input": "update",
        "click input": "update",
        "change input": "update",
        "blur .per_page": "_validatePerPage",
        "click .next": "nextStep",
        "click .previous": "previousStep",
        "click .close": "close",
        "click .snippet": "selectSnippet",
        "click .change_access": "changeAccess",
        "click .remove_lines": "removeLines"
    },
    totalSteps: 2,
    STEPS: [null, "Step One: Configure the Embedded Documents", "Step Two: Copy and Paste the Embed Code"],
    DEMO_ERROR: 'Demo accounts are not allowed to embed document sets. <a href="/contact">Contact us</a> if you need a full featured account. View an example of the embed code <a href="/help/publishing#step_4">here</a>.',
    DEFAULT_OPTIONS: {
        order: "title",
        per_page: 12,
        search_bar: true,
        title: null,
        q: ""
    },
    constructor: function (a) {
        this.currentStep = 1;
        this.docs = a;
        if (a.length) {
            this.query = _.map(a, function (b) {
                return "document: " + b.id
            }).join(" ")
        } else {
            this.query = dc.app.searcher.publicQuery() || ""
        }
        dc.ui.Dialog.call(this, {
            mode: "custom",
            title: this.displayTitle()
        });
        dc.ui.spinner.show();
        this.fetchCounts()
    },
    fetchCounts: function () {
        $.ajax({
            url: "/search/restricted_count.json",
            data: {
                q: this.query
            },
            dataType: "json",
            success: _.bind(function (a) {
                this.restrictedCount = a.restricted_count;
                this.documentsCount = this.docs.length || dc.app.paginator.query.total;
                this.publicCount = this.documentsCount - this.restrictedCount;
                this.render()
            }, this)
        })
    },
    render: function () {
        if (dc.account.organization().get("demo")) {
            return dc.ui.Dialog.alert(this.DEMO_ERROR)
        }
        dc.ui.Dialog.prototype.render.call(this);
        this.$(".custom").html(JST["workspace/search_embed_dialog"]({
            query: this.query,
            projectQuery: VS.app.searchQuery.has("project"),
            restrictedCount: this.restrictedCount,
            documentsCount: this.documentsCount,
            publicCount: this.publicCount
        }));
        this._next = this.$(".next");
        this._previous = this.$(".previous");
        this._orderEl = this.$("select[name=order]");
        this._perPageEl = this.$("input[name=per_page]");
        this._titleEl = this.$("input[name=title]");
        this._searchBarEl = this.$("input[name=search_bar]");
        this._loadPreferences();
        this.setMode("embed", "dialog");
        this.setMode("search_embed", "dialog");
        this.update();
        this.setStep();
        this.center();
        dc.ui.spinner.hide();
        return this
    },
    displayTitle: function () {
        return this.STEPS[this.currentStep]
    },
    preview: function () {
        var b = JSON.stringify(this.embedOptions());
        var c = $.param({
            q: this.query,
            slug: dc.inflector.sluggify(this.query),
            options: b
        });
        var a = "http://" + window.location.host + "/search/preview?" + c;
        window.open(a);
        return false
    },
    update: function () {
        this._renderPerPageLabel();
        this._renderEmbedCode();
        this._savePreferences()
    },
    embedOptions: function () {
        var a = {};
        a.q = this.query;
        a.container = "#DC-search-" + dc.inflector.sluggify(this.query);
        a.title = this._titleEl.val().replace(/\"/g, '\\"');
        a.order = this._orderEl.val();
        a.per_page = this._perPageEl.val();
        a.search_bar = this._searchBarEl.is(":checked");
        a.organization = dc.account.organization().id;
        return a
    },
    removeLines: function () {
        this.$(".snippet").val(this.$(".snippet").val().replace(/[\r\n]/g, ""))
    },
    _savePreferences: function () {
        dc.app.preferences.set({
            search_embed_options: JSON.stringify(this.embedOptions())
        })
    },
    _deletePreferences: function () {
        dc.app.preferences.remove("search_embed_options")
    },
    _loadPreferences: function () {
        var a = _.extend({}, this.DEFAULT_OPTIONS, JSON.parse(dc.app.preferences.get("search_embed_options")));
        this._orderEl.val(a.order);
        this._perPageEl.val(a.per_page);
        this._searchBarEl.attr("checked", !! a.search_bar)
    },
    _renderEmbedCode: function () {
        var a = this.embedOptions();
        a.title = '"' + a.title + '"';
        a.container = '"' + a.container + '"';
        a.q = '"' + a.q + '"';
        a.order = '"' + a.order + '"';
        var b = _.map(a, function (d, c) {
            return c + ": " + d
        });
        this.$(".publish_embed_code").html(JST["search/embed_code"]({
            query: dc.inflector.sluggify(this.query),
            options: b.join(",\n    ")
        }))
    },
    _renderPerPageLabel: function () {
        var d = this._perPageEl.val();
        var b = this.$(".publish_option_perpage_sidelabel");
        var c;
        if (!d || !parseInt(d, 10)) {
            c = "&nbsp;"
        } else {
            var a = Math.max(1, Math.ceil(this.publicCount / d));
            var c = [this.publicCount, dc.inflector.pluralize(" document", this.publicCount), " / ", a, dc.inflector.pluralize(" page", a)].join("")
        }
        b.html(c)
    },
    _validatePerPage: function () {
        var a = this.$("input[name=per_page]");
        var b = a.val();
        if (b.length == 0) {
            b = this.DEFAULT_OPTIONS.per_page
        }
        if (b <= 0) {
            b = this.DEFAULT_OPTIONS.per_page
        }
        if (b > 100) {
            b = 100
        }
        a.val(b)
    },
    nextStep: function () {
        this.currentStep += 1;
        if (this.currentStep > this.totalSteps) {
            return this.close()
        }
        if (this.currentStep == 2) {
            this._renderEmbedCode()
        }
        this.setStep()
    },
    previousStep: function () {
        if (this.currentStep > 1) {
            this.currentStep -= 1
        }
        this.setStep()
    },
    setStep: function () {
        this.title(this.displayTitle());
        this.$(".publish_step").setMode("not", "enabled");
        this.$(".publish_step_" + this.currentStep).setMode("is", "enabled");
        this.info("Step " + this.currentStep + " of " + this.totalSteps, true);
        var b = this.currentStep == 1;
        var a = this.currentStep == this.totalSteps;
        this._previous.setMode(b ? "not" : "is", "enabled");
        this._next.html(a ? "Finish" : "Next &raquo;").setMode("is", "enabled")
    },
    selectSnippet: function () {
        this.$(".snippet").select()
    },
    changeAccess: function () {
        var a = this.query;
        if (a.indexOf("filter:restricted") == -1) {
            a += " filter:restricted"
        }
        dc.app.searcher.search(a);
        this.close()
    }
});
dc.ui.Help = Backbone.View.extend({
    PAGES: [{
        url: "",
        title: "Introduction"
    }, {
        url: "tour",
        title: "Guided Tour"
    }, {
        url: "accounts",
        title: "Adding Accounts"
    }, {
        url: "searching",
        title: "Searching Documents and Data"
    }, {
        url: "uploading",
        title: "Uploading Documents"
    }, {
        url: "troubleshooting",
        title: "Troubleshooting Failed Uploads"
    }, {
        url: "modification",
        title: "Document Modification"
    }, {
        url: "notes",
        title: "Editing Notes and Sections"
    }, {
        url: "collaboration",
        title: "Collaboration"
    }, {
        url: "privacy",
        title: "Privacy"
    }, {
        url: "publishing",
        title: "Publishing &amp; Embedding"
    }, {
        url: "api",
        title: "The DocumentCloud API"
    }
    ],
    events: {
        "click .contact_us": "openContactDialog",
        "click .uservoice": "openUserVoice"
    },
    initialize: function () {
        this.currentPage = null;
        this.PAGE_URLS = _.pluck(this.PAGES, "url")
    },
    render: function () {
        dc.app.navigation.bind("tab:help", _.bind(this.openHelpTab, this));
        this._toolbar = $("#help_toolbar");
        if (dc.account) {
            this._toolbar.prepend(this._createHelpMenu().render().el)
        }
        return this
    },
    openContactDialog: function () {
        dc.ui.Dialog.contact()
    },
    openUserVoice: function () {
        window.open("http://documentcloud.uservoice.com")
    },
    openPage: function (b) {
        var a = !_.include(this.PAGE_URLS, b) || (b === this.currentPage);
        this.currentPage = b;
        this.saveHistory();
        if (a) {
            return dc.app.navigation.open("help")
        }
        b || (b = dc.account ? "index" : "public");
        $.get("/ajax_help/" + b + ".html", function (c) {
            $("#help_content").html(c)
        });
        dc.app.navigation.open("help")
    },
    openHelpTab: function () {
        this.currentPage ? this.saveHistory() : this.openPage("")
    },
    saveHistory: function () {
        Backbone.history.navigate("help" + (this.currentPage ? "/" + this.currentPage : ""))
    },
    _createHelpMenu: function () {
        return this.menu = new dc.ui.Menu({
            id: "how_to_menu",
            label: "Guides &amp; How To's",
            items: _.map(this.PAGES, _.bind(function (a) {
                return {
                    onClick: _.bind(this.openPage, this, a.url),
                    title: a.title
                }
            }, this))
        })
    }
});
dc.ui.Navigation = Backbone.View.extend({
    SECTIONS: {
        documents: "sidebar",
        search: "panel",
        help: "panel"
    },
    constructor: function () {
        Backbone.View.call(this, {
            el: document.body
        });
        this.modes = {}
    },
    render: function () {
        this.tabs = _.reduce(_.keys(this.SECTIONS), _.bind(function (a, b) {
            var c = $("#" + b + "_tab");
            a[b] = c.click(_.bind(this._switchTab, this, b));
            return a
        }, this), {});
        this.open("documents");
        $("#toplinks .open_accounts").click(function () {
            dc.app.accounts.open()
        });
        this.setMode("search", "panel_tab");
        return this
    },
    open: function (b, a) {
        if (this.isOpen(b)) {
            return false
        }
        this._switchTab(b, a)
    },
    isOpen: function (a) {
        return this.modes[this.SECTIONS[a] + "_tab"] == a
    },
    _switchTab: function (b, a) {
        var c = this.tabs[b];
        $(".tab.active", $(c).closest(".tabs")).removeClass("active");
        c.addClass("active");
        this.setMode(b, this.SECTIONS[b] + "_tab");
        if (!(a === true)) {
            this.trigger("tab:" + b)
        }
        _.defer(dc.app.scroller.check)
    }
});
_.extend(dc.ui.Navigation.prototype, Backbone.Events);
dc.ui.Panel = Backbone.View.extend({
    className: "panel_container",
    initialize: function () {
        _.bindAll(this, "_setMinHeight")
    },
    render: function () {
        $(this.el).html(JST["workspace/panel"]({}));
        this.content = this.$(".panel_content");
        $(window).resize(this._setMinHeight);
        _.defer(this._setMinHeight);
        return this
    },
    add: function (b, a) {
        this.$("#" + b + "_container").append(a)
    },
    _setMinHeight: function () {
        $(this.el).css({
            "min-height": $(window).height() - 100
        })
    }
});
dc.ui.Sidebar = Backbone.View.extend({
    id: "sidebar",
    render: function () {
        $(this.el).html(JST["workspace/sidebar"]({}));
        this.content = this.$("#sidebar_content");
        dc.app.scroller = (new dc.ui.Scroll(this.content)).render();
        return this
    },
    add: function (b, a) {
        this.$("#" + b + "_container").append(a)
    }
});
dc.ui.Toolbar = Backbone.View.extend({
    id: "toolbar",
    events: {
        "click #open_viewers": "_clickOpenViewers",
        "click #size_toggle": "_toggleSize"
    },
    MENUS: ["edit", "sort", "project", "publish", "analyze"],
    constructor: function (a) {
        this._floating = false;
        Backbone.View.call(this, a);
        _.bindAll(this, "_updateSelectedDocuments", "_deleteSelectedDocuments", "editTitle", "editSource", "editDescription", "editRelatedArticle", "editAccess", "openDocumentEmbedDialog", "openNoteEmbedDialog", "openSearchEmbedDialog", "openPublicationDateDialog", "requestDownloadViewers", "checkFloat", "_openTimeline", "_viewEntities", "editPublishedUrl", "openShareDialog", "_markOrder", "_removeFromSelectedProject", "_enableAnalyzeMenu");
        this.sortMenu = this._createSortMenu();
        this.analyzeMenu = this._createAnalyzeMenu();
        this.publishMenu = this._createPublishMenu();
        if (dc.account) {
            this.editMenu = this._createEditMenu();
            this.projectMenu = new dc.ui.ProjectMenu({
                onClick: this._updateSelectedDocuments
            })
        }
    },
    render: function () {
        var a = $(this.el);
        a.html(JST["workspace/toolbar"]({}));
        _.each(this.MENUS, _.bind(function (c) {
            var b = this[c + "Menu"];
            if (b) {
                $("." + c + "_menu_container", a).append(b.render().el)
            }
        }, this));
        this.openButton = this.$("#open_viewers");
        this.floatEl = this.$("#floating_toolbar");
        $(window).scroll(_.bind(function () {
            _.defer(this.checkFloat)
        }, this));
        return this
    },
    edit: function (c, a) {
        var b = Documents.selected();
        if (!Documents.allowedToEdit(b, a)) {
            return
        }
        return c.call(this, b)
    },
    editTitle: function () {
        this.edit(function (b) {
            var a = b[0];
            dc.ui.Dialog.prompt("Title", a.get("title"), function (c) {
                a.save({
                    title: c
                });
                return true
            }, {
                mode: "short_prompt"
            })
        })
    },
    editDescription: function () {
        this.edit(function (b) {
            var a = Documents.sharedAttribute(b, "description") || "";
            dc.ui.Dialog.prompt("Description", a, function (c) {
                _.each(b, function (d) {
                    d.save({
                        description: c
                    })
                });
                return true
            }, {
                information: Documents.subtitle(b.length)
            })
        })
    },
    editSource: function () {
        this.edit(function (b) {
            var a = Documents.sharedAttribute(b, "source") || "";
            dc.ui.Dialog.prompt("Source", a, function (c) {
                _.each(b, function (d) {
                    d.save({
                        source: c
                    })
                });
                return true
            }, {
                mode: "short_prompt",
                information: Documents.subtitle(b.length)
            })
        })
    },
    editRelatedArticle: function () {
        this.edit(function (c) {
            var b = Documents.sharedAttribute(c, "related_article") || "";
            var a = c.length > 1 ? "these documents:" : "this document:";
            dc.ui.Dialog.prompt("Related Article URL", b, function (d, e) {
                d = dc.inflector.normalizeUrl(d);
                if (d && !e.validateUrl(d)) {
                    return false
                }
                _.each(c, function (f) {
                    f.save({
                        related_article: d
                    })
                });
                return true
            }, {
                mode: "short_prompt",
                information: Documents.subtitle(c.length),
                description: "Enter the URL of the article that references " + a
            })
        })
    },
    editPublishedUrl: function () {
        this.edit(function (c) {
            var b = Documents.sharedAttribute(c, "remote_url") || "";
            var a = c.length > 1 ? "these documents are" : "this document is";
            dc.ui.Dialog.prompt("Published URL", b, function (d, e) {
                d = dc.inflector.normalizeUrl(d);
                if (d && !e.validateUrl(d)) {
                    return false
                }
                _.each(c, function (f) {
                    f.save({
                        remote_url: d
                    })
                });
                return true
            }, {
                mode: "short_prompt",
                information: Documents.subtitle(c.length),
                description: "Enter the URL at which " + a + " embedded:"
            })
        })
    },
    editAccess: function () {
        Documents.editAccess(Documents.selected())
    },
    editData: function () {
        var a = Documents.selected();
        if (!Documents.allowedToEdit(a)) {
            return
        }
        new dc.ui.DocumentDataDialog(a)
    },
    openViewers: function (b, c, d) {
        if (!Documents.selectedCount) {
            return dc.ui.Dialog.alert("Please select a document to open.")
        }
        var a = function (e) {
            _.each(e, function (g) {
                var f = g.openAppropriateVersion(c);
                if (d) {
                    f.DV || (f.DV = {});
                    f.DV.afterLoad = d
                }
            })
        };
        b ? this.edit(a) : a(Documents.selected())
    },
    openSearchEmbedDialog: function () {
        var a = Documents.chosen();
        dc.app.searchEmbedDialog = new dc.ui.SearchEmbedDialog(a)
    },
    openDocumentEmbedDialog: function () {
        var b = Documents.chosen();
        if (!b.length) {
            return
        }
        if (b.length != 1) {
            return dc.ui.Dialog.alert("Please select a single document in order to create the embed.")
        }
        var a = b[0];
        if (!a.checkAllowedToEdit(Documents.EMBED_FORBIDDEN)) {
            return
        }(new dc.ui.DocumentEmbedDialog(a)).render()
    },
    openNoteEmbedDialog: function () {
        var b = Documents.chosen();
        if (!b.length) {
            return
        }
        if (b.length != 1) {
            return dc.ui.Dialog.alert("Please select a single document in order to create the embed.")
        }
        var a = b[0];
        if ((a.notes.length && !a.notes.any(function (c) {
            return c.get("access") == "public"
        })) || (!a.notes.length && !a.get("public_note_count"))) {
            return dc.ui.Dialog.alert("Please select a document with at least one public note.")
        }
        if (!a.checkAllowedToEdit(Documents.EMBED_FORBIDDEN)) {
            return
        }
        dc.app.noteEmbedDialog = new dc.ui.NoteEmbedDialog(a)
    },
    openShareDialog: function () {
        var a = Documents.chosen();
        if (!a.length || !Documents.allowedToEdit(a)) {
            return
        }
        dc.app.shareDialog = new dc.ui.ShareDialog({
            docs: a,
            mode: "custom"
        })
    },
    openCurrentProject: function () {
        Projects.firstSelected().edit()
    },
    openPublicationDateDialog: function () {
        var a = Documents.chosen();
        if (!a.length || !Documents.allowedToEdit(a)) {
            return
        }
        new dc.ui.PublicationDateDialog(a)
    },
    requestDownloadViewers: function () {
        if (dc.account.organization().get("demo")) {
            return dc.ui.Dialog.alert('Demo accounts are not allowed to download viewers. <a href="/contact">Contact us</a> if you need a full featured account.')
        }
        var a = Documents.chosen();
        if (a.length) {
            Documents.downloadViewers(a)
        }
    },
    checkFloat: function () {
        var a = dc.app.navigation.isOpen("search");
        var b = a && ($(window).scrollTop() > $(this.el).offset().top - 30);
        if (this._floating == b) {
            return
        }
        $(document.body).toggleClass("floating_toolbar", this._floating = b)
    },
    _updateSelectedDocuments: function (c) {
        var b = Documents.selected();
        var a = c.containsAny(b);
        a ? c.removeDocuments(b) : c.addDocuments(b)
    },
    _removeFromSelectedProject: function () {
        var b = Documents.selected();
        var a = Projects.firstSelected();
        a.removeDocuments(b)
    },
    _deleteSelectedDocuments: function () {
        Documents.verifyDestroy(Documents.selected())
    },
    _openTimeline: function () {
        var a = Documents.chosen();
        if (!a.length && Documents.selectedCount) {
            return
        }
        if (a.length > 10) {
            return dc.ui.Dialog.alert("You can only view a timeline for ten documents at a time.")
        }
        if (a.length <= 0) {
            a = Documents.models.slice(0, 10)
        }
        if (a.length <= 0) {
            return dc.ui.Dialog.alert("In order to view a timeline, please select some documents.")
        }
        new dc.ui.TimelineDialog(a)
    },
    _viewEntities: function () {
        var a = Documents.chosen();
        if (!a.length && Documents.selectedCount) {
            return
        }
        if (a.length <= 0) {
            a = Documents.models
        }
        dc.app.paginator.ensureRows(function () {
            dc.model.EntitySet.populateDocuments(a)
        }, a[0])
    },
    _panel: function () {
        return this._panelEl = this._panelEl || $(this.el).parents(".panel_content")[0]
    },
    _chooseSort: function (a) {
        dc.app.paginator.setSortOrder($(a.target).attr("data-order"))
    },
    _markOrder: function (a) {
        $(".menu_item", a.content).removeClass("checked").filter('[data-order="' + dc.app.paginator.sortOrder + '"]').addClass("checked")
    },
    _enableMenuItems: function (d) {
        var c = Documents.length;
        var b = Documents.selectedCount;
        var a = Documents.selectedPublicCount();
        $(".menu_item:not(.plus,.always)", d.content).toggleClass("disabled", !b).attr("title", b ? "" : "No documents selected");
        $(".singular", d.content).toggleClass("disabled", !(b == 1));
        $(".private_only", d.content).toggleClass("disabled", !b || a > 0).attr("title", b && a > 0 ? "already public" : "");
        $(".menu_item.always", d.content).toggleClass("disabled", !c);
        $(".menu_item.project", d.content).toggleClass("hidden", !Projects.firstSelected())
    },
    _enableAnalyzeMenu: function (b) {
        this._enableMenuItems(b);
        var a = Documents.selectedCount == 1;
        $(".share_documents", b.content).text(a ? "Share this Document" : "Share these Documents");
        $(".share_project", b.content).toggleClass("disabled", !Projects.selectedCount)
    },
    _createPublishMenu: function () {
        var b = [{
            title: "Embed Document Viewer",
            onClick: this.openDocumentEmbedDialog,
            attrs: {
                "class": "singular"
            }
        }, {
            title: "Embed Document List",
            onClick: this.openSearchEmbedDialog,
            attrs: {
                "class": "always"
            }
        }, {
            title: "Embed a Note",
            onClick: this.openNoteEmbedDialog,
            attrs: {
                "class": "singular"
            }
        }, {
            title: "Set Publication Date",
            onClick: this.openPublicationDateDialog,
            attrs: {
                "class": "private_only"
            }
        }, {
            title: "Download Document Viewer",
            onClick: this.requestDownloadViewers
        }
        ];
        var c = [{
            title: "Download Original PDF",
            onClick: Documents.downloadSelectedPDF
        }, {
            title: "Download Full Text",
            onClick: Documents.downloadSelectedFullText
        }, {
            title: "Print Notes",
            onClick: Documents.printNotes
        }
        ];
        var a = dc.account ? b.concat(c) : c;
        return new dc.ui.Menu({
            label: dc.account ? "Publish" : "Save",
            onOpen: this._enableMenuItems,
            items: a
        })
    },
    _createSortMenu: function () {
        return new dc.ui.Menu({
            label: "Sort",
            onOpen: this._markOrder,
            items: [{
                title: "Sort by Relevance",
                attrs: {
                    "data-order": "score"
                },
                onClick: this._chooseSort
            }, {
                title: "Sort by Date Uploaded",
                attrs: {
                    "data-order": "created_at"
                },
                onClick: this._chooseSort
            }, {
                title: "Sort by Title",
                attrs: {
                    "data-order": "title"
                },
                onClick: this._chooseSort
            }, {
                title: "Sort by Source",
                attrs: {
                    "data-order": "source"
                },
                onClick: this._chooseSort
            }, {
                title: "Sort by Length",
                attrs: {
                    "data-order": "page_count"
                },
                onClick: this._chooseSort
            }
            ]
        })
    },
    _createEditMenu: function () {
        return new dc.ui.Menu({
            label: "Edit",
            onOpen: this._enableMenuItems,
            items: [{
                title: "Edit Document Information",
                attrs: {
                    "class": "multiple"
                },
                onClick: function () {
                    dc.ui.DocumentDialog.open()
                }
            }, {
                title: "Title",
                attrs: {
                    "class": "singular indent"
                },
                onClick: this.editTitle
            }, {
                title: "Source",
                attrs: {
                    "class": "multiple indent"
                },
                onClick: this.editSource
            }, {
                title: "Description",
                attrs: {
                    "class": "multiple indent"
                },
                onClick: this.editDescription
            }, {
                title: "Access Level",
                attrs: {
                    "class": "multiple indent"
                },
                onClick: this.editAccess
            }, {
                title: "Related Article URL",
                attrs: {
                    "class": "multiple indent"
                },
                onClick: this.editRelatedArticle
            }, {
                title: "Published URL",
                attrs: {
                    "class": "multiple indent"
                },
                onClick: this.editPublishedUrl
            }, {
                title: "Edit Document Data",
                attrs: {
                    "class": "multiple"
                },
                onClick: this.editData
            }, {
                title: "Modify Original Document",
                attrs: {
                    "class": "multiple"
                },
                onClick: _.bind(this.openViewers, this, true, "#pages", null)
            }, {
                title: "Remove from this Project",
                attrs: {
                    "class": "multiple project"
                },
                onClick: this._removeFromSelectedProject
            }, {
                title: "Delete Documents",
                attrs: {
                    "class": "multiple warn"
                },
                onClick: this._deleteSelectedDocuments
            }
            ]
        })
    },
    _createAnalyzeMenu: function () {
        var b = [{
            title: "View Entities",
            attrs: {
                "class": "always"
            },
            onClick: this._viewEntities
        }, {
            title: "View Timeline",
            attrs: {
                "class": "always"
            },
            onClick: this._openTimeline
        }
        ];
        var a = [{
            title: "Share these Documents",
            attrs: {
                "class": "multiple share_documents"
            },
            onClick: this.openShareDialog
        }, {
            title: "Share this Project",
            attrs: {
                "class": "share_project"
            },
            onClick: this.openCurrentProject
        }
        ];
        return new dc.ui.Menu({
            label: "Analyze",
            onOpen: this._enableAnalyzeMenu,
            items: dc.account ? b.concat(a) : b
        })
    },
    _openEditPageTextEditor: function (a) {
        _.defer(function () {
            a.window.dc.app.editor.editPageTextEditor.open()
        })
    },
    _openInsertEditor: function (a) {
        _.defer(function () {
            a.window.dc.app.editor.replacePagesEditor.open()
        })
    },
    _openRemoveEditor: function (a) {
        _.defer(function () {
            a.window.dc.app.editor.removePagesEditor.open()
        })
    },
    _openReorderEditor: function (a) {
        _.defer(function () {
            a.window.dc.app.editor.reorderPagesEditor.open()
        })
    },
    _clickOpenViewers: function () {
        this.openViewers()
    },
    _toggleSize: function () {
        dc.app.paginator.toggleSize()
    }
});
dc.app.download = function (a, d) {
    dc.ui.spinner.show();
    var b = document.createElement("iframe");
    b.src = a;
    b.style.display = "none";
    var c = setInterval(function () {
        if (b.contentDocument.readyState == "complete") {
            dc.ui.spinner.hide();
            clearInterval(c);
            if (d) {
                d()
            }
            $(b).remove()
        }
    }, 100);
    $(document.body).append(b)
};
dc.app.editor = new Backbone.View();
_.extend(dc.app.editor, {
    initialize: function (b, a) {
        this.setElement("body");
        this.docId = b;
        this.options = a;
        _.bindAll(this, "closeAllEditors", "confirmStateChange");
        dc.app.hotkeys.initialize();
        this.createSubViews();
        this.renderSubViews();
        currentDocument.api.onChangeState(this.closeAllEditors)
    },
    confirmStateChange: function (a) {
        if (this._openDialog) {
            return
        }
        this._openDialog = dc.ui.Dialog.confirm("You have unsaved changes. Are you sure you want to leave without saving them?", a, {
            onClose: _.bind(function () {
                this._openDialog = null
            }, this)
        })
    },
    setSaveState: function (b) {
        this.unsavedChanges = b;
        var a = b ? this.confirmStateChange : null;
        currentDocument.api.setConfirmStateChange(a)
    },
    createSubViews: function () {
        dc.ui.notifier = new dc.ui.Notifier();
        this.controlPanel = new dc.ui.ViewerControlPanel();
        this.sectionEditor = new dc.ui.SectionEditor();
        this.annotationEditor = new dc.ui.AnnotationEditor();
        this.removePagesEditor = new dc.ui.RemovePagesEditor({
            editor: this
        });
        this.reorderPagesEditor = new dc.ui.ReorderPagesEditor({
            editor: this
        });
        this.editPageTextEditor = new dc.ui.EditPageTextEditor({
            editor: this
        });
        this.replacePagesEditor = new dc.ui.ReplacePagesEditor({
            editor: this
        })
    },
    renderSubViews: function () {
        var a = "DV-isContributor";
        if (this.options.isReviewer) {
            a = "DV-isReviewer"
        }
        if (this.options.isOwner) {
            a = "DV-isOwner"
        }
        $(".DV-docViewer").addClass(a);
        $(".DV-well").append(this.controlPanel.render().el);
        $(".DV-logo").hide();
        $(".DV-thumbnailsView").show();
        currentDocument.api.roundTabCorners();
        var b = $(".DV-supplemental");
        if (b.hasClass("DV-noNavigation")) {
            b.removeClass("DV-noNavigation").addClass("DV-noNavigationMargin")
        }
    },
    closeAllEditors: function () {
        this.removePagesEditor.close();
        this.reorderPagesEditor.close();
        this.replacePagesEditor.close();
        this.editPageTextEditor.close();
        return true
    }
});
dc.app.hotkeys = {
    KEYS: {
        "16": "shift",
        "17": "control",
        "91": "command",
        "93": "command",
        "224": "command",
        "13": "enter",
        "37": "left",
        "38": "upArrow",
        "39": "right",
        "40": "downArrow",
        "46": "delete",
        "8": "backspace",
        "9": "tab",
        "188": "comma"
    },
    initialize: function () {
        _.bindAll(this, "down", "up", "blur");
        $(document).bind("keydown", this.down);
        $(document).bind("keyup", this.up);
        $(window).bind("blur", this.blur)
    },
    down: function (b) {
        var a = this.KEYS[b.which];
        if (a) {
            this[a] = true
        }
    },
    up: function (b) {
        var a = this.KEYS[b.which];
        if (a) {
            this[a] = false
        }
    },
    blur: function (b) {
        for (var a in this.KEYS) {
            this[this.KEYS[a]] = false
        }
    },
    key: function (a) {
        return this.KEYS[a.which]
    },
    colon: function (b) {
        var a = b.which;
        return a && String.fromCharCode(a) == ":"
    },
    printable: function (b) {
        var a = b.which;
        if (b.type == "keydown") {
            if (a == 32 || (a >= 48 && a <= 90) || (a >= 96 && a <= 111) || (a >= 186 && a <= 192) || (a >= 219 && a <= 222)) {
                return true
            }
        } else {
            if ((a >= 32 && a <= 126) || (a >= 160 && a <= 500) || (String.fromCharCode(a) == ":")) {
                return true
            }
        }
        return false
    }
};
dc.app.cookies = {
    get: function (a) {
        var d = new RegExp("\\s*" + a + "=(.*)$");
        var c = document.cookie.split(";");
        var b = _.detect(c, function (e) {
            return e.match(d)
        });
        return b ? decodeURIComponent(b.match(d)[1]) : null
    },
    set: function (d, e, b) {
        var a = b ? new Date() : null;
        if (a) {
            b == "remove" ? a.setYear(a.getFullYear() - 1) : a.setYear(a.getFullYear() + 2)
        }
        var c = a ? "; expires=" + a.toUTCString() : "";
        document.cookie = d + "=" + encodeURIComponent(e) + "; path=/" + c
    },
    remove: function (a) {
        this.set(a, this.get(a), "remove")
    }
};
dc.app.preferences = {
    get: function (a, b) {
        var c = this._prefs()[a];
        return (!c || (b && !_.include(b, c))) ? null : c
    },
    set: function (a) {
        this._setPrefs(_.extend(this._prefs(), a))
    },
    remove: function (b) {
        var a = this._prefs();
        delete a[b];
        this._setPrefs(a)
    },
    _prefs: function () {
        return JSON.parse(dc.app.cookies.get("document_cloud_preferences") || "{}")
    },
    _setPrefs: function (a) {
        dc.app.cookies.set("document_cloud_preferences", JSON.stringify(a), true)
    }
};

/* searcher router */
dc.controllers.Searcher = Backbone.Router.extend({
    NO_RESULTS: {
        project: "This project does not contain any documents.",
        account: "This account does not have any documents.",
        group: "This organization does not have any documents.",
        published: "This account does not have any published documents.",
        annotated: "There are no annotated documents.",
        search: "Your search did not match any documents.",
        all: "There are no documents."
    },

    PAGE_MATCHER: (/\/p(\d+)$/),

    DOCUMENTS_URL: "/search/documents.json",

    FACETS_URL: "/search/facets.json",

    fragment: null,

    flags: {},

    routes: {
        "search/*query/p:page": "searchByHash",
        "search/*query": "searchByHash"
    },

    initialize: function () {
        this.searchBox = dc.app.searchBox;
        this.flags.hasEntities = false;
        this.currentSearch = null;
        this.titleBox = $("#title_box_inner");

        _.bindAll(this, "_loadSearchResults", "_loadFacetsResults", "_loadFacetResults", "loadDefault", "loadFacets");

        dc.app.navigation.bind("tab:search", this.loadDefault)
    },

    urlFragment: function () {
        return this.fragment + (this.page ? "/p" + this.page : "")
    },

    loadDefault: function (a) {
        a || (a = {});
        if (a.clear) {
            Documents.reset();
            this.searchBox.value("")
        }
        if (this.currentSearch) {
            return
        }
        if (!Documents.isEmpty()) {
            this.navigate(this.urlFragment());
            this.showDocuments()
        } else {
            if (this.searchBox.value()) {
                this.search(this.searchBox.value())
            } else {
                if (dc.account && dc.account.get("hasDocuments")) {
                    Accounts.current().openDocuments()
                } else {
                    if (Projects.first()) {
                        Projects.first().open()
                    } else {
                        if (a.showHelp && dc.account) {
                            dc.app.navigation.open("help")
                        } else {
                            this.search("")
                        }
                    }
                }
            }
        }
    },

    loadPage: function (b, c) {
        b = b || this.page || 1;
        var a = dc.app.paginator.pageCount();
        if (b < 1) {
            b = 1
        }
        if (b > a) {
            b = a
        }
        this.search(this.searchBox.value(), b, c)
    },

    quote: function (a) {
        return a.match(/\s/) ? '"' + a + '"' : a
    },

    publicQuery: function () {
        var b = [];
        var a = VS.app.searchQuery.values("project");
        _.each(a, function (d) {
            b.push(Projects.find(d))
        });
        var c = VS.app.searchQuery.withoutCategory("project");
        c = _.map(b, function (d) {
            return "projectid: " + d.slug()
        }).join(" ") + " " + c;
        c = c.replace(/(document: \d+)-\S+/g, "$1");
        return c
    },

    queryText: function () {
        return VS.app.searchQuery.find("text")
    },

    search: function (b, a, d) {
        dc.ui.spinner.show();
        dc.app.navigation.open("search");
        if (this.currentSearch) {
            this.currentSearch.abort()
        }

        this.searchBox.value(b);
        this.flags.related = b.indexOf("related:") >= 0;
        this.flags.specific = b.indexOf("document:") >= 0;
        this.flags.hasEntities = false;
        this.page = a <= 1 ? null : a;
        this.fragment = "search/" + b;
        this.showDocuments();
        this.navigate(this.urlFragment());
        Documents.reset();
        this._afterSearch = d;
        var c = _.extend(dc.app.paginator.queryParams(), {
            q: b
        });
        if (dc.app.navigation.isOpen("entities")) {
            c.include_facets = true
        }
        if (this.page) {
            c.page = this.page
        }

        this.currentSearch = $.ajax({
            url: this.DOCUMENTS_URL,
            data: c,
            success: this._loadSearchResults,
            error: function (e, g, f) {
                if (e.status == 403) {
                    Accounts.forceLogout()
                }
            },
            dataType: "json"
        })
    },

    showDocuments: function () {
        var b = this.searchBox.value();
        var c = dc.model.DocumentSet.entitle(b);
        var a = VS.app.searchQuery.find("project");
        var d = VS.app.searchQuery.find("group");
        $(document.body).setMode("active", "search");
        this.titleBox.html(c);
        dc.app.organizer.highlight(a, d)
    },

    doneSearching: function () {
        var e = dc.app.paginator.query.total;
        var d = dc.inflector.pluralize("Document", e);
        var c = this.searchType();
        if (this.flags.specific) {
            this.titleBox.text(e + " " + d)
        } else {
            if (c == "search") {
                var b = VS.app.searchQuery.has("project");
                var g = " in " + (b ? "“" : "") + this.titleBox.html() + (b ? "”" : "");
                var f = e ? e + " " + dc.inflector.pluralize("Result", e) : "No Results";
                this.titleBox.html(f + g)
            }
        }
        if (e <= 0) {
            $(document.body).setMode("empty", "search");
            var a = this.NO_RESULTS[c] || this.NO_RESULTS.search;
            $("#no_results .explanation").text(a)
        }

        dc.ui.spinner.hide();
        dc.app.scroller.checkLater()
    },

    searchType: function () {
        var b = false;
        var a = false;
        VS.app.searchQuery.each(function (e) {
            var c = e.get("category");
            var d = e.get("value");
            if (d) {
                if (!b && !a) {
                    b = c
                } else {
                    a = true;
                    b = false
                }
            }
        });
        if (b == "filter") {
            return VS.app.searchQuery.first().get("value")
        } else {
            if (b == "projectid") {
                return "project"
            } else {
                if (_.contains(["project", "group", "account"], b)) {
                    return b
                } else {
                    if (!b && !a) {
                        return "all"
                    }
                }
            }
        }
        return "search"
    },

    loadFacets: function () {
        if (this.flags.hasEntities) {
            return
        }
        var a = this.searchBox.value() || "";
        dc.ui.spinner.show();
        this.currentSearch = $.get(this.FACETS_URL, {
            q: a
        }, this._loadFacetsResults, "json")
    },

    loadFacet: function (a) {
        dc.ui.spinner.show();
        this.currentSearch = $.get(this.FACETS_URL, {
            q: this.searchBox.value(),
            facet: a
        }, this._loadFacetResults, "json")
    },

    searchByHash: function (b, a) {
        _.defer(_.bind(function () {
            this.search(decodeURIComponent(b), a && parseInt(a, 10))
        }, this))
    },

    toggleSearch: function (a, b) {
        if (VS.app.searchQuery.has(a)) {
            this.removeFromSearch(a)
        } else {
            this.addToSearch(a, b)
        }
    },

    addToSearch: function (a, c, d) {
        if (VS.app.searchQuery.has(a, c)) {
            return
        }
        VS.app.searchQuery.add({
            category: a,
            value: c
        });
        var b = VS.app.searchQuery.value();
        this.search(b, null, d)
    },

    removeFromSearch: function (a) {
        var b = VS.app.searchQuery.withoutCategory(a);
        this.search(b);
        return true
    },

    viewEntities: function (a) {
        dc.app.navigation.open("entities", true);
        this.search(_.map(a, function (b) {
            return "document: " + b.canonicalId()
        }).join(" "))
    },

    _loadSearchResults: function (d) {
        dc.app.paginator.setQuery(d.query, this);
        if (d.facets) {
            this._loadFacetsResults(d)
        }
        var c = d.documents;
        for (var b = 0, a = c.length; b < a; b++) {
            c[b].index = b
        }
        Documents.reset(c);
        this.doneSearching();
        this.currentSearch = null;
        if (this._afterSearch) {
            this._afterSearch()
        }
    },

    _loadFacetsResults: function (a) {
        dc.app.workspace.entityList.renderFacets(a.facets, 5, a.query.total);
        dc.ui.spinner.hide();
        this.currentSearch = null;
        this.flags.hasEntities = true
    },

    _loadFacetResults: function (a) {
        dc.app.workspace.entityList.mergeFacets(a.facets, 500, a.query.total);
        dc.ui.spinner.hide();
        this.currentSearch = null
    }
});

/* each page is like a separate application
 * workspace is located at http://www.documentcloud.org/public/help
 */
dc.controllers.Workspace = Backbone.Router.extend({
    routes: {
        "help/:page": "help",
        help: "help" // how they use attribute for routes
    },

    initialize: function () {
        this.createSubViews();
        this.renderSubViews();
        dc.app.searcher = new dc.controllers.Searcher;

        if (!Backbone.history.start({
            pushState: true,
            root: dc.account ? "/" : "/public/"
        })) {
            dc.app.searcher.loadDefault({
                showHelp: true
            })
        }
    },

    /* handling #help/:page */
    help: function (a) {
        this.help.openPage(a || "")
    },

    createSubViews: function () {
        dc.app.paginator = new dc.ui.Paginator();
        dc.app.navigation = new dc.ui.Navigation();
        dc.app.toolbar = new dc.ui.Toolbar();
        dc.app.organizer = new dc.ui.Organizer();
        dc.ui.notifier = new dc.ui.Notifier();
        dc.ui.tooltip = new dc.ui.Tooltip();
        dc.app.searchBox = VS.init(this.searchOptions());
        this.sidebar = new dc.ui.Sidebar();
        this.panel = new dc.ui.Panel();
        this.documentList = new dc.ui.DocumentList();
        this.entityList = new dc.ui.EntityList();

        if (!dc.account) {
            return
        }
        dc.app.uploader = new dc.ui.UploadDialog();
        dc.app.accounts = new dc.ui.AccountDialog();
        this.accountBadge = new dc.ui.AccountView({
            model: Accounts.current(),
            kind: "badge"
        })
    },

    renderSubViews: function () {
        var a = $("#content");
        a.append(this.sidebar.render().el);
        a.append(this.panel.render().el);
        dc.app.navigation.render();
        dc.app.hotkeys.initialize();
        this.help = new dc.ui.Help({
            el: $("#help")[0]
        }).render();
        this.panel.add("search_box", dc.app.searchBox.render().el);
        this.panel.add("pagination", dc.app.paginator.el);
        this.panel.add("search_toolbar", dc.app.toolbar.render().el);
        this.panel.add("document_list", this.documentList.render().el);
        this.sidebar.add("entities", this.entityList.render().el);
        $("#no_results_container").html(JST["workspace/no_results"]({}));
        this.sidebar.add("organizer", dc.app.organizer.render().el);
        if (!dc.account) {
            return
        }
        this.sidebar.add("account_badge", this.accountBadge.render().el)
    },

    searchOptions: function () {
        return {
            unquotable: ["text", "account", "document", "filter", "group", "access", "projectid"],
            callbacks: {
                search: function (a) {
                    if (!dc.app.searcher.flags.outstandingSearch) {
                        dc.app.paginator.hide();
                        _.defer(dc.app.toolbar.checkFloat);
                        dc.app.searcher.search(a)
                    }
                    return false
                },

                focus: function () {
                    Documents.deselectAll()
                },

                valueMatches: function (c, b, a) {
                    switch (c) {
                        case "account":
                            a(Accounts.map(function (d) {
                                return {
                                    value: d.get("slug"),
                                    label: d.fullName()
                                }
                            }));
                            break;

                        case "project":
                            a(Projects.pluck("title"));
                            break;

                        case "filter":
                            a(["annotated", "popular", "published", "unpublished", "restricted"]);
                            break;
                        case "access":
                            a(["public", "private", "organization", "pending", "error"]);
                            break;
                        case "title":
                            a(_.uniq(Documents.pluck("title")));
                            break;
                        case "source":
                            a(_.uniq(_.compact(Documents.pluck("source"))));
                            break;
                        case "group":
                            a(Organizations.map(function (d) {
                                return {
                                    value: d.get("slug"),
                                    label: d.get("name")
                                }
                            }));
                            break;
                        case "document":
                            a(Documents.map(function (e) {
                                return {
                                    value: e.canonicalId(),
                                    label: e.get("title")
                                }
                            }));
                            break;
                        default:
                            a(_.compact(_.uniq(Documents.reduce(function (d, e) {
                                if (_.size(e.get("data"))) {
                                    d.push(e.get("data")[c])
                                }
                                return d
                            }, []))))
                    }
                },

                facetMatches: function (a) {
                    var c = [{
                        label: "project",
                        category: ""
                    }, {
                        label: "text",
                        category: ""
                    }, {
                        label: "title",
                        category: ""
                    }, {
                        label: "description",
                        category: ""
                    }, {
                        label: "source",
                        category: ""
                    }, {
                        label: "account",
                        category: ""
                    }, {
                        label: "document",
                        category: ""
                    }, {
                        label: "filter",
                        category: ""
                    }, {
                        label: "group",
                        category: ""
                    }, {
                        label: "access",
                        category: ""
                    }, {
                        label: "projectid",
                        category: ""
                    }
                    ];

                    var b = _.map(_.keys(Documents.reduce(function (d, e) {
                        if (_.size(e.get("data"))) {
                            _.extend(d, e.get("data"))
                        }
                        return d
                    }, {})), function (d) {
                        return {
                            label: d,
                            category: ""
                        }
                    });
                    a && a(c.concat(b))
                }
            }
        }
    }
});