function Dictionary() {
    var m_tables = new Object();

    this.Add = function (key, value) {
        if (value != undefined) {
            m_tables[key] = value;
        }
    }

    this.Remove = function (key) {
        m_tables[key] = undefined;
        delete m_tables[key];
    }

    this.RemoveAll = function () {
        for (var key in m_tables) {
            m_tables[key] = undefined;
        }
    }

    this.Get = function (key) {
        return m_tables[key];
    }

    this.Count = function () {
        var i = 0;
        for (var key in m_tables)
            i++;
        return i;
    }

    this.ContainsKey = function (key) {
        var value = m_tables[key];
        return value != undefined;
    }

    this.Keys = function () {
        var keys = new Array();
        for (var key in m_tables) {
            keys.push(key);
        }
        return keys;
    }

    this.Values = function () {
        var values = new Array();
        for (var key in m_tables) {
            values.push(m_tables[key]);
        }
        return values;
    }
}