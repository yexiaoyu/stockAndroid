function app() {
    this.DB;
}
/**
 * 初始化数据库 
 * @param {String} dbName
 * @param {String} dbVersion
 * @param {String} dbDesc
 * @param {String} dbSize
 */
app.prototype.dbConnect = function(dbName, dbVersion, dbDesc, dbSize) {

    try {
        if (!window.openDatabase) {
            console.log('Databases are not supported in this browser.');
            return false;
        } else {
            dbName = dbName ? dbName : 'STOCK';
            dbVersion = dbVersion ? dbVersion : '1.0';
            dbDesc = dbDesc ? dbDesc : 'STOCK for User Mobile';
            dbSize = dbSize ? dbSize : (2 * 1024 * 1024);
            this.DB = window.openDatabase(dbName, dbVersion, dbDesc, dbSize);
            return true;
        }
    } catch (e) {
        if (e == 2) {
            console.log("Invalid database version.");
        } else {
            console.log("Unknown error " + e + ".");
        }
        return false;
    }

}

/**
 * 创建表
 * @param {String} tableName
 * @param {Object} tableField
 */
app.prototype.dbDefineTable = function(tableName, tableField) {

    if (!tableName || !tableField) {
        console.log('ERROR: Function "dbCreateTable" tableName or tableField is NULL.');
    }
    var fieldArr = [];
    var fieldItem;
    var i = 0;

    for (var field in tableField) {
        field.toString();
        tableField[field].toString();
        fieldArr[i] = field + ' ' + tableField[field];

        i++;
    }
    fieldItem = fieldArr.join(",").toString();

    var SQL = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (';
    SQL += fieldItem;
    SQL += ')';
    console.log(SQL);

    this.DB.transaction(function(tx) {
        tx.executeSql(SQL, [], function(tx, result) {
            return true;
        }, function(tx, error) {
            console.log(error);
            return false;
        });
    });
}

/**
 * 插入数据
 * @param {String} tableName
 * @param {Object} tableField
 * @param {Function} funName
 */
app.prototype.dbInsert = function(tableName, tableField, funName) {
    if (!tableField) {
        console.log('ERROR: FUNCTION dbInsert tableField is NULL');
        return false;
    }
    var fieldKeyArr = [];
    var fieldValueArr = [];
    var fieldKey;
    var fieldValue;
    var i = 0;

    for (var field in tableField) {

        field.toString();
        tableField[field].toString();
        fieldKeyArr[i] = field;
        fieldValueArr[i] = tableField[field];
        if (typeof(fieldValueArr[i]) !== 'number') {
            fieldValueArr[i] = '"' + fieldValueArr[i] + '"';
        }
        i++;
    }
    fieldKey = fieldKeyArr.join(",");
    fieldValue = fieldValueArr.join(",");

    var SQL = 'INSERT INTO ' + tableName + ' (';
    SQL += fieldKey;
    SQL += ') ';
    SQL += 'VALUES (';
    SQL += fieldValue;
    SQL += ')';
    console.log(SQL);

    this.DB.transaction(function(tx) {
        tx.executeSql(SQL, [], function(tx, result) {
            if(funName){
                funName(result);
            } else {
                console.log("Insert Success");
            }
        }, function(tx, error) {
            console.log(error);
            return false;
        });
    });
}
/**
 * 查询所有结果
 * @tableName {String}  表名
 * @funName {Function} 回调函数的名字
 * @tableField {Object}  需要查询的字段
 * @dbParams {Object}  查询条件
 * @callbackPara {String} 回调函数的参数
 */
app.prototype.dbFindAll = function(tableName, funName, tableField, dbParams) {
    tableField = tableField || '*';
    dbParams = dbParams || '';
    if (!tableName || !funName) {
        console.log('ERROR: Function "dbFindAll" tableName or funName is NULL.');
    }

    var SQL = '';
    SQL += 'SELECT ' + tableField + ' FROM ' + tableName + dbParams;
	
    this.DB.transaction(function(tx) {
        tx.executeSql(SQL, [], function(tx, result){
            funName(result);
        }, function(tx, error) {
            console.log(error);
            return false;
        });
    });
}

/**
 * 删除数据
 * @param {String}  tableName
 * @param {Object}  dbParams
 * @param {Function} funName
 */
app.prototype.dbDelete = function(tableName, dbParams, funName) {

    if (!tableName || !dbParams) {
        console.log('ERROR: FUNCTION "dbDelete" tableName or dbParams is NULL');
        return false;
    }
    var SQL = '';
    SQL += 'DELETE FROM ' + tableName + ' WHERE ';

    var paramArr = new Array();
    var paramStr = '';
    var i = 0;
    for (var k in dbParams) {
        if (typeof(dbParams[k]) !== 'number') {
            dbParams[k] = '"' + dbParams[k] + '"';
        }
        paramArr[i] = k.toString() + '=' + dbParams[k];
        i++;
    }
    paramStr = paramArr.join(" AND ");
    SQL += paramStr;

    this.DB.transaction(function(tx) {
        tx.executeSql(SQL);
    }, [], function(tx, result) {
        funName(result);
    }, function(tx, error) {
        console.log(error);
        return false;
    });
    console.log(SQL);
}

/**
 * 更新数据表
 * @param {String}  *tableName
 * @param {Object}  *dbParams
 * @param {Object}  *dbWhere
 * @param {Function} funName
 */
app.prototype.dbUpdate = function(tableName, dbParams, dbWhere, funName) {

    var SQL = 'UPDATE ' + tableName + ' SET ';
    var paramArr = new Array();
    var paramStr = '';
    var i = 0;
    for (var k in dbParams) {
        if (typeof(dbParams[k]) !== 'number') {
            dbParams[k] = '"' + dbParams[k] + '"';
        }
        paramArr[i] = k.toString() + '=' + dbParams[k];
        i++;
    }
    paramStr = paramArr.join(" , ");

    SQL += paramStr;
    SQL += ' WHERE ';

    var whereArr = new Array();
    var whereStr = '';
    var n = 0;
    for (var w in dbWhere) {

        if (typeof(dbWhere[w]) !== 'number') {
            dbWhere[n] = '"' + dbWhere[w] + '"';
        }
        whereArr[n] = w.toString() + '=' + dbWhere[w];
        n++;
    }

    whereStr = whereArr.join(" AND ");

    SQL += whereStr;

    this.DB.transaction(function(tx) {
        tx.executeSql(SQL);
    }, [], function(tx, result) {
        funName(result);
    }, function(tx, error) {
        console.log(error);
        return false;
    });
    console.log(SQL);

}

/**
 * 清空数据表
 * @param {String} tableName
 * @return {Boolean}
 */
app.prototype.dbTruncate = function(tableName) {

    if (!tableName) {
        console.log('ERROR:Table Name is NULL');
        return false;
    }

    function _TRUNCATE(tableName) {
        this.DB.transaction(function(tx) {
            tx.executeSql('DELETE TABLE ' + tableName);
        }, [], function(tx, result) {
            console.log('DELETE TABLE ' + tableName);
            return true;
        }, function(tx, error) {
            console.log(error);
            return false;
        })
    }

    _TRUNCATE(tableName);
}

/**
 * @desc 删除数据表
 * @param {String} tableName
 * @return {Boolean}
 */
app.prototype.dbDrop = function(tableName) {

    if (!tableName) {
        console.log('ERROR:Table Name is NULL');
        return false;
    }

    function _DROP(tableName) {
        this.DB.transaction(function(tx) {
            tx.executeSql('DROP TABLE ' + tableName);
        }, [], function(tx, result) {
            console.log('DROP TABLE ' + tableName);
            return true;
        }, function(tx, error) {
            console.log(error);
            return false;
        })
    }
    _DROP(tableName);
}