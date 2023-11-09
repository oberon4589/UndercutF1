const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/categories/new', adminAuth, (req, res) => {
    res.render('admin/categories/new');
});

router.post('/categories/save', adminAuth, (req, res) => {
    var title = req.body.title;
    if (title != undefined) {
        Category.create({
            title: title,
            slug: slugify(title), // slugify converte o título em uma string amigável para URL
        }).then(() => {
            res.redirect('/admin/categories');
        });
    } else {
        res.redirect('/admin/categories/new');
        ('');
    }
});

router.get('/admin/categories', adminAuth, (req, res) => {
    Category.findAll().then((categories) => {
        res.render('admin/categories/index', { categories: categories });
    });
});

router.post('/categories/delete', adminAuth, (req, res) => {
    var id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)) {
            Category.destroy({
                where: {
                    id: id,
                },
            }).then(() => {
                res.redirect('/admin/categories');
            });
        } else {
            // se o id for igual a NaN
            res.redirect('/admin/categories');
        }
    } else {
        // se o id for igual a undefined
        res.redirect('/admin/categories');
    }
});

router.get('/admin/categories/edit/:id', adminAuth, (req, res) => {
    var id = req.params.id;
    if (isNaN(id)) {
        res.redirect('/admin/categories'); // Se o id for seguido de uma string, redireciona para a página de categorias
    }
    Category.findByPk(id)
        .then((category) => {
            if (category != undefined) {
                res.render('admin/categories/edit', { category: category });
            } else {
                res.redirect('/admin/categories');
            }
        })
        .catch((error) => {
            res.redirect('/admin/categories');
        });
});

router.post('/categories/update', adminAuth, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;

    Category.update(
        { title: title, slug: slugify(title) },
        {
            //atualiza o slug junto com o título chamando o slug logo em seguida chamando o slugify
            where: {
                id: id, //atualiza o título da categoria pegando o id no metodo where
            },
        }
    ).then(() => {
        res.redirect('/admin/categories');
    });
});

module.exports = router;
