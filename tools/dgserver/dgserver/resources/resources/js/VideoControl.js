'use strict'

var VideoControl = function (options) {
	'use strict'

	this.constructor = VideoControl;

	var _super = {
		Text: this.Text,
		Dispose: this.Dispose,
	};

	var _self = this;
	var _typeinfo = null;
	var _container = $(_self.DOM());
	var _video = null;
	var _eventset = this.EventSet;
	var _disposed = false;

	this.EventSet = _eventset;
	this.GetType = function () { // override
		if (_typeinfo == null) {
			_typeinfo = VideoControl.prototype.GetType();
		}
		return _typeinfo;
	};
	this.PosterImage = function () {
		'use strict'

		if (arguments.length <= 0) {
	        return _video[0].poster;
		}
		var img = arguments[0];
		if (/.(gif|jpg|jpeg|png|bmp)$/.test(img)) {
	        _video[0].poster = img;
		}
	};
    this.Video = function () {
		'use strict'

		if (arguments.length <= 0) {
	        return _video[0].src;
		}

		_video[0].src = arguments[0];
	};
	this.ISAutoplay = function () {
        'use strict'

        if (arguments.length <= 0) {
            if (_video[0].autoplay) {
                return true;
            } else {
                return false;
            }
        }
        _video[0].autoplay = arguments[0];
	};
	this.ISLoop = function () {
        'use strict'

        if (arguments.length <= 0) {
            if (_video[0].loop) {
                return true;
            } else {
                return false;
            }
        }
        _video[0].loop = arguments[0];
	};
	this.ISControls = function () {
        'use strict'

        if (arguments.length <= 0) {
            if (_video[0].controls) {
                return true;
            } else {
                return false;
            }
        }
        _video[0].controls = arguments[0];
	};
	this.Dispose = function () {
		if (!_disposed) {
			_self.Parent(null);
			$(_container).remove();
		}
		_disposed = true;
	};

	!(function () {
		'use strict'

		_video = $('<video autoplay loop width="100%" height="100%">�����������֧�� HTML5 video ��ǩ��</video>');
		_container.append(_video);
		HtmlControl.Initialization(_self, HtmlControl.defaults, options);
	})()
}

VideoControl.EventSet = function () {
	'use strict'

	Object.Merge(this, HtmlControl.EventSet);

	this.Click = 'Click';
}

!(function () {
	VideoControl.EventSet = new VideoControl.EventSet();
	var eventset = VideoControl.EventSet;
})();


VideoControl.prototype.GetType = function () {
	var type = new Type();
	type.References.push('VideoControl.js');
	type.FullName = Type.GetName(VideoControl);

	type.Methods = [{
		Name: 'GetType',
		Description: '��ȡ��ǰʵ���� Type (RTTI)��Ϣ��',
	}, {
		Name: 'Dispose',
		Description: '�ͷ��� VideoControl ʹ�õ�������Դ�����̳��� VideoControl����',
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
	}, {
		Name: 'Parent',
		PropertyType: 'HtmlControl,HtmlView',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: false,
		Description: '��ȡ�����ÿؼ��ĸ�������',
		Accessor: 'function'
	}, {
		Name: 'Opacity',
		PropertyType: 'number',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: false,
		Description: '��ȡ�����ÿؼ��Ĳ�͸���ȼ���',
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
		Name: 'Rotate',
		PropertyType: 'number',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: false,
		Description: '��ȡ�����ÿؼ�����ת�Ƕȣ�deg����',
		Accessor: 'function'
	}, {
        Name: 'ISAutoplay',
        PropertyType: 'boolean',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '��ȡ��������Ƶ�Ƿ񲥷š�',
        Accessor: 'function',
	}, {
        Name: 'ISControls',
        PropertyType: 'boolean',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '��ȡ�������Ƿ���ʾ�ؼ����粥�Ű�ť��',
        Accessor: 'function',
	}, {
        Name: 'ISLoop',
        PropertyType: 'boolean',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '��ȡ��������Ƶ�Ƿ�ѭ�����š�',
        Accessor: 'function',
	}, {
		Name: 'PosterImage',
		PropertyType: 'Uri,Image,string',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: true,
		Description: '��ȡ��������Ƶ��������ʱ��ʾ��ͼ��ͼ��',
		Accessor: 'function',
	}, {
		Name: 'Video',
        PropertyType: 'Uri,Video,string',
		Readable: true,
		Writeable: true,
		Browsable: true,
		DataBind: true,
		Description: '��ȡ��������Ƶ��������ʱ��ʾ��ͼ��ͼ��',
		Accessor: 'function',
	}];


	return type;
}

!(function () {
	Type.References.Add('VideoControl.js');
	Type.DefinedName('VideoControl', 'VideoControl');
	Type.DefinedFile('VideoControl', 'VideoControl.js');
})();