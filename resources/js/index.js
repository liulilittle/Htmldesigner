'use strict'

$(function () {
    //$.ajax({
    //    type: "get",
    //    url: '/dg/components/getall',
    //    success: function (data) {
    //        data = JSON.parse(data);
    //        if (data.ErrorCode == 0) {
    //            LoadControls(data.Tag, View);
    //            filtrateData(data.Tag)
    //        }
    //    },
    //});
    ViewsOperation = new ViewsOperation();
    var components = [{
        "componentid": "HtmlControl",
        "codeurl": "HtmlControl.js",
        "name": "HtmlControl",
        "type": 0,
        "description": "控件的基类",
        "references": "../resources/js/HtmlControl.js",
        "inheritances": null
    }, {
        "componentid": "ListBox",
        "codeurl": "ListBox.js",
        "name": "ListBox",
        "type": 0,
        "description": "控件的基类",
        "references": "../resources/js/ListBox.js",
        "inheritances": 'ListBox'
    }, {
        "componentid": "VideoBox",
        "codeurl": "VideoBox.js",
        "name": "VideoBox",
        "type": 0,
        "description": "控件的基类",
        "references": "../resources/js/VideoBox.js",
        "inheritances": 'VideoBox'
    }, {
        "componentid": "MediaBox",
        "codeurl": "MediaBox.js",
        "name": "MediaBox",
        "type": 0,
        "description": "控件的基类",
        "references": "../resources/js/MediaBox.js",
        "inheritances": 'MediaBox'
    }, {
        "componentid": "TabControl",
        "codeurl": "TabControl.js",
        "name": "TabControl",
        "type": 0,
        "description": "控件的基类",
        "references": "../resources/js/TabControl.js",
        "inheritances": 'TabControl'
    }, {
        "componentid": "Fragment",
        "codeurl": "Fragment.js",
        "name": "Fragment",
        "type": 0,
        "description": "控件的基类",
        "references": "../resources/js/Fragment.js",
        "inheritances": 'Fragment'
    }, {
        "componentid": "QueueInfo",
        "codeurl": "QueueInfo.js",
        "name": "QueueInfo",
        "type": 0,
        "description": "控件的基类",
        "references": "../resources/js/QueueInfo.js",
        "inheritances": 'QueueInfo'
    }];

    $($(".ui-draggable")[0]).data('components', components[0]);
    $($(".ui-draggable")[1]).data('components', components[1]);
    $($(".ui-draggable")[2]).data('components', components[2]);
    $($(".ui-draggable")[3]).data('components', components[3]);
    $($(".ui-draggable")[4]).data('components', components[4]);
    $($(".ui-draggable")[5]).data('components', components[5]);
    $(".QueueInfo").click(function () {
        var data = eval(components[6].name);
        var container = $(".table_1 tbody");
        drag.show(data, container, 1);
    });

    drag.init('drag', 'canvas');
    //setInterval(function () {
    //    var layout = View.SuspendLayout();
    //    var code = JSON.stringify(layout);
    //    if (ViewsOperation.LastStep() == code)
    //        return;
    //    ViewsOperation.Add(code);
    //},1000);
});
var ViewsOperation = function () {
    var RevokeList = [];//撤销
    var RedoList = [];//重做
    this.Revoke = function () {
        if (RevokeList.length <= 0)
            return;
        var rvoControl = RevokeList.pop();
        var towControl = RevokeList[RevokeList.length - 1];
        if (towControl == undefined) {
            $(eval(rvoControl.Name)).data('.this').Dispose();
            return;
        }
        RedoList.push(rvoControl);
        var com = {
            "componentid": "HtmlControl",
            "codeurl": "HtmlControl.js",
            "name": towControl.Name,
            "type": 0,
            "description": "控件的基类",
            "references": "../resources/js/HtmlControl.js",
            "inheritances": null
        };
        if (towControl['FullName'] == 'ListBox') {
            com.codeurl = 'ListBox.js';
            com.componentid = 'ListBox';
            com.references = '../resources/js/ListBox.js';
            com.inheritances = 'ListBox';
        }
        try {   
            //View.Controls.Remove($(eval(rvoControl.Name)).data('.this'));
            $(eval(rvoControl.Name)).data('.this').Dispose();
        } catch (e) { };

        if (towControl.Name != rvoControl.Name) {
            var temp = 0;
            for (var i = RevokeList.length - 1; i >= 0; i--) {
                if (RevokeList[i].Name == rvoControl.Name) {
                    towControl = RevokeList[i];
                    temp = 1;
                }
            }
            if (temp == 0)
                return;
        }
        var con = HtmlDesigner.Control.New(com);
        //var con = $(eval(rvoControl.Name)).data('.this');
        var type = con.GetType();
        var Properties = type.Properties;
        drag.showContor(towControl['FullName'], con);
            var pro = Properties[i];        
        for (var i = 0; i < Properties.length; i++) {
            if (pro.Writeable) {
                var val = towControl[pro.Name];
                if (pro.PropertyType == 'number') {
                    val = parseInt(val);
                }
                drag.setValue(con, pro.Name, val);
            }
        }
    };
    this.Redo = function () {
        if (RedoList.length <= 0)
            return;
        var ctl = RedoList.shift();
        RevokeList.push(ctl);
        return ctl;
    };
    this.Add = function (control) {
        //if (control == undefined) {
        //    toastr.info("没有接收到控制器");
        //    return;
        //}
        //if (ViewsOperation.IsNewOperation(control)) {
        //    var newcontrol = {};
        //    var type = control.GetType();
        //    var Properties = type.Properties;
        //    newcontrol['FullName'] = type.FullName;
        //    for (var i = 0; i < Properties.length; i++) {
        //        var pro = Properties[i];
        //        if (pro.Writeable) {
        //            newcontrol[pro.Name] = control[pro.Name]();
        //        }
        //    }
        //    RevokeList.push(newcontrol);
        //    RedoList = [];
        // toastr.info("添加了一步");
        //}
    };
    this.LastStepIsEqual = function (control) {
        if (RevokeList.length <= 0) {
            return false;
        }
        var type = control.GetType();
        var Properties = type.Properties;
        var lastCon = RevokeList[RevokeList.length - 1];
        for (var i = 0; i < Properties.length; i++) {
            var pro = Properties[i];
            if (pro.Writeable) {
                if (lastCon[pro.Name] != control[pro.Name]()) {
                    if (typeof (lastCon[pro.Name]) == 'object')
                        continue;
                    return false;
                }
            }
        }
        return true;
    };
    this.IsNewOperation = function (control) {
        for (var i = 0; i < RevokeList.length; i++) {
            if (RevokeList[i] == control)
                return false;
        }
        for (var j = 0; j < RedoList.length; j++) {
            if (RedoList[j] == control)
                return false;
        }
        return true;
    };
};
//筛选数据源
function filtrateData(data) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].type == 1) {
            DataSources.push(data[i]);
        }
    }
}

function LoadReferences(references) {
    if (typeof references === 'string') {
        references = references.split(',');
    }
    if (!__instanceof(references, Array) || references.length <= 0) {
        return undefined;
    }
    var loadscript = function (index) {
        var codeurl = null;
        do {
            codeurl = references[index];
            if (codeurl) {
                break;
            }
        } while (index++ < references.length);
        HtmlView.LoadReferences(codeurl, function () {
            loadscript(index + 1);
        })
    }
    loadscript(0);
}

function LoadControls(data, view) {
    //$('.controls-list').empty();
    for (var i = 0; i < data.length; i++) {
        if (data[i].name == 'HtmlControl') {
            continue;
        }
        var component = data[i];
        var html = $('<p class="ui-draggable ' + component.name + '">' + component.name +
            '<a href="##"><span class="glyphicon glyphicon-move"></span></a></p>');


        (function () {
            var references = component.references;
            if (!references) {
                references = [];
            } else {
                references = references.split(',');
            }
            if (component.codeurl) {
                references.push(component.codeurl);
            }
            LoadReferences(references);
        })();

        html.data("components", component);

        switch (component.type) {
            case 0:
                $('.controls-list').append(html);
                break;
            case 1:
                html.removeClass("ui-draggable");
                html.find("span").remove();
                $('.data-source').append(html);
                (function (name, type) {
                    html.click(function () {
                        showDataInfo(name, type);
                        $(".data-title").html(name);
                    })
                })(data[i].name)
                break;
        }
    }
}
!(function () {
    'use strict'
    // dd
    var model = $.fn.modal;
    $.fn.extend({
        'modal': function (b, d) {
            var dom = $(this);
            var mo = Binding.Callsite(dom, '#____internal_modal', model, arguments);
            dom.removeAttr("tabindex");
            return mo;
        }
    });
})();
function showDataInfo(data, type) {
    var data = eval(data);
    var container = $(".table_1 tbody");

    drag.show(data, container, 1);
}

var HtmlDesigner = (function() {
    'use strict'

    var _self_ptr = new Object({
        Control: new (function () {
            var __self = this;

            this.New = function (type) {
                'use strict'

                var inheritances = null;
                if (typeof type !== 'object') {
                    var typeinfo = Object.GetType(type);
                    inheritances = typeinfo.BaseType;
                } else {
                    inheritances = type.inheritances;
                }
                if (typeof inheritances === 'string') {
                    inheritances = inheritances.split(',');
                }
                var tempvalues = [];
                if (inheritances) {
                    for (var i = 0; i < inheritances.length; i++) {
                        var inheritance = inheritances[i];
                        if (!inheritance) {
                            continue;
                        }
                        tempvalues.push(inheritance);
                    }
                }
                inheritances = tempvalues;
                var key = HtmlControl.NewName(inheritances[inheritances.length - 1]);
                if (key == null) {
                    throw Throwable.InvalidOperationException();
                }
                var control = HtmlControl.New({
                    Name: key,
                    Visible: true,
                    Text: '',
                    BackgroundImage: null,
                    BackgroundImageLayout: 3,
                }, inheritances);
                View.Controls.Add(control);
                return control;
            }
            this.GetAllKeys = function () {
                return HtmlControl.GetAllControlName();
            }
            this.GetAllControls = function () {
                return HtmlControl.GetAllControlInstance();
            }
        }),
        Type: new (function () {
            this.GetAllTypes2 = function (prototype) {
                var types = {};
                if (!prototype) {
                    return types;
                }
                var s = prototype;
                if (typeof prototype === 'string') {
                    s = prototype.split(',');
                }
                if (__instanceof(s, Array)) {
                    for (var i = 0; i < s.length; i++) {
                        var n = s[i];
                        if (!n) {
                            continue;
                        }
                        n = n.trim();
                        if (!n) {
                            continue;
                        }
                        types[n] = 1;
                    }
                }
                return types;
            }
        }),
        Resource: new (function () {
            var APIInvokerAsync = function (url, data, success, error) {
                $.ajax({
                    type: "POST",
                    url: url,
                    data: data,
                    error: function () {
                        if (typeof error === 'function') {
                            error(response);
                        }
                    },
                    success: function (contents) {
                        var response = null;
                        var proc = null;
                        try {
                            response = JSON.parse(contents);
                            proc = success;
                        } catch (e) {
                            proc = error;
                        }
                        if (typeof proc === 'function') {
                            proc(response);
                        }
                    },
                });
            }
            this.Update2 = function (file, options) {
                if (!file) {
                    Throwable.ArgumentNullException();
                }
                if (!options) {
                    options = new Object({});
                }
                if (!options.dir) {
                    options.dir = '/';
                }
                var fd = new FormData();
                fd.set('data', file);
                fd.set('dir', options.dir);

                var xhr = new XMLHttpRequest();
                xhr.open("POST", "/dg/resources/u", true);
                xhr.overrideMimeType("application/octet-stream");
                xhr.onload = function () {
                    try {
                        var success = options.success;
                        if (typeof success == 'function') {
                            success(JSON.parse(xhr.responseText));
                        }
                    } catch (e) {
                        var error = options.error;
                        if (typeof error == 'function') {
                            error();
                        }
                    }
                };
                xhr.onerror = options.error;
                xhr.onabort = options.error;
                xhr.upload.onprogress = options.progress;
                xhr.send(fd);
            }
            this.Upload = function (options) {
                if (!options) {
                    options = new Object({});
                }
                if (typeof options !== 'object') {
                    Throwable.ArgumentException();
                }
                var form = $('#______dynamic_subform__av8d_d4t4___form___');
                if (form.length <= 0) {
                    form = $('<form id="______dynamic_subform__av8d_d4t4___form___" action="javascript: void(0)"' +
                        'enctype = "multipart/form-data" method = "post" > ' +
                        '<input type="file" name="datafile" tabindex="-1" style="visibility:' +
                        'hidden; width: 0px; height: 0px; ">' +
                        '</form>');
                    $(document.body).append(form);
                }
                if (!options.dir) {
                    options.dir = '/';
                }
                if (!options.posting) {
                    options.posting = this.Update2;
                }
                var datafile = form.get(0)['datafile'];
                $(datafile).off('change');
                $(datafile).on('change', function () {
                    var files = datafile.files;
                    if (files.length > 0) {
                        options.posting(files[0], options);
                    }
                    datafile.value = null;
                });
                datafile.click();
            }
            this.Delete = function (path, success, error) {
                APIInvokerAsync('/dg/resources/del', {
                    'path': path ? path : '/'
                }, success, error);
            }
            this.Preview = function (dir, success, error) {
                APIInvokerAsync('/dg/resources/dir', {
                    'dir': dir ? dir : '/'
                }, success, error);
            }
            this.CreateDirectory = function (dir) {
                APIInvokerAsync('/dg/resources/mkdir', {
                    'dir': dir ? dir : '/'
                }, success, error);
            }
        }),
    });
    var _internal_ptr = new (function Internal() { });
    Object.defineProperty(_self_ptr, "internal", {
        get: function () {
            return _internal_ptr;
        }
    });
    !(function () { // 设计器设定
        'use strict'

        var _nextproctable = { // hooks
            GetIncludeFiles: HtmlView.GetIncludeFiles,
            ResumeLayout: HtmlView.ResumeLayout,
            GetScreenSize: HtmlView.GetScreenSize,
            New: HtmlView.New,
            NewControl: HtmlControl.New,
        };
        var _includefiles = new Object();
        (function () {
            HtmlView.DesignMode = true;
        })();
        _internal_ptr.AddIncludeFile = function (path) {
            'use strict'

            if (typeof path !== 'string') {
                return false;
            }
            if (!_includefiles.hasOwnProperty(path)) {
                _includefiles[path] = 1;
            } else {
                _includefiles[path]++;
            }
            return true;
        }
        HtmlView.New = function (canvas, inheritances) {
            'use strict'

            var view = _nextproctable.New(canvas, inheritances);
            var super_dispose = view.Dispose;
            view.Dispose = function () {
                'use strict'

                var exception = null;
                try {
                    var key = '#__internal_external_designer_dispose_' + Math.random();
                    return Binding.Callsite(view, key, super_dispose);
                } catch (e) {
                    exception = e;
                }
                _includefiles = new Object();
                if (exception !== null) {
                    throw exception;
                }
            }
            return view;
        }
        HtmlView.GetIncludeFiles = function (View, layout) {
            'use strict'

            if (!__instanceof(View, HtmlView) || !__instanceof(layout, HtmlView.constructor.LayoutInfo)) {
                Throwable.InvalidOperationException();
            }
            var includes = [];
            var traverseoo = function (o, r, k) {
                'use strict'

                if (Object.IsNullOrUndefined(o) || typeof o !== 'object') {
                    return undefined;
                }
                var keys = Object.getOwnPropertyNames(o);
                for (var i = 0; i < keys.length; i++) {
                    var n = keys[i];
                    var v = o[n];
                    if (typeof v === 'object') {
                        traverseoo(v, r, k);
                        continue;
                    }
                    for (var q in k) {
                        if (q === v) {
                            if (!r.hasOwnProperty(q)) {
                                r[q] = 1;
                            } else {
                                r[q]++;
                            }
                        }
                    }
                }
                return undefined;
            }
            var r = {};
            traverseoo(layout, r, _includefiles);
            for (var key in r) {
                includes.push(key);
            }
            return includes;
        }
        HtmlView.ResumeLayout = function (View, layout) {
            'use strict'

            var result = _nextproctable.ResumeLayout(View, layout);
            if (!__instanceof(layout.Includes, Array)) {
                _includefiles = new Object();
            } else {
                var includes = layout.Includes;
                {
                    _includefiles = new Object();
                    for (var i = 0; i < includes.length; i++) {
                        var file = includes[i];
                        if (typeof file !== 'string') {
                            continue;
                        }
                        _includefiles[file] = 1;
                    }
                }
            }
            return result;
        }
        HtmlView.GetScreenSize = function (View) {
            'use strict'

            if (!View || View === window.View) {
                var sz = {
                    width: Number($('input[name=width]').val()),
                    height: Number($('input[name=height]').val()),
                };
                if (isNaN(sz.width) || sz.width < 0) {
                    sz.width = 0;
                }
                if (isNaN(sz.height) || sz.height < 0) {
                    sz.height = 0;
                }
                return new Size(sz.width, sz.height);
            }
            return _nextproctable.GetScreenSize();
        }
            HtmlControl.New = function (options, inheritances) {
            'use strict'

            var components = _nextproctable.NewControl(options, inheritances);
                if (components) {
                    if (components.GetType().FullName == 'TabControlItem' || components.Name()=='pagRollCloth') {
                        return components;
                    }
                    drag.LoadDelect(components);
                    drag.LoadChangeSize(components);
                }
            return components;
        }
    })();
    return new (function HtmlDesigner() {
        'use strict'
        var self = this;
        var keys = Object.getOwnPropertyNames(_self_ptr);
        for (var i = 0; i < keys.length; i++) {
            +(function (key) {
                Object.defineProperty(self, key, {
                    get: function () {
                        return _self_ptr[   key];
                    }
                });
            })(keys[i]);
        }
    });
})();