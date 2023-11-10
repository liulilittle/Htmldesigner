'use strict'

var pWSClient = null;
var bRequestInitialed = false;
var Request = GetRequest();
var requestList = {
    TerminalManageControllerRequest: {
        'Linking': null,
    },
    PhysicalManageControllerRequest: {
        'Get': null, //获取单个科室排队信息
        'GetAll': null,
        'GetPause': null,
    },
    SystemConfigManageControllerRequest:{
         'TimeCorrection': null    //时间校准
        }
};
var responseList = {
    PhysicalLineStatusResponse: {
        'Handle': function (message, messageid) {
            console.log('response: ', message);
            if(message.Operation == 2) {
                UnBind();
            }
            if(message.Operation == 11) {
                UnBind();
            }
            if (message.Operation == 18) {
                QueueInfo.GetData(message.Content);
            }
           if(message.Operation == 19) {
               ServerMsg(message.Content.Message);
            }
            if(message.Operation == 25) {
                CleanUp(data.Content);
            }
        }
    }
};
var ScreenMaintenance = function () {
    var _customerTasks = new Object();
    this.windowCount = 3;
    this.addWather = function (customerId, windowNum) {
        _customerTasks[customerId] = new (function (customerId, windowNo) {
            var _iScheduleTimer = setTimeout(function () {
                $('#' + customerId).remove();
            }, 600000);
            this.Stop = function () {
                clearTimeout(_iScheduleTimer);
            }
            this.WindowNo = windowNo;
        })(customerId, windowNum)
    }
    this.removeWather = function (customerId) {
        var task = _customerTasks[customerId];
        if (task) {
            task.Stop();
            $('#' + customerId).remove();
        }
    }
    this.removeAll = function () {
        for (var key in _customerTasks) {
            _customerTasks[key].Stop();
        }
    }
};
var SpeechControlSystem = function () {
    var objList = [];
    var current = null;
    this.playAdd = function (str, msg) {
        console.log(msg);
        var obj = {};
        obj.str = str;
        obj.msg = msg;
        if (current == null) {
            current = msg;
            setTimeout(function () {
                current = null;
                for (var i = 0; i < objList.length; i++) {
                    var ob = objList[i];
                    objList.splice(i, 1);
                    SpeechControlSystem.playAdd(ob.str, ob.msg);
                    return;
                }
            }, 5000);
            try {
                physical.Recall(str, msg);// msg.CustomerName
            } catch (e) {
                console.log(e);
            }
        } else {
            objList.push(obj);
        }
    }
};
var QueueInfo = function () {
    'use strict'
    var _self = this;
    var _data = [];
    //var _data = {
    //    Enable: true,
    //    Id: 135035479,
    //    Name: '检验科',
    //    Queue: {
    //        CALLBACK: [],
    //        COMPLETED: [
    //            { CustomerName: "一千余", NextDepartName: '彩超二', State: 1 }
    //        ],
    //        DEFAULT: [
    //            { CustomerName: '一千余', EstimatedMinutes: 12, QueueIndex: 0 },
    //            { CustomerName: '测试', EstimatedMinutes: 12, QueueIndex: 1 },
    //            { CustomerName: '杜桥', EstimatedMinutes: 12, QueueIndex: 2 },
    //            { CustomerName: '任旭', EstimatedMinutes: 12, QueueIndex: 3 },
    //            { CustomerName: '谷', EstimatedMinutes: 12, QueueIndex: 4 },
    //            { CustomerName: '张三302', EstimatedMinutes: 12, QueueIndex: 5 },
    //            { CustomerName: '秋名山神王', EstimatedMinutes: 12, QueueIndex: 6 },
    //            { CustomerName: '李炜薇', EstimatedMinutes: 12, QueueIndex: 7 },
    //            { CustomerName: '李雅纯', EstimatedMinutes: 12, QueueInDateTimedex: 8 },
    //            { CustomerName: '潘婷', EstimatedMinutes: 12, QueueIndex: 9 }
    //        ]
    //    },
    //    Window: [
    //        { CustomerName: "一千余", DepartmentName: '检验科', }
    //    ]
    //}
    this.Value = '';        //科室名
    this.DefaultList = [];  //正在体检的集合
    this.List = Collection.New({}, []);
    this.Prompt = '';   //诊结完成提示
    this.Medical = '';  //正在体检的人
    this.YTD = '';//年月日
    this.Week = '';//星期
    this.Time = '';//时间
    this.DateTime = '';
    this.GetType = function () {
        'use strict'

        var typeinfo = new Type();
        typeinfo.FullName = 'QueueInfo';
        typeinfo.References.push('HtmlControl.js');
        typeinfo.References.push('System/Assembly.js');
        typeinfo.References.push('System/Net/WebSocketClient.js');
        typeinfo.References.push('QueueInfo.js');
        // typeinfo.References.push('vconsole.min.js');
        typeinfo.Properties = [{
            Name: 'Value',
            PropertyType: 'string',
            Readable: true,
            Writeable: true,
            Browsable: true,
            Description: '获取与此数据源关联的文本。',
            Accessor: 'function',
        }, {
            Name: 'DefaultList',
            PropertyType: 'Array',
            Readable: true,
            Writeable: true,
            Browsable: true,
            Description: '获取与此数据源关联的列表集合。',
            Accessor: 'function',
        }, {
            Name: 'Prompt',
            PropertyType: 'string',
            Readable: true,
            Writeable: true,
            Browsable: true,
            Description: '获取与此数据源关联的提示信息。',
            Accessor: 'function',
        }, {
            Name: 'Medical',
            PropertyType: 'string',
            Readable: true,
            Writeable: true,
            Browsable: true,
            Description: '获取与此数据源关联的正在体检的人。',
            Accessor: 'function',
        }, {
            Name: 'Time',
            PropertyType: 'string',
            Readable: true,
            Writeable: true,
            Browsable: true,
            Description: '获取与此数据源关联的时间。',
            Accessor: 'function',
            },{
                Name: 'YTD',
                PropertyType: 'string',
                Readable: true,
                Writeable: true,
                Browsable: true,
                Description: '获取与此数据源关联的年月日。',
                Accessor: 'function',
            },{
                Name: 'Week',
                PropertyType: 'string',
                Readable: true,
                Writeable: true,
                Browsable: true,
                Description: '获取与此数据源关联的星期。',
                Accessor: 'function',
            }, {
                Name: 'DateTime',
                PropertyType: 'string',
                Readable: true,
                Writeable: true,
                Browsable: true,
                Description: '获取与此数据源关联的时间。',
                Accessor: 'function',
            }];
        typeinfo.Methods = [{
            Name: 'GetType',
            Description: '获取当前实例的 Type 信息。',
        }];
        return typeinfo;
    }

    this.GetData = function () {
        'use strict'
        if (arguments.length > 0) {
            _data = arguments[0];
            SetValue();
        } else {
            requestList.PhysicalManageControllerRequest.Get({
                'DepartmentId': Request.DepartId
            }, function (errno, response) {
                var self = this.GetWebSocket();
                console.log(response)
                if (self.ERROR_NO == errno) {
                    if (response.ErrorCode == 0) {
                        console.log(response.Message)
                        _data = response.Tag;
                        SetValue();
                    }
                } else {
                    console.error('timeout');
                }
            }, 10);
        }
        GetTime();
    }
    var SetValue = function () {
        'use strict'
        if (_data.length <= 0) {
            return;
        }
        var count = _self.DefaultList.length;
        _self.Value = _data.Name;
        _self.DefaultList.splice(0, count);
        var Medical = '';
        var Prompt = '';

        for (var i = 0; i < _data.Queue.DEFAULT.length; i++) {
            var list = _data.Queue.DEFAULT[i];
            var a = {};
            a.Index = list.QueueIndex + 1;
            a.Name = list.CustomerName;
            a.Time = list.EstimatedMinutes;
            _self.DefaultList.push(a);
        }

        for (var i = 0; i < _data.Window.length; i++) {
            var list = _data.Window[i];
            if (list.CustomerName) {
                Medical += list.CustomerName;
                Medical += '、';
            }
        }
        Medical = Medical.substring(0, Medical.length - 1);
        _self.Medical = Medical;

        if (_data.Queue.COMPLETED.length > 0) {
            var info = _data.Queue.COMPLETED[_data.Queue.COMPLETED.length-1];
            switch (info.State) {
                case 1:
                    if (info.NextDepartName) {
                        Prompt = '贵宾 ' + info.CustomerName + ' 的下一个科室 ' + info.NextDepartName;
                    } else {
                        Prompt = '贵宾 ' + info.CustomerName + ' 的下一个科室';
                    }
                    break;
                case 2:
                    Prompt = '贵宾 ' + info.CustomerName + '，您已完成体检';
                    break;
                case 3:
                    Prompt = '贵宾 ' + info.CustomerName + '，您已经被暂停体检';
                    break;
            } 
        }
        _self.Prompt = Prompt;
    }
    !(function () {
        'use strict'

        LoadWebSocket(Request.WSServer);
        SetValue();
    })();
    //setInterval(function (self) {
    //    var current = Number(self.Value);
    //    if (isNaN(current)) {
    //        current = 0;
    //    }

    //    Object.SetPropertyValue(self, 'Value', current + 1);
    //}, 10, this);
};

!(function () {
    Type.DefinedName('QueueInfo', 'QueueInfo');
    Type.DefinedFile('QueueInfo', 'QueueInfo.js');
    
    QueueInfo = new QueueInfo();
    SpeechControlSystem = new SpeechControlSystem();
    ScreenMaintenance = new ScreenMaintenance();
   // var VConsole = new VConsole();
    setInterval(function () { GetTime(); },10000)
})();

function LoadWebSocket(str) {
    if (str == undefined || str == '')
        return;
    if (!pWSClient) {
        pWSClient = new WebSocketMvcClient();
    }
    pWSClient.CloseConnection();
    pWSClient.ConnectAsync(str, '/', function (errno, count) {
        var self = (this || daemon);
        switch (errno) { 
            case self.ERROR_CONNECTED: //链接
                var monitor = pWSClient.Monitor;
                monitor.startOfflineMonitor("SystemController", "BeatHeart", 3, 3, {
                    token: '?', // 可以是方法或者不为空的数据
                }, function () {
                    self.GetApplication().Shutdown(); // 与服务器失去连接
                    monitor.stopOfflineMonitor();
                });
                OnConnected(self);
                break;
            case self.ERROR_RETRYCONNECT://重试链接
                //RetryConnection(count);
                console.log('连接已断开,正在尝试第' + count + '次重新连接服务器');
                break;
            case self.ERROR_CONNECTING://正在连接  第一次链接服务器
                console.log('正在连接服务器');
                break;
            case self.ERROR_DISCONNECT://断开连接
                //Disconnect(count);
                break;
            case self.ERROR_IO_PINDING://异步链接 
                break;
        }
    }, 3000);
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
}

function OnConnected(self) {
    if (!bRequestInitialed) {
        bRequestInitialed = true;
        var mvca = self.GetApplication();
        mvca.Controllers.Request.Add('TerminalController', requestList.TerminalManageControllerRequest);
        mvca.Controllers.Request.Add('QueueController', requestList.PhysicalManageControllerRequest);
        mvca.Controllers.Request.Add('SystemController', requestList.SystemConfigManageControllerRequest);
        mvca.Controllers.Response.Add('SubscribeController', responseList.PhysicalLineStatusResponse);
    }

    try {
        ServerLinking(Request.TerminalCode, Request.DeviceType);
    } catch (e) { }
}
function ServerLinking(TerminalCode, DeviceType) {
    requestList.TerminalManageControllerRequest.Linking({
        'TerminalId': TerminalCode,
        'DeviceType': DeviceType,
    }, function (errno, response) {
        var self = this.GetWebSocket();
        if (self.ERROR_NO == errno) {
            console.log(response);
            QueueInfo.GetData();
        } else {
            console.error('timeout');
        }
    }, 10);
}
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串  
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
       str = str.replace('?','&');
        str = str.split("&");
        for (var i = 0; i < str.length; i++) {
            theRequest[str[i].split("=")[0]] = unescape(str[i].split("=")[1]);
        }
    }
    return theRequest;
}
function GetTime() {
    requestList.SystemConfigManageControllerRequest.TimeCorrection({
    }, function (errno, response) {
        var self = this.GetWebSocket();
        if (self.ERROR_NO == errno) {
           CurentTime(response);
        } else {
            console.error('timeout');
            $('.next-hint-box').html("网络超时！");
        }
    }, 5);
}
function UnBind() {
    physical.unbind();
};
function CleanUp(id) {
        lastUserList[id].is = true;
        ScreenMaintenance.removeWather(id);
};
function ServerMsg(msg) {
    console.log(msg);
    SpeechControlSystem.playAdd(QueueInfo.Value, msg.CustomerName);
};
function CurentTime(response) {
    var now = new Date(response);
    var Week = ['日', '一', '二', '三', '四', '五', '六'];
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日
    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
    var clock = year + "-";
    if (month < 10)
        clock += "0";
    clock += month + "-";

    if (day < 10)
        clock += "0";
    clock += day + " ";
    QueueInfo.YTD = clock;
    QueueInfo.Week = " 星期" + Week[now.getDay()];
    var _time = '';
    if (hh < 10)
        _time += "0";

    _time += hh + ":";
    if (mm < 10) _time += '0';
    _time += mm;
    QueueInfo.Time = _time;
};