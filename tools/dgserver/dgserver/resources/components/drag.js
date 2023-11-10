var ScrollStyle = {
    Hidden: 0,
    Auto: 1,
    ScrollX: 2,
    ScrollY: 3,
    Scroll: 4,
    AutoX: 5,
    AutoY: 6
};
var WhiteSpaceStyle = {
    Normal: 0,
    Nowrap: 1
};
var ScrollDirStyle = {
    None: 0, // 不滚动。
    Top: 1,// 上滚动。
    Down: 2, // 下滚动。
    Left: 3, // 左滚动。
    Right: 4,  // 右滚动。
};
var RollingEffect = {
    Show: 0,//显示消失
    FadeIn: 1,//淡入
    Slide: 2//滑动
};
var ImageLayout = {
    None: 0,
    Zoom: 1,
    Stretch: 2,
    Center: 3,
}

var BorderStyle = {
    None: 'none',
    Solid: 'solid',
    Dotted: 'dotted',
    Dashed: 'dashed'
}

var TextAlign = {
    Left: 'left',
    Center: 'center',
    Right: 'right',
    Justify: 'justify',
    Inherit: 'inherit'
}

var drag = {
    id_name: null,  // 允许拖动的容器
    class_name: null,  // 允许拖动元素的父元素
    permit_drag: false,	// 是否允许移动标识

    old_elm: null,     // 拖拽原节点
    tmp_elm: null,     // 跟随光标移动的临时节点
    new_elm: null,     // 拖拽完成后添加的新节点
    start_offset: null,
    parent_dom: null,

    control: null,     // 拖拽的DOM节点
    components: null,  // 拖动的控件
    x1: 0,             //mousedown的时候鼠标的位置
    y1: 0,             //mousedown的时候鼠标的位置
    x2: 0,             //mouseup的时候鼠标的位置
    y2: 0,             //mouseup的时候鼠标的位置
    left: 0,            //鼠标按下控件的位置
    top: 0,             //鼠标按下控件的位置

    //初始化
    init: function (className, idName) {
        drag.class_name = className;
        drag.id_name = idName;
        var control = null;
        //监听鼠标按下事件，动态绑定要拖拽的节点（因为节点可能是动态添加的）
        if (!this.init.e) {
            this.init.e = function (event, con) {
                if (event.button == 2)
                    return;
                if (event.button == 2) {
                    return;
                }

                //当在允许拖拽的节点上监听到点击事件，将标识设置为可以拖拽
                var recentNew = false;
                var showing = true;
                if (event === 'showHtmlView') {
                    drag.old_elm = View.DOM();
                    drag.control = View;
                } else if (event == 'HtmlControl' || event == 'ListBox') {
                    drag.old_elm = con.DOM();
                    drag.control = con;
                } else {
                    if ($(this).hasClass("ui-draggable")) {
                        drag.components = $(this).data("components");
                        drag.control = HtmlDesigner.Control.New(drag.components);
                        //drag.LoadDelect(drag.control);
                        //drag.LoadChangeSize(drag.control);
                        //获取到拖拽的原节点对象
                        drag.old_elm = drag.control.DOM();
                        recentNew = true;
                        drag.permit_drag = true;
                    }
                    else if ($(event.currentTarget).hasClass('HtmlControl')) {
                        if ($(drag.old_elm).get(0) === $(event.currentTarget).get(0)) {
                            showing = false;
                        }
                        drag.permit_drag = true;
                    }
                    if (!recentNew) {
                        //获取到拖拽的原节点对象
                        drag.old_elm = $(event.currentTarget);
                        if ($(drag.old_elm).get(0) === $(View.DOM()).get(0)) {
                            drag.control = View;
                        } else {
                            drag.control = HtmlControl.GetControlAtDOM(drag.old_elm);
                        }
                    }
                }
                var control = drag.control;
                if (control) {
                    var typeinfo = control.GetType();
                    var container = $('.tool-table tbody');
                    if (showing) {
                        drag.show(control, container, 0);
                    }
                    drag.setColor(control);
                    //执行开始拖拽的操作
                    drag.mousedown(event, recentNew);
                    drag.loadAllControls();
                }

                //监听鼠标移动
                $(document).mousemove(function (event) {
                    //判断拖拽标识是否为允许，否则不进行操作
                    if (!drag.permit_drag)
                        return false;
                    //执行移动的操作
                    drag.mousemove(event);
                    return false;
                });

                //监听鼠标放开
                $(document).mouseup(function (event) {
                    //判断拖拽标识是否为允许，否则不进行操作
                    if (!drag.permit_drag)
                        return false;
                    //拖拽结束后恢复标识到初始状态
                    drag.permit_drag = false;
                    //执行拖拽结束后的操作
                    drag.mouseup(event, control);
                    if (drag.control.GetType().FullName == 'TabControl')
                        return;
                    var controlList = HtmlDesigner.Control.GetAllControls();
                    for (var i = 0; i < controlList.length; i++) {
                        var con = controlList[i];
                        var conName = con.GetType().FullName;
                        if (conName != "Fragment") {
                            var oldCon = drag.control;
                            if (oldCon.Left() > con.Left() && oldCon.Left() < con.Width() + con.Left() &&
                                oldCon.Top() > con.Top() && oldCon.Top() < con.Height() + con.Top()) {
                                if (con.CurrentPpage) {
                                    var cup = con.Controls.GetAll()[0].Controls.GetAll()[con.Page()];
                                    if (cup == oldCon.Parent())
                                        return;
                                    oldCon.Parent(cup);
                                    oldCon.Top(0);
                                    oldCon.Left(0);
                                } else {
                                    oldCon.Parent(con);
                                    oldCon.Top(0);
                                    oldCon.Left(0);
                                }
                                
                            }
                        }
                    }
                    //setTimeout(function () {
                    //    var control = HtmlControl.GetContrrolAtDOM($(event.target).parents('.HtmlControl'));
                    //    Combinatorialkey.SelectControl = control;
                    //    if (!ViewsOperation.LastStepIsEqual(control)) {
                    //        ViewsOperation.Add(control);
                    //    }
                    //}, 500);
                    return false;
                });
                return false;
            };
        }
        var evt = drag.init.e;
        $(('.' + drag.class_name)).on('mousedown', evt).on('mousedown', '.HtmlControl', evt);
    },
    //按下鼠标 执行的操作
    mousedown: function (event) {
        'use strict'

        var e = event || window.event;

        drag.x1 = e.pageX;
        drag.y1 = e.pageY;
        drag.top = drag.control.Top ? drag.control.Top() : 0;
        drag.left = drag.control.Left ? drag.control.Left() : 0;

        if (View === drag.control) {
            return false;
        }
        var position = $(drag.old_elm).offset();
        var startoffest = {
            left: e.pageX - position.left,
            top: e.pageY - position.top,
        };
        var width = $(drag.old_elm).outerWidth();
        var height = $(drag.old_elm).outerHeight();
        if (arguments[1]) {
            startoffest.left = width / 2;
            startoffest.top = height / 2;
        } else {
            if (startoffest.left < 0) {
                startoffest.left = 0;
            }
            if (startoffest.top < 0) {
                startoffest.top = 0;
            }
            if (startoffest.left > width) {
                startoffest.left = width;
            }   
            if (startoffest.top > height) {
                startoffest.top = height;
            }
        }
        drag.start_offset = startoffest;
        drag.parent_dom = null;
        var currentcontrol = HtmlControl.GetControlAtDOM($(drag.old_elm));
        if (!currentcontrol) {
            return false;
        }
        var parentcontrol = currentcontrol.Parent();
        if (!parentcontrol) {
            return false;
        }
        drag.parent_dom = parentcontrol.DOM();
    },
    //移动鼠标 执行的操作
    mousemove: function (event) {
        'use strict'

        var e = event || window.event;
        if (!drag.parent_dom) {
            return false;
        }
        var canvas = $(drag.parent_dom);
        var offset = drag.start_offset;
        var position = canvas.offset();
        position = {
            left: e.pageX - position.left,
            top: e.pageY - position.top,
        }
        position.left -= offset.left;
        position.top -= offset.top;
        position.left = position.left <= 0 ? 0 : position.left;
        position.top = position.top <= 0 ? 0 : position.top;

        var width = $(drag.old_elm).outerWidth();
        var height = $(drag.old_elm).outerHeight();
        var size = {
            width: canvas.width(),
            height: canvas.height(),
        };
        position.left = (position.left + width) > size.width ? size.width - width : position.left;
        position.top = (position.top + height) > size.height ? size.height - height : position.top;
        position.top = position.top < 0 ? 0 : position.top;
        position.left = position.left < 0 ? 0 : position.left;

        if (!__instanceof(drag.control, HtmlControl)) {
            $(drag.old_elm).css(position);
        } else {
            var control = drag.control;
            Object.SetPropertyValue(control, 'Top', position.top);
            Object.SetPropertyValue(control, 'Left', position.left);
        }
        drag.setMoving(position);
    },
    //放开鼠标 执行的操作
    mouseup: function (event) {

        var e = event || window.event;

        drag.x2 = e.pageX;
        drag.y2 = e.pageY;
        d = Math.sqrt((drag.x1 - drag.x2) * (drag.x1 - drag.x2) + (drag.y1 - drag.y2) * (drag.y1 - drag.y2));

        if (d < 7) {
            Object.SetPropertyValue(drag.control, 'Top', drag.top);
            Object.SetPropertyValue(drag.control, 'Left', drag.left);
        }
        drag.start_offset = null;
        drag.parent_dom = null;
    },
    //展示属性栏
    show: function (control, container, type) {
        container.empty();
        $('.control_modal').remove();
        if (type == 0 || type == 1) {
            var table = $('[class^=table_]');
            var lis = $('.right-title li');
            table.hide();
            $(".table_" + type).show();
            lis.removeClass('active');
            $("li[data-type=" + type + "]").addClass("active");
        }

        if (!container || !control) {
            return;
        }

        if (!control.GetType() && !control.GetType().Properties) {
            return;
        }

        var options = control.GetType().Properties;

        for (var i = 0; i < options.length; i++) {
            var property = options[i];
            var types = HtmlDesigner.Type.GetAllTypes2(property.PropertyType);

            if (!property || !property.Browsable) {
                continue;
            }

            var html = $('<tr>\
                    <td class="attr-name"><p>'+ property.Name + '</p></td>\
                    <td class="attr-val"></td>\
                </tr>');
            if (type == 1) {
                childHtml = $('<div>' + property.PropertyType + '</div>');
            } else {
                childHtml = drag.LoadAttr(control, property);
            }
            html.find(".attr-val").append(childHtml);

            !(function (data, types) {
                html.click(function () {
                    $('tr').removeClass("active");
                    $(this).addClass('active');
                    $('.introduce').html(data.Name + "：<br/>" + data.Description);
                });
            })(property, types);
            container.append(html);
        }
    },
    LoadAttr: function (control, property) {
        var childHtml = '';
        var types = HtmlDesigner.Type.GetAllTypes2(property.PropertyType);

        switch (property.PropertyType) {
            case "boolean":
                childHtml = drag.setSelect(control, property);
                break;
            default:
                if (types['select']) {
                    childHtml = drag.LoadStyle(control, property);
                } else if (types["HtmlView"]) {
                    childHtml = drag.setParent(control, property);
                } else {
                    childHtml = drag.setInput(control, property);
                };
                break;
        }

        if (childHtml && !property.Writeable) {
            childHtml.attr('readonly', 'readonly');
        }

        return childHtml;
    },
    //获取属性值
    getAttrVal: function (control, option) {
        var data = Object.GetPropertyValue(control, option.Name);
        var res = null;
        var types = HtmlDesigner.Type.GetAllTypes2(option.PropertyType);
        if (types["Rectangle"]) {
            res = data.Left + ',' + data.Top + ',' + data.Width + ',' + data.Height;
        } else {
            res = data;
        }
        return res;
    },
    controlNameEditChanged: function (control, target) {
        var getattr = Object.GetPropertyValue;
        var dom = $(target).parents('.modal-body.flex-box').find('.table-list p[class=active]');
        var previous = dom.html();
        var current = getattr(control, 'Name');
        dom.html(current);

        var ee = $(target).parents('.table-collection');
        var parent = ee.data('modal-owner');
        if (parent) {
            var parentname = getattr(parent, 'Name');
            $('.choose-control').children('option').each(function () {
                var e = $(this);
                if (e.html() == previous) {
                    e.html(current);
                }
                else if (e.is(':selected') && e.html() == parentname) {
                    e = $('.table_0 .tool-table'),
                        e.find('input[name=Controls]');
                    e.val(parent.Controls);
                }
            });
            var e = $('.modal-content').find(".modal-title:contains('{0}')".replace('{0}',
                ee.data('modal-owner-parent-name')));
            e.parents('.modal-content').find('tr td input[name=Controls]').val(parent.Controls);
        }
    },
    //input输入框
    setInput: function (control, option) {
        'use strict'

        var name = option.Name;
        var val = drag.getAttrVal(control, option);
        var types = HtmlDesigner.Type.GetAllTypes2(option.PropertyType);
        var html = $('<input type="text" name="' + option.Name + '" value="" />');

        if (types['Image']) {
            html = drag.setUpLoad(control, name, 'Image');
        } else if (types['Video']) {
            html = drag.setUpLoad(control, name, 'Video');
        } else if (types['Audio']) {
            html = drag.setUpLoad(control, name, 'Audio');
        } else if (option.PropertyType === 'number') {
            html.attr('type', 'number');
        }

        if (types['DateTime']) {
            html.datetimepicker({
                autoclose: true,
                language: 'zh-CN',
                bootcssVer: 3,
                format: 'yyyy-mm-dd hh:ii'
            });
        }

        (function (types, control, option, val) {
            html = $(html).attr('value', val).html(val).change(function (e) {
                var name = this.name;
                if (name.indexOf("Color") < 0) {
                    val = $(this).val();
                    if (option.PropertyType == 'number') {
                        val = parseInt(val);
                    }
                    drag.setValue(control, name, val);
                    if ((__instanceof(control, HtmlControl) ||
                        __instanceof(control, HtmlView)) && name === 'Name') {
                        drag.controlNameEditChanged(control, this);
                    }
                    if (!ViewsOperation.LastStepIsEqual(control)) {
                        ViewsOperation.Add(control);
                    }
                }
            }).bind('click', function () {
                if (types['HtmlView.ControlCollection']) {
                    drag.setCollection(control, val, 'Control');
                }
                if (types['BindingsCollection']) {
                    drag.setCollection(control, val, 'Data');
                }
                if (types['ItemsControlCollection']) {
                    drag.setCollection(control, val, 'Items');
                }
                if (types['ItemsObject']) {
                    drag.setCollection(control, val, 'ItemStyle');
                }
                if (types['HtmlViewTemplate']) {
                    $('#TemplateModal').modal(); 
                }
            });
        })(types, control, option, val);
        return html;
    },
    //加载集合
    setCollection: function (control, val, type) {
        if (val.Count <= 0 && type == 'Control') {
            return;
        }
        var obj = {
            width: 700,
            control: control,
            data: val,
            type: type,
            btn: ['关闭'],
        };
        if (type == 'Data') {
            obj.width = 800;
            obj.btn = ['关闭', '绑定'];
            obj.collection = null,
                obj.callback2 = function (obj) {
                    var control = dialog.control;
                    var name = dialog.controlBox.find(".active").html();
                    var field = dialog.dataBox.find(".active").html();
                    var data = dialog.select.val();

                    if (name && field) {
                        control.DataBindings.Add(name, data, field);

                        var html = $('<p>' + name + ' => ' + field + '<span>(' + data + ')</span> <a style="margin: 0 15px;">解绑</a></p>');
                        (function (control, name) {
                            html.find("a").click(function () {
                                control.DataBindings.Remove(name);
                                $(this).parents('p').remove();
                            })
                        })(control, name)
                        dialog.bindBox.append(html);
                    }
                }
        }

        if (type == "Items") {
            obj.btn = [];
        }
        var modal = $(dialog.init(obj));
        if (control !== View) {
            modal.data('modal-owner-parent-name', Object.GetPropertyValue(Object.GetPropertyValue(control, 'Parent'), 'Name'));
        } else {
            modal.data('modal-owner-parent-name', null);
        }
        modal.data('modal-owner', control);
    },
    getModalByOwner: function (owner) {
        owner = HtmlControl.GetControlAtODP(owner);
        var element = null;
        $('.table-collection').each(function () {
            var current = $(this).data('modal-owner');
            if (current !== owner) {
                return false;
            } else {
                element = $(this);
                return true;
            }
        });
        return element;
    },
    setUpLoad: function (control, name,type) {
        var controlName = Object.GetPropertyValue(control, "Name");
        var html = $('<input type="text" name="' + name + '" readonly="readonly"/>');
        html.UpLoad({
            url: '/dg/resources/dir',
            server: true,
            method: 'POST',
            Id: name,
            type: type,
            SureFile: function (path) {
                html.val(path);
                console.log(path);
                drag.setValue(control, name, path);
            }
        });
        return html;
    },
    //select Boolean选择框
    setSelect: function (control, option) {
        var name = option.Name;
        var select = $('<select name="' + name + '"></select>');
        if (option.PropertyType == "boolean") {
            var dom = "<option value='true'>true</option><option value='false'>false</option>";
            select.append(dom);
            if (drag.getAttrVal(control, option)) {
                select.val('true');
            } else {
                select.val('false');
            }
        }
        select.change(function () {
            var val = $(this).val();
            if (val == "true") {
                val = true;
            } else {
                val = false;
            }
            drag.setValue(control, name, val);
        });
        return select;
    },
    //设置颜色选择器
    setColor: function (control, option) {
        var that = this;
        $(".sp-container").remove();
        var doms = $('[name*=Color]');
        for (var i = 0; i < doms.length; i++) {
            var color = doms[i].value;
            var name = doms[i].name;
            (function (control, name, color) {
                $(doms[i]).spectrum({
                    color: color,
                    callback: function (s) {
                        s = s.substr(1);
                        drag.setValue(control, name, s);
                    }
                });
            })(control, name, color);
        }
    },
    //选择父容器
    setParent: function (control, data) {
        var name = data.Name;
        var controls = HtmlDesigner.Control.GetAllControls();
        var select = $('<select name="' + name + '"><option value="-1">null</option></select>');
        controls.splice(0, 0, View);
        var __getattr = Object.GetPropertyValue;
        var __setattr = Object.SetPropertyValue;
        for (var index = 0; index < controls.length; index++) {
            control = controls[index];
            var current = drag.control;
            if (!control || control == current) {
                continue;
            }
            var selected = (control === (current.hasOwnProperty('Parent') ? __getattr(current, 'Parent') : undefined) ? 'selected="selected"' : '');
            var html = $('<option value="0" ' + selected + '></option>').val(index).html(__getattr(control, "Name"));
            select.append(html);
        }
        select.change(function () {
            var index = parseInt($(this).val());
            var owner = controls[index]
            var current = drag.control;
            if (!__instanceof(current, HtmlControl)) {
                return undefined;
            } else if (!(__instanceof(owner, HtmlControl) || __instanceof(owner, HtmlView))) {
                __setattr(current, 'Parent', null);
            } else if (__getattr(current, 'Parent') !== current) {
                __setattr(current, 'Left', 0);
                __setattr(current, 'Top', 0);
                __setattr(current, 'Parent', owner);
            }
        });
        return select;
    },
    LoadStyle: function (control, option) {
        var types = option.PropertyType.split(",");
        var list = eval(types[1]);
        var name = option.Name;
        var val = drag.getAttrVal(control, option);
        var select = $('<select name="' + name + '"></select>');

        for (var k in list) {
            if (typeof list[k] != 'function') {
                var html = $('<option value="' + list[k] + '">' + k + '</option>');
                select.append(html);
            }
        }

        select.val(val);
        select.change(function () {
            var dock = $(this).val();
            drag.setValue(control, name, dock)
        })
        return select;
    },
    showHtmlView: function () {
        drag.init.e('showHtmlView');
        drag.loadAllControls();
    },
    showContor: function (name, con) {
        drag.init.e(name, con);
        drag.loadAllControls();
    },
    //加载控件名
    loadAllControls: function () {
        var controls = HtmlDesigner.Control.GetAllControls();
        var select = $('.choose-control');
        select.empty();
        controls.splice(0, 0, View);
        for (var i = 0; i < controls.length; i++) {
            var control = controls[i];
            if (!control) {
                continue;
            }
            if (control === drag.control) {
                var html = '<option value="' + i + '" selected="selected">' + Object.GetPropertyValue(control, "Name"); + '</option>'
            } else {
                var html = '<option value="' + i + '">' + Object.GetPropertyValue(control, "Name"); + '</option>'
            }
            select.append(html)
        }
        select.change(function () {
            var index = parseInt($(this).val());
            var control = controls[index];
            if (!control) {
                return false;
            }
            if (typeof control.GetType === 'function') {
                if (drag.control === control) {
                    return false;
                }
                drag.control = control;
                if (!Object.GetPropertyValue(control, 'IsDisposed')) {
                    drag.old_elm = $(control.DOM());
                    var container = $('.tool-table tbody');
                    drag.show(control, container, 0);
                    drag.setColor(control);
                }
            }
        });
    },
    //移动过程中改变属性栏的left、top值
    setMoving: function (position) {
        $("[name=Left]").val(position.left);
        $("[name=Top]").val(position.top);
    },
    setValue: function (control, name, val) {
        Object.SetPropertyValue(control, name, val);
    },
    LoadDelect: function (control) {
        var name = Object.GetPropertyValue(control, 'Name');
        var dom =Object.GetPropertyValue(control, 'DOM');
        dom.append('<div class="suspend"><span>×</span></div>');
        dom.find('.suspend span').click(function (e) {
            ViewsOperation.Add(control);
            control.Dispose();
            drag.showHtmlView();
            e.stopPropagation();
        });
        dom.hover(function () {
            $(".suspend").hide();
            dom.find('.suspend').show();
        }, function () {
            dom.find('.suspend').hide();
        });
    },
    LoadChangeSize: function (control) {
        if (!__instanceof(control, HtmlControl)) {
            return undefined;
        }
        var name = Object.GetPropertyValue(control, 'Name');
        var dom = Object.GetPropertyValue(control, 'DOM');
        dom.append('<span class="bg_change_size">&nbsp;</span>');
        var sz = dom.find('.bg_change_size').first();
        sz.data('control', control);
        sz.css({ 'position': 'absolute', 'right': 0, 'bottom': 0, 'display': 'block', 'width': '6px', 'height': '6px', 'cursor': 'nw-resize' });
        sz.on('mousedown', function (e) {
            var container = $('.tool-table tbody')
            drag.control = control;
            drag.show(control, container, 0);
            drag.loadAllControls();
            var old_width = dom.width();
            var old_height = dom.height();
            var old_size_x = e.pageX;
            var old_size_y = e.pageY;
            var top = dom.offset().top - $(window).scrollTop();
            var left = dom.offset().left - $(window).scrollLeft();
            var w_width = $(window).width();
            var w_height = $(window).height();
            var c_width = dom.outerWidth() - dom.width();
            var c_height = dom.outerHeight() - dom.height();
            $(document).on('mousemove', function (e) {
                var control = HtmlControl.GetControlAtDOM(dom);
                if (!control) {
                    return undefined;
                }
                var new_width = e.pageX - old_size_x + old_width;
                var new_height = e.pageY - old_size_y + old_height;

                //control.AddEvent(control.EventSet.SizeChanged, function (a, b) {
                //    console.log(123)
                //})

                if (dom.outerHeight() + top >= w_height) {
                    new_height = w_height - top - c_height;
                }

                if (new_height <= 0) {
                    new_height = 0;
                }

                if (dom.outerWidth() + left >= w_width) {
                    new_width = w_width - left - c_width;
                }

                if (new_width <= 0) {
                    new_width = 0;
                }

                var setattr = Object.SetPropertyValue;
                setattr(control, 'Width', new_width);
                setattr(control, 'Height', new_height);
                if (control.RefreshSize) {
                    control.RefreshSize();
                }
                container.find("[name=Width]").val(new_width);
                container.find("[name=Height]").val(new_height);
                return false;
            });
            $(document).on('mouseup', function () {
                $(document).off('mousemove');
                $(document).off('mouseup');
            });
            return false;
        });
    }
};

var FontFamily = {
    '宋体': 'SimSun',
    '黑体': 'SimHei',
    '微软雅黑': 'Microsoft YaHei',
    '微软正黑体': 'Microsoft JhengHei',
    '楷体': 'KaiTi',
    '幼圆': 'YouYuan',
    '隶书': 'LiSu',
    '新宋体': 'NSimSun',
    '仿宋': 'FangSong',
    '华文黑体': 'STHeiti',
    '华为楷体': 'STKaiti',
    '华文宋体': 'STSong',
    '华文仿宋': 'STFangsong',
    '华文中宋': 'STZhongsong',
    '华文彩云': 'STCaiyun',
    '华文琥珀': 'STHupo',
    '华文新魏': 'STXinwei',
    '华文隶书': 'STLiti',
    '华文行楷': 'STXingkai',
    '方正舒体': 'FZShuTi',
    '方正姚体': 'FZYaoti'
};