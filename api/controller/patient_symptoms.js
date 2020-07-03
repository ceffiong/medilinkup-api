const PatientSymptom = require('../models/patient_symptom');
const mongoose = require('mongoose');
const nodemon = require('../../nodemon.json')


//count
exports.get_total_number = (req, res, next) => {
    const id = req.params.patientId;
    PatientSymptom.countDocuments({"patient._id" : id})
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

exports.patient_symptoms_add = (req, res, next) => {
    const patient_symptoms = new PatientSymptom({
        _id: new mongoose.Types.ObjectId(),
        patient: {
            _id: req.body.patient._id,
            name: {first_name: req.body.patient.name.first_name, last_name: req.body.patient.name.last_name}
        },
        symptom: req.body.symptom,
        symptom_class: req.body.symptom_class,
        outcome: req.body.outcome,
        onset: req.body.onset,
        location: {country: req.body.location.country, city: req.body.location.city},
        duration: req.body.duration,
        severity: req.body.severity,
        admission_date: req.body.admission_date,
        discharged_death_date: req.body.admission_date,
        comment: req.body.comment,
    	created_by: req.body.created_by,
        created_at: req.body.created_at,
        updated_by: req.body.updated_by,
        updated_at: req.body.updated_at,
        
    });
    patient_symptoms.save()
        .then(result=> {
        res.status(200).json({
            message: 'Patient symptom added successfully',
            createdSymptoms: {
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
                symptom: result.symptom,
                symptom_class: result.symptom_class,
                outcome: result.outcome,
                onset: result.onset,
                location: {country: result.location.country, city: result.location.city},
                duration: result.duration,
                severity: result.severity,
                admission_date: result.admission_date,
                discharged_death_date: result.discharged_death_date,
                comment: result.comment,
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


exports.patient_symptoms_get_all = (req, res, next) => {
    const id = req.params.patientId;
    PatientSymptom.find({"patient._id" : id})
        .select('_id patient created_by symptom symptom_class outcome onset location admission_date discharged_death_date duration severity comment created_at updated_by updated_at')
        .exec()
        .then(docs => {
            console.log(docs)
            if(docs.length > 0){
                const response = {
                    count: docs.length,
                    patient_symptoms: docs.map(doc => {
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
                            symptom: doc.symptom,
                            symptom_class: doc.symptom_class,
                            outcome: doc.outcome,
                            onset: doc.onset,
                            location: {country: doc.location.country, city: doc.location.city},
                            duration: doc.duration,
                            severity: doc.severity,
                            admission_date: doc.admission_date,
                            discharged_death_date: doc.discharged_death_date,
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
		    patient_symptoms: [],
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

exports.patient_symptom_update =  (req, res, next) => {
    const id = req.params.symtompId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    PatientSymptom.findOneAndUpdate({_id: id}, {$set: updateOps}, {new:true})
        .exec()
        .then(result => {
	    console.log(result);
            res.status(200).json({
                message: 'Patient symptoms updated successfully',
		updatedSymptoms: result
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
}