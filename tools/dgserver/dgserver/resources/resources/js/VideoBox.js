'use strict'

var VideoBox = function (options) {
    'use strict'

    this.constructor = VideoBox;

    var _super = {
        Text: this.Text,
        Dispose: this.Dispose,
    };

    var _self = this;
    var _typeinfo = null;
    var _container = $(_self.DOM());
    var _video = null;
    var _videosrc = null;
    var _posterimage = null;
    var _eventset = this.EventSet;
    var _disposed = false;

    this.EventSet = _eventset;
    this.GetType = function () { // override
        if (_typeinfo == null) {
            _typeinfo = VideoBox.prototype.GetType();
        }
        return _typeinfo;
    };
    this.PosterImage = function () {
        'use strict'

        if (arguments.length <= 0) {
            return _posterimage;
        }
        var img = arguments[0];
        if (/.(gif|jpg|jpeg|png|bmp)$/.test(img)) {
            _posterimage = img;
            _video[0].poster = img;
        }
    };
    this.Video = function () {
        'use strict'

        if (arguments.length <= 0) {
            return _videosrc;
        }
        _videosrc = arguments[0];
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

        _video = $('<video autoplay loop width="100%" height="100%">您的浏览器不支持 HTML5 video 标签。</video>');
        _container.append(_video);
        HtmlControl.Initialization(_self, HtmlControl.defaults, options);
    })()
}

VideoBox.EventSet = function () {
    'use strict'

    Object.Merge(this, HtmlControl.EventSet);

    this.Click = 'Click';
}
!(function () {
    VideoBox.EventSet = new VideoBox.EventSet();
    var eventset = VideoBox.EventSet;
})();


VideoBox.prototype.GetType = function () {
   // var type = new Type();
    var type = HtmlControl.prototype.GetType();
    type.References.push('VideoBox.js');
    type.FullName = Type.GetName(VideoBox);

    type.Methods = [{
        Name: 'GetType',
        Description: '获取当前实例的 Type (RTTI)信息。',
    }, {
        Name: 'Dispose',
        Description: '释放由 VideoBox 使用的所有资源。（继承自 VideoBox。）',
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
    }, {
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
    }, {
        Name: 'Parent',
        PropertyType: 'HtmlControl,HtmlView',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置控件的父容器。',
        Accessor: 'function'
    }, {
        Name: 'Opacity',
        PropertyType: 'number',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置控件的不透明度级别。',
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
        Name: 'Rotate',
        PropertyType: 'number',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置控件的旋转角度（deg）。',
        Accessor: 'function'
    }, {
        Name: 'ISAutoplay',
        PropertyType: 'boolean',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置视频是否播放。',
        Accessor: 'function',
    }, {
        Name: 'ISControls',
        PropertyType: 'boolean',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置是否显示控件，如播放按钮。',
        Accessor: 'function',
    }, {
        Name: 'ISLoop',
        PropertyType: 'boolean',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置视频是否循环播放。',
        Accessor: 'function',
    }, {
        Name: 'PosterImage',
        PropertyType: 'Uri,Image,string',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: true,
        Description: '获取或设置视频正在下载时显示的图像图像。',
        Accessor: 'function',
    }, {
        Name: 'Video',
        PropertyType: 'Uri,Video,string',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: true,
        Description: '获取或设置视频正在下载时显示的图像图像。',
        Accessor: 'function',
    }];


    return type;
}

!(function () {

    // Type.References.Add('VideoBox.js');
    Type.DefinedName('VideoBox', 'VideoBox');
    Type.DefinedFile('VideoBox', 'VideoBox.js');
})();