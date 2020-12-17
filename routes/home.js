const express = require('express')
const router = express.Router()
const UserModel = require('../models/user.js')
const ListModel = require('../models/list.js')
const CommentModel = require('../models/comment.js')
const Category = require('../util/category.js')
const hmac = require('../util/hmac.js')

//权限验证
router.use((req,res,next) => {
	if (req.userInfo._id) {
		next()
	}
	else{
		res.send('请先登录')
	}
})
//显示进入个人中心页面
// router.get('/',(req,res)=>{
// 	res.render("home/comment_list",{
// 		userInfo:req.userInfo,
// 	})
// })
//显示后台评论列表
router.get('/comment_list',(req,res)=>{
	CommentModel.getPaginationCommentData(req,{user:req.userInfo._id})
	.then(data=>{
		res.render("home/comment_list",{
			userInfo:req.userInfo,
		
			//首页文章分类数据
			comments:data.users,
			page:data.page,
			list:data.list,
			pages:data.pages,
			url:"/home/comment_list",
		})
	})
	.catch(err=>{
		console.log('err::',err);
	})
})

//显示后台修改密码
router.get('/password',(req,res)=>{
	res.render("home/password_chang",{
		userInfo:req.userInfo,
	})
})
//处理修改密码提交
router.post('/password',(req,res)=>{
	const { password } = req.body
	//2.同名验证
	UserModel.updateOne({_id:req.userInfo._id},{password:hmac(password)})
	.then(data=>{
		req.session.destroy()
		res.render("home/success",{
			userInfo:req.userInfo,
			message:'修改成功,请重新登录',
			url:' '
		})
	})
	.catch(err=>{
		res.render("home/err",{
			userInfo:req.userInfo,
			message:'修改失败,请稍后再试',
			url:'home/password'
		})
	})
})
module.exports = router