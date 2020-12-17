;(function($){
	const $logout =	$('.page #logout')


	//退出登录
	$logout.on('click',function(){
		$.ajax({
			url:'/user/back',
		})
		.done(function(result){
			window.location.href='/'
		})
		.fail(function(err){
			alert('退出失败')
		})
	})

	//点击获取用户列表
})(jQuery)