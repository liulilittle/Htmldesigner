(function () {
    var mtables = new Dictionary();

    function New(sender, handler) {
        if (!sender || !handler)
            return false;
        if (mtables.ContainsKey(sender))
            return false;
        var context = {
            sender: sender,
            handler: handler,
            vfptr: null
        };
        var vfptr = new Dictionary();
        for (var key in sender) {
            var func = sender[key];
            if (typeof func == "function") {
                // hooking
                vfptr.Add(key, func);
                sender[key] = InvokeMember;
            }
        }
        context.vfptr = vfptr;
        mtables.Add(sender, context);
        return true;
    }

    function InvokeMember() {
        var result = undefined;
        var self = this;
        var context = mtables.Get(self);
        if (context) {
            var callee = arguments.callee;
            var key = (function () {
                for (var key in self) {
                    var func = self[key];
                    if (callee == func) {
                        return key;
                    }
                }
                return undefined;
            })();
            do {
                var vfptr = context.vfptr;
                self[key] = vfptr.Get(key);
                var handler = context.handler;
                if (handler) {
                    result = handler.InvokeMember(self, key, arguments);
                }
            } while (0);
            self[key] = InvokeMember;
        }
        return result;
    }

    function Invoke(sender, method, args) {
        if (sender && method && args) {
            var code = '';
            for (var i = 0; i < args.length; i++) {
                code += "args[{0}],".replace("{0}", i);
            }
            code = code.slice(0, -1);
            code = 'sender.{0}({1})'.replace('{0}', method).replace('{1}', code);
            return eval(code);
        }
        return undefined;
    }

    var exports = {
        New: New,
        Invoke: Invoke,
    };

    Assembly.Modules.Add("system::aop::Proxy", exports);
})();