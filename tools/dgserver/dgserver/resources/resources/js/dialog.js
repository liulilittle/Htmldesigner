var dialog = {
    classes: null,        //模态框添加类名
    name: 'Model',      //模态框名字
    width: 800,         //模态框的宽度
    type: 'collection',  // 允许拖动的容器
    control: null,      // 当前显示属性的视图
    container: null,
    content: null,      //模态框body
    ListContent: null,
    select: null,       //数据源选择select
    data: null,         //数据源
    btn: ['关闭', '确定'],
    collection: null,       //集合

    //初始化control, views, type
    init: function (obj) {
        $.extend(dialog, obj);

        dialog.LoadHtml(dialog.control);
        switch (dialog.type) {
            case 'Control':
                dialog.LoadControl();
                break;
            case 'Data':
                dialog.LoadDataSource();
                break;
            case 'Items':
                dialog.LoadControl();
                break;
            case 'ItemStyle':
                dialog.LoadControl();
                break;
        }
        dialog.container.modal();
        var drop = $(".modal-backdrop");
        if (drop.length > 1) {
            for (var i = 1; i < drop.length; i++) {
                drop[i].parentNode.removeChild(drop[i]);
            }
        }
        return dialog.container;
    },
    LoadHtml: function (control) {
        dialog.name = Object.GetPropertyValue(control, "Name");
        var container = dialog.container = $([
            '<div class="modal fade table-collection ' + dialog.classes + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">',
            '<div class="modal-dialog" style="width: ' + dialog.width + 'px">',
            '<div class="modal-content">',
            '<div class="modal-header">',
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>',
            '<h4 class="modal-title" id="myModalLabel">',
            dialog.name,
            '</h4>',
            '</div>',
            '<div class="modal-body flex-box">',
            //'<div class="ParentCollection"></div>',
            //'<div class="CollectionAttr toolbar">',
            //    '<table class="attr-table" border="1"></table>',
            //'</div>',
            '</div>',
            '<div class="modal-footer">',
            '<button class="btn btn-default btn-add btn-primary">添加</button>',
            '<button class="btn btn-default btn-remove btn-m">删除</button>',
            '<button class="btn btn-default btn-bind btn-m">数据绑定</button>',
            '<button type="button" class="btn btn-default btn-close btn-m" data-dismiss="modal">关闭</button>',
            '<button type="button" class="btn btn-default btn-commit btn-m" style="background:#00a5a5;color: #fff;margin-left: 30px;">绑定</button>',
            '</div>',
            '</div>',
            '</div>',
            '</div>',
        ].join(''));
        _footer = container.find(".modal-footer");
        _cansel = container.find('.btn-close').hide();
        _commit = dialog._commit = container.find('.btn-commit').hide();
        _add = container.find(".btn-add").hide();
        _remove = container.find(".btn-remove").hide();
        _bind = container.find('.btn-bind').hide();
        _type = '';
        _content = dialog.content = container.find('.modal-body');
        container.on('hide.bs.modal', function () {
            container.remove();
        });

        if (dialog.type == "Items") {
            _add.show();
            _remove.show();
            _bind.show();
            _footer.css('text-align', "center");
        }
        //if (control.GetType().FullName == 'TabControl') {
        //    _type = 'TabControl';
        //}
        _type = dialog.control.GetType().FullName;
        if (dialog.btn[0]) {
            _cansel.show();
            _cansel.html(dialog.btn[0]);
            _cansel.on("click", function () {
                if (dialog.callback1) {
                    dialog.callback1();
                }
            })
        }

        if (dialog.btn[1]) {
            _commit.show();
            _commit.html(dialog.btn[1]);
            _commit.on("click", function () {
                if (dialog.callback2) {
                    dialog.callback2(dialog);
                }
            })
        }

        if (_type == 'MediaBox') {
            _add.UpLoad({
                url: '/dg/resources/dir',
                server: true,
                method: 'POST',
                Id: _type + dialog.name,
                type: null,
                SureFile: function (path, name) {
                    console.log(path, name);
                    dialog.AddMaterial(path, name);
                }
            })
        } else {
            _add.click(function () {
                if (_type == 'TabControl') {
                    dialog.AddTabControlItemList();
                } else {
                    dialog.AddList();
                }
            })
        }
        
        _remove.click(function () {
            // var active = _content.find("p.active");//_content这里得元素标签内容和实际得不一致 data(item) 是空得 具体原因未知
            var active = $('p.active');
            var item = active.data("item");
            dialog.control.Items.Remove(item);
            active.remove();
        })

        _bind.click(function () {
            dialog.init({
                width: 700,
                collection: dialog.data,
                type: 'Data',
                show: false,
                btn: ['关闭', '绑定'],
                callback2: function () {
                    var collection = dialog.collection;
                    var name = collection.constructor.name;
                    var field = dialog.dataBox.find(".active").html();
                    var data = dialog.select.val();

                    if (data && field) {
                        collection.Synchronizer(data + "." + field);
                        _commit.attr("disabled", true);
                        var html = $('<p>' + name + ' => ' + field + '<span>(' + data + ')</span> <a style="margin: 0 15px;">解绑</a></p>');
                        (function (control, name) {
                            html.find("a").click(function () {
                                collection.Synchronizer(null);
                                $(this).parents('p').remove();
                                _commit.removeAttr("disabled");
                            })
                        })(control, name)
                        dialog.bindBox.append(html);
                    }
                    dialog.data = Object.GetPropertyValue(dialog.control, 'Items');
                    var content = dialog.ListContent;
                    var table = dialog.table;
                    dialog.LoadList(content, table);
                }
            })
        })

        $("body").append(container);
    },
    LoadControl: function () {
        var html = $([
            '<div class="table-list"></div>',
            '<div class="table-attr toolbar">',
            '<table class="attr-table" border="1">',
            '<thead><tr><th>属性</th><th>值</th></tr></thead >',
            '<tbody></tbody>',
            '</table>',
            '</div>',
        ].join(''));

        var table = dialog.table = html.find("tbody");
        var content = dialog.ListContent = $(html[0]);
        var _add = $(html[0]).find(".btn-add");
        var _remove = $(html[0]).find(".btn-remove");
        if (dialog.type == "Control") {
            _add.hide();
            _remove.hide();
        }
        dialog.content.append(html);
        if (dialog.type == 'ItemStyle') {
            dialog.LoadItems(content, table);
        } else {
            dialog.LoadList(content, table);
        }
    },
    LoadList: function (content, table) {
        var controls = dialog.data.GetAll();
        if (controls.length <= 0) {
            return;
        }
        //var content = $(content);
        content.empty();
        for (var i = 0; i < controls.length; i++) {
            var html = $("<p>" + controls[i].Name() + "</p>");
            html.data("item", controls[i]);
            if (i == 0) {
                html.addClass("active");
            }
            (function (control) {
                html.click(function () {
                    content.find("p").removeClass("active");
                    $(this).addClass("active");
                    drag.show(control, table);
                    drag.setColor(control);
                })
            })(controls[i])
            content.append(html)
        }
        drag.show(controls[0], table);
        drag.setColor(controls[0]);
    },
    LoadItems: function (content, table) {
        content.empty();
        var items = dialog.data.GetType();

        if (items.Properties.length <= 0) {
            return;
        }

        for (var i = 0; i < items.Properties.length; i++) {
            var html = $("<p>" + items.Properties[i].Name + "</p>");
            if (i == 0) {
                html.addClass('active');
            }

            (function (name) {
                html.click(function () {
                    content.find("p").removeClass("active");
                    $(this).addClass("active");
                    var control = dialog.data[name];
                    drag.show(control, table);
                    drag.setColor(control);
                })
            })(items.Properties[i].Name)

            content.append(html);
        }
        var n = items.Properties[0].Name;
        drag.show(dialog.data[n], table);
        drag.setColor(dialog.data[n]);
    },
    LoadDataSource: function (control) {
        var data = DataSources;
        control = dialog.control;
        var html = $([
            '<div class="lists"><h4>控件属性</h4><div class="control-list"></div></div>',
            '<div class="lists"><h4>数据列表<select class="choose-control"></select></h4><div class="table-data"></div></div>',
            '<div class="lists adapt"><h4>绑定关系</h4><div class="bind-list"></div></div>',
        ].join(''));

        var controlHtml = dialog.controlBox = $(html[0]).find('.control-list');
        var dataHtml = dialog.dataBox = $(html[1]).find(".table-data");
        var selectHtml = dialog.select = $(html[1]).find("select");
        var BindHtml = dialog.bindBox = $(html[2]).find(".bind-list");

        var options = control.GetType().Properties;

        controlHtml.after('<p class="modal_intr"></p>');
        for (var i = 0; i < options.length; i++) {
            var property = options[i];
            var types = HtmlDesigner.Type.GetAllTypes2(property.PropertyType);

            if (!property || !property.Browsable || !property.Writeable || !property.DataBind) {
                continue;
            }

            if (property.Name == 'Name') {
                continue;
            }

            var PHtml = $("<p>" + property.Name + "</p>");

            (function (property) {
                PHtml.click(function () {
                    controlHtml.find("p").removeClass("active");
                    $(this).addClass("active");
                    $('.modal_intr').html(property.Name + '：' + property.Description);
                })
            })(property)
            controlHtml.append(PHtml);
        }
        dialog.SelectData(selectHtml, dataHtml);
        dialog.LoadDataList(data[0], dataHtml);

        if (dialog.collection) {
            $(html[0]).hide();
            var list = dialog.collection.Synchronizer()
        } else {
            var list = dialog.data.GetAll();
        }
        dialog.LoadBindList(BindHtml, list);
        dialog.content.append(html);
    },
    LoadTemp: function (content) { },
    SelectData: function (html, dataHtml) {
        var data = DataSources;
        for (var i = 0; i < data.length; i++) {
            var DHtml = $("<option value =" + data[i].name + ">" + data[i].name + "</option>");

            if (i == 0) {
                DHtml.attr("select", true);
            }

            html.append(DHtml);
        }
        html.change(function () {
            var val = $(this).val();
            dialog.LoadDataList(data[i]);
        })
    },
    LoadDataList: function (data, html) {
        if (!data) {
            return;
        }
        data = eval(data.name);
        var options = data.GetType().Properties;
        var DHtml = '';
        for (var i = 0; i < options.length; i++) {
            if (dialog.collection) {
                if (options[i].PropertyType == 'Array') {
                    DHtml = $("<p>" + options[i].Name + "</p>").data('intr', options[i]);
                }
            } else {
                DHtml = $("<p>" + options[i].Name + "</p>").data('intr', options[i]);
            }
            if (DHtml) {
                (function () {
                    DHtml.click(function (e) {
                        var intr = $(this).data('intr');
                        html.find("p").removeClass("active");
                        $(this).addClass("active");
                        $('.modal_intr').html(intr.Name + '：' + intr.Description);
                        return false;
                    })
                })()
                html.append(DHtml);
            }
        }
    },
    LoadBindList: function (html, list) {
        if (!list) {
            list = [];
        }
        if (list.length <= 0) {
            return;
        }

        if (!dialog.collection) {
            for (var i = 0; i < list.length; i++) {
                var name, filed;

                var BHtml = $(['<p>' + list[i].PropertyName + ' => ' + list[i].DataMember + '<span>(' + list[i].DataSource + ')</span> <a style="margin: 0 15px;">解绑</a></p>'].join(''));
                (function (html, name, source, member) {
                    html.find('a').click(function () {
                        dialog.control.DataBindings.Remove(name, source, member);
                        html.remove();
                    })
                })(BHtml, list[i].PropertyName, list[i].DataSource, list[i].DataMember)
                html.append(BHtml);
            }
        } else {
            if (!list.Collection) { return }
            var BHtml = $(['<p>' + list.Collection.constructor.name + ' => ' + list.DataSource + ' <a style="margin: 0 15px;">解绑</a></p>'].join(''));
            dialog._commit.attr("disabled", true);
            (function (html, collection) {
                html.find('a').click(function () {
                    collection.Synchronizer(null);
                    $(this).parents('p').remove();
                    dialog._commit.removeAttr("disabled");
                })
            })(BHtml, list.Collection)
            html.append(BHtml);
        }

    },
    AddList: function (list) {
        if (list == undefined) {
            List = new ListBoxItem();
        } else {
            List = list;
        }
        dialog.control.Items.Add(List);

        var _content = dialog.ListContent;
        List.Name(Type.GetName(List));
        var html = $("<p>" + List.Name() + "</p>");
        html.data("item", List);

        html.click(function () {
            _content.find("p").removeClass("active");
            $(this).addClass("active");
            drag.show(List, _content.next().find("tbody"));
        })
        _content.append(html);
    },
    AddTabControlItemList: function (list) {
        if (list == undefined) {
            List = TabControlItem.New();
        } else {
            List = list;
        }
        dialog.control.Items.Add(List);

        var _content = dialog.ListContent;
        //List.Name(Type.GetName(List));
        var html = $("<p>" + List.Name() + "</p>");
        html.data("item", List);

        html.click(function () {
            _content.find("p").removeClass("active");
            $(this).addClass("active");
            drag.show(List, _content.next().find("tbody"));
        })
        _content.append(html);
    },
    AddMaterial: function (file, name) {

        if (file == undefined) {
            return;
        }

        List = new MediaBoxItem(file);
        var d = new Date();
        var timestamp = Date.parse(new Date()) + 1000 * 60 * 10;
        var start = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ':' + d.getMinutes();
        d = new Date(timestamp); 
        var end = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ':' + (d.getMinutes() + 10);
        List.StartTime(start);
        List.EndTime(end);
        dialog.control.Items.Add(List);

        var _content = dialog.ListContent;
        List.Name(name);
        var html = $("<p>" + List.Name() + "</p>");
        html.data("item", List);

        html.click(function () {
            _content.find("p").removeClass("active");
            $(this).addClass("active");
            var List = html.data("item");
            drag.show(List, _content.next().find("tbody"));
        })
        _content.append(html);
    }
};


        