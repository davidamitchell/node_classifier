function _whatFont() {
    function t() {
        var a = b("<p>")
            .css("font-family", "S0m3F0n7"),
            c = b("<p>")
                .css("font-family", "serif"),
            d = b("<p>")
                .css("font-family", "sans-serif"),
            a = new i(new p(a)),
            c = new i(new p(c));
        new i(new p(d));
        q = a.isEqual(c) ? "serif" : "sans-serif"
    }
    var b, m, n, h, r, f, o, g, i, p, u, v, q, s = [];
    i = function(a, c, d) {
        d = d || {};
        this.data = [];
        if (i.isSupported) this.typeInfo = a, this.text = c || "abcdefghijklmnopqrstuvwxyz", this.canvas_options = b.extend(this.canvas_options, d), this.canvas = b("<canvas>")[0], this.draw()
    };
    i.isSupported = !! document.createElement("canvas")
        .getContext;
    i.prototype = {
        canvas_options: {
            fillStyle: "rgb(0,0,0)",
            height: 50,
            size: "40px",
            textBaseline: "top",
            width: 600
        },
        getFontOption: function() {
            return this.typeInfo.style + " " + this.typeInfo.weight + " " + this.canvas_options.size + " " + this.typeInfo.fonts
        },
        draw: function() {
            var a = this.canvas.getContext("2d");
            b.each(this.canvas_options, function(c, b) {
                a[c] = b
            });
            a.font = this.getFontOption();
            a.fillText(this.text, 0, 0);
            return this.data = a.getImageData(0, 0, this.canvas_options.width, this.canvas_options.height)
                .data
        },
        isEqual: function(a) {
            for (var c = 4 * this.canvas_options.width * this.canvas_options.height, b = this.data, e = a.data, a = 0; a < c; a += 1)
                if (b[a] !== e[a]) return !1;
            return !0
        }
    };
    p = function(a) {
        this.element = b(a);
        this.detect()
    };
    p.prototype = {
        detect: function() {
            this.detectBasicCSS();
            this.variant = this.getVariant();
            this.stack = this.fonts.split(/,\s*/);
            this.testCanvas = new i(this);
            this.current = this.getCurrentFont()
        },
        detectBasicCSS: function() {
            this.fonts = this.element.css("font-family");
            this.weight = this.element.css("font-weight");
            this.style =
                this.element.css("font-style");
            this.size = this.element.css("font-size");
            this.lineHeight = this.element.css("line-height");
            this.color = this.element.css("color")
        },
        getFullCSS: function() {
            var a = ["font-family", "font-weight", "font-style"],
                c = {}, b;
            for (b = 0; b < a.length; b++) c[a[b]] = this.element.css(a[b]);
            return c
        },
        getVariant: function() {
            return "normal" === this.weight && "normal" === this.style ? "regular" : "normal" === this.weight ? this.style : "normal" === this.style ? this.weight : this.weight + " " + this.style
        },
        getCurrentFont: function() {
            var a =
                this.stack.slice(0),
                c, d, e;
            for (c = 0; c < this.stack.length; c++)
                if (d = b.extend({}, this, {
                    fonts: a[c] + " ,serif",
                    stack: [a[c], "serif"]
                }), e = b.extend({}, this, {
                    fonts: a[c] + ", sans-serif",
                    stack: [a[c], "sans-serif"]
                }), d = new i(d), e = new i(e), d.isEqual(e) && this.testCanvas.isEqual(d)) return a[c];
            return q && (c = b.extend({}, this, {
                fonts: q,
                stack: [q]
            }), c = new i(c), this.testCanvas.isEqual(c)) ? q : a[0]
        },
        saveDesignToServer: function(a) {
            var c = this;
            b.getJSON(n + "/designs/create?callback=?", {
                font: this.current,
                style: this.style,
                weight: this.weight,
                image_base64: this.screenshot,
                url: document.location.toString()
            }, function(b) {
                if (b.url) c.designURL = b.url;
                a && a()
            })
        }
    };
    h = {
        STYLE_PRE: "__whatfont_",
        CSS_URL: "http://chengyinliu.com/wf.css?ver=2.0",
        init: function() {
            if (h.CSS_URL) h.$el = b("<link>")
                .attr({
                    rel: "stylesheet",
                    href: h.CSS_URL
                })
                .appendTo("head")
        },
        restore: function() {
            h.$el && h.$el.remove()
        },
        getClassName: function(a) {
            a = "string" === typeof a ? [a] : a;
            return h.STYLE_PRE + a.join(" " + h.STYLE_PRE)
        }
    };
    g = {
        getSlugWithCSSName: {},
        fontData: {},
        services: {},
        init: function() {
            g.typekit();
            g.google();
            g.fontdeck()
        },
        typekit: function() {
            var a;
            b("script")
                .each(function() {
                    var c = this.src.match(/use\.typekit\.(com|net)\/(.+)\.js/);
                    if (c) return a = c[2], !1
                });
            a && b.getJSON("https://typekit.com/api/v1/json/kits/" + a + "/published?callback=?", function(a) {
                if (!a.errors) g.services.typekit = a.kit, b.each(a.kit.families, function(a, c) {
                    b.each(c.css_names, function(a, b) {
                        g.getSlugWithCSSName[b.toLowerCase()] = c.slug
                    });
                    g.fontData[c.slug] = g.fontData[c.slug] || {
                        name: c.name,
                        services: {}
                    };
                    g.fontData[c.slug].services.Typekit = {
                        id: c.id,
                        url: "http://typekit.com/fonts/" + c.slug
                    }
                })
            })
        },
        google: function() {
            b("link")
                .each(function(a, c) {
                    var d = b(c)
                        .attr("href");
                    0 <= d.indexOf("fonts.googleapis.com/css?") && (d = d.match(/\?family=([^&]*)/)[1].split("|"), b.each(d, function(a, c) {
                        var b = c.split(":")[0],
                            d = b.replace(/\+/g, " "),
                            f = d.replace(/ /g, "-")
                                .toLowerCase();
                        g.getSlugWithCSSName[d] = f;
                        g.fontData[f] = g.fontData[f] || {
                            name: d,
                            services: {}
                        };
                        g.fontData[f].services.Google = {
                            url: "http://www.google.com/webfonts/family?family=" + b
                        }
                    }))
                })
        },
        fontdeck: function() {
            var a = [],
                c = location.hostname;
            b("link")
                .each(function(c, e) {
                    var j = b(e)
                        .attr("href");
                    0 <= j.indexOf("fontdeck.com") && (j = j.match(/^.*\/(\d+)\.css$/)) && a.push(j[1])
                });
            b("script")
                .each(function(c, e) {
                    var j = b(e)
                        .attr("src");
                    "undefined" !== typeof j && 0 <= j.indexOf("fontdeck.com") && (j = j.match(/^.*\/(\d+)\.js$/)) && a.push(j[1])
                });
            b.each(a, function(a, e) {
                b.getJSON("http://fontdeck.com/api/v1/project-info?project=" + e + "&domain=" + c + "&callback=?", function(a) {
                    "undefined" !== typeof a && "undefined" !== typeof a.provides && b.each(a.provides,
                        function(a, c) {
                            var b = c.name,
                                d = b.replace(/ /g, "-")
                                    .toLowerCase(),
                                e = b.split(" ")[0],
                                e = c.url || "http://fontdeck.com/search?q=" + e;
                            g.getSlugWithCSSName[b] = d;
                            g.fontData[d] = g.fontData[d] || {
                                name: b,
                                services: {}
                            };
                            g.fontData[d].services.Fontdeck = {
                                url: e
                            }
                        })
                })
            })
        },
        getFontDataByCSSName: function(a) {
            a = a.replace(/^"|'/, "")
                .replace(/"|'$/, "");
            return (a = g.getSlugWithCSSName[a]) && g.fontData[a] ? g.fontData[a] : null
        },
        getFontNameByCSSName: function(a) {
            a = a.replace(/^"|'/, "")
                .replace(/"|'$/, "");
            return (a = g.getSlugWithCSSName[a]) &&
                g.fontData[a] ? g.fontData[a].name : null
        }
    };
    u = function() {
        this.currentCacheId = -1;
        this.el = b.wfElem("div", ["tip", "elem"], "");
        this.$el = b(this.el);
        this.init()
    };
    u.prototype = {
        init: function() {
            var a = this;
            this.$el.appendTo("body");
            b("body :visible")
                .on("mousemove.wf", function(c) {
                    a.update(b(this), c);
                    a.show();
                    c.stopPropagation()
                });
            b("body")
                .on("mouseout.wf", function() {
                    a.hide()
                })
        },
        hide: function() {
            this.$el.hide()
        },
        show: function() {
            this.$el.show()
        },
        update: function(a, c) {
            var b = a.data("wfCacheId");
            this.updatePosition(c.pageY,
                c.pageX);
            if (this.element !== a) {
                if (!b) b = s.length, s.push(void 0);
                this.element = a;
                this.element.data("wfCacheId", b);
                s[b] = this.typeInfo = s[b] || new p(a);
                this.updateText(this.typeInfo.current)
            }
        },
        updatePosition: function(a, c) {
            this.$el.css({
                top: a + 12,
                left: c + 12
            })
        },
        updateText: function(a) {
            this.$el.text(a)
                .css("display", "inline-block")
        },
        remove: function() {
            this.$el.remove();
            b("body :visible")
                .off("mousemove.wf");
            b("body")
                .off("mouseout.wf")
        }
    };
    f = {
        fontServiceIcons: {},
        init_tmpl: function() {
            f.tmpl = function() {
                var a = b('<div class="elem panel"><div class="panel_title"><span class="title_text"></span><a class="close_button" title="Close">&times;</a></div><div class="panel_content"><ul class="panel_properties"><li><dl class="font_family"><dt class="panel_label">Font Family</dt><dd class="panel_value"></dd></dl></li><li><div class="size_line_height clearfix"><dl class="size section"><dt class="panel_label">Font Size</dt><dd class="panel_value"></dd></dl><dl class="line_height"><dt class="panel_label">Line Height</dt><dd class="panel_value"></dd></dl></div></li><li class="panel_no_border_bottom"><dl class="type_info clearfix"><dt class="panel_label"></dt><dd class="type_preview">AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz</dd></dl><div class="font_services panel_label" style="display:none;">Font Served by </div></li></ul><div class="panel_tools clearfix"><div class="panel_tools_left"><div class="color_info"><a title="Click to change color format" class="color_info_sample">&nbsp;</a><span class="color_info_value"></span></div></div><div class="panel_tools_right"><a href="https://twitter.com/share" class="tweet_icon" target="_blank">Tweet</a></div></div></div></div>');
                return function() {
                    return a.clone()
                }
            }()
        },
        init: function() {
            b("body :visible")
                .on("click.wf", f.pin);
            f.init_tmpl();
            f.panels = b([]);
            f.fontServiceIcons.Typekit = b("<span>")
                .addClass("service_icon service_icon_typekit")
                .text("Typekit");
            f.fontServiceIcons.Google = b("<span>")
                .addClass("service_icon service_icon_google")
                .text("Google Web Fonts");
            f.fontServiceIcons.Fontdeck = b("<span>")
                .addClass("service_icon service_icon_fontdeck")
                .text("Fontdeck")
        },
        restore: function() {
            b("body :visible")
                .unbind("click.wf", f.pin);
            f.panels.remove()
        },
        convertClassName: function(a) {
            a.find("*")
                .add(a)
                .each(function(a, d) {
                    var e = b(d)
                        .attr("class");
                    if (e = "" === e ? "basic" : e + " basic") e = e.split(" "), b(d)
                        .attr("class", h.getClassName(e))
                });
            return a
        },
        typePreview: function(a, c) {
            b(c)
                .find(".type_preview")
                .css(a.getFullCSS());
            return c
        },
        fontService: function(a, c) {
            var d = g.getFontDataByCSSName(a.current),
                e;
            e = b("<ul>")
                .addClass("font_service");
            d ? (b.each(d.services, function(a, c) {
                    b("<li>")
                        .append(b("<a>")
                            .append(b(f.fontServiceIcons[a])
                                .clone())
                            .attr("href",
                                c.url)
                            .attr("target", "_blank"))
                        .appendTo(e)
                }), b(c)
                .find(".font_services")
                .append(e)
                .show()) : b(c)
                .find(".font_services")
                .hide();
            return c
        },
        fontFam: function(a, c) {
            var d = a.fonts.replace(/;/, "")
                .split(/,\s*/),
                e = a.current,
                j = !1,
                l;
            a.fonts.replace(/;/, "")
                .split(/,\s*/);
            for (l = 0; l < d.length; l += 1)
                if (d[l] !== e) d[l] = "<span class='fniu'>" + d[l] + "</span>";
                else {
                    d[l] = "<span class='fiu'>" + d[l] + "</span>";
                    j = !0;
                    break
                }
            d = d.join(", ") + ";";
            j || (d += " <span class='.fiu'>" + e + "</span>");
            d = "<div class=" + h.getClassName("fontfamily_list") +
                ">" + d + "</div>";
            b(c)
                .find(".font_family>dd")
                .html(d);
            return c
        },
        sizeLineHeight: function(a, c) {
            var d = a.size,
                e = a.lineHeight;
            b(c)
                .find(".size>dd")
                .text(d);
            b(c)
                .find(".line_height>dd")
                .text(e);
            return c
        },
        color: function(a, c) {
            var d = a.color,
                e = b(c)
                    .find(".color_info_sample"),
                j = b(c)
                    .find(".color_info_value"),
                l, f, g; - 1 !== d.indexOf("rgba") ? b(c)
                .find(".color_info")
                .hide() : (l = d.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/), f = parseInt(l[1], 10)
                    .toString(16), g = parseInt(l[2], 10)
                    .toString(16), l = parseInt(l[3],
                        10)
                    .toString(16), f = 1 === f.length ? "0" + f : f, g = 1 === g.length ? "0" + g : g, l = 1 === l.length ? "0" + l : l, f = [d, "#" + f + g + l], e.css("background-color", d)
                    .click(function(a, c, b) {
                        return function(d) {
                            c = (c + 1) % a.length;
                            b.text(a[c]);
                            d.preventDefault();
                            return !1
                        }
                    }(f, 0, j))
                    .click())
        },
        tweet: function(a, c) {
            var d = b(c)
                .find(".tweet_icon"),
                e = a.current,
                j = g.getFontNameByCSSName(e) || e;
            d.click(function() {
                var b = d.attr("href");
                f.takeScreenshot(c.e, c, function() {
                    b += "?text=" + encodeURIComponent("I like this typography design with " + j + ".") + "&url=" +
                        encodeURIComponent(a.designURL || window.location.href) + "&via=What_Font";
                    window.open(b, "", "height=430,width=550")
                });
                return !1
            })
        },
        panelContent: function(a, c) {
            b("typePreview,fontService,fontFam,sizeLineHeight,color,tweet".split(","))
                .each(function(b, e) {
                    f[e](a, c)
                })
        },
        panelTitle: function(a, c) {
            var d = a.current,
                d = (g.getFontNameByCSSName(d) || d) + " - " + a.variant;
            b(c)
                .find(".title_text")
                .html(d)
                .css(a.getFullCSS());
            (function(a) {
                b(a)
                    .find(".close_button")
                    .click(function(c) {
                        b(a)
                            .remove();
                        c.stopPropagation();
                        return !1
                    })
            })(c);
            return c
        },
        get: function(a) {
            var c = f.tmpl(),
                a = new p(a);
            f.panelTitle(a, c);
            f.panelContent(a, c);
            f.convertClassName(c);
            c.typeInfo = a;
            b(c)
                .click(function() {
                    b(this)
                        .find("*")
                        .css("-webkit-animation", "none");
                    b(this)
                        .detach();
                    b(this)
                        .appendTo("html")
                });
            return c
        },
        takeScreenshot: function(a, c, b) {
            c.typeInfo.designURL ? b(a, c) : k.takeScreenshotAroundPoint(function(e) {
                e ? (c.screenshot = e, c.typeInfo.screenshot = e, c.typeInfo.saveDesignToServer(function() {
                    b(a, c)
                })) : b(a, c)
            }, a.pageX, a.pageY, 480, 320)
        },
        showPanel: function(a, c) {
            b(c)
                .css({
                    top: a.pageY +
                        12,
                    left: a.pageX - 13
                })
                .appendTo("html");
            f.panels = f.panels.add(c)
        },
        pin: function(a) {
            var c;
            v.hide();
            c = f.get(this);
            c.e = a;
            f.showPanel(a, c);
            a.stopPropagation();
            a.preventDefault()
        },
        hideAll: function() {
            b(f.panels)
                .hide()
        },
        showAll: function() {
            b(f.panels)
                .find("*")
                .css("-webkit-animation", "none");
            b(f.panels)
                .show()
        }
    };
    r = {
        TOOLBAR: null,
        init: function() {
            var a = b.wfElem("div", "exit", "Exit WhatFont");
            b.wfElem("div", "help", "<strong>Hover</strong> to identify<br /><strong>Click</strong> to pin a detail panel");
            r.TOOLBAR =
                b("<div>")
                .addClass(h.getClassName(["elem", "control"]))
                .append(a)
                .appendTo("body");
            b(a)
                .click(function() {
                    o.restore()
                })
        },
        restore: function() {
            b(r.TOOLBAR)
                .remove()
        }
    };
    o = {
        shortcut: function(a) {
            if (27 === (a.keyCode || a.which)) o.restore(), a.stopPropagation()
        },
        restore: function() {
            b("body :visible")
                .unbind("mousemove", o.updateTip);
            b("body :visible")
                .unbind("click", o.pinPanel);
            r.restore();
            v.remove();
            f.restore();
            h.restore();
            b("body")
                .unbind("keydown", o.shortcut);
            b(window)
                .unbind("resize.whatfont");
            window._WHATFONT = !1
        },
        init: function() {
            !b && jQuery && (b = jQuery);
            if ("undefined" !== typeof window._WHATFONT && window._WHATFONT || !b) return !1;
            window._WHATFONT = !0;
            b.wfElem = function(a, c, d, e) {
                var f = b("<" + a + ">"),
                    c = c || [],
                    d = d || "",
                    c = "string" === typeof c ? [c] : c;
                c.push("basic");
                f.addClass(h.getClassName(c));
                "string" === typeof d ? f.html(d) : d.constructor === Array ? b.map(d, function(a) {
                    return f.append(a)
                }) : f.append(d);
                "undefined" !== typeof e && f.attr(e);
                return f[0]
            };
            t();
            h.init();
            v = new u;
            f.init();
            r.init();
            g.init();
            k.fullScreenshot = null;
            b(window)
                .bind("resize.whatfont",
                    function() {
                        k.fullScreenshot = null
                    });
            b("body")
                .keydown(o.shortcut)
        }
    };
    var k = {
        captureAll: !0,
        format: "image/jpeg",
        quality: 0.7,
        capturer: function(a, c) {
            var c = c || {}, d, e;
            d = b(window)
                .scrollTop();
            e = b(window)
                .scrollLeft();
            if (i.isSupported && m) try {
                b(window)
                    .scrollTop(0), b(window)
                    .scrollLeft(0), m([document.body], {
                        onrendered: function(f) {
                            b(window)
                                .scrollTop(d);
                            b(window)
                                .scrollLeft(e);
                            k.fullScreenshot = f;
                            a(f.toDataURL(c.format || k.format, c.quality || k.quality))
                        },
                        proxy: void 0
                    })
            } catch (f) {
                b(window)
                    .scrollTop(d), b(window)
                    .scrollLeft(e),
                a()
            } else a(), b(window)
                .scrollTop(d), b(window)
                .scrollLeft(e)
        },
        dataURLToCanvas: function(a, c) {
            try {
                var d = b("<canvas>")[0],
                    e = d.getContext("2d"),
                    f = new Image;
                f.onload = function() {
                    e.height = f.height;
                    e.width = f.width;
                    e.drawImage(f, 0, 0);
                    c(d)
                };
                f.src = a
            } catch (g) {
                c(null)
            }
        },
        takeFullScreenshot: function(a) {
            if (k.fullScreenshot) return a(k.fullScreenshot);
            this.capturer(function(c) {
                k.fullScreenshot = c;
                a(c)
            }, {
                quality: k.quality,
                format: k.format
            })
        },
        takePartialScreenshot: function(a) {
            f.hideAll();
            window.setTimeout(function() {
                k.capturer(function(c) {
                    f.showAll();
                    a(c)
                })
            }, 0)
        },
        takeCroppedScreenshot: function(a, c, d, e, f, g) {
            var h, i, m;
            h = k.captureAll ? k.takeFullScreenshot : k.takePartialScreenshot;
            void 0 !== c && (i = e - c, m = f - d);
            g = g || {};
            h(function(e) {
                var f;
                if (!e) return a();
                void 0 === c ? a(e) : (f = new Image, f.src = e, f.onload = function() {
                    var e, j;
                    e = b("<canvas>")[0];
                    e.width = i;
                    e.height = m;
                    j = e.getContext("2d");
                    j.fillStyle = "rgba(255,255,255,1)";
                    j.fillRect(0, 0, i, m);
                    j.drawImage(f, c, d, i, m, 0, 0, i, m);
                    e = e.toDataURL(g.format || k.format, g.quality || k.quality);
                    a(e)
                });
                return !0
            }, g)
        },
        takeScreenshotAroundPoint: function(a,
            c, d, e, f, g) {
            var c = c - e / 2,
                e = c + e,
                d = d - f / 2,
                f = d + f,
                h, i;
            k.captureAll || (h = b(window)
                .scrollTop(), i = b(window)
                .scrollLeft(), c -= i, e -= i, d -= h, f -= h);
            0 > c && (e -= c, c = 0);
            0 > d && (f -= d, d = 0);
            k.takeCroppedScreenshot(a, c, d, e, f, g)
        }
    };
    return {
        setJQuery: function(a) {
            b = a
        },
        setHTML2Canvas: function(a) {
            m = a
        },
        setScreenshot: function(a) {
            k = b.extend(k, a)
        },
        setAPIURL: function(a) {
            n = a
        },
        setCSSURL: function(a) {
            h.CSS_URL = a
        },
        getVer: function() {
            return "2.0"
        },
        init: function() {
            o.init()
        },
        restore: function() {
            o.restore()
        }
    }
}
(function() {
    function t() {
        if ("undefined" !== typeof _WHATFONT && _WHATFONT) return b.restore(), !1;
        wf$.getJSON = function(b, n, h) {
            h || (h = n, n = void 0);
            chrome.extension.sendRequest({
                action: "getJSON",
                url: b,
                data: n
            }, h)
        };
        b.setJQuery(wf$);
        b.setCSSURL(chrome.extension.getURL("wf.css"));
        b.setAPIURL("http://www.whatfonttool.com/api/v1");
        b.setScreenshot({
            capturer: function(b, n) {
                chrome.extension.sendRequest({
                    action: "capture",
                    options: n || {
                        format: "image/png"
                    }
                }, b)
            },
            captureAll: !1,
            format: "image/jpeg",
            quality: 0.9
        });
        b.init();
        return !0
    }
    var b = b || _whatFont();
    chrome.extension.onRequest.addListener(function(b, n, h) {
        "initOrRestore" === b.action && h(t())
    })
})();