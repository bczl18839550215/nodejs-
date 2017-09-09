var express = require('express');
var router = express.Router();
var mongodb=require('mongodb').MongoClient;
var db_str="mongodb://127.0.0.1:27017/userinfo"
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {user: req.session.username});
});
//登录
router.get('/login', function(req, res) {
  res.render('login',{});
});
//注册
router.get('/register', function(req, res) {
  res.render('register',{});
});

//退出

router.get('/relogin',function(req,res){
	//销毁session
	req.session.destroy(function(err){
		if(err){
			console.log(err);
		}else{
			//重定向
			res.redirect('/')
		}
	})
	
})

//留言
router.get('/liuyan', function(req, res) {
  //发布留言
  var findData = function(db,callback){
  	var conn = db.collection('liuyan');
  	conn.find({}).toArray(function(err,result){
  	
  			callback(result);
  	})
  }
  	
  	//连接服务器
  	mongodb.connect(db_str,function(err,db){
  		if(err){
  			console.log(err);
  		}else{
  			findData(db,function(result){
					console.log(result);
//					res.send('aaa');
				res.render('liuyan',{result:result});
  			})
  		}
  	})
  
});

module.exports = router;
