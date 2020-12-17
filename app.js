const express = require('express')

const swig = require('swig')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Cookies = require('cookies')
const session = require('express-session')
const MongoStore = require("connect-mongo")(session)

const routerIndex = require('./routes/index.js')
const routerUser = require('./routes/user.js')
const routerAdmin = require('./routes/admin.js')
const routerHome = require('./routes/home.js')
const routerCategory = require('./routes/category.js')
const routerArticle = require('./routes/article.js')
const routerComment = require('./routes/comment.js')

const app = express()
const port = 3000

//1.连接数据库
mongoose.connect('mongodb://localhost/blog',{useNewUrlParser: true})
//2.获取db对象
const db = mongoose.connection
//3.连接数据库
db.on('error',(err) =>{
	console.log('connection db error:',err)
	throw err
})
db.on('open',()=>{
	console.log('connection db success')
})


//处理静态资源
app.use(express.static('public'))


//中间件(处理put,post请求的参数，设置bodyParser中间件)
app.use(bodyParser.urlencoded({extended:false}))
//bodyParser中间件执行完毕之后会把post/put请求的参数以对象形式保存在req.body上
app.use(bodyParser.json())

//---------------------------------模板设置开始-----------------------------
//开发阶段设置不走缓存
swig.setDefaults({
	//cache: 'memory'
	cache:false
})
//配置应用模板
//第一个参数是模板名称，同时也是模板文件的扩展名
//第二个参数是解析模板的方法
app.engine('html',swig.renderFile)

//注册模板引擎
//第一个参数必须是view engine
//第二个参数是模板名称，也就是app。engine的第一个参数
app.set('view engine','html')
//设置后就可以调用res.render()方法渲染模板
//---------------------------------模板设置结束-----------------------------

//设置express-session

app.use(session({
    //设置cookie名称
    name:'kzid',
    //用它来对session cookie签名，防止篡改
    secret:'abc',
    //强制保存session即使它并没有变化
    resave: true,
    //强制将未初始化的session存储
    saveUninitialized: true, 
    //如果为true,则每次请求都更新cookie的过期时间
    rolling:true,
    //cookie过期时间 1天
    cookie:{maxAge:1000*60*60*24},
    //设置session存储在数据库中
    store:new MongoStore({ mongooseConnection: mongoose.connection })   
}))

app.use((req,res,next)=>{
	req.userInfo = req.session.userInfo || {}
	next()
})

// app.use((req,res,next)=>{
// 	//生成cookies对象并且保存到req
// 	req.cookies = new Cookies(req,res)
// 	let userInfo = {}
// 	if (req.cookies.get('userInfo')) {
// 		userInfo = JSON.parse(req.cookies.get('userInfo'))
// 	}
// 	req.userInfo=userInfo
// 	next()
// })

//---------------------------------路由设置开始-----------------------------

app.use("/",routerIndex)
app.use("/user",routerUser)
app.use("/admin",routerAdmin)
app.use("/home",routerHome)
app.use("/category",routerCategory)
app.use("/article",routerArticle)
app.use("/comments",routerComment)

//---------------------------------模板设置结束-----------------------------

app.listen(port,()=>console.log(`app listening on port '${port}!`))