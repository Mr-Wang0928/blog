const mongoose = require('mongoose')
const Category = require('../util/category.js')

//1.定义Schema
const ArticleSchema = new mongoose.Schema({
	title:{
		type:String,
		required:[true,"文章名必须输入"],
	},
	user:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'user',
	},
	category:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'category',
	},
	intro:{
		type:String,
	},
	createdAt:{
		type:Date,
		default:Date.now,
	},
	click:{
		type:Number,
		default:0
	},
	content:{
		type:String,
	},
})

ArticleSchema.virtual('createdTime').get(function(){
	return new Date(this.createdAt).toLocaleString('chinese',{hour12:false})
})

ArticleSchema.statics.getPaginationArticleData=function(req,query={}){
	let page = req.query.page
	return Category({
		page:page,
		limit:4,
		model:this,
		query:query,
		projection:"-password -__v",
		sort:{_id:-1},
		populates:[{ path: 'category', select: 'name'},{ path: 'user', select: 'username'}]
	})
	
}

const ArticleModel = mongoose.model('article',ArticleSchema)
module.exports = ArticleModel