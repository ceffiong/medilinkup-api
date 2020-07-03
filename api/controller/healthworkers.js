
const Healthworker = require('../models/healthworker');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const nodemon = require('../../nodemon.json')
const mongoose = require('mongoose');

exports.healthworkers_get_all = (req, res, next) => {
    Healthworker.find().limit(500)
        .select('_id name DOB gender contact created_at updated_at')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                healthworkers: docs
            };
            if(docs.length > 0){
                res.status(200).json(response);
            }else{
                res.status(200).json({
		    healthworkers: [],
                    message: "No entries found!"
                });
            }
        })
        .catch(err=>{
            res.status(500).json({
                error:err
            });
        })
}

exports.get_total_number = (req, res, next) => {
    Healthworker.estimatedDocumentCount()
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

//filter 
exports.healthworkers_filter = (req, res, next) => {
    const query = req.params.filter;
    const fname = new RegExp(query, 'i')
    const lname = new RegExp(query, 'i')
    const email = new RegExp(query, 'i')
    const phone = new RegExp(query, 'i')
    Healthworker.find(
            {$or : [
                {"name.first_name": fname },
                {"name.last_name": lname},
                {"contact.email": email},
                {"contact.phone": phone}
            ]}
        )
        .select('_id name DOB gender contact created_at updated_at')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                healthworkers: docs
            };
            if(docs.length > 0){
                res.status(200).json(response);
            }else{
                res.status(200).json({
		    healthworkers: [],
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

exports.healthworker_signup = (req, res, next) => {
    Healthworker.find({"contact.email": req.body.contact.email})
        .exec()
        .then(doc => {
            if (doc.length >= 1){
                return res.status(409).json({
                    message: 'Mail exists'
                })
            }else{
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        return res.status(500).json({
                            error: err
                        });
                    }else{
                        const healthworker = new Healthworker({
                            _id: new mongoose.Types.ObjectId(),
                            name: {
                                first_name: req.body.name.first_name,
                                last_name: req.body.name.last_name
                            },
                            contact: {
                                email: req.body.contact.email
                            },
                            password: hash
                        });
                        healthworker
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'Health worker created!'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                })
                            });
                    }
                });
            }
        })
}

exports.healthworkers_verify = (req, res, next) => {
    const id = req.params.healthworkerId;
    Healthworker.findOne({"_id": id})
        .exec()
        .then(healthworker => {
            if(!healthworker){
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }
            //we found the user, check password
            
            const token = jwt.sign(
                {
                    email: healthworker.contact.email,
                    id: healthworker._id,
                    first_name: healthworker.name.first_name,
                    last_name: healthworker.name.last_name
                }, 
                nodemon.env.JWT_KEY,
                {
                    expiresIn: "30m"
                }
            )
            return res.status(200).json({
                message: 'Auth successful',
                _id: healthworker._id,
                fname: healthworker.name.first_name,
                lname: healthworker.name.last_name,
                token: token
            })
                
        })
        .catch(err => {
            return res.status(401).json({
                message: 'Auth failed'
            })
        })
    }


exports.healthworker_login = (req, res, next) => {
    Healthworker.find({"contact.email": req.body.contact.email})
        .exec()
        .then(healthworker => {
            if(healthworker.length < 1){
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }
            if(!healthworker[0].activated){
                return res.status(401).json({
                    message: 'Not activated'
                })
            }
            //we found the user, check password
            bcrypt.compare(req.body.password, healthworker[0].password, (err, result) => {
                if (err){
                    return res.status(401).json({
                        message: 'Auth failed'
                    })
                }
                if (result){
                    const token = jwt.sign(
                        {
                            email: healthworker[0].contact.email,
                            id: healthworker[0]._id,
                            first_name: healthworker[0].name.first_name,
                            last_name: healthworker[0].name.last_name
                        }, 
                        nodemon.env.JWT_KEY,
                        {
			                expiresIn: "30m"
                        }

                    )
                    return res.status(200).json({
                        message: 'Auth successful',
                        _id: healthworker[0]._id,
						fname: healthworker[0].name.first_name,
						lname: healthworker[0].name.last_name,
                        token: token
                    })
                }
                res.status(401).json({
                    message: 'Auth failed'
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
}

exports.healthworker_add = (req, res, next) => {
    //use the model to store data
    const healthworker = new Healthworker({
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
        password: req.body.password,
        created_at: req.body.created_at,
        updated_at: req.body.updated_at
    });
    healthworker.save()
        .then(result=> {
        console.log(result);
        res.status(200).json({
            message: "Created a Health Worker",
            createdHealthWorker: result
        });
    })
    .catch(err => {
        console.log(err),
        res.status(500).json({
            error: err
        });
    });
}

exports.healthworker_get = (req, res, next) => {
    const id = req.params.healthworkerId;
    Healthworker.findById(id)
        .select('_id name DOB gender contact created_at updated_at')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc){
                res.status(200).json(doc);
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

exports.healthworker_update = (req, res, next) => {
    console.log("I am here")
    const id = req.params.healthworkerId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Healthworker.findOneAndUpdate({_id: id}, {$set: updateOps}, {new:true})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Healthworker updated',
		updatedHealthworker: result,
                request: {
                    type: 'GET',
                    url: nodemon.env.HOST_ADDRESS + ':' + nodemon.env.HOST_PORT + '/healthworkers/' + id,
                    description: 'Get updated healthworker info',
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        })
}

exports.healthworker_delete = (req, res, next) => {
    const id = req.params.healthworkerId;
    Healthworker.remove({_id: id})
        .exec()
        .then(result => {
	    res.status(200).json({
                message: 'Healthworker deleted',
                deletedHealthworker: result,
		request: {
                    type: 'POST',
                    url: nodemon.env.HOST_ADDRESS + ':' + nodemon.env.HOST_PORT + '/healthworkers',
                    description: 'Add a new healthworker'
                }
            });
        })
        .catch(err => {
            console.log(err),
            res.status(500).json({
                error: err
            });
        })
}


//TODO:
//1. Update password (NO)
//2. Forgot password -> Enter email, get a link to reset password
//3. Get ALL Patients (LIMIT)