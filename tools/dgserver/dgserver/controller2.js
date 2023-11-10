'use strict'

require('dgserver/dao.js'); /* #include hh */
require('dgserver/server.js');
/*
 * nsjsdotnet server development
 * ----------------------------------------------
 * The "C" layer in MVC, but you can't think of it as a 3 layer(three-tier) architecture
 * 
 * 
 */
const RESOURCES_ROOT_PATH = '/dgserver/resources/u/'; //资源文件根目录
const URIROUTE_SEGMENT_PREFIX = '/dg/'; //控制器目录
const RESOURCES_ROOT_INNER_PATH = '../u/';
const RESOURCES_REFER_PATH = "/dgserver/resources/components/";
const RESOURCES_SOURCEFILE_PATH = "/dgserver/resources/";
const RESOURCES_COMMPONET_PATH = "/components/"
const VIEW_PATH = "/dgserver/resources/views/";

let GeneralResponse = function () {
    this.Tag = null;
    this.ErrorCode = 0;
    this.Message = null;
}

let controllers = (function () {
    class ComponentsController {
        constructor() {
            this.GetAll = function (context) {
                let response = context.Response;
                let dao = new ComponentsDAO();
                let rows = dao.GetAll();

                let result = new GeneralResponse();
                result.ErrorCode = 0;
                result.Message = "获取成功";
                result.Tag = rows;
                response.Write(JSON.stringify(result));
            };
        }
    }
    class GroupController {
        constructor() {
            this.LoadGroup = function (context) {
                let response = context.Response;
                let dao = new GroupDAO();
                let rows = dao.LoadGroup();

                let result = new GeneralResponse();
                result.ErrorCode = 0;
                result.Message = "获取成功";
                result.Tag = rows;
                response.Write(JSON.stringify(result));
            };
        }
    }
    class ResourcesController {
        constructor() {
            this.u = function (context) {
                let request = context.Request;
                let response = context.Response;
                let result = new GeneralResponse();
                let fileinfo = request.Files['data'];
                try {
                    if (!fileinfo) {
                        result.ErrorCode = 1;
                        result.Message = "未上传文件";
                        result.Tag = null;
                    } else {
                        let filepath = fileinfo.FileName;
                        let uploadstream = fileinfo.InputStream;
                        let mediatype = fileinfo.ContentType;
                        let filesize = fileinfo.ContentLength;

                        let filedir = request.Form['dir'];
                        if (!filedir) {
                            filedir = '/';
                        }
                        let __IO = System.IO;
                        let Directory = __IO.Directory;
                        filedir = Environment.GetApplicationStartupPath() + (RESOURCES_ROOT_PATH + RESOURCES_ROOT_INNER_PATH + filedir).replace('//', '/');
                        console.log(filedir);
                        if (!Directory.Exists(filedir)) {
                            Directory.CreateDirectory(filedir);
                        }
                        let filemapurl = (RESOURCES_ROOT_INNER_PATH + filepath);
                        filepath = (filedir + "/" + filepath);

                        if (__IO.File.Exists(filepath)) {
                            result.ErrorCode = 2;
                            result.Message = "文件已经存在";
                            result.Tag = filemapurl;
                        } else {
                            using(__IO.FileStream.New(filepath, 4),
                                function (filestream) {
                                    uploadstream.CopyTo(filestream);
                                    uploadstream.Flush();
                                });



                            result.ErrorCode = 0;
                            result.Message = "上传成功";
                            result.Tag = filemapurl;
                        }
                    }
                } catch (e) {
                    console.log(e.message);
                    result.ErrorCode = 3;
                    result.Message = e.Message;
                    result.Tag = null;
                }
                response.Write(JSON.stringify(result));
            }
            this.dir = function (context) {
                let request = context.Request;
                let response = context.Response;
                let result = new GeneralResponse();
                let dirtor = request.Form['dir'];
                if (!dirtor) {
                    dirtor = '/';
                }

                dirtor = (dirtor + '/').replace("//", "/");

                let dir = (RESOURCES_ROOT_PATH + dirtor).replace('//', '/');
                dir = Environment.GetApplicationStartupPath() + dir;

                let __Directory = System.IO.Directory;
                let directories = [];
                let files = [];
                if (!__Directory.Exists(dir)) {
                    result.Tag = null;
                    result.ErrorCode = 1;
                    result.Message = "目录不存在";
                } else {
                    let s = function (s) {
                        for (let i = 0; i < s.length; i++) {
                            let p = s[i];
                            let n = p.lastIndexOf('/');
                            if (n < 0)
                                n = p.lastIndexOf('\\');
                            if (n < 0)
                                continue;
                            s[i] = p.substr(n + 1);
                        }
                        return s;
                    }
                    files = s(__Directory.GetFiles(dir));
                    directories = s(__Directory.GetDirectories(dir));

                    let filesinfo = [];
                    for (let f of files) {
                        let filepath = dir + f;

                        let lastwritetime = System.IO.File.GetLastWriteTime(filepath);
                        let filelength = System.IO.File.GetFileLength(filepath);
                        let filebt = 0;
                        if (filelength) {
                            filebt = (filelength / 1024).toFixed(2);
                        }
                        let fileinfo = {
                            File: encodeURI(f),
                            LastWriteTime: lastwritetime,
                            FileLength: filebt
                        }
                        filesinfo.push(fileinfo);
                    }

                    result.Tag = new Object({
                        Files: filesinfo,
                        Directories: directories,
                    });
                    result.ErrorCode = 0;
                    result.Message = '获取成功';
                }
                response.Write(JSON.stringify(result));
            }
            this.rename = function (context) {
                let request = context.Request;
                let response = context.Response;
                let result = new GeneralResponse();
                let sourcedir = request.Form['sourcedir'];
                let destdir = request.Form['destdir'];

                if (!sourcedir) {
                    result.Tag = null;
                    result.ErrorCode = 1;
                    result.Message = "文件或目录不存在";
                    return response.Write(JSON.stringify(result));
                }
                if (!destdir) {
                    result.Tag = null;
                    result.ErrorCode = 1;
                    result.Message = "请输入正确的文件名";
                    return response.Write(JSON.stringify(result));
                }

                sourcedir = (RESOURCES_ROOT_PATH + sourcedir).replace('//', '/');
                sourcedir = Environment.GetApplicationStartupPath() + sourcedir;

                destdir = (RESOURCES_ROOT_PATH + destdir).replace('//', '/');
                destdir = Environment.GetApplicationStartupPath() + destdir;

                let __File = System.IO.File;
                let __Directory = System.IO.Directory;
                if (__File.Exists(sourcedir)) {
                    try {
                        __File.Move(sourcedir, destdir);
                    } catch (e) { }
                }
                else if (__Directory.Exists(sourcedir)) {
                    try {
                        __Directory.Move(sourcedir, destdir);
                    } catch (e) { }
                }
                else {
                    result.Tag = null;
                    result.ErrorCode = 1;
                    result.Message = "文件或目录不存在";
                    return response.Write(JSON.stringify(result));
                }
                result.Tag = null;
                result.ErrorCode = 0;
                result.Message = '操作成功';
                return response.Write(JSON.stringify(result));
            }
            this.del = function (context) {
                let request = context.Request;
                let response = context.Response;
                let result = new GeneralResponse();
                let path = request.Form['path'];
                if (!path) {
                    path = '/';
                }
                path = (RESOURCES_ROOT_PATH + path).replace('//', '/');
                path = Environment.GetApplicationStartupPath() + path;
                let __File = System.IO.File;
                let __Directory = System.IO.Directory;
                let __behavior = -1;

                let success = false;
                let exception = null;
                if (!__File.Exists(path)) {
                    if (!__Directory.Exists(path)) {
                        result.ErrorCode = 1;
                        result.Message = "文件或目录不存在";
                        result.Tag = null;
                    } else {
                        try {
                            success = __Directory.Delete(path);
                        } catch (e) {
                            exception = e;
                        }
                        __behavior = 0;
                    }
                } else {
                    try {
                        success = __File.Delete(path);
                    } catch (e) {
                        exception = e;
                    }
                    __behavior = 1;
                }
                if (__behavior != -1) {
                    if (exception != null) {
                        result.ErrorCode = 3;
                        result.Message = exception.message;
                        result.Tag = null;
                    } else {
                        result.ErrorCode = success ? 0 : 2;
                        switch (__behavior) {
                            case 0:
                                result.Message = success ? '删除目录成功' : '删除目录失败';
                                break;
                            case 1:
                                result.Message = success ? '删除文件成功' : '删除文件失败';
                                break;
                        }
                        result.Tag = null;
                    }
                }
                response.Write(JSON.stringify(result));
            }
            this.dels = function (context) {
                let request = context.Request;
                let response = context.Response;
                let result = new GeneralResponse();
                let path = request.Form['path'];

                if (!path || path.length == 0) {
                    result.ErrorCode = 1;
                    result.Message = "文件或目录不存在";
                    result.Tag = null;
                    response.Write(JSON.stringify(result));
                    return;
                }

                let paths = JSON.parse(path);

                if (!Array.isArray(paths)) {
                    result.ErrorCode = 1;
                    result.Message = "请上传文件集合";
                    result.Tag = null;
                    response.Write(JSON.stringify(result));
                    return;
                }

                let __behavior = true;
                for (let p of paths) {
                    console.log("p:" + p);
                    if (!p || p == "/")
                        continue;

                    let path = (RESOURCES_ROOT_PATH + p).replace('//', '/');
                    path = Environment.GetApplicationStartupPath() + path;

                    console.log("path:" + path);
                    let __File = System.IO.File;
                    let __Directory = System.IO.Directory;

                    let success = false;
                    let exception = null;
                    if (__File.Exists(path)) {
                        try {
                            //console.log("f:" + path);
                            __File.Delete(path);
                        }
                        catch (e) { __behavior &= false }
                    }
                    else if (__Directory.Exists(path)) {
                        try {
                            //console.log("p:" + path);
                            __Directory.Delete(path);
                        } catch (e) { __behavior &= false }
                    }
                    else
                        __behavior &= false;
                }
                result.ErrorCode = 0;
                result.Message = __behavior ? "删除成功" : "部分文件删除失败请检查";
                result.Tag = null;

                response.Write(JSON.stringify(result));
            }
            this.mkdir = function (context) {
                let request = context.Request;
                let response = context.Response;
                let result = new GeneralResponse();
                let dir = request.Form['dir'];
                if (!dir) {
                    dir = '/';
                }
                let exception = null;
                let success = false;

                let __Directory = System.IO.Directory;
                dir = (RESOURCES_ROOT_PATH + dir).replace('//', '/');
                dir = Environment.GetApplicationStartupPath() + dir;

                if (__Directory.Exists(dir)) {
                    result.ErrorCode = 1;
                    result.Message = "目录已存在";
                    result.Tag = null;
                    response.Write(JSON.stringify(result));
                    return;
                } else {
                    try {
                        success = __Directory.CreateDirectory(dir);
                    } catch (e) {
                        exception = e;
                    }
                }
                if (exception != null) {
                    result.ErrorCode = 2;
                    result.Message = exception.message;
                    result.Tag = null;
                } else {
                    result.ErrorCode = success ? 0 : 1;
                    result.Message = success ? '创建目录成功' : '创建目录失败';
                    result.Tag = null;
                }
                response.Write(JSON.stringify(result));
            }
        }
    }
    class ViewsController {
        constructor() {
            this.GetAll = function (context) {
                let response = context.Response;
                let dao = new ViewsDAO();
                let rows = dao.GetAllView();
                let result = new GeneralResponse();
                result.ErrorCode = 0;
                result.Message = "获取成功";
                result.Tag = rows;

                response.Write(JSON.stringify(result));
            }
            this.GetAllGroupView = function (context) {
                let response = context.Response;
                let dao = new ViewsDAO();
                let rows = dao.GetAllGroupView();

                let result = new GeneralResponse();
                result.ErrorCode = 0;
                result.Message = "获取成功";
                result.Tag = rows;

                response.Write(JSON.stringify(result));
            }
            this.GetCode = function (context) {
                let request = context.Request;
                let response = context.Response;
                let dao = new ViewsDAO();

                let result = new GeneralResponse();
                let code = request.QueryString['id'];
                if (code) {
                    result.Tag = dao.GetCodeById(code);
                    if (!result.Tag) {
                        result.ErrorCode = 2;
                        result.Message = '编号不存在';
                    }
                } else if ((code = request.QueryString['code'])) {
                    result.Tag = dao.GetCodeByCode(code);
                    if (!result.Tag) {
                        result.ErrorCode = 3;
                        result.Message = '代号不存在';
                    }
                } else {
                    result.ErrorCode = 1;
                    result.Message = "编号或代号的值未提供";
                }
                if (result.Tag) {
                    result.ErrorCode = 0;
                    result.Message = '获取代码成功';
                }
                response.Write(JSON.stringify(result));
            }
            this.AddOrUpdate = function (context) {
                let request = context.Request;
                let response = context.Response;

                let result = new GeneralResponse();
                let model = request.Form;

                if (!model.gcode) {
                    result.ErrorCode = 1;
                    result.Message = '分组编号无效';
                } else if (!model.viewcode) {
                    result.ErrorCode = 2;
                    result.Message = '视图代码(viewcode)无效';
                } else if (!model.viewname) {
                    result.ErrorCode = 3;
                    result.Message = '视图名称(viewname)无效';
                }
                else {
                    let dao = new ViewsDAO();
                    let nonquery = dao.AddOrUpdate(model);
                    if (!nonquery) {
                        result.ErrorCode = 4;
                        result.Message = '无法添加或修改视图';
                    } else {
                        result.ErrorCode = 0;
                        result.Tag = nonquery;
                        result.Message = '添加或修改视图成功';
                    }
                }
                response.Write(JSON.stringify(result));
            }
            this.Delete = function (context) {
                let request = context.Request;
                let response = context.Response;

                let result = new GeneralResponse();
                let id = request.QueryString['id'];
                if (id === null || id === undefined) {
                    result.ErrorCode = 1;
                    result.Message = '视图编号不可以为空';
                } else {
                    let dao = new ViewsDAO();
                    if (dao.DeleteById(id)) {
                        result.ErrorCode = 0;
                        result.Message = '删除视图成功';
                    } else {
                        result.ErrorCode = 2;
                        result.Message = '删除视图失败，指定编号的视图不存在';
                    }
                }
                response.Write(JSON.stringify(result));
            }
            this.Run = function (context) {
                let request = context.Request;
                let response = context.Response;
                let dao = new ViewsDAO();

                let model = null;
                let code = request.QueryString['id'];
                if (code) {
                    model = dao.GetCodeById(code, 1);
                } else if ((code = request.QueryString['code'])) {
                    model = dao.GetCodeByCode(code, 1);
                }

                let layout = null;
                if (model !== null) {
                    layout = model.viewcode;
                }
                if (layout !== null) {
                    layout = JSON.parse(layout);
                }
                if (layout === null) {
                    response.StateCode = 404;
                } else {
                    let htmlcode = '<html><head><!--nsjsdotnet-http/s 1.1x version server[xd: w3p@csharp]--><title>{$title}</title>{$link-scriptcode}<style type="text/css">{$stylecode}</style></head><body>{$loading-box}</body><script>{$initialization}</script></html>'.
                        replace('{$title}', model.viewname).
                        replace('{$stylecode}', '.loading-box{position:fixed;height:100%;width:100%;z-index:100001;background:#fff;color:#00a5a5;opacity:.8;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:30px;letter-spacing:5px}.spinner{position:absolute;width:100px;height:100px;top:0;left:0;bottom:20%;right:0;margin:auto}.container1>div,.container2>div,.container3>div{width:15px;height:15px;background:#00a5a5;border-radius:100%;position:absolute;-webkit-animation:bouncedelay 1.2s infinite ease-in-out;animation:bouncedelay 1.2s infinite ease-in-out;-webkit-animation-fill-mode:both;animation-fill-mode:both}.spinner .spinner-container{position:absolute;width:100%;height:100%}.container2{-webkit-transform:rotateZ(45deg);transform:rotateZ(45deg)}.container3{-webkit-transform:rotateZ(90deg);transform:rotateZ(90deg)}.circle1{top:0;left:0}.circle2{top:0;right:0}.circle3{right:0;bottom:0}.circle4{left:0;bottom:0}.container2 .circle1{-webkit-animation-delay:-1.1s;animation-delay:-1.1s}.container3 .circle1{-webkit-animation-delay:-1s;animation-delay:-1s}.container1 .circle2{-webkit-animation-delay:-.9s;animation-delay:-.9s}.container2 .circle2{-webkit-animation-delay:-.8s;animation-delay:-.8s}.container3 .circle2{-webkit-animation-delay:-.7s;animation-delay:-.7s}.container1 .circle3{-webkit-animation-delay:-.6s;animation-delay:-.6s}.container2 .circle3{-webkit-animation-delay:-.5s;animation-delay:-.5s}.container3 .circle3{-webkit-animation-delay:-.4s;animation-delay:-.4s}.container1 .circle4{-webkit-animation-delay:-.3s;animation-delay:-.3s}.container2 .circle4{-webkit-animation-delay:-.2s;animation-delay:-.2s}.container3 .circle4{-webkit-animation-delay:-.1s;animation-delay:-.1s}@-webkit-keyframes bouncedelay{0%,100%,80%{-webkit-transform:scale(0)}40%{-webkit-transform:scale(1)}}@keyframes bouncedelay{0%,100%,80%{transform:scale(0);-webkit-transform:scale(0)}40%{transform:scale(1);-webkit-transform:scale(1)}}').
                        replace('{$loading-box}', '<div class="loading-box" style="display: none"><div class="spinner"><div class="spinner-container container1"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container2"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container3"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div></div><div id="LoadingPrompt" style="width:100%;text-align:center;height:100vh;line-height:120vh;">loading...</div></div>');
                    let references = layout.References;
                    if (references && references.length) {
                        let linkscriptcode = '';
                        for (let i = 0; i < references.length; i++) {
                            let reference = references[i];
                            if (!reference) {
                                continue;
                            }
                            linkscriptcode += '<script src="{$reference}"></script>'.replace('{$reference}', '/components/' + reference);
                        }
                        htmlcode = htmlcode.replace('{$link-scriptcode}', linkscriptcode);
                    }
                    let timeout = Number(request.QueryString['timeout']);
                    timeout = isNaN(timeout) || timeout < 0 ? 0 : timeout;
                    htmlcode = htmlcode.replace('{$initialization}',
                        'var Loading = $(".loading-box"); Object.defineProperty(window, "View", new (function() { {0} {1} {2} this.get = function() { return __instance; } }));'.
                            replace('{0}', 'Loading.fadeIn();').
                            replace('{1}', 'var __instance = HtmlView.ResumeLayout(null, ' + model.viewcode + '); Object.SetPropertyValue(__instance, "Name", "View");').
                            replace('{2}', timeout > 0 ? 'setTimeout(function() { Loading.fadeOut(); }, ' + timeout + ');' : 'Loading.fadeOut();'));

                    response.Write(htmlcode);
                }
            }
            this.downfile = function (context) {
                let request = context.Request;
                let response = context.Response;
                let dao = new ViewsDAO();

                let model = null;
                let downfile = false;
                let code = request.QueryString['id'];
                if (code) {
                    model = dao.GetCodeById(code, 1);
                } else if ((code = request.QueryString['code'])) {
                    model = dao.GetCodeByCode(code, 1);
                }

                let layout = null;
                if (model !== null) {
                    layout = model.viewcode;
                }
                if (layout !== null) {
                    layout = JSON.parse(layout);
                }
                if (layout === null) {
                    response.StateCode = 404;
                } else {
                    let filespath = RESOURCES_ROOT_PATH + "/" + code + "/";
                    filespath = Environment.GetApplicationStartupPath() + filespath;
                    let references = layout.References;
                    let relatroot = "./";
                    let directory = System.IO.Directory;
                    let file = System.IO.File;

                    if (references && references.length) {

                        for (let i = 0; i < layout.References.length; i++) {
                            let reference = layout.References[i];
                            let sourcepath = Environment.GetApplicationStartupPath() + RESOURCES_REFER_PATH + reference;
                            let destpath = filespath + "/components/" + reference;

                            sourcepath = sourcepath.replace('//', '/');
                            destpath = destpath.replace('//', '/');

                            let temppath = destpath.substring(0, destpath.lastIndexOf("/"));

                            if (!directory.Exists(temppath)) {
                                directory.CreateDirectory(temppath);
                            }

                            if (!file.Exists(destpath)) {
                                file.Copy(sourcepath, destpath);
                            }
                        }
                    }

                    for (let control of layout.View.Controls) {
                        for (let subcontrol of control.Controls) {
                            if (!subcontrol.BackgroundImage)
                                continue;
                            let picpath = Environment.GetApplicationStartupPath() + RESOURCES_SOURCEFILE_PATH + subcontrol.BackgroundImage;
                            let destpicpath = filespath + subcontrol.BackgroundImage;
                            picpath = picpath.replace('//', '/');

                            let temppath = destpicpath.substring(0, destpicpath.lastIndexOf("/"));

                            if (!directory.Exists(temppath)) {
                                directory.CreateDirectory(temppath);
                            }

                            if (!file.Exists(destpicpath)) {
                                file.Copy(picpath, destpicpath);
                            }
                        }

                        if (!control.BackgroundImage) {
                            continue;
                        }
                        let picpath = Environment.GetApplicationStartupPath() + RESOURCES_SOURCEFILE_PATH + control.BackgroundImage;
                        let destpicpath = filespath + control.BackgroundImage;
                        picpath = picpath.replace('//', '/');

                        let temppath = destpicpath.substring(0, destpicpath.lastIndexOf("/"));

                        if (!directory.Exists(temppath)) {
                            directory.CreateDirectory(temppath);
                        }

                        if (!file.Exists(destpicpath)) {
                            file.Copy(picpath, destpicpath);
                        }
                    }

                    let htmlcode = '<html><head><!--nsjsdotnet-http/s 1.1x version server[xd: w3p@csharp]--><title>{$title}</title>{$link-scriptcode}<style type="text/css">{$stylecode}</style></head><body>{$loading-box}</body><script>{$initialization}</script></html>'.
                        replace('{$title}', model.viewname).
                        replace('{$stylecode}', '.loading-box{position:fixed;height:100%;width:100%;z-index:100001;background:#fff;color:#00a5a5;opacity:.8;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:30px;letter-spacing:5px}.spinner{position:absolute;width:100px;height:100px;top:0;left:0;bottom:20%;right:0;margin:auto}.container1>div,.container2>div,.container3>div{width:15px;height:15px;background:#00a5a5;border-radius:100%;position:absolute;-webkit-animation:bouncedelay 1.2s infinite ease-in-out;animation:bouncedelay 1.2s infinite ease-in-out;-webkit-animation-fill-mode:both;animation-fill-mode:both}.spinner .spinner-container{position:absolute;width:100%;height:100%}.container2{-webkit-transform:rotateZ(45deg);transform:rotateZ(45deg)}.container3{-webkit-transform:rotateZ(90deg);transform:rotateZ(90deg)}.circle1{top:0;left:0}.circle2{top:0;right:0}.circle3{right:0;bottom:0}.circle4{left:0;bottom:0}.container2 .circle1{-webkit-animation-delay:-1.1s;animation-delay:-1.1s}.container3 .circle1{-webkit-animation-delay:-1s;animation-delay:-1s}.container1 .circle2{-webkit-animation-delay:-.9s;animation-delay:-.9s}.container2 .circle2{-webkit-animation-delay:-.8s;animation-delay:-.8s}.container3 .circle2{-webkit-animation-delay:-.7s;animation-delay:-.7s}.container1 .circle3{-webkit-animation-delay:-.6s;animation-delay:-.6s}.container2 .circle3{-webkit-animation-delay:-.5s;animation-delay:-.5s}.container3 .circle3{-webkit-animation-delay:-.4s;animation-delay:-.4s}.container1 .circle4{-webkit-animation-delay:-.3s;animation-delay:-.3s}.container2 .circle4{-webkit-animation-delay:-.2s;animation-delay:-.2s}.container3 .circle4{-webkit-animation-delay:-.1s;animation-delay:-.1s}@-webkit-keyframes bouncedelay{0%,100%,80%{-webkit-transform:scale(0)}40%{-webkit-transform:scale(1)}}@keyframes bouncedelay{0%,100%,80%{transform:scale(0);-webkit-transform:scale(0)}40%{transform:scale(1);-webkit-transform:scale(1)}}').
                        replace('{$loading-box}', '<div class="loading-box" style="display: none"><div class="spinner"><div class="spinner-container container1"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container2"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container3"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div></div><div id="LoadingPrompt" style="width:100%;text-align:center;height:100vh;line-height:120vh;">loading...</div></div>');

                    if (references && references.length) {
                        let linkscriptcode = '';
                        for (let i = 0; i < references.length; i++) {
                            let reference = references[i];
                            if (!reference) {
                                continue;
                            }
                            linkscriptcode += '<script src="{$reference}"></script>'.replace('{$reference}', '../components/' + reference);
                        }
                        htmlcode = htmlcode.replace('{$link-scriptcode}', linkscriptcode);
                    }
                    let timeout = Number(request.QueryString['timeout']);
                    timeout = isNaN(timeout) || timeout < 0 ? 0 : timeout;
                    htmlcode = htmlcode.replace('{$initialization}',
                        'var Loading = $(".loading-box"); Object.defineProperty(window, "View", new (function() { {0} {1} {2} this.get = function() { return __instance; } }));'.
                            replace('{0}', 'Loading.fadeIn();').
                            replace('{1}', 'var __instance = HtmlView.ResumeLayout(null, ' + model.viewcode + '); Object.SetPropertyValue(__instance, "Name", "View");').
                            replace('{2}', timeout > 0 ? 'setTimeout(function() { Loading.fadeOut(); }, ' + timeout + ');' : 'Loading.fadeOut();'));

                    let htmlpath = filespath + code + ".html";

                    if (!directory.Exists(filespath)) {
                        directory.CreateDirectory(filespath);
                    }
                    if (!file.Exists(htmlpath)) {
                        file.WriteAllText(htmlpath, htmlcode);
                    }

                    let zipfile = filespath + code + '.zip';
                    let result = new GeneralResponse();
                    result.ErrorCode = 0;
                    result.Message = "压缩成功";
                    result.Tag = "/" + code + "/" + code + ".zip";
                    Compress(filespath, zipfile)

                    response.Write(JSON.stringify(result));
                }
            }

            this.GetPreViewList = function (context) {
                let request = context.Request;
                let response = context.Response;
                let dao = new ViewsDAO();

                let result = new GeneralResponse();

                result.Tag = dao.GetPreViewList();
                response.Write(JSON.stringify(result));
            }
        }
    }
    class PublishController {
        constructor() {
            this.Publish = function (context) {
                let request = context.Request;
                let response = context.Response;
                response.StatusCode = 200;

                /* websocket 方式发布
                 let model = request.Form;
 
                 let querycode = model.querycode;
                 let deviceName = model.devicename;
                 let deviceid = model.deviceid;
                 let viewname = model.viewname;
                 let viewid = model.viewid;
                 let viewversion = model.viewversion;
                 let mode = model.mode;
 
                 try {
                     let args = [];
                     args.push(deviceName);
                     args.push(querycode);
                     args.push(viewname);
                     args.push(deviceid);
 
                     let publishresult = PublishView(args);
                     publishresult = JSON.parse(publishresult);
 
                     console.log(publishresult.ErrorCode);
 
                     let saveresult = false;
                     if (publishresult.ErrorCode == 0) {
                         console.log("in");
 
                         let dao = new PublishDao();
                         saveresult = dao.SavePublish(model);
                     }
 
                     let result = new GeneralResponse();
                     result.ErrorCode = saveresult ? 0 : 1;
                     result.Tag = null;
                     result.Message = publishresult.Message;
                     response.Write(JSON.stringify(result));
                 }
                 catch (e) {
                     console.log(e.message);
                 }
                */

                let fromdata = request.Form;
                let deviceid = fromdata.deviceid;
                let viewid = fromdata.viewid;
                let devicename = fromdata.devicename;
                let mode = fromdata.mode;
                let querycode = fromdata.querycode;

                if (!deviceid || !viewid || !devicename || !mode || !querycode) {
                    let errorresult = new GeneralResponse();
                    errorresult.ErrorCode = -1;
                    errorresult.Message = "参数有误";
                    errorresult.Tag = null;
                    response.Write(JSON.stringify(errorresult));
                    return;
                }


                let filespath = RESOURCES_ROOT_PATH;
                filespath = Environment.GetApplicationStartupPath() + filespath;
                let dao = new ViewsDAO();

                let model = dao.GetCodeById(viewid);

                let layout = model;
                let directory = System.IO.Directory;
                let file = System.IO.File;

                if (layout !== null) {
                    try {
                        layout = JSON.parse(layout);
                    }
                    catch (e) { console.log("---------------视图数据序列化异常---------------"); }
                }

                let fragments = layout.Fragments;

                if (fragments) {

                }

                let references = layout.References;

                let htmlcode = '<html><head><!--nsjsdotnet-http/s 1.1x version server[xd: w3p@csharp]--><title>{$title}</title>{$link-scriptcode}<style type="text/css">{$stylecode}</style></head><body>{$loading-box}</body><script>{$initialization}</script></html>'.
                    replace('{$title}', viewid).
                    replace('{$stylecode}', '.loading-box{position:fixed;height:100%;width:100%;z-index:100001;background:#fff;color:#00a5a5;opacity:.8;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:30px;letter-spacing:5px}.spinner{position:absolute;width:100px;height:100px;top:0;left:0;bottom:20%;right:0;margin:auto}.container1>div,.container2>div,.container3>div{width:15px;height:15px;background:#00a5a5;border-radius:100%;position:absolute;-webkit-animation:bouncedelay 1.2s infinite ease-in-out;animation:bouncedelay 1.2s infinite ease-in-out;-webkit-animation-fill-mode:both;animation-fill-mode:both}.spinner .spinner-container{position:absolute;width:100%;height:100%}.container2{-webkit-transform:rotateZ(45deg);transform:rotateZ(45deg)}.container3{-webkit-transform:rotateZ(90deg);transform:rotateZ(90deg)}.circle1{top:0;left:0}.circle2{top:0;right:0}.circle3{right:0;bottom:0}.circle4{left:0;bottom:0}.container2 .circle1{-webkit-animation-delay:-1.1s;animation-delay:-1.1s}.container3 .circle1{-webkit-animation-delay:-1s;animation-delay:-1s}.container1 .circle2{-webkit-animation-delay:-.9s;animation-delay:-.9s}.container2 .circle2{-webkit-animation-delay:-.8s;animation-delay:-.8s}.container3 .circle2{-webkit-animation-delay:-.7s;animation-delay:-.7s}.container1 .circle3{-webkit-animation-delay:-.6s;animation-delay:-.6s}.container2 .circle3{-webkit-animation-delay:-.5s;animation-delay:-.5s}.container3 .circle3{-webkit-animation-delay:-.4s;animation-delay:-.4s}.container1 .circle4{-webkit-animation-delay:-.3s;animation-delay:-.3s}.container2 .circle4{-webkit-animation-delay:-.2s;animation-delay:-.2s}.container3 .circle4{-webkit-animation-delay:-.1s;animation-delay:-.1s}@-webkit-keyframes bouncedelay{0%,100%,80%{-webkit-transform:scale(0)}40%{-webkit-transform:scale(1)}}@keyframes bouncedelay{0%,100%,80%{transform:scale(0);-webkit-transform:scale(0)}40%{transform:scale(1);-webkit-transform:scale(1)}}').
                    replace('{$loading-box}', '<div class="loading-box" style="display: none"><div class="spinner"><div class="spinner-container container1"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container2"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container3"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div></div><div id="LoadingPrompt" style="width:100%;text-align:center;height:100vh;line-height:120vh;">loading...</div></div>');

                if (references && references.length) {
                    let linkscriptcode = '';
                    for (let i = 0; i < references.length; i++) {
                        let reference = references[i] = '../components/' + references[i];
                        if (!reference) {
                            continue;
                        }
                        linkscriptcode += '<script src="{$reference}"></script>'.replace('{$reference}', reference);
                    }
                    htmlcode = htmlcode.replace('{$link-scriptcode}', linkscriptcode);
                }
                let timeout = Number(request.QueryString['timeout']);
                timeout = isNaN(timeout) || timeout < 0 ? 0 : timeout;
                htmlcode = htmlcode.replace('{$initialization}',
                    'var Loading = $(".loading-box"); Object.defineProperty(window, "View", new (function() { {0} {1} {2} this.get = function() { return __instance; } }));'.
                        replace('{0}', 'Loading.fadeIn();').
                        replace('{1}', 'var __instance = HtmlView.ResumeLayout(null, ' + model + '); Object.SetPropertyValue(__instance, "Name", "View");').
                        replace('{2}', timeout > 0 ? 'setTimeout(function() { Loading.fadeOut(); }, ' + timeout + ');' : 'Loading.fadeOut();'));

                let htmlpath = Environment.GetApplicationStartupPath() + RESOURCES_SOURCEFILE_PATH + "/Views/" + viewid + ".html";
                let relatehtmlpaht = "../views/" + viewid + ".html";

                if (!directory.Exists(filespath)) {
                    directory.CreateDirectory(filespath);
                }

                if (file.Exists(htmlpath)) {
                    file.Delete(htmlpath);
                }

                console.log("currentpath:" + Environment.GetApplicationStartupPath());
                console.log("htmlpath" + htmlpath);

                file.WriteAllText(htmlpath, htmlcode);

                let resourcepath = Environment.GetApplicationStartupPath() + RESOURCES_ROOT_PATH;
                let data = {
                    viewid: viewid,
                    querycode: querycode,
                    deviceid: deviceid,
                    devicename: devicename,
                    mode: mode,
                    viewversion: "",
                    htmlpath: relatehtmlpaht,
                    references: references,
                    includes: layout.Includes,
                    basepath: filespath,
                    resourcepath: resourcepath
                }

                let publishdao = new PublishDao();
                let exereult = publishdao.SavePublish(data);
                let result = new GeneralResponse();
                result.ErrorCode = exereult ? "0" : "-1";
                result.Message = exereult ? "执行成功" : "执行失败";
                result.Tag = null;


                //let result = SaveCached(key, JSON.stringif           //console.log("saveresult:" + result);

                let chacheddatas = publishdao.GetPublish(data);

                let chachedfiles = [];
                for (let item of chacheddatas) {
                    let file = {
                        filename: item.filename,
                        filepath: item.filepath,
                        filemd5: item.filemd5,
                    }
                    chachedfiles.push(file);
                }

                let viewchached = {
                    deviceid: chacheddatas[0].deviceid,
                    viewid: chacheddatas[0].viewid,
                    mode: chacheddatas[0].mode,
                    viewversion: chacheddatas[0].viewversion,
                    files: chachedfiles
                }

                //publishdao.SavePublishCached(viewchached.deviceid, JSON.stringify(viewchached));
                response.Write(JSON.stringify(result));
            }
            this.GetPublishView = function (context) {
                let request = context.Request;
                let response = context.Response;
                response.StatusCode = 200;
                let requestdata = request.Form;
                let result = new GeneralResponse();
                let relatepath = "";



                let model = JSON.parse(requestdata.viewinfo);
                console.log("------------------------------------------");
                console.log("devicename:" + model.devicename);

                if (!model) {
                    response.Write(JSON.stringify(model));
                    return;
                }

                let chacheddata = null;
                //GetCached(model.viewid);
                console.log("chacheddata:" + chacheddata);

                if (chacheddata && chacheddata.viewversion == model.viewversion && chacheddata.viewid == model.viewid) {
                    let files = chacheddata.files;

                    let newfiles = [];
                    if (!model.files || model.files.length == 0) {
                        for (let file of files) {
                            let ext = file.substr(file.lastIndexOf(".")).toLowerCase();
                            if (ext === ".html")
                                relatepath = encodeURI(file.filepath);
                            let viewfile = {
                                filename: file.filename,
                                filepath: encodeURI(file.filepath),
                                filemd5: file.filemd5,
                                filestatus: 2
                            }
                            newfiles.push(viewfile);
                        }
                        model.files = JSON.stringify(newfiles);
                    }
                    else {
                        for (let file of files) {
                            let ext = file.substr(file.lastIndexOf(".")).toLowerCase();
                            if (ext === ".html")
                                relatepath = encodeURI(file.filepath);

                            for (let curfile of model.files) {
                                if (file.filename == curfile.filename && file.filemd5 != curfile.filemd5) {
                                    curfile.filemd5 = file.filemd5;
                                    curfile.filestatus = 1;
                                }
                            }
                        }
                    }
                    model.viewid = chacheddata.viewid;
                    model.viewversion = chacheddata.viewversion;
                    model.mode = chacheddata.mode;
                }
                else {

                    let querydata = {
                        viewid: model.viewid,
                        devicename: model.devicename,
                        deviceid: model.deviceid
                    }

                    let dao = new PublishDao();
                    let datas = dao.GetPublish(querydata);

                    console.log("datas:" + datas);
                    if (!datas || datas == null) {
                        response.Write(JSON.stringify(model));
                        return;
                    }

                    let jsondata = JSON.stringify(datas);
                    let jsonobject = JSON.parse(jsondata);
                    let newfiles = [];

                    console.log("jsonobject:" + jsonobject);
                    if (!jsonobject || jsonobject == "") {
                        response.Write(JSON.stringify(model));
                        return;
                    }

                    console.log("mode:" + jsonobject[0].mode);
                    console.log("mviewid:" + model.viewid);
                    console.log("jviewid:" + jsonobject[0].viewid);
                    if (jsonobject[0].mode == 0) {//在线模式
                        let args = [];
                        args.push(model.devicename);
                        args.push(jsonobject[0].querycode);
                        args.push("");
                        args.push(model.deviceid);
                        let publishresult = PublishView(args);
                        publishresult = JSON.parse(publishresult);

                        console.log("publishresult" + publishresult);

                        model.viewid = jsonobject[0].viewid;
                        model.viewversion = jsonobject[0].viewversion;
                        model.viewurl = publishresult.Tag;
                        model.mode = 0;
                        model.files = null;

                        response.Write(JSON.stringify(model));
                        return;
                    }

                    if ((!model.files) || (model.files.length == 0) || (model.viewid != jsonobject[0].viewid) || (model.viewversion != jsonobject[0].viewversion)) {
                        for (let file of jsonobject) {

                            console.log("fiel:" + file.filepath);
                            let ext = file.filename.substr(file.filename.lastIndexOf(".")).toLowerCase();
                            if (ext === ".html")
                                relatepath = file.filepath;
                            let viewfile = {
                                filename: file.filename,
                                filepath: encodeURI(file.filepath),
                                filemd5: file.filemd5,
                                filestatus: 2
                            }
                            newfiles.push(viewfile);
                        }
                        let json = JSON.stringify(newfiles);
                        model.files = JSON.parse(json);
                    }
                    else {
                        for (let file of jsonobject) {
                            let ext = file.filename.substr(file.filename.lastIndexOf(".")).toLowerCase();
                            if (ext === ".html")
                                relatepath = encodeURI(file.filepath);

                            let exist = false;
                            for (let curfile of model.files) {
                                if (file.filename == curfile.filename) {

                                    console.log("smd5:" + file.filemd5);
                                    console.log("cmd5:" + curfile.filemd5);

                                    if (model.viewversion == jsonobject[0].viewversion) {
                                        exist = true;
                                        if (file.filemd5 != curfile.filemd5) {
                                            curfile.filemd5 = file.filemd5;
                                            curfile.filename = file.filename;
                                            curfile.filepath = encodeURI(file.filepath);
                                            curfile.filestatus = 1;
                                        }
                                        else {
                                            curfile.filestatus = 0;
                                        }
                                    }
                                    else {
                                        curfile.filestatus = 2;
                                    }
                                }
                            }
                            if (!exist) {
                                curfile.filemd5 = file.filemd5;
                                curfile.filename = file.filename;
                                curfile.filepath = encodeURI(file.filepath);
                                curfile.filestatus = 2;
                            }
                        }
                    }

                    model.mode = jsonobject[0].mode;
                    model.viewid = jsonobject[0].viewid;
                    model.viewversion = jsonobject[0].viewversion;
                }

                model.viewserver = FILE_SERVER;
                model.viewurl = relatepath;

                response.Write(JSON.stringify(model));
            }


            this.LoadTerminals = function (context) {
                let request = context.Request;
                let response = context.Response;

                try {
                    let args = [];
                    let message = LoadTerminals(args);
                    let datas = JSON.parse(message);

                    let result = new GeneralResponse();
                    result.ErrorCode = 0;
                    result.Tag = datas;
                    result.Message = "获取成功";

                    response.Write(JSON.stringify(result));
                }
                catch (e) {
                    console.log(e.message);
                }
            }
        }
    }

    let self = new Object({
        Components: new ComponentsController(),
        Resources: new ResourcesController(),
        Views: new ViewsController(),
        Group: new GroupController(),
        Publish: new PublishController(),
        AddRoute: function (routes, httpMethod, controllerName, controllerObject, actionName, attachPrefixName) {
            if (!routes || !httpMethod || !controllerObject || !actionName) {
                throw new Error('System.ArgumentNullException');
            }
            if (attachPrefixName === undefined) {
                attachPrefixName = URIROUTE_SEGMENT_PREFIX;
            }
            if (attachPrefixName === null) {
                attachPrefixName = "";
            }
            if (!controllerName) {
                controllerName = "";
            }
            let segments = attachPrefixName + controllerName;
            do {
                if (typeof segments !== 'string') {
                    segments = "";
                }
                if (segments.length > 0 && segments.charAt(segments.length - 1) !== "/") {
                    segments = segments + "/";
                }
                segments = segments + actionName;
            } while (0, 0);
            routes.Add(httpMethod, segments, controllerObject[actionName]);
        },
        AddRoutes: function (routes, httpMethod, controllerName, controllerObject) {
            if (!routes || !httpMethod || !controllerName || !controllerObject) {
                throw new Error('System.ArgumentNullException');
            }
            for (let key in controllerObject) {
                self.AddRoute(routes, httpMethod, controllerName, controllerObject, key);
            }
        }
    });
    return self;
})();