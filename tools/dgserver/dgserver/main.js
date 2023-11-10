'use strict'

require('dgserver/dao.js'); 
require('dgserver/server.js');
require('dgserver/controller.js');
    /*----------------------------------------------------------------------------*/
require('dgserver/other.js');

let server = new HttpCommunication();
(function (routes) {
    controllers.AddRoutes(routes, "GET", 'components', controllers.Components);

    controllers.AddRoute(routes, "GET", 'views', controllers.Views, "GetAll");
    controllers.AddRoute(routes, "GET", 'views', controllers.Views, "GetAllGroupView");
    controllers.AddRoute(routes, "GET", 'views', controllers.Views, "GetCode");
    controllers.AddRoute(routes, "POST", 'views', controllers.Views, "AddOrUpdate");
    controllers.AddRoute(routes, "GET", 'views', controllers.Views, "Delete");
    controllers.AddRoute(routes, "GET", '', controllers.Views, "Run");
    controllers.AddRoute(routes, "GET", 'views', controllers.Views, "GetPreViewList");

    controllers.AddRoute(routes, "GET", 'group', controllers.Group, "LoadGroup");
    controllers.AddRoute(routes, "GET", 'publish', controllers.Publish, "downfile");
    controllers.AddRoute(routes, "post", 'publish', controllers.Publish, "Publish");
    controllers.AddRoute(routes, "post", 'publish', controllers.Publish, "LoadTerminals");
    controllers.AddRoute(routes, "post", 'publish', controllers.Publish, "GetPublishView");
    controllers.AddRoute(routes, "post", 'publish', controllers.Publish, "GetPublishLog");

    controllers.AddRoute(routes, "POST", 'resources', controllers.Resources, "u");
    controllers.AddRoute(routes, "POST", 'resources', controllers.Resources, "dir");
    controllers.AddRoute(routes, "POST", 'resources', controllers.Resources, "del");
    controllers.AddRoute(routes, "POST", 'resources', controllers.Resources, "mkdir");
    controllers.AddRoute(routes, "POST", 'resources', controllers.Resources, "rename");
    controllers.AddRoute(routes, "POST", 'resources', controllers.Resources, "dels");   
    /*----------------------------------------------------------------------------*/
    controllers.AddRoutes(routes, "GET", 'reporting', controllers.Reporting);
})(server.Routes);
server.Start(['http://*:9091/', 'http://+:9091/']);
