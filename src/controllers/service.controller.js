const Service = require('../models/Service');
const Image = require('../models/Image');

const createService = async (req, res) => {
	try {
		//images debe ser un arreglo de objetos javascript
		const { name, description, position, images } = req.body;
		const validate = validateInputs({name: name, position: position});
		if (validate.code === 0) {
			let newService = await Service.create({
				name,
				description,
				position
			}, {
				fields: ['name', 'description', 'position']
			});
			//insertar imagenes, relacion muchos a muchos
			if (images) {
				const imagesBd = [];
				for(i = 0; i < images.length; i++) {
					const imagebd = await Image.findOne({
						where: {id: images[i].id}
					});
					imagesBd.push(imagebd);
				}
				await newService.setImages(imagesBd);
			}
			res.status(201).json({
				code: 0, 
				message: 'servicio creado con éxito',
				data: newService
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
			message: 'Error al crear el servicio'
		});
	}
}

const getServices = async (req, res) => {
	try {
		const { page, size } = req.query;
		const { limit, offset } = getPagination(page, size);
		const services = await Service.findAndCountAll({
			attributes: ['id', 'name', 'description', 'position'],
			order: [
				['position', 'ASC']
			],
			limit,
			offset,
			include: Image
		});
		const response = getPagingData(services, page, limit);
		res.status(200).json(response);
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al obtener datos'
		});
	}
}

const getServiceById = async (req, res) => {
	try {
		const id = req.params.id;
		const service = await Service.findOne({
			where: {id},
			include: Image
		});
		if (service) {
			res.status(200).json(service);
		} else {
			res.status(404).json({
				codde: 1,
				message: 'No se encontró el servicio con el id especificado'
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

const updateService = async (req, res) => {
	try{
		const id = req.params.id;
		const { name, description, position, images } = req.body;
		const validate = validateInputs({name: name, position: position});
		if (validate.code === 0) {
			const service = await Service.findOne({
				where: {id}
			});
			if (service) {
				const updateService = await Service.update({
					name,
					description,
					position
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
					await service.setImages(imagesBd);
				}
				res.status(200).json({
					code: 0,
					message: 'Servicio actualizado con éxito',
					data: { name, description }
				});
			} else {
				res.status(404).json({
					code: 1,
					message: 'Servicio no encontrado'
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

const deleteService = async (req, res) => {
	try {
		const id = req.params.id;
		const deleteRowCount = await Service.destroy({
			where: {id}
		});
		res.status(204).json({
			code: 0,
			message: 'Servicio eliminado con éxito'
		});
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al eliminar el servicio'
		});
	}
}


const validateInputs = (inputs) => {
	let response = { code: 0, message: "Campos correctos" };
	//Validar que sean requeridos
	if (!inputs.name || inputs.name.length === 0) {
		response.code = 1;
		response.message = "El nombre del servicio es requerido";
		return response;
	}
	if (!inputs.position) {
		response.code = 1;
		response.message = "El campo position es requerido y debe ser mayor de 0";
		return response;
	}
	if (!Number.isInteger(inputs.position) || inputs.position <= 0) {
		response.code = 1;
		response.message = "El campo position debe ser un número entero mayor a cero";
		return response;
	}
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
	const { count: totalItems, rows: services } = data;
	const currentPage = page ? +page : 1;
	const totalPages = Math.ceil(totalItems / limit);
	return { totalItems, services, totalPages, currentPage };
};

module.exports = {
	createService,
	getServices,
	getServiceById,
	updateService,
	deleteService
}