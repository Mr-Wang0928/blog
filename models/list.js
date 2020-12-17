const mongoose = require('mongoose')

//1.定义Schema
const ListSchema = new mongoose.Schema({
	name:{
		type:String,
		required:[true,"列表名必须输入"],
		// minlength:[3,"用户名最小长度为3个字符"],
		// maxlength:[10,"用户名最大长度为10个字符"]
	},
	order:{
		type:Number,
		required:[true,"排序必须输入"],
		// minlength:[3,"用户名最小长度为3个字符"],
		// maxlength:[6,"用户名最大长度为6个字符"]
	}
	
})

const ListModel = mongoose.model('category',ListSchema)
module.exports = ListModel