var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display opintojakso page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM Opintojakso ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/opintojakso/index.ejs
            res.render('opintojakso',{data:''});   
        } else {
            // render to views/opintojakso/index.ejs
            res.render('opintojakso',{data:rows});
        }
    });
});

// display add opintojakso page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('opintojakso/add', {
        Koodi: '',
        Laajuus: '',
	Nimi: ''
    })
})

// add a new opintojakso
router.post('/add', function(req, res, next) {    

    let Koodi = req.body.Koodi;
    let Laajuus = req.body.Laajuus;
    let Nimi = req.body.Nimi;
    let errors = false;

    if(Nimi.length === 0 || Koodi.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter values");
        // render to add.ejs with flash message
        res.render('opintojakso/add', {
            Koodi: Koodi,
            Laajuus: Laajuus,
	    Nimi: Nimi
        })
    }

    // if no error
    if(!errors) {

        var form_data = {

            Koodi: Koodi,
            Laajuus: Laajuus,
	    Nimi: Nimi
        }
        
        // insert query
        dbConn.query('INSERT INTO Opintojakso SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('opintojakso/add', {
 
            Koodi: form_data.Koodi,
            Laajuus: form_data.Laajuus,
	    Nimi: form_data.Nimi
                })
            } else {
                req.flash('success', 'Opintojakso successfully added');
                res.redirect('/opintojakso');
            }
        })
    }
})

// display edit opintojakso page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM Opintojakso WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if opintojakso not found
        if (rows.length <= 0) {
            req.flash('error', 'Opintojakso not found with id = ' + id)
            res.redirect('/opintojakso')
        }
        // if opintojakso found
        else {
            // render to edit.ejs
            res.render('opintojakso/edit', {
                title: 'Edit Opintojakso', 
                id: rows[0].id,
                Koodi: rows[0].Koodi,
		Laajuus: rows[0].Laajuus,
		Nimi: rows[0].Nimi
            })
        }
    })
})

// update opiskelija data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let Koodi = req.body.Koodi;
    let Laajuus = req.body.Laajuus;
    let Nimi = req.body.Nimi;
    let errors = false;

    if(Koodi.length === 0 || Nimi.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter values");
        // render to add.ejs with flash message
        res.render('opintojakso/edit', {
            id: req.params.id,
            Koodi: Koodi,
            Laajuus: Laajuus,
	    Nimi: Nimi
       })
  }

   	//if no error
    if( !errors ) {   
 
        var form_data = {
            Koodi: Koodi,
            Laajuus: Laajuus,
	    Nimi: Nimi
        }
        // update query
        dbConn.query('UPDATE Opintojakso SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('opintojakso/edit', {
                    id: req.params.id,
                    Koodi: form_data.Koodi,
                    Laajuus: form_data.Laajuus,
		    Nimi: form_data.Nimi
                })
            } else {
                req.flash('success', 'Opintojakso successfully updated');
                res.redirect('/opintojakso');
            }
        })
    }
})
   
// delete Opintojakso
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM Opintojakso WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to opintojakso page
            res.redirect('/opintojakso')
        } else {
            // set flash message
            req.flash('success', 'Opintojakso successfully deleted! ID = ' + id)
            // redirect to opintojakso page
            res.redirect('/opintojakso')
        }
    })
})

module.exports = router;
