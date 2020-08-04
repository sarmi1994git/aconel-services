const Image = require('../models/Image');
const config = require('../config');
const upFile = require('../middlewares/multer');

const createImage = (req, res) => {
	/*--------MIDDLEWARE DE MULTER---------*/
	upFile(req, res, async (err) => {
        if(err) {
              return res.status(400).json({
              	code: 1,
              	message: err.message
              });
        }
        /*------------TRATAMIENTO DE LA IMAGEN SI TODO ESTÁ EN ORDEN*/
        try {
			const { filename, mimetype, size } = req.file;
			const { title, alt, description, category } = req.body;
			const src = config.srcFiles + filename;
			if (title || title.length > 0) {
				let newImage = await Image.create({
					filename,
					title,
					mimetype,
					size,
					category,
					description,
					alt,
					src
				}, {
					fields: ['filename', 'title', 'mimetype', 'size',
							 'category', 'alt', 'src', 'description']
				});
				if (newImage) {
					res.status(201).json({
						code: 0,
						message: 'Imagen cargada con éxito',
						data: newImage
					});
				}
			} else {
				res.status(400).json({
					code: 1,
					message: 'el campo title es requerido'
				});
			}
		} catch(e) {
			console.log(e);
			res.status(500).json({
				code: 1,
				message: 'Error al subir datos de la imagen'
			});
		}
    });
}

const getImages = async (req, res) => {
	try {
		const { category, page, size } = req.query;
		let condition = {};
		if (category) {
			condition = {category: category};
		}
		const { limit, offset } = getPagination(page, size);
		const images = await Image.findAndCountAll({
			where: condition,
			limit,
			offset,
			order: [
				['id', 'DESC']
			]
		});
		const response = getPagingData(images, page, limit);
		res.status(200).json(response);
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al consultar los datos'
		});
	}
}

const getImageById = async (req, res) => {
	try {
		const id = req.params.id;
		const image = await Image.findOne({
			where: {id}
		});
		if(image) {
			res.status(200).json(image);
		} else {
			res.status(404).json({
				code: 1,
				message: 'No se encontró la imagen con el id especificado'
			});
		}
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al consultar los datos'
		});
	}
}

const updateImage = async (req, res) => {
	//se debe cambiar el nombre de la imagen en el servidor
	try {
		const id = req.params.id;
		const { title, alt, description, category } = req.body;
		if (title || title.length > 0) {
			const image = await Image.findOne({
				where: {id}
			});
			if(image) {
				let updatedImage = await Image.update({
					title,
					category,
					description,
					alt
				}, {
					where: {id}
				});
				res.status(200).json({
					code: 0,
					message: 'Imagen actualizada con éxito',
					data: { title, alt, description, category, }
				});
			} else {
				res.status(404).json({
					code: 1,
					message: 'Imagen no encontrada par actualizar'
				});
			}
		} else {
			res.status(400).json({
				code: 1,
				message: 'el campo name es requerido'
			});
		}
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al actualizar la imagen'
		});
	}
}

const deleteImage = async (req, res) => {
	try {
		const id = req.params.id;
		await Image.destroy({
			where: {id}
		});
		res.status(204).json({
			code: 0,
			message: 'Imagen eliminado con éxito'
		});
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al eliminar la imagen'
		});
	}
}

const getPagination = (page, size) => {
/*limit = size
  offset = (page - 1) * size*/
  const limit = size ? +size : 100;
  const offset = page ? (page -1) * limit : 0;
  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
	const { count: totalItems, rows: images } = data;
	const currentPage = page ? +page : 1;
	const totalPages = Math.ceil(totalItems / limit);
	return { totalItems, images, totalPages, currentPage };
};

module.exports = {
	createImage,
	getImages,
	getImageById,
	updateImage,
	deleteImage
}
