const express = require("express");
const router = express.Router();
const Category = require ("../categories/Category");
const Article = require ("./Article");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth")

router.get("/admin/articles", adminAuth, (req,res) => {
    Article.findAll({
        include: [{model: Category}]    // diz para o model Article que ele deve incluir o model Category
    }).then(articles => {
        res.render("admin/articles/index", {articles : articles})
    });
});

router.get("/admin/articles/new", adminAuth, (req,res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", {categories : categories})
    });
});

router.post("/articles/save", adminAuth, (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;
    
    Article.create({ 
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles");
    });
});

router.post("/articles/delete", adminAuth, (req,res) => {
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){    
            Article.destroy({  // Metodo destroy() deleta um registro do banco de dados, nesse caso está deletando o artigo com o id passado
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/articles");
            });
        }else{ // se o id for igual a NaN
            res.redirect("/admin/articles");
        }
    }else{ // se o id for igual a undefined
        res.redirect("/admin/articles");
    }
});

router.get("/admin/articles/edit/:id", adminAuth, (req,res) => {
    var id = req.params.id;
    Article.findByPk(id).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {categories: categories, article: article})
            })
            }else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});

router.post("/articles/update", adminAuth, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category

    Article.update({title: title, body: body, categoryId: category, slug: slugify(title)},{
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(err => {
        res.redirect("/");
    });
});

//paginação de artigos
router.get("/articles/page/:num", (req, res) => {
    var page = req.params.num;
    var offset = 0;

    if(isNaN(page) || page == 1 ){ // se o parametro passado não for um número
        offset = 0;
    } else {
        offset = (parseInt(page) -1) * 5; // multiplica o número da página por 5 para saber o offset, é necessario subtrair 1 do número da página para que a primeira página não tenha offset
    }

    Article.findAndCountAll({
        limit: 5, // limita a quantidade de artigos por página
        offset: offset,
        order: [
            ['id', 'DESC'] //Ordena os artigos por ordem decrescente
        ]
    }).then(articles => {
        var next;
        if(offset + 5 >= articles.count){
            next = false;
        }else{
            next = true;
        }   // se o offset + 5 for maior ou igual a quantidade de artigos, não tem próxima página. Significa que está na última página

        var result = {
            page: parseInt(page), // converte o número da página para inteiro
            next: next,
            articles: articles,
        }
        Category.findAll().then(categories => {
            res.render("admin/articles/page", {result: result, categories: categories})
        })
    })
});

module.exports = router;