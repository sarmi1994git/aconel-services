const Sequelize = require('sequelize');
const { sequelize } = require('../database/database');
const Image = require('./Image');
const Product_Image = require('./Product_Image');

const Product = sequelize.define('products', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	category_id: {
		type: Sequelize.INTEGER
	},
	name: {
		type: Sequelize.STRING
	},
	slug: {
		type: Sequelize.STRING,
		unique: true
	},
	description: {
		type: Sequelize.STRING
	},
	price: {
		type: Sequelize.DECIMAL(10, 2)
	},
	featuredImageId: {
		type: Sequelize.INTEGER,
		field: 'featured_image_id'
	}
}, {
	timestamps: false
});

//esto añade funciones adicionales como
//product.addImage, product.getImages ... etc
Product.belongsToMany(Image, {through: Product_Image, foreignKey: 'product_id', onDelete: 'CASCADE'});
Image.belongsToMany(Product, {through: Product_Image, foreignKey: 'image_id', onDelete: 'CASCADE'});

/*Relacion uno a muchos entre Productos e imágenes*/
Image.hasMany(Product, { foreignKey: 'featured_image_id'});
Product.belongsTo(Image, { foreignKey: 'featured_image_id', as: 'featuredImage' }); /*El 'as' es como se conocerá a la relacion cunado quiera hacer include de modelos en las consultas*/

module.exports = Product;