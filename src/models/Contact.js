const Sequelize = require('sequelize');
const { sequelize } = require('../database/database');

const Contact = sequelize.define('contacts', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	firstname: {
		type: Sequelize.STRING
	},
	lastname: {
		type: Sequelize.STRING
	},
	telnum: {
		type: Sequelize.STRING
	},
	email: {
		type: Sequelize.STRING
	},
	agree: {
		type: Sequelize.BOOLEAN
	},
	contactType: {
		type: Sequelize.STRING,
		field: 'contact_type'
	},
	message: {
		type: Sequelize.STRING
	}
}, {
	timestamps: false
});

module.exports = Contact;
