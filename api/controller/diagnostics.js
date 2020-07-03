const Diagnostic = require('../models/diagnostic');
const mongoose = require('mongoose');


exports.diagnostics_add = (req, res, next) => {
    const diagnostics = new Diagnostic({
        _id: new mongoose.Types.ObjectId(),
        diagnostics: req.body.diagnostics
    });
    diagnostics.save()
        .then(result=> {
        res.status(200).json({
            message: 'Diagnostics added successfully',
            createdDiagnostics: {
                _id: result._id,
                diagnostics: result.diagnostics
            }
        });
    })
    .catch(err => {
        console.log(err),
        res.status(500).json({
            error: err
        });
    });
}

exports.diagnostics_get_all = (req, res, next) => {
    Diagnostic.find()
        .select('_id diagnostics')
        .exec()
        .then(docs => {
            if(docs.length > 0){
                res.status(200).json(docs);
            }else{
                res.status(200).json({
                    message: "No entries found!"
                });
            }
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        })
}