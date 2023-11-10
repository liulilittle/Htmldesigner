Assembly.Modules.Add('PhysicalGuide_Client::Global', {
    Datas: new Object(),
});

function iflisten(change, frequency) {
    if (!change || typeof change !== 'function' || frequency <= 0) {
        throw new 'system.ArgumentException';
    }
    if (!frequency) {
        frequency = 100;
    }
    var self = (new function () {
        var frames = [];
        var schedule = null;

        var indexof = function (element) {
            for (var i = 0; i < frames.length; i++) {
                if (frames[i] == element)
                    return i;
            }
            return -1;
        }

        var contains = function (element) {
            return indexof(element) > -1;
        }

        var onchange = function (errno, element) {
            try {
                change(errno, element);
            } catch (e) {
                console.error(e);
            }
        }

        var handleAppend = function (elements) {
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                if (!contains(element)) {
                    frames.push(element);
                    onchange(self.ERROR_APPEND, element);
                }
            }
        }

        this.start = function () {
            if (!schedule) {
                schedule = setInterval(function () {
                    var elements = document.querySelectorAll('iframe');
                    handleAppend(elements);
                }, frequency);
                return true;
            }
            return false;
        }

        this.stop = function () {
            if (!schedule)
                return false;
            frames = [];
            clearInterval(schedule);
            return true;
        }

        this.ERROR_APPEND = 1;
    });
    return self;
};

function exec(self, express, args) {
    'use strict'

    if (express === '')
        throw new 'system::ExecutionEngineException';
    if (express === '.' || express === '*')
        return self;
    if (express.indexOf('(') > -1 || express.indexOf(')') > -1)
        return eval('self.' + express);
    else {
        var code = 'self.' + express;
        if (args.length > 0) {
            for (var i = 0, j = (args.length - 1); i <= j; i++) {
                if (i == 0)
                    code += '(';
                code += ('args[' + i + ']');
                code += (i == j ? ');' : ', ');
            }
            return eval(code);
        } else {
            var retval = eval(code);
            if (typeof retval === 'function')
                retval = eval(code += '()');
            return retval;
        }
    }
};

function execmw(express) {
    var self = gmw();
    var args = [];
    for (var i = 1; i < args.length; i++)
        args.push(args[i]);
    return exec(self, express, args);
};

function execpw(express) {
    if (!express)
        return null;
    var self = gpw();
    if (!self)
        return null;
    var args = [];
    for (var i = 1; i < args.length; i++)
        args.push(args[i]);
    return exec(self, express, args);
};

function execcw(element, express) {
    if (!express)
        return null;
    var self = gcw(element);
    if (!self)
        return null;
    var args = [];
    for (var i = 2; i < args.length; i++)
        args.push(args[i]);
    return exec(self, express, args);
};

function setmv(data, value) {
    require('PhysicalGuide_Client::Global').Datas[data] = value;
};

function setpw(data, value) {
    var self = gpw();
    if (!self)
        return false;
    self.setmv(data, value);
    return true;
};

function setcw(element, data, value) {
    var self = gcw(element);
    if (!self)
        return false;
    return self.setmv(data, value);
};

function getmw(data) {
    var value = require('PhysicalGuide_Client::Global').Datas[data];
    if (!value)
        return null;
    return value;
};

function getpw(data) {
    var self = gpw();
    if (!self)
        return false;
    return self.getmw(data);
};

function getcw(element, data) {
    var self = gcw(element);
    if (!self)
        return null;
    return self.getmw(data);
};

function gcw(element) {
    if (!element) {
        return null;
    }
    var content = null;
    try {
        content = document.getElementById(element).contentWindow;
    }
    catch (e) {
        if (typeof element === 'string') {
            try {
                return eval('{0}.contentWindow'.replace(element));
            } catch (e) {
                return null;
            }
        } else if (typeof element === 'function') {
            return gcw(element);
        }
        return null;
    }
};

function gpw() {
    try {
        return window.parent;
    } catch (e) {
        return null;
    }
};

function gmw() {
    return window;
};

function attachEvent(dom, evt, func) {
    if (dom.addEventListener)
        dom.addEventListener(evt, func);
    else if (dom.attachEvent)
        dom.attachEvent('on' + evt, func);
    else
        eval('dom.on' + evt) = func;
};

function detachEvent(dom, evt, func) {
    if (dom.removeEventListener)
        dom.removeEventListener(evt, func);
    else if (dom.detachEvent)
        dom.detachEvent('on' + evt, func);
    else
        eval('dom.on' + evt) = null;
};

function draggable(element, eventsource) {
    var distX = 0;
    var distY = 0;
    if (!eventsource) {
        eventsource = element
    }
    var onmousedown = function (ev) {
        var oEvent = ev || event;
        distX = oEvent.clientX - element.offsetLeft;
        distY = oEvent.clientY - element.offsetTop;

        var onmousemove = function (ev) {
            var oEvent = ev || event;
            var x = oEvent.clientX - distX;
            var y = oEvent.clientY - distY;
            if (x < 0) {
                x = 0;
            }
            if (y < 0) {
                y = 0;
            }
            if (x > (document.documentElement.clientWidth - element.offsetWidth)) {
                x = document.documentElement.clientWidth - element.offsetWidth;
            }
            element.style.left = x + 'px';
            element.style.top = y + 'px';
        };

        var onmouseup = function () {
            detachEvent(document, 'mousemove', onmousemove);
            detachEvent(document, 'mouseup', onmouseup);
        };
        attachEvent(document, 'mousemove', onmousemove);
        attachEvent(document, 'mouseup', onmouseup);
    };
    attachEvent(eventsource, 'mousedown', onmousedown);
};
