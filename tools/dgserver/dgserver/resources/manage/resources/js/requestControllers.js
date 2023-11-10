var bRequestInitialed = false;
var pWSClient = null;
var isLoadCache = true;

var requestList = {
    TerminalControllerRequest: {
        'TrunOnOffScreen': null,        //终端开关机
        'TrunOnOff': null,              //终端开关屏
        'VoiceSet': null,               //终端音量设置
        'ViewPulish': null,             //界面发布
        'GetAll': null,                 //获取所有终端
        'Remove': null,                 //删除终端
        'Add': null,                    //添加终端
        'Update': null,                 //修改备注
    },
    DesignerControllerRequest: {
        'Linking': null,                //设计器链接
    }
};

var responseList = {
    SubscribeControllerResponse: {
        'Handle': function (message, messageid) {
            console.log('response: ', message, messageid);
            switch (message.Operation) {
                case 34:
                    if (InfoCacheList.TerminaList[message.AggregateId]) {
                        InfoCacheList.TerminaList[message.AggregateId] = message.Content;
                        invokeMethod($('#Frame_Terminal')[0], 'RefreshData', { state: true, row: message.Content});
                    }
            }
        }
    }
};

function LoadWebSocket(server) {
    if (!pWSClient) {
        pWSClient = new WebSocketMvcClient();
    }
    pWSClient.CloseConnection();
    pWSClient.ConnectAsync(server, '/', function (errno, count) {
        try {
            var _self = this;
            switch (errno) {
                case _self.ERROR_CONNECTED: //链接
                    var monitor = pWSClient.Monitor;
                    monitor.startOfflineMonitor("SystemController", "BeatHeart", 3, 3, {
                        token: '?', // 可以是方法或者不为空的数据
                    }, function () {
                        _self.GetApplication().Shutdown(); // 与服务器失去连接
                        monitor.stopOfflineMonitor();
                    });
                    OnConnected(_self, count);
                    break;
                case _self.ERROR_RETRYCONNECT://重试链接
                    RetryConnection(count);
                    //$(".login-box").show();
                    //$(".index-box").hide();
                    //$('#w-tab').hide();
                    //if (window.external.setWindowState) {
                    //    window.external.setWindowProperty("width", 1000);
                    //    window.external.setWindowProperty("height", 600);
                    //}
                    break;
                case _self.ERROR_CONNECTING://正在连接  第一次链接服务器
                    console.log('正在连接服务器');
                    break;
                case _self.ERROR_DISCONNECT://断开连接
                    Disconnect(count);
                    break;
                case _self.ERROR_IO_PINDING://异步链接 
                    break;
            }
        } catch (e) {
            console.log(e);
        }
    }, 10);
    if (!pWSClient.Monitor) {
        pWSClient.Monitor = new (function (mvcc) {
            var _self = this;
            var _startOffline_HeartbeatSchedule = null;
            var _startOffline_IsOnLine = false;
            this.startOfflineMonitor = function (typeid, methodid, interval, timeout, checkdata, offline) {
                if (!(offline &&
                    typeof offline === 'function' &&
                    Number(interval) > 0 &&
                    Number(timeout) > 0) &&
                    checkdata) {
                    throw new "system::ArgumentNullException";
                }
                if (_startOffline_HeartbeatSchedule === null) {
                    var onoffline = function () {
                        if (_startOffline_IsOnLine || mvcc.Available()) {
                            _startOffline_IsOnLine = false;
                            _self.stopOfflineMonitor();
                            offline(mvcc);
                        }
                    }
                    _startOffline_HeartbeatSchedule = setInterval(function () {
                        if (!mvcc.
                            GetApplication().
                            TryInvoke(typeid,
                            methodid,
                            (typeof checkdata === 'function' ? checkdata() : checkdata),
                            function (ws, errno, message) {
                                if (errno === ws.ERROR_NO)
                                    _startOffline_IsOnLine = true;
                                else
                                    onoffline();
                            }, timeout)) {
                            onoffline();
                        }
                    }, (interval * 1000));
                    return true;
                }
                return false;
            }

            this.stopOfflineMonitor = function () {
                if (_startOffline_HeartbeatSchedule !== null) {
                    clearInterval(_startOffline_HeartbeatSchedule);
                    _startOffline_HeartbeatSchedule = null;
                    _startOffline_IsOnLine = false;
                }
            }
        })(pWSClient);
    }
};
function OnConnected(_self) {
    LinkInfo('服务器连接成功!', 0);
    LoadingHeid('服务器连接成功!');
    if (bRequestInitialed && isLoading) {
        LoadCache(requestList, isLoadCache);
    }
    if (!bRequestInitialed) {
        bRequestInitialed = true;
        var _mvca = _self.GetApplication();
        _mvca.Controllers.Request.Add('TerminalController', requestList.TerminalControllerRequest);
        _mvca.Controllers.Request.Add('DesignerController', requestList.DesignerControllerRequest);
        _mvca.Controllers.Response.Add('SubscribeController', responseList.SubscribeControllerResponse);
        _mvca.Controllers.Request.Sinker = function (typeid, methodid, errno, message) {
            if (errno == 1) {
                //UserLoagin();
            }
        }
    }
};
function RetryConnection(count) {
    LinkInfo('服务器连接已断开! 正在尝试第' + count + '次...重新连接服务器', 1)
    isLoadCache = false;
};
function Disconnect(count) {
    //LinkInfo('服务器连接已断开!',1);
    isRefresh = false;
};



//缓存数据
var InfoCacheList = {
    TerminaList: null
};
var againTime = 3;
var isLoading = false;
var isRefresh = false;
var isLoadHome = false;
function LoadCache() {
    if (!isLoading)
        return;
    isLoadCache = true;
    LoadingPrompt('正在获取终端信息!');
    Linking(0);
};
function Linking(temp, state) {
    if (state == undefined || state === null) {
        state = true;
    }
    if (requestList.DesignerControllerRequest.Linking == null || requestList.DesignerControllerRequest.Linking == undefined) {
        PromptTxt('连接已断开,无法链接到服务器!');
        return
    }
    requestList.DesignerControllerRequest.Linking({
    }, function (errno, response) {
        console.log(errno, response);
        var self = this.GetWebSocket();
        if (self.ERROR_NO == errno) {
            if (response.ErrorCode == 0) {
                LoadingPrompt('正在获取终端信息...');
                if (state)
                    setTimeout('TerminalGetAll(0)', 100);
            }
        } else {
            console.error('timeout');
            if (temp == againTime) {
                PromptTxt('无法链接到服务器!');
                return;
            }
            temp += 1;
            LoadingPrompt('第' + temp + '次重新链接!');
        }
    }, 3);
}
function TerminalGetAll(temp, state) {
    if (state == undefined || state === null) {
        state = true;
    }
    if (requestList.TerminalControllerRequest.GetAll == null || requestList.TerminalControllerRequest.GetAll == undefined) {
        PromptTxt('连接已断开,无法获取终端信息!');
        return
    }
    requestList.TerminalControllerRequest.GetAll({
    }, function (errno, response) {
        console.log(errno, response);
        var self = this.GetWebSocket();
        if (self.ERROR_NO == errno) {
            if (response.ErrorCode == 0) {
                InfoCacheList.TerminaList = response.Tag;
            }
            setTimeout('loging()', 500);
            if (!isLoadHome) {
                addWTabs('Terminal', 'Terminal.html', true);
                isLoadHome = true;
            }
            if (isRefresh) {
                RefreshAllPage();
            }
        } else {
            console.error('timeout');
            if (temp == againTime) {
                PromptTxt('无法获取终端信息!');
                return;
            }
            temp += 1;
            LoadingPrompt('第' + temp + '次重新获取终端信息!');
        }
    }, 3);
}

function PromptTxt(txt) {
    LoadingPrompt(txt);
    LoadingHeid(txt);
    if (isRefresh)
        PromptBox(txt);
};

//刷新数据
function RefreshAllPage() {
    var iframes = $("iframe[id=Frame_Terminal]");
    for (var i = 0; i < iframes.length; i++) {
        invk(iframes[i].id, 'RefreshData');
        invk(iframes[i].id, 'LoadTempList');
    }
    if (isRefresh) {
        isRefresh = false;
        PromptBox("刷新数据成功！");
    }
};