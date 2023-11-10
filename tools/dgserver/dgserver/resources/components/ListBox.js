 'use strict'
var ScrollDirectionTimer = null;
/*
 *  ListBox class
 *     designers: liulilte
 *  提供基础的队列列表显示。
 */
var ListBox = function (options) {
    /* 
     * MetadataToken(RID)
     *  typedef 
     *      ListBox class
     */
    'use strict'

    this.constructor = ListBox;

    var __super = {
        Text: this.Text,
        Dispose: this.Dispose,
    };
    var __self = this;
    var __typeinfo = null;
    var __container = $(__self.DOM());
    var __ulcontainer = null;
    var __eventset = this.EventSet;
    var __items = ListBoxItemCollection.New(__self);
    var _eventset = ListBox.EventSet;
    var _disposed = false;
    var _RowItemCount = 1;
    var _ScrollDirection = 0;
    var _TimeMargin = { Left: 0, Top: 0, Width: 0, Height: 0 };
    var _itemStyle = new ListBoxItemStyle(__self);
    this.EventSet = _eventset;
    //var _TimeMargin = '0,0,0,0';
    this.Text = function () { // override
        if (arguments.length <= 0) {
            return Binding.Callsite(__self, '#ListBox::super.Text', __super.Text);
        }
        var value = arguments[0];
        return Binding.Callsite(__self, '#ListBox::super.Text', __super.Text, [value]);
    }
    this.GetType = function () { // override
        if (__typeinfo == null) {
            __typeinfo = ListBox.prototype.GetType();
        }
        return __typeinfo;
    }
    this.ULDOM = function () {
        return __ulcontainer;
    }
    this.RowItemCount = function () {
        'use strict'
        if (arguments.length <= 0) {
            return _RowItemCount;
        } else {
            var count = Number(arguments[0]);
            if (isNaN(count)) {
                Throwable.ArgumentOutOfRangeException();
            }
            if (_RowItemCount !== count) {
                _RowItemCount = count;
                this.Update();
            }
        }
    }
    this.ScrollDirection = function () {
        'use strict'
        if (arguments.length <= 0) {
            return _ScrollDirection;
        } else {
            var count = Number(arguments[0]);
            if (isNaN(count)) {
                Throwable.ArgumentOutOfRangeException();
            }
            _ScrollDirection = count;
            StartTimer($('#' + this.Name() + ' ul'), _ScrollDirection, $('#' + this.Name()).height());
        }
    }
    this.TimeMargin = function () {
        'use strict'
        if (arguments.length <= 0) {
            return _TimeMargin;
        } else {
            if (!arguments[0])
                return;
            var marg = arguments[0];
            if (marg)
            {
                _TimeMargin.Left = marg.Left;
                _TimeMargin.Top = marg.Left;
                _TimeMargin.Width = marg.Width;
                _TimeMargin.Height = marg.Height;
                _TimeMargin = marg;
                $('#' + this.Name() + ' #time').css('margin',
                    marg.Left + 'px ' + marg.Width + 'px '
                    + marg.Height + 'px ' + marg.Left + 'px ');
            }
        }
    };
    this.ForeColor = function () {
        'use strict'

        if (arguments.length <= 0) {
            return Color.ArgbStringToArgbHex(__ulcontainer.css('color'));
        } else {
            if (__instanceof(arguments[0], Color)) {
                arguments[0] = arguments[0].toString();
            }
            __ulcontainer.css('color', Color.ArgbHexToArgbString(arguments[0]));
            this.UpdateFont();
        }
    };
    this.FontSize = function () { 
        'use strict'

        if (arguments.length <= 0) {
            return parseFloat($(__container).css('font-size'));
        } else {
            $(__container).css({ 'font-size': arguments[0] });
            this.UpdateFont();
        }
    }
    this.Padding = function () {
        'use strict'

        var UlDOM = __ulcontainer;
        if (arguments.length <= 0) {
            return {
                Left: parseInt(UlDOM.css('padding-left')),
                Top: parseInt(UlDOM.css('padding-top')),
                Width: parseInt(UlDOM.css('padding-left')),
                Height: parseInt(UlDOM.css('padding-top'))
            }
        }
        this.Update(arguments[0], 'padding');
    };
    this.Update = function () {
        'use strict'
        var UlDOM = __ulcontainer;
        if (UlDOM) {
            if (arguments.length > 0) {
                var n = arguments[0];
                UlDOM.css(arguments[1] + '-left', parseInt(n.Left));
                UlDOM.css(arguments[1] + '-top', parseInt(n.Top));
                UlDOM.css(arguments[1] + '-right', parseInt(n.Right));
                UlDOM.css(arguments[1] + '-bottom', parseInt(n.Bottom));
            }
            !(function () {
                var li = __ulcontainer.find('li');
                if (_RowItemCount === 0) {
                    li.css('width', '100%');
                }
                var w = (100 / _RowItemCount).toFixed(2);
                li.css('width', w + '%');
            })();
        };
    };
    this.UpdateFont = function (){
        _itemStyle['Index'].Update();
        _itemStyle['Name'].Update();
        _itemStyle['Time'].Update();
    };
    this.Dispose = function () {
        if (!_disposed) {
            //__items.Synchronizer(null);
            __items.RemoveAll();
            __self.Parent(null);
            $(__container).remove();
        }
        _disposed = true;
    }

    Object.defineProperty(this, 'Items', {
        get: function () {
            return __items;
        }
    });
    Object.defineProperty(this, 'ItemStyle', {
        get: function () {
            return _itemStyle;
        }
    });
    
    !(function () {
        'use strict'

        __ulcontainer = $('<ul class="ListBox" style="position: absolute; background-color: rgba(255, 255, 255,0); left: 0; top: 0; right: 0; bottom: 0;margin: 0;padding: 0;"></ul>');
        __container.append(__ulcontainer);
        HtmlControl.Initialization(__self, HtmlControl.defaults, options);
    })();
}

ListBox.EventSet = function () {
    'use strict'

    Object.Merge(this, HtmlControl.EventSet);

    this.Click = 'Click';
}

// 实例化一个可用的列表框控件。
ListBox.New = function (options) {
    return HtmlControl.New(options, [ListBox]);
}

var ListBoxItem = function (options) {
    'use strict'

    var index = -1;
    var name = '';
    var time = 0;
    var listbox = null;
    var liDOM = null;
    var self = this;
    var typeinfo = null;
    var disposed = false;
    var AppendLIDOMToULDOM = function () {
        'use strict'

        if (listbox) {
            if (!liDOM) {
                liDOM = $('<li style="width:100%;display: flex;-webkit-box;display: -moz-box;display: -ms-flexbox;display: -webkit-flex;margin:15px 0px 10 0px"><p class="Index" style="margin:10px 0px 10px 5px"></p><p class="Name" style="-webkit-box-flex: 1;-moz-box-flex: 1;-webkit-flex: 1;-ms-flex: 1;flex: 1;text-align:left;margin:10px 0px 10px 0px"></p><p class="Time"></p></li>');
            }
            self.Update();
            var container = GetULDOM();
            container.append(liDOM);
        }
    }
    var RemoveLIDOMInULDOM = function () {
        'use strict'

        if (liDOM) {
            liDOM.remove();
        }
        liDOM = null;
    }

    this.Index = function () {
        'use strict'

        if (arguments.length <= 0) {
            return index;
        }
        var n = Number(arguments[0]),
            n = isNaN(n) ? -1 : n;
        if (n !== index) {
            index = n;
            this.Update();
        }
    }
    this.Name = function () {
        'use strict'

        if (arguments.length <= 0) {
            return name;
        }
        var value = arguments[0];
        if (Object.IsNullOrUndefined(value)) {
            value = '';
        }
        else if (typeof value !== 'string') {
            value = value.toString();
        }
        if (value !== name) {
            name = value;
            this.Update();
        }
    }
    this.Time = function () {
        'use strict'

        if (arguments.length <= 0) {
            return time;
        }
        var n = Number(arguments[0]),
            n = isNaN(n) ? 0 : n;
        if (n !== index) {
            time = n;
            this.Update();
        }
    }
    this.ListBox = function () {
        'use strict'

        if (arguments.length <= 0) {
            return listbox;
        }
        var get = Object.GetPropertyValue;
        var current = arguments[0];
        if (!__instanceof(current, ListBox)) {
            current = null;
        }
        RemoveLIDOMInULDOM();
        do {
            var ever = listbox;
            listbox = current;
        } while (0, 0);
        AppendLIDOMToULDOM();
        if (ever && !current) {
            var items = get(ever, 'Items');
            if (items.Contains(self)) {
                items.RemoveAt(self);
            }
        }
    }
    this.Update = function () {
        'use strict'

        var get = Object.GetPropertyValue;
        if (listbox) {
            listbox.Update();
        }
        if (liDOM) {
            
            liDOM.find('.Index').html(get(self, 'Index') + '.')
            liDOM.find('.Name').html(get(self, 'Name'));
            liDOM.find('.Time').html(get(self, 'Time')+'分');
            liDOM.css('z-index', get(self, 'Index'));

            var ItemStyle = get(listbox, 'ItemStyle');
            var type = ItemStyle.GetType().Properties;
            for (var i = 0; i < type.length; i++){
                var n = type[i].Name;
                var _style = ItemStyle[n];
                var show = _style.Visible() ? 'block' : 'none';
                var _stylewidth = _style.Width();
                if (_style.Width == -1) {
                    _stylewidth = 'auto';
                };
                liDOM .find('.'+ n).css({
                    'padding': _style.Padding().replace(/,/g, 'px ') + 'px',
                    'margin': _style.Margin().replace(/,/g, 'px ') + 'px',
                    'color': new Color(_style.ForeColor()).toString('s'),
                    'font-size': _style.FontSize() + 'px',
                    'background-color': new Color(_style.BackColor()).toString('s'),
                    'border-radius': _style.BorderRadius().replace(/,/g, 'px ') + 'px',
                    'display': show,
                    'text-align': _style.TextAlign(),
                    'width': _stylewidth
              });  
            }
            
        }
    }
    this.GetType = function () { // override
        'use strict'

        if (typeinfo == null) {
            typeinfo = ListBoxItem.prototype.GetType();
        }
        return typeinfo;
    }
    var GetULDOM = function () {
        'use strict'

        if (!listbox) {
            return null;
        }
        var dom = Object.GetPropertyValue(listbox, 'ULDOM');
        if (!(Object.IsNullOrUndefined(dom) ||
            typeof dom !== 'object' ||
            !__instanceof(dom, HTMLElement) ||
            ($(document.body).constructor !== dom.constructor) ||
            dom.hasOwnProperty(dom, 'length') && dom.length <= 0 || isNaN(dom.length))) {
            return null;
        }
        return $(dom);
    }
    this.Dispose = function () {
        'use strict'

        if (!disposed) {
            disposed = true;
            this.ListBox(null);
        }
    }

    !(function () {
        'use strict'

        if (!Object.IsNullOrUndefined(options) || typeof options === 'object') {
            for (var key in options) {
                if (!self.hasOwnProperty(key)) {
                    continue;
                }
                var value = Object.GetPropertyValue(options, key);
                Object.SetPropertyValue(self, key, value);
            }
        }
    })();
    Object.defineProperty(this, "IsDisposed", {
        get: function () {
            return disposed;
        }
    });
}

var ListBoxItemCollection = function (owner) {
    'use strict'

    if (!__instanceof(owner, ListBox)) {
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
                if (__instanceof(item, ListBoxItem)) {
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
            if (!__instanceof(item, ListBoxItem)) {
                if (typeof item !== 'object') {
                    Throwable.ArgumentOutOfRangeException();
                }
                item = new ListBoxItem(item);
            }
            if (!__super.internal.Insert(index, item)) {
                return false;
            }
            var set = Object.SetPropertyValue;
            set(item, 'Index', index);
            set(item, 'ListBox', owner);
            this.Update(index);
            owner.Update();
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
                if (__instanceof(item, ListBoxItem)) {
                    var set = Object.SetPropertyValue;
                    set(item, 'Index', -1);
                    set(item, 'ListBox', null);
                    this.Update(index);
                }
                if (current !== __super.internal.Count()) {
                    this.Update(index);
                }
            }
            return item;
        }
        this.IndexOf = function (item) {
            if (!__instanceof(item, ListBoxItem)) {
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

ListBoxItemCollection.New = function (owner) {
    return Collection.New(owner, [ListBoxItemCollection]);
}

ListBox.prototype.GetType = function () {
    'use strict'

    var typeinfo = HtmlControl.prototype.GetType();
    typeinfo.References.push('ListBox.js');
    typeinfo.FullName = Type.GetName(ListBox);
    typeinfo.Properties.push({
        Name: 'RowItemCount',
        PropertyType: 'number',
        Readable: true,
        Writeable: true,
        Browsable: true,
        Description: '获取或设置每行显示item数量。',
        Accessor: 'function',
    });
 
    typeinfo.Properties.push({
        Name: 'Items',
        PropertyType: 'Collection,ItemsControlCollection',
        Readable: true,
        Writeable: false,
        Browsable: true,
        Description: '获取列表框的集合。',
        Accessor: 'function',
    });
    typeinfo.Properties.push({
        Name: 'ItemStyle',
        PropertyType: 'Object,ItemsObject',
        Readable: true,
        Writeable: false,
        Browsable: true,
        Description: '获取列表框的样式。',
        Accessor: 'function',
    });
    typeinfo.Properties.push({
        Name: 'TimeMargin',
        PropertyType: 'Rectangle,HtmlView.Rectangle',
        Readable: true,
        Writeable: true,
        Browsable: true,
        Description: '获取列表框的集合。',
        Accessor: 'function',
    });
    return typeinfo;
}

ListBoxItem.prototype.GetType = function () {
    var typeinfo = new Type();
    typeinfo.FullName = Type.GetName(ListBoxItem);
    typeinfo.References.push('ListBox.js');

    typeinfo.Properties = [{
        Name: 'Index',
        PropertyType: 'string',
        Readable: true,
        Writeable: false,
        Browsable: true,
        DataBind: true,
        Description: '获取items得到内容。',
        Accessor: 'function',
    },{
        Name: 'Name',
        PropertyType: 'string',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: true,
        Description: '获取items得到内容。',
        Accessor: 'function',
    }, {
        Name: 'Time',
        PropertyType: 'string',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: true,
        Description: '获取items得到内容。',
        Accessor: 'function',
    }];

    return typeinfo;
}
function StartTimer(dome, style,boxhig) {
    var top = 0;
    var type = 'top';
    var high = dome.height();
    if (style == 2) {
        type = 'bottom';
        high = dome.height();
    }
    if (ScrollDirectionTimer)
        clearInterval(ScrollDirectionTimer);
    dome.css(type, 0);
    if (style == 0) {
        return;
    }
    ScrollDirectionTimer = window.setInterval(function () {
        top--;
        dome.css(type,top);
        //if (top < '-'+high) {
        //    top = 0;
        //};
    }, 10);
    setInterval(function () {
        if (top < '-' + high) {
            top = boxhig;
        };
    }, 1500)
}

var ListBoxItemStyle = function (owner) {
    if (!__instanceof(owner, ListBox)) {
        Throwable.InvalidOperationException();
    }
    var listbox = owner;
    var _typeinfo = null;

    var _indexStyle = new ListBoxItemPropertyStyle(owner, "Index");
    var _nameStyle = new ListBoxItemPropertyStyle(owner, "Name");
    var _timeStyle = new ListBoxItemPropertyStyle(owner, "Time");

    Object.defineProperty(this, "Index", {
        get: function () {
            return _indexStyle;     
        }    
    });

    Object.defineProperty(this, "Name", {
        get: function () {
            return _nameStyle;     
        }    
    });

    Object.defineProperty(this, "Time", {
        get: function () {
            return _timeStyle;     
        }    
    });

    this.GetType = function () { 
        if (_typeinfo == null) {
            _typeinfo = ListBoxItemStyle.prototype.GetType();              
        }
        return _typeinfo;
    }

    this.toString = function () {
        return '[object {0}]'.replace('{0}', Type.GetName(this.constructor));
    }
}

ListBoxItemStyle.prototype.GetType = function () {
    var typeinfo = new Type();
    typeinfo.FullName = Type.GetName(ListBox);
    typeinfo.References.push('ListBox.js');

    typeinfo.Properties = [{
        Name: 'Index',
        PropertyType: 'ItemStyle',
        Readable: true,
        Writeable: false,
        Browsable: true,
        Description: '获取items得到内容。',
        Accessor: 'function',
    },{
        Name: 'Name',
        PropertyType: 'ItemStyle',
        Readable: true,
        Writeable: true,
        Browsable: true,
        Description: '获取items得到内容。',
        Accessor: 'function',
    }, {
        Name: 'Time',
        PropertyType: 'string',
        Readable: true,
        Writeable: true,
        Browsable: true,
        Description: '获取items得到内容。',
        Accessor: 'function',
    }];

    return typeinfo;
}

var ListBoxItemPropertyStyle = function (owner, property) {
    var liDOM = null;
    var _padding = '0,0,0,0';
    var _margin = '0,0,0,0';
    var _color = null;
    var _fontsize = null;
    var _fontweight = owner.FontStyle();
    var _backcolor = 'ffffff';
    var _borderadius = '0,0,0,0';
    var _visible = true;
    var _textalign = 'left';
    var _width = 'auto';

    if(owner.DOM().find('li')){
        liDOM = owner.DOM().find('li');
    };

    this.Width = function () {
        'use strict'

        if (arguments.length <= 0) {
            if (_width == 'auto') {
                return 'auto';
            }
            return _width;
        }

        if (_width != arguments[0]) {
            if (arguments[0] == -1) {
                _width = 'auto';
            } else {
                _width = arguments[0];
            }
            this.Update();
        }
    }
    this.Padding = function () {
        'use strict'

        if (arguments.length <= 0) {
            return _padding;  
        }

        if (_padding != arguments[0]){
            _padding = arguments[0];
            this.Update();
        }
    };

    this.Margin = function () {
        'use strict'

        if (arguments.length <= 0){
            return _margin;      
        }

        if (_margin != arguments[0]){
            _margin = arguments[0];
            this.Update();
        }
    };

    this.ForeColor = function () {
        'use strict'

        if (arguments.length <= 0) { 
            if (_color) { 
                return _color;            
            }else{
                return owner.ForeColor();
            }
        }    

        if (_color != arguments[0] || ! _color){
            _color = arguments[0];
            this.Update();
        }
    };

    this.FontSize = function () { 
        'use strict'

        if (arguments.length <= 0) { 
            if (_fontsize) {
                return _fontsize;
            } else { 
                return owner.FontSize();            
            }    
        }   

        if (_fontsize != arguments[0] || !_fontsize){
            _fontsize = arguments[0];
            this.Update();
        }
    };

    this.BackColor = function () { 
        'use strict'
        if (arguments.length <= 0) { 
            return _backcolor;   
        }   

        if (_backcolor != arguments[0]){
            _backcolor = arguments[0];
            this.Update();
        }
    };

    this.BorderRadius = function () { 
        'use strict'
        if (arguments.length <= 0) { 
            return _borderadius;   
        }   

        if (_borderadius != arguments[0]){
            _borderadius = arguments[0];
            this.Update();
        }
    }

    this.Visible = function () { 
        'use strict'
        
        if (arguments.length <= 0) {
            return _visible; // !$(_container).is(':hidden');
        }

        var value = (arguments[0] ? true : false);
        if (value != _visible) {
            _visible = arguments[0];
            this.Update();
        }
    }

    this.TextAlign = function () {
        'use strict'

        if (arguments.length <= 0) {
            return _textalign; 
        }

        if (arguments[0] != _textalign) {
            _textalign = arguments[0];
            this.Update();
        }
    }

    this.Update = function () { 
       'use strict'   

        var get = Object.GetPropertyValue;
        if (owner) { 
            owner.Update();
        }
        var Items = Object.GetPropertyValue(owner, 'Items');
        Items = Items.GetAll();
        for (var i = 0; i < Items.length; i++) { 
            Items[i].Update();        
        }
    }
}

ListBoxItemPropertyStyle.prototype.GetType = function () {
    var typeinfo = new Type();
    typeinfo.FullName = Type.GetName(ListBox);
    typeinfo.References.push('ListBox.js');

    typeinfo.Properties = [{
        Name: 'Width',
        PropertyType: 'number',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置items对应的宽。',
        Accessor: 'function'
    },{
        Name: 'Visible',
        PropertyType: 'boolean',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置一个值，该值指示是否显示该控件及其所有子控件。',
        Accessor: 'function',
    }, {
        Name: 'Padding',
        PropertyType: 'ItemStyle',
        Readable: true,
        Writeable: true,
        Browsable: true,
        Description: '获取或设置items对应的padding值。',
        Accessor: 'function',
    },{
        Name: 'Margin',
        PropertyType: 'ItemStyle',
        Readable: true,
        Writeable: true,
        Browsable: true,
        Description: '获取或设置items对应的margin值。',
        Accessor: 'function',
    },{
        Name: 'FontSize',
        PropertyType: 'number',
        Readable: true,
        Writeable: true,
        Browsable: true,
        Description: '获取或设置items对应的字体大小。',
        Accessor: 'function',
    }, {
        Name: 'ForeColor',
        PropertyType: 'string',
        Readable: true,
        Writeable: true,
        Browsable: true,
        Description: '获取或设置items对应的字体颜色。',
        Accessor: 'function',
    },{
        Name: 'BackColor',
        PropertyType: 'Color',
        Readable: true,
        Writeable: true,
        Browsable: true,
        Description: '获取或设置items对应的背景色。',
        Accessor: 'function',
    },{
        Name: 'BorderRadius',
        PropertyType: 'ItemStyle',
        Readable: true,
        Writeable: true,
        Browsable: true,
        Description: '获取或设置items对应的背景色。',
        Accessor: 'function',
    }, {
        Name: 'TextAlign',
        PropertyType: 'select,TextAlign',
        Readable: true,
        Writeable: true,
        Browsable: true,
        Description: '获取或设置items对应的背景色。',
        Accessor: 'function',
    }];

    return typeinfo;
}

!(function () {
    ListBox.EventSet = new ListBox.EventSet();

    // Type.References.Add('ListBox.js');
    Type.DefinedName('ListBox', 'ListBox');
    Type.DefinedFile('ListBox', 'ListBox.js');
})();