 'use strict'

var ListBox = function (options) {
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

    this.EventSet = _eventset;
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
    this.ForeColor = function () {
        'use strict'

        if (arguments.length <= 0) {
            return Color.ArgbStringToArgbHex(__ulcontainer.css('color'));
        } else {
            if (__instanceof(arguments[0], Color)) {
                arguments[0] = arguments[0].toString();
            }
            __ulcontainer.css('color', Color.ArgbHexToArgbString(arguments[0]));
        }
    };
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
                var n = arguments[0].split(',');
                UlDOM.css(arguments[1] + '-left', parseInt(n[0]));
                UlDOM.css(arguments[1] + '-top', parseInt(n[1]));
                UlDOM.css(arguments[1] + '-right', parseInt(n[2]));
                UlDOM.css(arguments[1] + '-bottom', parseInt(n[3]));
            }
            !(function () {
                var li = __ulcontainer.find('li');
                if (_RowItemCount === 0) {
                    li.css('width', '100%');
                }
                var w = (100 / _RowItemCount).toFixed(2);
                li.css('width', w + '%');
            })();
        }
    };
    this.Dispose = function () {
        if (!_disposed) {
            //__items.RemoveAll();
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
!(function () {
    HtmlControl.EventSet = new ListBox.EventSet();
    var eventset = ListBox.EventSet;
})();

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
                liDOM = $('<li class="flex-box" style="width:100%;float: left; padding: 10px 20px;"><p id="index"></p><p class="adapt" id="name"></p><p id="time"></p></li>');
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
    this.Margin = function () {
        'use strict'

        if (arguments.length <= 0) {
            return {
                Left: parseInt(liDOM.css('margin-left')),
                Top: parseInt(liDOM.css('margin-top')),
                Width: parseInt(liDOM.css('margin-right')),
                Height: parseInt(liDOM.css('margin-top'))
            }
        }
        this.Update(arguments[0], 'margin');
    }
    this.Padding = function () {
        'use strict'

        if (arguments.length <= 0) {
            return {
                Left: parseInt(liDOM.css('padding-left')),
                Top: parseInt(liDOM.css('padding-top')),
                Width: parseInt(liDOM.css('padding-left')),
                Height: parseInt(liDOM.css('padding-top'))
            }
        }
        this.Update(arguments[0], 'padding');
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
            if (arguments.length > 0) {
                var n = arguments[0].split(',');
                liDOM.css(arguments[1] +'-left', parseInt(n[0]));
                liDOM.css(arguments[1] + '-top', parseInt(n[1]));
                liDOM.css(arguments[1] + '-right', parseInt(n[2]));
                liDOM.css(arguments[1] + '-bottom', parseInt(n[3]));
            }
            liDOM.find('#index').html(get(self, 'Index') + '.')
            liDOM.find('#name').html(get(self, 'Name')).css({
                'padding': '0 30px'
            });
            liDOM.find('#time').html(get(self, 'Time')+'分钟').css({
                'color': '#ffd16e'
            });
            liDOM.css('z-index', get(self, 'Index'));
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
                Object.SetPropertyValue(self, key, options[key]);
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
    }, {
        Name: 'Margin',
        PropertyType: 'Rectangle,HtmlView.Rectangle',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置控件之间的空间。',
        Accessor: 'function',
    }, {
        Name: 'Padding',
        PropertyType: 'Rectangle,HtmlView.Rectangle',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置控件内的空白。',
        Accessor: 'function',
    }];
    return typeinfo;
}

!(function () {
    Type.References.Add('ListBox.js');
    Type.DefinedName('ListBox', 'ListBox');
    Type.DefinedFile('ListBox', 'ListBox.js');
})();