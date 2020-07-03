const Symptom = require('../models/symptom');
const mongoose = require('mongoose');

exports.symptoms_add = (req, res, next) => {
    const symptoms = new Symptom({
        _id: new mongoose.Types.ObjectId(),
        symptoms: req.body.symptoms
    });
    symptoms.save()
        .then(result=> {
        res.status(200).json({
            message: 'Symptoms added successfully',
            createSymptoms: {
                _id: result._id,
                symptoms: result.symptoms
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


exports.patient_diagnostics_get_all = (req, res, next) => {
    const id = req.params.patientId;
    PatientDiagnostic.find({"patient._id" : id})
        .select('_id patient created_by diagnostic diagnostic_date comment created_at updated_by updated_at')
        .exec()
        .then(docs => {
            console.log(docs)
            if(docs.length > 0){
                const response = {
                    count: docs.length,
                    patient_diagnostics: docs.map(doc => {
                        return {
                            _id: doc._id,
                            patient: {
                                _id: doc.patient._id,
                                name: {first_name: doc.patient.name.first_name, last_name: doc.patient.name.last_name},
                                request: {
                                    type: 'GET',
                                    url: nodemon.env.HOST_ADDRESS + ':' + nodemon.env.HOST_PORT + '/patients/' + doc.patient._id,
                                    description: 'Get Patient details'
                                }
                            },
                            diagnostic: doc.diagnostic,
                            diagnostic_date: doc.diagnostic_date,
                            outcome: doc.outcome,
                            comment: doc.comment,
                            created_by: {
                                _id : doc.created_by._id,
                                name: {
                                    first_name: doc.created_by.name.first_name,
                                    last_name: doc.created_by.name.last_name,
                                },
                                request: {
                                    type: 'GET',
                                    url: nodemon.env.HOST_ADDRESS + ':' + nodemon.env.HOST_PORT + '/healthworkers/' + doc.created_by._id,
                                    description: 'Get creator details'
                                }
                            },
                            created_at: doc.created_at,
                            updated_by: {
                                _id : doc.updated_by._id,
                                name: {
                                    first_name: doc.updated_by.name.first_name,
                                    last_name: doc.updated_by.name.last_name,
                                },
                                request: {
                                    type: 'GET',
                                    url: nodemon.env.HOST_ADDRESS + ':' + nodemon.env.HOST_PORT + '/healthworkers/' + doc.updated_by._id,
                                    description: 'Get updater details'
                                }
                            },
                            updated_at: doc.updated_at,
                        }
                    })
                }
                res.status(200).json(response);
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


exports.symptoms_get_all = (req, res, next) => {
    Symptom.find()
        .select('_id symptoms')
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