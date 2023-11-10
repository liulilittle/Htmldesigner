'use strict'
//数据源
var QueueInfo = function () {

    var _self = this;
    var _data = {
        Enable: true,
        Id: 135035479,
        Name: '检验科',
        Queue: {
            CALLBACK: [],
            COMPLETED: [
                { CustomerName: "一千余", NextDepartName: '彩超二', State: 1 }
            ],
            DEFAULT: [
                { CustomerName: '一千余', EstimatedMinutes: 12, QueueIndex: 0 },
                { CustomerName: '测试', EstimatedMinutes: 12, QueueIndex: 1 },
                { CustomerName: '杜桥', EstimatedMinutes: 12, QueueIndex: 2 },
                { CustomerName: '任旭', EstimatedMinutes: 12, QueueIndex: 3 },
                { CustomerName: '谷', EstimatedMinutes: 12, QueueIndex: 4 },
                { CustomerName: '张三302', EstimatedMinutes: 12, QueueIndex: 5 },
                { CustomerName: '秋名山神王', EstimatedMinutes: 12, QueueIndex: 6 },
                { CustomerName: '李炜薇', EstimatedMinutes: 12, QueueIndex: 7 },
                { CustomerName: '李雅纯', EstimatedMinutes: 12, QueueIndex: 8 },
                { CustomerName: '潘婷', EstimatedMinutes: 12, QueueIndex: 9 },
            ]
        },
        Window: [
            { CustomerName: "一千余", DepartmentName: '检验科', }
        ]
    }
    this.Value = 0;
    this.DefaultList = [];
    this.List = Collection.New({}, []);
    this.Prompt = function () { }
    this.Medical = '';

    this.GetType = function () {
        var typeinfo = new Type();
        typeinfo.FullName = 'QueueInfo';
        typeinfo.References.push('HtmlControl.js');
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
        }];
        typeinfo.Methods = [{
            Name: 'GetType',
            Description: '获取当前实例的 Type 信息。',
        }];
        return typeinfo;
    }
    
    var SetValue = function () {
        _self.Value = _data.Name;
        _self.DefaultList.splice();
        var Medical = '';
        var Prompt = '';

        for (var i = 0; i < _data.Queue.DEFAULT.length; i++) {
            var list = _data.Queue.DEFAULT[i];
            var a = {};
            a.Index = list.QueueIndex + 1;
            a.Name = list.CustomerName;
            a.Time = list.EstimatedMinutes + '分钟';
            _self.DefaultList.push(a);
        }

        for (var i = 0; i < _data.Window.length; i++) {
            var list = _data.Window[i];
            Medical += list.CustomerName;
            Medical += '、';
        }
        Medical = Medical.substring(0, Medical.length - 1);
        _self.Medical = Medical;

        if (_data.Queue.COMPLETED.length > 0) {
            var info = _data.Queue.COMPLETED[0];
            switch (info.State) {
                case 1:
                    if (info.NextDepartName) {
                        Prompt = '贵宾' + info.CustomerName + '的下一个科室' + info.NextDepartName;
                    }
                    Prompt = '贵宾' + info.CustomerName + '的下一个科室';
                    break;
                case 2:
                    Prompt = '贵宾' + info.CustomerName + '，您已完成体检';
                    break;
                case 3:
                    Prompt = '贵宾' + info.CustomerName + '，您已经被体检';
                    break;
            }
        }
        _self.Prompt = Prompt;
    }
    !(function () {
        'use strict'

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

(function () {
    Type.References.Add('QueueInfo.js');
    Type.DefinedName('QueueInfo', 'QueueInfo');
    Type.DefinedFile('QueueInfo', 'QueueInfo.js');
    
    QueueInfo = new QueueInfo();
})();