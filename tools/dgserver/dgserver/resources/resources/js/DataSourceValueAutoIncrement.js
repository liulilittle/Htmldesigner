'use strict'

var DataSourceValueAutoIncrement = function () {
    this.Value = 0;

    this.GetType = function () {
        var typeinfo = new Type();
        typeinfo.FullName = 'DataSourceValueAutoIncrement';
        typeinfo.References.push('HtmlControl.js');
        typeinfo.Properties = [{
            Name: 'Value',
            PropertyType: 'number',
            Readable: true,
            Writeable: true,
            Browsable: true,
            Description: '获取或设置与此控件关联的文本。',
            Accessor: 'function',
        }];
        typeinfo.Methods = [{
            Name: 'GetType',
            Description: '获取当前实例的 Type 信息。',
        }];
        return typeinfo;
    }

    setInterval(function (self) {

        var current = Number(self.Value);
        if (isNaN(current)) {
            current = 0;
        }
        Object.SetPropertyValue(self, 'Value', current + 1);
    }, 10, this);
};

(function () {
    Type.References.Add('DataSourceValueAutoIncrement.js');
    Type.DefinedName('DataSourceValueAutoIncrement', 'DataSourceValueAutoIncrement');
    Type.DefinedFile('DataSourceValueAutoIncrement', 'DataSourceValueAutoIncrement.js');

    DataSourceValueAutoIncrement = new DataSourceValueAutoIncrement();
})();