'use strict'

class HttpRouteCollection extends Object {
    constructor() {
        super();
        this.__routes = {};
    }
    Add(method, url, action) {
        if (!(typeof (url) === 'string' &&
            typeof (method) === 'string')) {
            return false;
        }
        if (typeof (action) !== 'function') {
            return false;
        }
        var key = url.toLowerCase();
        let route = this.__routes[key];
        if (!route) {
            route = new Object({});
            this.__routes[key] = route;
        }
        route[method.toLowerCase()] = action;
    }
    Get(method, url) {
        if (!(typeof (url) === 'string' &&
            typeof (method) === 'string')) {
            return null;
        }
        var key = url.toLowerCase();
        let route = this.__routes[key];
        if (!route) {
            return null;
        }
        return route[method.toLowerCase()];
    }
}

class HttpCommunication extends Object {
    constructor() {
        super();
        let self = this;
        this.Routes = new HttpRouteCollection();
        this.IsDisposed = false;
        this.Application = System.Net.Web.HttpApplication.New();
        this.Application.Handler = {
            ProcessRequest: function (context) {
                let exception = null;
                using(context, function () {
                    let request = context.Request;
                    let routes = self.Routes;
                    let route = routes.Get(request.HttpMethod, request.Path);
                    try {
                        if (route == null) {
                            let response = context.Response;
                            response.StatusCode = 404;
                        } else {
                            route(context);
                        }
                    } catch (e) {
                        exception = e;
                    }
                    let input_stream = request.InputStream;
                    if (input_stream || input_stream.Dispose) {
                        input_stream.Dispose();
                    }
                });
                if (exception) {
                    throw exception;
                }
            }
        };
        this.Application.Root = Environment.GetApplicationStartupPath() + "/dgserver/resources";
        this.Application.Name = 'nsjsdotnet-http/s 1.1x version server[xd: w3p@csharp]';
    }
    Start(prefixes) {
        this.Application.Start(prefixes, /*concurrent index*/ 1);
    }
    Stop() {
        this.Application.Stop();
    }
    Close() {
        if (!this.IsDisposed) {
            this.IsDisposed = true;
            let application = this.Application;
            application.Close();
        }
    }
}


