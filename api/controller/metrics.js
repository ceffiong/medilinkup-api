const Metric = require('../models/metric');
const mongoose = require('mongoose');
const nodemon = require('../../nodemon.json')

exports.metrics_get_all = (req, res, next) => {
    Metric.find()
        .select('_id patient height weight BMI weight_status pregnancy_status blood_group smoking_status current_alcohol_drinking comorbidity indication_for_testing created_by created_at updated_by updated_at')
        .exec()
        .then(docs => {
            console.log(docs)
            if(docs.length > 0){
                const response = {
                    count: docs.length,
                    metrics: docs.map(doc => {
                        return {
                            _id: doc._id,
                            patient: {
                                _id: doc.patient._id,
                                name: {first_name: doc.patient.name.first_name, last_name: doc.patient.name.last_name},
                                requestBio: {
                                    type: 'GET',
                                    url: nodemon.env.HOST_ADDRESS + ':' + nodemon.env.HOST_PORT + '/patients/' + doc.patient._id,
                                    description: 'Get Patient details'
                                },
                                requestAnthropometrics: {
                                    type: 'GET',
                                    url: nodemon.env.HOST_ADDRESS + ':' + nodemon.env.HOST_PORT + '/metrics/patients/' + doc.patient._id,
                                    description: 'Get all anthropometric record for this patient'
                                }
                            },
                            height: doc.height,
                            weight: doc.weight,
                            BMI: doc.BMI,
                            weight_status: doc.weight_status,
                            pregnancy_status: doc.pregnancy_status,
                            blood_group: doc.blood_group,
                            smoking_status: doc.smoking_status,
                            current_alcohol_drinking: doc.current_alcohol_drinking,
                            comorbidity: {answer: doc.comorbidity.answer, details: doc.comorbidity.details},
                            indication_for_testing: doc.indication_for_testing,
                            created_by: doc.created_by,
                            created_at: doc.created_at,
                            updated_by: doc.updated_by,
                            updated_at: doc.updated_at
                        }
                    })
                }
                res.status(200).json(response);
            }else{
                res.status(200).json({
		    metrics: [],
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


exports.get_total_number = (req, res, next) => {
    const id = req.params.patientId;
    Metric.countDocuments({"patient._id" : id})
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

exports.metric_add = (req, res, next) => {
    const metric = new Metric({
        _id: new mongoose.Types.ObjectId(),
        patient: {
            _id: req.body.patient._id,
            name: {first_name: req.body.patient.name.first_name, last_name: req.body.patient.name.last_name}
        },
        height: req.body.height,
        weight: req.body.weight,
        BMI: req.body.BMI,
        weight_status: req.body.weight_status,
        pregnancy_status: req.body.pregnancy_status,
        blood_group: req.body.blood_group,
        smoking_status: req.body.smoking_status,
        current_alcohol_drinking: req.body.current_alcohol_drinking,
        comorbidity: {answer: req.body.comorbidity.answer, details: req.body.comorbidity.details},
        indication_for_testing: req.body.indication_for_testing,
	created_by: req.body.created_by,
        created_at: req.body.created_at,
        updated_by: req.body.updated_by,
        updated_at: req.body.updated_at
    });
    metric.save()
        .then(result=> {
        res.status(200).json({
            message: "Anthropometric successfully added",
            createdAnthropometric: {
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
                height: result.height,
                weight: result.weight,
                BMI: result.BMI,
                weight_status: result.weight_status,
                pregnancy_status: result.pregnancy_status,
                blood_group: result.blood_group,
                smoking_status: result.smoking_status,
                current_alcohol_drinking: result.current_alcohol_drinking,
                comorbidity: {answer: result.comorbidity.answer, details: result.comorbidity.details},
                indication_for_testing: result.indication_for_testing,
                created_by: result.created_by,
                created_at: result.created_at,
                updated_by: result.updated_by,
                updated_at: result.updated_at,

            },
            request: {
                type: 'GET',
                url: nodemon.env.HOST_ADDRESS + ':' + nodemon.env.HOST_PORT + '/metrics',
                description: 'Get all metrics'
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

exports.metric_get = (req, res, next) => {
    const id = req.params.metricId;
    Metric.findById(id)
        .select('_id patient height weight BMI weight_status pregnancy_status blood_group smoking_status current_alcohol_drinking comorbidity indication_for_testing created_by created_at updated_by updated_at')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc){
                res.status(200).json({
                    anthropometric: {
                        _id: doc._id,
                        patient: {
                            _id: doc.patient._id,
                            name: {first_name: doc.patient.name.first_name, last_name: doc.patient.name.last_name},
                            requestBio: {
                                type: 'GET',
                                url: nodemon.env.HOST_ADDRESS + ':' + nodemon.env.HOST_PORT + '/patients/' + doc.patient._id,
                                description: 'Get Patient details'
                            },
                            requestAnthropometrics: {
                                type: 'GET',
                                url: nodemon.env.HOST_ADDRESS + ':' + nodemon.env.HOST_PORT + '/metrics/patients/' + doc.patient._id,
                                description: 'Get all anthropometric record for this patient'
                            }
                        },
                        height: doc.height,
                        weight: doc.weight,
                        BMI: doc.BMI,
                        weight_status: doc.weight_status,
                        pregnancy_status: doc.pregnancy_status,
                        blood_group: doc.blood_group,
                        smoking_status: doc.smoking_status,
                        current_alcohol_drinking: doc.current_alcohol_drinking,
                        comorbidity: {answer: doc.comorbidity.answer, details: doc.comorbidity.details},
                        indication_for_testing: doc.indication_for_testing,
                        created_by: doc.created_by,
                        created_at: doc.created_at,
                        updated_by: doc.updated_by,
                        updated_at: doc.updated_at,

                    },
                    request: {
                        request: {
                            type: 'GET',
                            url: nodemon.env.HOST_ADDRESS + ':' + nodemon.env.HOST_PORT + '/metrics',
                            description: 'Get all metrics'
                        }
                    }
                });
            }else{
                res.status(404).json({
                    message: "No valid entry found for provided id"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err});
        });
}

exports.metrics_patient_get_all = (req, res, next) => {
    const id = req.params.patientId;
    Metric.find({"patient._id" : id})
    .select('_id patient height weight BMI weight_status pregnancy_status blood_group smoking_status current_alcohol_drinking comorbidity indication_for_testing created_by created_at updated_by updated_at')
    .exec()
    .then(docs => {
        if(docs.length > 0){
            const response = {
                count: docs.length,
                metrics: docs.map(doc => {
                    return {
                        _id: doc._id,
                        patient: {
                            _id: doc.patient._id,
                            name: {first_name: doc.patient.name.first_name, last_name: doc.patient.name.last_name},
                        },
                        height: doc.height,
                        weight: doc.weight,
                        BMI: doc.BMI,
                        weight_status: doc.weight_status,
                        pregnancy_status: doc.pregnancy_status,
                        blood_group: doc.blood_group,
                        smoking_status: doc.smoking_status,
                        current_alcohol_drinking: doc.current_alcohol_drinking,
                        comorbidity: {answer: doc.comorbidity.answer, details: doc.comorbidity.details},
                        indication_for_testing: doc.indication_for_testing,
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
		metrics: [],
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

exports.metric_update = (req, res, next) => {
    const id = req.params.metricsId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Metric.findOneAndUpdate({_id: id}, {$set: updateOps}, {new:true})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Metrics updated successfully',
		updatedMetric: result,
                patient: {
                    _id: id,
                    request: {
                        type: 'GET',
                        url: nodemon.env.HOST_ADDRESS + ':' + nodemon.env.HOST_PORT + '/metrics/' + id,
                        description: 'Get Metric details'
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
}