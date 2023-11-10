'use strict'

var Throwable = {
    // 在无法实现请求的方法或操作时引发的异常。
    NotImplementedException: function () {
        throw Error('System.NotImplementedException');
    },
    // 当调用的方法不受支持，或试图读取、查找或写入不支持调用功能的流时引发的异常。
    NotSupportedException: function () {
        throw Error('System.NotSupportedException');
    },
    // 尝试取消引用空对象引用时引发的异常。
    NullReferenceException: function () {
        throw Error('System.NullReferenceException');
    },
    // 当方法调用对于对象的当前状态无效时引发的异常。
    InvalidOperationException: function () {
        throw Error('System.InvalidOperationException');
    },
    // 当程序包含无效 JavaScript 中间语言 (JSIL) 或元数据时将引发的异常。这通常表示生成程序的解释器中有 bug。
    InvalidProgramException: function () {
        throw Error('System.InvalidProgramException');
    },
    // 对已释放的对象执行操作时所引发的异常。
    ObjectDisposedException: function () {
        throw Error('System.ObjectDisposedException');
    },
    // 在向方法提供的其中一个参数无效时引发的异常。
    ArgumentException: function () {
        throw Error('System.ArgumentException');
    },
    // 当将空引用（在 Visual Basic 中为 Nothing）传递给不接受它作为有效参数的方法时引发的异常。
    ArgumentNullException: function () {
        throw Error('System.ArgumentNullException');
    },
    // 当参数值超出调用的方法所定义的允许取值范围时引发的异常。
    ArgumentOutOfRangeException: function () {
        throw Error('System.ArgumentOutOfRangeException');
    },
};
// BKDR Hash Function
String.BKDRHash = function (str) {
    'use strict'

    var seed = 131; // 31 131 1313 13131 131313 etc..
    var hash = 0;
    var i = 0;
    while (i < str.length) {
        hash = hash * seed + (str.charCodeAt(i++));
    }
    return (hash & 0x7FFFFFFF);
}
// JS Hash Function
String.JSHash = function (str) {
    'use strict'

    var hash = 1315423911;
    var i = 0;
    while (i < str.length) {
        hash ^= ((hash << 5) + str.charCodeAt(i++) + (hash >> 2));
    }
    return (hash & 0x7FFFFFFF);
}
// AP Hash Function
String.APHash = function (str) {
    'use strict'

    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        if ((i & 1) == 0) {
            hash ^= ((hash << 7) ^ str.charCodeAt(0) ^ (hash >> 3));
        }
        else {
            hash ^= (~((hash << 11) ^ str.charCodeAt(0) ^ (hash >> 5)));
        }
    }
    return (hash & 0x7FFFFFFF);
}

String.prototype.replaceAll = function (oldstr, newstr) {
    'use strict'

    if (typeof oldstr !== 'string' || typeof newstr !== 'string') {
        return this;
    }
    try {
        var regexp = new RegExp(oldstr, 'gm');
        return this.replace(regexp, newstr);
    } catch (e) {
        var s = this;
        while (s.indexOf(oldstr) > -1) {
            s = s.replace(oldstr, newstr);
        }
        return s;
    }
}
/*
 *  Binding class
 *     designers: liulilte
 *  提供对绑定定义的高级访问，该绑定连接绑定目标对象（通常为 DOM 元素）的属性和任何数据源（例如数据库、XML 文件，或包含数据的任何对象）。
 */
var Binding = function () { // ECMAScript 5.0
    /* 
     * MetadataToken(RID)
     *  typedef 
     *      Binding class
     */
    var control = arguments[0],
        propertyName = arguments[1],
        dataSource = arguments[2],
        dataMember = arguments[3];
    if (!control || !propertyName || !dataSource || !dataMember) {
        Throwable.ArgumentNullException();
    }
    var isBindingExists = arguments[4];
    var isNewOrOpen = arguments[5];
    var enabled = true;
    var self = this;
    var disposed = false;
    !(function () {
        var requireAvailable = function (o, k) {
            if (typeof o === 'string') {
                o = eval(o);
            }
            if (Object.IsNullOrUndefined(o) || !o.hasOwnProperty(k)) {
                Throwable.InvalidOperationException();
            }
        };
        requireAvailable(control, propertyName);
        requireAvailable(dataSource, dataMember);
    })();
    !(function () {
        var typeinfo = null;
        self.GetType = function () {
            if (self.typeinfo === null) {
                self.typeinfo = Binding.prototype.GetType();
            }
            return self.typeinfo;
        }
        self.GetControlObject = function () {
            return Object.GetInstance(control);
        }
        self.GetDataSourceObject = function () {
            return Object.GetInstance(dataSource);
        }
        Object.defineProperty(self, "Control", {  // readonly
            get: function () {
                return control;
            }
        });
        Object.defineProperty(self, "DataSource", { // readonly
            get: function () {
                return dataSource;
            }
        });
        Object.defineProperty(self, "PropertyName", {  // readonly
            get: function () {
                return propertyName;
            }
        });
        Object.defineProperty(self, "DataMember", {  // readonly
            get: function () {
                return dataMember;
            }
        });
        Object.defineProperty(self, "IsDisposed", {
            get: function () {
                return disposed;
            }
        });
    })();
    !(function () {
        'use strict'

        var newOrOpenSynchronism = (function (from, fromKey, to, toKey, copyTo) { // 多路同步
            'use strict'

            var fromName = null,
                toName = null,
                hooks = null;
            var externs = new (function () {
                'use strict'

                var self = this;
                var sinker = {
                    get: function () {
                        return self.getValue(hooks);
                    },
                    set: function (value) {
                        return self.updateValues(hooks, value);
                    }
                }
                this.getTotalName = function () {
                    'use strict'

                    var fk = fromKey;
                    var tk = toKey;
                    var fr = from;
                    var tt = to;

                    var options = arguments[0];
                    if (!options) {
                        fk = options.fromKey;
                        tk = options.toKey;
                        fr = options.from;
                        tt = options.to;
                    }
                    return Binding.GetBinding.GetTotalName(this.inst(fr), fk, this.inst(tt), tk);
                }
                this.getFromName = function () {
                    var fr = from;
                    var fk = fromKey;
                    return Binding.GetBinding.GetFromName(this.inst(fr), fk);
                };
                this.getFromName2 = function () {
                    'use strict'

                    var fk = fromKey;
                    var fr = from;
                    if (arguments.length >= 2) {
                        fk = arguments[1];
                        fr = arguments[0];
                    }
                    return Binding.GetBinding.GetFromName(this.inst(fr), fk);
                }
                this.getToName = function () {
                    var tt = to;
                    var tk = toKey;
                    return Binding.GetBinding.GetToName(this.inst(tt), tk);
                };
                this.getToName2 = function () {
                    'use strict'

                    var tk = toKey;
                    var tt = to;
                    if (arguments.length >= 2) {
                        tk = arguments[1];
                        tt = arguments[0];
                    }
                    return Binding.GetBinding.GetToName(this.inst(tt), tk);
                }
                this.inst =
                    this.instance = Object.GetInstance;
                this.setupSinker = function (hooks) {
                    var inst = this.inst(from);
                    if (typeof inst[fromKey] === 'function') {
                        inst[fromKey] = function () {
                            return arguments.length <= 0 ? sinker.get() : sinker.set(value);
                        }
                    } else {
                        Object.defineProperty(inst, fromKey, sinker);
                    }
                }
                this.getCallingSinker = function () {
                    return sinker;
                }
                this.getValue = function () {
                    var o = this.inst(from);
                    if (!o.hasOwnProperty(fromName)) {
                        return o[fromKey];
                    } else {
                        var hooks = o[fromName];
                        var result = hooks.value;
                        if (typeof result === 'function') {
                            result = Binding.Callsite(o, '#HooksGetValue', result);
                        }
                        return result;
                    }
                }
                this.isSetupSinker = function () {
                    return this.getHooks() ? true : false;
                }
                this.getHooks = function () {
                    var n = from;
                    var n2 = fromName;
                    if (arguments.length > 0) {
                        n = arguments[0];
                    }
                    if (arguments.length > 1) {
                        n2 = arguments[1];
                    }
                    var o = externs.inst(n);
                    return o[n2];
                }
                this.setupHooks = function (hooks) {
                    if (!hooks) {
                        Throwable.ArgumentNullException();
                    }
                    if (this.isSetupSinker()) {
                        Throwable.InvalidOperationException();
                    }
                    var o = externs.inst(from);
                    Object.defineProperty(o, fromName, {
                        get: function () {
                            return hooks;
                        }
                    });
                }
                this.getHooks2 = function (synctochain) {
                    var owner = synctochain.hooks;
                    if (!owner) {
                        owner = this.getHooks(synctochain.to, synctochain.toFromName);
                        synctochain.hooks = owner;
                    }
                    return owner;
                }
                this.setupHooksAndSinker = function (hooks) {
                    if (this.isSetupSinker()) {
                        Throwable.InvalidOperationException();
                    }
                    this.setupHooks(hooks);
                    this.setupSinker(hooks);
                }
                this.updateValues = function (hooks, value) {
                    'use strict'

                    if (!hooks) {
                        Throwable.ArgumentNullException();
                    }
                    if (typeof hooks !== 'object') {
                        Throwable.ArgumentOutOfRangeException();
                    }
                    var ignores = arguments[2];
                    var origin = arguments[3];
                    if (!ignores || typeof ignores !== 'object') {
                        ignores = new Object({});
                    }
                    if (!origin || typeof origin !== 'object') {
                        origin = hooks;
                    }
                    this.callSetValue(hooks, value);
                    var synctochains = hooks.synctochains;
                    for (var key in synctochains) {
                        if (ignores.hasOwnProperty(key)) {
                            break;
                        } else {
                            ignores[key] = true;
                        }
                        var current = synctochains[key];
                        var binding = current.binding;
                        var owner = this.getHooks2(current);
                        if (owner === origin || binding.IsDisposed || !binding.Enabled) {
                            continue;
                        }
                        this.callSetValue(owner, value);
                        this.updateValues(owner, value, ignores, origin);
                    }
                }
                this.callSetValue = function (hooks, value) {
                    if (!hooks) {
                        Throwable.ArgumentNullException();
                    }
                    if (typeof hooks !== 'object') {
                        Throwable.ArgumentOutOfRangeException();
                    }
                    var setAttr = hooks.value;
                    if (typeof setAttr !== 'function') {
                        return hooks.value = value;
                    } else {
                        var o = this.inst(hooks.from);
                        if (!hooks.siteTempName) {
                            hooks.siteTempName = this.getTotalName(hooks);
                        }
                        return Binding.Callsite(o, hooks.siteTempName, setAttr, [value]);
                    }
                }
                this.syncOnceValue = function () {
                    var value = externs.getValue();
                    var hooks = externs.getHooks();
                    externs.updateValues(hooks, value);
                }
            });
            fromName = externs.getFromName();
            toName = externs.getToName();
            if (externs.isSetupSinker()) {
                hooks = externs.getHooks();
            } else {
                if (isBindingExists) {
                    throw false;
                }
                hooks = new Binding.constructor.BindingHooker();
                hooks.value = externs.getValue();
                hooks.from = from;
                hooks.to = to;
                hooks.count = 0;
                hooks.fromKey = fromKey;
                hooks.toKey = toKey;
                hooks.toKeyToName = externs.getFromName2(to, toKey);
                hooks.synctochains = new Object({});

                externs.setupHooksAndSinker(hooks);
            }
            var synctochains = hooks.synctochains;
            var exists = synctochains.hasOwnProperty(toName);
            if (exists && isNewOrOpen) {
                var chains = synctochains[toName];
                if (!chains) {
                    Throwable.InvalidOperationException();
                }
                throw chains.binding;
            }
            if (isBindingExists) {
                throw exists;
            }
            if (exists) {
                Throwable.InvalidOperationException();
            } else {
                synctochains[toName] = new Object({
                    toKey: toKey,
                    to: to,
                    binding: self,
                    toFromName: externs.getFromName2(to, toKey),
                });
                hooks.count++;
            }
            if (copyTo && externs.isSetupSinker()) {
                Object.defineProperty(self, 'Enabled', {
                    get: function () {
                        return enabled;
                    },
                    set: function (value) {
                        var synconcevalue = false;
                        if (value && !enabled) {
                            synconcevalue = true;
                        } else {
                            enabled = value;
                        }
                        if (synconcevalue) {
                            externs.syncOnceValue();
                        }
                    }
                });
                externs.syncOnceValue();
            }
            return new Object({
                'externs': externs,
                'hooks': hooks,
                'attach': {
                    'toName': toName,
                    'fromName': fromName,
                    'sinker': externs.getCallingSinker(),
                },
                'close': function () {
                    if (!synctochains.hasOwnProperty(toName)) {
                        return false;
                    }
                    var current = synctochains[toName];
                    var hooks = externs.getHooks2(current);
                    synctochains[toName] = undefined;
                    try {
                        delete synctochains[toName];
                    } catch (e) { /**/ }
                    return hooks.count-- > 0;
                },
            });
        });
        var synchronisms = [
            newOrOpenSynchronism(control, propertyName, dataSource, dataMember, 0x00),
            newOrOpenSynchronism(dataSource, dataMember, control, propertyName, 0x01),
        ];
        self.Dispose = function () {
            if (!disposed) {
                if (self.Enabled) {
                    self.Enabled = false;
                }
                for (var i = 0; i < synchronisms.length; i++) {
                    var synchronism = synchronisms[i];
                    synchronism.close();
                }
                disposed = true;
            }
        };
    })();
};
(function () {
    'use strict'

    var NAME = 'Binding';


    Binding.constructor.BindingHooker = function () {
        /* 
         * MetadataToken(RID)
         *  typedef 
         *      Binding.constructor.BindingHooker class
         */
        this.Tag = null;
    }

    Binding.GetBindings = function (owner, key) {
        'use strict'

        if (Object.IsNullOrUndefined(owner)) {
            Throwable.ArgumentNullException();
        }
        owner = Object.GetInstance(owner);
        if (typeof owner !== 'object') {
            Throwable.ArgumentOutOfRangeException();
        }
        var s = arguments[2];
        if (!__instanceof(s, Array)) {
            s = [];
        }
        var counts = (arguments[3] ? true : false);
        if (counts) {
            s = 0;
        }
        var find = Binding.GetBindings.Find;
        if (typeof key === 'string') {
            var fk = Binding.GetBinding.GetFromName(owner, key);
            var r = find(owner, fk, s, counts);
            if (counts) {
                s += r;
            }
        } else {
            var keys = Object.getOwnPropertyNames(owner);
            for (var i = 0; i < keys.length; i++) {
                var r = find(owner, keys[i], s, counts);
                if (counts) {
                    s += r;
                }
            }
        }
        return s;
    }
    Binding.GetBindings.Find = function (owner, key, s) {
        'use strict'

        var counts = (arguments[3] ? true : false);
        if (!__instanceof(owner[key], Binding.constructor.BindingHooker)) {
            return 0;
        }
        var hooks = owner[key];
        if (counts) {
            return hooks.count;
        }
        var synctochains = hooks.synctochains;
        for (var key in synctochains) {
            var current = synctochains[key];
            s.push({
                Control: hooks.from,
                PropertyName: hooks.fromKey,
                DataSource: current.to,
                DataMember: current.toKey,
                Binding: current.binding,
            });
        }
        return 0;
    }
    Binding.GetBinding = function (owner, key, data, dataMember) {
        'use strict'

        if (Object.IsNullOrUndefined(owner)) {
            Throwable.ArgumentNullException();
        }
        owner = Object.GetInstance(owner);
        data = Object.GetInstance(data);
        if (typeof owner !== 'object') {
            Throwable.ArgumentOutOfRangeException();
        }
        if (typeof key !== 'string' || typeof dataMember !== 'string') {
            return undefined;
        }
        var fk = Binding.GetBinding.GetFromName(owner, key);
        if (!__instanceof(owner[fk], Binding.constructor.BindingHooker)) {
            return undefined;
        }
        var hooks = owner[fk];
        var synctochains = hooks.synctochains;
        var tk = Binding.GetBinding.GetToName(data, dataMember);
        var rr = synctochains[tk];
        return !rr ? undefined : {
            Control: hooks.from,
            PropertyName: hooks.fromKey,
            DataSource: rr.to,
            DataMember: rr.toKey,
            Binding: rr.binding,
        };
    }
    Binding.Close = function (owner, key, data, dataMember) {
        'use strict'

        var e = arguments[4];
        if (!e) {
            e = Binding.GetBinding(owner, key, data, dataMember);
        }
        if (!e) {
            return false;
        }
        var binding = e.Binding;
        if (binding.IsDisposed) {
            Throwable.InvalidOperationException();
        }
        binding.Dispose();
        if (!binding.IsDisposed) {
            Throwable.InvalidOperationException();
        }
        return true;
    }
    Binding.IsClosed = function (owner, key, data, dataMember) {
        'use strict'

        var e = arguments[4];
        if (!e) {
            e = Binding.GetBinding(owner, key, data, dataMember);
        }
        if (!e) {
            return undefined;
        }
        var binding = e.Binding;
        return binding.IsDisposed ? e : undefined;
    }
    Binding.CloseAll = function (owner, key) {
        'use strict'

        var s = Binding.GetBindings(owner, key);
        var c = 0;
        for (var i = 0; i < s.length; i++) {
            var e = s[i];
            if (!e) {
                continue;
            }
            if (Binding.Close(null, null, null, null, e)) {
                c++;
            }
        }
        return c;
    }
    Binding.GetBindingCount = function (owner, key) {
        return Binding.GetBindings(owner, key, null, true);
    }
    Binding.New = function (owner, propertyName, dataSource, dataMember) {
        return new Binding(owner, propertyName, dataSource, dataMember);
    }
    Binding.NewOrOpen = function (owner, propertyName, dataSource, dataMember) {
        'use strict'

        try {
            var e = Binding.GetBinding(owner, propertyName, dataSource, dataMember);
            if (e) {
                return e.Binding;
            }
            return new Binding(owner, propertyName, dataSource, dataMember, false, true);
        } catch (e) {
            if (!__instanceof(e, Binding)) {
                throw e;
            }
            return e;
        }
    }
    Binding.Exists = function (owner, propertyName, dataSource, dataMember) {
        'use strict'

        try {
            var e = Binding.GetBinding(owner, propertyName, dataSource, dataMember);
            if (e) {
                return true;
            }
            var o = new Binding(owner, propertyName, dataSource, dataMember, true);
            return false;
        } catch (e) {
            return typeof e === 'boolean' ? e : false;
        }
    }
    Binding.Callsite = function (target, name, callback, args) {
        'use strict'

        if (typeof name !== 'string') {
            Throwable.ArgumentOutOfRangeException();
        }
        var exception = null;
        var result = undefined;
        var directing = Object.IsNullOrUndefined(target) || typeof target !== 'object';
        try {
            var expression = null;
            if (directing) {
                expression = 'callback(';
            } else {
                expression = 'target[name](';
                if (typeof callback === 'function') {
                    target[name] = callback;
                }
            }
            if (Type.IsIndexer(args)) {
                for (var i = 0; i < args.length; i++) {
                    var parameter = 'args[' + i + ']';
                    if (i < (args.length - 1)) {
                        parameter += ',';
                    }
                    expression += parameter;
                }
            }
            expression += ')';
            result = eval(expression);
        } catch (e) {
            exception = e;
        }
        if (!directing && typeof callback === 'function') {
            try {
                if (target.hasOwnProperty(name)) {
                    target[name] = undefined;
                    delete target[name];
                }
            } catch (e) {
                if (!exception) {
                    exception = e;
                }
            }
        }
        if (exception != null) {
            throw exception;
        }
        return result;
    }

    Binding.GetBinding.GetId = function (o, k) {
        'use strict'

        var kk = NAME + String.JSHash(NAME + '.' + k);
        if (!o[kk]) {
            if (Object.IsNullOrUndefined(Binding.GetBinding.GetId.Value) || isNaN(Binding.GetBinding.GetId.Value)) {
                Binding.GetBinding.GetId.Value = 1 << 31;
            }
            var currentid = Number(new Date()) + String.JSHash(__uuid()) + Binding.GetBinding.GetId.Value++;
            Object.defineProperty(o, kk, {
                get: function () {
                    return currentid;
                }
            });
        }
        return o[kk];
    }
    Binding.GetBinding.GetFromName = function (fr, fk) {
        'use strict'

        var s1 = String.JSHash('s1.' + fk).toString();
        var s3 = null;
        if (typeof fr === 'object') {
            s3 = Binding.GetBinding.GetId(fr, fk).toString();
        } else {
            s3 = fr.toString();
        }
        s3 = String.JSHash('s3.' + s3).toString();
        return NAME + s1 + s3;
    }
    Binding.GetBinding.GetToName = function (tt, tk) {
        'use strict'

        var s2 = String.JSHash('s2.' + tk).toString();
        var s4 = null;
        if (typeof tt === 'object') {
            s4 = Binding.GetBinding.GetId(tt, tk).toString();
        } else {
            s4 = tt.toString();
        }
        s4 = String.JSHash('s4.' + s4).toString();
        return NAME + s2 + s4;
    }
    Binding.GetBinding.GetTotalName = function (fr, fk, tt, tk) {
        'use strict'

        var s1 = String.JSHash('s1.' + fk).toString();
        var s2 = String.JSHash('s2.' + tk).toString();
        var s3 = null;
        if (typeof fr === 'object') {
            s3 = Binding.GetBinding.GetId(fr, fk).toString();
        } else {
            s3 = fr.toString();
        }
        s3 = String.JSHash('s3.' + s3).toString();
        var s4 = null;
        if (typeof tt === 'object') {
            s4 = Binding.GetBinding.GetId(tt, tk).toString();
        } else {
            s4 = tt.toString();
        }
        s4 = String.JSHash('s4.' + s4).toString();
        return NAME + s1 + s2 + s3 + s4;
    }
})();
// 获取 Binding 原型的 Type (RTTI)信息。
Binding.prototype.GetType = function () {
    var type = new Type();
    type.FullName = Object.TypeOf(this);
    type.References.push('HtmlControl.js');
    type.Methods = [{
        Name: 'GetType',
        Description: '获取当前实例的 Type (RTTI)信息。',
    }];
    type.Properties = [{
        Name: 'Control',
        PropertyType: 'HtmlView,HtmlControl',
        Readable: true,
        Writeable: false,
        Browsable: true,
        DataBind: false,
        Description: '与之绑定的控件。',
        Accessor: 'property',
    }, {
        Name: 'DataSource',
        PropertyType: 'object',
        Readable: true,
        Writeable: false,
        Browsable: true,
        DataBind: false,
        Description: '之间绑定的数据契约对象。',
        Accessor: 'property',
    }, {
        Name: 'PropertyName',
        PropertyType: 'string',
        Readable: true,
        Writeable: false,
        Browsable: true,
        DataBind: false,
        Description: '与之绑定的控件的属性。',
        Accessor: 'property',
    }, {
        Name: 'DataMember',
        PropertyType: 'string',
        Readable: true,
        Writeable: false,
        Browsable: true,
        DataBind: false,
        Description: '之间绑定的数据契约对象的成员。',
        Accessor: 'property',
    }, {
        Name: 'Enabled',
        PropertyType: 'boolean',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置一个值，该值指示是否启此数据绑定。',
        Accessor: 'property',
    }];
    return type;
}
/*
 *  BindingsCollection class
 *     designers: liulilte
 *  代表某对象的 Binding 对象的集合。
 */
var BindingsCollection = function (owner) {
    /* 
     * MetadataToken(RID)
     *  typedef 
     *      BindingsCollection class
     */
    if (!owner) {
        Throwable.ArgumentNullException();
    }
    if (!(__instanceof(owner, HtmlView) || __instanceof(owner, HtmlControl))) {
        Throwable.ArgumentException();
    }
    var self = this;
    this.Add = function (propertyName, dataSource, dataMember) {
        var binding = Binding.New(owner, propertyName, dataSource, dataMember);
        var __super = { // override
            Dispose: binding.Dispose,
        };
        var key = String.JSHash(String.fromCharCode(35) + __uuid() +
            Number(new Date()).toString() +
            Math.random().toString()).toString();
        binding.Dispose = function () {
            //Binding.Callsite(binding, key, __super.Dispose, value);
            Binding.Callsite(binding, key, __super.Dispose);
        };
        return binding;
    }
    this.Contains = function (propertyName, dataSource, dataMember) {
        return this.Get(owner, propertyName, dataSource, dataMember) ? true : false;
    }
    this.Remove = function (propertyName, dataSource, dataMember) {
        return Binding.Close(owner, propertyName, dataSource, dataMember);
    }
    this.RemoveAll = function () {
        return this.Clear();
    }
    this.Clear = function () {
        return Binding.CloseAll(owner);
    }
    this.Get = function (propertyName, dataSource, dataMember) {
        return Binding.GetBinding(owner, propertyName, dataSource, dataMember);
    }
    this.GetAll = function (propertyName) {
        return Binding.GetBindings(owner, propertyName);
    }
    Object.defineProperty(self, 'Count', {
        get: function () {
            return Binding.GetBindingCount(owner);
        }
    });
    this.toString = function () {
        return '[object {0}]'.replace('{0}', Type.GetName(this.constructor));
    }
    return self;
}
// 重新定义指定变量的名称。
var RedefinedVariable = function () {
    var oldName = arguments[0],
        newName = arguments[1],
        hostVariable = arguments[2];
    if (!hostVariable) {
        hostVariable = window;
    }
    hostVariable[newName] = hostVariable[oldName];
    hostVariable[oldName] = undefined;
    try {
        delete hostVariable[oldName];
    } catch (e) { }
    if (hostVariable == window) {
        try {
            eval('delete ' + oldName);
        } catch (e) { }
    }
}
/*
 *  Color class
 *     designers: liulilte
 *  提供与颜色的高级访问。
 */
var Color = function () {
    /* 
     * MetadataToken(RID)
     *  typedef 
     *      Color class
     */
    'use strict'

    var color = arguments[0];
    try {
        if (typeof color == 'string') {
            if (color.toLowerCase().indexOf('rgb') >= 0) {
                color = Color.ArgbStringToArgbNumber(color);
            } else {
                color = Color.ArgbHexToArgbNumber(color);
            }
        } else if (__instanceof(color, Color)) {
            color = color.Argb;
        } else if (typeof color != 'number') {
            color = ~(1 << 31);
        }
    } catch (e) { }
    color = Number(color);

    this.A = (color >> 24) & 0xff;
    this.R = (color >> 16) & 0xff;
    this.G = (color >> 8) & 0xff;
    this.B = color & 0xff;

    Object.defineProperty(this, 'Argb', {
        get: function () {
            var n =
                (this.A & 0xff) << 24 |
                (this.R & 0xff) << 16 |
                (this.G & 0xff) << 8 |
                this.B & 0xff;
            return n;
        }
    });

    Object.defineProperty(this, 'Rgb', {
        get: function () {
            var n =
                (this.R & 0xff) << 16 |
                (this.G & 0xff) << 8 |
                this.B & 0xff;
            return n;
        }
    });

    this.toString = function (format) {
        var n = this.Argb;
        if (format === 'x' || format === 'h') {
            return Color.ArgbNumberToArgbHex(n);
        } else if (format === 'i' || format === 'd') {
            return n.toString();
        } else if (format === 'a' || format === 's') {
            return Color.ArgbNumberToArgbString(n);
        }
        return "{A=" + this.A + ", R=" + this.R + ", G=" + this.G + ", B=" + this.B + "}";
    }
};
// ARGB字符串转换成ARGB十六进制格式。
Color.ArgbStringToArgbHex = function (s) {
    var argb = '00000000';
    if (s) {
        var matchs = s.match(/(\d+)/g);
        if (matchs) {
            argb = '';
            for (var i = 0; i < matchs.length; i++) {
                var n = Number(matchs[i]);
                var hex = n.toString(16);
                if (hex.length < 2) {
                    hex = '0' + hex;
                }
                argb += hex;
            }
            while (argb.length != 8) {
                argb = "FF" + argb;
            }
        }
    }
    return argb.toUpperCase();
}
// ARGB十六进制格式转换成ARGB数值。
Color.ArgbHexToArgbNumber = function (hex) {
    if (hex) {
        var i = Math.ceil((hex.length / 2)) - 1;
        if ((hex.length & 1) > 0) {
            hex = "0" + hex;
        }
        var n = [0, 0, 0, 0];
        for (var p = 3; i >= 0; i--) {
            var j = (i * 2);
            var k = 2;
            if (j + k > hex.length) {
                k = 1;
            }
            var h = hex.substr(j, k);
            n[p--] = parseInt(h, 16);
        }
        return n[0] << 24 | n[1] << 16 | n[2] << 8 | n[3];
    }
    return 0;
}
// ARGB十六进制格式转换成ARGB字符串。
Color.ArgbHexToArgbString = function (hex) {
    var argb = 'rgba(0, 0, 0, 0)';
    if (hex) {
        argb = Color.ArgbNumberToArgbString(Color.ArgbHexToArgbNumber(hex));
    }
    return argb;
}
// ARGB字符串转换成ARGB数值。
Color.ArgbStringToArgbNumber = function (s) {
    var hex = Color.ArgbStringToArgbHex(s);
    return Color.ArgbHexToArgbNumber(hex);
}
// ARGB数值转换成ARGB字符串。
Color.ArgbNumberToArgbString = function (n) {
    n = Number(n);
    n = [
        (n >> 16) & 0xff, // R
        (n >> 8) & 0xff, // G
        n & 0xff, // B
        ((n >> 24) & 0xff) / 255, // A
    ];
    return 'rgba(' + n[0] + ', ' + n[1] + ', ' + n[2] + ', ' + n[3].toFixed(2) + ')';
}
// RGB字符串转换成RGB十六进制格式。
Color.RgbStringToRgbHex = function (s) {
    return Color.RgbNumberToRgbHex(Color.ArgbStringToArgbNumber(s));
}
// RGB十六进制格式转换成RGB字符串。
Color.RgbHexToRgbString = function (hex) {
    return Color.RgbNumberToRgbString(Color.RgbHexToArgbNumber(hex));
}
// RGB十六进制格式转换成RGB颜色值。
Color.RgbHexToArgbNumber = function (hex) {
    return Color.ArgbHexToArgbNumber(hex);
}
// RGB数值转换成RGB十六进制格式
Color.RgbNumberToRgbHex = function (n) {
    var hex = Color.ArgbNumberToArgbHex(n);
    return hex.substr(2);
}
// RGB数值转换成RGB字符串。
Color.RgbNumberToRgbString = function (n) {
    n = Number(n);
    n = [
        (n >> 16) & 0xff,
        (n >> 8) & 0xff,
        n & 0xff,
    ];
    return 'rgb(' + n[0] + ', ' + n[1] + ', ' + n[2] + ')';
}
// ARGB数值转换成ARGB十六进制格式。
Color.ArgbNumberToArgbHex = function (n) {
    n = Number(n);
    n = [
        (n >> 24) & 0xff,
        (n >> 16) & 0xff,
        (n >> 8) & 0xff,
        n & 0xff,
    ];
    var hex = '';
    for (var i = 0; i < 4; i++) {
        var h = n[i].toString(16);
        if (h.length < 2) {
            h = '0' + h;
        }
        hex += h;
    }
    return hex;
}
// 确认是否是指定类型的实例。
var __instanceof = function (instance, type) {
    'use strict'

    if (typeof type === 'string') {
        try {
            type = eval(type);
        } catch (e) {
            return false;
        }
    }
    if (typeof type !== 'function') {
        return false;
    }
    var x1 = instance instanceof type;
    if (x1) {
        return true;
    }
    var x2 = false;
    if (instance !== null && instance !== undefined) {
        var current = instance.constructor;
        if (current === type) {
            return true;
        }
        var __instproto__ = instance;
        var __typesource = type.toString();
        if (current && current.toString() === __typesource) {
            return true;
        }
        do {
            __instproto__ = __instproto__.__proto__;
            if (__instproto__) {
                x2 = __instproto__.constructor === type;
                if (x2) {
                    return true;
                }
                x2 = __typesource === __instproto__.constructor.toString();
                if (x2) {
                    return true;
                }
            }
        } while (__instproto__);
    }
    return x1 || x2;
}
// 随机生成一个GUID。
var __uuid = function () {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}
/*
    Collection class
        designers: liulilte
    定义标准的集合类。
 */
var Collection = function () {
    /* 
     * MetadataToken(RID)
     *  typedef 
     *      Collection class
     */
    'use strict'

    var __items = [];
    var __self = this;
    var __synchronizer = null;

    this.internal = new (function Internal() {
        'use strict'

        var __internal = this;
        var __sinker = new Collection.constructor.Sinker();

        this.Handler = {
            Insert: function (index, item) {
                'use strict'

                index = Number(index),
                    index = isNaN(index) ? -1 : index;

                var count = __items.length;
                if (index < 0 || index > count) {
                    return { Result: false, Index: index, Item: item };
                }
                if (index === count) {
                    __items.push(item);
                } else {
                    __items.splice(index, 0, item);
                }
                if (count === __items.length) {
                    return { Result: false, Index: index, Item: item };
                }
                return { Result: true, Index: index, Item: item };;
            },
            RemoveAt: function (index) {
                'use strict'

                index = Number(index),
                    index = isNaN(index) ? -1 : index;

                if (index < 0 || index >= __items.length) {
                    return { Result: false, Index: index, Item: item };
                }
                var deleteds = __items.splice(index, 1);
                var item = undefined;
                if (deleteds.length > 0) {
                    item = deleteds[0];
                }
                return { Result: deleteds.length > 0, Index: index, Item: item };
            },
        };
        this.Insert = function (index, item) {
            var r = this.Handler.Insert(index, item);
            if (r.Result) {
                if (typeof __sinker.Insert === 'function') {
                    __sinker.Insert(r.Index, r.Item);
                }
            }
            return r.Result;
        }
        this.RemoveAt = function (index) {
            var r = this.Handler.RemoveAt(index);
            if (r.Result) {
                if (typeof __sinker.RemoveAt === 'function') {
                    __sinker.RemoveAt(r.Index, r.Item);
                }
            }
            return r.Result;
        }
        this.IndexOf = function (item) {
            'use strict'

            for (var i = 0; i < __items.length; i++) {
                if (item === __items[i]) {
                    return i;
                }
            }
            return -1;
        }
        this.Get = function (index) {
            'use strict'

            index = Number(index),
                index = isNaN(index) ? -1 : index;
            if (index < 0 || index >= __items.length) {
                return undefined;
            }
            return __items[index];
        }
        this.Count = function () {
            return __items.length;
        }
        this.GetAll = function () {
            return __items;
        }
        this.Synchronizer = function () {
            'use strict'

            if (arguments.length <= 0) {
                return !__synchronizer ? undefined : __synchronizer;
            }
            var value = arguments[0];
            if (value == __synchronizer) {
                return undefined;
            }
            if (!__instanceof(value, Collection.Synchronizer)) {
                value = null;
            }
            if (!value && !__synchronizer.IsDisposed) {
                __synchronizer.Dispose();
            }
            __synchronizer = value;
        }
        Object.defineProperty(this, "Sinker", {
            get: function () {
                return __sinker;
            }
        });
    });
    this.Insert = function (index, item) {
        return this.internal.Insert(index, item);
    }
    this.Add = function (item) {
        return this.Insert(__items.length, item);
    }
    this.Remove = function (item) {
        return this.RemoveAt(this.IndexOf(item));
    }
    this.RemoveAll = function () {
        return this.Clear();
    }
    this.Clear = function () {
        'use strict'

        var count = 0;
        while (this.internal.Count() > 0) {
            count++;
            this.RemoveAt(0);
        }
        return count;
    }
    this.RemoveAt = function (index) {
        return this.internal.RemoveAt(index);
    }
    this.Get = function (index) {
        return this.internal.Get(index);
    }
    this.GetIndex = function (item) {
        return this.IndexOf(item);
    }
    this.IndexOf = function (item) {
        return this.internal.IndexOf(item);
    }
    this.GetAll = function () {
        return __items;
    }
    this.Contains = function (item) {
        return this.IndexOf(item) >= 0;
    }
    this.AddRange = function (s) {
        'use strict'

        var count = 0;
        if (__instanceof(s, Array)) {
            for (var i = 0; i < s.length; i++) {
                if (this.Add(s[i])) {
                    count++;
                }
            }
        } else if (Object.IsNullOrUndefined(s) || typeof s === 'object') {
            if (__instanceof(s, Collection) || s.hasOwnProperty('Count') || s.hasOwnProperty('Get')) {
                var len = Object.GetPropertyValue(s, 'Count');
                for (var i = 0; i < len; i++) {
                    if (this.Add(s.Get(i))) {
                        count++;
                    }
                }
            }
        }
        return count;
    }
    Object.defineProperty(this, "Count", {
        get: function () {
            return this.internal.Count();
        }
    });
    this.toString = function () {
        return '[object {0}]'.replace('{0}', Type.GetName(this.constructor));
    }
    this.Synchronizer = function () {
        'use strict'

        if (arguments.length <= 0) {
            return Collection.GetSynchronizer(this);
        }
        var synchronizer = this.Synchronizer();
        if (synchronizer) {
            if (!Object.IsNullOrUndefined(sources)) {
                Throwable.InvalidOperationException();
            }
            do {
                if (!synchronizer.IsDisposed) {
                    synchronizer.Dispose();
                }
            } while (0, 0);
        } else {
            var sources = arguments[0];
            if (typeof sources !== 'string') {
                Throwable.ArgumentOutOfRangeException();
            }
            return new Collection.Synchronizer(this, sources);
        }
    }
}
Collection.constructor.SynchronizerCollection = function () {
    /* 
     * MetadataToken(RID)
     *  typedef 
     *      Collection.constructor.SynchronizerCollection class
     */
    'use strict'

    var m_synchronizers = [];
    var m_internal = new (function Internal() {
        this.GetRaw = function () {
            return m_synchronizers;
        }
    });
    this.Contains = function () {
        'use strict'

        return this.IndexOf(arguments[0]) >= 0;
    }
    this.IndexOf = function () {
        'use strict'

        var e = arguments[0];
        if (__instanceof(e, Collection.Synchronizer)) {
            e = e.Collection;
        }
        if (!__instanceof(e, Collection)) {
            return -1;
        }
        for (var i = 0; i < m_synchronizers.length; i++) {
            var n = m_synchronizers[i];
            if (n.Collection === e) {
                return i;
            }
        }
        return -1;
    }
    this.Bind = function (synchronizer) {
        'use strict'

        if (!__instanceof(synchronizer, Collection.Synchronizer)) {
            return false;
        }
        var key = synchronizer.Collection;
        if (this.Contains(synchronizer)) {
            return false;
        }
        m_synchronizers.push(synchronizer);
        return true;
    }
    this.Unbind = function (synchronizer) {
        'use strict'

        if (!__instanceof(synchronizer, Collection.Synchronizer)) {
            return false;
        }
        var index = this.IndexOf(synchronizer);
        if (index < 0) {
            return false;
        }
        m_synchronizers.splice(index, 1);
        return true;
    }
    this.GetAll = function () {
        'use strict'

        var s = [];
        for (var i = 0; i < m_synchronizers.length; i++) {
            var n = m_synchronizers[i];
            if (!n) {
                continue;
            }
            s.push(n);
        }
        return s;
    }
    this.Get = function () {
        'use strict'

        var k = arguments[0];
        if (__instanceof(k, Collection.Synchronizer)) {
            k = k.Collection;
        }
        if (typeof k === 'number') {
            return m_synchronizers[k];
        } else if (__instanceof(k, Collection)) {
            k = this.IndexOf(k);
            if (k >= 0) {
                return m_synchronizers[k];
            }
        }
    }
    Object.defineProperty(this, 'internal', {
        get: function () {
            return m_internal;
        }
    });
}
Collection.constructor.Sinker = function () {
    /* 
     * MetadataToken(RID)
     *  typedef 
     *      Collection.constructor.Sinker class
     */
    'use strict'

    var sources = arguments[0],
        self = this,
        disposed = false;

    var _bindings = new Collection.constructor.SynchronizerCollection();
    var _do = function (key, index, item) {
        'use strict'

        while (!disposed) {
            if (typeof key !== 'string') {
                Throwable.NotSupportedException();
            }
            var o = _bindings.internal.GetRaw();
            var r = undefined;
            for (var i = 0; i < o.length; i++) {
                var synchronizer = o[i];
                var destination = synchronizer.internal.GetDestination();
                var result = destination[key](index, item);
                if (result) {
                    r = result;
                }
            }
            return r;
        }
    }
    var _insert = function (index, item) {
        return _do('Insert', index, item);
    };
    var _removeAt = function (index, item) {
        return _do('RemoveAt', index, item);
    };
    Object.defineProperty(this, 'Bindings', {
        get: function () {
            return _bindings;
        }
    });
    Object.defineProperty(this, 'Insert', {
        get: function () {
            return _insert;
        },
        set: function (value) {
            _insert = typeof value === 'function' ? value : null;
        }
    });
    Object.defineProperty(this, 'RemoveAt', {
        get: function () {
            return _removeAt;
        },
        set: function (value) {
            _removeAt = typeof value === 'function' ? value : null;
        }
    });
    if (__instanceof(sources, Array)) {
        var __super = {
            push: sources.push,
            pop: sources.pop,
            shift: sources.shift,
            splice: sources.splice,
            reverse: sources.reverse,
        };
        sources.push = function (item) {
            'use strict'

            var index = sources.length;
            if (index < 0) {
                index = 0;
            }
            self.Insert(index, item);
            return Binding.Callsite(sources, 'super.push', __super.push, [item]);
        }
        sources.pop = function () {
            'use strict'

            var count = sources.length;
            var index = count - 1;
            if (index > -1) {
                self.RemoveAt(index);
                return Binding.Callsite(sources, 'super.pop', __super.pop, null);
            }
        }
        sources.shift = function () {
            'use strict'

            var count = sources.length;
            if (count > 0) {
                self.RemoveAt(0);
                return Binding.Callsite(sources, 'super.shift', __super.shift, null);
            }
        }
        sources.splice = function (start, deleteCount) {
            'use strict'

            deleteCount = Number(deleteCount),
                deleteCount = isNaN(deleteCount) ? sources.length : deleteCount,
                deleteCount = deleteCount <= 0 ? 1 : deleteCount;
            start = Number(start),
                start = isNaN(start) || start < 0 ? -1 : start;
            if (start > -1) {
                var deleteds = [];
                for (var i = 0; i < deleteCount; i++) {
                    if (start >= sources.length) {
                        break;
                    }
                    var item = sources[start + i];
                    deleteds.push(item);
                    self.RemoveAt(start);
                }
                var items = [start, deleteCount];
                for (var i = 2; i < arguments.length; i++) {
                    var item = arguments[i];
                    items.push(item);
                }
                for (var i = 2; i < items.length; i++) {
                    var item = items[i];
                    self.Insert((start + (i - 2)), item);
                }
                return Binding.Callsite(sources, 'super.splice', __super.splice, items);
            }
        }
        sources.reverse = function () {
            'use strict'

            self.RemoveAll();
            var result = Binding.Callsite(sources, 'super.reverse', __super.reverse);
            for (var i = 0; i < sources.length; i++) {
                self.Insert(i, sources[i]);
            }
            return result;
        }
    }
    this.Dispose = function () {
        'use strict'

        if (!disposed) {
            if (__instanceof(sources, Array)) {
                for (var key in __super) {
                    sources[key] = __super[key];
                }
            }
            disposed = true;
        }
    }
    Object.defineProperty(self, "IsDisposed", {
        get: function () {
            return disposed;
        }
    });
}
/*
    Synchronizer class
        designers: liulilte
    提供对集合单向同步定义的高级访问，该绑定连接绑定目标对象（通常为 Collection 类型）的属性和 Array 类型数据源。
 */
Collection.Synchronizer = function () { // Unidirectional
    /* 
     * MetadataToken(RID)
     *  typedef 
     *      Collection.Synchronizer class
     */
    'use strict'

    var __arguments = arguments;
    var sources = __arguments[1],
        destination = __arguments[0],
        self = this,
        disposed = false;

    if (typeof sources !== 'string') {
        Throwable.ArgumentOutOfRangeException();
    } else {
        sources = eval(sources);
    }
    if (!__instanceof(destination, Collection)) {
        Throwable.ArgumentOutOfRangeException();
    }
    if (!__instanceof(sources, Array) && !__instanceof(sources, Collection)) {
        Throwable.ArgumentOutOfRangeException();
    } else {
        self.Tag = null;
    }
    Object.defineProperty(self, "DataSource", {
        get: function () {
            return __arguments[1];
        }
    });
    Object.defineProperty(self, "Collection", {
        get: function () {
            return destination;
        }
    });
    Object.defineProperty(self, "IsDisposed", {
        get: function () {
            return disposed;
        }
    });
    var synchronizer = Collection.GetSynchronizer(destination);
    if (__instanceof(synchronizer, Collection.Synchronizer)) {
        if (synchronizer.DataSource !== self.DataSource) {
            Throwable.InvalidOperationException();
        }
        return synchronizer;
    }
    var GetDestinationCount = function () {
        var get = Object.GetPropertyValue;
        return get(destination, 'Count');
    }
    !(function () {
        'use strict'

        var DestinationSetSynchronizer = function (synchronizer) {
            'use strict'

            if (!__instanceof(synchronizer, Collection.Synchronizer)) {
                synchronizer = null;
            }
            var internal = destination.internal;
            internal.Synchronizer(synchronizer);
        }
        var sinker = null;
        if (!__instanceof(sources, Array)) {
            var internal = sources.internal;
            sinker = internal.Sinker;
        } else {
            var keyid = Collection.Synchronizer.GetKeyId(sources);
            if (sources.hasOwnProperty(keyid)) {
                sinker = sources[keyid];
            } else {
                sinker = new Collection.constructor.Sinker(sources);
                Object.defineProperty(sources, keyid, {
                    get: function () {
                        return sinker;
                    }
                });
            }
        }
        sinker.Bindings.Bind(self);
        self.Dispose = function () {
            'use strict'

            if (!disposed) {
                disposed = true;
                sinker.Bindings.Unbind(self);
                DestinationSetSynchronizer(null);
            }
        }
        DestinationSetSynchronizer(self);
    })();
    !(function () {
        'use strict'

        destination.RemoveAll();
        var items = (__instanceof(sources, Array) ? sources : sources.internal.GetAll());
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            destination.Add(item);
        }
    })();
    this.toString = function () {
        return '[object {0}]'.replace('{0}', Type.GetName(this.constructor));
    }
    var internal = new (function Internal() {
        'use strict'

        this.GetDestination = function () {
            return destination;
        }
        this.GetSources = function () {
            return sources;
        }
        this.GetDataSourceNameObject = function () {
            'use strict'

            var datasource = self.internal.GetDataSourceName();
            return datasource ? Object.GetInstance(datasource) : null;
        }
        this.GetDataSourceName = function () {
            'use strict'

            var datasource = self.DataSource;
            if (datasource) {
                if (typeof datasource === 'string') {
                    var index = -1;
                    do {
                        var info = null;
                        try {
                            var o = Object.GetInstance(datasource);
                            if (o && typeof o.GetType === 'function' &&
                                __instanceof((info = o.GetType()), Type)) {
                                break;
                            }
                        } catch (e) {
                            break;
                        }
                        index = datasource.lastIndexOf('.');
                        if (index < 0) {
                            break;
                        }
                        datasource = datasource.substr(0, index);
                    } while (datasource)
                }
            }
            return datasource ? datasource : '';
        }
    });
    Object.defineProperty(self, 'internal', {
        get: function () {
            return internal;
        }
    });
}
Collection.Synchronizer.GetKeyId = function (o) {
    'use strict'

    if (Object.IsNullOrUndefined(o) || typeof o !== 'object') {
        Throwable.ArgumentOutOfRangeException();
    }
    return 'Synchronizer' + Binding.GetBinding.GetId(o, 'Collection.Synchronizer.GetKeyId').toString();
}
// 获取与此数组或集合关联的同步器。
Collection.GetSynchronizers = function () {
    'use strict'

    var owner = arguments[0];
    if (typeof owner === 'string') {
        owner = eval(owner);
    }
    if (!__instanceof(owner, Array) && !__instanceof(owner, Collection)) {
        Throwable.ArgumentOutOfRangeException();
    }
    var synchronizers = [];
    var sinker = null;
    if (__instanceof(owner, Collection)) {
        sinker = owner.internal.Sinker;
    } else {
        var keyid = Collection.Synchronizer.GetKeyId(owner);
        sinker = owner[keyid];
    }
    if (__instanceof(sinker, Collection.constructor.Sinker)) {
        var bindings = sinker.Bindings;
        if (__instanceof(bindings, Collection.constructor.SynchronizerCollection)) {
            synchronizers = bindings.GetAll();
        }
    }
    if (!__instanceof(synchronizers, Array)) {
        synchronizers = [];
    }
    return synchronizers;
}
// 获取与此集合关联的同步器。
Collection.GetSynchronizer = function () {
    var owner = arguments[0];
    if (typeof owner === 'string') {
        owner = eval(owner);
    }
    if (!__instanceof(owner, Collection)) {
        Throwable.ArgumentOutOfRangeException();
    }
    var synchronizer = Object.GetPropertyValue(owner.internal, 'Synchronizer');
    if (!__instanceof(synchronizer, Collection.Synchronizer)) {
        synchronizer = undefined;
    }
    return synchronizer;
}
// 合并源对象与目标对象的属性。 
Object.Merge = function (destination, source) {
    'use strict'

    if (Object.IsNullOrUndefined(destination) || Object.IsNullOrUndefined(source)) {
        return destination;
    }
    if (typeof destination !== 'object' || typeof source !== 'object') {
        return destination;
    }
    var keys = Object.getOwnPropertyNames(source);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (!destination.hasOwnProperty(key)) {
            destination[key] = source[key];
        }
    }
    return destination;
}
// 检测指定名称的对象是否已经定义。
Object.IsDefined = function (name) {
    'use strict'

    if (typeof name !== 'string') {
        Throwable.ArgumentOutOfRangeException();
    }
    var __undefined = false;
    try {
        eval(name + '.__proto__');
    } catch (e) {
        __undefined = true;
    }
    return !__undefined;
}
// 实例化一个标准的集合（通过集合的继承链条）。
Collection.New = function (owner, inheritances) {
    return Object.New(Collection, owner, inheritances);
}
/*
    Encoding class
        designers: liulilte
    表示字符编码。
 */
var Encoding = {
    UTF8: new (function UTF8Encoding() {
        this.GetString = function (utf8) {
            'use strict'

            var s = '';
            if (!utf8 || !(utf8 instanceof Array) || utf8.length <= 0) {
                return s;
            }
            for (var k = 0; k < utf8.length;) {
                var ch = utf8[k++];
                if (ch < 0xE0) {
                    ch = (ch & 0x1f) << 6;
                    ch |= (utf8[k++] & 0x3f);
                } else if (ch < 0xF0) {
                    ch = (ch & 0x0f) << 12;
                    ch |= (utf8[k++] & 0x3f) << 6;
                    ch |= (utf8[k++] & 0x3f);
                }
                if (ch > 0) {
                    s += String.fromCharCode(ch);
                } else {
                    break;
                }
            }
            return s;
        }
        this.GetBytes = function (s) {
            'use strict'

            var buf = [];
            var k = 0;
            if (!s || typeof s !== 'string') {
                return buf;
            }
            for (var i = 0; i < s.length; i++) {
                var ch = s.charCodeAt(i);
                if (isNaN(ch)) {
                    continue;
                }
                if (ch < 0x80) {
                    k++;
                }
                else if (ch < 0x800) {
                    k += 2;
                }
                else if (ch < 0x10000) {
                    k += 3;
                }
            }
            buf = new Array(k + 1);
            buf[k] = 0;
            k = 0;
            for (var i = 0; i < s.length; i++) {
                var ch = s.charCodeAt(i);
                if (isNaN(ch)) {
                    continue;
                }
                if (ch < 0x80) {
                    buf[k++] = (ch & 0xff);
                }
                else if (ch < 0x800) {
                    buf[k++] = ((ch >> 6) & 0x1f) | 0xc0;
                    buf[k++] = (ch & 0x3f) | 0x80;
                }
                else if (ch < 0x10000) {
                    buf[k++] = ((ch >> 12) & 0x0f) | 0xe0;
                    buf[k++] = ((ch >> 6) & 0x3f) | 0x80;
                    buf[k++] = (ch & 0x3f) | 0x80;
                }
            }
            return buf;
        }
    }),
    Unicode: new (function UnicodeEncoding() {
        this.GetBytes = function (s) {
            'use strict'

            var buf = [];
            var k = 0;
            if (!s || typeof s !== 'string') {
                return buf;
            }
            for (var i = 0; i < s.length; i++) {
                var ch = s.charCodeAt(i);
                if (isNaN(ch)) {
                    continue;
                }
                if (ch <= 0xff) {
                    k++;
                } else {
                    k += 2;
                }
            }
            buf = new Array(k + 2);
            buf[k] = 0;
            buf[k + 1] = 0;
            k = 0;
            for (var i = 0; i < s.length; i++) {
                var ch = s.charCodeAt(i);
                if (isNaN(ch)) {
                    continue;
                }
                if (ch <= 0xff) {
                    buf[k++] = (ch & 0xff);
                } else {
                    buf[k++] = (ch & 0xff);
                    buf[k++] = ((ch >> 8) & 0xff);
                }
            }
            return buf;
        }
        this.GetString = function (buf) {
            'use strict'

            var s = '';
            if (!buf || !(buf instanceof Array) || buf.length <= 0) {
                return s;
            }
            for (var k = 0; k < buf.length;) {
                var low = buf[k++];
                if (isNaN(low)) {
                    continue;
                }
                var high = buf[k++];
                if (isNaN(high)) {
                    continue;
                }
                var ch = low | high << 8;
                if (ch > 0) {
                    s += String.fromCharCode(ch);
                } else {
                    break;
                }
            }
            return s;
        }
    }),
};
/*
    HtmlView class
        designers: liulilte
    定义视图的基类，视图是带有可视化表示形式的容器。
 */
var HtmlView = function () {
    /* 
     * MetadataToken(RID)
     *  typedef 
     *      HtmlView class
     */
    var _dataBindings = new BindingsCollection(this);
    var _controls = new HtmlView.ControlCollection(this);
    var _self = this;
    var _disposed = false;
    var _rttiTypeInfo = null;
    var _imageElement = null;
    var _backgroundImage = null;
    var _backgroundImageLayout = 0;
    var _scrollMode = 0;
    var _canSelect = 0;
    var _canFocus = 0;
    var _container = arguments[0] ? $(arguments[0]) : $(document.body);
    if (_container.length <= 0) {
        _container = $(document.body);
    } else if (!__instanceof(_container.get(0), HTMLElement)) {
        _container = $(document.body);
    }
    var ThrowObjectDisposedException = function () {
        if (_disposed) {
            Throwable.ObjectDisposedException();
        }
    };
    var _listenDOMSizeChanged = (function () {
        'use strict'

        var previous = null;
        var h = setInterval(function () {
            if (_container) {
                var current = HtmlView.externs.GetRectangleAttribute(_self);
                if (previous && (previous.Width != current.Width || previous.Height != current.Height)) {
                    var controls = _self.Controls;
                    var docking = controls.Docking;
                    docking.Update();
                }
                previous = current;
            }
        }, 10);
        return {
            Stop: function () {
                clearInterval(h);
            }
        };
    })();
    this.internal = new (function Internal() {
        this.Tag = null;
    });
    // 获取一个值，该值指示控件是否已经被释放。
    Object.defineProperty(this, 'IsDisposed', {
        get: function () {
            return _disposed;
        }
    });
    // 获取或设置视图的名称。
    this.Name = null;
    // 获取或设置包含有关视图的数据的对象。
    this.Tag = null;
    // 获取控件的DOM元素容器。
    this.DOM = function () {
        ThrowObjectDisposedException();
        if (arguments.length > 0)
            Throwable.NotImplementedException();
        return _container;
    };
    // 释放由 HtmlView 使用的所有资源。（继承自 HtmlView。）
    this.Dispose = function () {
        if (!_disposed) {
            _dataBindings.Clear();
            _controls.RemoveAll();
            _imageElement.remove();
            _listenDOMSizeChanged.Stop();
        }
        _disposed = true;
    };
    // 获取或设置在视图中显示的背景图像。（继承自 HtmlView。）
    this.BackgroundImage = function () {
        ThrowObjectDisposedException();
        if (arguments.length <= 0) {
            return _backgroundImage;
        }
        var img = $(_imageElement).find("img");
        var src = arguments[0];
        if (!src) {
            src = '';
        }
        img.attr('src', src);
        _backgroundImage = src;
    };
    // 获取或设置在 ImageLayout 枚举中定义的背景图像布局。（继承自 HtmlView。）
    this.BackgroundImageLayout = function () {
        ThrowObjectDisposedException();
        if (arguments.length <= 0)
            return _backgroundImageLayout;
        var mode = arguments[0];
        if (mode < 0 || mode > 3)
            Throwable.ArgumentOutOfRangeException();
        $(_imageElement).
            find('img').
            css('height', 'none').
            css('width', 'none').
            css('max-width', 'none').
            css('max-width', 'none').
            css('position', 'none').
            css('transform', 'none').
            css('-ms-transform', 'none').
            css('-moz-transform', 'none').
            css('-webkit-transform', 'none').
            css('-o-transform', 'none').
            css('left', 'none').
            css('top', 'none');
        if (mode == 0) { // 映像是沿控件的矩形工作区的顶部左侧对齐。
            $(_imageElement).
                find('img').
                css('position', 'absolute').
                css('left', '0').
                css('top', '0').
                css('bottom', '0').
                css('right', '0').

                css('height', 'none').
                css('width', 'none').
                css('max-width', 'none').
                css('max-width', 'none');
        } else if (mode == 1) { // 图像会增大该控件的客户端矩形范围内。
            $(_imageElement).
                find('img').
                css('position', 'absolute').
                css('left', '0').
                css('top', '0').
                css('bottom', '0').
                css('right', '0').

                css('max-height', '100%').
                css('max-width', '100%');
        } else if (mode == 2) { // 映像是沿控件的矩形工作区。
            $(_imageElement).
                find('img').
                css('position', 'absolute').
                css('left', '0').
                css('top', '0').
                css('bottom', '0').
                css('right', '0').

                css('height', '100%').
                css('width', '100%').
                css('max-width', '100%').
                css('max-width', '100%');
        } else if (mode == 3) { // 图像控件的客户端矩形内居中。
            $(_imageElement).
                find('img').
                css('position', 'absolute').
                css('left', '0').
                css('top', '0').
                css('bottom', 'none').
                css('right', 'none').

                css('max-width', '100%').
                css('max-width', '100%').
                css('position', 'absolute').
                css('left', '50%').
                css('top', '50%').
                css('transform', 'translate(-50%,-50%)').
                css('-ms-transform', 'translate(-50%,-50%)').
                css('-moz-transform', 'translate(-50%,-50%)').
                css('-webkit-transform', 'translate(-50%,-50%)').
                css('-o-transform', 'translate(-50%,-50%)');
        }
        _backgroundImageLayout = mode;
    };
    // 获取或设置视图的背景色。
    this.BackColor = function () {
        'use strict'

        var e = $(_container);
        if (arguments.length <= 0) {
            return Color.ArgbStringToArgbHex(e.css('background-color'));
        }
        else {
            if (__instanceof(arguments[0], Color)) {
                arguments[0] = arguments[0].toString();
            }
            e.css('background-color', Color.ArgbHexToArgbString(arguments[0]));
        }
    };

    // 获取或设置视图的前景色。
    this.ForeColor = function () {
        'use strict'

        var e = $(_container);
        if (arguments.length <= 0) {
            return Color.ArgbStringToArgbHex(e.css('color'));
        }
        else {
            if (__instanceof(arguments[0], Color)) {
                arguments[0] = arguments[0].toString();
            }
            e.css('color', Color.ArgbHexToArgbString(arguments[0]));
        }
    };
    // 获取或设置视图的滚动条的显示模式。
    this.ScrollMode = function () {
        ThrowObjectDisposedException();
        if (arguments.length <= 0)
            return _scrollMode;
        var mode = arguments[0];
        if (mode < 0 || mode > 6)
            Throwable.ArgumentOutOfRangeException();
        var e = $(_container);
        e.css({ 'overflow-x': 'hidden' });
        e.css({ 'overflow-y': 'hidden' });
        if (mode == 0) // 不显示滚动条
            e.css({ 'overflow': 'hidden' });
        else if (mode == 1) // 自动显示水平垂直滚动条
            e.css({ 'overflow': 'auto' });
        else if (mode == 2) // 固定显示水平滚动条
            e.css({ 'overflow-x': 'scroll' });
        else if (mode == 3) // 固定显示垂直滚动条
            e.css({ 'overflow-y': 'scroll' });
        else if (mode == 4) // 固定显示水平垂直滚动条
            e.css({ 'overflow': 'scroll' });
        else if (mode == 5) // 自动显示水平滚动条
            e.css({ 'overflow-x': 'auto' });
        else if (mode == 6) // 自动显示垂直滚动条
            e.css({ 'overflow-y': 'auto' });
        _scrollMode = mode;
    };
    // 获取或设置是否可以选中控件。
    this.CanSelect = function () {
        'use strict'

        if (arguments.length <= 0) {
            return _canSelect ? true : false;
        }
        var value = arguments[0] ? true : false;
        if (_canSelect !== value) {
            _canSelect = value;

            HtmlView.externs.SetCanSelect(this, value);
        }
    }
    // 获取或设置控件是否可以接收焦点。
    this.CanFocus = function () {
        'use strict'

        if (arguments.length <= 0) {
            return _canFocus ? true : false;
        }
        var value = arguments[0] ? true : false;
        if (_canFocus !== value) {
            _canFocus = value;

            HtmlView.externs.SetCanFocus(this, value);
        }
    }
    // 获取包含在视图内的控件的集合。
    Object.defineProperty(_self, 'Controls', {
        get: function () {
            return _controls;
        }
    });
    // 为该视图获取数据绑定。
    Object.defineProperty(_self, 'DataBindings', {
        get: function () {
            return _dataBindings;
        }
    });
    // 计算访问此控件的代码表达式。
    Object.defineProperty(_self, 'Expression', {
        get: function () {
            return Object.GetPropertyValue(this, 'Name');
        }
    });
    // 获取当前实例的 Type (RTTI)。（您可以应用于属性栏反射实例成员。）
    this.GetType = function () {
        if (_rttiTypeInfo == null) {
            _rttiTypeInfo = HtmlView.prototype.GetType();
        }
        return _rttiTypeInfo;
    };
    // 获取一个值，用以指示 HtmlView 面向的屏幕的大小。
    this.GetScreenSize = HtmlView.prototype.GetScreenSize;
    // .cctor
    !(function () {
        _container.css({
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            right: 0,
            margin: 0,
        });
        _imageElement = $('<div class="HtmlView_BackgroundImage" style="position: absolute; left: 0; right: 0; top: 0; bottom: 0;"><img style="max-height: 100%; max-width: 100%"></div>');
        _container.append(_imageElement);
        Object.SetPropertyValue(_self, 'CanSelect', false);
        Object.SetPropertyValue(_self, 'CanFocus', true);
        HtmlControl.Initialization(_self, HtmlView.defaults);
    })();
}
/*
    Size class
        designers: liulilte
    存储一组整数，共两个，表示一个大小。
 */
var Size = function () {
    /* 
     * MetadataToken(RID)
     *  typedef 
     *      Size class
     */
    'use strict'

    this.Width = Number(arguments[0]);
    this.Height = Number(arguments[1]);

    var o = arguments[0];
    if (!Object.IsNullOrUndefined(o) && typeof o == 'object') {
        if (o.hasOwnProperty('Width')) {
            this.Width = Number(o.Width)
        }
        if (o.hasOwnProperty('Height')) {
            this.Height = Number(o.Height)
        }
    }

    if (isNaN(this.Width)) {
        this.Width = 0;
    }
    if (isNaN(this.Height)) {
        this.Height = 0;
    }

    this.toString = function () {
        return '{Width={0}, Height={1}}'.replace('{0}', this.Width).replace('{0}', this.Height);
    }
}
/*
    FontStyle enum
        designers: liulilte
    指定应用到文本的字形信息。
 */
var FontStyle = new (function FontStyle() {
    /* 
     * MetadataToken(RID)
     *  typedef 
     *      FontStyle class
     */
    this.Bold = 1; // 加粗文本。
    this.Italic = 2; // 倾斜文本。
    this.Regular = 0; // 普通文本。
    //this.Strikeout = 3; //中间有直线通过的文本。
    //this.Underline = 4; //带下划线的文本。 

    this.IsDefined = function (value) {
        return value === this.Bold ||
            value === this.Italic ||
            value === this.Regular;
        //|| value === this.Strikeout ||
        //value === this.Underline;
    }
});

/*
    Font class
        designers: liulilte
    定义特定的文本格式，包括字体、字号和字形属性。此类不能被继承。
 */
var Font = function (familyName, emSize, style) {
    /* 
     * MetadataToken(RID)
     *  typedef 
     *      Font class
     */
    //if (familyName) {
    //    this.Name = 'Microsoft YaHei';
    //}
    this.Name = familyName;
    this.Style = style;
    this.FamilyName = familyName;
    this.Size = emSize;

    Object.defineProperty(this, 'Bold', {
        get: function () {
            return style === FontStyle.Bold;
        }
    });

    Object.defineProperty(this, 'Italic', {
        get: function () {
            return style === FontStyle.Italic;
        }
    });

    Object.defineProperty(this, 'Strikeout', {
        get: function () {
            return style === FontStyle.Strikeout;
        }
    });

    Object.defineProperty(this, 'Underline', {
        get: function () {
            return style === FontStyle.Underline;
        }
    });
}
// 指定 HtmlView 的默认值。
HtmlView.defaults = new Object({
    Name: 'HtmlView',
    ForeColor: 'FF000000',
    BackColor: 'FFFFFFFF',
    ScrollMode: 0,
    BackgroundImageLayout: 3
});
// 获取 HtmlView 原型的 Type (RTTI)信息。
HtmlView.prototype.GetType = function () {
    var type = new Type();
    type.FullName = Object.TypeOf(this);
    type.References.push('HtmlControl.js');
    type.Methods = [{
        Name: 'GetType',
        Description: '获取当前实例的 Type (RTTI)信息。',
    }, {
        Name: 'Dispose',
        Description: '释放由 HtmlView 使用的所有资源。',
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
        Name: 'Controls',
        PropertyType: 'Collection,HtmlView.ControlCollection',
        Readable: true,
        Writeable: false,
        Browsable: true,
        DataBind: false,
        Description: '获取包含在视图内的控件的集合。',
        Accessor: 'property',
    }, {
        Name: 'DataBindings',
        PropertyType: 'Collection,BindingsCollection',
        Readable: true,
        Writeable: false,
        Browsable: true,
        DataBind: false,
        Description: '为该视图获取数据绑定。',
        Accessor: 'property',
    }, {
        Name: 'BackgroundImage',
        PropertyType: 'Uri,Image,string',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: true,
        Description: '获取或设置在视图中显示的背景图像。',
        Accessor: 'function',
    }, {
        Name: 'BackgroundImageLayout',
        PropertyType: 'number',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置在 ImageLayout 枚举中定义的背景图像布局。',
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
        Name: 'ForeColor',
        PropertyType: 'Color',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置视图的前景色。',
        Accessor: 'function',
    }, {
        Name: 'ScrollMode',
        PropertyType: 'number,ScrollStyle,select',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置视图的滚动条的显示模式。',
        Accessor: 'function',
    }, {
        Name: 'CanSelect',
        PropertyType: 'boolean',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置是否可以选中视图。',
        Accessor: 'function',
    }, {
        Name: 'CanFocus',
        PropertyType: 'boolean',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置试图是否可以接收焦点。',
        Accessor: 'function',
    }];
    return type;
}
/*
    Type class
        designers: liulilte
    表示类型声明：类类型、接口类型、数组类型、值类型、枚举类型、类型参数、泛型类型定义，以及开放或封闭构造的泛型类型。
 */
var Type = function () {
    /* 
     * MetadataToken(RID)
     *  typedef 
     *      Type class
     */
    'use strict'; /* Type */

    this.FullName = 'object';
    this.Methods = [];
    this.Properties = [];
    this.Tag = null;
    this.References = ['jquery-1.9.1.min.js'];
    this.BaseType = ['object']; // constructor
}
// 测量类是否属于索引类。
Type.IsIndexer = function () {
    'use strict'

    var args = arguments[0];
    if (Object.IsNullOrUndefined(args)) {
        return false;
    }
    if (__instanceof(args, Array)) {
        return true;
    }
    if (typeof args === 'object' && typeof args.length === 'number') {
        if (args.length == 0) {
            return true;
        }
        else if (args.length > 0 &&
            args.hasOwnProperty(0) &&
            args.hasOwnProperty(args.length - 1)) {
            return true;
        }
    }
    return false;
}
// 构建类型摘要。
Type.BuildName = function (className) {
    if (!className) {
        Throwable.ArgumentNullException();
    }
    if (typeof className !== 'string') {
        Throwable.ArgumentOutOfRangeException();
    }
    var summary =
        '/* \r\n\
          * MetadataToken(RID) \r\n\
          *  typedef \r\n\
          *      {0} class \r\n\
          */ '.replace('{0}', className);
    return summary;
}
// 获取类型名称。
Type.GetName = function (constructor) {
    if (typeof constructor === 'string') {
        constructor = eval(constructor);
    }
    return Object.TypeOf(constructor);
}
// 添加类型摘要（运行时注入）。
Type.TryDefinedName = function (expression, className) {
    try {
        return Type.DefinedName(expression, className);
    } catch (e) {
        return false;
    }
}
// 定义类型摘要（运行时注入）。
Type.DefinedName = function (expression, className) {
    if (!expression) {
        Throwable.ArgumentNullException();
    }
    if (typeof expression !== 'string') {
        Throwable.ArgumentOutOfRangeException();
    }
    var constructor = eval(expression); // 链接到对象。
    var classid = Type.GetName(constructor);
    if (classid && classid === className) {
        return true;
    }
    var summarycode = Type.BuildName(className);
    if (typeof constructor !== 'function') {
        Throwable.ArgumentOutOfRangeException();
    }
    if (classid && classid !== 'function' && className !== classid) { // 替换定义
        if (!Type.constructor.__findreplacepoint) {
            Type.constructor.__findreplacepoint = function (clazz) {
                clazz = clazz.toString();
                var i = clazz.indexOf('/*');
                var j = clazz.indexOf('*/');
                var r = new Object({ BOF: i, EOF: j + 2 });
                if (i < 0 || j < 0) {
                    clazz = typeof value;
                } else {
                    clazz = clazz.substr(i, (j - i));
                    i = clazz.indexOf('MetadataToken');
                    j = clazz.indexOf('typedef');
                    if (i < 0 || j < 0) {
                        clazz = typeof value;
                    } else {
                        clazz = clazz.substr(j);
                        i = clazz.indexOf('*');
                        if (i < 0 && (i = clazz.indexOf('\r\n')) < 0) {
                            clazz = typeof value;
                        } else {
                            j = clazz.indexOf(' class', i + 2);
                            if (j < 0) {
                                clazz = typeof value;
                            } else {
                                return r;
                            }
                        }
                    }
                }
            }
        }
        var replacepoint = Type.constructor.__findreplacepoint(constructor);
        if (!replacepoint) {
            Throwable.ArgumentOutOfRangeException();
        }
        var sourcecode = constructor.toString();
        sourcecode = sourcecode.substr(0, replacepoint.BOF) + summarycode + sourcecode.substr(replacepoint.EOF);
    } else {
        var sourcecode = constructor.toString();
        var index = sourcecode.indexOf('{');
        if (index == -1) {
            Throwable.ArgumentOutOfRangeException();
        }
        sourcecode = sourcecode.substr(0, index + 1) + summarycode + sourcecode.substr(index + 1);
    }
    var newconstructor = eval('(' + sourcecode + ')');
    do {
        try {
            newconstructor.prototype = constructor.prototype;
        } catch (e) { /* BRJR */ }
        eval(expression + ' = newconstructor');
    } while (0, 0);
    try {
        Object.Mirror(newconstructor.constructor, {}, constructor.constructor)
    } catch (e) { /* unkown strict error */ }
    Object.Mirror(newconstructor, {}, constructor)
    return true;
}
// 测量是否已定义类型摘要。
Type.IsDefined = function (constructor) {
    var name = Type.GetName(constructor);
    return name !== null && name !== undefined && name !== '';
}
// 获取文件名称。
Type.GetFileName = function (constructor) {
    if (!constructor) {
        Throwable.ArgumentNullException();
    }
    if (typeof constructor === 'string') {
        constructor = eval(constructor); // 链接到对象。
    }
    if (typeof constructor !== 'function') {
        Throwable.ArgumentOutOfRangeException();
    }
    constructor = constructor.constructor;
    if (!constructor) {
        return '';
    }
    return constructor.filename;
}
// 定义文件的名称。
Type.DefinedFile = function (constructor, fileName) {
    if (!constructor) {
        Throwable.ArgumentNullException();
    }
    if (!fileName) {
        fileName = '';
    }
    if (typeof constructor === 'string') {
        constructor = eval(constructor); // 链接到对象。
    }
    if (typeof constructor !== 'function') {
        Throwable.ArgumentOutOfRangeException();
    }
    if (!constructor.constructor) {
        constructor.constructor = new Object({});
    }
    constructor = constructor.constructor;
    constructor.filename = fileName;
    return true;
}
// 添加依赖的源文件。
Type.References = (function () {
    'use strict'

    var sources = {};

    var self = new Object({ // nextproctable
        Add: function (path) {
            'use strict'

            if (typeof path !== 'string') {
                return undefined;
            }
            var ss = path.split(',');
            for (var i = 0; i < ss.length; i++) {
                var s = ss[i];
                if (!s) {
                    continue;
                }
                if (!sources[s]) {
                    sources[s] = 1;
                } else {
                    sources[s]++;
                }
            }
        },
        Remove: function (path) {
            'use strict'

            if (typeof path !== 'string') {
                return undefined;
            }
            var ss = path.split(',');
            for (var i = 0; i < ss.length; i++) {
                var s = ss[i];
                if (!s || !sources.hasOwnProperty(s)) {
                    continue;
                }
                if (sources[s]--) {
                    try {
                        if (!sources[s] || sources[s] <= 0) {
                            sources[s] = undefined;
                            delete sources[s];
                        }
                    } catch (e) { }
                }
            }
        },
        RemoveAll: function () {
            sources = {};
        },
        GetAll: function () {
            var s = [];
            for (var key in sources) {
                if (!sources[key]) {
                    continue;
                }
                s.push(key);
            }
            return s;
        }
    });
    var hooks = new (function TypeReferenceCollection() {
        this.Add = function (path) {
            return self.Add(path);
        }
        this.Remove = function (path) {
            return self.Remove(path);
        }
        this.RemoveAll = function () {
            return self.RemoveAll();
        }
        this.GetAll = function () {
            return self.GetAll();
        }
    });
    return hooks;
})();
/*
    HtmlView.constructor.LayoutInfo class
        designers: liulilte
    描述视图的布局逻辑信息。
 */
HtmlView.constructor.LayoutInfo = function () {
    /* 
     * MetadataToken(RID)
     *  typedef 
     *      HtmlView.constructor.LayoutInfo class
     */
    'use strict'; /* HtmlView.constructor.LayoutInfo */

    var self = this;
    if (arguments.length > 0) {
        var obj = arguments[0];
        if (!obj || typeof obj !== 'object') {
            Throwable.ArgumentException();
        }
        for (var key in obj) {
            Object.defineProperty(self, key, {
                get: function () {
                    return obj[key];
                },
                set: function (value) {
                    obj[key] = value;
                }
            })
        }
    }
}
/*
    HtmlView.Rectangle class
        designers: liulilte
    存储一组整数，共四个，表示一个矩形的位置和大小。
 */
HtmlView.Rectangle = function () {
    /* 
     * MetadataToken(RID) --- Object.TypeOf函数将从此摘要元数据内容内反射实例类名。
     *  typedef 
     *      HtmlView.Rectangle class
     */
    'use strict'; /* HtmlView.Rectangle */

    var obj = arguments[0];
    var __left = 0;
    var __top = 0;
    var __width = 0;
    var __height = 0;

    if (!obj || typeof obj !== 'object') {
        if (typeof obj !== 'string') {
            obj = new Object({});
        } else {
            var s = obj.split(',');
            obj = new Object({});
            obj.Left = Number(s[0]);
            obj.Top = Number(s[1]);
            obj.Width = Number(s[2]);
            obj.Height = Number(s[3]);
        }
    }

    Object.defineProperty(this, 'Left', {
        get: function () {
            return __left;
        },
        set: function (value) {
            value = Number(value);
            if (isNaN(value)) {
                value = 0;
            }
            __left = value;
        }
    });
    Object.defineProperty(this, 'Top', {
        get: function () {
            return __top;
        },
        set: function (value) {
            value = Number(value);
            if (isNaN(value)) {
                value = 0;
            }
            __top = value;
        }
    });
    Object.defineProperty(this, 'Width', {
        get: function () {
            return __width;
        },
        set: function (value) {
            value = Number(value);
            if (isNaN(value)) {
                value = 0;
            }
            __width = value;
        }
    });
    Object.defineProperty(this, 'Height', {
        get: function () {
            return __height;
        },
        set: function (value) {
            value = Number(value);
            if (isNaN(value)) {
                value = 0;
            }
            __height = value;
        }
    });

    this.Left = Number(obj.Left);
    this.Top = Number(obj.Top);
    this.Right = Number(obj.Right);
    this.Bottom = Number(obj.Bottom);
    this.Width = Number(obj.Width);
    this.Height = Number(obj.Height);

    for (var key in this) {
        if (isNaN(this[key])) {
            this[key] = 0;
        }
    }

    this.toString = function () {
        return "{Left=" + this.Left + ", Top=" + this.Top + ", Width=" + this.Width + ", Height=" + this.Height + "}";
    }

    Object.defineProperty(this, 'X', {
        get: function () {
            return this.Left;
        },
        set: function () {
            this.Left = parseInt(arguments[0]);
        }
    });

    Object.defineProperty(this, 'Y', {
        get: function () {
            return this.Top;
        },
        set: function () {
            this.Top = parseInt(arguments[0]);
        }
    });

    Object.defineProperty(this, 'Right', {
        get: function () {
            return this.Left + this.Width;
        }
    });

    Object.defineProperty(this, 'Bottom', {
        get: function () {
            return this.Top + this.Height;
        }
    });

    Object.defineProperty(this, 'Size', {
        get: function () {
            return new Size({
                Width: this.Width,
                Height: this.Height
            });
        },
        set: function (value) {
            this.Width = parseInt(value.Width);
            this.Height = parseInt(value.Height);
        }
    });

    this.toJSON = function () {
        return {
            Left: this.Left,
            Top: this.Top,
            Width: this.Width,
            Height: this.Height,
        };
    };
}
// 测量指定对象实例的类型，若不可则通过定义元数据摘要获得。
Object.TypeOf = function (value) {
    var clazz = 'undefined';
    if (value === null) {
        clazz = 'null';
    }
    else if (value !== undefined) {
        if (typeof value === 'object') {
            clazz = value.constructor;
        }
        else if (typeof value === 'function') {
            clazz = value;
        }
        if (typeof clazz !== 'function') {
            clazz = typeof value;
        } else if (clazz.name !== undefined && clazz.name !== null && clazz.name !== '') {
            if (clazz === Object) {
                clazz = 'object';
            } else {
                clazz = clazz.name;
            }
        } else {
            clazz = clazz.toString();
            var i = clazz.indexOf('/*');
            var j = clazz.indexOf('*/');
            if (i < 0 || j < 0) {
                clazz = typeof value;
            } else {
                clazz = clazz.substr(i, (j - i));
                i = clazz.indexOf('MetadataToken');
                j = clazz.indexOf('typedef');
                if (i < 0 || j < 0) {
                    clazz = typeof value;
                } else {
                    clazz = clazz.substr(j);
                    i = clazz.indexOf('*');
                    if (i < 0 && (i = clazz.indexOf('\r\n')) < 0) {
                        clazz = typeof value;
                    } else {
                        j = clazz.indexOf(' class', i + 2);
                        if (j < 0) {
                            clazz = typeof value;
                        } else {
                            clazz = clazz.substr(i + 2, (j - (i + 2))).trim();
                        }
                    }
                }
            }
        }
    }
    return clazz;
}
// 测量指定的类型是否为一个非基础的引用类型。
Object.TypeOf.Is = function (type) {
    if (type === 'boolean' ||
        type === 'string' ||
        type === 'symbol' ||
        type === 'number' ||
        type === 'function' ||
        type === 'number' ||
        type === 'Array' ||
        type === 'Date' ||
        type === 'null' ||
        type === 'undefined') {
        return false;
    }
    return true;
}
// 获取指定类型的类型信息。
Object.GetType = function (type) {
    if (!type) {
        return null;
    }
    try {
        if (typeof type === 'function') {
            type = type.name;
        }
        return eval(type + '.prototype.GetType()');
    } catch (e) {
        return null;
    }
}
// 镜像拷贝 X->Y，拷贝不存在的项。
Object.Mirror = function () {
    if (arguments.length <= 0) {
        return null;
    }
    if (arguments.length <= 1) {
        return arguments[0];
    }
    if (arguments.length <= 2) {
        var x = arguments[0]; // src
        var y = arguments[1]; // destination
        return $.extend({}, x, y);
    }
    var x = arguments[0];
    var y = arguments[1];
    var d = arguments[2];
    return $.extend(x, y, d);
}
// 原型复制，拷贝不存在的项。
Object.Clone = function () {
    'use strict'

    if (arguments.length <= 0) {
        return null;
    }
    var source = arguments[0];
    var keys = Object.getOwnPropertyNames(source);
    var destination = {};
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var descriptor = Object.getOwnPropertyDescriptor(source, key);
        if (!descriptor) {
            continue;
        }
        /*
             constructor JavaScript language system properties are is not allowed to be redefined by the get/set accessor, but you can copy its values
         */
        if (key === 'constructor' || descriptor.enumerable) {
            destination[key] = source[key];
        } else {
            (function () { // closure the scope associated with this property
                var sink = new Object({
                    value: source[key],
                });
                if (descriptor.get) { // accessor
                    sink.get = function () {
                        return sink.value;
                    }
                }
                if (descriptor.set) {
                    sink.set = function (value) {
                        sink.value = value;
                    }
                }
                destination[key] = null;
            })();
        }
    }
    return destination;
}
// 返回指定的对象是否具有 undefined 或 null。
Object.IsNullOrUndefined = function (o) {
    return o === undefined || o === null;
}
// 返回指定对象的实例。 
Object.GetInstance = function (o) {
    'use strict'

    return typeof o !== 'string' ? o : eval(o);
}
// 获取指定对象的属性的值。
Object.GetPropertyValue = function (obj, key) {
    return typeof obj[key] == 'function' ? obj[key]() : obj[key];
}
// 设置指定对象的属性的值。
Object.SetPropertyValue = function (obj, key, value) {
    return typeof obj[key] == 'function' ? obj[key](value) : obj[key] = value;
}
// 实例化对象。
Object.New = function (constructor, options, inheritances) {
    'use strict'

    if (typeof constructor === 'string') {
        constructor = eval(constructor);
    }
    if (typeof constructor !== 'function') {
        Throwable.ArgumentOutOfRangeException();
    }
    if (!options) {
        Throwable.ArgumentNullException();
    }
    var instance = null;
    try {
        instance = new constructor(options); // magnification mode.
        if (!Object.IsNullOrUndefined(inheritances) && (typeof inheritances === 'string' ||
            typeof inheritances === 'function' || typeof inheritances === 'object' ||
            __instanceof(inheritances, Array))) {
            if (typeof inheritances === 'string') {
                inheritances = inheritances.split(',');
            } else if (typeof inheritances === 'function') {
                inheritances = [inheritances];
            }
            var constructors = []; // .cctor.s
            for (var i = 0; i < inheritances.length; i++) {
                var inheritance = inheritances[i];
                if (!inheritance) {
                    continue;
                }
                if (typeof inheritance !== 'function') {
                    if (!(inheritance = inheritance.trim()) || inheritance.toLowerCase() === 'object') {
                        continue;
                    }
                    inheritance = eval(inheritance);
                    if (inheritance === constructor) {
                        continue;
                    }
                }
                if (typeof inheritance !== 'function') {
                    continue;
                }
                eval('inheritance.call(instance, options)'); // super();
                constructors.push(inheritance); // link.cctor
            }
            if (constructors.length) { // redefines the inherited prototype connection, and the constructor
                constructors.splice(0, 0, constructor);
                var index = (constructors.length - 1);
                instance.constructor = constructors[index];
                var first = null; // point to the first prototype
                var nexts = null;
                for (; index >= 0; index--) { // construct these prototypes
                    var constructor = constructors[index];
                    if (first === null) {
                        first = Object.Clone(constructor.prototype);
                        nexts = first;
                    } else {
                        var current = Object.Clone(constructor.prototype);
                        nexts.__proto__ = current;
                        nexts = current;
                    }
                }
                instance.__proto__ = first;
            }
        }
        return instance;
    } catch (e) {
        if (!Object.IsNullOrUndefined(instance) && typeof instance === 'object' && typeof instance.Dispose === 'function') {
            instance.Dispose();
        }
        throw e;
    }
}
// 挂起并保存指定视图的“HtmlView.constructor.LayoutInfo”布局逻辑信息。
HtmlView.SuspendLayout = function (View, predicate) {
    'use strict'

    if (!(typeof View == 'object' && __instanceof(View, HtmlView))) {
        Throwable.InvalidOperationException();
    }
    var filters = [HtmlView, HtmlControl, HTMLElement, HTMLDocument, $(document).constructor];
    filters.indexof = function (value) {
        for (var i = 0; i < this.length; i++) {
            if (__instanceof(value, this[i])) {
                return i;
            }
        }
        return -1;
    }
    var typeid = Object.TypeOf;
    var templates = {};
    var bindings = [];
    var synchronizers = [];
    var controllers = [];
    !(function (callback) {
        'use strict'

        predicate = function (info) {
            'use strict'

            if (__instanceof(info.Iterator, 'Fragment')) {
                var templateid = Number(Object.GetPropertyValue(info.Iterator, 'ViewTemplate'));
                if (!isNaN(templateid) && templateid !== 0) {
                    if (templates[templateid]) {
                        templates[templateid] = 1;
                    } else {
                        templates[templateid]++;
                    }
                }
            }
            if (typeof callback === 'function') {
                callback(info);
            }
        }
    })(arguments[1]);
    var gengtypecode = function (type) {
        if (HtmlView.SuspendLayout.MiniTypeInfo) {
            return 'function() {\r\n return ' + JSON.stringify(type.FullName) + ';\r\n}';
        } else {
            return 'function() {\r\n' +
                'var type = new Type(); \r\n' +
                'type.BaseType = ' + JSON.stringify(type.BaseType) + '\r\n' +
                'type.FullName = ' + JSON.stringify(type.FullName) + '\r\n' +
                'return type \r\n' +
                '}';
        }
    }
    var dumpobj = function (v) {
        'use strict'

        if (!v) {
            return v;
        }
        var m = arguments.length <= 1 ? {} : arguments[1];
        var keys = null;
        var type = null;
        if (typeof v.GetType === 'function' && __instanceof((type = v.GetType()), Type)) {
            keys = new Array();
            var s = type.Properties;
            for (var i = 0; i < s.length; i++) {
                var ii = s[i];
                if (!ii) {
                    continue;
                }
                if (ii.Browsable) { // ii.Writeable
                    keys.push(ii.Name);
                }
            }
            m.GetType = gengtypecode(type);
        } else {
            keys = Object.getOwnPropertyNames(v);
        }
        if (typeof predicate === 'function') {
            if (predicate({
                'View': View,
                'Iterator': v,
                'Output': m,
                'Properties': keys,
                'Metatype': type
            }) === false) {
                return m;
            }
        }
        if (__instanceof(v, HtmlControl) || __instanceof(v, HtmlView)) {
            controllers.push(v);
        }
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (m.hasOwnProperty(key)) {
                continue;
            }
            if (key.indexOf('#') >= 0) {
                continue;
            }
            var value = null;
            try {
                if (typeof v[key] === 'function') {
                    if (__instanceof(v, HtmlView) || __instanceof(v, HtmlControl)) {
                        if (key === "SuspendLayout" ||
                            key === "ResumeLayout" ||
                            key === "IsDisposed" || key === "Dispose") {
                            continue;
                        }
                    }
                    if (key == 'Parse' && __instanceof(v, Binding)) {
                        continue;
                    }
                    value = v[key]();
                } else {
                    value = v[key];
                }
            } catch (e) {
                console.error(e);
            }
            var temp = [__instanceof(value, Collection), value];
            if (__instanceof(value, HtmlView.ControlCollection) || __instanceof(value, BindingsCollection)
                || temp[0]) {
                if (__instanceof(value, HtmlControl)) {
                    controllers.push(value);
                }
                value = dumplist(value);
            }
            if (filters.indexof(temp[1]) != -1) {
                continue;
            }
            var type = typeid(value);
            if (type === 'null') {
                m[key] = null;
            } else if (type === 'undefined') {
                m[key] = undefined;
            }
            else {
                try {
                    if (__instanceof(value, Array) && !(typeof value.splice === 'function' &&
                        typeof value.push === 'function' && typeof value.pop === 'function')) {
                        delete value.constructor;
                    }
                } catch (e) {
                }
                if (!Object.TypeOf.Is(type)) {
                    m[key] = value;
                } else {
                    m[key] = {
                        Type: type,
                        Value: dumpobj(value),
                    }
                }
            }
        }
        return m;
    }
    var dumplist = function (s) {
        'use strict'

        if (__instanceof(s, HtmlView.ControlCollection)) {
            var count = s.Count;
            var results = [];
            for (var i = 0; i < count; i++) {
                var item = s.Get(i);
                if (!item) {
                    continue;
                }
                var m = dumpobj(item);
                results.push(m);
            }
            return results;
        } else if (__instanceof(s, BindingsCollection)) {
            var s = s.GetAll();
            var results = [];
            for (var i = 0; i < s.length; i++) {
                var binding = s[i];
                if (!binding) {
                    continue;
                }
                if (!__instanceof(binding, Binding)) {
                    binding = binding.Binding;
                }
                if (!__instanceof(binding, Binding)) {
                    continue;
                }
                results.push({
                    DataMember: binding.DataMember,
                    PropertyName: binding.PropertyName,
                    DataSource: binding.DataSource,
                });
                bindings.push(binding);
            }
            return results;
        } else if (__instanceof(s, Collection)) {
            var synchronizer = Collection.GetSynchronizer(s);
            var count = s.Count;
            var results = {
                length: count,
            };
            if (__instanceof(synchronizer, Collection.Synchronizer)) {
                results.synchronizer = synchronizer.DataSource;
                synchronizers.push(synchronizer);
            }
            results.constructor = Array;
            for (var i = 0; i < count; i++) {
                var item = s.Get(i);
                if (!item) {
                    continue;
                }
                results[i] = dumpobj(item);
            }
            return results;
        }
        return s;
    }
    var layout = new HtmlView.constructor.LayoutInfo();
    layout.View = dumpobj(View, new Object({}));
    layout.Screen = HtmlView.GetScreenSize();
    layout.Includes = HtmlView.GetIncludeFiles(View, layout);
    layout.Fragments = (function () {
        'use strict'

        var results = [];
        for (var key in templates) {
            if (templates[key]) {
                continue;
            }
            var templateid = Number(key);
            if (!isNaN(templateid) && templateid !== 0) {
                results.push(templateid);
            }
        }
        return results;
    })();
    layout.References = (function () {
        'use strict'

        var s = Type.References.GetAll();
        var sets = {}
        var results = [];

        for (var i = 0; i < s.length; i++) {
            var url = s[i];
            if (!url) {
                continue;
            }
            var key = url.trim().toLowerCase();
            if (!key) {
                continue;
            }
            if (!sets[key]) {
                sets[key] = 1;
                results.push(url);
            }
        };

        var internaladdreferences = function (datasource) {
            'use strict'

            if (typeof datasource.GetType !== 'function') {
                return;
            }
            var typeinfo = datasource.GetType();
            if (!__instanceof(typeinfo, Type)) {
                return;
            }
            var references = typeinfo.References;
            if (!__instanceof(references, Array)) {
                return;
            }
            for (var i = 0; i < references.length; i++) {
                var url = references[i];
                if (!url) {
                    return;
                }
                var key = url.trim().toLowerCase();
                if (!key) {
                    return;
                }
                if (!sets[key]) {
                    sets[key] = 1;
                    results.push(url);
                }
            }
        };
        var addreferences = function (s) {
            'use strict'

            for (var i = 0; i < s.length; i++) {
                var o = s[i];
                if (!o) {
                    continue;
                }
                var datasource = null;
                if (__instanceof(o, Collection.Synchronizer)) {
                    datasource = o.internal.GetDataSourceNameObject();
                }
                else if (__instanceof(o, Binding)) {
                    datasource = o.GetDataSourceObject();
                } else if (__instanceof(o, HtmlControl) || __instanceof(o, HtmlView)) {
                    datasource = o;
                }
                if (!datasource) {
                    continue;
                }
                internaladdreferences(datasource);
            }
        }
        addreferences(bindings);
        addreferences(synchronizers);
        addreferences(controllers);

        return results;
    })();
    return layout;
}
// 挂起并保存当前视图的“HtmlView.constructor.LayoutInfo”布局逻辑信息。
HtmlView.prototype.SuspendLayout = function (predicate) {
    return HtmlView.SuspendLayout(this, predicate);
}
// 通过“HtmlView.constructor.LayoutInfo”信息还原视图原有的布局逻辑。
HtmlView.prototype.ResumeLayout = function (layout) {
    return HtmlView.ResumeLayout(this, layout);
}
// 通过“HtmlView.constructor.LayoutInfo”信息还原视图原有的布局逻辑。
HtmlView.ResumeLayout = function (View, layout) {
    'use strict'

    if (arguments.length > 1) {
        if (View !== null && View !== undefined && !(typeof View === 'object' && __instanceof(View, HtmlView))) {
            Throwable.InvalidOperationException();
        }
    }
    var info = null;
    if (!layout || !(info = layout.View)) {
        Throwable.ArgumentNullException();
    }
    if (typeof info !== 'object') {
        Throwable.ArgumentOutOfRangeException();
    }
    if (!info.GetType) {
        Throwable.ArgumentOutOfRangeException();
    }
    if (typeof info.GetType === 'string') {
        try {
            info.GetType = eval('(' + info.GetType + ')');
        } catch (e) {
            Throwable.ArgumentOutOfRangeException();
        }
    }
    if (typeof info.GetType !== 'function') {
        Throwable.ArgumentOutOfRangeException();
    } else {
        var type = info.GetType();
        if (typeof type === 'string') {
            type = Object.GetType(type);
        }
        if (View) {
            if (!__instanceof(View, type.FullName)) {
                Throwable.ArgumentOutOfRangeException();
            }
        } else {
            View = HtmlView.New({ Name: info.Name }, type.BaseType);
        }
    }
    var getvalue = function (o) {
        'use strict'

        if (!o || typeof o !== 'object') {
            return o;
        }
        var type = null;
        var value = null;
        if (arguments[1]) {
            type = rdgtypeproc(o, 1);
            value = o;
        } else {
            type = o.Type;
            value = o.Value;
            if (type === undefined || value === undefined) {
                return o;
            }
            if (type.toLowerCase() === 'object') {
                return value;
            }
        }
        try {
            var obj = eval('new ' + type);
            for (var key in value) {
                if (typeof obj[key] === 'function') {
                    obj[key](value[key]);
                }
                else {
                    obj[key] = value[key];
                }
            }
            return obj;
        } catch (e) {
            return value;
        }
    }
    var rdgtypeproc = function (item) {
        'use strict'

        do {
            if (Object.IsNullOrUndefined(item) || typeof item !== 'object') {
                continue;
            }
            if (typeof item.GetType === 'string') {
                try {
                    item.GetType = eval('(' + item.GetType + ')');
                } catch (e) {
                    continue;
                }
            }
            var type = '';
            if (typeof item.GetType !== 'function') {
                continue;
            } else {
                type = item.GetType();
            }
            if (!type) {
                continue;
            } else if (typeof type === 'string') {
                try {
                    type = Object.GetType(type);
                } catch (e) {
                    type = '';
                }
            }
            if (arguments[1] === 1) {
                if (typeof type !== 'string') {
                    if (typeof type.FullName === 'string') {
                        type = '';
                    }
                    else {
                        type = type.FullName;
                    }
                }
            }
            if (arguments[1] && typeof type !== 'string') {
                type = '';
            }
            return type;
        } while (false);
    }
    var rdnewctl = function (item) {
        'use strict'

        var type = rdgtypeproc(item);
        if (!type || !item || !item.Name || Object.IsDefined(item.Name)) {
            return null;
        }
        var inheritances = [];
        var basetypes = type.BaseType;
        if (!basetypes) {
            return null;
        }
        var canctl = false;
        try {
            for (var jj = 0;
                jj < basetypes.length;
                jj++) {
                var inherited = basetypes[jj];
                if (inherited == 'HtmlControl') {
                    canctl = true;
                    break;
                }
            }
        } catch (e) {
            return null;
        }
        if (!canctl) {
            return null;
        }
        if (__instanceof(basetypes, Array)) {
            for (var jj = 0; jj < basetypes.length; jj++) {
                var inherited = basetypes[jj];
                if (!inherited) {
                    continue;
                }
                inheritances.push(inherited);
            }
        }
        inheritances.push(type.FullName);
        var components = HtmlControl.New({ Name: item.Name }, inheritances);
        fillobj(item, components); // controls.Add(components);
        return components;
    }
    var fillobj = function (src, destination) {
        'use strict'

        if (Object.IsNullOrUndefined(src) || Object.IsNullOrUndefined(destination)) {
            return undefined;
        }
        var types = typeof destination.GetType !== 'function' ? null : destination.GetType();
        var getattrinfo = function (key) {
            if (Object.IsNullOrUndefined(types)) {
                return null;
            }
            var s = types.Properties;
            if (s && s.length) {
                for (var i = 0; i < s.length; i++) {
                    var p = s[i];
                    if (p && p.Name == key) {
                        return p;
                    }
                }
            }
            return null;
        }
        for (var key in src) {
            var value = src[key];
            if (__instanceof(destination[key], HtmlView.ControlCollection)) {
                var s = src[key];
                if (!__instanceof(s, Array)) {
                    continue;
                }
                var controls = null;
                if (!(__instanceof(destination, HtmlView) || __instanceof(destination, HtmlControl))) {
                    continue;
                }
                controls = destination[key];
                for (var i = 0; i < s.length; i++) {
                    var components = rdnewctl(s[i]);
                    if (components) {
                        controls.Add(components);
                    }
                }
            } else if (__instanceof(destination[key], BindingsCollection)) {
                var s = src[key];
                if (!__instanceof(s, Array)) {
                    continue;
                }
                var bindings = null;
                if (!(__instanceof(destination, HtmlView) || __instanceof(destination, HtmlControl))) {
                    continue;
                }
                bindings = destination.DataBindings;
                for (var i = 0; i < s.length; i++) {
                    var item = s[i];
                    if (!item) {
                        continue;
                    }
                    var binding = bindings.Add(item.PropertyName, item.DataSource, item.DataMember);
                    if (!binding.Enabled) {
                        binding.Enabled = false;
                    }
                }
            } else if (__instanceof(destination[key], Collection)) {
                var synchronizer = null;
                var s = src[key];
                if (!__instanceof(s, Object)) {
                    continue;
                }
                var collections = destination[key];
                for (var i = 0; i < s.length; i++) {
                    var item = getvalue(s[i], 1);
                    var components = null;
                    if (item && (components = rdnewctl(item))) {
                        item = components;
                    }
                    collections.Add(item);
                }
                if (typeof s.synchronizer === 'string') { // 措施集合与数据源之间建立同步器。
                    synchronizer = new Collection.Synchronizer(collections, s.synchronizer);
                }
            }
            else {
                var attrinfo = getattrinfo(key);
                if (attrinfo && attrinfo.Browsable && (attrinfo.Readable || !attrinfo.Writeable)) {
                    if (!Object.IsNullOrUndefined(value) && typeof value === 'object') {
                        fillobj(getvalue(value), destination[key]);
                    }
                }
                if (typeof destination[key] === 'function' && key === 'GetType') {
                    continue;
                }
                else if (__instanceof(destination[key], Type)) {
                    continue;
                }
                if (typeof destination[key] === 'function') {
                    destination[key](getvalue(value));
                } else {
                    var descriptor = Object.getOwnPropertyDescriptor(destination, key);
                    if (descriptor && (descriptor.writable || descriptor.set)) {
                        destination[key] = getvalue(value);
                    }
                }
            }
        }
    }
    fillobj(info, View);
    return View;
}
// 控制挂起布局是否使用短小的类型信息。
HtmlView.SuspendLayout.MiniTypeInfo = true;
// 加载指定引用的一组脚本代码。
HtmlView.LoadReferences = function (urls) {
    if (typeof urls == 'string') {
        urls = urls.split(',');
    }
    if (typeof urls != 'object') {
        return 0;
    }
    var paths = {};
    if (__instanceof(urls, Array)) {
        for (var i = 0; i < urls.length; i++) {
            var url = urls[i];
            if (!url) {
                continue;
            }
            paths[i] = url;
        }
    } else {
        for (var key in urls) {
            if (key && key != '') {
                paths[key] = urls[key];
            }
        }
    }
    var onload = arguments.length > 1 ? arguments[1] : null;
    var onerror = arguments.length > 2 ? arguments[2] : null;
    var loadscript = function (src) {
        var script = document.createElement("script");
        script.src = src;
        script.type = "text/javascript";
        var key = '#.xdOT-181.2llx';
        script.onload = function (e) {
            if (typeof onload == 'function') {
                Binding.Callsite(this, key, onload, [src, e]);
            }
        };
        script.onerror = function (e) {
            if (typeof onerror == 'function') {
                Binding.Callsite(this, key, onerror, [src, e]);
            }
        };
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(script);
    }
    var count = 0;
    for (var key in paths) {
        var src = paths[key];
        loadscript(src);
        count++;
    }
    return count;
}
// 加载指定引用的一组脚本代码2。
HtmlView.LoadReferences2 = function (references) {
    try {
        if (__instanceof(references, Array)) {
            if (references.length <= 0) {
                throw references;
            }
            var reference = references[0];
            if (typeof reference.Url !== 'string') {
                throw references;
            }
            var count = 0;
            for (var i = 0; i < references.length; i++) {
                count += HtmlView.LoadReferences(reference.Url, reference.Success, reference.Error);
            }
            return count;
        }
        var reference = references;
        if (typeof reference.Url != 'string') {
            throw reference;
        }
        return HtmlView.LoadReferences(reference.Url, reference.Success, reference.Error);
    } catch (e) {
    }
    return HtmlView.LoadReferences(references);
}
// 表示 HTMLControl 对象集合。
HtmlView.ControlCollection = function (owner) {
    /* 
     * MetadataToken(RID)
     *  typedef 
     *      HtmlView.ControlCollection class
     */
    if (!owner) {
        Throwable.ArgumentNullException();
    }
    if (!(__instanceof(owner, HtmlView) || __instanceof(owner, HtmlControl))) {
        Throwable.ArgumentException();
    }
    var __eventset = HtmlControl.EventSet;
    var _controls = [];
    var self = this;

    var GetDockMode = function (o) {
        return GetValue(o, 'Dock');
    }
    var SetValue = function (o, n, v) {
        return Object.SetPropertyValue(o, n, v);
    }
    var GetValue = function (o, n) {
        return Object.GetPropertyValue(o, n);
    }
    var docking = new (function DockingAlgorithm() { // dock control size controling algorithm
        'use strict'

        var EVENT_DOCKINGSIZECHANGED = '#__DockingSizeChanged'
        var SetRectangle = HtmlView.externs.SetRectangleAttribute;
        var GetRectangle = HtmlView.externs.GetRectangleAttribute;
        var GetBorderWidth = function (o, k) {
            var r = GetValue(o, 'BorderWidth');
            if (k) {
                return r[k];
            }
            return r;
        }
        var GetMarginValue = function (o, k) {
            var r = GetValue(o, 'Margin');
            if (k) {
                return r[k];
            }
            return r;
        }
        var GetContainer = function (o) {
            return GetValue(o, 'DOM');
        }
        var GetBesideControl = function (control, rectangle, count, dockStyle) {
            'use strict'

            if (!DockStyle.IsDefined(dockStyle)) {
                return null;
            }
            var r = null;
            var max = function (current, property) {
                var n = GetRectangle(current, property);
                if (!r || n > r.Item1) {
                    r = {
                        Item1: n,
                        Item2: current
                    };
                }
            }
            var min = function (current, property) {
                var n = GetRectangle(current, property);
                if (!r || n < r.Item1) {
                    r = {
                        Item1: n,
                        Item2: current
                    };
                }
            }
            for (var i = 0; i < count; i++) {
                var current = _controls[i];
                if (!current || current === control) {
                    continue;
                }
                var dockMode = GetDockMode(current);
                if (dockMode === DockStyle.None) {
                    continue;
                }
                if (dockMode === dockStyle) {
                    switch (dockStyle) {
                        case DockStyle.Left:
                            max(current, 'Left');
                            break;
                        case DockStyle.Top:
                            max(current, 'Top');
                            break;
                        case DockStyle.Right:
                            min(current, 'Left');
                            break;
                        case DockStyle.Bottom:
                            min(current, 'Top');
                            break;
                    }
                }
            }
            r = r ? r.Item2 : null;
            return r;
        }
        var __GetBorderWidth = function (x) {
            if (__instanceof(x, HtmlView) || __instanceof(x, HtmlControl)) {
                return GetBorderWidth(x);
            }
            return GetBorderWidth(x.Item2);
        }
        var __GetMarginValue = function (x) {
            if (__instanceof(x, HtmlView) || __instanceof(x, HtmlControl)) {
                return GetMarginValue(x);
            }
            return GetMarginValue(x.Item2);
        }
        var __updatechildrencontrols = function (owner) {
            'use strict'

            if (__instanceof(owner, HtmlControl) || __instanceof(owner, HtmlView)) {
                owner.internal.SetTextHVCenter();
                do {
                    var controls = owner.Controls;
                    var docking = controls.Docking;
                    docking.Update();
                } while (0, 0, 0, 0, 0, 0, 0, 0, 0);
            }
        }
        var __top = function (control, index, rectangle, donotset) {
            var top = GetBesideControl(control, rectangle, index, DockStyle.Top);
            var n = !top ? 0 : GetRectangle(top, 'Height') + GetRectangle(top, 'Top');
            if (top) {
                n += GetMarginValue(top, "Bottom");
                n += GetMarginValue(control, "Top");
            }
            if (donotset == 1) {
                return n;
            }
            if (donotset == 2) {
                return {
                    Item1: n,
                    Item2: control,
                }
            }
            SetRectangle(control, 'Top', n);
        }
        var __left = function (control, index, rectangle, donotset) {
            var left = GetBesideControl(control, rectangle, index, DockStyle.Left);
            var n = !left ? 0 : GetRectangle(left, 'Width') + GetRectangle(left, 'Left');
            if (left) {
                n += GetMarginValue(left, 'Left');
                n += GetMarginValue(control, 'Width');
            }
            if (donotset == 1) {
                return n;
            }
            if (donotset == 2) {
                return {
                    Item1: n,
                    Item2: left,
                };
            }
            SetRectangle(control, 'Left', n);
        }
        var __right = function (control, index, rectangle, donotset) {
            var right = GetBesideControl(control, rectangle, index, DockStyle.Right);
            var n = 0;
            if (donotset == 1 || donotset == 3) {
                n = !right ? rectangle.Width : GetRectangle(right, 'Left');
                n -= GetMarginValue(control, 'Right');
                if (donotset == 3) {
                    return {
                        Item1: n,
                        Item2: right,
                    };
                }
                return n;
            }
            if (!right) {
                n = rectangle.Width - GetRectangle(control, 'Width');
            } else {
                n = GetRectangle(right, 'Left') - GetRectangle(control, 'Width');
            }
            n -= GetMarginValue(control, 'Right');
            if (donotset == 2) {
                return n;
            }
            SetRectangle(control, 'Left', n);
        }
        var __bottom = function (control, index, rectangle, donetset) {
            var bottom = GetBesideControl(control, rectangle, index, DockStyle.Bottom);
            var n = 0;
            if (donetset == 1 || donetset == 3) {
                n = !bottom ? rectangle.Height : GetRectangle(bottom, 'Top');
                n -= GetMarginValue(control, 'Bottom');
                if (donetset == 3) {
                    return {
                        Item1: n,
                        Item2: control,
                    };
                }
                return n;
            }
            if (!bottom) {
                n = (rectangle.Height - GetRectangle(control, 'Height'));
            } else {
                n = (GetRectangle(bottom, 'Top') - GetRectangle(control, 'Height'));
            }
            n -= GetMarginValue(control, 'Bottom');
            if (donetset == 2) {
                return bottom;
            }
            SetRectangle(control, 'Top', n);
        }
        var __width = function (control, index, rectangle, dotnetset) {
            var left = __left(control, index, rectangle, 2);
            var right = __right(control, index, rectangle, 3);
            var width = (right.Item1 - left.Item1),
                width = width < 0 ? 0 : width,
                width = width > rectangle.Width ? rectangle.Width : width;
            if (dotnetset) {
                return width;
            }
            SetRectangle(control, 'Width', width);
        }
        var __height = function (control, index, rectangle, dotnetset) {
            var top = __top(control, index, rectangle, 2);
            var bottom = __bottom(control, index, rectangle, 3);
            var height = (bottom.Item1 - top.Item1),
                height = height < 0 ? 0 : height,
                height = height > rectangle.Height ? rectangle.Height : height;
            if (dotnetset) {
                return height;
            }
            SetRectangle(control, 'Height', height);
        }
        var __self = this;

        this.Update = function (index) { // formatting all controls that are owned
            'use strict'

            if (arguments.length <= 0 ||
                Object.IsNullOrUndefined(index) ||
                isNaN(index = Number(index)) ||
                index < 0) {
                index = 0;
            } else if (index >= _controls.length) {
                index = _controls.length - 1;
            }
            var rectangle = __instanceof(owner, HtmlView) ?
                GetRectangle(owner) :
                GetRectangle(owner, 0, 1);
            var origins = new Array();
            for (; index < _controls.length; index++) {
                var control = _controls[index];
                var dockMode = GetDockMode(control);
                if (dockMode === DockStyle.None) {
                    continue;
                }
                origins.push({
                    Width: GetRectangle(control, 'Width'),
                    Height: GetRectangle(control, 'Height'),
                    Control: control,
                });
                switch (dockMode) {
                    case DockStyle.Left:
                        __top(control, index, rectangle);
                        __left(control, index, rectangle);
                        __height(control, index, rectangle);
                        break;
                    case DockStyle.Right:
                        __top(control, index, rectangle);
                        __right(control, index, rectangle);
                        __height(control, index, rectangle);
                        break;
                    case DockStyle.Top:
                        __top(control, index, rectangle);
                        __left(control, index, rectangle);
                        __width(control, index, rectangle);
                        break;
                    case DockStyle.Bottom:
                        __bottom(control, index, rectangle);
                        __left(control, index, rectangle);
                        __width(control, index, rectangle);
                        break;
                    case DockStyle.Fill:
                        __left(control, index, rectangle);
                        __width(control, index, rectangle);
                        __top(control, index, rectangle);
                        __height(control, index, rectangle);
                        break;
                }
            }
            for (index = 0; index < origins.length; index++) {
                var origin = origins[index];
                if (!origin) {
                    continue;
                }
                var control = origin.control;
                if (!control) {
                    continue;
                }
                var height = GetRectangle(control, 'Height');
                var width = GetRectangle(control, 'Width');
                if (width !== origin.Width || height !== origin.Height) {
                    __updatechildrencontrols(control);
                }
            }
        }
        this.Bind = function (control) {
            'use strict'

            if (!__instanceof(control, HtmlControl)) {
                Throwable.ArgumentOutOfRangeException();
            }
            $(__events).each(function () {
                $(control).
                    off(this.event, this.handler).
                    on(this.event, this.handler);
            });
        }
        this.Unbind = function (control) {
            'use strict'

            if (!__instanceof(control, HtmlControl)) {
                Throwable.ArgumentOutOfRangeException();
            }
            $(__events).each(function () {
                $(control).off(this.event, this.handler);
            });
        }
        var __onSizeChanged = function () {
            __updatechildrencontrols(this);
        }
        var __onDockChanged = function () {
            'use strict'

            !(function (self) {
                'use strict'

                var ur = function (k) {
                    var set = HtmlView.externs.SetRectangleAttribute;
                    var get = Object.GetPropertyValue;
                    set(self, k, get(self, k));
                }
                ur('Left');
                ur('Top');
                ur('Width');
                ur('Height');
            })(this);
            if (GetDockMode(this)) {
                __self.Update(this.Index);
            }
        }
        var __events = [{
            event: __eventset.DockChanged,
            handler: __onDockChanged,
        }, {
            event: __eventset.MarginChanged,
            handler: __onDockChanged,
        }, {
            event: __eventset.ControlRemoved,
            handler: __onSizeChanged,
        }, {
            event: __eventset.BorderWidthChanged,
            handler: __onSizeChanged,
        }, {
            event: __eventset.BorderRadiusChanged,
            handler: __onSizeChanged,
        }, {
            event: __eventset.PaddingChanged,
            handler: __onSizeChanged,
        }];
        !(function () {
            'use strict'

            $(owner).off(__eventset.SizeChanged, __onSizeChanged).on(__eventset.SizeChanged, __onSizeChanged);
        })();
    })();
    var InternalRefreshAllIndex = function () {
        var compared = arguments[0];
        if (__instanceof(compared, HtmlControl)) {
            if (_controls[compared.Index] === compared) {
                return false;
            }
        }
        for (var i = 0; i < _controls.length; i++) {
            var control = _controls[i];
            if (!control) {
                continue;
            }
            control.Index = i;
        }
    }
    Object.defineProperty(self, 'Docking', {
        get: function () {
            return docking;
        }
    });
    this.toString = function () {
        'use strict'

        var s = [];
        for (var i = 0; i < _controls.length; i++) {
            var item = _controls[i];
            if (!item) {
                continue;
            }
            var name = Object.GetPropertyValue(item, 'Name');
            if (!name) {
                continue;
            }
            s.push(name);
        }
        return JSON.stringify(s);
    }
    this.Add = function (control) {
        'use strict'

        if (__instanceof(control, HtmlControl)) {
            if (HtmlView.FindControl(control, owner)) {
                Throwable.InvalidOperationException();
            }
            var get = Object.GetPropertyValue;
            var set = Object.SetPropertyValue;
            if (!this.Contains(control)) {
                _controls.push(control);
                do {
                    InternalRefreshAllIndex();
                    set(control, 'Parent', owner);
                    if (GetDockMode(control)) {
                        docking.Update();
                    }
                    docking.Bind(control);
                } while (0, 0);
                control.internal.SetTextHVCenter();
                __eventset.Publish2(control, __eventset.ControlAdded, [owner]);
            }
        } else {
            Throwable.ArgumentException();
        }
    }
    this.Remove = function (control) {
        'use strict'

        if (__instanceof(control, HtmlControl)) {
            var index = this.IndexOf(control);
            if (index > -1) {
                self.RemoveAt(index);
            }
        } else {
            Throwable.ArgumentException();
        }
    }
    this.RemoveAt = function (index) {
        'use strict'

        if (index < 0 && index >= _controls.length) {
            return false;
        }
        var deleteds = _controls.splice(index, 1);
        InternalRefreshAllIndex();
        var get = Object.GetPropertyValue;
        var set = Object.SetPropertyValue;
        for (var i = 0; i < deleteds.length; i++) {
            var current = deleteds[i];
            if (!current) {
                continue;
            }
            try {
                var parent = get(current, 'Parent');
                set(current, 'Parent', null);
                if (parent === owner) {
                    __eventset.Publish2(current, __eventset.ControlRemoved, [parent]);
                }
            } finally {
                docking.Unbind(current);
            }
        }
        return true;
    }
    this.RemoveAll = function () {
        return this.Clear();
    }
    this.Clear = function () {
        'use strict'

        while (this.Count > 0) {
            var control = this.Get(0);
            this.RemoveAt(0);
        }
    }
    this.Get = function (index) {
        return _controls[index];
    }
    this.Contains = function (control) {
        return this.IndexOf(control) > -1;
    }
    this.GetIndex = function (control) {
        return this.IndexOf(control);
    }
    this.IndexOf = function (control) {
        'use strict'

        if (__instanceof(control, HtmlControl)) {
            if (_controls[control.Index] === control) {
                return control.Index;
            }
            for (var i = 0; i < _controls.length; i++) {
                if (_controls[i] === control) {
                    return i;
                }
            }
        }
        return -1;
    }
    this.GetAll = function () {
        'use strict'

        var s = [];
        for (var i = 0; i < _controls.length; i++) {
            var control = _controls[i];
            if (!control) {
                continue;
            }
            s.push(control);
        }
        return s;
    }
    this.Contains = function (control) {
        return self.IndexOf(control) != -1;
    }
    Object.defineProperty(self, 'Count', {
        get: function () {
            return _controls.length;
        }
    });
    return self;
}
// 寻找指定的控件。
HtmlView.FindControl = function (owner, control) {
    'use strict'

    if (Object.IsNullOrUndefined(owner) || Object.IsNullOrUndefined(control)) {
        Throwable.ArgumentNullException();
    }
    if (!(__instanceof(control, HtmlView) || __instanceof(control, HtmlControl))) {
        Throwable.ArgumentOutOfRangeException();
    }
    if (!(__instanceof(owner, HtmlView) || __instanceof(owner, HtmlControl))) {
        Throwable.ArgumentOutOfRangeException();
    }
    var stacks = [{ depth: 1, data: owner, index: control ? control.Index : -1 }];
    while (stacks.length > 0) {
        var current = stacks.pop();
        var data = null;
        if (!current || !(data = current.data)) {
            continue;
        } else if (data === control) {
            return current;
        }
        var controls = data.Controls;
        for (var i = 0; i < controls.length; i++) {
            var j = controls[i];
            if (!j) {
                continue;
            }
            stacks.push({ data: j, depth: current.depth + 1, index: i });
        }
    }
}
// 指定控件停靠的位置和方式。
var DockStyle = new (function DockStyle() {
    'use strict'

    // 该控件未停靠。
    this.None = 0;
    // 该控件的上边缘停靠在其包含控件的顶端。
    this.Top = 1;
    // 该控件的下边缘停靠在其包含控件的底部。
    this.Bottom = 2;
    // 该控件的左边缘停靠在其包含控件的左边缘。
    this.Left = 3;
    // 该控件的右边缘停靠在其包含控件的右边缘。
    this.Right = 4;
    // 控件的各个边缘分别停靠在其包含控件的各个边缘，并且适当调整大小。
    this.Fill = 5;
    // 返回指定枚举中是否存在具有指定值的常数的指示。
    this.IsDefined = function (value) {
        'use strict'

        if (Object.IsNullOrUndefined(value)) {
            return false;
        }
        value = parseInt(value);
        if (isNaN(value)) {
            return false;
        }
        for (var key in this) {
            var n = this[key];
            if (typeof n === 'number' && n === value) {
                return true;
            }
        }
        return false;
    }
    // 返回指定枚举中是否指定 Left 属性不可被改变。
    this.LeftIsLock = function (value) {
        'use strict'

        if (Object.IsNullOrUndefined(value)) {
            return false;
        }
        value = Number(value);
        if (isNaN(value) || value === this.None) {
            return false;
        }
        return value === this.Top || value === this.Bottom ||
            value === this.Left || value === this.Right || value === this.Fill;
    }
    // 返回指定枚举中是否指定 Top 属性不可被改变。
    this.TopIsLock = function (value) {
        'use strict'

        return this.LeftIsLock(value);
    }
    // 返回指定枚举中是否指定 Width 属性不可被改变。
    this.WidthIsLock = function (value) {
        'use strict'

        if (Object.IsNullOrUndefined(value)) {
            return value;
        }
        value = Number(value);
        if (isNaN(value) || value === this.None) {
            return false;
        }
        return value === this.Top || value === this.Bottom || value === this.Fill;
    }
    // 返回指定枚举中是否指定 Height 属性不可被改变。
    this.HeightIsLock = function (value) {
        'use strict'

        if (Object.IsNullOrUndefined(value)) {
            return value;
        }
        value = Number(value);
        if (isNaN(value) || value === this.None) {
            return false;
        }
        return value === this.Left || value === this.Right || value === this.Fill;
    }
});
// 定义控件的基类，控件是带有可视化表示形式的组件。
var HtmlControl = function (options) {
    /* 
     * MetadataToken(RID)
     *  typedef 
     *      HtmlControl class 
     */
    if (!options || typeof options !== 'object' || __instanceof(options, Array)) {
        Throwable.ArgumentException();
    }
    var ScrollHtmlControlDirectionTimer = null;
    var _container = null;
    var _imageElement = null;
    var _textElement = null;
    var _self = this;
    var _parent = null;
    var _disposed = false;
    var _tag = null;
    var _scrollMode = 0;
    var _rotate = 0;
    var _backgroundImage = '';
    var _backgroundImageLayout = 0;
    var _expression = null;
    var _currentindex = -1;
    var _rttiTypeInfo = null;
    var _visible = true;
    var _left = 0;
    var _top = 0;
    var _width = 0;
    var _height = 0;
    var _backColor = new Color(~(1 << 31));
    var _GradualChangeColor = new Color(~(1 << 31));
    var _dockMode = DockStyle.None;
    var _dataBindings = new BindingsCollection(this);
    var _controls = new HtmlView.ControlCollection(this);
    var _eventset = HtmlControl.EventSet;
    var _fontstyle = FontStyle.Regular;
    var _ScrollDirection = 0;
    var _Shadow = '0,0,0';
    var _ShadowColor = '';
    var _canSelect = 0;
    var _canFocus = 0;
    var ThrowObjectDisposedException = function () {
        if (_disposed) {
            Throwable.ObjectDisposedException();
        }
    };
    var PublishEvent = function (name, e) {
        _eventset.Publish(name, _self, e);
    }

    this.internal = new (function Internal() {
        'use strict'

        var __nDelaySetTextHVCenter = null;

        this.Tag = null;
        this.SetTextHVCenter = function () {
            'use strict'

            var mode = arguments[0];
            clearTimeout(__nDelaySetTextHVCenter);
            __nDelaySetTextHVCenter = null;
            var handler = function () {
                var fGRA = HtmlView.externs.GetRectangleAttribute;
                var text = $(_textElement);
                var val = text.html();
                if (!val) {
                    text.html(' ');
                }
                if (_self.IsDisposed)
                    return;//释放成功后 不执行后续
                var top = fGRA(_self, 'Height'),
                    top = top - text.height(),
                    top = top / 2;
                text.css('top', top);
                do {
                    if (!val) {
                        text.html('');
                    }
                } while (0, 0, 0, 0, 0, 0);
                if (mode !== 0x01) {
                    var currentfontsize = Object.GetPropertyValue(_self, 'FontSize');
                    Object.SetPropertyValue(_self, 'FontSize', currentfontsize);
                }
            };
            if (!arguments[0]) {
                handler();
            } else {
                __nDelaySetTextHVCenter = setTimeout(handler, 0x01);
            }
        }
    });
    // 获取与控件的事件集信息。
    this.EventSet = _eventset;
    // 为控件添加一个事件的处理器。
    this.AddEvent = function (event, handler) {
        'use strict'

        if (!event || typeof event !== 'string' || typeof handler !== 'function') {
            Throwable.ArgumentOutOfRangeException();
        }
        $(_self).off(event, handler).on(event, handler);
    }
    // 从控件中移除指定的事件的处理器。
    this.RemoveEvent = function (event, handler) {
        'use strict'

        if (!event || typeof event !== 'object' || typeof handler !== 'function') {
            Throwable.ArgumentOutOfRangeException();
        }
        $(_self).off(event, handler);
    }
    // 获取或设置哪些控件边框停靠到其父控件并确定控件如何随其父级一起调整大小。
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
                PublishEvent(_eventset.DockChanged, mode);
            }
        }
    }
    // 获取一个值，该值指示控件是否已经被释放。
    Object.defineProperty(this, 'IsDisposed', {
        get: function () {
            return _disposed;
        }
    });
    // 获取或设置控件的名称。
    this.Name = function () {
        'use strict'

        if (arguments.length <= 0) {
            return _container.attr('id');
        }
        var name = arguments[0];
        if (name == $(_container).attr('id')) {
            return undefined;
        }
        if (!name) {
            Throwable.ArgumentNullException();
        }
        if (typeof name !== 'string') {
            Throwable.ArgumentException();
        }
        if (!(/^[A-Z|a-z|0-9]+$/.test(name))) {
            Throwable.ArgumentException();
        }
        var asc = name.charCodeAt(0);
        if (asc >= '0'.charCodeAt(0) && asc <= '9'.charCodeAt(0)) {
            Throwable.ArgumentNullException();
        }
        if (Object.IsDefined(name)) {
            Throwable.InvalidOperationException();
        }
        $(_container).attr('id', name);
    };
    // 获取控件的DOM元素容器。
    this.DOM = function () {
        'use strict'

        ThrowObjectDisposedException();
        if (arguments.length > 0)
            Throwable.NotImplementedException();
        return _container;
    };
    // 获取或设置控件左边缘与其容器的工作区左边缘之间的距离。
    this.Left = function () {
        'use strict'

        ThrowObjectDisposedException();
        if (arguments.length <= 0) {
            return _left; // parseInt($(_container).css('left'));
        }
        else if (!DockStyle.LeftIsLock(_dockMode)) {
            var value = arguments[0],
                value = Object.IsNullOrUndefined(value) ? 0 : Number(value),
                value = isNaN(value) || value < 0 ? 0 : value;
            if (_left !== value) {
                _left = value;
                HtmlView.externs.SetRectangleAttribute(this, 'left', value);
                PublishEvent(_eventset.LocationChanged, null);
            }
        }
    };
    // 获取或设置控件上边缘与其容器的工作区上边缘之间的距离。
    this.Top = function () {
        'use strict'

        ThrowObjectDisposedException();
        if (arguments.length <= 0) {
            return _top; // parseInt($(_container).css('top'));
        }
        else if (!DockStyle.TopIsLock(_dockMode)) {
            var value = arguments[0],
                value = Object.IsNullOrUndefined(value) ? 0 : Number(value),
                value = isNaN(value) || value < 0 ? 0 : value;
            if (_top !== value) {
                _top = value;
                HtmlView.externs.SetRectangleAttribute(this, 'top', value);
                PublishEvent(_eventset.LocationChanged, null);
            }
        }
    };
    // 获取或设置控件的宽度。
    this.Width = function () {
        'use strict'

        ThrowObjectDisposedException();
        if (arguments.length <= 0) {
            return _width; // $(_container).outerWidth();
        }
        else if (!DockStyle.WidthIsLock(_dockMode)) {
            var value = arguments[0],
                value = Object.IsNullOrUndefined(value) ? 0 : Number(value),
                value = isNaN(value) || value < 0 ? 0 : value;
            if (_width !== value) {
                _width = value;
                HtmlView.externs.SetRectangleAttribute(this, 'width', value);
                PublishEvent(_eventset.SizeChanged, null);
            }
        }
    };
    // 获取或设置控件的高度。
    this.Height = function () {
        'use strict'

        ThrowObjectDisposedException();
        if (arguments.length <= 0) {
            return _height; // $(_container).outerHeight();
        }
        else if (!DockStyle.HeightIsLock(_dockMode)) {
            var value = arguments[0],
                value = Object.IsNullOrUndefined(value) ? 0 : Number(value),
                value = isNaN(value) || value < 0 ? 0 : value;
            if (_height !== value) {
                _height = value;
                HtmlView.externs.SetRectangleAttribute(this, 'height', value);
                PublishEvent(_eventset.SizeChanged, null);
            }
        }
    };
    // 获取或设置一个值，该值指示是否显示该控件及其所有子控件。
    this.Visible = function () {
        'use strict'

        ThrowObjectDisposedException();
        if (arguments.length <= 0) {
            return _visible; // !$(_container).is(':hidden');
        }
        else {
            var value = (arguments[0] ? true : false);
            if (value != _visible) {
                (_visible = value) && _parent ?
                    $(_container).show() :
                    $(_container).hide();
                PublishEvent(_eventset.VisibleChanged, null);
            }
        }
    };
    // 获取或设置控件在其容器内的 Tab 键顺序。
    this.TabIndex = function () {
        'use strict'

        ThrowObjectDisposedException();
        if (arguments.length <= 0) {
            var value = Number($(_container).attr('tabindex')),
                value = isNaN(value) || value < 0 ? 0 : value;
            return value;
        }
        var value = arguments[0],
            value = Number(value),
            value = isNaN(value) || value < 0 ? 0 : value;
        $(_container).attr('tabindex', value);
    };
    // 获取或设置的 Z 序列。
    this.ZIndex = function () {
        'use strict'

        ThrowObjectDisposedException();
        if (arguments.length <= 0) {
            var value = Number($(_container).css('z-index')),
                value = isNaN(value) || value < 0 ? 0 : value;
            return value;
        }
        var value = arguments[0],
            value = Number(value),
            value = isNaN(value) || value < 0 ? 0 : value;
        $(_container).css('z-index', value);
    };
    // 获取或设置控件的父容器。
    this.Parent = function () {
        'use strict'

        ThrowObjectDisposedException();
        if (arguments.length <= 0) {
            return _parent;
        }
        var owner = arguments[0];
        var current = _parent;
        if (owner === this) {
            return false;
        }
        else if (Object.IsNullOrUndefined(owner)) {
            if (_parent) {
                var _controls = _parent.Controls;
                _controls.Remove(this);
            }
            _parent = null;
            _currentindex = -1;
            $(_container).hide();
        }
        else if (__instanceof(owner, HtmlControl) || __instanceof(owner, HtmlView)) {
            if (HtmlView.FindControl(this, owner)) {
                Throwable.InvalidOperationException();
            }
            if (current !== owner) {
                var _controls = null;
                if (_parent) {
                    _controls = _parent.Controls;
                    _controls.Remove(this);
                }
                _controls = owner.Controls;
                _parent = owner;
                _controls.Add(this);
                _currentindex = _controls.Count - 1;
                $(owner.DOM()).append($(_container));
                if (current !== _parent) {
                    PublishEvent(_eventset.ParentChanged, owner ? Object.GetPropertyValue(owner, 'Name') : null);
                }
            }
            _visible ? $(_container).show() : $(_container).hide();
        } else {
            Throwable.NotSupportedException();
        }
    };
    // 获取或设置包含有关控件的数据的对象。
    this.Tag = function () {
        'use strict'

        ThrowObjectDisposedException();
        if (arguments.length <= 0)
            return _tag;
        _tag = arguments[0];
    };
    // 获取或设置控件之间的空间。
    this.Margin = function () {
        'use strict'

        ThrowObjectDisposedException();
        return HtmlView.externs.RectangleGetOrSetAttribute(this,
            arguments,
            'marginLeft',
            'marginTop',
            'marginRight',
            'marginBottom',
            function (errno) {
                if (!errno) {
                    PublishEvent(_eventset.MarginChanged, null);
                }
            });
    };
    // 获取或设置控件内的空白。
    this.Padding = function () {
        'use strict'

        ThrowObjectDisposedException();
        return HtmlView.externs.RectangleGetOrSetAttribute(this,
            arguments,
            'paddingLeft',
            'paddingTop',
            'paddingRight',
            'paddingBottom',
            function (errno) {
                if (!errno) {
                    PublishEvent(_eventset.PaddingChanged, null);
                }
            });
    };
    // 获取或设置控件的不透明度级别。
    this.Opacity = function () {
        'use strict'

        ThrowObjectDisposedException();
        if (arguments.length <= 0) {
            return parseFloat($(_container).css('opacity'));
        }
        $(_container).css({ opacity: arguments[0] });
    };
    // 获取或设置控件的字体大小。
    this.FontSize = function () {
        'use strict'

        ThrowObjectDisposedException();
        if (arguments.length <= 0) {
            return parseFloat($(_container).css('font-size'));
        } else {
            $(_container).css({ 'font-size': arguments[0] });
            _self.internal.SetTextHVCenter(0x01);
        }
    };
    // 获取或设置控件的字体
    this.FontFamily = function () {
        'use strict'

        ThrowObjectDisposedException();
        if (arguments.length <= 0) {
            return eval($(_container).css('font-family'));
        } else {
            $(_container).css({ 'font-family': arguments[0] });
            _self.internal.SetTextHVCenter(0x01);
        }
    };
    // 获取或设置控件的字体样式。
    this.FontStyle = function () {
        'use strict'

        if (arguments.length <= 0) {
            return _fontstyle;
        } else {
            var mode = Number(arguments[0]);
            var e = $(_container);

            if (isNaN(mode) || !DockStyle.IsDefined(mode)) {
                Throwable.ArgumentOutOfRangeException();
            }

            if (_fontstyle != mode) {
                _fontstyle = mode;
                e.css({
                    'font-weight': 'normal',
                    'font-style': 'normal'
                });
                e.find('span').css('text-decoration', 'none')

                if (mode == 1) {
                    e.css('font-weight', 'bold');
                } else if (mode == 2) {
                    e.css('font-style', 'Italic');
                }
            }
        }
    };
    // 获取或设置控件是否可以接收焦点。
    this.CanFocus = function () {
        'use strict'

        if (arguments.length <= 0) {
            return _canFocus ? true : false;
        }
        var value = arguments[0] ? true : false;
        if (_canFocus !== value) {
            _canFocus = value;
            HtmlView.externs.SetCanFocus(this, value);
        }
    }
    // 获取或设置是否可以选中控件。
    this.CanSelect = function () {
        'use strict'

        if (arguments.length <= 0) {
            return _canSelect ? true : false;
        }
        var value = arguments[0] ? true : false;
        if (_canSelect !== value) {
            _canSelect = value;
            HtmlView.externs.SetCanSelect(this, value);
        }
    }
    // 释放由 HtmlControl 使用的所有资源。（继承自 HtmlControl。）
    this.Dispose = function () {
        'use strict'

        if (!_disposed) {
            _dataBindings.Clear();
            _controls.RemoveAll();
            _self.Parent(null);
            $(_container).remove();
        }
        _parent = null;
        _disposed = true;
    };
    // 获取或设置控件的滚动条的显示模式。
    this.ScrollMode = function () {
        'use strict'

        ThrowObjectDisposedException();
        if (arguments.length <= 0) {
            return _scrollMode;
        }
        var mode = Number(arguments[0]);
        if (isNaN(mode) || mode < 0 || mode > 6) {
            Throwable.ArgumentOutOfRangeException();
        }
        var e = $(_container);
        e.css({ 'overflow-x': 'hidden' });
        e.css({ 'overflow-y': 'hidden' });
        if (mode == 0) // 不显示滚动条
            e.css({ 'overflow': 'hidden' });
        else if (mode == 1) // 自动显示水平垂直滚动条
            e.css({ 'overflow': 'auto' });
        else if (mode == 2) // 固定显示水平滚动条
            e.css({ 'overflow-x': 'scroll' });
        else if (mode == 3) // 固定显示垂直滚动条
            e.css({ 'overflow-y': 'scroll' });
        else if (mode == 4) // 固定显示水平垂直滚动条
            e.css({ 'overflow': 'scroll' });
        else if (mode == 5) // 自动显示水平滚动条
            e.css({ 'overflow-x': 'auto' });
        else if (mode == 6) // 自动显示垂直滚动条
            e.css({ 'overflow-y': 'auto' });
        _scrollMode = mode;
    };
    // 获取或设置控件的旋转角度（deg）。
    this.Rotate = function () {
        'use strict'

        ThrowObjectDisposedException();
        if (arguments.length <= 0) {
            return _rotate;
        }
        var e = $(_container);
        var rotate = arguments[0];
        e.css({
            'transform': 'rotate({0}deg)'.replace('{0}', rotate),
            '-ms-transform': 'rotate({0}deg)'.replace('{0}', rotate),
            '-moz-transform': 'rotate({0}deg)'.replace('{0}', rotate),
            '-webkit-transform': 'rotate({0}deg)'.replace('{0}', rotate),
            '-o-transform': 'rotate({0}deg)'.replace('{0}', rotate),
        });
        _rotate = rotate;
    };
    // 获取或设置在控件中显示的背景图像。（继承自 HtmlControl。）
    this.BackgroundImage = function () {
        'use strict'

        ThrowObjectDisposedException();
        if (arguments.length <= 0) {
            return _backgroundImage;
        }
        var current = _backgroundImage;
        var value = arguments[0];
        if (!value) {
            value = '';
        }
        if (current != value) {
            var img = $(_imageElement).find("img");
            img.attr('src', value);
            _backgroundImage = value;

            PublishEvent(_eventset.BackgroundImageChanged, [value, current]);
        }
    };
    // 获取或设置在 ImageLayout 枚举中定义的背景图像布局。（继承自 HtmlControl。）
    this.BackgroundImageLayout = function () {
        'use strict'

        ThrowObjectDisposedException();
        if (arguments.length <= 0) {
            return _backgroundImageLayout;
        }
        var mode = Number(arguments[0]);
        if (isNaN(mode) || mode < 0 || mode > 3) {
            Throwable.ArgumentOutOfRangeException();
        }
        $(_imageElement).
            find('img').
            css('height', 'none').
            css('width', 'none').
            css('max-width', 'none').
            css('max-width', 'none').
            css('position', 'none').
            css('transform', 'none').
            css('-ms-transform', 'none').
            css('-moz-transform', 'none').
            css('-webkit-transform', 'none').
            css('-o-transform', 'none').
            css('left', 'none').
            css('top', 'none');
        if (mode == 0) { // 映像是沿控件的矩形工作区的顶部左侧对齐。
            $(_imageElement).
                find('img').
                css('position', 'absolute').
                css('left', '0').
                css('top', '0').
                css('bottom', '0').
                css('right', '0').

                css('height', 'none').
                css('width', 'none').
                css('max-width', 'none').
                css('max-width', 'none');
        } else if (mode == 1) { // 图像会增大该控件的客户端矩形范围内。
            $(_imageElement).
                find('img').
                css('position', 'absolute').
                css('left', '0').
                css('top', '0').
                css('bottom', '0').
                css('right', '0').

                css('max-height', '100%').
                css('max-width', '100%');
        } else if (mode == 2) { // 映像是沿控件的矩形工作区。
            $(_imageElement).
                find('img').
                css('position', 'absolute').
                css('left', '0').
                css('top', '0').
                css('bottom', '0').
                css('right', '0').

                css('height', '100%').
                css('width', '100%').
                css('max-width', '100%').
                css('max-width', '100%');
        } else if (mode == 3) { // 图像控件的客户端矩形内居中。
            $(_imageElement).
                find('img').
                css('position', 'absolute').
                css('left', '0').
                css('top', '0').
                css('bottom', 'none').
                css('right', 'none').

                css('max-width', '100%').
                css('max-width', '100%').
                css('position', 'absolute').
                css('left', '50%').
                css('top', '50%').
                css('transform', 'translate(-50%,-50%)').
                css('-ms-transform', 'translate(-50%,-50%)').
                css('-moz-transform', 'translate(-50%,-50%)').
                css('-webkit-transform', 'translate(-50%,-50%)').
                css('-o-transform', 'translate(-50%,-50%)');
        }
        _backgroundImageLayout = mode;
    };
    // 获取或设置与此控件关联的文本。
    this.Text = function () {
        'use strict'

        if (arguments.length <= 0) {
            return $(_textElement).text();
        }
        var str = arguments[0];
        if (Object.IsNullOrUndefined(str)) {
            str = '';
        } else if (typeof str !== 'string') {
            str = str.toString();
        }
        if (str.length > 0) {
            str = str.
                replaceAll('\r\n', '\r').
                replaceAll('\r', '\r\n');
        }
        $(_textElement).text(str);
        _self.internal.SetTextHVCenter();
    };
    // 获取或设置与此控件关联的文本的水平对齐方式。
    this.TextAlign = function () {
        'use strict'

        if (arguments.length <= 0) {
            return $(_container).find('span').css('text-align');
        } else {
            $(_container).find('span').css({ 'text-align': arguments[0] });
        }
    };
    this.LetterSpacing = function () {
        'use strict'
        if (arguments.length <= 0) {
            return parseInt($(_container).find('span').css('letter-spacing'));
        } else {
            var value = arguments[0],
                value = Object.IsNullOrUndefined(value) ? 0 : Number(value),
                value = isNaN(value) || value < 0 ? 0 : value;
            $(_container).find('span').css({ 'letter-spacing': value + 'px' });
        }
    }
    // 获取或设置控件的背景色。
    this.BackColor = function () {
        'use strict'

        var e = $(_container);
        if (arguments.length <= 0) {
            return _backColor.toString('x');
        }
        else {
            var color = arguments[0];
            if (!__instanceof(color, Color)) {
                color = new Color(color);
            }
            if (color.Argb !== _backColor.Argb) {
                var origin = _backColor.toString('x');
                var rgba = (_backColor = color).toString('s');
                //e.css('background-color', rgba);
                var gcc = _GradualChangeColor.toString('s');
                if (gcc == 'rgba(255, 255, 255, 0.50)') {
                    let backC = _backColor.toString('s');
                    e.css('background', 'linear-gradient(to bottom,' + backC + ' ,' + backC);
                } else {
                    e.css('background', 'linear-gradient(to bottom,' + _backColor.toString('s') + ' ,' + gcc);
                }
                PublishEvent(_eventset.BackColorChanged, [origin, color.toString('x')]);
            }
        }
    };
    this.GradualChangeColor = function () {
        'use strict'

        var e = $(_container);
        if (arguments.length <= 0) {
            return _GradualChangeColor.toString('x');
        }
        else {
            var color = arguments[0];
            if (!__instanceof(color, Color)) {
                color = new Color(color);
            }
            if (color.Argb !== _GradualChangeColor.Argb) {
                var origin = _GradualChangeColor.toString('x');
                var rgba = (_GradualChangeColor = color).toString('s');
                //e.css('background-color', rgba);
                e.css('background', 'linear-gradient(to bottom,' + _backColor.toString('s') + ' ,' + rgba);
                //PublishEvent(_eventset.BackColorChanged, [origin, color.toString('x')]);
            }
        }
    };
    // 获取或设置控件的前景色。
    this.ForeColor = function () {
        'use strict'

        var e = $(_container).find('.HtmlControl_Text');
        if (arguments.length <= 0) {
            return Color.ArgbStringToArgbHex(e.css('color'));
        }
        else {
            if (__instanceof(arguments[0], Color)) {
                arguments[0] = arguments[0].toString();
            }
            e.css('color', Color.ArgbHexToArgbString(arguments[0]));
        }
    };
    // 获取或设置控件的边框圆角度。
    this.BorderRadius = function () {
        'use strict'

        ThrowObjectDisposedException();
        return HtmlView.externs.RectangleGetOrSetAttribute(this,
            arguments,
            'border-top-left-radius',
            'border-top-right-radius',
            'border-bottom-right-radius',
            'border-bottom-left-radius', function (errno) {
                if (!errno) {
                    PublishEvent(_eventset.BorderRadiusChanged, null);
                }
            });
    }
    // 获取或设置控件的边框颜色。
    this.BorderColor = function () {
        'use strict'

        var e = $(_container);
        if (arguments.length <= 0) {
            return Color.ArgbStringToArgbHex(e.css('border-color'));
        }
        else {
            if (__instanceof(arguments[0], Color)) {
                arguments[0] = arguments[0].toString();
            }
            e.css('border-color', Color.ArgbHexToArgbString(arguments[0]));
        }
    }
    // 获取或设置控件的边框宽度。
    this.BorderWidth = function () {
        'use strict'

        ThrowObjectDisposedException();
        return HtmlView.externs.RectangleGetOrSetAttribute(this,
            arguments,
            'border-left-width',
            'border-top-width',
            'border-right-width',
            'border-bottom-width', function (errno) {
                if (!errno) {
                    PublishEvent(_eventset.BorderWidthChanged, null);
                }
            });
    };
    // 获取或设置控件的边框样式。
    this.BorderStyle = function () {
        'use strict'

        if (arguments.length <= 0) {
            return $(_container).css('border-style');
        } else {
            $(_container).css({ 'border-style': arguments[0] });
            _self.internal.SetTextHVCenter(0x01);
        }
    };

    this.Shadow = function () {
        'use strict'
        ThrowObjectDisposedException();
        if (arguments.length <= 0) {
            return _Shadow;
        } else {
            var sd = arguments[0].split(',');
            if (sd.length == 3) {
                var e = $(_container);
                _Shadow = arguments[0];
                e.css('box-shadow', sd[0] + 'px ' + sd[1] + 'px ' + sd[2] + 'px ' + '#888888');
            }
        }
    }
    this.ShadowColor = function () {
        'use strict'
        ThrowObjectDisposedException();
        if (arguments.length <= 0) {
            return _ShadowColor;
        } else {
            var sd = _Shadow.split(',');
            if (sd.length == 3) {
                var e = $(_container);
                _ShadowColor = arguments[0];
                e.css('box-shadow', sd[0] + 'px ' + sd[1] + 'px ' + sd[2] + 'px ' + Color.ArgbHexToArgbString(arguments[0]));
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
            this.StartHtmlControlTimer($('#' + this.Name() + ' span'), _ScrollDirection, $('#' + this.Name()).width());
        }
    }
    this.StartHtmlControlTimer = function (dome, style, boxWidth) {
        var top = 0;
        var type = 'left';
        var lenth = 0;
        if (style == 2) {
            type = 'left';
            lenth = dome.height();
        }
        if (style == 3) {
            type = 'left';
            lenth = dome.width();
            dome.css('white-space', 'nowrap');
        }
        if (ScrollHtmlControlDirectionTimer)
            clearInterval(ScrollHtmlControlDirectionTimer);
        dome.css(type, 0);
        if (style == 0) {
            return;
        }
        ScrollHtmlControlDirectionTimer = window.setInterval(function () {
            top--;
            dome.css(type, top);
            //if (top < '-'+high) {
            //    top = 0;
            //};
        }, 10);
        setInterval(function () {
            if (top < '-' + (lenth + boxWidth)) {
                top = boxWidth;
            };
        }, 1500)
    }
    // 获取当前实例的 Type (RTTI)信息。
    this.GetType = function () {
        'use strict'

        if (_rttiTypeInfo == null) {
            _rttiTypeInfo = HtmlControl.prototype.GetType();
        }
        return _rttiTypeInfo;
    };

    // 计算访问到此控件的代码表达式（调用链路径）。
    Object.defineProperty(_self, 'Expression', {
        get: function () {
            'use strict'

            if (!_parent) {
                _expression = null;
            } else {
                var p = _parent.Expression;
                if (!p) {
                    p = '';
                }
                return p + '.Controls.Get(' + _currentindex + ')';
            }
            return _expression;
        }
    });
    // 计算此控件在父容器的索引位置。
    Object.defineProperty(_self, 'Index', {
        get: function () {
            return _currentindex;
        },
        set: function (value) {
            _currentindex = value;
        }
    });
    // 获取包含在控件内的控件的集合。
    Object.defineProperty(_self, 'Controls', {
        get: function () {
            return _controls;
        }
    });
    // 获取控件所属的视图。
    Object.defineProperty(_self, 'Owner', {
        get: function () {
            'use strict'

            var owner = _self;
            do {
                owner = owner.Parent();
                if (__instanceof(owner, HtmlView)) {
                    return owner;
                }
            } while (owner != null);
            return null;
        }
    });
    // 为该控件获取数据绑定。
    Object.defineProperty(_self, 'DataBindings', {
        get: function () {
            return _dataBindings;
        }
    });
    // .cctor
    !(function () {
        'use strict'

        _container = $('<div id="HtmlControl" class="HtmlControl" style="position: absolute; overflow:hidden; border-style: solid; background-color: rgb(255, 255, 255); left: 0; top: 0; width: 0; height: 0;margin: 0;">');
        _imageElement = $('<div class="HtmlControl_BackgroundImage" style="position: absolute; left: 0; right: 0; top: 0; bottom: 0;"><img style="max-height: 100%; max-width: 100%"></div>');
        _textElement = $('<span class="HtmlControl_Text" style="position: absolute;text-align:center;width: 100%;left:-1px;"></span>');
        _container.append(_imageElement);
        _container.append(_textElement);
        Object.SetPropertyValue(_self, 'FontSize', 14);
        Object.SetPropertyValue(_self, 'CanSelect', false);
        Object.SetPropertyValue(_self, 'CanFocus', true);
        HtmlControl.Initialization(_self, HtmlControl.defaults, options);
    })();
}
// 获取与控件的事件集信息。
HtmlControl.EventSet = (function () {
    this.DockChanged = 'DockChanged';
    this.SizeChanged = 'SizeChanged';
    this.BorderWidthChanged = 'BorderWidthChanged';
    this.VisibleChanged = 'VisibleChanged';
    this.ParentChanged = 'ParentChanged';
    this.MarginChanged = 'MarginChanged';
    this.PaddingChanged = 'PaddingChanged';
    this.BorderRadiusChanged = 'BorderRadiusChanged';
    this.BackgroundImageChanged = 'BackgroundImageChanged';
    this.BackColorChanged = 'BackColorChanged';
    this.ControlRemoved = 'ControlRemoved';
    this.ControlAdded = 'ControlAdded';
    this.LocationChanged = 'LocationChanged';
    this.Publish = function () { // 发布一个事件。
        'use strict'

        var event = arguments[0],
            sender = arguments[1],
            e = arguments[2];
        if (typeof event !== 'string') {
            Throwable.InvalidOperationException();
        }
        $(sender).trigger(event, e);
    }
    this.Publish2 = function () { // 发布一个事件2。
        'use strict'

        var event = arguments[1],
            sender = arguments[0],
            e = arguments[2];
        return this.Publish(event, sender, e);
    }
});
// 为 HtmlView 扩展的方法集。
HtmlView.externs = (function () {
    'use strict'

    var self = this;

    this.SetRectangleAttribute = function (o, n, v) {
        'use strict'

        if (Object.IsNullOrUndefined(o) || typeof n !== 'string') {
            Throwable.ArgumentOutOfRangeException();
        }
        n = n.toLowerCase();
        if (n !== 'left' &&
            n !== 'top' &&
            n !== 'width' &&
            n !== 'height') {
            Throwable.NotSupportedException();
        }
        o = self.GetHtmlElement(o);
        o.css(n, v);
    }
    this.GetRectangleAttribute = function (o, n, ca) {
        'use strict'

        if (Object.IsNullOrUndefined(o)) {
            Throwable.ArgumentOutOfRangeException();
        }
        if (typeof n !== 'string') {
            return new HtmlView.Rectangle({
                Left: self.GetRectangleAttribute(o, 'Left', ca),
                Top: self.GetRectangleAttribute(o, 'Top', ca),
                Width: self.GetRectangleAttribute(o, 'Width', ca),
                Height: self.GetRectangleAttribute(o, 'Height', ca),
            });
        }
        n = n.toLowerCase();
        if (n !== 'left' &&
            n !== 'top' &&
            n !== 'width' &&
            n !== 'height') {
            Throwable.NotSupportedException();
        }
        o = self.GetHtmlElement(o);
        var v = 0;
        switch (n) {
            case 'width':
                if (ca) {
                    v = o.width();
                }
                else {
                    v = o.outerWidth();
                }
                break;
            case 'height':
                if (ca) {
                    v = o.height();
                }
                else {
                    v = o.outerHeight();
                }
                break;
            default:
                v = o.css(n);
                v = Object.IsNullOrUndefined(v) ? 0 : parseInt(v);
                v = isNaN(v) ? 0 : v;
                break;
        }
        v = Math.ceil(v < 0 ? 0 : v);
        return v;
    }
    this.RectangleGetOrSetAttribute = function (component, params, left, top, width, height, error) {
        'use strict'

        if (!(__instanceof(component, HtmlView) || __instanceof(component, HtmlControl))) {
            Throwable.ArgumentOutOfRangeException();
        }
        if (!left || !top || !width || !height) {
            Throwable.ArgumentOutOfRangeException();
        }
        var e = $(component.DOM());
        if (!params || params.length <= 0) {
            var rect = new HtmlView.Rectangle();
            rect.Left = Math.ceil(e.css(left).replace(/[^0-9|\\.]/gm, ""));
            rect.Top = Math.ceil(e.css(top).replace(/[^0-9|\\.]/gm, ""));
            rect.Width = Math.ceil(e.css(width).replace(/[^0-9|\\.]/gm, ""));
            rect.Height = Math.ceil(e.css(height).replace(/[^0-9|\\.]/gm, ""));
            return rect;
        }
        if (!params[0]) {
            Throwable.ArgumentNullException();
        }
        var value = new HtmlView.Rectangle(params[0]);
        value.Left = parseInt(value.Left);
        value.Top = parseInt(value.Top);
        value.Width = parseInt(value.Width);
        value.Height = parseInt(value.Height);

        var current = this.RectangleGetOrSetAttribute(component, null, left, top, width, height, error);
        var errno = 1;
        if (current.Left !== value.Left ||
            current.Top !== value.Top ||
            current.Width !== value.Width ||
            current.Height !== value.Height) {

            errno = 0;

            e.css(left, value.Left);
            e.css(top, value.Top);
            e.css(width, value.Width);
            e.css(height, value.Height);
        }
        if (typeof error === 'function') {
            error(errno);
        }
    }
    this.SetCanFocus = function (o, value) {
        'use strict'

        o = self.GetHtmlElement(o);
        var handler = self.SetCanFocus.constructor.EventHandler;
        if (typeof handler !== 'function') {
            handler = self.SetCanFocus.constructor.EventHandler = function () {
                'use strict'

                var e = arguments[0] || window.event;
                e.preventDefault();
                $(this).blur();
            }
        }
        if (value) {
            o.off('focus', handler);
        } else {
            o.focus(handler);
        }
    }
    this.GetHtmlElement = function (o) {
        'use strict'

        if (Object.IsNullOrUndefined(o)) {
            Throwable.ArgumentOutOfRangeException();
        }
        if ($(document.body).constructor !== o.constructor) {
            if (__instanceof(o, HTMLElement)) {
                o = $(o);
            }
            else if (__instanceof(o, HtmlView) || __instanceof(o, HtmlControl)) {
                o = $(Object.GetPropertyValue(o, 'DOM'));
            } else {
                Throwable.ArgumentOutOfRangeException();
            }
        }
        return $(o);
    }
    this.SetCanSelect = function (o, value) {
        'use strict'

        o = self.GetHtmlElement(o);
        if (value) {
            o.css('moz-user-select', '').
                css('-moz-user-select', '').
                css('-o-user-select', '').
                css('-khtml-user-select', '').
                css('-webkit-user-select', '').
                css('-ms-user-select', '').
                css('user-select', '');
        } else {
            o.css('moz-user-select', '-moz-none').
                css('-moz-user-select', 'none').
                css('-o-user-select', 'none').
                css('-khtml-user-select', 'none').
                css('-webkit-user-select', 'none').
                css('-ms-user-select', 'none').
                css('user-select', 'none');
        }
    }
    !+(function () {
        'use strict'

        var conversionpathsegmentsymbol = function (s) {
            if (typeof s !== 'string') {
                return '';
            }
            return s.replaceAll("\\\\", "/").replaceAll("\\", "/").replaceAll("//", "/").trim();
        }
        var filterinvalidcharacters = function (s) {
            'use strict'

            if (typeof s !== 'string') {
                return '';
            }
            var filters = ["\\", "/", ":", "*", "?", '"', "<", ">", "|"];
            for (var i = 0; i < filters.length; i++) {
                var filter = filters[i];
                if (s.length <= 0) {
                    return "";
                }
                var j = s.indexOf(filter);
                if (j > -1) {
                    s = s.substr(0, j);
                }
            }
            return s;
        }
        var strisnulloremptry = function (s) {
            return !(s !== '' && s !== null && s !== undefined);
        }
        var filterprotocolheader = function (s) {
            'use strict'

            if (typeof s !== 'string') {
                return '';
            }
            var f = ['file:///', 'ftp://', 'http://', 'https://', 'https:/', 'http:/', 'file://', 'file:/'];
            for (var j = 0; j < f.length; j++) {
                var n = f[j];
                var i = s.indexOf(n);
                if (i >= 0) {
                    s = s.substr(i + n.length);
                }
            };
            return s;
        }
        self.GetNetworkProtocol = function (s) {
            'use strict'

            var path = typeof arguments[0] !== "string" ?
                window.location.href : arguments[0];
            if (!path) {
                path = '';
            }
            var i = path.indexOf('//');
            var protocol = 0; // http
            if (i > -1) {
                var s = path.substr(0, i + 2);
                if (typeof s === "string") {
                    s = s.toLowerCase();
                    if (s === "file://") {
                        protocol = 1; // file
                    } else if (s === "ftp://") {
                        protocol = 2;
                    } else if (s === "https://") {
                        protocol = 3;
                    }
                }
            }
            if (protocol === 1) {
                return "file";
            } else if (protocol === 2) {
                return "ftp";
            } else if (protocol === 3) {
                return "https";
            }
            return "http";
        }
        self.GetNetworkPort = function (s) {
            'use strict'

            if (!s) {
                s = window.location.href;
            }
            var proto = self.GetNetworkProtocol(s);
            if (s && (proto === "http" || proto === "ftp" || proto === "https")) {
                s = s.toString().toLowerCase();
                var segments = s.split('/');
                var fghdr = false;
                for (var i = 0; i < segments.length; i++) {
                    var c = segments[i];
                    if (strisnulloremptry(c)) {
                        continue;
                    }
                    if (fghdr && c.indexOf(':') > -1) {
                        s = c;
                        break;
                    }
                    if (c.indexOf("http") > -1 || c.indexOf("ftp") > -1 || c.indexOf("https") > -1) {
                        fghdr = true;
                    }
                }
                var i = s.indexOf(':');
                if (i > 0) {
                    c = s.substr(i + 1);
                    var k = c.match(/[0-9]+/);
                    if (k && k.length > 0) {
                        k = Number(k[0]);
                        if (!isNaN(k)) {
                            return k;
                        }
                    }
                }
            }
            if (proto === "https") {
                return 443;
            } else if (proto === "ftp") {
                return 21;
            } else if (proto === "file") {
                return 0;
            }
            return 80;
        }
        self.GetFileExtension = function (s) {
            'use strict'

            if (!s) {
                return "";
            }
            s = conversionpathsegmentsymbol(s.toString());
            if (!s) {
                return '';
            }
            var i = s.indexOf("?");
            if (i >= 0) {
                s = s.substr(0, i);
            }
            i = s.indexOf("#");
            if (i >= 0) {
                s = s.substr(0, i);
            }
            i = s.lastIndexOf(".");
            if (i >= 0) {
                if (s.indexOf('/', i) > -1) {
                    i = -1;
                }
            }
            if (i < 0) {
                return '';
            }
            s = filterinvalidcharacters(s.substr(i));
            if (typeof s === 'string') {
                s = s.toLowerCase();
            }
            return s;
        }
        self.GetFileNameWithoutExtension = function (s) {
            'use strict'

            if (!s) {
                return "";
            }
            s = conversionpathsegmentsymbol(s.toString());
            if (!s) {
                return '';
            }
            var i = s.indexOf("?");
            if (i >= 0) {
                s = s.substr(0, i);
            }
            i = s.indexOf("#");
            if (i >= 0) {
                s = s.substr(0, i);
            }
            i = s.lastIndexOf(".");
            if (i >= 0) {
                if (s.indexOf('/', i) > -1) {
                    i = -1;
                }
            }
            var left = i < 0 ? s : s.substr(0, i);
            i = left.lastIndexOf("/");
            if (i < 0) {
                return "";
            }
            left = left.substr(i + 1);
            if (!left) {
                return "";
            }
            if (arguments[1] === false) {
                return left;
            }
            var ext = self.GetFileExtension(s);
            if (ext) {
                left += ext;
            }
            return left;
        }
        self.GetFileName = function (s) {
            return self.GetFileNameWithoutExtension(s, false);
        }
        self.GetDirectoryName = function (s) {
            'use strict'

            var e = function () {
                if (!s) {
                    return '';
                }
                s = conversionpathsegmentsymbol(s.toString());
                if (!s) {
                    return '';
                }
                var i = s.indexOf('?');
                if (i > 0) {
                    s = s.substr(0, i);
                }
                i = s.indexOf('#');
                if (i >= 0) {
                    s = s.substr(0, i);
                }
                if (!arguments[0]) {
                    var file = self.GetFileNameWithoutExtension(s);
                    if (!file) {
                        file = '';
                        i = s.lastIndexOf('/');
                        if (i >= 0) {
                            s = s.substr(0, i);
                        }
                        i = s.lastIndexOf('\\');
                        if (i >= 0) {
                            s = s.substr(0, i);
                        }
                    } else {
                        i = s.lastIndexOf(file);
                        if (i < 0) {
                            return '';
                        }
                        s = s.substr(0, i);
                    }
                }
                s = filterprotocolheader(s);
                if (!s) {
                    return '';
                }
                var i = s.length - 1;
                var n = s.charAt(i);
                if (n === '/' || n === '\\') {
                    s = s.substr(0, i);
                }
                return s.replaceAll('//', '/').toLowerCase();
            }
            var t = function (s) {
                if (!s) {
                    return '';
                }
                var i = s.lastIndexOf('/');
                if (i > -1) {
                    s = s.substr(i + 1);
                }
                return s;
            }
            if (arguments[1] == 1) {
                s = t(e(0));
            } else if (arguments[1] == 2) {
                s = t(e(1));
            } else {
                s = e();
            }
            return s;
        }
        self.GetPathRoot = function (s) {
            'use strict'

            var e = function (s) {
                'use strict'

                s = self.GetDirectoryName(s);
                if (!s) {
                    return '';
                }
                var i = s.indexOf('/');
                if (i < 0) {
                    return s;
                }
                s = s.substr(0, i + 1);
                if (!s) {
                    return '';
                }
                var i = s.length - 1;
                var n = s.charAt(i);
                if (n === '\\') {
                    s = s.substr(0, i);
                }
                i = s.length - 1;
                n = s.charAt(i);
                if (n !== '/') {
                    s = s + '/';
                }
                return s.toLowerCase();
            }
            s = e(s);
            if (!s) {
                return '';
            }
            var i = s.length - 1;
            var c = s.charAt(i);
            if (c === '\\') {
                s = s.substr(0, i);
            }
            if (!s) {
                return '';
            }
            if (c !== '/') {
                s = s + '/';
            }
            if (s === '../' || s === './' || s === "/") {
                return '';
            }
            return s;
        }
        self.HasFileExtension = function (s) {
            return !strisnulloremptry(self.GetFileExtension(s));
        }
        self.GetCurrentDirectory = function () {
            return self.GetDirectoryName(window.location.href);
        }
        self.GetFullPath = function (path) { // 相对路径解析
            'use strict'

            if (!path) {
                return '';
            }
            path = conversionpathsegmentsymbol(path.toString().toLowerCase());
            if (!path) {
                return '';
            } else {
                var i = path.indexOf('?');
                if (i > 0) {
                    path = path.substr(0, i);
                }
                i = path.indexOf('#');
                if (i >= 0) {
                    path = path.substr(0, i);
                }
            }
            var currentdir = arguments[1];
            if (!currentdir) {
                currentdir = self.GetCurrentDirectory();
            }
            if (currentdir) {
                currentdir = conversionpathsegmentsymbol(currentdir.toString().toLowerCase());
                if (!currentdir) {
                    return '';
                }
                var ch = -1;
                while (currentdir.charAt((ch = (currentdir.length - 1))) === "/") {
                    currentdir = currentdir.substr(0, ch);
                }
            }
            if (!currentdir) {
                return '';
            }
            var currrootname = self.GetPathRoot(path);
            var nonrootname = strisnulloremptry(currrootname);
            if (nonrootname) {
                currrootname = self.GetPathRoot(currentdir);
            }
            var segments = path.split('/');
            var fullpath = '';
            var togobackok = false;
            var togohomeok = false;
            var tobackpath = '';
            var tocurrentdirit = currentdir;
            for (var i = 0, fsttdd = 0; i < segments.length; i++) {
                var segment = segments[i];
                if (strisnulloremptry(segment)) { // jmp up
                    if (i <= 0) {
                        togohomeok = true;
                        fullpath = currrootname + fullpath;
                    }
                    continue;
                }
                if (segment === "..") {
                    if (togobackok || togohomeok) {
                        continue;
                    }
                    tocurrentdirit = self.GetDirectoryName(tocurrentdirit);
                    var name = self.GetDirectoryName(tocurrentdirit, 2);
                    if (!name || !tocurrentdirit) {
                        continue;
                    }
                    tobackpath = name + "/" + tobackpath;
                } else if (segment === '.') {
                    if (togobackok) {
                        continue;
                    } else {
                        togobackok = true;
                    }
                    var name = self.GetDirectoryName(currentdir, 2);
                    tocurrentdirit = self.GetDirectoryName(tocurrentdirit);
                    if (!name || !tocurrentdirit) {
                        continue;
                    }
                    fullpath = name + "/" + fullpath;
                } else {
                    togobackok = true;
                    fullpath = fullpath + segment + "/";
                }
            }
            do {
                if (!togohomeok && nonrootname && tocurrentdirit) {
                    fullpath = tocurrentdirit + "/" + fullpath;
                }
                var i = fullpath.length - 1;
                if (fullpath.charAt(i) === '/') {
                    fullpath = fullpath.substr(0, i);
                }
            } while (0, 0);
            return (fullpath = filterprotocolheader(fullpath.toLowerCase()));
        }
        self.GetQueryString = function (path) {
            'use strict'

            if (arguments.length <= 0) {
                path = window.location.href;
            }
            if (!path) {
                return '';
            }
            path = path.toString();
            var i = path.indexOf('?');
            if (i < 0) {
                return '';
            }
            var s = path.substr(i + 1);
            if (!s) {
                return '';
            }
            s = s.trim();
            if (!s) {
                return '';
            }
            return s;
        }
        Object.defineProperty(self, "IsOfflineMode", {
            get: function () {
                return self.GetNetworkProtocol() == "file";
            }
        });
    })();
    !+(function () {
        'use strict'

        var events = ['click', 'mousedown', 'mousemove', 'mouseup',
            'keypress', 'keydown', 'keyup', 'dblclick',
            'hover', 'focusin', 'focusout',
            'mouseover', 'mouseout', 'mouseenter', 'mouseleave'];
        self.Evokedpoints = new (function Evokedpoints() {
            'use strict'

            var internal = new (function Internal() {
                'use strict'

                var jmpcall = function (key, win, dom, evt) {
                    'use strict'

                    var callbacks = callbackss[key];
                    do {
                        if (!callbacks) {
                            break;
                        }
                        for (var key in callbacks) {
                            var callback = callbacks[key];
                            if (typeof callback === 'function') {
                                callback(win, dom, evt, key);
                            }
                        }
                    } while (false);
                }
                this.EvokedpointsJmpCaller = new (function EvokedpointsJmpCaller() {
                    'use strict'

                    var ecx = this;
                    for (var i = 0; i < events.length; i++) {
                        (function (key) {
                            ecx[key] = function () {
                                jmpcall(key, arguments[0], arguments[1], arguments[2]);
                            };
                        })(events[i]);
                    }
                });
            });
            var callbackss = {};
            this.AddListener = function (key, callback) {
                'use strict'

                if (typeof callback !== 'function') {
                    return false;
                }
                if (typeof key !== 'string') {
                    if (!(key === null || key === undefined)) {
                        return false;
                    }
                    for (var i = 0; i < events.length; i++) {
                        key = events[i];
                        if (!key) {
                            continue;
                        }
                        this.AddListener(key, callback);
                    }
                    return true;
                }
                var callbacks = callbackss[key];
                if (!callbacks) {
                    callbackss[key] = callbacks = {};
                }
                var keycb = callback.toString();
                if (!callbacks[keycb]) {
                    callbacks[keycb] = callback;
                }
                return callbacks[keycb] === callback;;
            }
            this.RemoveListener = function (key, callback) {
                'use strict'

                if (typeof callback !== 'function') {
                    return false;
                }
                if (typeof key !== 'string') {
                    if (!(key === null || key === undefined)) {
                        return false;
                    }
                    for (var i = 0; i < events.length; i++) {
                        key = events[i];
                        if (!key) {
                            continue;
                        }
                        this.RemoveListener(key, callback);
                    }
                    return true;
                }
                var callbacks = callbackss[key];
                if (!callbacks) {
                    return true;
                }
                var keycb = callback.toString();
                if (callbacks[keycb]) {
                    callbacks[keycb] = undefined;
                    try {
                        delete callbacks[keycb];
                    } catch (e) { }
                }
                return callbacks[keycb] === undefined;
            }
            Object.defineProperty(this, 'internal', {
                get: function () {
                    return internal;
                }
            });
        });
        self.Evokedpoints.EventSet = events;
        $(document).ready(function () {
            'use strict'

            var sendmsg = function (key, dom, evt) {
                'use strict'

                var w = window.parent;
                if (w !== window) {
                    try {
                        var jmpcall = w.HtmlView.externs.Evokedpoints.internal.EvokedpointsJmpCaller[key];
                        if (typeof jmpcall === 'function') {
                            jmpcall(window, dom, evt);
                        }
                    } catch (e) { }
                }
            }
            var element = $(document.body);
            for (var i = 0; i < events.length; i++) {
                (function (key) {
                    if (typeof element[key] === 'function') {
                        element[key](function (evt) {
                            evt = evt || window.event;
                            sendmsg(key, this, evt);
                        });
                    }
                })(events[i]);
            }
        });
    })();
});
!(function () {
    'use strict'

    HtmlControl.EventSet = new HtmlControl.EventSet();
    HtmlView.externs = new HtmlView.externs();
})();
// 获取表示视图的工作区的矩形。
HtmlView.prototype.GetRectangle = function () {
    'use strict'

    var owner = this;
    var rect = new HtmlView.Rectangle();
    if (__instanceof(owner, HtmlView)) {
        var dom = $(owner.DOM());
        rect.Left = 0;
        rect.Top = 0;
        rect.Width = dom.width();
        rect.Height = dom.height() - 1,
            rect.Height = rect.Height < 0 ? 0 : rect.Height;
    } else {
        rect.Left = Object.GetPropertyValue(owner, 'Left');
        rect.Top = Object.GetPropertyValue(owner, 'Top');
        rect.Width = Object.GetPropertyValue(owner, 'Width');
        rect.Height = Object.GetPropertyValue(owner, 'Height');
    }
    return rect;
}
// 获取表示视图的工作区的矩形。
HtmlView.prototype.GetOwnerRectangle = function () {
    'use strict'

    return HtmlView.externs.GetRectangleAttribute(o, n, arguments[0]);
}
// 获取表示控件的工作区的矩形。
HtmlControl.prototype.GetRectangle = HtmlView.prototype.GetRectangle;
// 获取表示控件的工作区的矩形。
HtmlControl.prototype.GetOwnerRectangle = HtmlView.prototype.GetOwnerRectangle;
// 获取指定坐标位置上的控件。
HtmlControl.GetControlAtPoint = function (x, y) {
    'use strict'

    x = Number(x),
        y = Number(y);
    var element = document.elementFromPoint(x, y);
    element = $(element).parents('.HtmlControl');
    return HtmlControl.GetControlAtDOM(element);
}
// 获取指定“坐标位置”或“DOM”或“实例”上的控件。
HtmlControl.GetControlAtODP = function (o) {
    'use strict'

    if (typeof o === 'string') {
        o = eval(o);
    }
    if (Object.IsNullOrUndefined(o) || typeof o !== 'object') {
        return null;
    }
    if (__instanceof(o, HtmlControl) || __instanceof(o, HtmlView)) {
        return o;
    }
    if (__instanceof(o, HTMLElement) || o.constructor === $(document.body).constructor) {
        o = $(o);
        if (!o.hasClass('HtmlControl')) {
            o = o.parents('.HtmlControl');
        }
        return HtmlControl.GetControlAtDOM(o);
    }
    return HtmlControl.GetControlAtPoint(arguments[0], arguments[1]);
}
// 获取指定 DOM 元素相关联的控件。
HtmlControl.GetControlAtDOM = function (dom) {
    if (!dom) {
        return null;
    }
    if (typeof dom === 'string') {
        var e = document.getElementById(dom);
        if (e) {
            return $(e).data(".this");
        }
    }
    dom = $(dom);
    if (!dom || dom.length <= 0) {
        return null;
    }
    return dom.data(".this");
}
// 获取当前浏览器默认的滚动条的宽度。
HtmlControl.GetDefaultScrollWidth = function () {
    'use strict'

    var o = HtmlControl.GetDefaultScrollWidth;
    if (o.hasOwnProperty('Value')) {
        return o.Value;
    }
    var odiv = document.createElement('div'), // 创建一个div
        styles = {
            width: '100px',
            height: '100px',
            overflowY: 'scroll' // 让他有滚动条
        }, i, scrollbarWidth;
    for (i in styles) {
        odiv.style[i] = styles[i];
    }
    document.body.appendChild(odiv); // 把div添加到body中
    scrollbarWidth = odiv.offsetWidth - odiv.clientWidth; // 相减
    odiv.remove(); // 移除创建的div
    Object.defineProperty(o, "Value", {
        get: function () {
            return scrollbarWidth; // 返回滚动条宽度
        }
    });
    return o.Value;
}
// 获取 HtmlControl 原型的 Type (RTTI)信息。
HtmlControl.prototype.GetType = function () {
    'use strict'

    var type = new Type();
    type.FullName = Object.TypeOf(this);
    type.References.push('HtmlControl.js');
    type.BaseType.push('HtmlControl');
    type.Methods = [{
        Name: 'GetType',
        Description: '获取当前实例的 Type (RTTI)信息。',
    }, {
        Name: 'Dispose',
        Description: '释放由 HtmlControl 使用的所有资源。',
    }];
    type.Properties = [{
        Name: 'Name',
        PropertyType: 'string',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: true,
        Description: '获取或设置控件的名称。',
        Accessor: 'function',
    }, {
        Name: 'IsDisposed',
        PropertyType: 'boolean',
        Readable: true,
        Writeable: false,
        Browsable: false,
        DataBind: false,
        Description: '获取一个值，该值指示控件是否已经被释放。',
        Accessor: 'function',
    }, {
        Name: 'Left',
        PropertyType: 'number',
        Readable: true,
        Writeable: true,
        Browsable: true,
        Description: '获取或设置控件左边缘与其容器的工作区左边缘之间的距离。',
        Accessor: 'function',
    }, {
        Name: 'Top',
        PropertyType: 'number',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置控件上边缘与其容器的工作区上边缘之间的距离。',
        Accessor: 'function',
    }, {
        Name: 'Width',
        PropertyType: 'number',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置控件的宽度。',
        Accessor: 'function',
    }, {
        Name: 'Height',
        PropertyType: 'number',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置控件的高度。',
        Accessor: 'function',
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
        Name: 'Tag',
        PropertyType: 'object',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: true,
        Description: '获取或设置包含有关控件的数据的对象。',
        Accessor: 'function'
    }, {
        Name: 'FontFamily',
        PropertyType: 'string,FontFamily,select',
        Readable: true,
        Writeable: false,
        Browsable: true,
        DataBind: true,
        Description: '获取或设置包含有关控件的数据的对象。',
        Accessor: 'function'
    }, {
        Name: 'FontSize',
        PropertyType: 'number',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置控件的字体。',
        Accessor: 'function'
    },
    {
        Name: 'FontStyle',
        PropertyType: 'number,FontStyle,select',
        Readable: true,
        Writeable: true,
        Browsable: true,
        Description: '获取或设置控件的字体样式。',
        Accessor: 'function',
    },
    {
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
    }, {
        Name: 'ScrollMode',
        PropertyType: 'number',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置控件的滚动条的显示模式。',
        Accessor: 'function',
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
        Name: 'Rotate',
        PropertyType: 'number',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置控件的旋转角度（deg）。',
        Accessor: 'function',
    }, {
        Name: 'BackgroundImage',
        PropertyType: 'Uri,Image,string',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: true,
        Description: '获取或设置在控件中显示的背景图像。',
        Accessor: 'function',
    }, {
        Name: 'BackgroundImageLayout',
        PropertyType: 'number,ImageLayout,select',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置在 ImageLayout 枚举中定义的背景图像布局。',
        Accessor: 'function',
    }, {
        Name: 'Text',
        PropertyType: 'string',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: true,
        Description: '获取或设置与此控件关联的文本。',
        Accessor: 'function',
    }, {
        Name: 'TextAlign',
        PropertyType: 'string,TextAlign,select',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置与此控件关联的文本的水平对齐方式。',
        Accessor: 'function',
    }, {
        Name: 'LetterSpacing',
        PropertyType: 'number',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: true,
        Description: '获取或设置与此控件关联的文本的水平对齐方式。',
        Accessor: 'function',
    }, {
        Name: 'BackColor',
        PropertyType: 'Color',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置控件的背景色。',
        Accessor: 'function',
    }, {
        Name: 'GradualChangeColor',
        PropertyType: 'Color',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置视图的渐变色。',
        Accessor: 'function',
    }, {
        Name: 'ForeColor',
        PropertyType: 'Color',
        Readable: true,
        Writeable: true,
        Browsable: true,
        Description: '获取或设置控件的前景色。',
        Accessor: 'function',
    }, {
        Name: 'Expression',
        PropertyType: 'string',
        Readable: true,
        Writeable: false,
        Browsable: false,
        DataBind: false,
        Description: '计算访问到此控件的代码表达式（调用链路径）。',
        Accessor: 'property',
    }, {
        Name: 'Index',
        PropertyType: 'number',
        Readable: true,
        Writeable: false,
        Browsable: false,
        Description: '计算此控件在父容器的索引位置。',
        Accessor: 'property',
    }, {
        Name: 'Controls',
        PropertyType: 'Collection,HtmlView.ControlCollection',
        Readable: true,
        Writeable: false,
        Browsable: true,
        DataBind: false,
        Description: '获取包含在控件内的控件的集合。',
        Accessor: 'property',
    }, {
        Name: 'Owner',
        PropertyType: 'HtmlView',
        Readable: true,
        Writeable: false,
        Browsable: false,
        DataBind: false,
        Description: '获取控件所属的视图。',
        Accessor: 'property',
    }, {
        Name: 'DataBindings',
        PropertyType: 'Collection,BindingsCollection',
        Readable: true,
        Writeable: false,
        Browsable: true,
        DataBind: false,
        Description: '为该控件获取数据绑定。',
        Accessor: 'property',
    }, {
        Name: 'DOM',
        PropertyType: 'HtmlElement',
        Readable: true,
        Writeable: false,
        Browsable: false,
        DataBind: false,
        Description: '获取控件的DOM元素容器。',
        Accessor: 'function',
    }, {
        Name: 'CanSelect',
        PropertyType: 'boolean',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置是否可以选中控件。',
        Accessor: 'function',
    }, {
        Name: 'CanFocus',
        PropertyType: 'boolean',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置控件是否可以接收焦点。',
        Accessor: 'function',
    }, {
        Name: 'BorderWidth',
        PropertyType: 'Rectangle,HtmlView.Rectangle',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置控件的边框宽度。',
        Accessor: 'function',
    }, {
        Name: 'BorderStyle',
        PropertyType: 'string,BorderStyle,select',
        Readable: true,
        Writeable: true,
        Browsable: true,
        Description: '获取或设置控件的边框样式。',
        Accessor: 'function',
    }, {
        Name: 'BorderRadius',
        PropertyType: 'Rectangle,HtmlView.Rectangle',
        Readable: true,
        Writeable: true,
        Browsable: true,
        Description: '获取或设置控件的边框圆角度。',
        Accessor: 'function',
    }, {
        Name: 'BorderColor',
        PropertyType: 'Color',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '获取或设置控件的边框颜色。',
        Accessor: 'function',
    }, {
        Name: 'Shadow',
        PropertyType: 'string',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: true,
        Description: '获取或设置与此控件关联的阴影。',
        Accessor: 'function',
    }, {
        Name: 'ShadowColor',
        PropertyType: 'Color',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: true,
        Description: '获取或设置与此控件关联的阴影颜色。',
        Accessor: 'function',
    }, {
        Name: 'ScrollDirection',
        PropertyType: 'number,ScrollDirStyle,select',
        Readable: true,
        Writeable: true,
        Browsable: true,
        DataBind: false,
        Description: '设置滚动方向。',
        Accessor: 'function',
    }];
    return type;
};

// 指定 HtmlControl 的默认值。
HtmlControl.defaults = new Object({
    Name: 'HtmlControl',
    Rotate: 0,
    ForeColor: 'FF000000',
    BackColor: 'FFFFFFFF',
    ScrollMode: 0,
    Opacity: 1.0,
    Tag: null,
    Parent: null,
    TabIndex: 0,
    Left: 0,
    Top: 0,
    Width: 100,
    Height: 100,
    Visible: true,
    BackgroundImageLayout: 3,
    BorderWidth: "1,1,1,1",
});
// 实例化一个可视化的组件（通过组件的继承链条）。
HtmlControl.New = function (options, inheritances) {
    'use strict'

    if (!options) {
        options = {};
    }
    if (!options.Name) {
        var clazz = inheritances;
        if (__instanceof(inheritances, Array)) {
            for (var i = inheritances.length - 1; i >= 0; i--) {
                var inheritance = inheritances[i];
                if (typeof inheritance !== 'string' &&
                    typeof inheritance !== 'function') {
                    continue;
                }
                clazz = inheritance;
            }
        }
        if (typeof clazz === 'function') {
            clazz = Type.GetName(clazz);
        } else if (typeof clazz !== 'string') {
            clazz = HtmlControl.NewName();
        }
        if (!clazz) {
            Throwable.InvalidOperationException();
        }
        options.Name = HtmlControl.NewName(clazz);
    }
    return Object.New(HtmlControl, options, inheritances);
}
!(function (__self) {
    // 生成一个可用的控件唯一名称。
    __self.NewName = function (clazz) {
        'use strict'

        if (!clazz) {
            clazz = 'HtmlControl';
        }
        var keys = __self.GetAllControlName();
        var key = null;
        for (var i = 1,
            n = ~(1 << 31);
            i < n; i++) {
            key = clazz + i;
            if (!keys.hasOwnProperty(key)) {
                break;
            }
            key = null;
            continue;
        }
        return key;
    }
    // 获取所有控件的名称。
    __self.GetAllControlName = function () {
        'use strict'

        var names = {};
        $('.HtmlControl').each(function () {
            var name = $(this).attr('id');
            if (!name) {
                return;
            }
            names[name] = 0;
        });
        return names;
    }
    // 获取所有的控件实例。
    __self.GetAllControlInstance = function () {
        'use strict'

        var controls = [];
        for (var key in __self.GetAllControlName()) {
            var control = HtmlControl.GetControlAtDOM($('#' + key));
            if (!control) {
                continue;
            }
            controls.push(control);
        }
        return controls;
    }
})(HtmlControl);
// 实例化一个可视化的视图（通过视图的继承链条）。
HtmlView.New = function (canvas, inheritances) {
    'use strict'

    return Object.New(HtmlView, canvas, inheritances);
}
// 初始化控件
HtmlControl.Initialization = function (component, defaults, options) {
    'use strict'

    if (!component) {
        Throwable.ArgumentNullException();
    }
    options = $.extend({}, defaults, options);
    if (options) {
        for (var key in options) {
            if (typeof component[key] != 'function') {
                component[key] = options[key];
            } else {
                component[key](options[key]);
            }
        }
    }
    $(component.DOM()).data('.this', component);
}
// 获取一个值，用以指示 HtmlView 当前是否处于设计模式。
HtmlView.DesignMode = false;
// 获取一个值，用以指示 HtmlView 引入的资源文件集合。
HtmlView.GetIncludeFiles = function (View, layout) {
    'use strict'

    if (HtmlView.DesignMode) {
        Throwable.NotImplementedException(); // 警告设计器环境下，未实现此方法。
    } else {
        Throwable.InvalidOperationException(); // 警告真实环境下，此操作无效。
    }
};
// 获取一个值，用以指示 HtmlView 面向的屏幕的大小。
HtmlView.GetScreenSize = function (View) {
    'use strict'

    var size = new Size(0, 0);
    var canvas = null;
    if (__instanceof(View, HtmlView)) {
        canvas = $(Object.GetPropertyValue(View, 'DOM'));
    } else {
        canvas = $(document.body);
    }
    if (!canvas || canvas.length <= 0 || !canvas.get(0)) {
        return size;
    } else {
        size.Height = canvas.outerHeight(),
            size.Width = canvas.outerWidth();
        return size;
    }
};
// 获取一个值，用以指示 HtmlView 面向的屏幕的大小。
HtmlView.prototype.GetScreenSize = function () {
    'use strict'

    return HtmlView.GetScreenSize(this);
}
// 为浏览器兼容做基础的初始化工作。
!(function () {
    'use strict'

    var checkingchains = ['HtmlControl', 'HtmlView', 'Binding', 'Color', 'Collection',
        'BindingsCollection', 'Type', 'HtmlView.Rectangle', 'Binding.constructor.BindingHooker',
        'Collection.constructor.Sinker', 'Collection.constructor.SynchronizerCollection',
        'HtmlView.ControlCollection', 'HtmlView.constructor.LayoutInfo', 'Font', 'Size',
        'Array', 'Date', 'Number', 'Float32Array', 'Float64Array', 'Boolean', 'Function',
        'Int8Array', 'Uint8Array', 'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array'];
    do {
        for (var i = 0; i < checkingchains.length; i++) {
            var name = checkingchains[i];
            var expression = (name + '.name');
            try {
                if (!eval(expression)) {
                    try {
                        eval(expression + '=name'); // IE11
                    } catch (e) { /*-----------1-----------*/ }
                    try {
                        Type.DefinedName(name, name); // FREE-ALL
                    } catch (e) { /*-----------2-----------*/ }
                    try {
                        Type.DefinedFile(name, 'jquery-1.9.1.min.js,HtmlControl.js');
                    } catch (e) { /*-----------3-----------*/ }
                }
            } catch (e) {
                continue;
            }
        }
    } while (0, 0);
    Type.References.Add("jquery-1.9.1.min.js,HtmlControl.js,vconsole.min.js");
    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            console.log(1)
            var a = new VConsole();
            $("#__vconsole .vc-switch").css('z-index', 1000000);
            $("#__vconsole .vc-panel").css('z-index', 1000001);
        }
    } 
})();