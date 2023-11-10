'use strict'

let configuration = System.Configuration.Ini.GetConfigurationView('dgserver/config.ini');
if (!configuration) {
    throw new Error('configuration is null or undefined');
}
const DATABASE_SERVER = configuration.database.server;
const DATABASE_LIBNAME = configuration.database.libname;
const DATABASE_LOGINID = configuration.database.loginid;
const DATABASE_PASSWORD = configuration.database.password;
const FILE_SERVER = configuration.fileserver.server;

class DAO extends Object {
    constructor() {
        super();
        this.DatabaseAccessAdapter = System.Data.SqlClient.
            DatabaseAccessAdapter.New(DATABASE_SERVER, DATABASE_LIBNAME, DATABASE_LOGINID, DATABASE_PASSWORD);
        this.DataTableGateway = System.Data.DataTableGateway.New(this.DatabaseAccessAdapter);
    }
    static GetInstance() {
        if (!this.__instance) {
            this.__instance = new DAO();
        }
        return this.__instance;
    }
}

class ViewsDAO {
    GetAllView() {
        let dao = DAO.GetInstance();
        return dao.DataTableGateway.Select("select viewid,querycode,viewname,modifydate from dg_views");
    }
    GetAllGroupView(model) {
        let dao = DAO.GetInstance();
        let selection = "SELECT viewid,querycode,viewname,modifydate,gp.gname,gp.gcode \
FROM dbo.dg_group gp LEFT JOIN dbo.dg_views vw ON vw.gcode = gp.gcode";

        //let parameters = [];
        //if (model.hasOwnProperty('gcode')) {
        //    parameters.push({
        //        Name: 'gcode',
        //        Value: model.gcode,
        //    })
        //    selection += " where  vw.gcode like '@gcode%'";
        //}

        let rows = dao.DataTableGateway.Select(selection);
        let RowMap = new Map();

        for (let item of rows) {
            if (item["gcode"] && item["gcode"] !== "") {
                let view = null
                if (item["viewid"]) {
                    view = {
                        viewid: item["viewid"],
                        querycode: item["querycode"],
                        viewname: item["viewname"],
                        modifydate: item["modifydate"]
                    }
                }

                if (!RowMap.has(item["gcode"])) {
                    let gpviews = [];
                    if (view) {
                        gpviews.push(view);
                    }
                    let GroupViews = {
                        gcode: item["gcode"],
                        gname: item["gname"],
                        views: gpviews
                    }
                    RowMap.set(item["gcode"], GroupViews);
                }
                else {
                    let views = RowMap.get(item["gcode"]).views;
                    if (view) {
                        views.push(view)
                    }
                }
            }
        }
        return Array.from(RowMap.values())
    }
    GetCodeById(id) {
        if (!id) {
            id = 0;
        }
        if (isNaN(id = Number(id)) || id == 0) {
            return null;
        }
        let dao = DAO.GetInstance();
        let rows = dao.DataTableGateway.Select("select viewcode,viewname from dg_views where viewid=@viewid", [{
            Value: id,
            Name: 'viewid',
        }]);
        if (rows.length <= 0) {
            return null;
        }
        if (arguments[1]) {
            return rows[0];
        }
        return rows[0]['viewcode'];
    }
    GetCodeByCode(code) {
        if (typeof code !== 'string' && code.length <= 0) {
            return null;
        }
        let dao = DAO.GetInstance();
        let rows = dao.DataTableGateway.Select("select viewcode,viewname,[version] from dg_views where querycode=@querycode", [{
            Value: code,
            Name: 'querycode',
        }]);
        if (rows.length <= 0) {
            return null;
        }
        if (arguments[1]) {
            return rows[0];
        }
        return rows[0]['viewcode'];
    }
    AddOrUpdate(model) {

        let vsion = "[version]";
        if (!model.gcode)
            model.gcode = "099";

        if (model.freshversion)
            vsion = "(SELECT  '1.0.0.'+ RIGHT('000'+CAST(CAST(SUBSTRING(ISNULL(MAX([version]),0),7,3) AS int)+1 AS VARCHAR(3)),3)\
        FROM dbo.dg_views WHERE viewid = @viewid)";

        vsion = !model.viewid ? "1.0.0.001" : vsion;

        let gcode = model.gcode;
        let noger = "SELECT '" + gcode + "'+ RIGHT('000'+ CAST(CAST(ISNULL(MAX(querycode),0) AS INT)+1 AS VARCHAR),3) FROM dbo.dg_views WHERE gcode = '" + gcode + "'";

        let expression = !model.viewid ?
            "INSERT INTO dbo.dg_views(querycode,viewname,viewcode,gcode,[version]) VALUES((" + noger + "),@viewname,@viewcode,@gcode,'" + vsion + "')" :
            'UPDATE dbo.dg_views SET viewname=@viewname,viewcode=@viewcode,gcode=@gcode,[version]=' + vsion + ' WHERE viewid=@viewid';

        let parameters = [{
            Name: 'viewcode',
            Value: model.viewcode,
        }, {
            Name: 'viewname',
            Value: model.viewname,
        }
            , {
            Name: 'gcode',
            Value: model.gcode,
        }
        ];
        if (model.viewid) {
            parameters.push({
                Name: 'viewid',
                Value: model.viewid,
            });
        }

        let dao = DAO.GetInstance();
        if (dao.DataTableGateway.ExecuteNonQuery(expression, parameters) <= 0) {
            return 0;
        } else {
            return dao.DataTableGateway.Select('SELECT TOP 1 viewid FROM dbo.dg_views ORDER BY viewid DESC')[0]['viewid'];
        }
    }
    DeleteById(id) {
        if (!id) {
            id = 0;
        }
        if (isNaN(id = Number(id)) || id == 0) {
            return false;
        }
        let dao = DAO.GetInstance();
        return dao.DataTableGateway.ExecuteNonQuery('DELETE dbo.dg_views WHERE viewid=@viewid', [{
            Value: id,
            Name: 'viewid',
        }]) > 0;
    }
    GetPreViewList() {
        let dao = DAO.GetInstance();
        return dao.DataTableGateway.Select("SELECT viewname,querycode FROM dbo.dg_views WHERE gcode!='099' and gcode is not null", null);
    }
}

class ComponentsDAO {
    GetAll() {
        let dao = DAO.GetInstance();
        return dao.DataTableGateway.Select("select * from dg_components");
    }
    GetById(componentId) {
        let dao = DAO.GetInstance();
        return dao.DataTableGateway.Select("select * from dg_components where componentid=@componentId", {
            Name: 'componentId',
            Value: componentId
        });
    }
}

class GroupDAO {
    LoadGroup() {
        let dao = DAO.GetInstance();
        return dao.DataTableGateway.Select("SELECT gcode,gname,describtion FROM dbo.dg_group ORDER BY gname ASC ");
    }
}

class PublishDao {
    SavePublish(model) {
        let dao = DAO.GetInstance();

        let sql = "IF EXISTS(SELECT publishid FROM dbo.dg_publishview WHERE devicename = @devicename) \
UPDATE dbo.dg_publishview SET viewversion = (SELECT TOP 1 '1.0.0.'+ RIGHT('000'+CAST(CAST(SUBSTRING(ISNULL(MAX(viewversion),0),7,3) AS int)+1 AS VARCHAR(5)),3) FROM dbo.dg_publishview), publishdate =@publishdate,diagnosisurl=@diagnosisurl, mode = @mode,viewid=@viewid,querycode=@querycode WHERE  devicename = @devicename  \
ELSE \
INSERT dbo.dg_publishview(deviceid,devicename, viewid,querycode,viewversion,publishdate, mode,diagnosisurl) \
VALUES(@deviceid,@devicename ,@viewid,@querycode,(SELECT TOP 1 '1.0.0.'+ RIGHT('000'+CAST(CAST(SUBSTRING(ISNULL(MAX(viewversion),0),7,3) AS int)+1 AS VARCHAR(5)),3) FROM dbo.dg_publishview), @publishdate, @mode,@diagnosisurl) ";

        let insertfile = "INSERT dbo.dg_viewfileinfo(viewid,filename,filepath,filemd5,beindex,modifydate)VALUES";

        let deletefile = "DELETE dbo.dg_viewfileinfo WHERE viewid=@viewid";


        let reference = model.references;
        let includes = model.includes;
        let files = [];
        files = reference.concat(includes);
        files.push(model.htmlpath);
        if (model.fragments) {
            files = files.concat(model.fragments);
        }

        let fileparams = [];
        let sum = 0;

        for (let file of files) {
            let filepath = "";

            if (!file) {
                console.log("null file" + file);
                continue;
            }

            let ext = file.substr(file.lastIndexOf(".")).toLowerCase();

            //if (ext === ".html")
            //    filepath = model.basepath + file.replace("..","");
            //else
            filepath = model.resourcepath + file;
            let md5 = this.GetFileMd5(filepath, ext === ".mp4");

            let beindex = 0;
            if (file == model.htmlpath) {
                console.log("Ê×Ò³" + file);
                beindex = 1;
            }

            insertfile += "(";

            let filename = file;
            if (file.indexOf("/") >= 0)
                filename = file.substr(file.lastIndexOf("/") + 1, file.length - file.lastIndexOf("/"));

            insertfile += "@viewid" + sum + ",";
            fileparams.push({
                Name: 'viewid' + sum,
                Value: model.viewid,
            });
            insertfile += "@filename" + sum + ",";
            fileparams.push({
                Name: 'filename' + sum,
                Value: filename,
            });
            insertfile += "@filepath" + sum + ",";
            fileparams.push({
                Name: 'filepath' + sum,
                Value: file,
            });
            insertfile += "@filemd5" + sum + ",";
            fileparams.push({
                Name: 'filemd5' + sum,
                Value: md5,
            });
            insertfile += "@beindex" + sum + ",";
            fileparams.push({
                Name: 'beindex' + sum,
                Value: beindex,
            });
            insertfile += "@modifydate" + sum;
            fileparams.push({
                Name: 'modifydate' + sum,
                Value: new Date().toString(),
            });
            insertfile += ")";

            if (sum < files.length - 1)
                insertfile += ",";
            sum++;
        }


        let params = [];
        params.push({
            Name: 'deviceid',
            Value: model.deviceid,
        });
        params.push({
            Name: 'devicename',
            Value: model.devicename,
        });
        params.push({
            Name: 'viewid',
            Value: model.viewid,
        });
        params.push({
            Name: 'publishdate',
            Value: new Date().toString(),
        });
        params.push({
            Name: 'mode',
            Value: model.mode,
        });
        params.push({
            Name: 'querycode',
            Value: model.querycode,
        });
        params.push({
            Name: 'diagnosisurl',
            Value: model.url,
        });

        let result = true;
        if (model.viewid && model.mode == 1) {
            dao.DataTableGateway.ExecuteNonQuery(deletefile, params);
        }

        if (result && model.mode == 1) {
            result &= dao.DataTableGateway.ExecuteNonQuery(insertfile, fileparams) > 0;
        }
        if (result) {
            result &= dao.DataTableGateway.ExecuteNonQuery(sql, params) > 0;
        }

        return result;
    }

    GetFileMd5(filepath, isvedio) {
        let md5value;
        let filedata;
        let value = "";
        let item = "";

        if (!isvedio) {
            using(System.IO.File, function (fs) {
                let md5 = System.Cryptography.MD5;
                if (!fs.Exists(filepath)) {
                    console.log("no file:"+filepath);
                    return value;
                }
                filedata = fs.ReadAllBytes(filepath);
                md5value = md5.ComputeHashValue(filedata);
            });

             for (let char of md5value) {
                    item = char.toHexString();
                    item = ('0' + item).slice(-2);
                    value += item;
                }
             return value;
        }
        else {
            let file = GetFileMd5Value(filepath);
            value = file.md5;
            return value;
        }
    }

    SaveOnLinePublish(model) {
        let dao = DAO.GetInstance();

        let sql = "IF EXISTS(SELECT publishid FROM dbo.dg_publishview WHERE devicename = @devicename) \
UPDATE dbo.dg_publishview SET viewversion = (SELECT TOP 1 '1.0.0.'+ RIGHT('000'+CAST(CAST(SUBSTRING(ISNULL(MAX(viewversion),0),7,3) AS int)+1 AS VARCHAR(5)),3) FROM dbo.dg_publishview), publishdate =@publishdate,diagnosisurl=@diagnosisurl, mode = @mode,viewid=@viewid,querycode=@querycode WHERE  devicename = @devicename  \
ELSE \
INSERT dbo.dg_publishview(deviceid,devicename, viewid,querycode,viewversion,publishdate, mode,diagnosisurl) \
VALUES(@deviceid,@devicename ,@viewid,@querycode,(SELECT TOP 1 '1.0.0.'+ RIGHT('000'+CAST(CAST(SUBSTRING(ISNULL(MAX(viewversion),0),7,3) AS int)+1 AS VARCHAR(5)),3) FROM dbo.dg_publishview), @publishdate, @mode,@diagnosisurl) ";

        let params = [];
        params.push({
            Name: 'deviceid',
            Value: model.deviceid,
        });
        params.push({
            Name: 'devicename',
            Value: model.devicename,
        });
        params.push({
            Name: 'viewid',
            Value: model.viewid,
        });
        params.push({
            Name: 'publishdate',
            Value: new Date().toString(),
        });
        params.push({
            Name: 'mode',
            Value: model.mode,
        });
        params.push({
            Name: 'querycode',
            Value: model.querycode,
        });
        params.push({
            Name: 'diagnosisurl',
            Value: model.url,
        });

        let result = true;
        result &= dao.DataTableGateway.ExecuteNonQuery(sql, params) > 0;

        return result;
    }

    GetPublish(model) {
        let dao = DAO.GetInstance();
        let sql = "SELECT pb.deviceid,fi.viewid,pb.viewversion,pb.publishdate,pb.querycode,pb.diagnosisurl, \
pb.mode,fi.[filename],fi.filepath,fi.filemd5,fi.beindex \
FROM dbo.dg_publishview pb LEFT JOIN \
dbo.dg_viewfileinfo fi ON pb.viewid=fi.viewid \
WHERE pb.devicename='" + model.devicename + "'";
        return dao.DataTableGateway.Select(sql, null);
    }
    SavePublishCached(deviceid, data) {
        SaveCached(deviceid, data);
    }

    GetPublishLog(model) {
        let dao = DAO.GetInstance();
        let sql = "SELECT lg.[deviceid],lg.[devicename],lg.[viewid],lg.[querycode],lg.[viewversion],\
        lg.[publishdate], lg.[mode], lg.[diagnosisurl], vw.viewname, vw.gcode, gp.gname\
        FROM dbo.dg_publishlog lg LEFT JOIN dbo.dg_views vw ON lg.viewid = vw.viewid\
        LEFT JOIN dbo.dg_group gp ON vw.gcode = gp.gcode WHERE lg.deviceid = '"+ model.deviceid + "' ORDER BY lg.publishdate DESC";
        return dao.DataTableGateway.Select(sql, null);
    }
}

class OperateDao {
    SaveOperate(mode) {
        let dao = DAO.GetInstance();
        let sql = "IF EXISTS (SELECT id FROM dg_deviceoperate WHERE deviceid=@deviceid AND type=@type) \
        UPDATE dg_deviceoprate SET devicename =@devicename, [type] =@type, operatecontent = @operatecontent, operatedate = GETDATE() where deviceid=@deviceid \
        ELSE INSERT dg_deviceoprate(devicename, deviceid, [type], operatecontent, operatedate) \
        VALUES(@devicename,@deviceid,@type, @operatecontent, @operatedate)";


        let params = [];
        params.push({
            Name: 'deviceid',
            Value: model.deviceid,
        });
        params.push({
            Name: 'devicename',
            Value: model.devicename,
        });
        params.push({
            Name: 'type',
            Value: model.type,
        });
        params.push({
            Name: 'operatedate',
            Value: new Date().toString(),
        });
        params.push({
            Name: 'operatecontent',
            Value: model.operatecontent,
        });
        return dao.DataTableGateway.ExecuteNonQuery(sql, params) > 0;
    }

    GetOperate(model) {

        let whereclip = "";
        if (model.deviceid)
            whereclip = " WHERE deviceid='" + model.deviceid + "'";
        else
            whereclip = "";

        let sql = "SELECT top 100 [devicename],[deviceid],[type],[operatecontent],[operatedate] FROM dg_deviceoperatelog " + whereclip + " order by operatedate desc";
        return dao.DataTableGateway.Select(sql, null);
    }

    GetDeviceCurOperate(model) {

        let whereclip = "";
        if (model.deviceid)
            whereclip = " WHERE deviceid='" + model.deviceid + "'";
        else
            whereclip = "";

        let sql = "SELECT top 100 [devicename],[deviceid],[type],[operatecontent],[operatedate]  FROM dg_deviceoperate " + whereclip;

        return dao.DataTableGateway.Select(sql, null);
    }

}