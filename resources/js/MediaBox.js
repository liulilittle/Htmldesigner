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
        var _muted = false;
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

            // checkһ������
            return nowtime >= begintime && nowtime < endtime;
        }
        var _checkaudio = function (playmediaitem) {
            'use strict'

            if (!playmediaitem) {
                return false;
            }
            var getattr = Object.GetPropertyValue;
            var audioname = getattr(playmediaitem, "Audio");
            var muted = getattr(playmediaitem, "ISMutedAudio");

            if (audioname) {
                if (audioname != _audio) {
                    _audio = audioname;
                    _mediaBox.find('audio').remove();
                    _mediaBox.append('<audio src="' + _audio + '" autoplay loop>�����������֧�� audio Ԫ�ء�</audio>')
                }
            } else {
                _mediaBox.find('audio').remove();
            }

            if (muted != _muted) {
                _muted = muted;
                _mediaBox.find('audio')[0].muted = _muted;
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
                    // �л����ŵ�ý���Ŀ
                    _mediaBox.children().remove();
                    if (preparemediaitem) {
                        _index = preparemediaitem.Index;
                        _mediaBox.children().remove();
                        if (/.(gif|jpg|jpeg|png|bmp)$/.test(preparemediaitem.Name())) {
                            _mediaBox.append('<img width="100%" height="100%" src="' + preparemediaitem.File() + '"/>');
                            if (preparemediaitem.Audio()) {
                                _audio = preparemediaitem.Audio();
                                _muted = preparemediaitem.ISMutedAudio();
                                _mediaBox.append('<audio src="' + _audio + '" muted="' + _muted +'" autoplay loop>�����������֧�� audio Ԫ�ء�</audio>')
                            }
                        }
                        if (/.(mp4|mkv|avi|rm|rmvb|flv)$/.test(preparemediaitem.Name())) {
                            _mediaBox.append('<video width="100%" height="100%" src="' + preparemediaitem.File() + '" muted="true" loop autoplay></video>');
                            if (preparemediaitem.Audio()) {
                                _audio = preparemediaitem.Audio();
                                _muted = preparemediaitem.ISMutedAudio();
                                _mediaBox.append('<audio src="' + _audio + '" muted="' + _muted +'" autoplay loop>�����������֧�� audio Ԫ�ء�</audio>')
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
		Description: '��ȡ��ǰʵ���� Type (RTTI)��Ϣ��',
	}, {
		Name: 'Dispose',
		Description: '�ͷ��� MediaBox ʹ�õ�������Դ�����̳��� MediaBox����',
	}];

	type.Properties = [{
		Name: 'Name',
		PropertyType: 'string',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: true,
		Description: '��ȡ��������ͼ�����ơ�',
		Accessor: 'property',
	}, {
		Name: 'IsDisposed',
		PropertyType: 'boolean',
		Readable: true,
		Writeable: false,
		Browsable: false,
		DataBind: false,
		Description: '��ȡһ��ֵ����ֵָʾ��ͼ�Ƿ��Ѿ����ͷš�',
		Accessor: 'function',
	}, {
		Name: 'Tag',
		PropertyType: 'object',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: true,
		Description: '��ȡ�����ð����й���ͼ�����ݵĶ���',
		Accessor: 'property',
	}, {
		Name: 'DOM',
		PropertyType: 'HtmlElement',
		Readable: true,
		Writeable: false,
		Browsable: false,
		DataBind: false,
		Description: '��ȡ��ͼ��DOMԪ��������',
		Accessor: 'function',
	}, {
		Name: 'Expression',
		PropertyType: 'string',
		Readable: true,
		Writeable: false,
		Browsable: false,
		DataBind: false,
		Description: '������ʵ�����ͼ�Ĵ�����ʽ��������·������',
		Accessor: 'property',
	},{
		Name: 'Width',
		PropertyType: 'number',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: true,
		Description: '��ȡ��������ͼ�Ŀ�ȡ�',
		Accessor: 'property',
	}, {
		Name: 'Height',
		PropertyType: 'number',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: true,
		Description: '��ȡ��������ͼ�ĸ߶ȡ�',
		Accessor: 'property',
	}, {
		Name: 'Top',
		PropertyType: 'number',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: true,
		Description: '��ȡ�����ÿؼ��ϱ�Ե���������Ĺ������ϱ�Ե֮��ľ��롣',
		Accessor: 'property',
	}, {
		Name: 'Left',
		PropertyType: 'number',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: true,
		Description: '��ȡ�����ÿؼ����Ե���������Ĺ��������Ե֮��ľ��롣',
		Accessor: 'property',
	}, {
		Name: 'Visible',
		PropertyType: 'boolean',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: false,
		Description: '��ȡ������һ��ֵ����ֵָʾ�Ƿ���ʾ�ÿؼ����������ӿؼ���',
		Accessor: 'function',
	}, {
		Name: 'Dock',
		PropertyType: 'number,DockStyle,select',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: false,
		Description: '��ȡ��������Щ�ؼ��߿�ͣ�����丸�ؼ���ȷ���ؼ�������丸��һ�������С��',
		Accessor: 'function',
	}, {
		Name: 'TabIndex',
		PropertyType: 'number',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: false,
		Description: '��ȡ�����ÿؼ����������ڵ� Tab ��˳��',
		Accessor: 'function',
	}, {
		Name: 'ZIndex',
		PropertyType: 'number',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: false,
		Description: '��ȡ�����õ� Z ���С�',
		Accessor: 'function'
    },{
		Name: 'Parent',
		PropertyType: 'HtmlControl,HtmlView',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: false,
		Description: '��ȡ�����ÿؼ��ĸ�������',
		Accessor: 'function'
    },{
		Name: 'Opacity',
		PropertyType: 'number',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: false,
		Description: '��ȡ�����ÿؼ��Ĳ�͸���ȼ���',
		Accessor: 'function',
    }, {
        Name: 'Rotate',
        PropertyType: 'number',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '��ȡ�����ÿؼ�����ת�Ƕȣ�deg����',
        Accessor: 'function'
    }, {
        Name: 'BackgroundImage',
        PropertyType: 'Uri,Image,string',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: true,
        Description: '��ȡ����������ͼ����ʾ�ı���ͼ�񡣣��̳��� HtmlView����',
        Accessor: 'function',
    }, {
        Name: 'BackgroundImageLayout',
        PropertyType: 'number',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '��ȡ�������� ImageLayout ö���ж���ı���ͼ�񲼾֡����̳��� HtmlView����',
        Accessor: 'function',
    }, {
        Name: 'BackColor',
        PropertyType: 'Color',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '��ȡ��������ͼ�ı���ɫ��',
        Accessor: 'function',
    }, {
		Name: 'Items',
        PropertyType: 'Collection,ItemsControlCollection',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: true,
		Description: '��ȡ�����ÿؼ��Ľ�Ŀ����',
		Accessor: 'function',
    }, {
        Name: 'ISLoopPlay',
        PropertyType: 'boolean',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '��ȡ�������Ƿ�ѭ�����Ž�Ŀ�������ݡ�',
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
    var _audioMuted = false;
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
    this.ISMutedAudio = function () {
        'use strict'

        if (arguments.length <= 0) {
            return _audioMuted;
        }
        _audioMuted = arguments[0];
    }
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
        Description: '��ȡitems���ز����ơ�',
        Accessor: 'function',
    },{
        Name: 'File',
        PropertyType: 'string,Date',
        Readable: true,
        Writeable: false,
        Browsable: true,
        DataBind: true,
        Description: '��ȡitems���ز����ơ�',
        Accessor: 'function',
    }, {
        Name: 'StartTime',
        PropertyType: 'string,DateTime',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: true,
        Description: '��ȡ�������زĵĲ��ſ�ʼʱ�䡣',
        Accessor: 'function',
    }, {
        Name: 'EndTime',
        PropertyType: 'string,DateTime',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: true,
        Description: '��ȡ�������زĵĲ��Ž���ʱ�䡣',
        Accessor: 'function',
    }, {
        Name: 'Audio',
        PropertyType: 'Uri,Audio,string',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: true,
        Description: '��ȡ�������زĵ���Ƶ�ļ���',
        Accessor: 'function',
    }, {
        Name: 'ISMutedAudio',
        PropertyType: 'boolean',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: true,
        Description: '��ȡ������Audio�Ƿ�Ϊ������',
        Accessor: 'function',
    }];

    return typeinfo;
}

!(function () {

	// Type.References.Add('MediaBox.js');
	Type.DefinedName('MediaBox', 'MediaBox');
	Type.DefinedFile('MediaBox', 'MediaBox.js');
})();