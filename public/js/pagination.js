;(function($){
	$.fn.extend({
		pagination:function(options){
			var $elem = this
			$elem.on('click','a',function(){
				$this = $(this)
				//1.获取当前page值
				var currentPage = $elem.find('.active a').html()
				console.log('currentPage:::',currentPage)
				
				//2.根据当前page值,计算请求页码
				var page = 1
				var labeText = $this.attr('aria-label')
				if (labeText == "Next") {
					page = currentPage*1 + 1
				}
				else if (labeText == "Previous") {

					page = currentPage - 1
				}
				else{
					page = $this.html()
				}
				if (page == currentPage) {
					return false
				}
				var id = $elem.data('id')
				var url = options.url+"?page="+page
				if (id) {
					url = url+"&id="+id
				}
				$.ajax({
					url:url,
					dataType:'json',
				})
				.done(function(result){
					if (status == 0) {
						$elem.trigger('getArticleData',result.data)
					}
					else{
						alert("服务器繁忙，稍后再试",err)
					}
				})
				.fail(function(err){
					alert("服务器繁忙，稍后再试",err)
				})
			})
		}
	})
})(jQuery)