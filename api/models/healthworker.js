const mongoose = require('mongoose');

const healthworkerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        first_name: {type: String, require: true},
        last_name: {type: String, require: true}
    },
    DOB: {type: Date, require: false},
    gender: {type: String, require: false},
    contact:{
        email: {
            type: String, 
            require: true, 
            unique: true, 
            match: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
        },
        phone: {type: String, require: false},
        city: {type: String, require: false},
        country: {type: String, require: false},
    },
    activated: {type: Boolean, required: true, default: false},
    password: {type: String, require: true},
    created_at: {type: Date, require: false},
    updated_at: {type: Date, require: false}
});

module.exports = mongoose.model('Healthworker', healthworkerSchema);


