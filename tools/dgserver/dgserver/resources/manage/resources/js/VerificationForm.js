(function () {

    var checkNodeType = function (element) {
        if (!element) {
            return 0;
        }
        element = $(element).get(0);
        if (!element) {
            return 0;
        }
        var nodeName = element.tagName;
        if (nodeName === 'INPUT') {
            var typeName = $(element).attr('type');
            if (typeName) {
                typeName = typeName.toLowerCase();
            }
            if (typeName === '' || typeName === 'text' || typeName === 'password')
                return 1;
            else if (typeName === 'radio')
                return 2;
            else if (typeName === 'checkbox')
                return 3;
            return 0;
        }
        return 0;
    }

    var getPropertyName = function (element) {
        if (!element) {
            return null;
        }
        element = $(element);
        var properyName = element.attr('id');
        if (!properyName || properyName.length <= 0) {
            properyName = element.attr('name');
            if (!properyName || properyName.length <= 0) {
                return null;
            }
        }
        return properyName;
    }

    var findAllFormPropertyElement = function (element) {
        if (!element) {
            return [];
        }
        return $(element).find('input[data-form-property]');;
    }

    var eachFormElements = function (elements, callback) {
        for (var i = 0; i < elements.length; i++) {
            var element = $(elements[i]);
            var properyName = getPropertyName(element);
            var nodeType = checkNodeType(element);
            callback(properyName, nodeType, element, i);
        }
    }

    var self = {
        get: function () {
            var validate = arguments[1];
            var root = arguments[0];
            if (!root) {
                return null;
            }
            var elements = findAllFormPropertyElement(root);
            if (elements.length <= 0) {
                return null;
            }
            var form = new Object();
            var count = 0;
            eachFormElements(elements, function (properyName, nodeType, element) {
                var propertyValue = null;
                if (nodeType === 1) {
                    propertyValue = element.val();
                } else if (nodeType === 2 || nodeType === 3) {
                    propertyValue = element.is(':checked');
                }
                if (validate && typeof validate === 'function') {
                    var caller = '/-.xd-validate-00';
                    element[caller] = validate;
                    if (!element[caller](nodeType, properyName, propertyValue))
                        return 'continue';
                }
                count++;
                form[properyName] = propertyValue;
            });
            return (count <= 0 ? null : form);
        },
        set: function () {
            var form = arguments[1];
            var root = arguments[0];
            if (!form || !root) {
                return false;
            }
            var elements = findAllFormPropertyElement(root);
            if (elements.length <= 0) {
                return false;
            }
            eachFormElements(elements, function (properyName, nodeType, element) {
                var propertyValue = form[properyName];
                if (propertyValue == undefined)
                    propertyValue = null;
                if (nodeType === 1) {
                    element.val(propertyValue);
                } else if (nodeType === 2 || nodeType === 3) {
                    element.get(0).checked = (Number(propertyValue) >= 1 || propertyValue == true);
                }
            });
            return true;
        }
    };

    $.form = self;
})(jQuery);