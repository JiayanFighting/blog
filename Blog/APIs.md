## API documentation

### User Module

##### Login:

```
endpoint: /login/secure/aad
http_mode: GET
parameters: 
payload: {}
expected_return: 
{
    "msg": "Success",
    "code": 0,
    "email": "xx@microsoft.com",
    "username":"xxx",
    "access_token":"xxxx",
    "token":"xxx",
}
```

##### Logout:

```
endpoint: /logout
http_mode: GET
parameters: 
payload: {}
expected_return: 
{
    "msg": "Success",
    "code": 0,
}
```

##### Search User:

```
endpoint: /user/search
http_mode: GET
parameters: 
payload: 
{
	content:"jiayan"
}
expected_return: 
{
    "msg": "Success",
    "code": 0
    "list": [
    {
        email:"jiayan@microsoft.com"
        username:"jiayan huang"
    },
    ....
    ]
}
```

### Team Module

##### Get the team list you joined:

```
endpoint: /team/joinedTeamList
http_mode: GET
payload: {}
expected_return:
{
    "msg": "Success",
    "code": 0,
    "joinedList": 
    [{
    "id": 1,
    "teamName": "firstTeam",
    "teamEmail": "t-jiayhu@microsoft",
    "teamDesc": "This is the first team.",
    "leadEmail": "t-jiayhu@microsoft",
    "createTime": "2020-06-10 18:21:03",
    "lastUpdateTime": "2020-06-10 18:32:10",
    "statusCode": 0
    },
    …….]
}
```

##### Get the team list you created:

```
endpoint: /team/createdTeamList
http_mode: GET
payload: {}
expected_return:
{
    "msg": "Success",
    "code": 0,
    "createdList": 
    [{
    "id": 1,
    "teamName": "firstTeam",
    "teamEmail": "t-jiayhu@microsoft",
    "teamDesc": "This is the first team.",
    "leadEmail": "t-jiayhu@microsoft",
    "createTime": "2020-06-10 18:21:03",
    "lastUpdateTime": "2020-06-10 18:32:10",
    "statusCode": 0
    },	
...]
}
```

##### Get the member list of team:

```
endpoint: /team/members
http_mode: GET
payload: {
	teamId:1
}
expected_return:
{
    "msg": "Success",
    "code": 0,
    "members": 
    [{
        email:"jiayan@microsoft.com"
        username:"jiayan huang"
    },
    …….]
}
```

##### Join a team:

```
endpoint: /team/join
http_mode: POST
payload: 
{
    “teamId”: 1,
    “userEmail”:”xxx@microsoft.com” ,// if leader add member, need it. if you join a team, don't need it.
}
expected_return:
{
    “msg”: “Success”,
    “code”:0
}
```

##### Remove member / Leave  from team:

```
endpoint: /team/removeMember
http_mode: POST
payload:
{
    “teamId”: 1,
    “userEmail”:”xxx@microsoft.com”, // if leader remove member, need it. if you leave from the team, don't need it.
}
expected_return:
{
    “msg”: “Success”,
    “code”:0
}
```

##### Create a new team:

```
endpoint:/team/create
http_mode:POST
payload:
{
    "teamName": “demo”,
    "teamEmail" : “xx@microsoft.com”,
    "teamDesc" : “some words”,
}
expected_return:
{
    "msg": “Success”,
    "code": 0,
    "id": 19,  // the team id you created
    "leadEmail":  “xx@microsoft.com”,
}
```

##### Delete the team:

```
endpoint: /team/delete
http_mode: POST
payload:
{
	“teamId”: 1,
}
expected_return:
{
    “msg”: “Success”,
    “code”:0
}
```

##### Update the basic information of the team:

```
endpoint: /team/update
http_mode: POST
payload:
{
    “teamName”: “demo”,
    “teamEmail” : “xx@microsoft.com”,
    “teamDesc” : “some words”,
}
expected_return:
{
    “msg” :”Success”,
    “code” : 0
}
(each payload could be optional)
```

##### Get team information:

```
endpoint: /team/info
http_mode: GET
payload: 
{
	“id”:1
}
expected_return:
{
    "msg": "Success",
    "code": 0,
    "members":
    [{
        "email": "t-jiayhu@microsoft.com",
        "username": "Jiayan Huang"
    },
    ….],
    "info":
    {
        "id": 1,
        "teamName": "firstTeam",
        "teamEmail": "t-jiayhu@microsoft",
        "teamDesc": "This is the first team.",
        "leadEmail": "t-jiayhu@microsoft",
        "createTime": "2020-06-10",
        "lastUpdateTime": "2020-06-10",
        "statusCode": 0
    }
}
```

##### Search the teams besides you joined and created:

```
endpoint: /team/search
http_mode: GET
payload: {
	content:"team"
}
expected_return:
{
    "msg": "Success",
    "code": 0,
    "list": 
    [{
        "id": 1,
        "teamName": "firstTeam",
        "teamEmail": "t-jiayhu@microsoft",
        "teamDesc": "This is the first team.",
        "leadEmail": "t-jiayhu@microsoft",
        "sprint": 1,
        "createTime": "2020-06-10 18:21:03",
        "lastUpdateTime": "2020-06-10 18:32:10",
        "statusCode": 0
    },
    …….]
}
```

#### Sprint Management of Team Module 

##### Get sprint list

```
endpoint: /team/sprint/list
http_mode: GET
payload: {
	teamId:1
}
expected_return:
{
    "msg": "Success",
    "code": 0,
    "list": 
    [{
        "id": 7,
        "teamId": 5,
        "type": "weekly",
        "sprint": 234,
        "beginTime": "2020-07-01 00:00:00",
        "endTime": "2020-07-07 23:59:59",
        "statusCode": 0
    },
    …….]
}
```

##### Create sprint

```
endpoint: /team/sprint/create
http_mode: POST
payload: {
	teamId:1,
	type:"weekly",
	sprint:1,
	beginTime:"2020-07-06",
	endTime:"2020-07-07"
}
expected_return:
{
    "msg": "Success",
    "code": 0
}
```

##### Update sprint

```
endpoint: /team/sprint/update
http_mode: POST
payload: {
	id:1,
	sprint:1, // opt
	beginTime:"2020-07-06",  // opt
	endTime:"2020-07-07"  // opt
}
expected_return:
{
    "msg": "Success",
    "code": 0
}
```

##### Delete sprint

```
endpoint: /team/sprint/delete
http_mode: POST
payload: {
	id:1
}
expected_return:
{
    "msg": "Success",
    "code": 0
}
```

##### Get current sprint

```
endpoint: /team/sprint/current
http_mode: GET
payload: {
	teamId:1
}
expected_return:
{
    "msg": "Success",
    "code": 0,
    "curList": [
        {
            "id": 7,
            "teamId": 5,
            "type": "weekly",
            "sprint": 234,
            "beginTime": "2020-07-01",
            "endTime": "2020-07-07",
            "statusCode": 0
        },
    ......
	]
}
```

### Template Module

```
endpoint: /template

getAllTemplates:
	endpoint:/getAllTemplates
	http_mode:GET
	payload: {}
	expected_return:
	[{
		“template_type”:”daily report”,
		“creator_email”:”demo@microsoft.com”,
		“create_time”: “2020-06-10”,
		“last_update_time”:”2020-06-11”,
	},
	...]

getTemplatesInTeam:
	endpoint:/getTemplatesInTeam
	http_mode: GET
	payload
	{
		"team_id": 1
	}
	expected_return:
	[{
		“templateType”:”daily report”,
		“creatorEmail”:”demo@microsoft.com”,
		“createTime”: “2020-06-10”,
		“updateTime”:”2020-06-11”,
	},
	...]

selectTemplate :
	endpoint: /selectTemplate
	http_mode: GET
	payload: 
	{
		"id": 1
	}
	expected_return:
	{
		“object”: “template”
	}

createTemplate :
	endpoint: /create
	http_mode: POST
	payload: 
	{
		teamId:”1”,
		reportType:”weekly”,
		theme:”old school”,
		content: “Title Title Body”,
		creatorEmail: “create@test.com”,
		createTime: “2020-06-12”,
		updateTime; “2020-06-12”,
	}
	expected_return:
	{
		msg:”success”
	}

updateTemplate :
	endpoint: /template/update
	http_mode: POST
	payload:
	{
		id: “1”,
		teamId:”1”,
		report_type:”weekly”,
		theme:”old school”,
		content: “Title Title Body”,
		creatorEmail: “create@test.com”,
		createTime: “2020-06-12”,
		updateTime; “2020-06-12”,
	}
	expected_return:
	{
		msg:”success”
	}

deleteTemplate:
	endpoint: /template/delete
	http_mode: GET
	payload:
	{
		"id" : 1
	}
	expected_return:
	{
		msg:”success”
	}
```



### Report Module
```
submitReport :
	endpoint: /report/submitReport
	http_mode: POST
	payload: 
	{ 
		"teamId": 1,
		"type": ‘weekly’,
		"userEmail": “xxx@qq.com”,
		"createTime": “2020-06-11 10:00:00”, 
		"updateTime": “2020-06-11 11:00:00”,
		"content":"example report"
	}
	expected_return:
	{
		"msg": "Success",
		"code": 0,
	}

aggregateReports :
	endpoint: /report/aggregate
	http_mode: POST
	payload:
	{ 
		"teamId": 1, // opt
		"type": ‘weekly’, // opt
		"fromEmail": “xxx@qq.com”, // opt
        "toEmail": “xxx@qq.com”, // opt, manager
        "sprint": 1, // opt
		"beginTime": “2020-06-11 10:00:00”, // opt
		"endTime": “2020-06-11 11:00:00”, // opt
		“offset” : 0 // opt ,default 0
		“limit” : 10 //  opt ,default 10
	}
	expected_return:
	{
	"msg": "Success",
	"code": 0,
	"list": 
	[{
		"id": 1,
		"fromEmail": "t-jiayhu@microsoft.com",
        "fromName": "Jiayan Huang",
		"toEmail":  "xxx@microsoft.com",
        "toName": "xxxxxx",
		"teamId": 1,
        "teamName": "xxxxx",
		"type": "weekly",
		"theme": "test",
		"content": "this is a test",
		"createTime": "2020-06-09 16:27:37",
		"updateTime": "2020-06-11 16:37:00",
		"status": 0
	},
	...
	]
	}

sent Reports :
	endpoint: /report/sentList
	http_mode: POST
	payload:
	{ 
		"teamId": 1, // opt
		"type": ‘weekly’, // opt
        "toEmail": “xxx@qq.com”, // opt
		"beginTime": “2020-06-11 10:00:00”, // opt
		"endTime": “2020-06-11 11:00:00”, // opt
		“offset” : 0 // opt ,default 0
		“limit” : 10 //  opt ,default 10
	}
	expected_return:
	{
	"msg": "Success",
	"code": 0,
	"list": 
	[{
		"id": 1,
		"fromEmail": "t-jiayhu@microsoft.com",
        "fromName": "Jiayan Huang",
		"toEmail":  "xxx@microsoft.com",
        "toName": "xxxxxx",
		"teamId": 1,
        "teamName": "xxxxx",
		"type": "weekly",
		"theme": "test",
		"content": "this is a test",
		"createTime": "2020-06-09 16:27:37",
		"updateTime": "2020-06-11 16:37:00",
		"status": 0
	},
	...
	]
	}

received Reports :
	endpoint: /report/receivedList
	http_mode: POST
	payload:
	{ 
		"teamId": 1, // opt
		"type": ‘weekly’, // opt
		"fromEmail": “xxx@qq.com”, // opt
		"beginTime": “2020-06-11 10:00:00”, // opt
		"endTime": “2020-06-11 11:00:00”, // opt
		“offset” : 0 // opt ,default 0
		“limit” : 10 //  opt ,default 10
	}
	expected_return:
	{
	"msg": "Success",
	"code": 0,
	"list": 
	[{
		"id": 1,
		"fromEmail": "t-jiayhu@microsoft.com",
        "fromName": "Jiayan Huang",
		"toEmail":  "xxx@microsoft.com",
        "toName": "xxxxxx",
		"teamId": 1,
        "teamName": "xxxxx",
		"type": "weekly",
		"theme": "test",
		"content": "this is a test",
		"createTime": "2020-06-09 16:27:37",
		"updateTime": "2020-06-11 16:37:00",
		"status": 0
	},
	...
	]
	}

sendEmail :
	endpoint: /report/sendEmail
	http_mode: POST
	payload: 
	{ 
		"from": "yixuan.zhang@d.net",
		"to": "to@qq.com",
		"subject": “coffee",
		"cc": “cc@qq.com”, 
		"content": “want to grab some coffee”,
	}
	expected_return:
	{
		"msg": "Success",
		"code": 0,
	}
	
getRemindAll :
	endpoint: /report/getRemindAll
	http_mode: POST
	payload: 
	{
            type: undefined, // opt
            fromEmail: undefined, // opt
            toEmail: this.props.userInfo.email, // opt , if no userEmail ,required
            beginTime: this.getTimeStrByDate(new Date(today - SevenDays)), // opt
            endTime: this.getTimeStrByDate(today), // opt
            offset : 0, // opt ,default 0
            limit : 10 //  opt ,default 10
        };
	expected_return:
	{msg: "Success", code: 0, peopleToRemind: Array(1)}

```





