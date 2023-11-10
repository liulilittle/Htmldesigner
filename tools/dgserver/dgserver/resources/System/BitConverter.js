(function () { // IEEE 754 FLOAT/DOUBLE CALC STANDARD

    function FloatToInteger(num) {
        function DecToBinTail(dec, pad) {
            var bin = "";
            var i;
            for (i = 0; i < pad; i++) {
                dec *= 2;
                if (dec >= 1) {
                    dec -= 1;
                    bin += "1";
                }
                else {
                    bin += "0";
                }
            }
            return bin;
        }

        function DecToBinHead(dec, pad) {
            var bin = "";
            var i;
            for (i = 0; i < pad; i++) {
                bin = (parseInt(dec % 2).toString()) + bin;
                dec /= 2;
            }
            return bin;
        }

        var dec = num;
        var sign;
        var signString;
        var decValue = parseFloat(Math.abs(num));
        if (num.toString().charAt(0) == '-') {
            sign = 1;
            signString = "1";
        }
        else {
            sign = 0;
            signString = "0";
        }
        if (decValue == 0) {
            fraction = 0;
            exponent = 0;
        }
        else {
            var exponent = 127;
            if (decValue >= 2) {
                while (decValue >= 2) {
                    exponent++;
                    decValue /= 2;
                }
            }
            else if (decValue < 1) {
                while (decValue < 1) {
                    exponent--;
                    decValue *= 2;
                    if (exponent == 0)
                        break;
                }
            }
            if (exponent != 0) decValue -= 1; else decValue /= 2;

        }
        var fractionString = DecToBinTail(decValue, 23);
        var exponentString = DecToBinHead(exponent, 8);

        return parseInt(signString + exponentString + fractionString, 2);
    }

    function EXPORTS_C_GetBytes_STR(str) {
        var bytes = new Array();
        var len, c;
        len = str.length;
        for (var i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if (c >= 0x010000 && c <= 0x10FFFF) {
                bytes.push(((c >> 18) & 0x07) | 0xF0);
                bytes.push(((c >> 12) & 0x3F) | 0x80);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if (c >= 0x000800 && c <= 0x00FFFF) {
                bytes.push(((c >> 12) & 0x0F) | 0xE0);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if (c >= 0x000080 && c <= 0x0007FF) {
                bytes.push(((c >> 6) & 0x1F) | 0xC0);
                bytes.push((c & 0x3F) | 0x80);
            } else {
                bytes.push(c & 0xFF);
            }
        }
        return bytes;
    }

    function EXPORTS_C_GetBytes_INT32(num) {
        var a = num & 0xFF;
        var b = (num >> 8) & 0xFF;
        var c = (num >> 16) & 0xFF;
        var d = (num >> 24) & 0xFF;
        return [a, b, c, d];
    }

    function EXPORTS_C_GetBytes(value, float) {
        if (typeof value == 'string')
            return EXPORTS_C_GetBytes_STR(value);
        if (value == true || value == false) {
            value = value ? 1 : 0;
        }
        if (float) {
            return EXPORTS_C_GetBytes_Float(value);
        }
        return EXPORTS_C_GetBytes_INT32(parseInt(value));
    }

    function EXPORTS_C_GetBytes_Float(num) {

        return EXPORTS_C_GetBytes_INT32(FloatToInteger(num));
    }

    function EXPORTS_C_ToString(arr) {
        if (typeof arr === 'string') {
            return arr;
        }
        var str = '',
            _arr = arr;
        for (var i = 0; i < _arr.length; i++) {
            var one = _arr[i].toString(2),
                v = one.match(/^1+?(?=0)/);
            if (v && one.length == 8) {
                var bytesLength = v[0].length;
                var store = _arr[i].toString(2).slice(7 - bytesLength);
                for (var st = 1; st < bytesLength; st++) {
                    store += _arr[st + i].toString(2).slice(2);
                }
                str += String.fromCharCode(parseInt(store, 2));
                i += bytesLength - 1;
            } else {
                str += String.fromCharCode(_arr[i]);
            }
        }
        return str;
    }

    function EXPORTS_C_ToINT32(arr, size) {
        var num = arr[0];
        if (size >= 2)
            num |= arr[1] << 8;
        if (size >= 3)
            num |= arr[2] << 16;
        if (size >= 4)
            num |= arr[3] << 24;
        return num;
    }

    function EXPORTS_C_ToSingle(t) {
        var fillstr = function (t, c, n, b) {
            if ((t == "") || (c.length != 1) || (n <= t.length)) {
                return t;
            }
            var l = t.length;
            for (var i = 0; i < n - l; i++) {
                if (b == true) {
                    t = c + t;
                }
                else {
                    t += c;
                }
            }
            return t;
        };
        t = t.toString(2);
        t = fillstr(t, "0", 32, true);
        var s = t.substring(0, 1);
        var e = t.substring(1, 9);
        var m = t.substring(9);
        e = parseInt(e, 2) - 127;
        m = "1" + m;
        if (e >= 0) {
            m = m.substr(0, e + 1) + "." + m.substring(e + 1)
        }
        else {
            m = "0." + fillstr(m, "0", m.length - e - 1, true)
        }
        if (m.indexOf(".") == -1) {
            m = m + ".0";
        }
        var a = m.split(".");
        var mi = parseInt(a[0], 2);
        var mf = 0;
        for (var i = 0; i < a[1].length; i++) {
            mf += parseFloat(a[1].charAt(i)) * Math.pow(2, -(i + 1));
        }
        m = parseInt(mi) + parseFloat(mf);
        if (s == 1) {
            m = 0 - m;
        }
        return m;
    }

    var exports = {
        GetBytes: EXPORTS_C_GetBytes,
        ToString: EXPORTS_C_ToString,
        ToInt16: function (arr) { return EXPORTS_C_ToINT32(arr, 2); },
        ToByte: function (arr) { return arr[0]; },
        ToInt24: function (arr) { return EXPORTS_C_ToINT32(arr, 3); },
        ToSingle: function (arr) {
            return EXPORTS_C_ToSingle(EXPORTS_C_ToINT32(arr, 4));
        },
        ToBoolean: function (arr) { return arr[0] != 0; },
        ToInt32: function (arr) { return EXPORTS_C_ToINT32(arr, 4); },
        Int32BitsToFloat: function (num) { return EXPORTS_C_ToSingle(num); },
        FloatToInt32Bits: function (num) { return FloatToInteger(num); },
    };

    Assembly.Modules.Add("system::BitConverter", exports);
})();