const Sequelize = require('sequelize');
const { sequelize } = require('../database/database');

const Service_Image = sequelize.define('services_images',{
	service_id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	image_id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	}
},{
	timestamps: false
});

module.exports = Service_Image;
