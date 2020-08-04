const Contact = require('../models/Contact');

const createContact = async (req, res) => {
	try {
		const { firstname, lastname, telnum, email, agree, contactType, message } = req.body;
		const validate = validateInputs({ firstname, lastname, telnum, email, agree, contactType, message });
		if (validate.code === 0) {
			let newContact = await Contact.create({
				firstname,
				lastname,
				telnum,
				email,
				agree,
				contactType,
				message
			}, {
				fields: ['firstname', 'lastname', 'telnum', 'email', 'agree', 'contactType', 'message']
			});
			res.status(201).json({
				code: 0, 
				message: 'Contacto creado con éxito',
				data: newContact
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
			message: 'Error al crear contacto'
		});
	}
}

const getContacts = async (req, res) => {
	try {
		const contacts = await Contact.findAll();
		res.status(200).json(contacts);
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al obtener datos'
		});
	}
}

const getContactById = async (req, res) => {
	try {
		const id = req.params.id;
		const contact = await Contact.findOne({
			where: {id}
		});
		if (contact) {
			res.status(200).json(contact);
		} else {
			res.status(404).json({
				code: 1,
				message: 'No se encontró contacto  con el id especificado'
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

const updateContact = async (req, res) => {
	try {
		const id = req.params.id;
		const { firstname, lastname, telnum, email, agree, contactType, message } = req.body;
		const validate = validateInputs({ firstname, lastname, telnum, email, agree, contactType, message });
		if (validate.code === 0) {
			const contact = await Contact.findOne({
				where: {id}
			});
			if (contact) {
				const updatedContact = await Contact.update({
					firstname,
					lastname,
					telnum,
					email,
					agree,
					contactType,
					message
				}, {
					where: {id}
				});
				res.status(200).json({
					code: 0,
					message: 'Contacto actualizado con éxito',
					data: { firstname, lastname, telnum, email, agree, contactType, message }
				});
			} else {
				res.status(404).json({
					code: 1,
					message: 'No se encontró contacto con el id especificado'
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
			message: 'Error al actualizar datos'
		});
	}
}

const deleteContact = async (req, res) => {
	try {
		const id = req.params.id;
		const deleteRowCount =  await Contact.destroy({
			where: {id}
		});
		res.status(204).json({
			code: 0,
			message: 'Contacto eliminado con éxito'
		});
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al eliminar contacto'
		});
	}
}

const validateInputs = (inputs) => {
	let response = { code: 0, message: "Campos correctos" };
	//Validar de campo firstname (requerido, minLength y maxLength)
	if (!required(inputs.firstname)) {
		response.code = 1;
		response.message = "El nombre es requerido";
		return response;
	}
	if (!minLength(3, inputs.firstname)) {
		response.code = 1;
		response.message = "El nombre debe tener más de 2 caracteres";
		return response;
	}
	if (!maxLength(20, inputs.firstname)) {
		response.code = 1;
		response.message = "El nombre debe tener 20 caracteres o menos";
		return response;
	}
	//Validar de campo lastname (requerido, minLength y maxLength)
	if (!required(inputs.lastname)) {
		response.code = 1;
		response.message = "El apellido es requerido";
		return response;
	}
	if (!minLength(3, inputs.lastname)) {
		response.code = 1;
		response.message = "El apellido debe tener más de 2 caracteres";
		return response;
	}
	if (!maxLength(20, inputs.lastname)) {
		response.code = 1;
		response.message = "El apellido debe tener 20 caracteres o menos";
		return response;
	}
	//Validar de campo telnum (requerido, minLength y maxLength, isNumber)
	if (!required(inputs.telnum)) {
		response.code = 1;
		response.message = "El número de teléfono es requerido";
		return response;
	}
	if (!minLength(7, inputs.telnum)) {
		response.code = 1;
		response.message = "El número de teléfono debe tener al menos 7 caracters";
		return response;
	}
	if (!maxLength(10, inputs.telnum)) {
		response.code = 1;
		response.message = "El número de teléfono debe tener máximo 10 caracteres";
		return response;
	}
	if (!isNumber(inputs.telnum)) {
		response.code = 1;
		response.message = "El número de teléfono no es válido";
		return response;
	}
	//Validar de campo email (requerido, validEmail)
	if (!required(inputs.email)) {
		response.code = 1;
		response.message = "El email es requerido";
		return response;
	}
	if (!validEmail(inputs.email)) {
		response.code = 1;
		response.message = "Dirección de email inválida";
		return response;
	}
	

	return response;
}

const required = (val) => val && val.length;
const maxLength = (len, val) => !(val) || (val.length <= len);
const minLength = (len, val) => (val) && (val.length >= len);
const isNumber = (val) => !isNaN(Number(val));
const validEmail = (val) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val);

module.exports = {
	createContact,
	getContacts,
	deleteContact,
	getContactById,
	updateContact
}