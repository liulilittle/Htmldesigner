Assembly.Modules.Add("global::f2i32d", function (value, defualt) {
    if (value == undefined || value == null) {
        value = defualt;
    } else {
        value = Number(value);
    }
    return value;
});

function WebSocketClient() {
    'use strict'

    var ws = null;
    var self = this;
    var available = true;
    var timeout = 0;

    this.Tag = null;

    this.Available = function () {
        if (!ws)
            return false;
        return available;
    }

    this.Disconnected = function (sender) {

    }

    this.Connected = function (sender) {

    }

    this.Received = function (sender, message) {

    }

    this.Connect = function (server, service, timeval) {
        if (ws) {
            throw new "system::InvalidOperationException";
        }
        if (!server || !service) {
            throw new "system::ArgumentNullException";
        }
        timeval = require('global::f2i32d')(timeval, 5);

        ws = new WebSocket('ws://' + server + service);

        ws.onopen = function () {
            try {
                clearTimeout(timeout);
                available = true;
                try {
                    var connected = self.Connected;
                    if (connected) {
                        connected(self);
                    }
                } catch (e) {
                    console.error(e);
                }
            } catch (e) {
                console.error(e);
            }
        }

        ws.onerror = function () {
            try {
                clearTimeout(timeout);
                if (available) {
                    available = false;
                    try {
                        var disconnected = self.Disconnected;
                        if (disconnected) {
                            disconnected(self);
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
                self.Close();
            } catch (e) {
                console.error(e);
            }
        }

        ws.onmessage = function (e) {
            try {
                var received = self.Received;
                try {
                    if (received) {
                        received(self, e.data);
                    }
                } catch (e) {
                    console.error(e);
                }
            } catch (e) {
                console.error(e);
            }
        }

        clearTimeout(timeout);
        timeout = clearTimeout((ws.onclose = ws.onerror), timeval);
    }

    this.Close = function () {
        try {
            clearTimeout(timeout);
            if (ws) {
                ws.close();
                ws = undefined;
            }
            available = false;
        } catch (e) {
            console.error(e);
        }
    }

    this.Shutdown = function () {
        try {
            if (ws) {
                if (ws.onerror) {
                    ws.onerror(window.event);
                }
            }
            self.Close();
        } catch (e) {
            console.error(e);
        }
    }

    this.Send = function (message) {
        if (!message) return false;
        try {
            if (typeof message === "string")
                ws.send(message);
            else
                ws.send(JSON.stringify(message));
            return true;
        } catch (e) {
            console.error(e);
            ws.onerror();
            return false;
        }
    }
}

function WebSocketSession() {
    'use strict'

    var m_MessageId = 0;
    var m_Server = null;
    var m_MapTable = new Object();
    var m_hThread = 0;
    var m_BindTable = new Object();
    var self = this;
    var f_mapid = function (typeId, methodId, messageId) {
        return typeId + '.' + methodId + '.' + messageId;
    }
    var f_sendto = function (typeid, methodid) {
        for (var key in m_MapTable) {
            var m = m_MapTable[key];
            if (!m || m.typeid != typeid || m.methodid != methodid) {
                continue;
            }
            var ts = Number(new Date()) - m.starttime;
            if (ts < 500) {
                return false;
            }
        }
        return true;
    }

    function ParseJson(json) {
        return eval('({0})'.replace('{0}', json))
    }

    function ConnectAsync(server, service, connected, disconnected, timeval) {
        self.Close();

        m_Server = new WebSocketClient();
        m_Server.Connected = function () {
            try {
                if (connected) {
                    connected(self);
                }
            } catch (e) {
                console.error(e);
            }
        };
        m_Server.Disconnected = function () {
            try {
                var maps = m_MapTable;
                m_MapTable = new Object();
                for (var key in maps) {
                    var context = maps[key];
                    if (!context || !context.timeout) {
                        continue;
                    }
                    var callback = context.callback;
                    if (callback) {
                        callback(self, self.ERROR_DISCONNECTED, null);
                    }
                }
                if (disconnected) {
                    disconnected(self);
                }
            } catch (e) {
                console.error(e);
            }
        };
        m_Server.Received = function (sender, message) {
            try {
                var message = ParseJson(message);
                var payload = ParseJson(message.Payload);
                if (self.ERROR_TRUNCATE != ProcessReceived(message.TypeId, message.MessageId,
                    message.MethodId, payload)) {
                    var mapid = f_mapid(message.TypeId, message.MethodId, message.MessageId);
                    var context = m_MapTable[mapid];
                    if (context) {
                        delete m_MapTable[mapid];
                        var callback = context.callback;
                        if (callback) {
                            callback(self, self.ERROR_NO, payload);
                        }
                    }
                }
            } catch (e) {
                console.error(e);
            }
        }
        m_Server.Connect(server, service, timeval);

        m_hThread = setInterval(function () {
            try {
                for (var key in m_MapTable) {
                    var context = m_MapTable[key];
                    if (!context || !context.timeout) {
                        delete m_MapTable[key];
                        continue;
                    }
                    var now = 0;
                    try {
                        now = Number(new Date());
                    } catch (e) {
                        continue;
                    }
                    var span = (now - context.starttime) / 1000;
                    if (span > context.timeout) {
                        delete m_MapTable[key];

                        var callback = context.callback;
                        if (callback) {
                            callback(self, self.ERROR_TIMEOUT, null);
                        }
                    }
                }
            } catch (e) {
                console.error(e);
            }
        }, 500);
    }

    function ProcessReceived(typeId, messageId, methodId, message) {
        try {
            var type = m_BindTable[typeId];
            if (type) {
                var method = type[methodId];
                if (method) {
                    return method(self, message, messageId);
                }
            }
            return self.ERROR_NO;
        } catch (e) {
            console.error(e);
        }
    }

    this.InvokeAsync = function (typeid, methodid, payload, callback, timeout) {
        if (!typeid || !methodid || !payload) {
            throw new "system::ArgumentNullException";
        }
        if (typeid == '' || methodid == '') {
            throw new "system::ArgumentException";
        }
        if (!timeout) {
            timeout = self.DefaultTimeout;
        }
        if (!self.NoDelay && !f_sendto(typeid, methodid)) {
            return false;
        }
        var message = {
            MessageId: m_MessageId++,
            MethodId: methodid,
            TypeId: typeid,
            Payload: JSON.stringify(payload)
        };
        var mapid = f_mapid(typeid, methodid, message.MessageId);
        var mapoo = {
            'typeid': typeid,
            'methodid': methodid,
            'timeout': timeout,
            'message': message,
            'starttime': Number(new Date()),
            'callback': callback,
        };
        m_MapTable[mapid] = mapoo;
        return m_Server.Send(message);
    };

    this.NoDelay = false;

    this.TryInvokeAsync = function (typeId, methodId, payload, callback, timeout) {
        try {
            self.InvokeAsync(typeId, methodId, payload, callback, timeout);
            return true;
        }
        catch (e) {
            return false;
        }
    };

    this.ConnectAsync = function (server, service, connected, disconnected, timeval) {
        ConnectAsync(server, service, connected, disconnected, timeval);
    };

    this.Close = function () {
        if (m_Server) {
            m_Server.Close();
        }
        m_Server = null;

        clearInterval(m_hThread);
        m_hThread = 0;
        m_MapTable = new Object();
    };

    this.Shutdown = function () {
        if (m_Server) {
            m_Server.Shutdown();
        }
        self.Close();
    }

    this.Bind = function (typeId, methodId, callback) {
        if (!typeId || !methodId || !callback) {
            throw new "system::ArgumentNullException";
        }
        var type = m_BindTable[typeId];
        if (!type) {
            type = new Object();
            m_BindTable[typeId] = type;
        }
        var method = type[methodId];
        if (!method) {
            type[methodId] = callback;
        }
    };

    this.TryConnectAsync = function (server, service, connected, disconnected, timeval) {
        try {
            self.ConnectAsync(server, service, connected, disconnected, timeval);
            return true;
        }
        catch (e) {
            return false;
        }
    };

    this.TryBind = function (typeId, methodId, callback) {
        try {
            self.Bind(typeId, methodId, callback);
            return true;
        }
        catch (e) {
            return false;
        }
    };

    this.DefaultTimeout = 3;

    this.Available = function () {
        if (!m_Server)
            return false;
        return m_Server.Available();
    }

    this.GetMessageId = function () {
        return m_MessageId;
    }

    this.ERROR_NO = 0;
    this.ERROR_TIMEOUT = 1;
    this.ERROR_TRUNCATE = 2;
    this.ERROR_DISCONNECTED = 3;
}

function WebSocketMvcApplication() {
    'use strict'

    var session = null;
    if (arguments.length > 0) {
        session = arguments[0];
        if (!session) {
            throw new 'system::InvalidOperationException'
        }
    }
    else {
        session = new WebSocketSession();
    }
    var self = this;

    this.Controllers = {
        Response: {
            Add: function (typeid, controller) {
                if (!typeid || typeid == '' || !controller) {
                    throw new 'system::ArgumentNullException';
                }
                for (var methodid in controller) {
                    (function (typeid, methodid, controller) {
                        session.Bind(typeid, methodid, function (sender, message, messageid) {
                            if (controller[methodid]) {
                                eval('controller[methodid](message, messageid)');
                            }
                            return session.ERROR_NO;
                        });
                    })(typeid, methodid, controller);
                }
            },
        },
        Request: {
            Add: function (typeid, controller) {
                if (!typeid || typeid == '' || !controller) {
                    throw new 'system::ArgumentNullException';
                }
                for (var methodid in controller) {
                    (function (typeid, methodid, controller) {
                        controller[methodid] = function (value, callback, timeout) {
                            session.InvokeAsync(typeid, methodid, value, function (sender, errno, message) {
                                if (callback) {
                                    var key = ('dd: 0' + -parseInt(Math.random() * 100));
                                    self[key] = callback;
                                    try {
                                        self[key](errno, message);
                                    } catch (e) {
                                        console.error(e);
                                    }
                                    delete self[key];
                                }
                                var sinker = self.Controllers.Request.Sinker;
                                if (sinker) {
                                    sinker(typeid, methodid, errno, message);
                                }
                            }, timeout);
                        };
                    })(typeid, methodid, controller);
                }
            },
            Sinker: function (typeid, methodid, errno, message) {

            }
        },
    };

    this.Invoke = function (typeid, methodid, message, callback, timeout) {
        if (!session) {
            throw new "system::InvalidOperationException";
        }
        session.InvokeAsync(typeid, methodid, message, callback, timeout);
    };

    this.TryInvoke = function (typeid, methodid, message, callback, timeout) {
        if (!session) {
            throw new "system::InvalidOperationException";
        }
        return session.TryInvokeAsync(typeid, methodid, message, callback, timeout);
    };

    this.Disconnected = function (sender) {

    }

    this.Connected = function (sender) {

    }

    this.Available = function () {
        if (!session)
            return false;
        return session.Available();
    }

    this.ConnectAsync = function (server, service, timeval) {
        if (!session) {
            throw new "system::InvalidOperationException";
        }
        return session.TryConnectAsync(server, service, function () {
            if (self.Connected) {
                self.Connected(self);
            }
        }, function () {
            if (self.Disconnected) {
                self.Disconnected(self);
            }
        }, timeval);
    }

    this.Close = function () {
        if (!session) {
            throw new "system::InvalidOperationException";
        }
        session.Close();
    }

    this.Shutdown = function () {
        if (!session) {
            throw new "system::InvalidOperationException";
        }
        session.Shutdown();
    }

    this.GetWebSocket = function () {
        if (!session) {
            throw new "system::InvalidOperationException";
        }
        return session;
    }
}

function WebSocketMvcClient() {
    'use strict'

    var server = null,
        service = null,
        state = null,
        delay = null,
        connecttimeval = null;

    var mvca = null;
    var self = this;
    var connection = null;

    this.ERROR_RETRYCONNECT = 1;
    this.ERROR_DISCONNECT = 2;
    this.ERROR_CONNECTED = 3;
    this.ERROR_CONNECTING = 4;
    this.ERROR_IO_PINDING = 5;

    this.Available = function () {
        if (!mvca)
            return false;
        return mvca.Available();
    }

    this.GetWebSocket = function () {
        if (!mvca)
            throw new 'system::InvalidOperationException';
        return mvca.GetWebSocket();
    }

    this.GetApplication = function () {
        if (!mvca)
            throw new 'system::InvalidOperationException';
        return mvca;
    }

    this.CloseConnection = function () {
        if (connection != null) {
            connection.Close();
            connection = null;
        }
        if (self.Available()) {
            mvca.Close();
        }
    }

    this.ConnectAsync = function () {
        ConnectRemoteTarget(arguments);
    }

    function ConnectRemoteTarget(s) {
        var _server = s[0],
            _service = s[1],
            _state = s[2]

        if (!_server || !_service || !_state) {
            throw new "system::ArgumentNullException"
        }

        if (!mvca) {
            mvca = new WebSocketMvcApplication();
        }
        server = s[0]
        service = s[1]
        state = s[2]
        delay = s[3]
        connecttimeval = s[4]

        delay = require('global::f2i32d')(delay, 5);
        connecttimeval = require('global::f2i32d')(connecttimeval, 5);

        self.CloseConnection();
        connection = new (function () {
            var disposed = false;

            function CallState(errno, count) {
                if (!disposed && state) {
                    var key = ('dd: 0' + -parseInt(Math.random() * 100));
                    try {
                        self[key] = state;
                        self[key](errno, count);
                    } catch (e) {
                        console.error(e);
                    }
                    delete self[key];
                }
            }

            this.Close = function () {
                disposed = true;
            }

            function CreateConnection(count, retry) {
                if (!disposed) {
                    CallState((retry ? self.ERROR_RETRYCONNECT : self.ERROR_CONNECTING), count);

                    if (!mvca.ConnectAsync(server, service, connecttimeval)) {
                        var num = ++count;
                        setTimeout(CreateConnection, delay, num, true);
                    } else {
                        mvca.Connected = function () {
                            CallState(self.ERROR_CONNECTED, count);
                            count = 0;
                        }

                        mvca.Disconnected = function () {
                            var num = ++count;
                            CallState(self.ERROR_DISCONNECT, num);
                            setTimeout(CreateConnection, delay, num, true);
                        }

                        CallState(self.ERROR_IO_PINDING, count);
                    }
                }
            }

            this.Connect = function () {
                setTimeout(CreateConnection, 300, 0);
            }
        });
        connection.Connect();
    }
    if (arguments.length >= 3) {
        ConnectRemoteTarget(arguments);
    }
}