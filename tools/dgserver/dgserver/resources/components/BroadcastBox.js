'use strict'
var ScrollDirectionTimer = null;
var BroadcastBox = function (options) {
    'use strict'

    this.constructor = BroadcastBox;

    var __super = {
        Text: this.Text,
        Dispose: this.Dispose,
    };
    var __self = this;
    var __typeinfo = null;
    var __container = $(__self.DOM());
    var __ulcontainer = null;
    var __eventset = this.EventSet;
    var __items = BroadcastBoxItemCollection.New(__self);
    var _eventset = BroadcastBox.EventSet;
    var _disposed = false;
    var _ScrollDirection = 0;
    var _TimeMargin = { Left: 0, Top: 0, Width: 0, Height: 0 };
    this.EventSet = _eventset;
    var _rollCloth = null;
    var _currentPpage = 0;
    var _pagePause = false;
    //var _TimeMargin = '0,0,0,0';
    this.Text = function () { // override
        if (arguments.length <= 0) {
            return Binding.Callsite(__self, '#BroadcastBox::super.Text', __super.Text);
        }
        var value = arguments[0];
        return Binding.Callsite(__self, '#BroadcastBox::super.Text', __super.Text, [value]);
    }
    this.GetType = function () { // override
        if (__typeinfo == null) {
            __typeinfo = BroadcastBox.prototype.GetType();
        }
        return __typeinfo;
    }
    this.ULDOM = function () {
        return __ulcontainer;
    }
    this.RefreshSize = function () {
        'use strict'
        this.Update();
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
            if (marg) {
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
    this.RollClothAnimation = function () {
        ClothAnimation(this);
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
    this.CurrentPpage = function () {
        'use strict'
        if (arguments.length <= 0) {
            return _currentPpage;
        } else {
            var count = Number(arguments[0]);
            if (isNaN(count)) {
                Throwable.ArgumentOutOfRangeException();
            }
            if (_currentPpage !== count) {
                _currentPpage = count;
                $('input[name=CurrentPpage]').val(_currentPpage);
                //this.Update();
            }
        }
    }
    this.PagePause = function () {
        'use strict'

        //ThrowObjectDisposedException();
        if (arguments.length <= 0) {
            return _pagePause; // !$(_container).is(':hidden');
        }
        else {
            var value = (arguments[0] ? true : false);
            if (value != _pagePause) {
                if (value) {
                    clearInterval(timer);
                    _pagePause = true;
                } else {
                    ClothAnimation(this);
                    _pagePause = false;
                }
            }
        }

    }
    this.Update = function () {
        'use strict'
        var UlDOM = __ulcontainer;
        if (UlDOM) {
            __ulcontainer.find('.item').height($(this)[0].Height());
            if (_rollCloth) {
                var controList = _rollCloth.Controls.GetAll();
                _rollCloth.Width(__self.Width() * controList.length);
                _rollCloth.Height(__self.Height());
                for (var i = 0; i < controList.length;i++) {
                    controList[i].Width(__self.Width());
                }
            }
        }
    };
    this.UpdateFont = function () {

    };
    this.Dispose = function () {
        if (!_disposed) {
            //__items.Synchronizer(null);
            __items.RemoveAll();
            __self.Parent(null);
            var controList = _rollCloth.Controls.GetAll();
            for (var i = 0; i < controList.length;i++) {
                controList[i].Dispose();
            }
            _rollCloth.Dispose();
            clearInterval(timer);
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
        __ulcontainer = $('<div id="myCarousel" >\
      </div>');
        var com = {
            "componentid": "HtmlControl",
            "codeurl": "HtmlControl.js",
            "type": 0,
            "description": "控件的基类",
            "references": "../resources/js/HtmlControl.js",
            "inheritances": null
        };
        _rollCloth = HtmlDesigner.Control.New(com);
        _rollCloth.Parent(__self);
        _rollCloth.Width(__self.Width());
        _rollCloth.Height(__self.Height());
        _rollCloth.Name(__self.Name()+'pagRollCloth');
        _rollCloth.BorderWidth('0');
        __container.append(__ulcontainer);
        HtmlControl.Initialization(__self, HtmlControl.defaults, options);
        __self.RollClothAnimation();
    })();
   
}

BroadcastBox.EventSet = function () {
    'use strict'

    Object.Merge(this, HtmlControl.EventSet);

    this.Click = 'Click';
}
!(function () {
    BroadcastBox.EventSet = new BroadcastBox.EventSet();
    var eventset = BroadcastBox.EventSet;
})();

var BroadcastBoxItem = function (control, options) {
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
                liDOM = $('<div class="item "> ccc </div>');
            }
            var com = {
                "componentid": "HtmlControl",
                "codeurl": "HtmlControl.js",
                "type": 0,
                "description": "控件的基类",
                "references": "../resources/js/HtmlControl.js",
                "inheritances": null
            };
            var con = HtmlDesigner.Control.New(com);
            con.DOM().addClass('item');
            var container = GetULDOM();
            con.Parent(control.Controls.GetAll()[0]);
            con.Width(control.Width());
            con.Height(control.Height());
            con.Dock(3);
            con.BorderWidth('0');
            var lengs = control.Controls.GetAll()[0].Controls.GetAll().length;
            con.Text(lengs);
            con.Name(control.Name() + 'Pag' + lengs);
            //con.DOM().hover(function () {
            //    console.log(this);
            //});
            // container.find('.carousel-inner').append(liDOM);
            self.Update();
        };
    };
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
    this.BroadcastBox = function () {
        'use strict'

        if (arguments.length <= 0) {
            return listbox;
        }
        var get = Object.GetPropertyValue;
        var current = arguments[0];
        if (!__instanceof(current, BroadcastBox)) {
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
        //dialog.control.Controls.GetAll()[0].Controls.GetAll();
        var pagRoll = dialog.control.Controls.GetAll()[0];
        if (pagRoll) {
            var pagList = pagRoll.Controls.GetAll();
            var pagRollWidth = dialog.control.Width() * pagList.length;
            pagRoll.Width(pagRollWidth);
        }
    }
    this.GetType = function () { // override
        'use strict'

        if (typeinfo == null) {
            typeinfo = BroadcastBoxItem.prototype.GetType();
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
            this.BroadcastBox(null);
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

var BroadcastBoxItemCollection = function (owner) {
    'use strict'

    if (!__instanceof(owner, BroadcastBox)) {
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
                if (__instanceof(item, BroadcastBoxItem)) {
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
            if (!__instanceof(item, BroadcastBoxItem)) {
                if (typeof item !== 'object') {
                    Throwable.ArgumentOutOfRangeException();
                }
                item = new BroadcastBoxItem(item);
            }
            if (!__super.internal.Insert(index, item)) {
                return false;
            }
            var set = Object.SetPropertyValue;
            set(item, 'Index', index);
            set(item, 'BroadcastBox', owner);
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
                if (__instanceof(item, BroadcastBoxItem)) {
                    var set = Object.SetPropertyValue;
                    set(item, 'Index', -1);
                    set(item, 'BroadcastBox', null);
                    this.Update(index);
                }
                if (current !== __super.internal.Count()) {
                    this.Update(index);
                }
            }
            return item;
        }
        this.IndexOf = function (item) {
            if (!__instanceof(item, BroadcastBoxItem)) {
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

BroadcastBoxItemCollection.New = function (owner) {
    return Collection.New(owner, [BroadcastBoxItemCollection]);
}

BroadcastBox.prototype.GetType = function () {
    var typeinfo = HtmlControl.prototype.GetType();
    typeinfo.References.push('BroadcastBox.js');
    typeinfo.FullName = Type.GetName(BroadcastBox);
    typeinfo.Properties.push({
        Name: 'RefreshSize',
        PropertyType: 'number',
        Readable: true,
        Writeable: true,
        Browsable: true,
        Description: '获取或设置每行显示item数量。',
        Accessor: 'function',
    });
    typeinfo.Properties.push({
        Name: 'ScrollDirection',
        PropertyType: 'number',
        Readable: true,
        Writeable: true,
        Browsable: true,
        Description: '设置滚动的方向。',
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
        Name: 'TimeMargin',
        PropertyType: 'Rectangle,HtmlView.Rectangle',
        Readable: true,
        Writeable: true,
        Browsable: true,
        Description: '获取列表框的集合。',
        Accessor: 'function',
    });
    typeinfo.Properties.push({
        Name: 'CurrentPpage',
        PropertyType: 'number',
        Readable: true,
        Writeable: true,
        Browsable: true,
        Description: '当前页数。',
        Accessor: 'function',
    }); 
    typeinfo.Properties.push({
        Name: 'PagePause',
        PropertyType: 'boolean',
        Readable: true,
        Writeable: true,
        Browsable: true,
        Description: '翻页是否暂停。',
        Accessor: 'function',
    });
    return typeinfo; 
}
/*
    DirectionStyle enum
        designers: liulilte
 */
var DirectionStyle = new (function DirectionStyle() {
    /* 
     * MetadataToken(RID)
     *  typedef 
     *      Directiontyle class
     */
    this.No = 0; // 不滚动。
    this.Top = 1; // 上滚动。
    this.Down = 2; // 下滚动。
    this.Left = 3; // 左滚动。
    this.Right = 4; // 右滚动。
    //this.Strikeout = 3; //中间有直线通过的文本。
    //this.Underline = 4; //带下划线的文本。 

    this.IsDefined = function (value) {
        return value === this.No ||
            value === this.Top ||
            value === this.Down ||
            value === this.Left ||
            value === this.Right;
        //|| value === this.Strikeout ||
        //value === this.Underline;
    }
});
BroadcastBoxItem.prototype.GetType = function () {
    var typeinfo = new Type();
    typeinfo.FullName = Type.GetName(BroadcastBoxItem);
    typeinfo.References.push('BroadcastBox.js');

    typeinfo.Properties = [{
        Name: 'Index',
        PropertyType: 'string',
        Readable: true,
        Writeable: false,
        Browsable: true,
        DataBind: true,
        Description: '获取items得到内容。',
        Accessor: 'function',
    }, {
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
function StartTimer(dome, style, boxhig) {
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
        dome.css(type, top);
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


!(function () {
    Type.References.Add('BroadcastBox.js');
    Type.DefinedName('BroadcastBox', 'BroadcastBox');
    Type.DefinedFile('BroadcastBox', 'BroadcastBox.js');
})();

var timer = null;//动画定时器
function ClothAnimation(con) {
    var wrap =null,
        pic = null,
        list = null,
        index = 0,
        animation =null;
    //var __cons = con;
    //if (timer) {
    //    clearInterval(timer);
    //    //  timer = null;
    //}
    timer = setInterval(autoPlay, 5000);
    // 定义并调用自动播放函数
    function autoPlay() {
       
        var as = con;
        var rollClothControl = as.Controls.GetAll()[0];
        if (rollClothControl == undefined)
            return;
        list = rollClothControl.Controls.GetAll();
        index++;
        if (index >= list.length) {
            index = 0;
        }
        changeImg(index, as);
    } 

    // 定义图片切换函数
    function changeImg(curIndex, con, type) {
        var as = con;
        var rollClothControl = as.Controls.GetAll()[0];
            wrap = as.DOM(),
                pic = rollClothControl.DOM()[0],
                list = rollClothControl.Controls.GetAll();
        
        clearInterval(animation);
        if (list.length <= 0)
            return;
        var controloWidth = con.Width();
        var a = controloWidth * curIndex;
        var b = (controloWidth * curIndex) - controloWidth;
        for (var j = 0; j < list.length; j++) {
            list[j].DOM()[0].classList.remove("current");
        }
        as.CurrentPpage(curIndex + 1);
        // 改变当前显示索引
        list[curIndex].DOM()[0].classList.add("current");
        var a = -(con.Width()) * curIndex;
        var b = 0;
        if (curIndex > 0) {
            b = -(con.Width()) * (curIndex - 1);
        }
        index = curIndex;
        if (type == 0) {
            pic.style.marginTop = a + 'px';
            return;
        }
        if (curIndex == 0) {
            b = con.Width();
        }
        
        //if (curIndex == 0) {
        //    b = dialog.control.Width();
        //}
        animation = setInterval(function () {
            b -= 1;
            pic.style.marginLeft = b + 'px';
            if (b <= a) {
                clearInterval(animation);
                animation = null;
            }
            if (b <= a) {
                clearInterval(animation);
                animation = null;
            }
        }, 1);
    }

    //// 鼠标划过整个容器时停止自动播放
    //wrap.onmouseover = function () {
    //    clearInterval(timer);
    //    console.log('进入');
    //}

    //// 鼠标离开整个容器时继续播放至下一张
    //wrap.onmouseout = function () {
    //    timer = setInterval(function () {
    //        autoPlay();
    //    }, 5000);
    //    console.log('离开');
    //}
    //// 遍历所有数字导航实现划过切换至对应的图片
    //for (var i = 0; i < list.length; i++) {
    //    //list[i].id = i;
    //    list[i].onmouseover = function () {
    //        clearInterval(timer);
    //        changeImg($(this).attr('index'), 0);
    //    }
    //}
}