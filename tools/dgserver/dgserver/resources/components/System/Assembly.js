function using(namespace, classes, callback) {
    if (namespace && classes) {
        var e = document.createElement("script");
        var path = namespace.replace('::', '/');
        path = path.replace('.', '/');
        path += ('/' + classes + '.js');
        e.src = path;
        e.type = "text/javascript";
        if (callback) {
            e.onreadystatechange = function () {
                var target = window.event.srcElement;
                if (target.readyState == "loaded" || target.readyState == "complete") {
                    callback.call(target);
                }
            }
            e.onload = callback;
        }
        document.head.appendChild(e);
    }
}

var Assembly = new (function () {

    this.Modules = new (function () {
        var modules = new Array();
        var self = this;

        var indexOf = function (name) {
            if (name) {
                for (var i = 0; i < modules.length; i++) {
                    var module = modules[i];
                    if (module.name == name) {
                        return i;
                    }
                }
            }
            return -1;
        };

        this.Find = function (name) {
            var i = indexOf(name.toLowerCase());
            if (i < 0) {
                return null;
            }
            var m = modules[i];
            return m.value;
        }

        this.Modules = function () {
            var s = new Array();
            for (var i = 0; i < modules.length; i++) {
                var module = modules[i];
                s.push(module.value);
            }
            return s;
        }

        this.Add = function (name, value) {
            if (name && value) {
                name = name.toLowerCase();
                if (self.Find(name) == null) {
                    var module = {
                        name: name,
                        value: value,
                    }
                    modules.push(module);
                    return true;
                }
            }
            return false;
        }

        this.Remove = function (name) {
            var i = indexOf(name.toLowerCase());
            if (i < 0) {
                return false;
            }
            modules.splice(i, 1);
            return true;
        }

        this.Count = function () {
            return modules.length;
        }
    });

    this.Content = new (function () {
        var mtable = new Object();

        this.Set = function (key, value) {
            mtable[key] = value;
        }

        this.Get = function (key) {
            return mtable[key];
        }
    });
});

function require(modulename) {
    return Assembly.Modules.Find(modulename);
}

String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

String.prototype.ltrim = function () {
    return this.replace(/(^\s*)/g, "");
}

String.prototype.rtrim = function () {
    return this.replace(/(\s*$)/g, "");
}
