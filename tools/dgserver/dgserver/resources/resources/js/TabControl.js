'use strict'
var ScrollDirectionTimer = null;
var TabControl = function (options) {
    'use strict'
    console.log('创建属性');
    this.constructor = TabControl;

    var __super = {
        Text: this.Text,
        Dispose: this.Dispose,
    };
    var __self = this;
    var __typeinfo = null;
    var __container = $(__self.DOM());
    var __ulcontainer = null;
    var __eventset = this.EventSet;
    var __items = TabControlItemCollection.New(__self);
    var _eventset = TabControl.EventSet;
    var _disposed = false;
    var _ScrollDirection = 0;
    var _TimeMargin = { Left: 0, Top: 0, Width: 0, Height: 0 };
    this.EventSet = _eventset;
    var _rollCloth = null;
    var _currentPpage = 0;
    var _dockMode = DockStyle.None;
    var _pagePause = false;
    var _isDetailedListTime = false;
    var _broadcastTime = 0;
    var _rollingEffect = 0;
    
    var timer = null;//动画定时器
    var wrap = null,
        pic = null,
        list = null,
        index = 0,
        animation = null;
    //var _TimeMargin = '0,0,0,0';
    console.log('创建属性成功');
    console.log('方法');
    var PublishEvent = function (name, e) {
        _eventset.Publish(name, __self, e);
    }
    setInterval(function () {
        if (_isDetailedListTime) {
            var items = __self.Items.GetAll();
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var startTime = item.StartTime();
                var endTime = item.EndTime();
                var start = new Date();
                start.setHours(startTime.getHours());
                start.setMinutes(startTime.getMinutes());
                var end = new Date();
                end.setHours(endTime.getHours());
                end.setMinutes(endTime.getMinutes());   
                var currentTime = Number(new Date());
                if (currentTime >= Number(start) && currentTime <= Number(end)) {
                    //__self.BackgroundImage(item.FileSelect());
                    //__self.Controls.GetAll()[0].Controls.GetAll()[0].BackgroundImage(item.FileSelect());
                    var cons = __self.Controls.GetAll()[0].Controls.GetAll();
                    if (i == 0) {
                        for (var j = 0; j < cons.length; j++) {
                            cons[j].DOM().show(500);
                        }
                        return;
                    }
                    cons[i - 1].DOM().hide(1500);
                    return;
                }
            }
        }
    }, 1000);

    this.Text = function () { // override
        if (arguments.length <= 0) {
            return Binding.Callsite(__self, '#TabControl::super.Text', __super.Text);
        }
        var value = arguments[0];
        return Binding.Callsite(__self, '#TabControl::super.Text', __super.Text, [value]);
    }
    this.GetType = function () { // override
        if (__typeinfo == null) {
            __typeinfo = TabControl.prototype.GetType();
        }
        return __typeinfo;
    }
    this.ULDOM = function () {
        return __ulcontainer; 
    }
    this.RefreshSize = function () {
        'use strict'
        //this.Update();
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
            //this.Update();
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
        //this.Update(arguments[0], 'padding');
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
                changeImg(count - 1, this, 2);
                $('input[name=CurrentPpage]').val(_currentPpage);
                //this.Update();
            }
        }
    }
    this.RollingEffect = function () {
        'use strict'
        if (arguments.length <= 0) {
            return _rollingEffect;
        } else {
            var count = Number(arguments[0]);
            if (isNaN(count)) {
                Throwable.ArgumentOutOfRangeException();
            }
            _rollingEffect = count;

                //this.Update();
            }
        }
    
    this.Dock = function () {
        'use strict'

        if (arguments.length <= 0) {
            return _dockMode;
        } else {
            var mode = Number(arguments[0]);
            if (isNaN(mode) || !DockStyle.IsDefined(mode)) {
                Throwable.ArgumentOutOfRangeException();
            }
            if (_dockMode != mode) {
                _dockMode = mode;
                PublishEvent(this.EventSet.DockChanged, mode);
            }
            var sef = __self;
            setTimeout(function () {
                sef.Update();
            }, 400);
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
    this.BroadcastTime = function () {
        'use strict'
        if (arguments.length <= 0) {
            return _broadcastTime;
        } else {
            var count = Number(arguments[0]);
            if (isNaN(count)) {
                Throwable.ArgumentOutOfRangeException();
            }
            if (_broadcastTime !== count) {
                _broadcastTime = count;
                $('input[name=BroadcastTime]').val(_broadcastTime);
                if (Number(_broadcastTime) <= 0) {
                    _isDetailedListTime = true;
                    clearInterval(timer);
                } else {
                    _isDetailedListTime = false;
                    clearInterval(timer);
                    ClothAnimation(__self, _broadcastTime * 1000);
                }
                //this.Update();
            }
        }
    }
    this.Update = function () {
        'use strict'
        var UlDOM = __ulcontainer;
        if (UlDOM) {
            __ulcontainer.find('.item').height($(this)[0].Height());
            if (_rollCloth) {
                //var controList = _rollCloth.Controls.GetAll();
                //if (_ScrollDirection == 1) {
                //    _rollCloth.Width(__self.Width() );
                //    _rollCloth.Height(__self.Height() * controList.length);
                //} else {
                //    _rollCloth.Width(__self.Width() * controList.length);
                //    _rollCloth.Height(__self.Height());
                //}
                // for (var i = 0; i < controList.length;i++) {
                //controList[i].Width(__self.Width());
                //controList[i].Height(__self.Height());
                //}
                _rollCloth.Dock(0);
                _rollCloth.Dock(5);
                var controList = _rollCloth.Controls.GetAll();
                for (var i = 0; i < controList.length; i++) {
                    controList[i].Dock(0);
                    controList[i].Dock(5);
                    if (controList[i].Controls.GetAll().length > 0) {
                        var a = controList[i].Controls.GetAll();
                        for (var j = 0; j < a.length; j++) {
                            a[j].Dock(0);
                            a[j].Dock(5);
                        }
                    }
                }
            }
        }
    };
    function ClothAnimation(con, time) {
        //var __cons = con;
        //if (timer) {
        //    clearInterval(timer);
        //    //  timer = null;
        //}
        if (time == undefined)
            time = 5000;
        clearInterval(timer);
        timer = setInterval(autoPlay, time);
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
    }
    function changeImg(curIndex, con, type) {
        var as = con;
        var rollClothControl = as.Controls.GetAll()[0];
        wrap = as.DOM(),
            pic = rollClothControl.DOM()[0],
            list = rollClothControl.Controls.GetAll();

        clearInterval(animation);
        if (list.length <= 0)
            return;
        for (var j = 0; j < list.length; j++) {
            list[j].DOM()[0].classList.remove("current");
        }
        //if (type != 2) {
        //    as.CurrentPpage(curIndex + 1);
        //}
        if (list[curIndex] == undefined)
            return;
        // 改变当前显示索引
        list[curIndex].DOM()[0].classList.add("current");
        index = curIndex;
        if (type == 0) {
            pic.style.marginTop = a + 'px';
            return;
        }
        //if (curIndex == 0) {
        //    for (var j = 0; j < list.length; j++) {
        //        list[j].DOM().show(1000);
        //    }
        //    return;
        //}
        //list[curIndex - 1].DOM().hide(1500);

        //if (as.RollingEffect() == 0) {
        //    for (var j = 0; j < list.length; j++) {
        //        list[j].DOM().hide();
        //    }
        //    setTimeout(function () {
        //        list[curIndex].DOM().show();
        //    }, 1500);
        //}
        //if (as.RollingEffect() == 1) {
        //    for (var j = 0; j < list.length; j++) {
        //        list[j].DOM().fadeOut();
        //    }
        //    setTimeout(function () {
        //        list[curIndex].DOM().fadeIn();
        //    }, 1000);
        //}
        if (as.RollingEffect() == 2) {
            if (list[curIndex - 1]) {
                //list[curIndex - 1].DOM().slideUp();
                var dom = list[curIndex - 1].DOM();
                dom.css('-webkit-backface-visibility', 'hidden');
                dom.css('-webkit-transform-style', 'preserve-3d')
                var doom = dom[0];
                //doom.style.transitionobj = "-webkit-transform 1000ms ease-out";
                doom.style.webkitTransform = "translate(0px,0px) scale(1) translateY(0px)";
                doom.style.transition = "all 1s";
                doom.style.WebkitTransition = "all 1s";
            } else {
                var Bdom = list[list.length - 1].DOM();
                Bdom.css('-webkit-backface-visibility', 'hidden');
                Bdom.css('-webkit-transform-style', 'preserve-3d')
                var Bdoom = Bdom[0];
                //doom.style.transitionobj = "-webkit-transform 1000ms ease-out";
                Bdoom.style.webkitTransform = "translate(0px,0px) scale(1) translateY(0px)";
                Bdoom.style.transition = "all 1s";
                Bdoom.style.WebkitTransition = "all 1s";
            }
            setTimeout(function () {
                //list[curIndex].DOM().slideDown();
                var dom = list[curIndex].DOM();
                dom.css('-webkit-backface-visibility', 'hidden');
                dom.css('-webkit-transform-style', 'preserve-3d')
                var doom = dom[0];
                //doom.style.transitionobj = "-webkit-transform 1000ms ease-out";
                doom.style.webkitTransform = "translate(0px," + dom.height() + "px) scale(1) translateY(0px)";
                doom.style.transition = "all 1s";
                doom.style.WebkitTransition = "all 1s";
            }, 1000);
        }
    }

    this.UpdateFont = function () {

    };
    this.Dispose = function () {
        if (!_disposed) {
            //__items.Synchronizer(null);
            __items.RemoveAll();
            __self.Parent(null);
            var controList = _rollCloth.Controls.GetAll();
            for (var i = 0; i < controList.length; i++) {
                controList[i].Parent(null);
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
    console.log('方法成功');
    !(function () {
        'use strict'
        __ulcontainer = $('<div id="myCarousel" >\
      </div>');
        console.log('新建内部rollCloth控件');
        var com = {
            "componentid": "HtmlControl",
            "codeurl": "HtmlControl.js",
            "type": 0,
            "description": "控件的基类",
            "references": "../resources/js/HtmlControl.js",
            "inheritances": null,
            'Name':'pagRollCloth'
        };
        //_rollCloth = HtmlDesigner.Control.New(com);
        _rollCloth = HtmlControl.New(com);
        _rollCloth.Parent(__self);
        //_rollCloth.Width(__self.Width());
        //_rollCloth.Height(__self.Height());
        _rollCloth.Dock(0);
        _rollCloth.Dock(5);
        _rollCloth.Name(__self.Name()+'pagRollCloth');
        _rollCloth.BorderWidth('0');
        console.log('创建内部rollCloth控件成功');
        console.log('添加__ulcontainer');
        __container.append(__ulcontainer);
        console.log('添加__ulcontainer成功');
        HtmlControl.Initialization(__self, HtmlControl.defaults, options);
        console.log('执行定时换页方法');
        __self.RollClothAnimation();
        console.log('执行定时换页方法成功');
    })();
};

TabControl.EventSet = function () {
    'use strict'

    Object.Merge(this, HtmlControl.EventSet);

    this.Click = 'Click';
}
!(function () {
    TabControl.EventSet = new TabControl.EventSet();
    var eventset = TabControl.EventSet;
})();

var TabControlItem = function (options) {
    'use strict'
    console.log('初始化itmes属性');
    var index = -1;
    var time = 0;
    var broadcastBox = null;
    var liDOM = null;
    var self = this;
    var typeinfo = null;
    var disposed = false;
    var starttime = new Date();
    var endtime = new Date();
    var fileSelect = '';
    //var _controls = new HtmlView.ControlCollection(this);


    //Object.defineProperty(self, 'Controls', {
    //    get: function () {
    //        return _controls;
    //    }
    //});
    console.log('初始化itmes属性成功');
    console.log('初始化itmes属性方法');
    var AppendLIDOMToULDOM = function () {
        'use strict'
        if (broadcastBox) {
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
            //var con = HtmlDesigner.Control.New(com);
           // var self = HtmlControl.New(com);
            self.DOM().addClass('item');
            self.Parent(broadcastBox.Controls.GetAll()[0]);
            //self.Width(broadcastBox.Width());
            //self.Height(broadcastBox.Height());
            self.Dock(5);
            //con.Dock(3);
            self.BorderWidth('0');
            var lengs = broadcastBox.Controls.GetAll()[0].Controls.GetAll().length;
            self.Text(lengs);
            self.Name(broadcastBox.Name() + 'Pag' + lengs); 
            
            //self.DOM().css('float', 'left'); 
            //self.DOM().css('position', 'initial');
            //con.DOM().hover(function () {
            //    console.log(this);
            //});
            // container.find('.carousel-inner').append(liDOM);
            self.Update(broadcastBox);
            setTimeout(function () {
                var d = self.DOM();
                d.css('top', '-' + d.css('height'));
                if (lengs == 1) {
                    var doom = d[0];
                    doom.style.webkitTransform = "translate(0px," + d.height() + "px) scale(1) translateY(0px)";
                    doom.style.transition = "all 1s";
                    doom.style.WebkitTransition = "all 1s";
                }
            
            }, 900);
        };
    };
    var RemoveLIDOMInULDOM = function () {
        'use strict'
        if (liDOM) {
            liDOM.remove();
        }
        liDOM = null;
    }
    this.FileSelect = function () {
        'use strict'
        if (arguments.length <= 0) {
            return fileSelect;
        }
        fileSelect = arguments[0];
        this.Update();
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
    this.StartTime = function () {
        'use strict'

        if (arguments.length <= 0) {
            return starttime;
        }
        starttime = new Date(arguments[0]);
    }
    this.EndTime = function () {
        'use strict'
        if (arguments.length <= 0) {
            return endtime;
        }
        endtime = new Date(arguments[0]);
    }
    this.TabControl = function (){
        'use strict'

        if (arguments.length <= 0) {
            return broadcastBox;
        }
        var get = Object.GetPropertyValue;
        var current = arguments[0];
        if (!__instanceof(current, TabControl)) {
            current = null;
        }
        RemoveLIDOMInULDOM();
        do {
            var ever = broadcastBox;
            broadcastBox = current;
        } while (0, 0);
        AppendLIDOMToULDOM();
        if (ever && !current) {
            var items = get(ever, 'Items');
            if (items.Contains(self)) {
                items.RemoveAt(self);
            }
        }
    }
    this.Update = function (con) {
        'use strict'
        //dialog.control.Controls.GetAll()[0].Controls.GetAll();
        if (con) {
            var pagRoll = con.Controls.GetAll()[0];
            if (pagRoll) {
                var pagList = pagRoll.Controls.GetAll();
                var pagRollWidth = con.Width() * pagList.length;
                pagRoll.Width(pagRollWidth);
            }
        }
        //var pagRoll = dialog.control.Controls.GetAll()[0];
        //if (pagRoll) {
        //    var pagList = pagRoll.Controls.GetAll();
        //    var pagRollWidth = dialog.control.Width() * pagList.length;
        //    pagRoll.Width(pagRollWidth);
        //}
    }
    this.GetType = function () { // override
        'use strict'
        if (typeinfo == null) {
            typeinfo = TabControlItem.prototype.GetType();
        }
        return typeinfo;
    }
    var GetULDOM = function () {
        'use strict'

        if (!broadcastBox) {
            return null;
        }
        var dom = Object.GetPropertyValue(broadcastBox, 'ULDOM');
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
            this.TabControl(null);
        }
    }
    console.log('初始化itmes属性方法成功');
    !(function () {
        'use strict'
        console.log('执行itmes!(function(){})');
        if (!Object.IsNullOrUndefined(options) || typeof options === 'object') {
            for (var key in options) {
                if (!self.hasOwnProperty(key)) {
                    continue;
                }
                var value = Object.GetPropertyValue(options, key);
                Object.SetPropertyValue(self, key, value);
            }
        }
        console.log('执行itmes!(function(){})成功');
    })();
    //Object.defineProperty(this, "IsDisposed", {
    //    get: function () {
    //        return disposed;
    //    }
    //});
}

var TabControlItemCollection = function (owner) {
    'use strict'
    console.log('初始化TabControlItemCollection');
    if (!__instanceof(owner, TabControl)) {
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
                if (__instanceof(item, TabControlItem)) {
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
            if (!__instanceof(item, TabControlItem)) {
                if (typeof item !== 'object') {
                    Throwable.ArgumentOutOfRangeException();
                }
                item = TabControlItem.New(item);
            }
            if (!__super.internal.Insert(index, item)) {
                return false;
            }
            var set = Object.SetPropertyValue;
            set(item, 'Index', index);
            set(item, 'TabControl', owner);
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
                if (__instanceof(item, TabControlItem)) {
                    var set = Object.SetPropertyValue;
                    set(item, 'Index', -1);
                    set(item, 'TabControl', null);
                    this.Update(index);
                }
                if (current !== __super.internal.Count()) {
                    this.Update(index);
                }
            }
            return item;
        }
        this.IndexOf = function (item) {
            if (!__instanceof(item, TabControlItem)) {
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
    console.log('初始化TabControlItemCollection成功！');
}
TabControlItemCollection.New = function (owner) {
    return Collection.New(owner, [TabControlItemCollection]);
}

TabControl.prototype.GetType = function () {
    console.log('加载TabControlGetType()');
    var typeinfo = HtmlControl.prototype.GetType();
    typeinfo.FullName = Type.GetName(TabControl);
    typeinfo.References.push('TabControl.js');
    var proList = typeinfo.Properties;
    for (var i = 0; i < proList.length; i++) {
        if (proList[i].Name == "Controls") {
            proList[i].Browsable = false;
            break;
        }
    }
    typeinfo.Properties.push({
        Name: 'RefreshSize',
        PropertyType: 'number',
        Readable: true,
        Writeable: true,
        Browsable: true,
        Description: '获取或设置每行显示item数量。',
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
    
    typeinfo.Properties.push({
        Name: 'BroadcastTime',
        PropertyType: 'number',
        Readable: true,
        Writeable: true,
        Browsable: true,
        Description: '轮播间隔时间。',
        Accessor: 'function',
    }, {
            Name: 'RollingEffect',
            PropertyType: 'number,RollingEffect,select',
            Readable: true,
            Writeable: true,
            Browsable: true,
            Description: '滚动效果。',
            Accessor: 'function',
        }); 
    console.log('加载TabControlGetType()成功');
    return typeinfo; 
}
// 实例化一个可用的高级选择夹页控件。
TabControlItem.New = function (options) {
    return HtmlControl.New(options, [TabControlItem]);
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
TabControlItem.prototype.GetType = function () {
   // var typeinfo = new Type();
    console.log('加载TabControlItem.GetType()');
    var typeinfo = HtmlControl.prototype.GetType();
    typeinfo.FullName = Type.GetName(TabControlItem);
    typeinfo.References.push('TabControl.js');
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
        Name: 'StartTime',
        PropertyType: 'string,DateTime',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: true,
        Description: '素材开始时间。',
        Accessor: 'function',
    },{
        Name: 'EndTime',
        PropertyType: 'string,DateTime',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: true,
        Description: '素材开始时间。',
        Accessor: 'function',
    }, {
        Name: 'TemplateSelect',
        PropertyType: 'string',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: true,
        Description: '模板选择。',
        Accessor: 'function',
        }, {
            Name: 'Controls',
            PropertyType: 'Collection,HtmlView.ControlCollection',
            Readable: true,
            Writeable: true,
            Browsable: true,
            DataBind: false,
            Description: '获取包含在视图内的控件的集合。',
            Accessor: 'property',
        }];
/*
  {
        Name: 'Controls',
        PropertyType: 'Collection,HtmlView.ControlCollection',
        Readable: true,
        Writeable: false,
        Browsable: true,
        DataBind: false,
        Description: '获取包含在视图内的控件的集合。',
        Accessor: 'property',
    }
*/
    console.log('加载TabControlItem.GetType()成功');
    return typeinfo;
}
//function StartTimer(dome, style, boxhig) {
//    var top = 0;
//    var type = 'top';
//    var high = dome.height();
//    if (style == 2) {
//        type = 'bottom';
//        high = dome.height();
//    }
//    if (ScrollDirectionTimer)
//        clearInterval(ScrollDirectionTimer);
//    dome.css(type, 0);
//    if (style == 0) {
//        return;
//    }
//    ScrollDirectionTimer = window.setInterval(function () {
//        top--;
//        dome.css(type, top);
//        //if (top < '-'+high) {
//        //    top = 0;
//        //};
//    }, 10);
//    setInterval(function () {
//        if (top < '-' + high) {
//            top = boxhig;
//        };
//    }, 1500)
//}


!(function () {
    //Type.References.Add('TabControl.js');
    Type.DefinedName('TabControl', 'TabControl');
    Type.DefinedName('TabControlItem', 'TabControlItem');

    Type.DefinedFile('TabControl', 'TabControl.js');
    Type.DefinedFile('TabControlItem', 'TabControl.js');

   
})();
// 定义图片切换函数
    