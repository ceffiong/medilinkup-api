
const Healthworker = require('../models/healthworker');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const nodemon = require('../../nodemon.json')
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');


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


exports.welcome_email = (req, res, next) => {
    const id = req.body.id
    Healthworker.findOne({"_id": id, "activated": false})
        .exec()
        .then(result => {
            //send email
            let transport = nodemailer.createTransport({
                host: 'smtp.mailtrap.io',
                port: 2525,
                auth: {
                   user: 'ccdbb5de73d16e',
                   pass: '7daa03c6e407dd'
                }
            });

            const message = {
                from: result.contact.email, // Sender address
                to: 'ceffiong-8a844a@inbox.mailtrap.io', // List of recipients
                subject: 'Thank you for signing up', // Subject line
                html: `
                    <body style="margin:20px; font-family: Arial, Helvetica, sans-serif">
                        <div style="background-color: #0D47A1; padding: 5px">
                        <h1 style="color: white">
                        MEDILINKUP eHealth Software
                        </h1>
                        </div>
                        <p>
                        <h2>
                        Thank you for signing up ${result.name.first_name}
                        </h2>
                        </p>
                        <p>
                        Your account has been created and we have began our verification process. We will send you another confirmation email as soon as we activate your account. <br><br>
                        
                        Please allow us a few days to carry out our verification <br><br>
                        
                        Feel free to contact us at <a href="mailto:accounts@medilinkup.com">accounts@medilinkup.com</a> should you have any question regarding this process. <br><br>
                        
                        Thank you <br><br><br>
                        
                        Medilinkup Account Team &copy ${new Date().getFullYear()}
                        </p>
                    </body>
                    `
            };
            transport.sendMail(message, function(err, info) {
                if (err) {
                    return res.status(500).json({
                        message: "Email not sent",
                        error: err
                    });
                } else {
                    return res.status(200).json({
                        message: 'Email sent'
                    });
                }
            });

        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            });
        })
    

}

exports.forgot_password = (req, res, next) => {
 const email = req.body.email
 Healthworker.findOne({"contact.email": email})
    .exec()
    .then(healthworker => {
	console.log("is worker activated: " + healthworker.activated)
        if(!healthworker){
            return res.status(400).json({
                message: 'Healthworker not found'
            })
        }

        if(!healthworker.activated){
	console.log("I am not active")
            return res.status(401).json({
                message: 'Not activated'
            })
        }

        const token = jwt.sign({id: healthworker._id}, 
            nodemon.env.REST_PASSWORD_JWT_KEY,
            {
                expiresIn: "10m"
            }
        )

        //send email
        let transport = nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 2525,
            auth: {
               user: 'ccdbb5de73d16e',
               pass: '7daa03c6e407dd'
            }
        });

        const message = {
            //from: 'ceffiong-8a844a@inbox.mailtrap.io', // Sender address
	    //to: healthworker.contact.email,
	    from: healthworker.contact.email, // Sender address
	    to: 'ceffiong-8a844a@inbox.mailtrap.io',
            subject: 'Reset password', // Subject line
            html: `
                <body style="margin:20px; font-family: Arial, Helvetica, sans-serif">
                <div style="background-color: #0D47A1; padding: 5px">
                <h1 style="color: white">
                MEDILINKUP eHealth Software
                </h1>
                </div>
                <p>
                <h2>
                Hi ${healthworker.name.first_name},
                </h2>
                </p>
                <p>
                We received a request to reset your password for Medilinkup account <a href="mailto:talkwithcharles@gmail.com">talkwithcharles@gmail.com</a>.  <br><br>
                
                Please click on the Link below to rest your password. <br><br>
                
                <a href="${nodemon.env.CLIENT_ADDRESS}:${nodemon.env.CLIENT_PORT}/reset-password/${token}">Reset Password</a><br><br>
                
                Please note that the Link expires in 10 minutes <br><br>
                
                If you didn't ask to change your password, dont'worry! Your password is still safe and you can ignore this email<br><br><br>
                
                Regards,<br><br>
                
                Medilinkup Account Team &copy ${new Date().getFullYear()}
                </p>
                </body>
                `
        };

        return Healthworker.updateOne({"contact.email": email}, {$set: {reset_link: token}})
            .exec()
            .then(result => {
                transport.sendMail(message, function(err, info) {
                    if (err) {
                        return res.status(500).json({
                            message: "Email not sent",
                            error: err
                        });
                    } else {
                        return res.status(200).json({
                            message: 'Email sent'
                        });
                    }
                });
            })
            .catch(err=>{
                res.status(500).json({
                    error: err
                });
            })
    })
    .catch(err=> {
        console.log("Error")
        res.status(500).json({
            error: err
        });
    })

}


exports.reset_password = (req, res, next) => {
    const reset_link = req.body.reset_link
    const password = req.body.password
    if(reset_link){
        jwt.verify(reset_link, nodemon.env.REST_PASSWORD_JWT_KEY, function(error, decodedData) {
            if(error){
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }
            Healthworker.findOne({reset_link: reset_link})
                .exec()
                .then(healthworker=>{
                    if(!healthworker){
                        return res.status(400).json({
                            message: 'Healthworker not found'
                        })
                    }

                    if(!healthworker.activated){
                        return res.status(401).json({
                            message: 'Not activated'
                        })
                    }

                    return Healthworker.updateOne({"contact.email": healthworker.contact.email}, {$set: {password: password, reset_link: ""}})
                        .exec()
                        .then(result => {
                            return res.status(200).json({
                                message: 'Password reset'
                            });
                        })
                        .catch(err=>{
                            res.status(500).json({
				error: err
                            });
                        })

                })
                .catch(err=>{
                    return res.status(400).json({
                        message: 'Healthworker not found'
                    })
                })
        })

    }else{
        return res.status(401).json({
            message: 'Auth failed'
        })
    }   
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