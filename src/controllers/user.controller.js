const { required, maxLength, minLength, isNumber, validEmail } = require('../validations/validations');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const Op = require('sequelize').Op;

const createUser = async (req, res) => {
	try {
		let { firstname, lastname, email, username, password } = req.body;
		const validate = validateInputs({ firstname, lastname, email, username, password });
		if (validate.code === 0) {
			const userdb = await User.findOne({
				where:{
					[Op.or]: [{email}, {username}]
				}
			});
			if (!userdb) {
				password = await encryptPassword(password);
				const newUser = await User.create({
					firstname,
					lastname,
					email,
					username,
					password
				}, {
					fields: ['firstname', 'lastname', 'email', 'username', 'password']
				});
				res.status(201).json({
					code: 0,
					message: 'Usuario creado con éxito',
					data: newUser
				});
			} else {
				res.status(400).json({
					code: 1,
					message: 'Email o username ya existe'
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
			message: 'Error al crear usuario'
		});
	}
}

const login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({
			where: {username}
		});
		if (user) {
			const passwordIsValid = await user.validPassword(password);
			if (passwordIsValid) {
				const token = jwt.sign({id: user.id, username: user.username}, config.secret, {
					expiresIn: 60 * 60
				});
				res.status(200).json({
					code: 0,
					message: 'Autenticación exitosa',
					token: token
				});
			} else {
				res.status(401).json({
					code: 1,
					message: 'Contraseña inválida',
					token: null
				});
			}
		} else {
			res.status(404).json({
				code: 1,
				message: 'Usuario no existe',
				token: null
			});
		}


	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error en login de usuario',
			token: null
		});
	}
}

const getUsers = async (req, res) => {
	try {
		const users = await User.findAll({
			attributes: ['id', 'firstname', 'lastname', 'email', 'username']
		});
		res.status(200).json(users);
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al obtener los datos'
		});
	}
}

const getUserById = async (req, res) => {
	try {
		const id = req.params.id;
		const user = await User.findOne({
			where:{id},
			attributes: ['id', 'firstname', 'lastname', 'email', 'username']
		});
		if (user) {
			res.status(200).json(user);
		} else {
			res.status(404).json({
				code: 1,
				message: 'Usuario no encontrado'
			});
		}

	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al obtener los datos'
		});
	}
}

const updateUser = async (req, res) => {
	try {
		const id = req.params.id;
		let { firstname, lastname, email, username, password } = req.body;
		const validate = validateInputs({ firstname, lastname, email, username, password });
		if (validate.code === 0) {
			const user = await User.findOne({
				where: {id}
			});
			if (user) {
				password = await encryptPassword(password);
				const updatedUser = User.update({
					firstname,
					lastname,
					email,
					username,
					password
				}, {
					where: {id}
				});
				res.status(200).json({
					code: 0,
					message: 'Usuario actualizado con éxito',
					data: { firstname, lastname, email, username, password }
				});
			} else {
				res.status(404).json({
					code: 1,
					message: 'Usuario no encontrado'
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

const deleteUser = async (req, res) => {
	try {
		const id = req.params.id;
		const deleteRowCount = await User.destroy({
			where: {id}
		});
		res.status(204).json({
			code: 0,
			message: 'Usuario eliminado con éxito'
		});
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al eliminar los datos'
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

	//Validar campo username
	if (!required(inputs.username)) {
		response.code = 1;
		response.message = "El username es requerido";
		return response;
	}
	if (!minLength(3, inputs.username)) {
		response.code = 1;
		response.message = "El username debe tener más de 2 caracteres";
		return response;
	}
	if (!maxLength(20, inputs.username)) {
		response.code = 1;
		response.message = "El username debe tener 20 caracteres o menos";
		return response;
	}

	//Validar campo password
	if (!required(inputs.password)) {
		response.code = 1;
		response.message = "El password es requerido";
		return response;
	}
	if (!minLength(5, inputs.password)) {
		response.code = 1;
		response.message = "El password debe tener más de 5 caracteres";
		return response;
	}
	if (!maxLength(20, inputs.password)) {
		response.code = 1;
		response.message = "El password debe tener 20 caracteres o menos";
		return response;
	}
	return response;
}

const encryptPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

module.exports = {
	createUser,
	login,
	getUsers,
	getUserById,
	updateUser,
	deleteUser
}
