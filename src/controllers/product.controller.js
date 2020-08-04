const Product = require('../models/Product');
const Image = require('../models/Image');
const Category = require('../models/Category');
const slugurl = require('slug');

const createProduct = async (req, res) => {
	try {
		//images debe ser un arreglo de objetos javascript
		const { category_id, name, description, slug, price, featuredImageId, images } = req.body;
		const validate = validateInputs({name, slug, price});
		if (validate.code === 0) {
			let newProduct = await Product.create({
				category_id,
				name,
				slug: slugurl(slug),
				description,
				price,
				featuredImageId
			}, {
				fields: ['category_id', 'name', 'slug', 'description', 'price', 'featuredImageId']
			});
			//insertar imagenes, relacion muchos a muchos
			if(images) {
				const imagesBd = [];
				for(i = 0; i < images.length; i++) {
					const imagebd = await Image.findOne({
						where: {id: images[i].id}
					});
					imagesBd.push(imagebd);
				}
				await newProduct.setImages(imagesBd);
			}
			res.status(201).json({
				code: 0, 
				message: 'producto creado con éxito',
				data: newProduct
			});
		} else {
			res.status(400).json({
				code: 1,
				message: validate.message
			});
		}
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al crear el producto: ' + e.message
		});
	}
}

const getProducts = async (req, res) => {
	try {
		const { page, size } = req.query;
		const { limit, offset } = getPagination(page, size);
		const products = await Product.findAndCountAll({
			attributes: ['id', 'name', 'slug', 'description', 'price', 'category_id'],
			order: [
				['id', 'DESC']
			],
			limit,
			offset,
			include: [Image, 'featuredImage']
		});
		const response = getPagingData(products, page, limit);
		res.status(200).json(response);
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al obtener datos'
		});
	}
}

const getProductById = async (req, res) => {
	try {
		const id = req.params.id;
		const product = await Product.findOne({
			where: {id},
			attributes: ['id', 'name', 'slug', 'description', 'price', 'category_id'],
			include: [Image, 'featuredImage']
		});
		if (product) {
			res.status(200).json(product);
		} else {
			res.status(404).json({
				codde: 1,
				message: 'No se encontró el producto con el id especificado'
			});
		}
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al obtener datos'
		});
	}
}

const updateProduct = async (req, res) => {
	try{
		const id = req.params.id;
		const { category_id, name, slug, description, price, featuredImageId, images } = req.body;
		const validate = validateInputs({name, slug, price});
		if (validate.code === 0) {
			const product = await Product.findOne({
				where: {id}
			});
			if (product) {
				const updateProduct = await Product.update({
					category_id,
					name,
					slug: slugurl(slug),
					description,
					price,
					featuredImageId
				}, {
					where: {id}
				});
				if(images) {
					const imagesBd = [];
					for(i = 0; i < images.length; i++) {
						const imagebd = await Image.findOne({
							where: {id: images[i].id}
						});
						imagesBd.push(imagebd);
					}
					await product.setImages(imagesBd);
				} else {
					await product.setImages([]);
				}
				res.status(200).json({
					code: 0,
					message: 'Producto actualizado con éxito',
					data: { category_id, name, slug, description, price, featuredImageId }
				});
			} else {
				res.status(404).json({
					code: 1,
					message: 'Producto no encontrado'
				});
			}
		} else {
			res.status(400).json({
				code: 1,
				message: validate.message
			});
		}
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al actualizar los datos'
		});
	}
}

const deleteProduct = async (req, res) => {
	try {
		const id = req.params.id;
		const deleteRowCount = await Product.destroy({
			where: {id}
		});
		res.status(204).json({
			code: 0,
			message: 'Producto eliminado con éxito'
		});
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al eliminar el producto'
		});
	}
}

//Obtener las imágenes de un producto
const getImagesByProduct = async (req, res) => {
	try {
		const id = req.params.id;
		const product = await Product.findOne({
			where: {id}
		});
		if(product) {
			const images = await product.getImages();
			if(images) {
				res.status(200).json(images);
			} else {
				res.status(404).json({
					code: 1,
					message: 'No se encontró imágenes para el producto especificado'
				});
			}
		} else {
			res.status(404).json({
				code: 1,
				message: 'No se econtró producto con el id especificado'
			});
		}
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al obtener las imágenes del producto indicado'
		});
	}
}


const validateInputs = (inputs) => {
	let response = { code: 0, message: "Campos correctos" };
	//Validar que sean requeridos
	if (!required(inputs.name)) {
		response.code = 1;
		response.message = "El nombre del producto es requerido";
		return response;
	}
	if (!required(inputs.slug)) {
		response.code = 1;
		response.message = "El slug del producto es requerido";
		return response;
	}
	/*if (!inputs.price || inputs.price.length === 0) {
		response.code = 1;
		response.message = "El precio del producto es requerido";
		return response;
	}
	if (isNaN(inputs.price)) {
		response.code = 1;
		response.message = "El precio del producto debe ser un número válido";
		return response;
	}*/

	return response;
}

const getPagination = (page, size) => {
/*limit = size
  offset = (page - 1) * size*/
  const limit = size ? +size : 100;
  const offset = page ? (page -1) * limit : 0;
  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
	const { count: totalItems, rows: products } = data;
	const currentPage = page ? +page : 1;
	const totalPages = Math.ceil(totalItems / limit);
	return { totalItems, products, totalPages, currentPage };
};

const required = (val) => val && val.length;

module.exports = {
	createProduct,
	getProducts,
	getProductById,
	updateProduct,
	deleteProduct,
	getImagesByProduct
}