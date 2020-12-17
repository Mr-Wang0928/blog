const express = require('express')
const router = express.Router()

const ListModel = require('../models/list.js')
const CommentModel = require('../models/comment.js')
const Category = require('../util/category.js')


async function getCommonData(){
	const categoriesPromise = ListModel.find({},'name').sort({order:-1})
	const rankPromise = ArticleModel.find({},"title click").sort({click:-1})

	const categories = await categoriesPromise
	const ranks = await rankPromise
	return {
		categories,
		ranks,
	}
}




//处理添加评论
router.post('/add',(req,res) => {
	const {val,id} =req.body
	// console.log('val,id',val);
	// console.log('val,id',id);
	CommentModel.insertMany({
		content:val,
		article:id,
		user:req.userInfo._id,
	})
	.then(comments=>{
		CommentModel.getPaginationCommentData(req,{article:id})
		.then(data=>{
			// console.log('data:::::',data);
			// console.log('data:::::',data.users);
			res.json({
				status:0,
				data:data,
				message:"添加评论成功"
			})
		})
		.catch(err=>{
			console.log('err::::',err);
			res.json({
				status:1,
				message:"添加评论失败"
			})
		})
		
	})
	
})
//处理分页发送ajax请求
router.get('/list',(req,res)=>{
	const id = req.query.id
	const query ={}
	if (id) {
		query.article=id
	}

	// console.log('id:::',id)
	CommentModel.getPaginationCommentData(req,query)
	.then(data=>{
		// console.log('data333:::',data)
		res.json({
			status:0,
			data:data,
		})

	})
	.catch(err=>{
		res.json({
			status:1,
			message:"服务器繁忙，稍后再试111111"
		})
	})
})

//权限验证
router.use((req,res,next) => {
	if (req.userInfo.isAdmin) {
		next()
	}
	else{
		res.send('请先登录')
	}
})


//显示管理后台评论列表
router.get('/comment_list',(req,res)=>{
	CommentModel.getPaginationCommentData(req)
		.then(data=>{
			res.render("admin/comment-list",{
				userInfo:req.userInfo,
			
				//首页文章分类数据
				comments:data.users,
				page:data.page,
				list:data.list,
				pages:data.pages,
				url:"/comments/comment_list",
			})
		})
})

//处理删除评论列表
router.get('/delete/:id',(req,res)=>{
	const { id } = req.params
	CommentModel.deleteOne({_id:id})
	.then(result=>{
		res.render("admin/success",{
			message:"删除成功",
			url:"comments/comment_list",
		})
	})
	.catch(err=>{
		res.render("admin/err",{
			message:"服务器异常，稍后再试",
		})
	})
})
module.exports = router