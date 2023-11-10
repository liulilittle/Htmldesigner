function WebClient() { 
    var self = this;
    var mxhr;
    // evt
    this.DownloadStringCompleted = function (success, content) { }
    this.UploadDataCompleted = function (success) { }
    this.UploadProgressChanged = function (process, e) { };
    // property
    this.Tag = null;

    function ReInitContext() {
        mxhr = new XMLHttpRequest();
        return mxhr;
    }

    function OnUploadDataCompleted(success) {
        if (self.UploadDataCompleted) {
            self.UploadDataCompleted(success);
        }
    }

    function OnDownloadStringCompleted(success, content) {
        if (self.DownloadStringCompleted) {
            self.DownloadStringCompleted(success, content);
        }
    }

    // declare
    this.DownloadStringAsync = function (url) {
        var xhr = ReInitContext();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                OnDownloadStringCompleted(true, xhr.responseText);
            }
        };
        var error = function () { OnDownloadStringCompleted(false); }
        xhr.onerror = error;
        xhr.onabort = error;
        xhr.send();
    }

    this.CancelAsync = function () {
        if (mxhr) {
            mxhr.abort();
            mxhr = null;
        }
    }

    this.DownloadString = function (url) {
        var xhr = ReInitContext();
        xhr.open("GET", url, false);
        xhr.send();
        return xhr.responseText;
    }

    this.UpdateDataAsync = function (url, fd) {
        var xhr = ReInitContext();
        xhr.open("POST", url, true);
        xhr.onprogress = function (e) {
            if (e.lengthComputable) {
                var percent = Math.round(e.loaded * 100 / e.total);
                if (self.UploadProgressChanged) {
                    self.UploadProgressChanged(percent, e);
                }
            }
        };
        var error = function () { OnUploadFileCompleted(false); }
        var load = function () { OnUploadDataCompleted(true); }
        xhr.onload = load;
        xhr.onerror = error;
        xhr.onabort = error;
        xhr.send(fd);
    }

    this.UpdateFileAsync = function (url, name, file) {
        var fd = new FormData();
        fd.append(name, file);
        self.UpdateDataAsync(url, fd);
    }

    this.UpdateStringAsync = function (url, buffer) {
        var xhr = ReInitContext();
        xhr.open("POST", url, true);
        var error = function () { OnUploadFileCompleted(false); }
        var load = function () { OnUploadDataCompleted(true); }
        xhr.onload = load;
        xhr.onerror = error;
        xhr.onabort = error;
        xhr.send(buffer);
    }
}