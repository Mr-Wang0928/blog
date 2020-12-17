const crypto = require('crypto')
module.exports = (str)=>{
	const hmac = crypto.createHmac('sha512','wang')
	hmac.update(str)
	return hmac.digest('hex')
}