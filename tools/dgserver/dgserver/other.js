'use strict'

require('dgserver/dao.js'); /* #include hh */
require('dgserver/server.js');
require('dgserver/controller.js');

Date.prototype.Format = function (fmt) {
    let o = {
        "M+": this.getMonth() + 1, // 月份 
        "d+": this.getDate(), // 日 
        "H+": this.getHours(), // 小时 
        "m+": this.getMinutes(), // 分 
        "s+": this.getSeconds(), // 秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度 
        "S": this.getMilliseconds() // 毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

Date.prototype.toJSON = function () {
    return this.toString();
}

Date.prototype.toString = function () {
    return this.Format("yyyy-MM-dd HH:mm:ss");
}

Date.prototype.ToLocalTime = function () {
    let offset = this.getTimezoneOffset();
    var newc = new Date(this);
    //console.log("newc:" + newc);
    newc.setHours(newc.getHours() + (offset / 60));
    //console.log("newc:" + newc);
    return newc;
}


Date.prototype.toJSON = function () {
    return this.Format('yyyy-MM-dd HH:mm:ss');
}

Number.prototype.toHexString = function () {
    return this.toString(16);
}

class ____ReportingDAO {
    constructor() {
        this.SealedExpression = (function () {
            'use strict'

            let __self = new Object({
                SelectCusomterExpression: 'SELECT ROW_NUMBER() OVER(ORDER BY customer.changetime DESC) AS rowid, \
                                    customer.hospitalid, \
                                    hospitalinfo.hospitalname, \
                                    cusomterexaminfo.customerid, \
                                    cusomterexaminfo.examno, \
                                    customer.customerage, \
                                    customer.idcard, \
                                    customer.customername, \
                                    customer.phonenumber, \
                                    customer.customersex, \
                                    customer.customertype, \
                                    customer.changetime, \
                                    customer.customermarriage, \
                                    customer.customerunit, \
                                    cusomterexaminfo.examproject, \
                                    cusomterexaminfo.state, \
                                    cusomterexaminfo.completetime, \
                                    cusomterexaminfo.examtime \
                FROM[PG_Customer] AS customer  \
                INNER JOIN \
                                    [PG_HospitalInfo] AS hospitalinfo  \
                ON  \
	                customer.hospitalid = hospitalinfo.hospitalid \
                INNER JOIN \
                                    [PG_CustomerExamInfo] AS cusomterexaminfo \
                ON  \
	                cusomterexaminfo.customerid = customer.customerid ',
                SelectCusomterExpressionWithWhere: function (condition, expression) {
                    'use strict'

                    if (!expression) {
                        expression = __self.SelectCusomterExpression;
                    }
                    if (condition) {
                        expression += ('WHERE ' + condition);
                    }
                    return expression;
                },
                SelectCusomterExpressionWithPagging: function (condition, expression) {
                    'use strict'

                    expression = __self.SelectCusomterExpressionWithWhere(condition, expression);
                    expression = ' (' + expression + ') AS CUSTOMERVIEWTEMPTABLECTE ';
                    return expression;
                },
                BuildStatistExamBriefly: function (options, parameters, index) {
                    'use strict'

                    let hospitalid = Number(options.hospitalid);
                    if (isNaN(hospitalid)) {
                        return null;
                    }
                    let expression = " \
                      SELECT \
                        {hospitalid} AS hospitalid, \
                        (SELECT PG_HospitalInfo.hospitalname FROM PG_HospitalInfo \
                        WHERE PG_HospitalInfo.hospitalid = {hospitalid}) AS hospitalname, \
                        (SELECT COUNT(1) FROM PG_CustomerExamInfo \
                        WHERE PG_CustomerExamInfo.hospitalid = {hospitalid} AND \
                        {examtime_condition}) AS totalexamnumber,\
                            (SELECT COUNT(1) FROM\
                        PG_CustomerExamInfo\
                        WHERE PG_CustomerExamInfo.hospitalid = {hospitalid} AND\
                        PG_CustomerExamInfo.state = 0 AND {examtime_condition}) AS notexamnumber,\
                            (SELECT COUNT(1) FROM\
                        PG_CustomerExamInfo\
                        WHERE PG_CustomerExamInfo.hospitalid = {hospitalid} AND\
                        PG_CustomerExamInfo.state = 1 AND {examtime_condition}) AS inexamnumber,\
                            (SELECT COUNT(1) FROM\
                        PG_CustomerExamInfo\
                        WHERE PG_CustomerExamInfo.hospitalid = {hospitalid} AND\
                        PG_CustomerExamInfo.state = 2 AND {examtime_condition}) AS overexamnumber,\
                            (SELECT COUNT(1) FROM\
                        PG_CustomerExamInfo\
                        WHERE PG_CustomerExamInfo.hospitalid = {hospitalid} AND\
                        PG_CustomerExamInfo.state = 3 AND {examtime_condition}) AS passedexamnumber,\
                            (SELECT COUNT(1) FROM\
                        PG_CustomerExamInfo\
                        WHERE PG_CustomerExamInfo.hospitalid = {hospitalid} AND\
                        PG_CustomerExamInfo.state = 4 AND {examtime_condition}) AS deletedexamnumber,\
                            (SELECT COUNT(1) FROM PG_Customer\
                        INNER JOIN PG_CustomerExamInfo ON PG_CustomerExamInfo.customerid = PG_Customer.customerid\
                        WHERE PG_CustomerExamInfo.hospitalid = {hospitalid} AND\
                        PG_Customer.customersex = 0 AND {examtime_condition}) AS numberofwomen,\
                            (SELECT COUNT(1) FROM PG_Customer\
                        INNER JOIN PG_CustomerExamInfo ON PG_CustomerExamInfo.customerid = PG_Customer.customerid\
                        WHERE PG_CustomerExamInfo.hospitalid = {hospitalid} AND\
                        PG_Customer.customersex = 1 AND {examtime_condition}) AS numberofmen,\
                            (SELECT COUNT(1) FROM PG_Customer\
                        INNER JOIN PG_CustomerExamInfo ON PG_CustomerExamInfo.customerid = PG_Customer.customerid\
                        WHERE PG_CustomerExamInfo.hospitalid = {hospitalid} AND\
                        PG_Customer.customersex = 1 AND {examtime_condition}) AS numberofmen,\
                            (SELECT COUNT(1) FROM PG_Customer\
                        INNER JOIN PG_CustomerExamInfo ON PG_CustomerExamInfo.customerid = PG_Customer.customerid\
                        WHERE PG_CustomerExamInfo.hospitalid = {hospitalid} AND {customerage_condition} AND {examtime_condition}) AS numberofageperiods,\
                            (SELECT COUNT(1) FROM PG_Customer\
                        INNER JOIN PG_CustomerExamInfo ON PG_CustomerExamInfo.customerid = PG_Customer.customerid\
                        WHERE PG_CustomerExamInfo.hospitalid = {hospitalid} AND\
                        PG_Customer.customermarriage = 0 AND {examtime_condition}) AS numberofunmarriedpeople,\
                            (SELECT COUNT(1) FROM PG_Customer\
                        INNER JOIN PG_CustomerExamInfo ON PG_CustomerExamInfo.customerid = PG_Customer.customerid\
                        WHERE PG_CustomerExamInfo.hospitalid = {hospitalid} AND\
                        PG_Customer.customermarriage = 1 AND {examtime_condition}) AS numberofmarriedpeople \
                    ";
                    let examtime_min = new Date(options.examtime_min);
                    let examtime_max = new Date(options.examtime_max);
                       // console.log(examtime_max);
                    let examtime_condition = ' 1=1 ';
                    let customerage_condition = ' 1=1 ';
                    if (!isNaN(examtime_min)) {
                        examtime_condition += " AND PG_CustomerExamInfo.examtime >= @examtime_min" + index + " ";
                        parameters.push({ Name: 'examtime_min' + index, Value: examtime_min });
                    }
                    if (!isNaN(examtime_max)) {
                        examtime_condition += " AND PG_CustomerExamInfo.examtime < @examtime_max" + index + " ";
                        parameters.push({ Name: 'examtime_max' + index, Value: examtime_max });
                    }
                    let customerage_min = Number(options.customerage_min);
                    let customerage_max = Number(options.customerage_max);
                    if (!isNaN(customerage_min)) {
                        customerage_condition += " AND PG_Customer.customerage >= @customerage_min" + index + " ";
                        parameters.push({ Name: 'customerage_min' + index, Value: customerage_min });
                    }
                    if (!isNaN(customerage_max)) {
                        customerage_condition += " AND PG_Customer.customerage < @customerage_max" + index + " ";
                        parameters.push({ Name: 'customerage_max' + index, Value: customerage_max });
                    }

                    expression = expression.replace(/{hospitalid}/g, hospitalid);
                    expression = expression.replace(/{examtime_condition}/g, examtime_condition);
                    expression = expression.replace(/{customerage_condition}/g, customerage_condition);
                    return expression;
                }
            });
            return __self;
        })();
    }
    GetAllExamCustomer(paging) {
        'use strict'

        let pagesize = paging.PageSize;
        let pageindex = paging.PageIndex;
        let startindex = (pageindex - 1) * pagesize;
        let condition = paging.Tag;
        let wherecast = '';
        let parameters = [];
        if (condition && typeof condition === 'object') {
            if (condition.hasOwnProperty('customername')) {
                wherecast += ' AND customer.customername LIKE @customername ';
                parameters.push({ Name: 'customername', Value: condition.customername });
            }
            if (condition.hasOwnProperty('phonenumber')) {
                wherecast += ' AND customer.phonenumber LIKE @phonenumber ';
                parameters.push({ Name: 'phonenumber', Value: condition.phonenumber });
            }
            if (condition.hasOwnProperty('customertype')) {
                wherecast += ' AND customer.customertype=@state ';
                parameters.push({ Name: 'customertype', Value: condition.customertype });
            }
            if (condition.hasOwnProperty('idcard')) {
                wherecast += ' AND customer.idcard LIKE @idcard ';
                parameters.push({ Name: 'idcard', Value: condition.idcard });
            }
            if (condition.hasOwnProperty('customerage')) {
                wherecast += ' AND customer.customerage=@customerage ';
                parameters.push({ Name: 'customerage', Value: condition.customerage });
            }
            if (condition.hasOwnProperty('customerage_min')) {
                wherecast += ' AND customer.customerage>=@customerage_min ';
                parameters.push({ Name: 'customerage_min', Value: condition.customerage_min });
            }
            if (condition.hasOwnProperty('customerage_max')) {
                wherecast += ' AND customer.customerage>=@customerage_max ';
                parameters.push({ Name: 'customerage_max', Value: condition.customerage_max });
            }
            if (condition.hasOwnProperty('customersex')) {
                wherecast += ' AND customer.customersex=@customersex ';
                parameters.push({ Name: 'customersex', Value: condition.customersex });
            }
            if (condition.hasOwnProperty('customermarriage')) {
                wherecast += ' AND customer.customermarriage=@customermarriage ';
                parameters.push({ Name: 'customermarriage', Value: condition.customermarriage });
            }
            if (condition.hasOwnProperty('customerunit')) {
                wherecast += ' AND customer.customerunit LIKE @customerunit ';
                parameters.push({ Name: 'customerunit', Value: condition.customerunit });
            }
            if (condition.hasOwnProperty('hospitalid')) {
                wherecast += ' AND customer.hospitalid=@hospitalid ';
                parameters.push({ Name: 'hospitalid', Value: condition.hospitalid });
            }
            if (condition.hasOwnProperty('state')) {
                wherecast += ' AND cusomterexaminfo.state=@state ';
                parameters.push({ Name: 'state', Value: condition.state });
            }
            let maxtime = function (datetime) {
                datetime.setHours(23);
                return datetime;
            }
            if (condition.hasOwnProperty('examtime_min')) {
                wherecast += ' AND cusomterexaminfo.examtime >= @examtime_min';
                parameters.push({ Name: 'examtime_min', Value: new Date(condition.examtime_min).ToLocalTime() });
            }
            if (condition.hasOwnProperty('examtime_max')) {
                wherecast += ' AND cusomterexaminfo.examtime < @examtime_max';
                parameters.push({ Name: 'examtime_max', Value: maxtime(new Date(condition.examtime_max).ToLocalTime()) });
            }
            if (condition.hasOwnProperty('completetime_min')) {
                wherecast += ' AND cusomterexaminfo.completetime >= @completetime_min';
                parameters.push({ Name: 'completetime_min', Value: new Date(condition.completetime_min).ToLocalTime() });
            }
            if (condition.hasOwnProperty('completetime_max')) {
                wherecast += ' AND cusomterexaminfo.completetime < @completetime_max';
                parameters.push({ Name: 'completetime_max', Value: maxtime(new Date(condition.completetime_max).ToLocalTime()) });
            }
            if (wherecast) {
                wherecast = ' 1=1 ' + wherecast;
            }
        }
       // parameters[2].Value.setHours(23);
        let dao = DAO.GetInstance();
        let origin = this.SealedExpression.SelectCusomterExpressionWithPagging(wherecast);
        let sql = 'SELECT COUNT(1) AS totalcount FROM ' + origin;
        let totalcount = dao.DataTableGateway.Select(sql, parameters)[0];
        if (totalcount) {
            totalcount = totalcount['totalcount'];
        }
        //console.log(sql);
        //for (var i = 0; i < parameters.length; i++)
        //{
        //    console.log(parameters[i].Name + "-----------" + parameters[i].Value)
        //}
      
        sql = 'SELECT * FROM ' + origin + ' WHERE rowid between ' + (startindex + 1) + ' AND ' + (startindex + pagesize);
        let rows = dao.DataTableGateway.Select(sql, parameters);
        paging = new ____Paging();
        paging.PageIndex = pageindex;
        paging.PageSize = pagesize;
        paging.Tag = rows;
        paging.TotalCount = totalcount;
        paging.PageCount = Math.ceil(totalcount / pagesize);

        return paging;
    }
    GetAllProjectInfo(hospitalid) {
        'use strict'

        if (isNaN(hospitalid)) {
            return [];
        }
        let dao = DAO.GetInstance();
        return dao.DataTableGateway.Select('SELECT * FROM PG_ProjectInfo WHERE hospitalid=' + hospitalid);
    }
    GetAllHospital() {
        'use strict'

        let dao = DAO.GetInstance();
        return dao.DataTableGateway.Select('SELECT * FROM PG_HospitalInfo');
    }
    StatistExamBriefly(options) {
        'use strict'

        let hospitalid = Number(options.hospitalid);
        if (isNaN(hospitalid)) {
            return null;
        }
        let SealedExpression = this.SealedExpression;
        let parameters = new Array();
        let expression = '';
        options.tracefromnowtonmonth = Number(options.tracefromnowtonmonth);
        if (isNaN(options.tracefromnowtonmonth) || options.tracefromnowtonmonth <= 0) {
            expression = SealedExpression.BuildStatistExamBriefly(options, parameters);
        } else {
            let currentdatetime = new Date();
            currentdatetime = new Date(currentdatetime.getFullYear(), currentdatetime.getMonth() + 1, 0, 23, 59, 59);
            let timeOffset = function (d, i) {
                let y = d.getFullYear();
                let m = d.getMonth() + 1;
                let m2 = m + i;
                if (m2 > m) {
                    if (m2 > 12) {
                        m = m2 % 12;
                        y += parseInt(Math.abs(m / 12));
                    }
                }
                else if (m2 < m) {
                    if (m2 <= 0) {
                        m = 12;
                        y -= parseInt(Math.abs(m / 12));
                    }
                }
                return new Date(y, m2, 0, 0, 0, 0);
            }
            for (let i = 1; i <= options.tracefromnowtonmonth; i++) {
                var m = -i;
                let examtime_min = timeOffset(currentdatetime, m);
                examtime_min.setHours(24);
                let examtime_max = timeOffset(currentdatetime, m + 1);
                examtime_max.setHours(24);
                options.examtime_min = examtime_min;
                options.examtime_max = examtime_max;
               // console.log(examtime_min + "===========" + examtime_max);
                expression += SealedExpression.BuildStatistExamBriefly(options, parameters, i);
                if (options.tracefromnowtonmonth > i) {
                    expression += '\r\n UNION ALL \r\n';
                }
            }
        }
        let dao = DAO.GetInstance();
        return dao.DataTableGateway.Select(expression, parameters);
    }
}

class ____Paging {
    constructor() {
        this.PageIndex = 0;
        this.PageSize = 0;
        this.PageCount = 0;
        this.TotalCount = 0;
        this.Tag = null;
    }
}

____Paging.From = function (form) {
    'use strict'

    let paging = new ____Paging();
    let pagesize = parseInt(form['pagesize']);
    let pageindex = parseInt(form['pageindex']);
    if (isNaN(pagesize)) {
        pagesize = 0;
    }
    if (isNaN(pageindex)) {
        pageindex = 0;
    }
    if (pageindex <= 0) {
        pageindex = 1;
    }
    if (pagesize < 5) {
        pagesize = 5;
    }
    paging.PageIndex = pageindex;
    paging.PageSize = pagesize;
    paging.PageCount = parseInt(form['pagecount']);
    paging.TotalCount = parseInt(form['totalcount']);

    let tag = form['tag'];
    if (typeof tag === 'string') {
        try {
            tag = JSON.parse(tag);
        } catch (e) {
            /*--------------------A------------------*/
        }
    }
    paging.Tag = tag;

    return paging;
}

controllers.Reporting = (function () {
    'use strict'

    let dao = new ____ReportingDAO();

    let ProcessGetInvoke = function (context, callback) {
        let response = context.Response;
        let request = context.Request;
        let result = new GeneralResponse();
        result.ErrorCode = 0;
        result.Message = '获取成功';
        result.Tag = callback(request.QueryString);
        response.Write(JSON.stringify(result));
    }

    return new Object({
        GetAllExamCustomer: function (context) {
            let response = context.Response;
            let request = context.Request;
            let result = new GeneralResponse();
            result.ErrorCode = 0;
            result.Message = '获取成功';
            result.Tag = dao.GetAllExamCustomer(____Paging.From(request.QueryString));
            response.Write(JSON.stringify(result));
        },
        GetAllProjectInfo: function (context) {
            ProcessGetInvoke(context, function (form) {
                let hospitalid = Number(form.hospitalid);
                return dao.GetAllProjectInfo(hospitalid);
            });
        },
        GetAllHospital: function (context) {
            ProcessGetInvoke(context, function () {
                return dao.GetAllHospital();
            });
        },
        StatistExamBriefly: function (context) {
            ProcessGetInvoke(context, function (form) {
                return dao.StatistExamBriefly(form);
            });
        }
    });
})();