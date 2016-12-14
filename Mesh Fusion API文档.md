# MeshFusion API 文档
> 作为前端service, 提供数据归集、资源管理以及监控统计相关接口

- [] TODO
 - [] 补充错误示例
 - [] 完善权限管理API

## 数据归集

### 数据源管理

#### 1. 添加服务器配置信息并返回数据库信息
**`POST`** */data/manager/config/save*

`响应 Content Type` : **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码,加密后|请求头参数|String|
|connName||必选|连接名|请求参数|String|
|dbType||必选|服务器类型|请求参数|String|
|host||必选|IP地址/主机名|请求参数|String|
|port||必选|端口号|请求参数|String|
|username||必选|服务器用户名|请求参数|String|
|dbpasswd||必选|服务器密码|请求参数|String|
|dataConfigId||可选|数据配置文件id|请求参数|int|

`响应消息`

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "加密后"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/data/manager/config/save*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": {
    "dataConfigId": "fusion_data_config_001",
    "connName": "机器维修数据服务器",
    "databases": [
      {
        "databaseName": "mesh_fusion",
        "databaseRemark": "...^_^...",
        "databaseCreateDate": "2016-11-24 11:11:11",
        "tables": [
          {
            "tableMetaData": {
              "tableName": "Student",
              "tableSize": "100M",
              "tableCreateDate": "2016-11-24 11:11:11",
              "tableRemark": null,
              "columns": [
                {
                  "columnName": "name",
                  "columnType": "vachar",
                  "isNull": false,
                  "isPrimaryKey": false,
                  "columnRemark": "姓名"
                }
              ]
            },
            "tableDatas": [
              {
                "name": "zhangsan",
                "stuNum": "001"
              }
            ]
          }
        ]
      }
    ],
    "status": true
  }
}
```

`错误示例` 
`1. 请求错误`
> 缺少参数

```
{
  "code": 10400,
  "msg": "请求错误",
  "data": null
}
```

`2. 服务内部错误`
> 数据配置信息有误

```
{
  "code": 70105,
  "msg": "failed to connect database",
  "data": {
    "id": 0,
    "type": "mysql",
    "connName": "test",
    "host": "localhost",
    "port": "3306",
    "username": "root",
    "passwd": "root",
    "userId": 1
  }
}
```

> 内部执行错误

```
{
  "code": 70100,
  "msg": "show databases failed",
  "data": null
}
```

#### 2. 根据用户id获取数据库信息
**`GET`** */data/manager/database/list*

`响应 Content Type` : **`application/json;charset=utf-8`**

`参数`

|参数	  | 示例 			  | 必/可选 | 说明 			| 参数类型	| 后端数据类型		|
|:-------:|:-----------------:|:------:|:--------------:|:---------:|:-------------:|
|email    | xiaoming@test.com | 必选 | 邮箱地址			| 请求头参数	| String 	    |
|password | 123456            | 必选 | 用户输入的密码,加密后 | 请求头参数	| String	    |
|userId   | 1				  | 必选 | 用户id				| 请求参数	| int 			|

`响应消息`

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "加密后"
}
```

`请求URL`: *http://localhost:6210/2.0/data/manager/database/list?userId=1*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": {
    "dataConfigId": "fusion_data_config_001",
    "connName": "机器维修数据服务器",
    "databases": [
      {
        "databaseName": "mesh_fusion",
        "databaseRemark": "...^_^...",
        "databaseCreateDate": "2016-11-24 11:11:11",
        "tables": [
          {
            "tableMetaData": {
              "tableName": "Student",
              "tableSize": "100M",
              "tableCreateDate": "2016-11-24 11:11:11",
              "tableRemark": null,
              "columns": [
                {
                  "columnName": "name",
                  "columnType": "vachar",
                  "isNull": false,
                  "isPrimaryKey": false,
                  "columnRemark": "姓名"
                }
              ]
            },
            "tableDatas": [
              {
                "name": "zhangsan",
                "stuNum": "001"
              }
            ]
          }
        ]
      }
    ],
    "status": true
  }
}
```

`错误示例` 
`1. 请求错误`
> 缺少参数

```
{
  "code": 10400,
  "msg": "请求错误",
  "data": null
}
```

`2. 服务内部错误`
> 用户的数据配置信息以失效，无法连接数据库

```
{
  "code": 10200,
  "msg": "成功",
  "data": [
    {
      "dataConfigId": "1",
      "connName": "test001",
      "databases": null,
      "status": false
    }
  ]
}
```

> 无权限

```
{
  "code": 10401,
  "msg": "未授权的访问",
  "data": null
}
```

> 用户无数据配置信息

```
{
  "code": 10200,
  "msg": "成功",
  "data": null
}
```

> 内部执行错误

```
{
  "code": 70100,
  "msg": "show databases failed",
  "data": null
}
```


#### 3. 由数据配置信息id获取配置信息
**`GET`** *data/manager/config/list*

`响应 Content Type` : **`application/json;charset=utf-8`**

`参数`

|参数	  		| 示例 			  	| 必/可选  | 说明 					| 参数类型	| 后端数据类型		|
|:-------------:|:-----------------:|:-------:|:-------------------:|:---------:|:-------------:|
|email    		| xiaoming@test.com | 必选 	  | 邮箱地址			    | 请求头参数	| String 	    |
|password       | 123456            | 必选 	  | 用户输入的密码,加密后 	| 请求头参数	| String	    |
|dataConfigId   | 1				    | 必选 	  | 数据配置信息id			| 请求参数	| int 			|

`响应消息`

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "加密后"
}
```

`请求URL`: *http://localhost:6210/2.0/data/manager/config/list?dataConfigId=1*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": {
    "id": 1,
    "type": "sqlserver",
    "connName": "test001",
    "host": "127.0.0.1",
    "port": "3306",
    "username": "root",
    "passwd": "root",
    "userId": 1
  }
}
```

`错误示例` 
`1. 请求错误`
> 缺少参数

```
{
  "code": 10400,
  "msg": "请求错误",
  "data": null
}
```

`2. 服务内部错误`
> 无权限

```
{
  "code": 10401,
  "msg": "未授权的访问",
  "data": null
}
```

> 配置信息id不存在

```
{
  "code": 10200,
  "msg": "成功",
  "data": null
}
```

> 连接数据库错误

```
{
  "code": 70105,
  "msg": "failed to connect database",
  "data": null
}
```

> 内部执行错误

```
{
  "code": 70101,
  "msg": "show tables failed",
  "data": null
}
```

### 数据仓库管理

#### 4. 获取工作空间列表
**`GET`** */workspaces/list_for_repo*

`响应 Content Type` : **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|

`响应消息`

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/workspaces/list_for_repo*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": [
    {
      "workspaceId": "biz_wp_1",
      "name": "工作空间1",
      "description": "test no.1",
      "createTime": "2016-11-12 09:54:00"
    },
    {
      "workspaceId": "biz_wp_2",
      "name": "workspace2",
      "description": "test no.2",
      "createTime": "2016-11-12 09:55:00"
    },
    {
      "workspaceId": "te",
      "name": "te",
      "description": "te",
      "createTime": "2016-11-11"
    },
    {
      "workspaceId": "test1",
      "name": "test",
      "description": "test",
      "createTime": ""
    }
  ]
}
```

`错误示例`

`1. 请求错误`:

```
{
  "code": 10400,
  "msg": "请求错误:  Missing request header 'userId' for method parameter of type String",
  "data": null
}
```

`2. 访问错误`:
> 用户无权访问该资源

```
{
  "code": 70118,
  "msg": "Authorization Error: Access Denied",
  "data": null
}
```

`3. 服务内部错误`:
> 调用其他服务时出现异常

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

#### 5. 获取数据库列表
> 包括特定工作空间下的数据库信息，前端可根据返回结果生成二级菜单以及展示数据库概括

**`GET`** */workspaces/dbs_for_repo*

`响应 Content Type` : **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|
|workspaceId|biz\_wp\_1|必选|指定工作空间|请求参数|String|

`响应消息`

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/workspaces/dbs_for_repo?workspaceId=biz_wp_1*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": [
    {
      "databaseId": "biz_db_default",
      "name": "default",
      "description": "test 1+1 = ?",
      "createdTime": "",
      "workspaceId": "biz_wp_1"
    }
  ]
}
```

`错误示例`

`1. 请求错误`

```
{
  "code": 10400,
  "msg": "请求错误:  Missing request header 'userId' for method parameter of type String",
  "data": null
}
```

`2. 访问错误`
> 用户无权访问该资源

```
{
  "code": 70118,
  "msg": "Authorization Error: Access Denied",
  "data": null
}
```

`3. 服务内部错误`
> 工作空间不存在

```
{
  "code": 70117,
  "msg": "Internal Error: The given workspace does not exist.",
  "data": null
}
```

> 调用其他服务是发生异常

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

#### 6. 获取数据表列表
> 包括特定数据库下的数据表信息，前端可根据返回结果生成三级菜单以及展示数据表概括

**`GET`** */dbs*

`响应 Content Type`: **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|
|dbUser|hadoop|必选|数据库用户，注意与userId指明的用户区分|请求参数|String|
|dbPassword||可选|数据库密码，默认为default|请求参数|String|
|dbName|default|必选|数据库名|请求参数|String|

`响应消息`

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/dbs?dbName=bihuoke_cms&user=hadoop*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": [
    {
      "tableName": "bhk_browse_company",
      "tableComment": null,
      "tableLocation": null,
      "createTime": "2016-11-21T14:02:09",
      "columns": [],
      "taggingInfo": [],
      "partitionColumns": [],
      "partitionInformation": [],
      "sampleDate": []
    },
    {
      "tableName": "eva",
      "tableComment": " First Test",
      "tableLocation": null,
      "createTime": "2016-12-05T17:08:11",
      "columns": [],
      "taggingInfo": [],
      "partitionColumns": [],
      "partitionInformation": [],
      "sampleDate": []
    },
    {
      "tableName": "eva_a",
      "tableComment": "Third Test",
      "tableLocation": null,
      "createTime": "2016-12-05T17:17:34",
      "columns": [],
      "taggingInfo": [],
      "partitionColumns": [],
      "partitionInformation": [],
      "sampleDate": []
    },
    {
      "tableName": "eva_q",
      "tableComment": "Second Test",
      "tableLocation": null,
      "createTime": "2016-12-05T17:10:18",
      "columns": [],
      "taggingInfo": [],
      "partitionColumns": [],
      "partitionInformation": [],
      "sampleDate": []
    }
  ]
}
```
 
`错误示例`
`1. 请求错误`
> 缺少必要参数或者参数不符合要求

```
{
  "code": 10400,
  "msg": "请求错误:  Required String parameter 'user' is not present",
  "data": null
}
```

`2. 访问错误`:
> `用户无权访问该资源`

```
{
  "code": 70118,
  "msg": "Authorization Error: Access Denied",
  "data": null
}
```

`3. 服务内部错误`:
> 数据库不存在

```
{
  "code": 10500,
  "msg": "服务内部错误：Error while compiling statement: FAILED: SemanticException [Error 10072]: Database does not exist: delt",
  "data": null
}
```

> 无法连接到数据库

```
{
  "code": 70105,
  "msg": "Internal Error: failed to connect database",
  "data": null
}
```


#### 7. 获取表的详细信息
**`GET`** */tables/get*

`响应 Content Type`: **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|
|dbUser|hadoop|必选|数据库用户名|请求参数|String|
|dbPassword||可选|数据库用户密码|请求参数|String|
|dbName|default|必选|数据库名|请求参数|String|
|tableName|eva|必选|表名|请求参数|String|
|limit||可选|返回数据数量， 默认为10|请求参数|int|


`响应消息`

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/tables/get?tableName=eva&dbUser=hadoop&dbName=default*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": {
    "tableName": "eva_q",
    "tableRemark": " eva - rua rua",
    "tableLocation": "hdfs://master:8020/user/hive/warehouse/eva_q",
    "createTime": "2016-12-01T15:39:15",
    "columns": [
      {
        "columnName": "id",
        "dataType": "INT",
        "comment": "id@test",
        "value": null
      },
      {
        "columnName": "name",
        "dataType": "STRING",
        "comment": "",
        "value": null
      },
      {
        "columnName": "email",
        "dataType": "STRING",
        "comment": "email address",
        "value": null
      }
    ],
    "taggingInfo": [
      {
        "id": 142,
        "tableId": "biz_table_eva_q_default",
        "field": "id",
        "type": "INT",
        "allowNull": 0,
        "defaultV": "",
        "extra": "",
        "comment": "id@test",
        "srcField": "uid",
        "onException": "ABORT_AND_KEEP_DATA"
      },
      {
        "id": 143,
        "tableId": "biz_table_eva_q_default",
        "field": "name",
        "type": "STRING",
        "allowNull": 1,
        "defaultV": "",
        "extra": "",
        "comment": "",
        "srcField": "uname",
        "onException": "ABORT_AND_KEEP_DATA"
      },
      {
        "id": 144,
        "tableId": "biz_table_eva_q_default",
        "field": "email",
        "type": "STRING",
        "allowNull": 1,
        "defaultV": "",
        "extra": "",
        "comment": "email address",
        "srcField": "umail",
        "onException": "ABORT_AND_KEEP_DATA"
      }
    ],
    "partitionColumns": [
      {
        "columnName": "dt",
        "dataType": "STRING",
        "comment": "",
        "value": null
      }
    ],
    "partitionInformation": [],
    "sampleDate": []
  }
}
```

`错误示例`
`1. 请求错误`
> 缺少必要参数或者参数不符合要求

```
{
  "code": 10400,
  "msg": "请求错误:  Missing request header 'userId' for method parameter of type String",
  "data": null
}
```

`2. 服务内部错误`
> 数据表不存在

```
{
  "code": 70111,
  "msg": "Internal Error: table does not exists",
  "data": null
}
```

> 无法找到数据表,通常原因是数据表所在的数据库不存在

```
{
  "code": 10500,
  "msg": "服务内部错误: Error while compiling statement: FAILED: SemanticException [Error 10001]: Table not found d.eva_q",
  "data": null
}
```

#### 8. 创建Hive表

**`POST`** */data/tables*

`响应 Content Type`: **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|
|dbUser|hadoop|必选|数据库用户名|请求参数|String|
|dbPassword||可选|数据库用户密码|请求参数|String|
|workspaceName|工作空间1|必选|工作空间名|请求参数|String|
|dbName|default|必选|数据库名|请求参数|String|
|tableName|tableVtwo|必选|新建表名|请求参数|String|
|comment|ruaruarua|可选|说明|请求参数|String|
|columns|如下所示|必选|字段及标记信息|请求参数|String|
|sourceId||必选|数据源id|请求参数|String|
|sourceName||必选|数据源名称|请求参数|String|
|sourceDbName||必选|来自数据源的数据库|请求参数|String|
|sourceTableName||必选|来自数据源的数据表|请求参数|String|
|mappingType||必选|数据源与目标数据表关联类型|请求参数|String|


`columns 示例`

```
{
  "columns": [
  {
    "originalColumnName": "uid",
    "columnName": "id",
    "dataType": "INT",
    "comment": "id@test",
    "allowNull": false,
    "onException": "ABORT_AND_KEEP_DATA"
  },
  {
    "originalColumnName": "ruaname",
    "columnName": "name",
    "dataType": "STRING",
    "comment": "name rua rua rua",
    "allowNull": true,
    "onException": "ABORT_AND_KEEP_DATA"
  },
  {
    "originalColumnName": "testemail",
    "columnName": "email",
    "dataType": "STRING",
    "comment": "email rua rua",
    "allowNull": true,
    "onException": "IGNORE"
  }
  ]
}
```

`响应消息`

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "shixingsheng@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/tables/create*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": null
}
```

`错误示例`
> 调用其他服务是发生异常

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

### 任务配置
#### 9. 获取工作空间列表
**`GET`** */workspaces/list_for_job*

`响应 Content Type` : **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|

`响应消息`

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/workspaces/list_for_job*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": [
    {
      "workspaceId": "biz_wp_1",
      "name": "工作空间1",
      "description": "test no.1",
      "createTime": "2016-11-12 09:54:00"
    },
    {
      "workspaceId": "biz_wp_2",
      "name": "workspace2",
      "description": "test no.2",
      "createTime": "2016-11-12 09:55:00"
    },
    {
      "workspaceId": "te",
      "name": "te",
      "description": "te",
      "createTime": "2016-11-11"
    },
    {
      "workspaceId": "test1",
      "name": "test",
      "description": "test",
      "createTime": ""
    }
  ]
}
```

`错误示例`

`1. 请求错误`:

```
{
  "code": 10400,
  "msg": "请求错误:  Missing request header 'userId' for method parameter of type String",
  "data": null
}
```

`2. 访问错误`:
> 用户无权访问该资源

```
{
  "code": 70118,
  "msg": "Authorization Error: Access Denied",
  "data": null
}
```

`3. 服务内部错误`:
> 调用其他服务时出现异常

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

#### 10. 获取任务空间列表

**`GET`** */workspaces/dbs_for_job*

`响应 Content Type` : **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|
|workspaceId|biz\_wp\_1|必选|指定工作空间|请求参数|String|

`响应消息`

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/workspaces/dbs_for_job?workspaceId=biz_wp_1*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": [
    {
      "databaseId": "biz_db_default",
      "name": "default",
      "description": "test 1+1 = ?",
      "createdTime": "",
      "workspaceId": "biz_wp_1"
    }
  ]
}
```

`错误示例`

`1. 请求错误`

```
{
  "code": 10400,
  "msg": "请求错误:  Missing request header 'userId' for method parameter of type String",
  "data": null
}
```

`2. 访问错误`
> 用户无权访问该资源

```
{
  "code": 70118,
  "msg": "Authorization Error: Access Denied",
  "data": null
}
```

`3. 服务内部错误`
> 工作空间不存在

```
{
  "code": 70117,
  "msg": "Internal Error: The given workspace does not exist.",
  "data": null
}
```

> 调用其他服务是发生异常

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```



#### 11. 获取任务列表
**`GET`** */jobs/list*

`响应 Content Type`: **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|
|databaseId|biz\_db\_default|必选|指定数据库（任务空间）|请求参数|String|
|jobType|tagging|可选|筛选参数，任务类型，默认为ALL。|请求参数|String|
|jobStatus|ACTIVE|可选|筛选参数，任务状态，默认为ALL。ALL、ACTIVE、PAUSED、REMOVED|请求参数|String|

`响应消息`

|HTTP Status Code|Code|Msg|Data|
|:--:|:--:|:--:|:--:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8;",
  "email": "xiaoming@test.com",
  "password": "加密后"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/jobs/list?databaseId=biz_db_default*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": [
    {
      "jobId": "gateway_to_hdfs",
      "jobName": "gateway_to_hdfs",
      "description": "gateway_to_hdfs",
      "jobType": null,
      "status": "ACTIVE",
      "dependency": null,
      "descriptionOfExecutionTime": null,
      "timeOnLastExecution": null,
      "timeOnNextExecution": null,
      "route": null,
      "taggingRule": null,
      "logs": [],
      "updatedTime": "2016-10-02T22:08:37"
    },
    {
      "jobId": "hdfs_to_hive",
      "jobName": "hdfs_to_hive",
      "description": "hdfs_to_hive",
      "jobType": null,
      "status": "ACTIVE",
      "dependency": null,
      "descriptionOfExecutionTime": null,
      "timeOnLastExecution": null,
      "timeOnNextExecution": null,
      "route": null,
      "taggingRule": null,
      "logs": [],
      "updatedTime": "2016-10-02T22:08:37"
    },
    {
      "jobId": "me_job_123",
      "jobName": "123",
      "description": "11",
      "jobType": null,
      "status": "ACTIVE",
      "dependency": null,
      "descriptionOfExecutionTime": null,
      "timeOnLastExecution": null,
      "timeOnNextExecution": null,
      "route": null,
      "taggingRule": null,
      "logs": [],
      "updatedTime": "2016-11-23T19:15:30"
    },
    {
      "jobId": "me_job_12345",
      "jobName": "12345",
      "description": "12",
      "jobType": null,
      "status": "ACTIVE",
      "dependency": null,
      "descriptionOfExecutionTime": null,
      "timeOnLastExecution": null,
      "timeOnNextExecution": null,
      "route": null,
      "taggingRule": null,
      "logs": [],
      "updatedTime": "2016-11-23T19:17:09"
    },
    {
      "jobId": "me_job_3",
      "jobName": "3",
      "description": "2",
      "jobType": null,
      "status": "ACTIVE",
      "dependency": null,
      "descriptionOfExecutionTime": null,
      "timeOnLastExecution": null,
      "timeOnNextExecution": null,
      "route": null,
      "taggingRule": null,
      "logs": [],
      "updatedTime": "2016-11-23T17:37:51"
    },
    {
      "jobId": "me_job_567",
      "jobName": "567",
      "description": "314",
      "jobType": null,
      "status": "ACTIVE",
      "dependency": null,
      "descriptionOfExecutionTime": null,
      "timeOnLastExecution": null,
      "timeOnNextExecution": null,
      "route": null,
      "taggingRule": null,
      "logs": [],
      "updatedTime": "2016-11-25T10:23:24"
    },
    {
      "jobId": "me_job_aa",
      "jobName": "aa",
      "description": "bb",
      "jobType": null,
      "status": "ACTIVE",
      "dependency": null,
      "descriptionOfExecutionTime": null,
      "timeOnLastExecution": null,
      "timeOnNextExecution": null,
      "route": null,
      "taggingRule": null,
      "logs": [],
      "updatedTime": "2016-11-23T13:53:24"
    },
    {
      "jobId": "me_job_dd",
      "jobName": "dd",
      "description": "dd",
      "jobType": null,
      "status": "ACTIVE",
      "dependency": null,
      "descriptionOfExecutionTime": null,
      "timeOnLastExecution": null,
      "timeOnNextExecution": null,
      "route": null,
      "taggingRule": null,
      "logs": [],
      "updatedTime": "2016-11-23T19:54:23"
    },
    {
      "jobId": "me_job_job_ohohoh",
      "jobName": "job_ohohoh",
      "description": "after merge",
      "jobType": null,
      "status": "PAUSED",
      "dependency": null,
      "descriptionOfExecutionTime": null,
      "timeOnLastExecution": null,
      "timeOnNextExecution": null,
      "route": null,
      "taggingRule": null,
      "logs": [],
      "updatedTime": "2016-11-23T12:28:02"
    },
    {
      "jobId": "me_job_reere",
      "jobName": "reere",
      "description": "wer",
      "jobType": null,
      "status": "ACTIVE",
      "dependency": null,
      "descriptionOfExecutionTime": null,
      "timeOnLastExecution": null,
      "timeOnNextExecution": null,
      "route": null,
      "taggingRule": null,
      "logs": [],
      "updatedTime": "2016-11-23T19:29:00"
    },
    {
      "jobId": "me_job_sa",
      "jobName": "sa",
      "description": "sa",
      "jobType": null,
      "status": "ACTIVE",
      "dependency": null,
      "descriptionOfExecutionTime": null,
      "timeOnLastExecution": null,
      "timeOnNextExecution": null,
      "route": null,
      "taggingRule": null,
      "logs": [],
      "updatedTime": "2016-11-23T19:36:05"
    },
    {
      "jobId": "me_job_test",
      "jobName": "test",
      "description": "only",
      "jobType": null,
      "status": "PAUSED",
      "dependency": null,
      "descriptionOfExecutionTime": null,
      "timeOnLastExecution": null,
      "timeOnNextExecution": null,
      "route": null,
      "taggingRule": null,
      "logs": [],
      "updatedTime": "2016-11-22T17:28:05"
    },
    {
      "jobId": "me_job_test1",
      "jobName": "test1",
      "description": "ss",
      "jobType": null,
      "status": "ACTIVE",
      "dependency": null,
      "descriptionOfExecutionTime": null,
      "timeOnLastExecution": null,
      "timeOnNextExecution": null,
      "route": null,
      "taggingRule": null,
      "logs": [],
      "updatedTime": "2016-11-23T19:11:25"
    },
    {
      "jobId": "me_job_test222",
      "jobName": "test222",
      "description": "only",
      "jobType": null,
      "status": "PAUSED",
      "dependency": null,
      "descriptionOfExecutionTime": null,
      "timeOnLastExecution": null,
      "timeOnNextExecution": null,
      "route": null,
      "taggingRule": null,
      "logs": [],
      "updatedTime": "2016-11-23T15:31:14"
    },
    {
      "jobId": "me_job_www",
      "jobName": "www",
      "description": "mmm",
      "jobType": null,
      "status": "PAUSED",
      "dependency": null,
      "descriptionOfExecutionTime": null,
      "timeOnLastExecution": null,
      "timeOnNextExecution": null,
      "route": null,
      "taggingRule": null,
      "logs": [],
      "updatedTime": "2016-11-23T14:15:52"
    },
    {
      "jobId": "me_job_wwwwwwwww",
      "jobName": "wwwwwwwww",
      "description": "wwwwwwwwwwwwwww",
      "jobType": null,
      "status": "ACTIVE",
      "dependency": null,
      "descriptionOfExecutionTime": null,
      "timeOnLastExecution": null,
      "timeOnNextExecution": null,
      "route": null,
      "taggingRule": null,
      "logs": [],
      "updatedTime": "2016-11-23T18:21:54"
    },
    {
      "jobId": "me_job_xxx",
      "jobName": "xxx",
      "description": "xxx",
      "jobType": null,
      "status": "ACTIVE",
      "dependency": null,
      "descriptionOfExecutionTime": null,
      "timeOnLastExecution": null,
      "timeOnNextExecution": null,
      "route": null,
      "taggingRule": null,
      "logs": [],
      "updatedTime": "2016-11-23T18:30:21"
    },
    {
      "jobId": "uploader_to_gateway",
      "jobName": "uploader_to_gateway",
      "description": "uploader_to_gateway",
      "jobType": null,
      "status": "ACTIVE",
      "dependency": null,
      "descriptionOfExecutionTime": null,
      "timeOnLastExecution": null,
      "timeOnNextExecution": null,
      "route": null,
      "taggingRule": null,
      "logs": [],
      "updatedTime": "2016-10-02T22:08:37"
    }
  ]
}
```

`错误示例`

`1. 请求错误`
> 缺少必要参数或者参数不符合要求

```
{
  "code": 10400,
  "msg": "请求错误: 缺少以下参数 -> databaseId",
  "data": null
}
```

`2. 服务内部错误:`
> 调用其他服务是发生异常

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

#### 12. 获取任务详情
**`GET`** *jobs/get*

`响应 Content Type`: **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|jobId|uploader\_to\_gateway|必选|指定任务|路径参数|String|

`响应消息`

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求URL`: *http://192.168.2.48:6210/2.0/jobs/get?jobId=uploader_to_gateway*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data":{
    "jobName":"任务111",
    "description":"这是任务111",
    "lastTime":"2016-11-11",
    "nextTime":"2016-12-12",
    "path":"从电商数据网关的数据库1表1到hive中的数据库2表2",
    "dependence":"",
    "executeTime":"",
    "rule":"",
    "log":["2016-11-12,执行成功","2016-11-11,执行成功","2016-11-10,执行成功"]
  }
}
```

`错误示例`
`1. 请求错误`
> 缺少必要参数或者参数不符合要求

```
{
  "code": 10400,
  "msg": "请求错误: 缺少以下参数 -> jobId",
  "data": null
}
```

`2. 服务内部错误:`
> 调用其他服务是发生异常

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

#### 13. 新建任务
**`POST`** */jobs/create*

`响应 Content Type`: **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|
|jobName|new\_job|必选|新建任务名|请求参数|String|
|jobComment|rua!|可选|任务备注|请求参数|String|
|workspaceId|biz\_wp\_1|必选|指定工作空间|请求参数|String|
|databaseName|default|必选|指定数据库|请求参数|String|
|tableName|dotest|必选|关联的Hive表|请求参数|String|
|dependency||可选|指定依赖任务及依赖条件，格式为合法的Json String|请求参数|String|
|toStop|20h|必选|h表示小时，d表示天|请求参数|String|
|toWarn|10h|必选|h表示小时，d表示天|请求参数|String|

`dependency示例`

```
{
  "dependencies": [
  {
    "jobId": "rua",
    "jobName": "haha",
    "dependencyType": "MUST_SUCCESS"
  },
  {
    "jobId": "test2",
    "jobName": "wawawa",
    "dependencyType": "COULD_FINISH_WITH_ERRORS"
  },
  {
    "jobId": "test3",
    "jobName": "dudududu",
    "dependencyType": "COULD_FINISH_WITH_ERRORS"
  }]
}
```

`响应消息` 

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8;",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/jobs/create*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": null
}
```

`错误示例`
`1. 请求错误`
> 缺少必要参数或者参数不符合要求

```
{
  "code": 10400,
  "msg": "请求错误: 缺少以下参数 -> ",
  "data": null
}
```

`2. 服务内部错误:`
> 调用其他服务是发生异常

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

#### 14. 任务的启动、停止
**`POST`** */jobs/ops*

`响应 Content Type`: **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|
|jobId|me\_job\_123|必选|指定要操作的任务|请求参数|String|
|op|stop|必选|stop、resume 二选一|请求参数|String|

`响应消息`

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8;",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/jobs/ops?jobId=me_job_123&op=stop*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": null
}
```

`错误示例`
`1. 请求错误`
> 缺少必要参数或者参数不符合要求

```
{
  "code": 10400,
  "msg": "请求错误: 缺少以下参数 -> ",
  "data": null
}
```

`2. 服务内部错误`
> 调用其他服务是发生异常 

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

#### 15. 更新任务
**`PUT`** */jobs/update*

`响应 Content Type`: **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|
|jobName|new\_job|必选|新建任务名|请求参数|String|
|jobComment|rua!|可选|任务备注|请求参数|String|
|workspaceId|biz\_wp\_1|必选|指定工作空间|请求参数|String|
|databaseName|default|必选|指定数据库|请求参数|String|
|tableName|dotest|必选|关联的Hive表|请求参数|String|
|dependency||可选|指定依赖任务及依赖条件，格式为合法的Json String|请求参数|String|
|toStop|20h|必选|h表示小时，d表示天|请求参数|String|
|toWarn|10h|必选|h表示小时，d表示天|请求参数|String|

`响应消息`

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8;",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/jobs/update*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": null
}
```

`错误示例`

`1. 请求错误`
> 缺少必要参数或者参数不符合要求

```
{
  "code": 10400,
  "msg": "请求错误: 缺少以下参数 -> ",
  "data": null
}
```

`2. 服务内部错误:`
> 调用其他服务是发生异常 

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

#### 16. 删除任务
**`DELETE`** */jobs/delete*

`响应 Content Type`: **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码,加密后|请求头参数|String|
|jobId|me\_job\_123|必选|指定要操作的任务|请求参数|String|

`响应消息`

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8;",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/jobs/delete?jobId=me_job_123*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": null
}
```

`错误示例`

`1. 请求错误`：
> 缺少必要参数或者参数不符合要求

```
{
  "code": 10400,
  "msg": "请求错误: 缺少以下参数 -> jobId",
  "data": null
}
```

`2. 服务内部错误`
> 调用其他服务是发生异常 

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

#### 17. 获取任务调度的初始化数据
**`GET`** */job_config*

`响应 Content Type` : **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码,加密后|请求头参数|String|

`响应消息`

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "加密后"
}
```

`请求URL`: *http://192.168.2.48:6210/me/backend/job_config?jobId=id123*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data":{
    "jobId":"id123",
    "startDate":"2016-10-10",
    "stopDate":"2016-11-11",
    "cron":"[
      {"dayOfWeek":"0,1,6","dayOfMonth":"","startTime":"02:10"}
      {"dayOfWeek":"0,1,6","dayOfMonth":"","startTime":"02:10"}
      {"dayOfWeek":"0,1,6","dayOfMonth":"","startTime":"02:10"}
    ]"
  }
}
```

`错误示例`
`1. 服务内部错误`

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

#### 18. 保存配置的任务调度数据

**`PUT`** */job_config*

`响应 Content Type` : **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码,加密后|请求头参数|String|
| jobId |me\_job\_123|  必选 | 任务的id|请求参数|String|
| startDate |2016-1-1|  必选 | 开始日期 |请求参数|String|
| stopDate |2016-2-2|  必选 | 结束日期 |请求参数|String|  
| dayOfWeek |1,3,7|  必选  | 每周的哪几天（用","分割） |请求参数|String|
| dayOfMonth |1,22,25|  必选  | 每月的哪几天（用"，"分割）|请求参数|String|
| atHour |02|  必选   | 开始时间的小时数字 |请求参数|Integer|
| atMinute |10|  必选  | 开始时间的分钟数字 |请求参数|Integer|

`响应消息`

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "加密后"
}
```

`请求URL`: *http://192.168.1.55:6210/me/backend/job_config?jobId=id123&startDate=2016-10-10&stopDate=2016-11-11&dayOfWeek=0,1,6&dayOfMonth=11,12,13,22&atHour=02&atMinute=10*
 
`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": []
}
```

`1.内部错误`

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```


## 资源管理

#### 19. 获取机器列表

**`GET`** */machines*

`响应 Content Type` : **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码,加密后|请求头参数|String|
|managingStatus|all|必选|管理状态|请求参数|String|
|runningStatus|all|必选|运行状态|请求参数|String|

`响应消息`

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "加密后"
}
```

`请求URL`: *http://192.168.1.55:6210/me/backend/machines?managingStatus＝ALL&runningStatus=ALL*
 
`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": [
    {
      "id": "biz_wp_1",
      "name": "机器1",
      "IP":"192.168.22.22",
      "port":3306,
      "character":"上传器",    
      "managingStatus":"ACTIVE",
      "runningStatus":"FINISHED"
    },
    {
      "id": "biz_wp_1",
      "name": "机器2",
      "IP":"192.168.22.22",
      "port":3306,
      "character":"上传器",
      "managingStatus":"ACTIVE",
      "runningStatus":"FINISHED"
    },
    {
      "id": "biz_wp_1",
      "name": "机器3",
      "IP":"192.168.22.22",
      "port":3306,
      "character":"上传器",
      "managingStatus":"ACTIVE",
      "runningStatus":"FINISHED"
    }
  ]
}
```

`1.内部错误`

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

#### 20. 添加机器

**`POST`** */machines*

`响应 Content Type` : **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码,加密后|请求头参数|String|
|name|上传器1号|必选|机器名字|请求参数|String|
|IP|192.168.2.2|必选|机器ip|请求参数|String|
|character|上传器|必选|机器角色|请求参数|String|

`响应消息`

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "加密后"
}
```

`请求URL`: *http://192.168.1.55:6210/me/backend/machines?name=aaa&IP=1.1.1.1&character=1*
 
`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": []
}
```


`1.内部错误`

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

#### 21. 改变机状态（上线、下线、维护、移除）

**`POST`** */machines*

`响应 Content Type` : **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码,加密后|请求头参数|String|
| machineId |machine123|  必选  | 任务id|请求参数|String|
| operation |offline| 必选 | 想要改变成的状态:online,offline,maintenance,removed|请求参数|String|
 
`响应消息`

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "加密后"
}
```

`请求URL`: *http://192.168.1.55:6210/me/backend/machines?machineId=job1&status=offline*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": []
}
```

`错误示例`

1.内部错误：

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

<<<<<<< HEAD
2.上线操作错误，当JobTracker未注册时

```
{
  "code": 20101,
  "msg": "jobtracker not exist",
  "data": null
}
```

3.下线操作错误，当JobTracker不能下线时

```
{
  "code": 20100,
  "msg": "jobtracker status can not be changed as required",
  "data": null
}
```

4.移除操作错误，当JobTracker不存在或已经删除时

```
{
  "code": 20101,
  "msg": "jobtracker not exist",
  "data": null
}
```

5.维护操作错误，当JobTracker不存在或已经删除时
  
  ```
  {
    "code": 20101,
    "msg": "jobtracker not exist",
    "data": null
  }
  ```

## 监控统计

### 任务统计信息
> 统计信息包括上传统计信息、数据库统计信息和工作空间统计信息

#### 22. 获取任务总体统计
> 目前总体统计指的是累计上传统计

**`GET`** */monitors/job_info*

`响应 Content Type` : **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|

`响应消息`

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/monitors/job_info*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": [
    {
      "workspaceName": "总计",
      "num_of_job": "140",
      "data_size": "90(G)",
    },
    {
      "workspaceName": "工作空间1",
      "num_of_job": "120",
      "data_size": "80(G)",
    },
    {
      "workspaceName": "工作空间2",
      "num_of_job": "20",
      "data_size": "10(G)",
    }
  ]
}
```

`错误示例`

`1. 服务内部错误`
> 调用其他服务时出现异常

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```


#### 23. 获取数据库统计信息
> 统计信息包括数据库以及数据表的数量

**`GET`** */monitors/dbs*

`响应  Content Type` : **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|

`响应消息`

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/monitors/dbs*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": [
    {
      "workspaceName": "总计",
      "numOfDB": 2,
      "numOfTable": 4
    },
    {
      "workspaceName": "工作空间1",
      "numOfDB": 1,
      "numOfTable": 4
    },
    {
      "workspaceName": "workspace2",
      "numOfDB": 1,
      "numOfTable": 0
    },
    {
      "workspaceName": "te",
      "numOfDB": 0,
      "numOfTable": 0
    },
    {
      "workspaceName": "test",
      "numOfDB": 0,
      "numOfTable": 0
    }
  ]
}
```

`错误示例`

`1. 服务内部错误` 
> 调用其他服务时出现异常

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

#### 24. 获取工作空间统计信息
> 工作空间统计信息包括各个工作空间的任务执行数量。该接口可通过任务时间返回相应的统计信息

**`GET`** */monitors/workspaces*

`响应 Content Type` : **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|
|workspaceId||可选|指定工作空间，默认为空，即返回全部工作空间监控统计|请求参数|String|
|time|12|可选|有效的过去N小时的任务执行情况，默认为12|请求参数|String|

`响应消息`

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`： *http://192.168.2.48:6210/2.0/monitors/workspaces?time=24h*

`返回示例`
> 当给定workspaceId参数后，只返回该工作空间统计信息 

```
{
  "code": 10200,
  "msg": "成功",
  "data": [
    {
      "workspaceId": "biz_wp_1",
      "workspaceName": "工作空间1",
      "numOfStoppedJob": 88,
      "numOfFailedJob": 123,
      "numOfWarningJob": 66,
      "numOfFinishedJob": 12
    },
    {
      "workspaceId": "biz_wp_2",
      "workspaceName": "工作空间1",
      "numOfStoppedJob": 88,
      "numOfFailedJob": 12,
      "numOfWarningJob": 53,
      "numOfFinishedJob": 12
    }
  ]
}
```

`错误示例`

`1. 服务内部错误`
> 调用其他服务时出现异常

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

### 任务监控详情
> 返回任务列表，可按工作空间和任务状态筛选。同时提供日志查询、警报消除操作

#### 25. 获取任务监控统计详情

**`GET`** */monitors/job_details*

`响应 Content Type`: **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|
|workspaceId|biz\_wp\_1|可选|指定工作空间， 默认为空 即返回所有工作空间的任务详情|请求参数|String|
|status|stopped|可选|指定任务状态， 默认为空 即返回所有状态的任务详情。状态参数为以下4种之一：running/stopped//warn/error|请求参数|String|
|page|1|必选|当前页|请求参数|int|
|perpage||可选|每页显示数量，默认为10|请求参数|int|

`响应消息`

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/monitors/job_details?workspace=biz_wp_1&status=stopped*

`返回示例`

```
{
    "code": 10200,
    "msg": "成功",
    "data": {
        "currPage": 1,
        "perPage": 5,
        "nextPage": false,
        "maxPages": 0,
        "totalPage": 2,
        "extraTotalHits": 0,
        "totalHits": 6,
        "data": [
            {
                "workspace_name": "工作空间1",
                "workspace_id": "xxxx-xxxx-xxxx-xx01",
                "job_name":"任务1",
                "job_id":"job-01",
                "job_status":"运行",
                "job_log_path": "/var/log/job-01.log",
                "last_exec_time": 1304949493431,
                "job_uptime ": 38
            },
            {
                "workspace_name": "工作空间2",
                "workspace_id": "xxxx-xxxx-xxxx-xx02",
                "job_name":"任务2",
                "job_id":"job-02",
                "job_status":"运行",
                "job_log_path": "/var/log/job-02.log",
                "last_exec_time": 1304949493431,
                "job_uptime ": 38
            },
            {
                "workspace_name": "工作空间3",
                "workspace_id": "xxxx-xxxx-xxxx-xx03",
                "job_name":"任务3",
                "job_id":"job-03",
                "job_status":"运行",
                "job_log_path": "/var/log/job-03.log",
                "last_exec_time": 1304949493431,
                "job_uptime ": 38
            }
        ]
    }
}
```

`错误示例`

`1. 服务内部错误`
> 调用其他服务时出现异常

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

#### 26. 任务日志查询
**`GET`** */monitors/logs*

`响应 Content Type`: **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|
|path|test\_path|必选|指定日志路径|请求参数|String|

`响应消息`

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/monitors/logs?path=test_path*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": [
    {
      "time": "18:04:30",
      "log": "me_job_testjob: running."
    },
    {
      "time": "18:06:30",
      "log": "me_job_testjob: stopped."
    }
  ]
}
```

`错误示例`

`1. 请求错误`
> 缺少必要参数或者参数不符合要求

```
{
  "code": 10400,
  "msg": "请求错误: 缺少以下参数 -> jobId",
  "data": null
}
```

`2. 服务内部错误`
> 调用其他服务是发生异常

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

#### 27. 撤销警报
**`POST`** */monitors/warning*

`响应 Content Type`: **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|
|jogId|me\_job\_testjob|必选|指定任务|路径参数|String|
|operation|remove|必选|指定操作指令，这里必须为remove，不区分大小写|请求参数|String|

`响应消息`

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/monitors/warning?jobId=me_job_testjob&operation=remove*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": null
}
```

`错误示例`
`1. 请求错误`
> 缺少必要参数或者参数不符合要求

```
{
  "code": 10400,
  "msg": "请求错误: 缺少以下参数 -> operation",
  "data": null
}
```

`2. 服务内部错误`
> 调用其他服务是发生异常 

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

### 系统监控

#### 28. 获取角色统计信息
**`GET`** */monitors/machines*

`响应 Content Type`: **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|

`响应消息`

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/monitors/machines*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": [
    {
      "role": "uploader",
      "numOfMachines": 30,
      "numOfTotalJobs": 140,
      "numOfCPUs": 30,
      "statusMap": {
        "normal": 29,
        "warning": 1
      }
    },
    {
      "role": "collector",
      "numOfMachines": 15,
      "numOfTotalJobs": 140,
      "numOfCPUs": 15,
      "statusMap": {
        "normal": 15,
        "warning": 0
      }
    }
  ]
}
```

`错误示例`
`1. 服务内部错误`
> 调用其他服务是发生异常 

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

### 机器状态统计

#### 29. 获取机器详情信息 
**`GET`** */monitors/machine_details*

`响应 Content Type`: **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|

`响应消息`

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/monitors/machine_details*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": [
    {
      "name": "upload1",
      "role": "uploader",
      "ipAddress": "192.168.1.128",
      "numOfJobs": 20,
      "usageOfResource": "CPU:80%, 内存:4.5GB/8GB, 硬盘: 400GB/2TB",
      "heartBeat": "正常 （最近汇报 6-7 18：10：11）"
    },
    {
      "name": "upload2",
      "role": "uploader",
      "ipAddress": "192.168.1.129",
      "numOfJobs": 30,
      "usageOfResource": "CPU:70%, 内存:4.5GB/8GB, 硬盘: 400GB/2TB",
      "heartBeat": "正常 （最近汇报 6-8 18：10：11）"
    }
  ]
}
```

`错误示例`

`1. 服务内部错误`
> 调用其他服务是发生异常

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

#### 30. 获取任务列表及详情信息
**`GET`** */monitors/job_list*

`响应 Content Type`: **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|

`响应消息` 

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/me/backend/monitors/job_list*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": [
    {
      "jobName": "任务1",
      "jobType": "上传",
      "status": "running",
      "dependency": "任务4、任务7",
      "executeTime": "定时1 定时2"
    },
    {
      "jobName": "任务2",
      "jobType": "collector",
      "status": "failed",
      "dependency": "任务1",
      "executeTime": "定时1 定时2"
    },
    {
      "jobName": "任务3",
      "jobType": "uploader",
      "status": "running",
      "dependency": "任务7",
      "executeTime": "定时1 定时2"
    },
    {
      "jobName": "任务1",
      "jobType": "上传",
      "status": "stopped",
      "dependency": "任务1",
      "executeTime": "定时2"
    }
  ]
}
```

`错误示例`
`1. 服务内部错误`
> 调用其他服务是发生异常 

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

## 权限管理

### 用户

#### 31. 获取用户列表 

**`GET`** */user_list*

`响应 Content Type`: **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|

`响应消息` 

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/user_list*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": [
    {
      "userName": "张山",
      "role": "五矿-管理员",
      "creator": "小明",
      "createTime": "2016-10-11"
    },
    {
      "userName": "张山",
      "role": "五矿-管理员",
      "creator": "小明",
      "createTime": "2016-10-11"
    },
    {
      "userName": "张山",
      "role": "五矿-管理员",
      "creator": "小明",
      "createTime": "2016-10-11"
    }
  ]
}
```

`错误示例`
`1. 服务内部错误`
> 调用其他服务是发生异常 

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

#### 32. 添加新用户
**`POST`** */users/create*

`响应 Content Type`: **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|
|userName|xiaogang|必选|姓名|请求参数|String|
|roleId||必选|角色id|请求参数|String|
|newEmail||必选|邮箱地址|请求参数|String|
|phone||可选|手机号|请求参数|String|

`响应消息` 

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/users/create*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": null
}
```

`错误示例`
`1. 服务内部错误`
> 调用其他服务是发生异常 

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

#### 33. 修改用户
**`PUT`** */users/update*

`响应 Content Type`: **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|
|userName|xiaogang|必选|姓名|请求参数|String|
|roleId||必选|角色id|请求参数|String|
|newEmail||必选|邮箱地址|请求参数|String|
|phone||可选|手机号|请求参数|String|
|newPassword||必选|是否生成新密码|请求参数|boolean|

`响应消息` 

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/users/update*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": null
}
```

`错误示例`
`1. 服务内部错误`
> 调用其他服务是发生异常 

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

### 角色

#### 34. 获取角色列表 

**`GET`** */role_list*

`响应 Content Type`: **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|

`响应消息` 

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/role_list*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": [
    {
      "roleName": "五矿-管理员",
      "creator": "小明",
      "createTime": "2016-10-11"
    },
    {
      "roleName": "五矿-管理员",
      "creator": "小明",
      "createTime": "2016-10-11"
    },
    {
      "roleName": "五矿-管理员",
      "creator": "小明",
      "createTime": "2016-10-11"
    }
  ]
}
```

`错误示例`
`1. 服务内部错误`
> 调用其他服务是发生异常 

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

#### 35. 获取权限模板列表
**`GET`** */template_list*

`响应 Content Type`: **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|

`响应消息` 

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/template_list*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": [
    {
      "template_id": 342,
      "template_name": "模板1"
    },
    {
      "template_id": 3421,
      "template_name": "模板2"
    },
    {
      "template_id": 123,
      "template_name": "模板3"
    }
  ]
}
```

`错误示例`
`1. 服务内部错误`
> 调用其他服务是发生异常 

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```


#### 36. 获取权限模板信息
**`GET`** */templates/get*

`响应 Content Type`: **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|
|templateId||必选|权限模板id|请求参数|String|

`响应消息` 

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/templates/get*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": [
      ]
}
```

`错误示例`
`1. 服务内部错误`
> 调用其他服务是发生异常 

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```


#### 37. 添加权限模板
**`POST`** */templates/create*

`响应 Content Type`: **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|
|templateName||必选|权限模板名|请求参数|String|
|funcPrivilege||必选|页面与功能权限|请求参数|String|
|dataPrivilege||必选|数据权限|请求参数|String|

`响应消息` 

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/templates/create*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": null
}
```

`错误示例`
`1. 服务内部错误`
> 调用其他服务是发生异常 

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

#### 38. 修改权限模板
**`PUT`** */tempaltes/update*

`响应 Content Type`: **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|
|templateName||必选|权限模板名|请求参数|String|
|templateId||可选|所要修改的权限模板id|请求参数|String|
|funcPrivilege||可选|页面与功能权限|请求参数|String|
|dataPrivilege||可选|数据权限|请求参数|String|

`响应消息` 

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/templates/update*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": null
}
```

`错误示例`
`1. 服务内部错误`
> 调用其他服务是发生异常 

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```


#### 39. 添加新用户
**`POST`** */roles/create*

`响应 Content Type`: **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|
|roleName|xiaogang|必选|角色名|请求参数|String|
|templateId||可选|权限模板id。若为空，则funcPrivilege与dataPrivilege必选|请求参数|String|
|funcPrivilege||可选|页面与功能权限|请求参数|String|
|dataPrivilege||可选|数据权限|请求参数|String|

`响应消息` 

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/roles/create*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": null
}
```

`错误示例`
`1. 服务内部错误`
> 调用其他服务是发生异常 

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

#### 40. 修改用户
**`PUT`** */roles/update*

`响应 Content Type`: **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|
|roleId||必选|所要修改的角色id|请求参数|String|
|roleName|xiaogang|必选|角色名|请求参数|String|
|templateId||可选|权限模板id。若为空，则funcPrivilege与dataPrivilege必选|请求参数|String|
|funcPrivilege||可选|页面与功能权限|请求参数|String|
|dataPrivilege||可选|数据权限|请求参数|String|

`响应消息` 

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/roles/update*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": null
}
```

`错误示例`
`1. 服务内部错误`
> 调用其他服务是发生异常 

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

### 日志

#### 41. 获取权限日志
**`GET`** */auth/logs*

`响应 Content Type`: **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|
|opType||可选|NEW/MODIFY/REMOVE/ALL 默认为ALL|请求参数|String|
|page|1|必选|当前页|请求参数|int|
|perpage||可选|每页显示数量，默认为10|请求参数|int|

`响应消息` 

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/auth/logs*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": {
    "currPage": 1,
    "perPage": 5,
    "nextPage": false,
    "maxPages": 0,
    "totalPage": 2,
    "extraTotalHits": 0,
    "totalHits": 6,
    "data": [
      {
        "log_id": 342,
        "operation_type": "NEW",
        "content": "testtestsetst",
        "operator": "小智",
        "time": "2016-12-12"
      },
      {
        "log_id": 342,
        "operation_type": "NEW",
        "content": "testtestsetst",
        "operator": "小智",
        "time": "2016-12-12"
      },
      {
        "log_id": 342,
        "operation_type": "NEW",
        "content": "testtestsetst",
        "operator": "小智",
        "time": "2016-12-12"
      }
    ]
  }
}
```

`错误示例`
`1. 服务内部错误`
> 调用其他服务是发生异常 

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

### 登录

#### 42. 用户登录
**`POST`** */signin*

`响应 Content Type`: **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|

`响应消息` 

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/signin*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": {
    "user_id": "fds",
    "user_name": "小智",
    "role": "数据分析师",
    "email": "xiaozhi@test.com",
    "phone": "12332101234"
  }
}
```

`错误示例`
`1. 服务内部错误`
> 调用其他服务是发生异常 

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```

#### 43. 修改密码
**`POST`** */users/change_pwd*

`响应 Content Type`: **`application/json;charset=utf-8`**

`参数`

|参数|示例|必/可选|说明|参数类型|后端数据类型|
|:---:|:---:|:---:|:---:|:---:|:---:|
|email|xiaoming@test.com|必选|邮箱地址|请求头参数|String|
|password||必选|用户输入的密码|请求头参数|String|
|new_password||必选|新密码|请求参数|String|

`响应消息` 

|HTTP Status Code|Code|Msg|Data|
|:---:|:---:|:---:|:---:|
|200|系统自定义|相应描述|返回结果|
|400|10400|请求错误|null|

`请求头示例`

```
{
  "Accept": "application/json;charset=utf-8",
  "email": "xiaoming@test.com",
  "password": "xiaohong"
}
```

`请求URL`: *http://192.168.2.48:6210/2.0/users/change_pwd*

`返回示例`

```
{
  "code": 10200,
  "msg": "成功",
  "data": null
```

`错误示例`
`1. 服务内部错误`
> 调用其他服务是发生异常 

```
{
  "code": 10500,
  "msg": "服务内部错误",
  "data": null
}
```



