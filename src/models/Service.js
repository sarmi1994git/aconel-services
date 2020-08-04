const Sequelize = require('sequelize');
const { sequelize } = require('../database/database');
const Image = require('./Image');
const Service_Image = require('./Service_Image');

const Service = sequelize.define('services', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	name: {
		type: Sequelize.STRING
	},
	description: {
		type: Sequelize.STRING
	},
	position: {
		type: Sequelize.INTEGER,
	}
},  {
	timestamps: false
});

//esto añade funciones adicionales como
//service.addImage, service.getImages ... etc
Service.belongsToMany(Image, {through: Service_Image, foreignKey: 'service_id', onDelete: 'CASCADE'});
Image.belongsToMany(Service, {through: Service_Image, foreignKey: 'image_id', onDelete: 'CASCADE'});

module.exports = Service;