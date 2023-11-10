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
    None: 0, // ��������
    Top: 1,// �Ϲ�����
    Down: 2, // �¹�����
    Left: 3, // �������
    Right: 4,  // �ҹ�����
};
var RollingEffect = {
    Show: 0,//��ʾ��ʧ
    FadeIn: 1,//����
    Slide: 2//����
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
    id_name: null,  // �����϶�������
    class_name: null,  // �����϶�Ԫ�صĸ�Ԫ��
    permit_drag: false,	// �Ƿ������ƶ���ʶ

    old_elm: null,     // ��קԭ�ڵ�
    tmp_elm: null,     // �������ƶ�����ʱ�ڵ�
    new_elm: null,     // ��ק��ɺ���ӵ��½ڵ�
    start_offset: null,
    parent_dom: null,

    control: null,     // ��ק��DOM�ڵ�
    components: null,  // �϶��Ŀؼ�
    x1: 0,             //mousedown��ʱ������λ��
    y1: 0,             //mousedown��ʱ������λ��
    x2: 0,             //mouseup��ʱ������λ��
    y2: 0,             //mouseup��ʱ������λ��
    left: 0,            //��갴�¿ؼ���λ��
    top: 0,             //��갴�¿ؼ���λ��

    //��ʼ��
    init: function (className, idName) {
        drag.class_name = className;
        drag.id_name = idName;
        var control = null;
        //������갴���¼�����̬��Ҫ��ק�Ľڵ㣨��Ϊ�ڵ�����Ƕ�̬��ӵģ�
        if (!this.init.e) {
            this.init.e = function (event, con) {
                if (event.button == 2)
                    return;
                if (event.button == 2) {
                    return;
                }

                //����������ק�Ľڵ��ϼ���������¼�������ʶ����Ϊ������ק
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
                        //��ȡ����ק��ԭ�ڵ����
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
                        //��ȡ����ק��ԭ�ڵ����
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
                    //ִ�п�ʼ��ק�Ĳ���
                    drag.mousedown(event, recentNew);
                    drag.loadAllControls();
                }

                //��������ƶ�
                $(document).mousemove(function (event) {
                    //�ж���ק��ʶ�Ƿ�Ϊ�������򲻽��в���
                    if (!drag.permit_drag)
                        return false;
                    //ִ���ƶ��Ĳ���
                    drag.mousemove(event);
                    return false;
                });

                //�������ſ�
                $(document).mouseup(function (event) {
                    //�ж���ק��ʶ�Ƿ�Ϊ�������򲻽��в���
                    if (!drag.permit_drag)
                        return false;
                    //��ק������ָ���ʶ����ʼ״̬
                    drag.permit_drag = false;
                    //ִ����ק������Ĳ���
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
                                    var index = con.CurrentPpage();
                                    var cup = con.Controls.GetAll()[0].Controls.GetAll()[index - 1];
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
    //������� ִ�еĲ���
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
    //�ƶ���� ִ�еĲ���
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
    //�ſ���� ִ�еĲ���
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
    //չʾ������
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
                    $('.introduce').html(data.Name + "��<br/>" + data.Description);
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
    //��ȡ����ֵ
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
    //input�����
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
    //���ؼ���
    setCollection: function (control, val, type) {
        if (val.Count <= 0 && type == 'Control') {
            return;
        }
        var obj = {
            width: 700,
            control: control,
            data: val,
            type: type,
            btn: ['�ر�'],
        };
        if (type == 'Data') {
            obj.width = 800;
            obj.btn = ['�ر�', '��'];
            obj.collection = null,
                obj.callback2 = function (obj) {
                    var control = dialog.control;
                    var name = dialog.controlBox.find(".active").html();
                    var field = dialog.dataBox.find(".active").html();
                    var data = dialog.select.val();

                    if (name && field) {
                        control.DataBindings.Add(name, data, field);

                        var html = $('<p>' + name + ' => ' + field + '<span>(' + data + ')</span> <a style="margin: 0 15px;">���</a></p>');
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
    //select Booleanѡ���
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
    //������ɫѡ����
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
    //ѡ������
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
    //���ؿؼ���
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
    //�ƶ������иı���������left��topֵ
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
        dom.append('<div class="suspend"><span>��</span></div>');
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
    '����': 'SimSun',
    '����': 'SimHei',
    '΢���ź�': 'Microsoft YaHei',
    '΢��������': 'Microsoft JhengHei',
    '����': 'KaiTi',
    '��Բ': 'YouYuan',
    '����': 'LiSu',
    '������': 'NSimSun',
    '����': 'FangSong',
    '���ĺ���': 'STHeiti',
    '��Ϊ����': 'STKaiti',
    '��������': 'STSong',
    '���ķ���': 'STFangsong',
    '��������': 'STZhongsong',
    '���Ĳ���': 'STCaiyun',
    '��������': 'STHupo',
    '������κ': 'STXinwei',
    '��������': 'STLiti',
    '�����п�': 'STXingkai',
    '��������': 'FZShuTi',
    '����Ҧ��': 'FZYaoti'
};