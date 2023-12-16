const Sequelize = require('sequelize');
const connection = require('../database/database');

const User = connection.define('users', {
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        // slug é um nome amigável para URL
        type: Sequelize.STRING,
        allowNull: false,
    },
});

/*User.sync({ force: false });*/ // força a criação da tabela no banco de dados

module.exports = User; // agora pode exportar o model Category para ser usado em outros arquivos
