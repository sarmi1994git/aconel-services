const Sequelize = require('sequelize');
const { sequelize } = require('../database/database');

const Image = sequelize.define('images', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	filename: {
		type: Sequelize.STRING
	},
	title: {
		type: Sequelize.STRING
	},
	mimetype: {
		type: Sequelize.STRING
	},
	size: {
		type: Sequelize.INTEGER
	},
	category: {
		type: Sequelize.STRING
	},
	description: {
		type: Sequelize.STRING
	},
	alt: {
		type: Sequelize.STRING
	},
	src: {
		type: Sequelize.STRING
	}
}, {
	timestamps: false
});

module.exports = Image;