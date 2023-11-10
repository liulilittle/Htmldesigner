'use strict';
/*
 *  Fragment class
 *     designers: liulilte
 *  提供内链视图分页的部分。
 */
var Fragment = function (options) {
    /* 
     * MetadataToken(RID)
     *  typedef 
     *      Fragment class
     */
    'use strict'

    this.constructor = Fragment;

    var __viewtemplateno = 0;
    var __self = this;
    var __rttitypeinfo = null;
    var __dom = null;
    var __disposed = false;
    var __container = $(Object.GetPropertyValue(__self, 'DOM'));
    var __super = {
        Dispose: this.Dispose,
    };
    var __extquerystr = '';
    var __eventset = Fragment.EventSet;
    this.EventSet = __eventset;

    var __ifrevtsinker = function (targetWindow, targetElement, targetEventObject, targetEventName) {
        if (__disposed || !__container) {
           return undefined;
        }
        try {
           if (targetWindow !== __self.GetFrame()) {
              return undefined;
           }
        } catch(e) { 
           return undefined;
        }
        var container = $(__container);
        container.trigger(targetEventName);
    };
    HtmlView.externs.Evokedpoints.AddListener(null, __ifrevtsinker);

    var PublishEvent = function (name, e) {
        __eventset.Publish(name, __self, e);
    }
    this.ViewTemplate = function () {
        'use strict'

        if (arguments.length <= 0) {
            return __viewtemplateno;
        }
        var value = Number(arguments[0]);
        if (isNaN(value)) {
            value = 0;
        }
        if (value !== __viewtemplateno) {
            __viewtemplateno = value;
            __self.Update();
        }
    }
    this.Update = function () {
        'use strict'

        var seturl = function (path) {
            if (!path) {
                path = '';
            }
            try {
                if (__dom.attr('src') !== path) {
                    __dom.attr("src", path);
                }
            } catch (e) {
                try {
                    var ifr = __dom.get(0);
                    if (ifr.src !== path) {
                        ifr.src = path;
                    }
                } catch (e) { }
            }
        }
        seturl(this.GetRawUrl());
    }
    this.AttachQueryString = function () {
        'use strict'
    
        if (arguments.length <= 0) {
            return __extquerystr;
        }
        var value = arguments[0];
        if (!value) {
            value = '';
        } else {
            value = value.toString();
        }
        if (__extquerystr !== value) {
            __extquerystr = value;
            this.Update();
        }
    }
    this.GetRawUrl = function () {
        'use strict'

        var path = '';
        if (isNaN(__viewtemplateno) || __viewtemplateno == 0) {
            if (arguments[0] === 1) {
                path = "about:blank";
            }
            return path;
        } else {
            var querystr = HtmlView.externs.GetQueryString();
            if (__self.IsOfflineMode) {
                path = HtmlView.externs.GetFullPath("./{0}.html".replace("{0}", __viewtemplateno.toString()));
                path += ('?' + querystr);
            } else {
                path = "/dg/run?id={0}".replace("{0}", __viewtemplateno.toString());
                path += ('&' + querystr);
            }
            path += '&' + (typeof __extquerystr === 'string' ? __extquerystr : '');
            do {
                var i = path.indexOf('?'); // 快速处理查询字符串分段 
                if (i <= -1) {
                    break;
                }
                var segments = path.substr(i + 1);
                if (!segments) {
                    break;
                }
                path = path.substr(0, i);
                segments = segments.split('&');
                if (!segments || !segments.length) {
                    break;
                }
                var sets = {}; 
                var segspath = '';
                for(var i = 0; i < segments.length; i++) {
                    var kv = segments[i];
                    if (!kv) {
                        continue;
                    }
                    var j = kv.indexOf('=');
                    if (j < 0) {
                        continue;
                    }
                    var key = kv.substr(0, j);
                    var value = kv.substr(j + 1);
                    if (!key || !value) {
                        continue;
                    }
                    if (!sets[key]) {
                        sets[key] = value;
                        segspath += ('&' + key + '=' + value);
                    }
                }
                if (segspath.charAt(0) === '&') {
                    segspath = segspath.substr(1);
                }
                path = (path + '?' + segspath);
            } while(false);   
            if (path) {
                if (path.charAt(path.length - 1) === '?') {
                    path = path.substr(0, path.length - 1);
                }
                if (__self.IsOfflineMode && path.indexOf("file:///") !== 0) {
                    path = 'file:///' + path; 
                }
            }
        }
        return path;
    }
    this.GetType = function () {
        'use strict'

        if (__rttitypeinfo === null) {
            __rttitypeinfo = Fragment.prototype.GetType();
        }
        return __rttitypeinfo;
    }
    this.GetWindow = function () {
        'use strict'

        if (!__dom) {
            Throwable.InvalidOperationException();
        }
        var ifr = __dom.get(0);
        var win = null;
        try {
            win = ifr.contentWindow;
        } catch (e) {
            Throwable.InvalidOperationException();
        }
        return win;
    }
    this.GetFrame = function () {
        'use strict'

        try {
            if (!__dom) {
                return null;
            }
            var ifr = __dom.get(0);
            if (!ifr) {
                return null;
            }
            return ifr;
        } catch (e) {
            return null;
        }
    }
    this.GetFrameUrl = function () {
        try {
            if (!__dom) {
                return null;
            }
            var e = __dom.get(0);
            var src = e ? e.src : '';
            if (!src) {
                src = $(__dom).attr('src');
            }
            if (!src) {
                src = '';
            }
            return HtmlView.externs.GetFullPath(src);
        }
        catch (e) {
            return '';
        }
    }
    this.Dispose = function () {
        'use strict'

        if (!__disposed) {
            Binding.Callsite(__self, '#Fragment::super.Dispose', __super.Dispose);
            try {
                __container.remove();
            } catch (e) { }
            __container = null;
            HtmlView.externs.Evokedpoints.RemoveListener(null, __ifrevtsinker);
        }
        __disposed = true;
    }

    Object.defineProperty(this, "IsOfflineMode", {
        get: function () {
            return HtmlView.externs.IsOfflineMode;
        }
    });

    +!(function () {
        'use strict'

        __dom = $('<iframe height="100%" width="100%" frameborder="0" style="position: fixed; left: 0; top: 0;">');
        !(function (iframe, callback) {
            if (iframe.attachEvent) {
                iframe.attachEvent("onreadystatechange", function () {
                    if (iframe.readyState === "complete" || iframe.readyState == "loaded") {
                        iframe.detachEvent("onreadystatechange", arguments.callee);
                        if (typeof callback === 'function') {
                            callback(this);
                        }
                    }
                });
            } else {
                iframe.addEventListener("load", function () {
                    this.removeEventListener("load", arguments.call, false);
                    if (typeof callback === 'function') {
                        callback(this);
                    }
                }, false);
            }
        })(__dom.get(0), function (iframe) {
            PublishEvent(__eventset.FrameNavigateCompleted);
        });
        __container.append(__dom);
        HtmlControl.Initialization(__self, HtmlControl.defaults, options);
        __self.Update();
    })();
};

Fragment.prototype.GetType = function () {
    'use strict'

    var typeinfo = HtmlControl.prototype.GetType();
    typeinfo.References.push('Fragment.js');
    typeinfo.FullName = Type.GetName(Fragment);

    typeinfo.Properties.push({
        Name: 'ViewTemplate',
        PropertyType: 'number,HtmlViewTemplate',
        Readable: true,
        Writeable: true,
        Browsable: true,
        Description: '获取或设置内链的视图模板。',
        Accessor: 'function',
    });
    typeinfo.Properties.push({
        Name: 'AttachQueryString',
        PropertyType: 'string',
        Readable: true,
        Writeable: true,
        Browsable: true,
        Description: '获取或设置附加的查询字符串。',
        Accessor: 'function',
    });
    return typeinfo;
}

Fragment.EventSet = function () {
    'use strict'

    Object.Merge(this, HtmlControl.EventSet);

    this.FrameNavigateCompleted = 'FrameNavigateCompleted';
}

!(function () {
    Fragment.EventSet = new Fragment.EventSet();

    // Type.References.Add('Fragment.js');
    Type.DefinedName('Fragment', 'Fragment');
    Type.DefinedFile('Fragment', 'Fragment.js');
})();