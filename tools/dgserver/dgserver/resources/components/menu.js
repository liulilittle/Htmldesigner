// JavaScript source code
var HtmlControlMenu = null;
$(document).ready(function () {
    HtmlControlMenu = new BootstrapMenu('div.HtmlControl', {       //.DynamicAdd是tbody下的tr的class名称
        fetchElementData: function ($rowElem) {     //fetchElementData获取元数据
            //获取表格数据

            return $rowElem;    //return的目的是给下面的onClick传递参数
        },
        actionsGroups: [  //给右键菜单的选项加一个分组，分割线
            /* ['setEditable', 'setUneditable' ],*/
        ],
        actions: {
            addDescription: {
                name: '<font size=3>左对齐</font>',
                iconClass: 'fa-edit',
                onClick: function (dom) {    //添加右击事件
                    toastr.info("左对齐");
                    //dom.find('span,p').css('text-align', 'left');
                    dom.data('.this').Left(0);
                },
                isEnabled: function (row) {
                    return row.isEditable;
                }
            },
            editDescription: {
                name: '<font size=3>右对齐</font>',
                iconClass: 'fa-edit',
                onClick: function (dom) {   //修改右击事件
                    toastr.info("右对齐");
                    //dom.find('span,p').css('text-align', 'right');
                    //dom.data('.this').Left(0);
                    var parWidth = dom.data('.this').Parent().DOM().width();
                    dom.data('.this').Left(parWidth - dom.data('.this').Width());
                },
                isEnabled: function (row) {
                    return row.isEditable;
                }
            },
            MiddleBtn: {
                name: '<font size=3>居中</font>',
                iconClass: 'fa-edit',
                onClick: function (dom) {  //
                    toastr.info("居中对齐");
                    //dom.find('span,p').css('text-align', 'center');
                    var parWidth = dom.data('.this').Parent().DOM().width();
                    dom.data('.this').Left(parWidth /2 - dom.data('.this').Width() /2);
                },
                isEnabled: function (row) {
                    return row.isEditable && row.isRemovable;
                }
            }
            //, shearBtn: {
            //    name: '<font size=3>剪切</font>',
            //    iconClass: 'fa-edit',
            //    onClick: function (dom) {  //
            //        toastr.info("1");
            //        var shearControl = HtmlControl.GetControlAtDOM(dom);
            //        //ShearPlate = $.extend(true,ShearPlate, shearControl);
            //        ShearPlate = shearControl;
            //        View.Controls.Remove(shearControl);
            //    },
            //    isEnabled: function (row) {
            //        return row.isEditable && row.isRemovable;
            //    }
            //}, adhesionBtn: {
            //    name: '<font size=3>粘连</font>',
            //    iconClass: '',
            //    onClick: function (dom) {  //


            //    },
            //    isEnabled: function (row) {
                   
            //        return row.isEditable && row.isRemovable;
            //    }
            //}
        }
    });
    var TemplateSetMenu = new BootstrapMenu('.Left-template-subset', {       //.DynamicAdd是tbody下的tr的class名称
        fetchElementData: function ($rowElem) {     //fetchElementData获取元数据
            //获取表格数据
            return $rowElem;    //return的目的是给下面的onClick传递参数
        },
        actionsGroups: [  //给右键菜单的选项加一个分组，分割线
            /* ['setEditable', 'setUneditable' ],*/
        ],
        actions: {
            addDescription: {
                name: '<font size=3>预览</font>',
                iconClass: 'fa-play-circle-o',
                onClick: function (dom) {    //添加右击事件
                   //window.location.replace("http://localhost:8080/dg/run?code=" + dom.attr('querycode') +"&WSServer=192.168.100.254:5354&DepartId=1175380156");
                    window.open("/dg/run?code=" + dom.attr('querycode') + "&WSServer=192.168.100.254:5354&DepartId=1175380156");
                },
                isEnabled: function (row) {
                    return row.isEditable;
                }
            },
            editDescription: {
                name: '<font size=3>编辑</font>',
                iconClass: 'fa-pencil-square',
                onClick: function (dom) {   //修改右击事件
                   var params = {
                        code: dom.attr('querycode')
                    };
                    xhr('/dg/views/GetCode', 'GET', params, function (res) {
                        if (res.Tag) {
                            var tag = JSON.parse(res.Tag);
                            LoadPreview(tag);
                        }
                        toastr.info(res.Message);
                    });
                },
                isEnabled: function (row) {
                    return row.isEditable;
                }
            },
            MiddleBtn: {
                name: '<font size=3>删除</font>',
                iconClass: 'fa-edit',
                onClick: function (dom) {  //viewid
                    var params = {
                        id: dom.attr('viewid')
                    };
                    var truthBeTold = window.confirm("确认删除该模板？");
                    if (truthBeTold) {
                        xhr('/dg/views/Delete', 'GET', params, function (res) {
                            if (res.Tag) {
                                var tag = JSON.parse(res.Tag);
                                LoadPreview(tag);
                            }
                            toastr.info(res.Message);
                            GetTempList();
                        });
                    }
                   
                },
                isEnabled: function (row) {
                    return row.isEditable && row.isRemovable;
                }
            }
        }
    });
});
