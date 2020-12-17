;(function($){
	$('.delete').on('click',function(){
		if (!window.confirm("你确定删除此列表？")) {
			return false
		}
	})
})(jQuery)