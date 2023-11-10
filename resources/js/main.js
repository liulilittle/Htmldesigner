//ajax«Î«Û
var xhr = function ($url, $type, $data, $success, $onerror) {
    if ($url == undefined || $url == null) {
        return;
    }
    if ($data == null) {
        $data = undefined;
    }
    $.ajax({
        type: $type,
        url: $url,
        data: $data,
        success: function (buffer) {
            if (!buffer.length) {
                return;
            }

            buffer = JSON.parse(buffer);
            console.log(buffer)
            if (buffer.ErrorCode == 0) {
                if ($success == undefined || $success == null) {
                    return;
                }
                $success(buffer);
            } else {
                method.msg_layer({
                    title: "Œ¬‹∞Ã· æ",
                    close: "true",
                    content: buffer.Message,
                    delay: 1500
                });
            }
        },
        onerror: function (sender, status, onerror) {
            console.error(status);
            if ($onerror == undefined || $onerror == null) {
                return;
            }
            $onerror(sender, status, onerror);
        }
    });
}