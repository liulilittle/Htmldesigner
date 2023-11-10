'use strict'

var MediaBox = function (options) {
    'use strict'

    this.constructor = MediaBox;

    var _super = {
        Text: this.Text,
        Dispose: this.Dispose,
    };

	var _self = this;
	var _typeinfo = null;
    var _container = $(_self.DOM());
    var _mediaitems = MediaBoxItemCollection.New(_self);
    var _mediaBox = null;
	var _media = null;
    var _eventset = this.EventSet;
    var _isloopplay = false;
    var _disposed = false;
    var _index = -1;
    var timer = null;
    var _scheduler = new (function Scheduler() {
        var _audio = null;
        var _checknontimeout = function (playmediaitem) {
            'use strict'

            if (!playmediaitem) {
                return false;
            }
            var getattr = Object.GetPropertyValue;

            var nowtime = Number(new Date());
            var begintime = getattr(playmediaitem, "StartTime");
            var endtime = getattr(playmediaitem, "EndTime");

            if (_isloopplay) {
                var d = new Date();
                var nowdate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
                var arr1 = begintime.split(' ');
                var arr2 = endtime.split(' ');
                arr1[0] = arr2[0] = nowdate;
                begintime = arr1.join(' ');
                endtime = arr2.join(' ');
            }

            begintime = Number(new Date(begintime));
            endtime = Number(new Date(endtime));

            // check一个周期
            return nowtime >= begintime && nowtime < endtime;
        }
        var _checkaudio = function (playmediaitem) {
            'use strict'

            if (!playmediaitem) {
                return false;
            }
            var getattr = Object.GetPropertyValue;
            var audioname = getattr(playmediaitem, "Audio");

            if (audioname) {
                if (audioname != _audio) {
                    _audio = audioname;
                    _mediaBox.find('audio').remove();
                    _mediaBox.append('<audio src="' + _audio + '" autoplay loop>您的浏览器不支持 audio 元素。</audio>')
                }
            } else {
                _mediaBox.find('audio').remove();
            }
        }
        var _timer = setInterval(function () {
            var getattr = Object.GetPropertyValue;
            var count = getattr(_mediaitems, 'Count');
            do {
                var currplaymediaitem = _self.PlayMediaItem();
                var preparemediaitem = null;
                do {
                    var now = new Date();
                    _checkaudio(currplaymediaitem);
                    if (_checknontimeout(currplaymediaitem)) {
                        preparemediaitem = currplaymediaitem;
                        break;
                    }
                    for (var i = 0; i < count; i++) {
                        var currentmediaitem = _mediaitems.Get(i);
                        if (!currentmediaitem) {
                            continue;
                        }
                        if (_checknontimeout(currentmediaitem)) {
                            preparemediaitem = currentmediaitem;
                            break;
                        }
                    }
                } while (0, 0);
                if (preparemediaitem !== currplaymediaitem) {
                    // 切换播放的媒体节目
                    _mediaBox.children().remove();
                    if (preparemediaitem) {
                        _index = preparemediaitem.Index;
                        _mediaBox.children().remove();
                        if (/.(gif|jpg|jpeg|png|bmp)$/.test(preparemediaitem.Name())) {
                            _mediaBox.append('<img width="100%" height="100%" src="' + preparemediaitem.File() + '"/>');
                            if (preparemediaitem.Audio()) {
                                _audio = preparemediaitem.Audio();
                                _mediaBox.append('<audio src="' + _audio +'" autoplay loop>您的浏览器不支持 audio 元素。</audio>')
                            }
                        }
                        if (/.(mp4|mkv|avi|rm|rmvb|flv)$/.test(preparemediaitem.Name())) {
                            _mediaBox.append('<video width="100%" height="100%" src="' + preparemediaitem.File() + '" muted="true" loop autoplay></video>');
                            if (preparemediaitem.Audio()) {
                                _audio = preparemediaitem.Audio();
                                _mediaBox.append('<audio src="' + _audio + '" autoplay loop>您的浏览器不支持 audio 元素。</audio>')
                            }
                        }  
                    }
                }
                
            } while (0, 0);
        }, 300);
        this.Stop = function () {
            clearInterval(_timer);
        }
    });
	this.EventSet = _eventset;
	this.GetType = function () { // override
		if (_typeinfo == null) {
			_typeinfo = MediaBox.prototype.GetType();
		}
		return _typeinfo;
	};
    this.PlayMediaIndex = function () {
        'use strict'

        var getattr = Object.GetPropertyValue;
        var count = getattr(_mediaitems, 'Count');
        if (count <= 0) {
            _index = -1;
        }
        else if (_index > count) {
            _index = count - 1;
        }
        return _index;
    };
    this.PlayMediaItem = function () {
        'use strict'

        var index = _self.PlayMediaIndex();
        if (index < 0) {
            return null;
        }
        var item = _mediaitems.Get(index);
        return item === undefined ? null : item;
    };
    this.Media = function () {
		'use strict'

        if (arguments.length <= 0) {
            return _media[0].src;
		}

		_media[0].src = arguments[0];
	};
	this.Dispose = function () {
        if (!_disposed) {
            _scheduler.Stop();
			_self.Parent(null);
			$(_container).remove();
		}
		_disposed = true;
    };
    this.ISLoopPlay = function () {

        if (arguments.length <= 0) {
            return _isloopplay;
        }

        _isloopplay = arguments[0];
    };
    this.Update = function () {
        'use strict'

        if (arguments.length <= 0) {
            return;
        }

        var i = arguments[0];
        if (i == _index) {
            _index = -1;
        }

        if (i > _index) {
            return;
        }

        if (i < _index) {
            _index = _index - 1;
        }
    };

    Object.defineProperty(this, 'Items', {
        get: function () {
            return _mediaitems;
        }
    });

	!(function () {
		'use strict'

        _mediaBox = $("<div></div>");
        _container.append(_mediaBox);
		HtmlControl.Initialization(_self, HtmlControl.defaults, options);
	})()
}

MediaBox.EventSet = function () {
    'use strict'

    Object.Merge(this, HtmlControl.EventSet);

    this.Click = 'Click';
};

!(function () {
	MediaBox.EventSet = new MediaBox.EventSet();
	var eventset = MediaBox.EventSet;
})();


MediaBox.prototype.GetType = function () {
   // var type = new Type();
    var type = HtmlControl.prototype.GetType();
	type.References.push('MediaBox.js');
	type.FullName = Type.GetName(MediaBox);

	type.Methods = [{
		Name: 'GetType',
		Description: '获取当前实例的 Type (RTTI)信息。',
	}, {
		Name: 'Dispose',
		Description: '释放由 MediaBox 使用的所有资源。（继承自 MediaBox。）',
	}];

	type.Properties = [{
		Name: 'Name',
		PropertyType: 'string',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: true,
		Description: '获取或设置视图的名称。',
		Accessor: 'property',
	}, {
		Name: 'IsDisposed',
		PropertyType: 'boolean',
		Readable: true,
		Writeable: false,
		Browsable: false,
		DataBind: false,
		Description: '获取一个值，该值指示视图是否已经被释放。',
		Accessor: 'function',
	}, {
		Name: 'Tag',
		PropertyType: 'object',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: true,
		Description: '获取或设置包含有关视图的数据的对象。',
		Accessor: 'property',
	}, {
		Name: 'DOM',
		PropertyType: 'HtmlElement',
		Readable: true,
		Writeable: false,
		Browsable: false,
		DataBind: false,
		Description: '获取视图的DOM元素容器。',
		Accessor: 'function',
	}, {
		Name: 'Expression',
		PropertyType: 'string',
		Readable: true,
		Writeable: false,
		Browsable: false,
		DataBind: false,
		Description: '计算访问到此视图的代码表达式（调用链路径）。',
		Accessor: 'property',
	},{
		Name: 'Width',
		PropertyType: 'number',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: true,
		Description: '获取或设置视图的宽度。',
		Accessor: 'property',
	}, {
		Name: 'Height',
		PropertyType: 'number',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: true,
		Description: '获取或设置视图的高度。',
		Accessor: 'property',
	}, {
		Name: 'Top',
		PropertyType: 'number',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: true,
		Description: '获取或设置控件上边缘与其容器的工作区上边缘之间的距离。',
		Accessor: 'property',
	}, {
		Name: 'Left',
		PropertyType: 'number',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: true,
		Description: '获取或设置控件左边缘与其容器的工作区左边缘之间的距离。',
		Accessor: 'property',
	}, {
		Name: 'Visible',
		PropertyType: 'boolean',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: false,
		Description: '获取或设置一个值，该值指示是否显示该控件及其所有子控件。',
		Accessor: 'function',
	}, {
		Name: 'Dock',
		PropertyType: 'number,DockStyle,select',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: false,
		Description: '获取或设置哪些控件边框停靠到其父控件并确定控件如何随其父级一起调整大小。',
		Accessor: 'function',
	}, {
		Name: 'TabIndex',
		PropertyType: 'number',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: false,
		Description: '获取或设置控件在其容器内的 Tab 键顺序。',
		Accessor: 'function',
	}, {
		Name: 'ZIndex',
		PropertyType: 'number',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: false,
		Description: '获取或设置的 Z 序列。',
		Accessor: 'function'
    },{
		Name: 'Parent',
		PropertyType: 'HtmlControl,HtmlView',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: false,
		Description: '获取或设置控件的父容器。',
		Accessor: 'function'
    },{
		Name: 'Opacity',
		PropertyType: 'number',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: false,
		Description: '获取或设置控件的不透明度级别。',
		Accessor: 'function',
    }, {
        Name: 'Rotate',
        PropertyType: 'number',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置控件的旋转角度（deg）。',
        Accessor: 'function'
    }, {
        Name: 'BackgroundImage',
        PropertyType: 'Uri,Image,string',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: true,
        Description: '获取或设置在视图中显示的背景图像。（继承自 HtmlView。）',
        Accessor: 'function',
    }, {
        Name: 'BackgroundImageLayout',
        PropertyType: 'number',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置在 ImageLayout 枚举中定义的背景图像布局。（继承自 HtmlView。）',
        Accessor: 'function',
    }, {
        Name: 'BackColor',
        PropertyType: 'Color',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置视图的背景色。',
        Accessor: 'function',
    }, {
		Name: 'Items',
        PropertyType: 'Collection,ItemsControlCollection',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: true,
		Description: '获取和设置控件的节目单。',
		Accessor: 'function',
    }, {
        Name: 'ISLoopPlay',
        PropertyType: 'boolean',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置是否循环播放节目单的内容。',
        Accessor: 'function',
    }];


	return type;
}


var MediaBoxItem = function (_file) {
    'use strict'

    var listbox = null;
    var self = this;
    var typeinfo = null;
    var disposed = false;
    var file = _file.File ? _file.File : '';
    var starttime = _file.StartTime ? _file.StartTime : new Date();
    var endtime = _file.EndTime ? _file.EndTime : new Date();
    var mediabox = null;
    var name = _file.Name ? _file.Name : '';
    var audio = null;

    this.Name = function () {
        'use strict'

        if (arguments.length <= 0) {
            return name;
        }

        name = arguments[0];
    };
    this.File = function () {
        'use strict'

        if (arguments.length <= 0) {
            return file;
        }

        file = arguments[0];
    };
    this.StartTime = function () {
        'use strict'

        if (arguments.length <= 0) {
            return starttime;
        }

        starttime = arguments[0];
    };
    this.EndTime = function () {
        'use strict'

        if (arguments.length <= 0) {
            return endtime;
        }

        endtime = arguments[0];
    };
    this.MediaBox = function () {
        'use strict'

        if (arguments.length <= 0) {
            return listbox;
        }
        var get = Object.GetPropertyValue;
        var current = arguments[0];
        if (!__instanceof(current, MediaBox)) {
            current = null;
        }

        do {
            var ever = mediabox;
            listbox = current;
        } while (0, 0);

        if (ever && !current) {
            var items = get(ever, 'MediaItems');
            if (items.Contains(self)) {
                items.RemoveAt(self);
            }
        }
    };
    this.Audio = function () {
        'use strict'

        if (arguments.length <= 0) {
            return audio;
        }
        audio = arguments[0];
    };
    this.GetType = function () { // override
        'use strict'

        if (typeinfo == null) {
            typeinfo = MediaBoxItem.prototype.GetType();
        }
        return typeinfo;
    }
    this.Dispose = function () {
        'use strict'

        if (!disposed) {
            disposed = true;
            this.MediaBox(null);
        }
    };
};

var MediaBoxItemCollection = function (owner) {
    'use strict'

    if (!__instanceof(owner, MediaBox)) {
        Throwable.ArgumentOutOfRangeException();
    }
    var __super = {
        internal: this.internal,
    };
    this.internal = new (function Internal() {
        this.Update = function (start) {
            'use strict'

            start = Number(start),
                start = isNaN(start) || start < 0 ? 0 : start;
            var count = __super.internal.Count();
            var set = Object.SetPropertyValue;
            for (var i = start; i < count; i++) {
                var item = __super.internal.Get(i);
                if (__instanceof(item, MediaBoxItem)) {
                    set(item, 'Index', i);
                }
            }
        }
        this.Insert = function (index, item) {
            'use strict'

            index = Number(index);
            if (index < 0 || isNaN(index) || index > __super.internal.Count()) {
                Throwable.ArgumentOutOfRangeException();
            }
            if (!__instanceof(item, MediaBoxItem)) {
                if (typeof item !== 'object') {
                    Throwable.ArgumentOutOfRangeException();
                }
                item = new MediaBoxItem(item);
            }
            if (!__super.internal.Insert(index, item)) {
                return false;
            }
            var set = Object.SetPropertyValue;
            set(item, 'Index', index);
            set(item, 'MediaBox', owner);
            this.Update(index);
            //owner.Update();
            return true;
        }
        this.RemoveAt = function (index) {
            'use strict'

            var current = __super.internal.Count();
            index = Number(index);
            if (index < 0 || isNaN(index) || index >= current) {
                Throwable.ArgumentOutOfRangeException();
            }
            var item = __super.internal.Get(index);
            __super.internal.RemoveAt(index);
            if (current === __super.internal.Count()) {
                item = undefined;
            } else {
                if (__instanceof(item, MediaBoxItem)) {
                    var set = Object.SetPropertyValue;
                    set(item, 'Index', -1);
                    set(item, 'MediaBox', null);
                    this.Update(index);
                }
                if (current !== __super.internal.Count()) {
                    this.Update(index);
                }
            }
            owner.Update(index);
            return item;
        }
        this.IndexOf = function (item) {
            if (!__instanceof(item, MediaBoxItem)) {
                return -1;
            }
            var get = Object.GetPropertyValue;
            var set = Object.SetPropertyValue;
            var index = get(item, 'Index');
            if (this.Get(index) === item) {
                return index;
            }
            return __super.internal.IndexOf(item);
        }
    });
    Object.Merge(this.internal, __super.internal);
}

MediaBoxItemCollection.New = function (owner) {
    return Collection.New(owner, [MediaBoxItemCollection]);
}

MediaBoxItem.prototype.GetType = function () {
    var typeinfo = new Type();
    typeinfo.FullName = Type.GetName(MediaBoxItem);
    typeinfo.References.push('MediaBox.js');

    typeinfo.Properties = [{
        Name: 'Name',
        PropertyType: 'string',
        Readable: true,
        Writeable: false,
        Browsable: true,
        DataBind: true,
        Description: '获取items的素材名称。',
        Accessor: 'function',
    },{
        Name: 'File',
        PropertyType: 'string,Date',
        Readable: true,
        Writeable: false,
        Browsable: true,
        DataBind: true,
        Description: '获取items的素材名称。',
        Accessor: 'function',
    }, {
        Name: 'StartTime',
        PropertyType: 'string,DateTime',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: true,
        Description: '获取或设置素材的播放开始时间。',
        Accessor: 'function',
    }, {
        Name: 'EndTime',
        PropertyType: 'string,DateTime',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: true,
        Description: '获取或设置素材的播放结束时间。',
        Accessor: 'function',
    }, {
        Name: 'Audio',
        PropertyType: 'Uri,Audio,string',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: true,
        Description: '获取和设置素材的音频文件。',
        Accessor: 'function',
    }];

    return typeinfo;
}

!(function () {

	// Type.References.Add('MediaBox.js');
	Type.DefinedName('MediaBox', 'MediaBox');
	Type.DefinedFile('MediaBox', 'MediaBox.js');
})();