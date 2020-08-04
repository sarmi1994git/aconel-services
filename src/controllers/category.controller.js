const Category = require('../models/Category');
const Product = require('../models/Product');
const Image = require('../models/Image');
const slugurl = require('slug');

const createCategory = async (req, res) => {
	const { name, slug, description } = req.body
	const validate = validateInputs({ name, slug });
	if (validate.code === 0) {
		try {
			let newCategory = await Category.create({
				name,
				slug: slugurl(slug),
				description
			}, {
				fields: ['name', 'slug', 'description']
			});
			if (newCategory) {
				res.status(201).json({
					code: 0, 
					message: 'categoría creada',
					data: newCategory
				});
			}
		} catch(e) {
			console.log(e);
			res.status(500).json({
				code: 1,
				message: 'Error al crear la categoría'
			});
		}
		
	} else {
		res.status(400).json({
			code: 1,
			message: validate.message
		});
	}
}

const getCategories = async (req, res) => {
	try {
		const categories = await Category.findAll();
		res.status(200).json(categories);
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al consultar los datos'
		});
	}
	
}

const getCategoryById = async (req, res) => {
	try {
		const id = req.params.id;
		const category = await Category.findOne({
			where: {
				id
			}
		});
		if (category) {
			res.status(200).json(category);
		} else {
			res.status(404).json({
				code: 1,
				message: 'No se encontró la categoría con el id especificado'
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

const getCategoryBySlug = async (req, res) => {
	try {
		const slug = req.params.slug;
		const category = await Category.findOne({
			where: {slug},
			include: Product
		});
		if (category) {
			res.status(200).json(category);
		} else {
			res.status(404).json({
				code: 1,
				message: 'No se encontró la categoría con el slug especificado'
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

const updateCategory = async (req, res) =>{
	try {
		const id = req.params.id;
		const { name, slug, description } = req.body;
		const validate = validateInputs({ name, slug });
		if (validate.code === 0) {
			const category = await Category.findOne({
				attributes: ['id', 'name', 'slug', 'description'],
				where: {
					id
				}
			});
			if (category) {
				const updateCategory = await Category.update({
					name,
					slug: slugurl(slug),
					description
				}, {
					where: {id}
				});
				res.status(200).json({
					code: 0,
					message: 'Categoría actualizada con éxito',
					data: { name, slug, description }
				});
			} else {
				res.status(404).json({
					code: 1,
					message: 'Categoría no encontrada'
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

const deleteCategory = async (req, res) => {
	try {
		const id = req.params.id;
		const deleteRowCount = Category.destroy({
			where: {
				id
			}
		});
		res.status(204).json({
			code: 0,
			message: 'Categoría eliminada con éxito'
		});
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al eliminar la categoría'
		});
	}
}

const getProductsByCategory = async (req, res) => {
	try {
		const categoryId = req.params.id;
		const { page, size } = req.query;
		const { limit, offset } = getPagination(page, size);
		const products = await Product.findAndCountAll({
			where: {category_id: categoryId},
			attributes: ['id', 'name', 'slug', 'description', 'price', 'category_id'],
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
			message: 'Error al obtener los productos de la categoría especificada'
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
	const { count: totalItems, rows: products } = data;
	const currentPage = page ? +page : 1;
	const totalPages = Math.ceil(totalItems / limit);
	return { totalItems, products, totalPages, currentPage };
};

const validateInputs = (inputs) => {
	let response = { code: 0, message: "Campos correctos" };
	//Validar que sean requeridos
	if (!required(inputs.name)) {
		response.code = 1;
		response.message = "El nombre de la categoría es requerido";
		return response;
	}
	if (!required(inputs.slug)) {
		response.code = 1;
		response.message = "El slug de la categoría es requerido";
		return response;
	}
	return response;
}

const required = (val) => val && val.length;

module.exports = {
	getCategories,
	createCategory,
	getCategoryById,
	getCategoryBySlug,
	getProductsByCategory,
	deleteCategory,
	updateCategory
}