const express = require('express'); // importa o express
const app = express();
const bodyParser = require('body-parser'); // importa o body-parser para pegar os dados do formulário
const connection = require('./database/database'); // importa o arquivo database.js
const session = require('express-session'); // importa o express-session para criar sessões

// controllers
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./users/UsersController');

// models
const Article = require('./articles/Article'); // importa o model Article
const Category = require('./categories/Category'); // importa o model Category
const User = require('./users/User'); // importa o model User

// view engine
app.set('view engine', 'ejs');

// sessions
app.use(
    session({
        secret: 'X^%9c2E!g*#45aQ1',
        cookie: { maxAge: 10800000 }, // chave secreta para gerar a sessão
    })
);

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// static
app.use(express.static('public'));

//database
connection
    .authenticate()
    .then(() => {
        console.log('Conexão feita com o banco de dados');
    })
    .catch((error) => {
        console.log(error);
    });

app.use('/', categoriesController); // importa o arquivo CategoriesController.js
app.use('/', articlesController); // importa o arquivo ArticlesController.js
app.use('/', usersController); // importa o arquivo UsersController.js

// routes
app.get('/session', (req, res) => {
    req.session.treinamento = 'Formação Node.js'; // cria uma sessão
    req.session.ano = 2023;
    req.session.email = 'oberon@gmail.com';
    req.session.user = {
        username: 'Oberon',
        email: 'oberon@gmail.com',
    };
    res.send('Sessão gerada'); //ao trabalhar se armazena os dados de uma forma global, assim é possível acessar os dados em qualquer parte da aplicação
});

app.get('/dashboard', (req, res) => {
    res.json({
        treinamento: req.session.treinamento,
        ano: req.session.ano,
        email: req.session.email,
        user: req.session.user,
    });
});

app.get('/', (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC'], //Ordena os artigos por ordem decrescente
        ],
        limit: 5, // limita a quantidade de artigos que serão exibidos na página inicial
    }).then((articles) => {
        Category.findAll().then((categories) => {
            res.render('index', { articles: articles, categories: categories });
        });
    });
});

app.get('/:slug', (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug,
        },
    })
        .then((article) => {
            if (article != undefined) {
                Category.findAll().then((categories) => {
                    res.render('article', {
                        article: article,
                        categories: categories,
                    });
                });
            } else {
                res.redirect('/'); // se não encontrar o artigo, redireciona para a página inicial
            }
        })
        .catch((err) => {
            res.redirect('/');
        });
});

app.get('/category/:slug', (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug,
        },
        include: [{ model: Article }], //para fazer o relacionamento entre as tabelas basta usar o include e passar o model que deseja relacionar, nesse caso o model Article
    })
        .then((category) => {
            if (category != undefined) {
                Category.findAll().then((categories) => {
                    res.render('index', {
                        articles: category.articles,
                        categories: categories,
                    }); //Só é possível acessar o articles porque foi feito o relacionamento entre as tabelas
                });
            } else {
                res.redirect('/');
            }
        })
        .catch((err) => {
            res.redirect('/');
        });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
