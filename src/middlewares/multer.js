const multer = require('multer');
const path = require('path');

//configuracion disk multer
const storage = multer.diskStorage({
	destination: path.join(__dirname, '../public/images/aconel'),
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	}
});

const upFile = multer({
	storage,
	dest: path.join(__dirname, '../public/images/aconel'),
	limits: {fileSize: 3000000},
	fileFilter: (req, file, cb) => {
		const filetypes = /jpeg|jpg|png|gif/;
		const mimetype = filetypes.test(file.mimetype);
		const extname = filetypes.test(path.extname(file.originalname));
		if (mimetype && extname) {
			return cb(null, true);
		}
		cb(new Error("Formato de imagen inválido"));
	}
}).single('image')

module.exports = upFile;

