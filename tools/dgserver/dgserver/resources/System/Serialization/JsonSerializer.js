(function () {

    var exports = {
        Serializable: function (o) {
            return JSON.stringify(o);
        },
        Deserialize: function (json) {
            return eval('({0})'.replace('{0}', json));
        },
    };

    Assembly.Modules.Add("system::serialization::JsonSerializer", exports);
})();