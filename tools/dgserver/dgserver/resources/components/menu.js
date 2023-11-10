// JavaScript source code
var HtmlControlMenu = null;
$(document).ready(function () {
    HtmlControlMenu = new BootstrapMenu('div.HtmlControl', {       //.DynamicAdd��tbody�µ�tr��class����
        fetchElementData: function ($rowElem) {     //fetchElementData��ȡԪ����
            //��ȡ�������

            return $rowElem;    //return��Ŀ���Ǹ������onClick���ݲ���
        },
        actionsGroups: [  //���Ҽ��˵���ѡ���һ�����飬�ָ���
            /* ['setEditable', 'setUneditable' ],*/
        ],
        actions: {
            addDescription: {
                name: '<font size=3>�����</font>',
                iconClass: 'fa-edit',
                onClick: function (dom) {    //����һ��¼�
                    toastr.info("�����");
                    //dom.find('span,p').css('text-align', 'left');
                    dom.data('.this').Left(0);
                },
                isEnabled: function (row) {
                    return row.isEditable;
                }
            },
            editDescription: {
                name: '<font size=3>�Ҷ���</font>',
                iconClass: 'fa-edit',
                onClick: function (dom) {   //�޸��һ��¼�
                    toastr.info("�Ҷ���");
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
                name: '<font size=3>����</font>',
                iconClass: 'fa-edit',
                onClick: function (dom) {  //
                    toastr.info("���ж���");
                    //dom.find('span,p').css('text-align', 'center');
                    var parWidth = dom.data('.this').Parent().DOM().width();
                    dom.data('.this').Left(parWidth /2 - dom.data('.this').Width() /2);
                },
                isEnabled: function (row) {
                    return row.isEditable && row.isRemovable;
                }
            }
            //, shearBtn: {
            //    name: '<font size=3>����</font>',
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
            //    name: '<font size=3>ճ��</font>',
            //    iconClass: '',
            //    onClick: function (dom) {  //


            //    },
            //    isEnabled: function (row) {
                   
            //        return row.isEditable && row.isRemovable;
            //    }
            //}
        }
    });
    var TemplateSetMenu = new BootstrapMenu('.Left-template-subset', {       //.DynamicAdd��tbody�µ�tr��class����
        fetchElementData: function ($rowElem) {     //fetchElementData��ȡԪ����
            //��ȡ�������
            return $rowElem;    //return��Ŀ���Ǹ������onClick���ݲ���
        },
        actionsGroups: [  //���Ҽ��˵���ѡ���һ�����飬�ָ���
            /* ['setEditable', 'setUneditable' ],*/
        ],
        actions: {
            addDescription: {
                name: '<font size=3>Ԥ��</font>',
                iconClass: 'fa-play-circle-o',
                onClick: function (dom) {    //����һ��¼�
                   //window.location.replace("http://localhost:8080/dg/run?code=" + dom.attr('querycode') +"&WSServer=192.168.100.254:5354&DepartId=1175380156");
                    window.open("/dg/run?code=" + dom.attr('querycode') + "&WSServer=192.168.100.254:5354&DepartId=1175380156");
                },
                isEnabled: function (row) {
                    return row.isEditable;
                }
            },
            editDescription: {
                name: '<font size=3>�༭</font>',
                iconClass: 'fa-pencil-square',
                onClick: function (dom) {   //�޸��һ��¼�
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
                name: '<font size=3>ɾ��</font>',
                iconClass: 'fa-edit',
                onClick: function (dom) {  //viewid
                    var params = {
                        id: dom.attr('viewid')
                    };
                    var truthBeTold = window.confirm("ȷ��ɾ����ģ�壿");
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
