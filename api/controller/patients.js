const Patient = require('../models/patient');
const mongoose = require('mongoose');
const nodemon = require('../../nodemon.json')

exports.patients_get_all = (req, res, next) => {
    Patient.find().limit(500)
        .populate('metric')
        .select('_id name DOB gender contact created_by updated_by created_at updated_at')
        .exec()
        .then(docs => {
            if(docs.length > 0){
                const response = {
                    count: docs.length,
                    patients: docs.map(doc => {
                        return {
                            _id: doc._id,
                            name: {
                                first_name: doc.name.first_name,
                                last_name: doc.name.last_name
                            },
                            DOB: doc.DOB,
                            gender: doc.gender,
                            contact:{
                                email: doc.contact.email,
                                phone: doc.contact.phone,
                                city: doc.contact.city,
                                country: doc.contact.country
                            },
   			    created_by: doc.created_by,
                            created_at: doc.created_at,
                            updated_by: doc.updated_by,
                            updated_at: doc.updated_at,
                         
                        }
                    })
                };
                res.status(200).json(response);
            }else{
                res.status(200).json({
		    patients: [],
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
    Patient.estimatedDocumentCount()
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

exports.patients_filter = (req, res, next) => {
    const query = req.params.filter;
    const fname = new RegExp(query, 'i')
    const lname = new RegExp(query, 'i')
    const email = new RegExp(query, 'i')
    const phone = new RegExp(query, 'i')
    Patient.find(
            {$or : [
                {"name.first_name": fname },
                {"name.last_name": lname},
                {"contact.email": email},
                {"contact.phone": phone}
            ]}
        )
        .select('_id name DOB gender contact created_by updated_by created_at updated_at')
        .exec()
        .then(docs => {
            if(docs.length > 0){
                const response = {
                    count: docs.length,
                    patients: docs.map(doc => {
                        return {
                            _id: doc._id,
                            name: {
                                first_name: doc.name.first_name,
                                last_name: doc.name.last_name
                            },
                            DOB: doc.DOB,
                            gender: doc.gender,
                            contact:{
                                email: doc.contact.email,
                                phone: doc.contact.phone,
                                city: doc.contact.city,
                                country: doc.contact.country
                            },
    			    created_by: doc.created_by,
                            created_at: doc.created_at,
                            updated_by: doc.updated_by,
                            updated_at: doc.updated_at,

                        }
                    })
                };
                res.status(200).json(response);
            }else{
                res.status(200).json({
    		    patients: [],
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


exports.patients_country = (req, res, next) => {
    const query = req.params.country;
    console.log(query)
    Patient.find({"contact.country": query})
        .select('contact.city')
        .exec()
        .then(docs => {
            if(docs.length > 0){
                const response = {
                    count: docs.length,
                    patients: docs.map(doc => {
                        return doc.contact.city
                    })   
                };
                res.status(200).json(response);
            }else{
                res.status(200).json({
    		    patients: [],
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

exports.patient_add = (req, res, next) => {
    Patient.find({"contact.email": req.body.contact.email})
    .exec()
    .then(doc => {
        if (doc.length >= 1){
            return res.status(409).json({
                message: 'Email exists'
            })
        }else{
            const patient = new Patient({
                _id: new mongoose.Types.ObjectId(),
                name: {
                    first_name: req.body.name.first_name,
                    last_name: req.body.name.last_name
                },
                DOB: req.body.DOB,
                gender: req.body.gender,
                contact:{
                    email: req.body.contact.email,
                    phone: req.body.contact.phone,
                    city: req.body.contact.city,
                    country: req.body.contact.country
                },
                created_by: req.body.created_by,
                updated_by: req.body.updated_by,
                created_at: req.body.created_at,
                updated_at: req.body.updated_at
            });
            patient.save()
                .then(result=> {
                res.status(200).json({
                    message: "Created patient successfully",
                    createdPatient: {
                        _id: result._id,
                        name: {
                            first_name: result.name.first_name,
                            last_name: result.name.last_name
                        },
                        DOB: result.DOB,
                        gender: result.gender,
                        contact:{
                            email: result.contact.email,
                            phone: result.contact.phone,
                            city: result.contact.city,
                            country: result.contact.country
                        },
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
    });
}

exports.patient_get = (req, res, next) => {
    const id = req.params.patientId;
    Patient.findById(id)
        .select('_id name DOB gender contact created_by updated_by created_at updated_at')
        .exec()
        .then(doc => {
            if (doc){
                res.status(200).json({
                    patient: {
                        _id: doc._id,
                        name: {
                            first_name: doc.name.first_name,
                            last_name: doc.name.last_name
                        },
                        DOB: doc.DOB,
                        gender: doc.gender,
                        contact:{
                            email: doc.contact.email,
                            phone: doc.contact.phone,
                            city: doc.contact.city,
                            country: doc.contact.country
                        },
                        created_by: doc.created_by,
                        created_at: doc.created_at,
                        updated_by: doc.updated_by,
                        updated_at: doc.updated_at,
                    },
                    request: {
                        type: 'GET',
                        url: nodemon.env.HOST_ADDRESS + ':' + nodemon.env.HOST_PORT + '/patients',
                        description: 'Get all Patients'
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

exports.patient_update = (req, res, next) => {
    const id = req.params.patientId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    //Patient.updateOne({_id: id}, {$set: updateOps})
    Patient.findOneAndUpdate({_id: id}, {$set: updateOps}, {new:true})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Patient updated successfully',
                updatedPatient: result
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
}