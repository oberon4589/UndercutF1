const Sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require('../categories/Category');

const Article = connection.define('articles',{
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },slug:{ // slug é um nome amigável para URL
        type: Sequelize.STRING,
        allowNull: false
    },body:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Category.hasMany(Article); // uma categoria tem muitos artigos
Article.belongsTo(Category); // um artigo pertence a uma categoria

/*Article.sync({force: false});*/ // força a criação da tabela no banco de dados 

module.exports = Article; // agora pode exportar o model Category para ser usado em outros arquivos