const SymptomClass = require('../models/symptom_class');
const mongoose = require('mongoose');


exports.symptom_class_add = (req, res, next) => {
    const symptomclass = new SymptomClass({
        _id: new mongoose.Types.ObjectId(),
        classes: req.body.classes
    });
    symptomclass.save()
        .then(result=> {
        res.status(200).json({
            message: 'Symptom classes added successfully',
            createSymptoms: {
                _id: result._id,
                classes: result.classes
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

exports.symptom_class_get_all = (req, res, next) => {
    SymptomClass.find()
        .select('_id classes')
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