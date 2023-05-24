const Sequelize = require('sequelize');
const connection = require('../database/database');

const Category = connection.define('categories',{
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },slug:{ // slug é um nome amigável para URL
        type: Sequelize.STRING,
        allowNull: false
    }
});

/*Category.sync({force: false});*/ // força a criação da tabela no banco de dados

module.exports = Category; // agora pode exportar o model Category para ser usado em outros arquivos