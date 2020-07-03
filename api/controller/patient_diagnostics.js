const PatientDiagnostic = require('../models/patient_diagnostic');
const mongoose = require('mongoose');
const nodemon = require('../../nodemon.json')


exports.patient_diagnostic_add = (req, res, next) => {
    const patient_diagnostic = new PatientDiagnostic({
        _id: new mongoose.Types.ObjectId(),
        patient: {
            _id: req.body.patient._id,
            name: {first_name: req.body.patient.name.first_name, last_name: req.body.patient.name.last_name}
        },
        diagnostic: req.body.diagnostic,
        diagnostic_date: req.body.diagnostic_date,
        outcome: req.body.outcome,
        location: {country: req.body.location.country, city: req.body.location.city},
        comment: req.body.comment,
        created_by: req.body.created_by,
        created_at: req.body.created_at,
        updated_by: req.body.updated_by,
        updated_at: req.body.updated_at,
        
    });
    patient_diagnostic.save()
        .then(result=> {
        res.status(200).json({
            message: 'Patient diagnostic added successfully',
            createdDiagnostic: {
                _id: result._id,
                patient: {
                    _id: result.patient._id,
                    name: {first_name: result.patient.name.first_name, last_name: result.patient.name.last_name},
                    request: {
                        type: 'GET',
                        url: nodemon.env.HOST_ADDRESS + ':' + nodemon.env.HOST_PORT + '/patients/' + result.patient._id,
                        description: 'Get Patient details'
                    }
                },
                diagnostic: result.diagnostic,
                diagnostic_date: result.diagnostic_date,
                outcome: result.outcome,
                comment: result.comment,
                location: {country: result.location.country, city: result.location.city},
                created_by: result.created_by,
                created_at: result.created_at,
                updated_by: result.updated_by,
                updated_at: result.updated_at,

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


//count
exports.get_total_number = (req, res, next) => {
    const id = req.params.patientId;
    PatientDiagnostic.countDocuments({"patient._id" : id})
        .then(result => {
            const response = {count: result}
            res.status(200).json(response)

        })
        .catch(err=>{
            res.status(500).json({
                error:err
            });
        })
}

exports.patient_diagnostics_get_all = (req, res, next) => {
    const id = req.params.patientId;
    PatientDiagnostic.find({"patient._id" : id})
        .select('_id patient outcome location created_by diagnostic diagnostic_date comment created_at updated_by updated_at')
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
                            location: {country: doc.location.country, city: doc.location.city},
                            comment: doc.comment,
                  	    created_by: doc.created_by,
                            created_at: doc.created_at,
                            updated_by: doc.updated_by,
                            updated_at: doc.updated_at,

                        }
                    })
                }
                res.status(200).json(response);
            }else{
                res.status(200).json({
		    patient_diagnostics: [],
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

exports.patient_diagnostic_update =  (req, res, next) => {
    const id = req.params.diagnosticId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    PatientDiagnostic.findOneAndUpdate({_id: id}, {$set: updateOps}, {new:true})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Patient diagnostic updated successfully',
		updatedDiagnostics: result
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
}