const mongoose = require('mongoose')
const Category = require('../util/category.js')

//1.定义Schema
const CommentSchema = new mongoose.Schema({
	content:{
		type:String,
		required:[true,"评论内容必须输入"],
	},
	user:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'user',
	},
	article:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'article',
	},
	createdAt:{
		type:Date,
		default:Date.now,
	},
})

CommentSchema.virtual('createdTime').get(function(){
	return new Date(this.createdAt).toLocaleString('chinese',{hour12:false})
})

CommentSchema.statics.getPaginationCommentData=function(req,query={}){
	let page = req.query.page
	
	return Category({
		page:page,
		limit:4,
		model:this,
		query:query,
		projection:"-password -__v",
		sort:{_id:-1},
		populates:[{ path: 'article', select: 'title'},{ path: 'user', select: 'username'}]
	})
	
}

const CommentModel = mongoose.model('comment',CommentSchema)
module.exports = CommentModel