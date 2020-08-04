const Sequelize = require('sequelize');
const { sequelize } = require('../database/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('users', {
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
	email: {
		type: Sequelize.STRING
	},
	username: {
		type: Sequelize.STRING
	},
	password: {
		type: Sequelize.STRING
	}
}, {
	timestamps: false
});

// instance methods are defined on the model's .prototype
User.prototype.validPassword = function (password) {
	return bcrypt.compare(password, this.password);
}

module.exports = User;