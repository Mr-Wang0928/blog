const express = require('express')
const router = express.Router()

const ListModel = require('../models/list.js')
const ArticleModel = require('../models/article.js')
const CommentModel = require('../models/comment.js')


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

//显示主页
router.get('/',(req,res) => {
	// let userInfo = {}
	// if (req.cookies.get('userInfo')) {
	// 	userInfo = JSON.parse(req.cookies.get('userInfo'))
	// }
	
	getCommonData()
	.then(data=>{
		const {categories,ranks} = data
		ArticleModel.getPaginationArticleData(req)
		.then(data=>{
			res.render("main/index",{
				userInfo:req.userInfo,
				categories,
				ranks,
				//首页文章分类数据
				articles:data.users,
				page:data.page,
				list:data.list,
				pages:data.pages,
				url:"",
			})
		})
		
	})
	
})

//处理分页发送ajax请求
router.get('/articles',(req,res) => {
	const id = req.query.id
	const query ={}
	if (id) {
		query.category=id
	}

	// console.log('id:::',id)
	ArticleModel.getPaginationArticleData(req,query)
	.then(data=>{
		res.json({
			status:0,
			data:data,
		})

	})
	.catch(err=>{
		res.json({
			status:1,
			message:"服务器繁忙，稍后再试"
		})
	})
	
})
//显示列表页
router.get('/list/:id',(req,res) => {
	const id  = req.params.id
	getCommonData()
	.then(data=>{
		const {categories,ranks} = data
		ArticleModel.getPaginationArticleData(req,{category:id})
		.then(data=>{
			res.render("main/list",{
				userInfo:req.userInfo,
				categories,
				ranks,
				//首页文章分类数据
				articles:data.users,
				page:data.page,
				list:data.list,
				pages:data.pages,

				currentCateforyId:id,
			})
		})
		
	})
})

async function getDetailData(req){
	const id  = req.params.id

	const commonDataPromise= getCommonData()

	const articleDataPromise = ArticleModel.findOneAndUpdate({_id:id},{$inc:{click:1}},{new:true})
								.populate({path:'user',select:'username'})
								.populate({path:'category',select:'name'})
	const commentDataPromise = CommentModel.getPaginationCommentData(req,{article:id})

	const commonData = await commonDataPromise
	const article = await articleDataPromise
	const comment = await commentDataPromise

	const {categories,ranks} = commonData
	return {
		categories,
		ranks,
		article,
		comment,
		id,
	}
}

//显示详情页
router.get('/detail/:id',(req,res) => {
	getDetailData(req)
	.then(data=>{
		const {categories,ranks,article,comment,id} = data
		// console.log('222222222222',id)
		res.render("main/detail",{
			userInfo:req.userInfo,
			categories,
			ranks,
			article,
			//首次获得详情页评论区数据
			comments:comment.users,
			page:comment.page,
			list:comment.list,
			pages:comment.pages,

			currentCateforyId:id,
		})
	})
	
})



module.exports = router