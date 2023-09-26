const db = require('../database/models');

const moment = require('moment')

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        return res.render('moviesAdd')
        // TODO   
    },
    create: function (req, res) {

        const {title,rating,awards,release_date,length} = req.body
        db.Movie.create({
            title : title.trim(),
            rating,
            awards,
            release_date,
            length
        })
        .then(movie =>{
            console.log(movie);
            return res.redirect('/movies')
        })
        .catch(error => console.log (error))
        /* return res.send(req.body) */
        // TODO
    },
    edit: function(req, res) {
        db.Movie.findByPk(req.params.id)
        .then(movie =>{
            return res.render('moviesEdit',{
                Movie : movie,
                moment
            })          
        })
        .catch(error => console.log (error))
         
        // TODO
    },
    update: function (req,res) {
        const {title,rating,awards,release_date,length} = req.body
        db.Movie.update({
            title : title.trim(),
            rating,
            awards,
            release_date,
            length

        },
        {
            where :{
                id : req.params.id
            }
        }
       ).then(response =>{
        console.log (response);
        db.Movie.findByPk(req.params.id)
        .then(movie =>{
            return res.render('moviesDetail',{
                movie
            })
        })
       })
       .catch(error => console.log(error))
       //return res.send(req.body)
       res.redirect('/moviesList')
        // TODO
    },
    delete: function (req, res) {
       
        db.Movie.findByPk(req.params.id)
        .then(movie=>{
            return res.render('moviesDelete',{
                Movie :movie
            })
        })
        .catch(error => console.log(error))
        // TODO
    },
    destroy: function (req, res) {
        db.Movie.destroy({
            where : {id :req.params.id}
        })
        .then(()=>{
            res.redirect('/movies')
        })
        .catch( error => console.log(error))
        
        // TODO
    }

}

module.exports = moviesController;