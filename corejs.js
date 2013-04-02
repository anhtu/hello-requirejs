(function () {
    window.dc = {};
    dc.controllers = {};
    dc.model = {};
    dc.app = {};
    dc.ui = {}
})();

window.dc || (window.dc = {});
dc.inflector = {
    small: "(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|v[.]?|via|vs[.]?)",
    punct: "([!\"#$%&'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]*)",
    titleize: function (e) {
        e = e.replace(/[-.\/_]/g, " ").replace(/\s+/gm, " ");
        var d = this.capitalize;
        var f = [],
            c = /[:.;?!] |(?: |^)["Ã’]/g,
            b = 0;
        while (true) {
            var a = c.exec(e);
            f.push(e.substring(b, a ? a.index : e.length).replace(/\b([A-Za-z][a-z.'Ã•]*)\b/g, function (g) {
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
        return f.join("").replace(/ V(s?)\. /ig, " v$1. ").replace(/(['Ã•])S\b/ig, "$1s").replace(/\b(AT&T|Q&A)\b/ig, function (g) {
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

/**
 * represents an account
 * an account belongs to one or many organizations
 *
 * @type {*}
 */
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
        /* an account belongs to one or many organizations */
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

/**
 * represents a collection of account
 * account set is added to window object
 *
 */
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

/**
 * for google analytics
 */
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

/**
 * represents a Document
 *
 * a Document contains a collection of Notes (annotations)
 * a Document can be reviewed by one or many accounts
 *
 * @type {*}
 */
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

/**
 * _.extend(destination, *sources)
 * Copy all of the properties in the source objects over to the destination object, and return the destination object.
 * It's in-order, so the last source will override properties of the same name in previous arguments.
 *
 * _.extend({name : 'moe'}, {age : 50});
 * => {name : 'moe', age : 50}
 */
_.extend(dc.ui.Dialog, {

    /**
     * extends the basic Dialog to have a alert Dialog
     *
     * @param {String} b alert message
     * @param {Object} a
     *
     * @example dc.ui.Dialog.alert("Your password can't be blank")
     **/
    alert: function (b, a) {
        return new dc.ui.Dialog(_.extend({
            mode: "alert",
            title: null,
            text: b
        }, a)).render()
    },

    /**
     * represents a prompt for password
     *
     * @param d
     * @param c
     * @param e
     * @param a
     * @return {*}
     */
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
    /**
     * a progress bar
     *
     *
     * @param {String} b text
     * @param a
     * @return {*}
     * @example
     *      var a = dc.ui.Dialog.progress("Preparing " + dc.inflector.pluralize("document", b.length) + " for download...");
     *      dc.app.download("/download/" + b.join("/") + "/document_viewer.zip", function () {
     *          a.close()
     *      })
     */
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

    /**
     * @example
     *      new dc.ui.Menu({
     *          id: "document_menu",
     *          standalone: true
     *      });
     */
    options: {
        id: null,
        standalone: false
    },

    events: {
        click: "open",
        selectstart: "_stopSelect"
    },

    /**
     * overrides constructor, meaning the dc.ui.Menu
     *
     * @param a
     */
    constructor: function (a) {
        this.modes = {};

        /**

         *
         * bindAll: _.bindAll(object, [*methodNames])
         *
         */
        _.bindAll(this, "close"); // bind close method to this Menu object

        /* call the constructor of View, passing a as arguments */
        /**
         * Backbone View constructor:
         *
         * function (options){
         *
         *  uniqueId: _.uniqueId([prefix])
         *      Generate a globally-unique id for client-side models or DOM elements that need one.
         *      If prefix is passed, the id will be appended to it.
         *      _.uniqueId('contact_');
         *      => 'contact_104'
         *  this.cid = _.uniqueId("view");
         *
         *
         *  this._configure(options||{});
         *
         *  Ensure that the View has a DOM element to render into. If this.el is a string, pass it through $(), take the first matching element,
         *  and re-assign it to el. Otherwise, create an element from the id, className and tagName properties.
         *  this._ensureElement();
         *
         *  Call initialize()
         *  this.initialize.apply(this,arguments);
         *
         *  set callbacks from events {}
         *  this.delegateEvents()
         * }
         */
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

/*
 * Dialog for upload
  *
 **/
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
                var g = " in " + (b ? "â€œ" : "") + this.titleBox.html() + (b ? "â€" : "");
                var f = e ? e + " " + dc.inflector.pluralize("Result", e) : "No Results";
                this.titleBox.html(f + g)
            }
        } if (e <= 0) {
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
dc.controllers.Workspace = Backbone.Router.extend({
    routes: {
        "help/:page": "help",
        help: "help"
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
