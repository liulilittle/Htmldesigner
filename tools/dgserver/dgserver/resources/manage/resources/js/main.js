var txt = {
    'home_home': "请输入科室名称",
    'Medical_MedicalRegister': '请输入姓名/体检编号',
    'Facility_FacilityManage': '请输入设备名称',
    'SystemSettings_TestItemMage': '请输入项目名称/所属科室',
    'SystemSettings_DepartmentMage': '请输入科室名称/科室区域',
    'SystemSettings_UserMage': '请输入姓名'
};

var obj = {
    type: "layerFadeIn",
    title: "温馨提示",
    close: "true",
    content: "登记成功",
    delay: 1000
};

function addWTabs(id, url, state) {
    if (state) {
        $("#tabs-nav>li, .tab-pane ").removeClass("active");
    }
    var content = "";
    //如果TAB不存在，则新增
    if (!$("#Frame_" + id)[0]) {
        //iframe添加内容
        content = '<li role="tabpanel" class="tab-pane" id="' + id + '">' +
            '<iframe src="' + url + '" id="Frame_' + id + '" frameborder="no" width="100%" allowtransparency="yes">' +
            '</iframe></li>';
        $(".tab-content").append(content);
    }

    //激活当前选项
    if (state) {
        $("#tab_" + id).addClass('active');
        $("#" + id).addClass('active');
        if (id == 'SystemSettings_QueueSetting') {
            $("#search").hide();
        } else {
            $("#search").val("").show().attr('placeholder', txt[id]);
            $("#search").next().next().hide();
            $(".typeahead").hide();
        }
    }
    
    return $('#Frame_' + id).get(0);
};

function SortProject(list) {  //项目排序
    var NoList = [];
    var IngList = [];
    var WaitList = [];
    var ComList = [];
    var DeletList = [];
    var PauseList = [];
    var ProjectPauseList = [];
    for (var i = 0; i < list.length; i++) {
        switch (list[i].State) {
            case 0:
                NoList.push(list[i]);
                break;
            case 1:
                IngList.push(list[i]);
                break;
            case 2:
                ComList.push(list[i]);
                break;
            case 3:
                PauseList.push(list[i]);
                break;
            case 4:
                DeletList.push(list[i]);
                break;
            case 5:
                WaitList.push(list[i])
                break;
            case 6:
                ProjectPauseList.push(list[i])
                break;
        }
    }
    var a = IngList.concat(WaitList);
    var b = a.concat(ProjectPauseList);
    var c = b.concat(NoList);
    var d = c.concat(PauseList); 
    var e = d.concat(ComList); 
    var f = e.concat(DeletList); 
    return f;
}

function invokeMethod(iframe, method, data, callback) {
    var invoke = function () {
        var obj = iframe.contentWindow[method](data);
        if (callback) {
            callback(obj);
        }
    }
    try {
        invoke()
    } catch (e) {
        try {
            $(iframe).bind('load', invoke);
        } catch (e) {
            try {
                attachEvent(iframe, 'load', invoke);
            } catch (e) {
                iframe.onload = invoke;
            }
        }
    }
};
function invk(frameid, methodname) {
    var f = document.getElementById(frameid);
    do {
        if (!f)
            break;
        var w = f.contentWindow;
        if (!w)
            break;
        try {
            w[methodname]();
        } catch (e) {
            console.error(e);
        }
    } while (false);
};

function setLocal(key, val) {  //localStorage
    if ((typeof val).toLocaleLowerCase() == "object") {
        val = JSON.stringify(val);
    }
    localStorage.setItem(key, val);
};

function PromptBox(txt) { //提示消息
    obj.content = txt;
    method.msg_layer(obj);
};

function ObjLen(obj) { //统计object长度
    var count = 0;
    for (var key in obj) {
        count++;
    }
    return count;
};


var gettype = Object.prototype.toString;
var utility = {   //判断数组对象
    isObj: function (o) {
        return gettype.call(o) == "[object Object]";
    },
    isArray: function (o) {
        return gettype.call(o) == "[object Array]";
    }
};

function deepClone(data) { //深拷贝
    var obj;
    var type;
    if (utility.isArray(data)) {
        type = "array";
        obj = [];
    } else if (utility.isObj(data)) {
        type = "object";
        obj = {};
    } else {
        return data;
    }
    if (type === 'array') {
        for (var i = 0, len = data.length; i < len; i++) {
            obj.push(deepClone(data[i]));
        }
    } else if (type === 'object') {
        for (var key in data) {
            obj[key] = deepClone(data[key]);
        }
    }
    return obj;
};

function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }
    return theRequest;
};

//表格展开、折叠
$(document).on("click", '.ellipsis', function () {
    var shape = $(this).css("white-space");
    if (shape == "nowrap") {
        $(this).css({
            "overflow": '',
            'white-space': "inherit"
        })
    } else {
        $(this).css({
            "overflow": 'hidden',
            'white-space': "nowrap"
        })
    }
});

//打印
function InvicePrint(data) {
    var obj = {};
    //obj.qRCodeContent = 'http://weixin.qq.com/r/sClkfHPEIC5frTcf93yi';
    obj.qRCodeContent = 'http://weixin.qq.com/r/Gy00LKfEj-rwreNP93gJ&actionType=noneAction&codeType=qr';
    obj.peopleName = data.CustomerName;
    obj.peopleSex = SexToggle(data.CustomerSex);
    LineInfo(obj, data.CurrentDepartmentId, data.ExamId)
    Perview(obj)
}
function SexToggle(sex) {   //性别
    switch (sex) {
        case 0:
            return '女';
        case 1:
            return '男';
        default:
            return '';
    }
}
function LineInfo(obj, DepartmentId, ExamId) { //获取排队信息
    obj.departmentName = '';
    obj.expectedWaitTime = '';
    obj.waitingPeopleNumber = '';
    if (DepartmentId == 'undefined' || !InfoCacheList.DepartManageList[DepartmentId]) {
        return false;
    }

    var DepartWindow = InfoCacheList.PhysicalLineList[DepartmentId];
    if (InfoCacheList.DepartManageList[DepartmentId]) {
        obj.departmentName = InfoCacheList.DepartManageList[DepartmentId].DepartmentName;
    }

    if (DepartWindow.Window.length) {
        $.each(DepartWindow.Window, function (i, data) {
            if (data.ExamNo == ExamId) {
                obj.expectedWaitTime = 0;
                obj.waitingPeopleNumber = 0;
                return;
            }
        })
    }

    if (DepartWindow.Queue.DEFAULT.length) {
        $.each(DepartWindow.Queue.DEFAULT, function (i, data) {
            if (data.ExamNo == ExamId) {
                obj.expectedWaitTime = data.EstimatedMinutes;
                obj.waitingPeopleNumber = data.QueueIndex + 1;
            }
        })
    }
}
function Perview(obj) {
    try {
        window.external.receiptprint(obj.departmentName, Number(obj.expectedWaitTime), obj.peopleName, obj.peopleSex, Number(obj.waitingPeopleNumber), obj.qRCodeContent);
    } catch (e) { }
}

function ObjConversionArr(data) {   //对象转化成数组
    var arr = [];
    for (var key in data) {
        arr.push(data[key])
    }
    return arr
}


//ajax请求
var xhr = function ($url, $type, $data, $success, $onerror) {
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
            if (buffer.ErrorCode == 0) {
                if ($success == undefined || $success == null) {
                    return;
                }
                $success(buffer);
            } else {
                method.msg_layer({
                    title: "温馨提示",
                    close: "true",
                    content: buffer.Message,
                    delay: 1500
                });
            }
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