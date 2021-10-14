var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display opiskelija page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM Opiskelija ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/opiskelija/index.ejs
            res.render('opiskelija',{data:''});   
        } else {
            // render to views/opiskelija/index.ejs
            res.render('opiskelija',{data:rows});
        }
    });
});

// display add opiskelija page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('opiskelija/add', {
        Etunimi: '',
        Sukunimi: '',
	Osoite: '',
	Luokkatunnus: ''
    })
})

// add a new opiskelija
router.post('/add', function(req, res, next) {    

    let Etunimi = req.body.Etunimi;
    let Sukunimi = req.body.Sukunimi;
    let Osoite = req.body.Osoite;
    let Luokkatunnus = req.body.Luokkatunnus;
    let errors = false;

    if(Etunimi.length === 0 || Sukunimi.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter values");
        // render to add.ejs with flash message
        res.render('opiskelija/add', {
            Etunimi: Etunimi,
            Sukunimi: Sukunimi,
	    Osoite: Osoite,
	    Luokkatunnus: Luokkatunnus
        })
    }

    // if no error
    if(!errors) {

        var form_data = {

            Etunimi: Etunimi,
            Sukunimi: Sukunimi,
	    Osoite: Osoite,
	    Luokkatunnus: Luokkatunnus
        }
        
        // insert query
        dbConn.query('INSERT INTO Opiskelija SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('opiskelija/add', {
 
            Etunimi: form_data.Etunimi,
            Sukunimi: form_data.Sukunimi,
	    Osoite: form_data.Osoite,
	    Luokkatunnus: form_data.Luokkatunnus
                })
            } else {
                req.flash('success', 'Opiskelija successfully added');
                res.redirect('/opiskelija');
            }
        })
    }
})

// display edit opiskelija page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM Opiskelija WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if opiskelija not found
        if (rows.length <= 0) {
            req.flash('error', 'Opiskelija not found with id = ' + id)
            res.redirect('/opiskelija')
        }
        // if opiskelija found
        else {
            // render to edit.ejs
            res.render('opiskelija/edit', {
                title: 'Edit Opiskelija', 
                id: rows[0].id,
                Etunimi: rows[0].Etunimi,
		Sukunimi: rows[0].Sukunimi,
		Osoite: rows[0].Osoite,
		Luokkatunnus: rows[0].Luokkatunnus
            })
        }
    })
})

// update opiskelija data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let Etunimi = req.body.Etunimi;
    let Sukunimi = req.body.Sukunimi;
    let Osoite = req.body.Osoite;
    let Luokkatunnus = req.body.Luokkatunnus
    let errors = false;

    if(Etunimi.length === 0 || Sukunimi.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter names");
        // render to add.ejs with flash message
        res.render('opiskelija/edit', {
            id: req.params.id,
            Etunimi: Etunimi,
            Sukunimi: Sukunimi,
	    Osoite: Osoite,
	    Luokkatunnus: Luokkatunnus
       })
  }

   	//if no error
    if( !errors ) {   
 
        var form_data = {
            Etunimi: Etunimi,
            Sukunimi: Sukunimi,
	    Osoite: Osoite,
	    Luokkatunnus: Luokkatunnus
        }
        // update query
        dbConn.query('UPDATE Opiskelija SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('opiskelija/edit', {
                    id: req.params.id,
                    Etunimi: form_data.Etunimi,
                    Sukunimi: form_data.Sukunimi,
		    Osoite: form_data.Osoite,
		    Luokkatunnus: form_data.Luokkatunnus
                })
            } else {
                req.flash('success', 'Opiskelija successfully updated');
                res.redirect('/opiskelija');
            }
        })
    }
})
   
// delete Opiskelija
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM Opiskelija WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to opiskelija page
            res.redirect('/opiskelija')
        } else {
            // set flash message
            req.flash('success', 'Opiskelija successfully deleted! ID = ' + id)
            // redirect to opiskelija page
            res.redirect('/opiskelija')
        }
    })
})

module.exports = router;
