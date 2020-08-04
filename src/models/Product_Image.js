const Sequelize = require('sequelize');
const { sequelize } = require('../database/database');

const Product_Image = sequelize.define('products_images',{
	product_id: {
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

module.exports = Product_Image;
