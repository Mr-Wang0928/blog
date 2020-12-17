;(function($){
	$('#btn-password').on('click',function(){
		const password = $('#password-chang #password').val()
		const repassword = $('#password-chang #repassword').val()
		const $err = $('#password-chang .err')
		var passwordReg = /^\w{3,6}$/
		var errMsg = ''
		//1判断是否符合，符合发送ajax请求
		if (!passwordReg.test(password)) {
			errMsg = '密码为3-6位任意字符'
			$err.eq(0).html(errMsg)
			return false
		}
		else if (password != repassword) {
			errMsg = '两次输入密码不同'
			$err.eq(1).html(errMsg)
			$err.eq(0).html('')
			return false
		}
		$err.html('')

	})
})(jQuery)