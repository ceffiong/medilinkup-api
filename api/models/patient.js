const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        first_name: {type: String, required: true},
        last_name: {type: String, required: true}
    },
    DOB: {type: Date, required: true},
    gender: {type: String, required: true},
    contact:{
        email: {type: String, required: false},
        phone: {type: String, required: false},
        city: {type: String, required: true},
        country: {type: String, required: true},
    },
    created_by: {type: mongoose.Schema.Types.ObjectId, required: true},
    created_at: {type: Date, required: true},
    updated_by: {type: mongoose.Schema.Types.ObjectId, required: true},
    updated_at: {type: Date, required: true}
});

module.exports = mongoose.model('Patient', patientSchema);
