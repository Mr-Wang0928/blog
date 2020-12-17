const mongoose = require('mongoose')

//1.定义Schema
const UserSchema = new mongoose.Schema({
	username:{
		type:String,
		required:[true,"用户名必须输入"],
		minlength:[3,"用户名最小长度为3个字符"],
		maxlength:[10,"用户名最大长度为10个字符"]
	},
	password:{
		type:String,
		required:[true,"密码必须输入"],
		// minlength:[3,"用户名最小长度为3个字符"],
		// maxlength:[6,"用户名最大长度为6个字符"]
	},
	isAdmin:{
		type:Boolean,
		default:false
	}
})

const UserModel = mongoose.model('user',UserSchema)
module.exports = UserModel