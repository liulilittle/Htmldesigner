function InvocationHandler() {

    this.InvokeMember = function (sender, method, args) {
        var proxy = require("system::aop::Proxy");
	return proxy.Invoke(sender, method, args);
    }
}