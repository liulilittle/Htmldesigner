'use strict'

!(function () {
    var UpLoad = function (el, options) {
        var _content = '';
        var _addfile = '';
        var _newfolder = '';
        var _nav = '';
        var _modal = '';
        var _close = '';
        var _prompt = '';
        var _sure = '';
        var timer = null;
        var that = this;
        this.el = $(el);
        this.options = options;
        this.url = '';  //文件上传目录
        this.FileName = '';
        this.init = function () {
            var id = this.options.Id;
            if ($("#" + id).length) {
                _modal = $("#" + id);
                _modal.modal('show');
                _nav = _modal.find('.breadcrumb');
                _content = _modal.find('.divall');
                this.initServer();
                return;
            }

            this.initServer();
            this.CreateModal();  // 创建组件html
        };
        this.CreateModal = function () {
            _modal = $([
                '<div id="'+ this.options.Id +'" class="modal control_modal fade">',
                '<div class="modal-dialog" style="width: 830px;">',
                '<div class="modal-content">',
                '<div class="modal-header">',
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>',
                '<h4 class="modal-title" id="myModalLabel">文件浏览器</h4>',
                '</div>',
                '<div class="upfileprompt">文件上传失败！</div>',
                '<div class="modal-body preview_form">',
                '<ul class="breadcrumb"></ul>',
                '<div class="upload-con" style="height: 400px;overflow-y:auto;">',
                '<ul class="divall"></ul>',
                '</div>',
                '</div>',
                '<div class="modal-footer">',
                '<button type = "button" class="btn btn-primary newfolder" style = "float: left;" >',
                '<span class="glyphicon glyphicon-folder-open"></span> &nbsp;&nbsp; 新建文件夹',
                '</button>',
                '<button type = "button" class="btn btn-primary sure">确定</button>',
                '<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>',
                '</div>',
                '</div>',
                '</div>',
                '</div>'
            ].join(''));
            _content = _modal.find('.divall');
            _nav = _modal.find('.breadcrumb');
            _newfolder = _modal.find('.newfolder');
            _newfolder.click(that.newFolder);
            _prompt = _modal.find('.upfileprompt');
            _close = _modal.find('.btn-close');
            _sure = _modal.find(".sure");
            _sure.click(that.sure);
            _modal.modal('show');
            this.LoadFolderNav();
            this.LoadFileList();
            
        };

        this.LoadFolderNav = function () {
            var arr = this.options.dir.split('/');
            var len = arr.length;
            var html = '';
            var path = '/';
            _nav.empty();

            if (this.options.dir.length == 1) {
                len = arr.length - 1;
            }

            for (var i = 0; i < len; i++) {
                if (i == 0) {
                    html = $('<li data-name="/"><a href="#" data-name="/" data-dir="/">根目录</a></li>');
                } else {
                    path += arr[i];
                    html = $('<li data-name="' + arr[i] + '"><span>&nbsp;>&nbsp;</span><a href="#" data-name="' + arr[i] + '" data-dir="' + path + '">' + arr[i] +'</a></li>');
                }

                html.find('a').click(that.openfolder);

                _nav.append(html);
            }
        };

        this.LoadFileList = function () {

            var data = this.options.data;
            _content.empty();
            if (data.length <= 0) {
                return;
            } else {
                var Files = data.Files;
                var Directories = data.Directories;
                var html = '';
                for (var i = 0; i < Directories.length; i++) {
                    html = this.LoadFolder(Directories[i]);
                    _content.append(html);
                }
                
                for (var i = 0; i < Files.length; i++) {
                    if (this.options.type == 'Image') {
                        if (/.(gif|jpg|jpeg|png|bmp)$/.test(Files[i].File)) {
                            html = this.LoadFile(Files[i]);
                        }
                    }
                    if (this.options.type == 'Video') {
                        if (/.(mp4|mkv|avi|rm|rmvb|flv)$/.test(Files[i].File)) {
                            html = this.LoadFile(Files[i]);
                        }
                    }
                    if (this.options.type == 'Audio') {
                        if (/.(mp3|wav|acc)$/.test(Files[i].File)) {
                            html = this.LoadFile(Files[i]);
                        }
                    }

                    if (!this.options.type) {
                        html = this.LoadFile(Files[i]);
                    }
                    
                    _content.append(html);
                }
            }
            this.LoadAdd();
        };

        this.LoadAdd = function () {
            _addfile = $('<li class="z_file"><div class="z_file_d"></div><input id="file" type="file" name="file" style="display: none;"></li>');
            _addfile.find('.z_file_d').bind('click', function (e) {
                e.preventDefault();
                _addfile.find('#file').trigger('click').change(that.upfile);
            });
            _content.append(_addfile);
        };

        this.LoadFolder = function () {
            if (arguments.length <= 0) {
                return;
            }
            var html = '';
            var foldername = arguments[0];

            html = $('<li></li>').attr({
                'class': 'folder',
                'data-name': arguments[0]
            });

            html.append('<div class="mask_layer_info"><span class="removedir" data-name="' + foldername + '">×</span ></p></div>');
            html.append('<img src = "../resources/images/icon_folder.png"/>');;
            html.append('<input type="text" class="changename filename" value="' + foldername + '" data-id="' + foldername + '" data-last-value="' + foldername + '"></li>');
            
            html.find('.changename').click(that.rename);
            html.dblclick(that.openfolder);
            html.hover(function () {
                $(this).find('div').show();
            }, function () {
                $(this).find('div').hide();
            });

            html.find('.removedir').click(that.delectfile);

            return html;
        };

        this.LoadFile = function () {
            if (arguments.length <= 0) {
                return;
            }

            var file = arguments[0];
            var time = file.LastWriteTime.split(" ");
            var Path = decodeURI(file.File);
            var FileName = decodeURI(file.FileName);

            var html = $('<li></li>').attr({
                'class': 'folder',
                'data-path': Path
            });
            html.append('<div class="mask_layer_info"><p>' + time[0] + '<span class="removedir" data-name=' + FileName + '>×</span ></p></div>');
            if (/.(gif|jpg|jpeg|png|bmp)$/.test(FileName)) {
                html.append('<img src=' + Path + '/>');
            }
            if (/.(mp4|mkv|avi|rm|rmvb|flv)$/.test(FileName)) {
                html.append('<video src=' + Path + ' muted="true" loop autoplay></video>');
            }
            if (/.(mp3|wav|acc)$/.test(FileName)) {
                html.append('<img src="/resources/images/icon_music.png"/>');
            }
            html.append('<input type="text" class="filename" disabled="disabled" value="' + FileName + '"/>');

            html.hover(function () {
                $(this).find('div').show();
            }, function () {
                $(this).find('div').hide();
            });
            html.find('span').click(that.delectfile);

            html.click(that.choosefile);

            return html;
        };

        this.initServer = function () {
            var that = this;
            if (!that.options.server) {
                return;
            }

            if (!that.options.url) {
                return;
            }

            $.ajax({
                type: that.options.method,
                url: that.options.url,
                data: that.options.params,
                dataType: that.options.dataType,
                success: function (res) {
                    if (res.ErrorCode == 0) {
                        if (res.Tag) {
                            that.options.data = res.Tag;
                            that.LoadFolderNav();
                            that.LoadFileList();
                        } else {
                            that.LoadAdd();
                            that.prompt('没有找到可用数据');
                        }
                    } else {
                        that.prompt(res.Message);
                    }
                },
                error: function (res) {
                    that.prompt('网络超时！');
                    console.log('网络超时！');
                }
            });
        };

        this.newFolder = function () {
            var key = null;
            var keys = that.getAllFolderName();
            for (var i = 1,
                n = ~(1 << 31);
                i < n; i++) {
                key = 'NewFolder' + i;
                if (!keys.hasOwnProperty(key)) {
                    break;
                }
                key = null;
                continue;
            }

            TMXHR('/dg/resources/mkdir', 'POST', { dir: '/' + key }, function (res) {
                if (res.ErrorCode == 0) {
                    var html = that.LoadFolder(key);
                    _content.prepend(html);
                } else {
                    that.prompt(res.Message);
                }
            }, function () {
                that.prompt('网络超时！');
            });
        };

        this.getAllFolderName = function () {

            var names = {};
            $(".changename").each(function () {
                var name = $(this).val();
                if (!name) {
                    return;
                }
                names[name] = 0;
            });

            return names;
        };

        this.openfolder = function () {
            var name = $(this).attr('data-name');
            var path = that.options.dir;

            if (name == "/" && name != path) {
                that.options.dir = '/';
                that.options.params = { dir: '/' };
                that.initServer();
                return;
            }

            if (path.indexOf(name) < 0) {
                that.options.dir = path = that.options.dir + name + "/";

                var html = $('<li data-name="' + name + '"><span>&nbsp;>&nbsp;</span><a href="#" data-path="' + that.options.dir + '" data-dir="' + name + '">' + name + '</a></li>');

                _nav.append(html);
            } else {
                that.options.dir = $(this).attr('data-dir');
            }
            path = path.substr(0, path.length - 1);  
            that.options.params = { dir: path };
            that.initServer();
        };

        this.rename = function () {
            var dom = $(this);
            
            dom.change(function (e) {
                var dir = dom.val();
                var name = dom.attr('data-last-value');
                var params = {
                    sourcedir: that.options.dir + name,
                    destdir: that.options.dir + dir
                };
                TMXHR('/dg/resources/rename', "POST", params, function (res) {
                    if (res.ErrorCode == 0) {
                        dom.attr('data-last-value', dir);
                        dom.attr('data-id', dir);
                    } else {
                        dom.val(name);
                        that.prompt(res.Message);
                    }
                }, function () {
                    dom.val(name);
                    that.prompt('网络超时！');
                    });

                e.preventDefault();
            });
        };

        this.prompt = function (txt) {
            _prompt.html(txt).slideDown();
            clearTimeout(timer);
            timer = setTimeout(function () {
                _prompt.slideUp();
            }, 3000);
        };

        this.choosefile = function () {
            $('.file_success').remove();
            $(this).append('<p class="file_success" style="display: block;"></p>')
        };

        this.delectfile = function () {
            var name = $(this).attr('data-name');
            var li = $(this).parents("li");
            var dir = that.options.dir + name;
            TMXHR('/dg/Resources/del', 'POST', { path: dir }, function (res) {
                li.remove();
                that.prompt(res.Message);
            });
        };

        this.sure = function () {
            if ($(".file_success").length) {
                var path = $(".file_success").parents('li').attr('data-path');
                that.options.SureFile(path);
                try {
                    var designer = HtmlDesigner;
                    if (__instanceof(designer, Object)) {
                        var internal = designer.internal;
                        if (typeof internal.AddIncludeFile == 'function') {
                            internal.AddIncludeFile(path);
                        }
                    }
                } catch (e) {
                    console.error(e);
                }
                _modal.modal('hide');
            } else {
                that.prompt('请选择要使用的图片');
            }
        };

        this.upfile = function () { 
            var file = this.files[0];
            var dir = that.options.dir;
            var filename = file.name;
            HtmlDesigner.Resource.Update2(file, {
                dir: dir,
                success: function (res) {
                    console.log(res);
                    that.prompt(res.Message);
                    if (res.ErrorCode == 0) {
                        var file = {
                            File: filename,
                            LastWriteTime: TimeDate()
                        };
                        var html = that.LoadFile(file);
                        _addfile.before(html);
                    }
                }
            });
        };
    };

    UpLoad.defaults = {
        url: '',    //获取所有文件url
        method: 'GET',//POST or GET
        server: false, //ajax获取数据
        data: '',   //默认加载数据
        params: {}, //url参数
        dir: '/',
        dataType: 'json',
        type: null,
        DeleteFile: function (info, index, foldername) {
            console.log(info, index, foldername);
        },
        Rename: function (info, name, oldname) {
            console.log(info, name, oldname);
        },
        SureFile: function (path) {
            console.log(path);
        }
    };

    $.fn.UpLoad = function (options) {
        options = $.extend({}, UpLoad.defaults, options);
        $(this).click(function () {
            var a = new UpLoad(this, options);
            a.init();
        });
    };
})();


var trim = function (txt) {
    return txt.replace(/\s+/g, "");
};


var TimeDate = function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    var nowDate = year + "-" + month + "-" + day;

    return nowDate;
};

var TMXHR = function ($url, $type, $data, $success, $onerror) {
    if ($url == undefined || $url == null) {
        return;
    }
    if ($data == null) {
        $data = undefined;
    }
    $.ajax({
        type: $type,
        url: $url,
        data: $data,
        success: function (buffer) {
            if (!buffer.length) {
                return;
            }

            buffer = JSON.parse(buffer);
            console.log(buffer)
            
            if ($success == undefined || $success == null) {
                return;
            }
            $success(buffer);
        },
        onerror: function (sender, status, onerror) {
            console.error(status);
            if ($onerror == undefined || $onerror == null) {
                return;
            }
            $onerror(sender, status, onerror);
        }
    });
}