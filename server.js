// 引入依赖
const express = require('express');
const utility = require('utility');
const request = require('request');
// 引入json解析中间件
const bodyParser = require('body-parser');
//引入数据库操作
// var db = require('./db');

const host = 'http://www.hzrtpxt.top';

// 建立 express 实例
const app = express();
// 添加json解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With,SessionId');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By', ' 3.2.1');
  if (req.method == 'OPTIONS') res.send(200);/*让options请求快速返回*/
  else next();
});

app.get('/', function (req, res) {
  // 从 req.query 中取出我们的 q 参数。
  // 如果是 post 传来的 body 数据，则是在 req.body 里面，不过 express 默认不处理 body 中的信息，需要引入 https://github.com/expressjs/body-parser 这个中间件才会处理，这个后面会讲到。
  // 如果分不清什么是 query，什么是 body 的话，那就需要补一下 http 的知识了
  var q = req.query.q;
  console.log(req);
  // 调用 utility.md5 方法，得到 md5 之后的值
  // 之所以使用 utility 这个库来生成 md5 值，其实只是习惯问题。每个人都有自己习惯的技术堆栈，
  // 我刚入职阿里的时候跟着苏千和朴灵混，所以也混到了不少他们的技术堆栈，仅此而已。
  // utility 的 github 地址：https://github.com/node-modules/utility
  // 里面定义了很多常用且比较杂的辅助方法，可以去看看
  var md5Value = utility.md5(q);

  res.send(md5Value);
});
/**
 * 用户列表
 */
// app.get('/userList', function (req, res) {
//   db.getUserList(data => {
//     res.send({
//       code: '200',
//       msg: '请求成功',
//       data: data
//     });
//   });
// });

/**
 * 登录接口
 */
app.get('/login', function (req, res) {
  console.log('login');
  request.post({
    url: host + '/master/login',
    json: true,
    form: {
      userName: 'admin',
      userPassword: '123456'
    }
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let cookie = response.headers['set-cookie'][0];
      let jsessionid = cookie.split(';');
      res.send({
        code: body.errorCode,
        msg: body.operationRes,
        data: {
          sessionid: jsessionid[0]
        }
      });
    }
  });
});
/**
 * 获取参赛选手数据
 * 暂时没有使用
 */
app.post('/getStudentList', function (req, res) {

  request({
    url: host + '/master/Interface/getStudentList?uuid=' + req.body.uuid,
    method: 'POST',
    json: true,
    headers: {
      'cookie': req.headers.sessionid
    }
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send({
        code: 0,
        count: body.count,
        msg: '请求成功',
        data: body.rows
      });
    }
  });
});
/**
 * 获取活动详情
 * 暂时没有使用
 */
app.post('/getActivityInfo', function (req, res) {
  request.post({
    url: host + '/master/Interface/getActiveList',
    json: true,
    headers: {
      'cookie': req.headers.sessionid
    },
    form: {
      activeUuid: req.body.uuid
    }
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send({
        code: 0,
        count: body.count,
        msg: '请求成功',
        data: body.rows
      });
    }
  });
});

/**
 * 访问量
 */
app.post('/pv', function (req, res) {
  request.post({
    url: host + '/master/Interface/watchNumb',
    json: true,
    headers: {
      'cookie': req.headers.sessionid
    },
    form: {
      activeId: req.body.activeId
    }
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send({
        code: 0,
        pv: body,
        msg: '请求成功'
      });
    }
  });
});

/**
 * 获取参赛选手信息和活动信息
 */
app.post('/getStuAndAct', function (req, res) {
  request.post({
    url: host + '/master/Interface/getStudentAndActive',
    json: true,
    headers: {
      'cookie': req.headers.sessionid
    },
    form: {
      activeUuid: req.body.uuid
    }
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send({
        code: 0,
        msg: '请求成功',
        activity: body.sysActiveList,
        student: body.sysStudentList,
        voteNum: body.numb
      });
    }
  });
});

/**
 * 投票
 */
app.post('/vote', function (req, res) {
  //request 请求
  request.post({
    url: host + '/master/Interface/addVote',
    json: true,
    headers: {
      'cookie': req.headers.sessionid
    },
    form: {
      openid: req.body.openId,
      studentid: req.body.studentid
    }
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send({
        code: body.errorCode
      });
    }
  });
});

/**
 * 根据id或名字查询用户
 */
app.post('/search', function (req, res) {
  //request请求
  request.post({
    url: host + '/master/Interface/getStudentByName',
    json: true,
    headers: {
      'cookie': req.headers.sessionid
    },
    form: {
      studentName: req.body.key,
      studentId: req.body.id,
      activeUuid: req.body.uuid
    }
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let rank = '';
      if (response.body.studentRank != null || response.body.studentRank != undefined) {
        rank = response.body.studentRank;
      }
      res.send({
        code: 0,
        msg: '请求成功',
        rank: rank,
        data: body.rows
      });
    }
  });
});

/**
 * 活动报名
 */
app.post('/sign', function (req, res) {
  //request
  request.post({
    url: host + '/master/Interface/addStudent',
    form: {
      studentName: req.body.studentName,
      studentImg: req.body.studentImg,
      studentAge: req.body.studentAge,
      studentContext: req.body.studentContext,
      studentTicket: req.body.studentTicket,
      activeId: req.body.activityId
    },
    headers: {
      'cookie': req.headers.sessionid
    },
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send({
        code: 0,
        msg: '请求成功',
        data: body
      });
    }
  });
});
/**
 * 赠送礼物
 */
app.post('/sendGift', function (req, res) {
  //request 请求
  request.post({
    url: host + '/master/Interface/sendGift',
    json: true,
    headers: {
      'cookie': req.headers.sessionid
    },
    form: {
      accountUsercode: req.body.openId,
      accountAmt: req.body.accountAmt,
      accountGiftid: req.body.accountGiftid,
      accountStudentid: req.body.accountStudentid,
      accountNumb: req.body.accountNumb
    }
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send({
        code: 0,
        msg: '请求成功',
        data: body
      });
    }
  });

});

/**
 * 获取礼物列表
 */
app.get('/getGiftList', function (req, res) {
  request({
    url: host + '/master/Gift/getGiftList',
    method: 'GET',
    headers: {
      'cookie': req.headers.sessionid
    },
    json: true,
  }, function (error, response, body) {
    console.log('statusCode:' + response.statusCode);
    if (!error && response.statusCode == 200) {
      res.send({
        code: 0,
        msg: '请求成功',
        data: body.rows
      });
    }
  });
});

/**
 * 排行榜
 */
app.post('/rank', function (req, res) {
  request.post({
    url: host + '/master/Interface/getRankList',
    json: true,
    headers: {
      'cookie': req.headers.sessionid
    },
    form: {
      activeUuid: req.body.uuid
    }
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send({
        code: 0,
        msg: '请求成功',
        data: body.rankList
      });
    }
  });
});

/**
 * 奖品
 */
app.post('/prize', function (req, res) {
  request.post({
    url: host + '/master/Interface/getPrizeList',
    json: true,
    headers: {
      'cookie': req.headers.sessionid
    },
    form: {
      activeUuid: req.body.uuid
    }
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send({
        code: 0,
        msg: '请求成功',
        data: body.sysPrizes
      });
    }
  });
});

/**
 * 活动图片
 */
app.post('/activityImg', function (req, res) {
  request.post({
    url: host + '/master/Active/getActiveImgList',
    json: true,
    headers: {
      'cookie': req.headers.sessionid
    },
    form: {
      activeName: req.body.activeName
    }
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send({
        code: 0,
        msg: '请求成功',
        data: body.rows
      });
    }
  });
});

/**
 * 获取ticket
 */
app.get('/getTicket', function (req, res) {
  request({
    url: host + '/master/getToken',
    method: 'GET',
    json: true,
    headers: {
      'cookie': sessionId
    }
  }, function (error, response, body) {
    res.send({
      code: 0,
      msg: '请求成功',
      data: body[0]
    });
  });

});

/**
 * 测试启动
 */
app.get('/test', function (req, res) {
  res.send('version:1.8.4 微信登录授权调试启动成功 地址：http://47.100.243.198:3000');
});

app.listen(3000, function (req, res) {
  console.log('app is running at port 3000');
});
