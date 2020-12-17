const express = require('express')
const router = express.Router()
const UserModel = require('../models/user.js')
const ListModel = require('../models/list.js')
const Category = require('../util/category.js')
const hmac = require('../util/hmac.js')

//权限验证
router.use((req,res,next) => {
	if (req.userInfo.isAdmin) {
		next()
	}
	else{
		res.send('请先登录')
	}
})
//显示后台管理用户列表
// router.get('/',(req,res)=>{
// 	res.render("admin/index",{
// 		userInfo:req.userInfo,
// 	})
// })
router.get('/user',(req,res)=>{
	var page = req.query.page
	Category({
		page:page,
		limit:4,
		model:UserModel,
		query:{},
		projection:"-password -__v",
		sort:{_id:-1}
	})
	.then(data=>{
		res.render("admin/index",{
			userInfo:req.userInfo,
			users:data.users,
			page:data.page,
			list:data.list,
			pages:data.pages,
			url:"/admin/user",
		})
	})
	.catch(err=>{
		
	})
})

//显示后台修改密码
router.get('/password',(req,res)=>{
	res.render("admin/password_chang",{
		userInfo:req.userInfo,
	})
})
//处理修改密码提交

//1.获取数据
router.post('/password',(req,res)=>{
	const { password } = req.body
	//2.同名验证
	UserModel.updateOne({_id:req.userInfo._id},{password:hmac(password)})
	.then(data=>{
		// console.log('data：：：',data);
		req.session.destroy()
		res.render("admin/success",{
			userInfo:req.userInfo,
			message:'修改成功,请重新登录',
			url:' '
		})
	})
	.catch(err=>{
		res.render("admin/err",{
			userInfo:req.userInfo,
			message:'修改失败,请稍后再试',
			url:'admin/password'
		})
	})
})

/*router.get('/',(req,res)=>{
	//page为路径栏里面数值,要显示的第几页
	//limit为限制每一页显示多少数据
	//skip为要跳过的数据个数
	var page = req.query.page
	page = parseInt(page)
	const limit = 2
	

	UserModel.countDocuments((err,count)=>{ //此方法查询有多少条数据
		const pages = Math.ceil(count/limit)   //向上取整,因为在html页面{{ page+1 }}
		const list = []
		for (var i = 1; i <=pages; i++) {
			list.push(i)
		}
		//处理用户在地址栏输入 page=xx
		if (isNaN(page)) {
			page = 1
		}
		//处理下一页边界值
		if (page>pages) {
			page = pages
		}
		//处理上一页边界值
		if (page == 0) {
			page = 1
		}
		const skip = (page-1)*limit
		//1.获取数据
		UserModel.find({})
		.skip(skip)
		.limit(limit)
		.then(users=>{
			console.log('users',users);
			res.render("admin/index",{
				userInfo:req.userInfo,
				users:users,
				page:page,
				list:list,
				pages:pages
			})
		})
		.catch(err=>{
			console.log('get err',err);
		})

	})
})
*/

module.exports = router