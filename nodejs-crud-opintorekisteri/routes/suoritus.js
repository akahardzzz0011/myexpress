var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display suoritus page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM Suoritus ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/suoritus/index.ejs
            res.render('suoritus',{data:''});   
        } else {
            // render to views/suoritus/index.ejs
            res.render('suoritus',{data:rows});
        }
    });
});

// display add suoritus page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('suoritus/add', {
        Etunimi: '',
        Sukunimi: '',
	Nimi: '',
	Arvosana: '',
	Koodi: ''
    })
})

// add a new suoritus
router.post('/add', function(req, res, next) {    

    let Etunimi = req.body.Etunimi;
    let Sukunimi = req.body.Sukunimi;
    let Nimi = req.body.Nimi;
    let Arvosana = req.body.Arvosana;
    let Koodi = req.body.Koodi;
    let errors = false;

    if(Etunimi.length === 0 || Sukunimi.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter values");
        // render to add.ejs with flash message
        res.render('suoritus/add', {
            Etunimi: Etunimi,
            Sukunimi: Sukunimi,
	    Nimi: Nimi,
	    Arvosana: Arvosana,
	    Koodi: Koodi
        })
    }

    // if no error
    if(!errors) {

        var form_data = {

            Etunimi: Etunimi,
            Sukunimi: Sukunimi,
	    Nimi: Nimi,
	    Arvosana: Arvosana,
	    Koodi: Koodi
        }
        
        // insert query
        dbConn.query('INSERT INTO Suoritus SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('suoritus/add', {
 
            Etunimi: form_data.Etunimi,
            Sukunimi: form_data.Sukunimi,
	    Nimi: form_data.Nimi,
	    Arvosana: form_data.Arvosana,
	    Koodi: form_data.Koodi
                })
            } else {
                req.flash('success', 'Suoritus successfully added');
                res.redirect('/suoritus');
            }
        })
    }
})

// display edit suoritus page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM Suoritus WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if suoritus not found
        if (rows.length <= 0) {
            req.flash('error', 'Suoritus not found with id = ' + id)
            res.redirect('/suoritus')
        }
        // if suoritus found
        else {
            // render to edit.ejs
            res.render('suoritus/edit', {
                title: 'Edit Suoritus', 
                id: rows[0].id,
                Etunimi: rows[0].Etunimi,
		Sukunimi: rows[0].Sukunimi,
		Nimi: rows[0].Nimi,
		Arvosana: rows[0].Arvosana,
		Koodi: rows[0].Koodi
            })
        }
    })
})

// update suoritus data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let Etunimi = req.body.Etunimi;
    let Sukunimi = req.body.Sukunimi;
    let Nimi = req.body.Nimi;
    let Arvosana = req.body.Arvosana;
    let Koodi = req.body.Koodi;
    let errors = false;

    if(Etunimi.length === 0 || Sukunimi.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter names");
        // render to add.ejs with flash message
        res.render('suoritus/edit', {
            id: req.params.id,
            Etunimi: Etunimi,
            Sukunimi: Sukunimi,
	    Nimi: Nimi,
	    Arvosana: Arvosana,
	    Koodi: Koodi
       })
  }

   	//if no error
    if( !errors ) {   
 
        var form_data = {
            Etunimi: Etunimi,
            Sukunimi: Sukunimi,
	    Nimi: Nimi,
	    Arvosana: Arvosana,
	    Koodi: Koodi
        }
        // update query
        dbConn.query('UPDATE Suoritus SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('suoritus/edit', {
                    id: req.params.id,
                    Etunimi: form_data.Etunimi,
                    Sukunimi: form_data.Sukunimi,
		    Nimi: form_data.Nimi,
		    Arvosana: form_data.Arvosana,
		    Koodi: form_data.Koodi
                })
            } else {
                req.flash('success', 'Suoritus successfully updated');
                res.redirect('/suoritus');
            }
        })
    }
})
   
// delete Suoritus
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM Suoritus WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to suoritus page
            res.redirect('/suoritus')
        } else {
            // set flash message
            req.flash('success', 'Suoritus successfully deleted! ID = ' + id)
            // redirect to suoritus page
            res.redirect('/suoritus')
        }
    })
})

module.exports = router;
