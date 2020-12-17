;(function($){
	//定义注册常量
	const $signUpUser = $('.login-html .sign-up-htm #user')
	const $signUpPass = $('.login-html .sign-up-htm #pass')
	const $repass = $('.login-html .sign-up-htm #repass')
	const $signUp = $('.login-html .sign-up-htm .button')
	const $signUpErr = $('.login-html .sign-up-htm .err')
	//定义登录常量
	const $signInUser = $('.login-html .sign-in-htm #user')
	const $signInPass = $('.login-html .sign-in-htm #pass')
	const $signIn = $('.login-html .sign-in-htm .button')
	const $signInErr = $('.login-html .sign-in-htm .err')
	//定义登录后常量
	const $signinHtml = $('.section .login-html')
	const $signedHtml =$('.section .signed')
	const $signedBack =$('.section .signed #signed-back')

	const $err = $('.login-html .err')

	//1.注册
	$signUp.on('click',function(){
		//1.1获取输入框中的数据
			var userVal = $signUpUser.val();
			var passVal = $signUpPass.val();
			var repassVal = $repass.val();
		//1.2制定正则规则验证
			//用户名为字母开头包含数字和下划线的3-10位字符
			var usernameReg = /^[a-z][a-z0-9_]{2,9}$/i
			//密码为3-6位任意字符
			var passwordReg = /^\w{3,6}$/
			var errMsg = ''
		//1.3判断是否符合，符合发送ajax请求
			if (!usernameReg.test(userVal)) {
				errMsg = '用户名为字母开头包含数字和下划线的3-10位字符'
			}
			else if (!passwordReg.test(passVal)) {
				errMsg = '密码为3-6位任意字符'
			}
			else if (repassVal != passVal) {
				errMsg = '两次输入密码不同'
			}
			if (errMsg) {
				$signUpErr.html(errMsg)
			}
			else{//符合要求发送ajax
				$signUpErr.html('')
				$.ajax({
					url:'/user/register',
					type:'POST',
					dataType:'json',
					data:{
						username:userVal,
						password:passVal
					}
				})
				.done(function(result){
					if (result.status==0) {//成功
						$signUpErr.html(result.message)
						clearTimeout(timer)
						var timer=setTimeout(function(){
							$('.login-html .sign-in').trigger('click')
						},300)
						
					}
					else{//失败
						$signUpErr.html(result.message)
					}
					console.log('result::',result);
				})
				.fail(function(err){
					console.log('注册失败：',err);
				})
			}
	})
	//2.登录
	$signIn.on('click',function(){
		//1.1获取输入框中的数据
			var userVal = $signInUser.val();
			var passVal = $signInPass.val();
		//1.2制定正则规则验证
			//用户名为字母开头包含数字和下划线的3-10位字符
			var usernameReg = /^[a-z][a-z0-9_]{2,9}$/i
			//密码为3-6位任意字符
			var passwordReg = /^\w{3,6}$/
			var errMsg = ''
		//1.3判断是否符合，符合发送ajax请求
			if (!usernameReg.test(userVal)) {
				errMsg = '您输入的用户名有误'
			}
			else if (!passwordReg.test(passVal)) {
				errMsg = '您输入的密码有误'
			}
			if (errMsg) {
				$signInErr.html(errMsg)
			}
			else{
				$signInErr.html('')
				$.ajax({
					url:'/user/login',
					type:'POST',
					dataType:'json',
					data:{
						username:userVal,
						password:passVal
					}
				})
				.done(function(result){
					if (result.status==0) {//成功
						$signInErr.html(result.message)
						console.log('result.data.username',result.data.username)
						
						window.location.reload()
						// $('.section .signed span').html('欢迎 '+result.data.username)
						
					}
					else{//失败
						$signInErr.html(result.message)
					}
				})
				.fail(function(err){
					console.log('登录失败：',err);
				})

			}
	})
	//3.退出登录
	$signedBack.on('click',function(){
		$.ajax({
			url:'/user/logout',
		})
		.done(function(result){
			$('.signed .err').html(result.message)
			window.location.href='/'
		})
		.fail(function(err){
			$('.signed .err').html(err)
		})
	})
	//4.主页和分类的分页部分请求数据
	var $pagination = $('#pagination')

	function buildArticleHtml(articles){//构建文章内容函数
		var html=""
		articles.forEach(function(article){
			//处理ajax传不过来article.createdTime,在定义一次
			var createdTime = new Date(article.createdAt).toLocaleString('chinese',{hour12:false})
			html +=`<div class="article-list">
						<a href="/detail/${ article._id.toString() }">
							<span class="article-title">
								<h3>${ article.title }</h3>
							</span>
						</a>
						<p class="article-intro">
							${ article.intro }
						</p>
						<ul class="article-infor">
							<span class="glyphicon glyphicon-user" aria-hidden="true"></span>
							<span class="intro-text">${ article.user.username }</span>
							<span class="glyphicon glyphicon-th-list" aria-hidden="true"></span>
							<span class="intro-text">${ article.category.name }</span>
							<span class="glyphicon glyphicon-time" aria-hidden="true"></span>
							<span class="intro-text">${ createdTime }</span>
							<span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>
							<span class="intro-text">${ article.click }</span>
						</ul>
					</div>
					`
		})
		return html
	}

	function buildPaginationHtml(page,pages,list){//构建文章页码函数
		var html = ''
		if (pages>1) {
			html +='<ul class="pagination" id="pagination-ul">'
			if (page==1) {
				html +=`<li class="disabled">
					      <a href="javascript:;" aria-label="Previous">
					        <span aria-hidden="true">&raquo;</span>
					      </a>
					    </li>`
			}
			else{
				html +=`<li>
					      <a href="javascript:;" aria-label="Previous">
					        <span aria-hidden="true">&laquo;</span>
					      </a>
					    </li>`
			}
			list.forEach(function(i){
				if (i==page) {
					html += '<li class="active"><a href="javascript:;">'+i+ '</a></li>'
				}
				else{
					html += '<li><a href="javascript:;">'+i+ '</a></li>'
				}
				
			})

			if (page == pages) {
				html +=`<li class="disabled">
					      <a href="javascript:;" aria-label="Next">
					        <span aria-hidden="true">&raquo;</span>
					      </a>
					    </li>`
			}
			else{
				html +=`<li>
					      <a href="javascript:;" aria-label="Next">
					        <span aria-hidden="true">&raquo;</span>
					      </a>
					    </li>`
			}
			
			html +='</ul>'
		}		
		return html
	}

	//触发pagination方法里面trigger事件
	$pagination.on('getArticleData',function(ev,data){
		//调用构建文章内容函数
		$('#article-box').html(buildArticleHtml(data.users))
		//调用构建文章页码函数
		$('#pagination').html(buildPaginationHtml(data.page,data.pages,data.list))		
	})
	//调用局部刷新分页内容方法
	$pagination.pagination({
		url:'/articles',
	})


	//5.详情列表的分页部分请求数据
	var $comment = $('#comment-pagination')
	function buildCommentHtml(comments){//构建评论内容函数
		html=''
		comments.forEach(function(comment){
			//处理ajax传不过来comment.createdTime,在定义一次
			var createdTime = new Date(comment.createdAt).toLocaleString('chinese',{hour12:false})
			html+=`	<div class="panel panel-default">
					  <div class="panel-heading">${ comment.user.username } 发表于 : ${ createdTime }</div>
					  <div class="panel-body">
					    ${ comment.content }
					  </div>
					</div>`
		})
		return html
	}


	//触发pagination方法里面trigger事件
	$comment.on('getArticleData',function(ev,data){
		//调用构建评论内容函数
		$('#comment-content').html(buildCommentHtml(data.users))
		//调用构建评论页码函数
		$('#comment-pagination').html(buildPaginationHtml(data.page,data.pages,data.list))		
	})
	$comment.pagination({
		url:'/comments/list',
	})
})(jQuery)