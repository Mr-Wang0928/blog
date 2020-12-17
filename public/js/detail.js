;(function($){
	$('#noLogin').on('click',function(){
		$('.err-container').show()
	})


	$('#submit').on('click',function(){
		const val = $('#val').val()
		const id = $(this).data('id')
		if (!val) {
			$('#val').attr( "placeholder" , "请输入内容后再评论" )
			return false
		}
		else if(val.length > 50){
			$('.err-container').html("评论请不要超过50字")
			return false
		}
		else{
			$('.err-container').html("")
		}
		$.ajax({
			url:'/comments/add',
			type:'post',
			dataType:"json",
			data:{
				val,
				id,
			}
		})
		.done(function(result){
			if (result.status == 0) {
				//清空评论输入框中内容
				$('#val').val('')
				//触发一下函数，刷新页面
				$('#comment-pagination').trigger('getArticleData',result.data)
			}
		})
		.fail(function(err){
			alert('dddddd')

		})

	})
})(jQuery)