const jwt = require('jsonwebtoken');
const config = require('../config');

const verifyToken = (req, res, next) => {
	let token = req.headers.authorization;
	if (!token) {
		return res.status(403).json({
			code: 1,
			message: 'Prohibido el acceso, token Authorization no encontrado'
		});
	}
	token = token.split(" ")[1];
	try {
		const decode = jwt.verify(token, config.secret);
	} catch(e) {
		console.log(e.message);
		return res.status(401).json({
			code: 1,
			message: e.message
		});
	}
	next();
}

module.exports = verifyToken;