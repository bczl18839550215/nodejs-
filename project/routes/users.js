var express = require('express');
var router = express.Router();
var mongodb=require('mongodb').MongoClient;

var db_str="mongodb://127.0.0.1:27017/userinfo"

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register',(req,res)=>{
	
	console.log(req.body)
	
	var username=req.body['username'];
	var password=req.body['password'];
	
	var insertData=function(db,callback){
		var conn=db.collection('info')
		var data={username:username,password:password}
		
		conn.insert(data,function(result){
			callback(result)
		})	
	}
	
	mongodb.connect(db_str,function(err,db){
		
		if(err){
			console.log(err)
		}else{
			//执行插入函数 
			insertData(db,function(result){

				 res.render('success',{title:"注册成功"})
				db.close()
			})
			
		}
		
	})
})
//登录
router.post('/login',(req,res)=>{
	
	console.log(req.body)
	var username=req.body['username'];
	var password=req.body['password'];
	//查找数据的函数 
	var findData=function(db,callback){
		var conn=db.collection('info')
		var data={username:username,password:password}
		
		conn.find(data,function(err,result){
			callback(result)
		})	
	}
	//建立服务
	mongodb.connect(db_str,function(err,db){
		
		if(err){
			console.log(err)
		}else{
			//查找数据的函数 
			findData(db,function(result){
				result.toArray(function(err,item){
					
					if(item.length > 0){
						//登录成功以后进行一个存储
						req.session.username = item[0].username;
						
						
						res.render('success',{title:"登录成功"})
					}else{
						res.render('success',{title:"账号密码不正确"})
					}
				});
				
				db.close();
			})
		}
	})
});

//留言
router.post('/liuyan',(req,res)=>{
	
	console.log(req.body)
	
	var title=req.body['title'];
	var con=req.body['con'];
	
	var insertData=function(db,callback){
		var conn=db.collection('liuyan')
		var data={title:title,con:con,user:req.session.username}
		
		conn.insert(data,function(result){
			callback(result)
		})	
	}
	
	mongodb.connect(db_str,function(err,db){
		
		if(err){
			console.log(err)
		}else{
			//执行插入函数 
			insertData(db,function(result){

				res.redirect('/liuyan')
				db.close()
			})
			
		}
		
	})
})



module.exports = router;

