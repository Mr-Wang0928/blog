const express = require('express')
const router = express.Router()
const ListModel = require('../models/list.js')
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

//显示后台管理分类列表
router.get('/',(req,res)=>{
	var page = req.query.page
	Category({
		page:page,
		limit:4,
		model:ListModel,
		query:{},
		projection:"-password -__v",
		sort:{_id:-1}
	})
	.then(data=>{
		res.render("admin/category-list",{
			userInfo:req.userInfo,
			users:data.users,
			page:data.page,
			list:data.list,
			pages:data.pages,
			url:"/category",
		})
	})
	.catch(err=>{

	})
})
//显示add分类列表
router.get('/add',(req,res)=>{
	res.render("admin/category-add_edit",{
		// userInfo:req.userInfo,
		// users:users,
	})
})
//处理add分类列表
router.post('/add',(req,res)=>{
	//1.获取数据
	const {name,order} = req.body
	//2.同名验证
	ListModel.findOne({name:name})
	.then(user=>{
		if (user) {//有同名
			res.render("admin/err",{
				message:"此列表已存在",
			})
		}
		else{//没有同名
			//3.添加数据
			ListModel.insertMany({
				name:name,
				order:order,
			})
			.then(user=>{
				console.log('user::::',user);
				res.render("admin/success",{
					name:name,
					order:order,
					message:user,
				})
			})
			.catch(err=>{
				console.log('err:::',err.errors.name.properties.message);
				res.render("admin/err",{
					message:{
						name:err.errors.name.properties.message,
						order:err.errors.order.properties.message,
					},
					url:"category/add"
				})
			})
		}
	})
	.catch(err=>{
		res.render("admin/err",{
			message:"添加失败",
		})
	})
})
//处理列表信息编辑
router.get('/edit/:id',(req,res)=>{
	const { id } = req.params
	ListModel.findById(id)
	.then(category=>{
		res.render("admin/category-add_edit",{
			userInfo:req.userInfo,
			category:category,
		})
	})
	.catch(err=>{
		res.render("admin/err",{
			message:"服务器异常，稍后再试",
		})
	})
})
//处理列表信息提交
router.post('/edit',(req,res)=>{
	//1.获取数据
	let {name,order,id} = req.body
	console.log('111111',name,order,id)
	ListModel.findById(id)
	.then(category=>{
		if (name==category.name && order == category.order) {//未作修改
			console.log('1');
			res.render("admin/err",{
				message:"请修改后再提交",
			})
		}
		else{
			ListModel.findOne({name:name,_id:{$ne:id}})
			.then(category=>{
				if (category) {//修改后有重名
					console.log('2');
					res.render("admin/err",{
						message:"列表名已存在",
					})
				}
				else{
					ListModel.updateOne({_id:id},{name,order})
					.then(result=>{
						console.log('3');
						res.render("admin/success",{
							message:"修改成功",
						})
					})
					
					
				}
			})
			.catch(err=>{
				console.log('4');
				console.log('err',err);
				res.render("admin/err",{
					message:"服务器异常，稍后再试",
				})
			})
			
		}
	})
	.catch(err=>{
		console.log('0');
		res.render("admin/err",{
			message:"服务器异常，稍后再试",
		})
	})
	
})
//处理删除列表
router.get('/delete/:id',(req,res)=>{
	const { id } = req.params
	ListModel.deleteOne({_id:id})
	.then(result=>{
		res.render("admin/success",{
			message:"删除成功",
			url:'category',
		})
	})
	.catch(err=>{
		res.render("admin/err",{
			message:"服务器异常，稍后再试",
		})
	})
})

module.exports = router