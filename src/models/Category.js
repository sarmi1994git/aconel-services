const Sequelize = require('sequelize');
const { sequelize } = require('../database/database');
const Product = require('./Product');

const Category = sequelize.define('categories', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	name: {
		type: Sequelize.STRING
	},
	slug: {
		type: Sequelize.STRING,
		unique: true
	},
	description: {
		type: Sequelize.TEXT
	}
}, {
	timestamps: false
});

Category.hasMany(Product, { foreignKey: 'category_id', sourceKey: 'id'});
Product.belongsTo(Category, { foreignKey: 'category_id', targetKey: 'id'})

module.exports = Category;