const express = require('express')
const UserModel = require('../models/user.js')
const hmac = require('../util/hmac.js')
const router = express.Router()

//注册页处理
router.post('/register',(req,res)=>{
	//1.获取数据
	const {username,password} = req.body
	//2.同名验证
	UserModel.findOne({username:username})
	.then(user=>{
		if (user) {//有同名
			res.json({
				status:1,
				message:"该用户名已存在"
			})
		}
		else{//没有同名
			//3.添加数据
			UserModel.insertMany({
				username:username,
				password:hmac(password),
				
			})
			.then(user=>{
				console.log('user:::',user);
				res.json({
					status:0,
					message:"注册成功"
				})
			})
			.catch(err=>{
				throw err
			})
		}
	})
	.catch(err=>{
		res.json({
			status:1,
			message:"服务器繁忙，稍后再试"
		})
	})
})
//登录页处理
router.post('/login',(req,res)=>{
	//1.获取数据
	const {username,password} = req.body
	//2.同名验证 
	UserModel.findOne({username:username,password:hmac(password)},"-password -__v")
	.then(user=>{
		if (user) {//登陆成功
			//生成cookies并且返回给前台
			//req.cookies.set('userInfo',JSON.stringify(user),{maxAge:1000*60*60*24})
			req.session.userInfo = user
			res.json({
				status:0,
				message:"登陆成功",
				data:user
			})
		}
		else{
			res.json({
				status:1,
				message:"用户名或密码错误"
			})
		}
	})
	.catch(err=>{
		res.json({
			status:1,
			message:"服务器繁忙，稍后再试"
		})
	})
})
//退出登录(个人中心退出（清除信息）)
router.get('/logout',(req,res)=>{
	// req.cookies.set('userInfo',null)
	// 销毁session
	req.session.destroy()
	res.json({
		status:0,
		message:"退出登录成功"
	})
})
//退出登录(管理系统退出（返回到个人中心）)
router.get('/back',(req,res)=>{
	res.json({
		status:0,
		message:"退出登录成功"
	})
})


module.exports = router