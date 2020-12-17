const express = require('express')

const multer = require('multer');
const upload = multer({dest:'public/uploads/'});

const router = express.Router()
const ListModel = require('../models/list.js')
const ArticleModel = require('../models/article.js')
const Category = require('../util/category.js')

//权限验证
router.use((req,res,next) => {
	if (req.userInfo.isAdmin) {
		next()
	}
	else{
		res.send('请先登录')
	}
})

//显示文章分类列表
router.get('/',(req,res)=>{
	ArticleModel.getPaginationArticleData(req)
	.then(data=>{
		res.render("admin/article-list",{
			userInfo:req.userInfo,
			articles:data.users,
			page:data.page,
			list:data.list,
			pages:data.pages,
			url:"/article",
		})
	})
	.catch(err=>{
		console.log('err111111:',err)
	})
})

//显示添加文章页面
router.get('/add',(req,res)=>{
	ListModel.find({},"name")
	.sort({_id:1})
	.then(categories=>{
		res.render("admin/article-add_edit",{
			userInfo:req.userInfo,
			categories
		})
	})
	
})
//处理文章添加信息提交
router.post('/add',(req,res)=>{
	//1.获取数据
	const {category,title,intro,content} = req.body
	//2.插入数据
	ArticleModel.insertMany({
		title:title,
		user:req.userInfo._id,
		category:category,
		intro:intro,
		content:content,
	})
	.then(user=>{
		res.render("admin/success",{
			message:"添加成功",
			url:"article"
		})
	})
	.catch(err=>{
		res.render("admin/err",{
			message:"添加失败，稍后再试",
			url:"article/add"
		})
	})
})

//处理文章图片提交
router.post('/uploadImage',upload.single('upload'),(req,res)=>{
	const uploadedFilePath = '/uploads/'+req.file.filename;
	res.json({
		uploaded:true,
		url:uploadedFilePath
	})
})
//显示文章编辑页面
router.get('/edit/:id',(req,res)=>{
	const { id } = req.params
	ListModel.find({},"name")
	.sort({_id:1})
	.then(categories=>{
		ArticleModel.findById(id)
		.then(article=>{
			res.render("admin/article-add_edit",{
				userInfo:req.userInfo,
				article:article,
				categories,
			})
		})
	})
	.catch(err=>{
		res.render("admin/err",{
			message:"服务器异常，稍后再试",
		})
	})
})

//处理文章编辑提交
router.post('/edit',(req,res)=>{
	//1.获取数据
	const {category,title,intro,content,id} = req.body
	ArticleModel.updateOne({_id:id},{category,title,intro,content})
	.then(result=>{
		res.render("admin/success",{
			message:"修改成功",
			url:'article',
		})
	})
	.catch(err=>{
		res.render("admin/err",{
			message:"服务器异常，稍后再试",
			url:'article',
		})
	})
})	
	
//处理删除列表
router.get('/delete/:id',(req,res)=>{
	const { id } = req.params
	ArticleModel.deleteOne({_id:id})
	.then(result=>{
		res.render("admin/success",{
			message:"删除成功",
			url:'article',
		})
	})
	.catch(err=>{
		res.render("admin/err",{
			message:"服务器异常，稍后再试",
			url:'article',
		})
	})
})

module.exports = router