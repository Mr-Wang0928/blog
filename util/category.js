async function Category (options){
	//page:从req中获取页码数
	//limit:每页显示的数据数量
	//model:使用的数据库模板
	//query:查询条件（所有）
	//projection:不显示的属性
	//sort:排序
	//populates:关联数据
	
	let {page,limit,model,query,projection,sort,populates} = options

	page = parseInt(page)
	
	const count = await model.countDocuments(query) //此方法查询有多少条数据
	
	const pages = Math.ceil(count/limit)   //向上取整,因为在html页面{{ page+1 }}
	const list = []
	for (var i = 1; i <=pages; i++) {
		list.push(i)
	}
	//处理用户在地址栏输入 page=xx
	if (isNaN(page)) {
		page = 1
	}
	//处理下一页边界值
	if (page>pages) {
		page = pages
	}
	//处理上一页边界值
	if (page == 0) {
		page = 1
	}
	const skip = (page-1)*limit

	//关联操作
	let result = options.model.find(query,projection)
	if (populates) {
		populates.forEach(populate=>{
			result = result.populate(populate)
		})
	}
	//1.获取数据
	const docs = await result.sort(sort).skip(skip).limit(limit)
	return {
		users:docs,
		page:page,
		list:list,
		pages:pages
	}
}
module.exports = Category