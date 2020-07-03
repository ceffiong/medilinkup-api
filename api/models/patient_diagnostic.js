const mongoose = require('mongoose');

const patientDiagnosticSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    patient: {
        _id: mongoose.Schema.Types.ObjectId,
        name: {first_name: {type: String, required: true}, last_name: {type: String, required: true}}
    },
    diagnostic: {type: String, required: true},
    diagnostic_date: {type: Date, required: true},
    outcome: {type: String, require: true},
    location: {country: {type: String, required: true}, city: {type: String, required: true}},
    comment: {type: String, required: false},
    created_by: {type: mongoose.Schema.Types.ObjectId, required: true},
    created_at: {type: Date, required: true},
    updated_by: {type: mongoose.Schema.Types.ObjectId, required: true},
    updated_at: {type: Date, required: true}

});

module.exports = mongoose.model('PatientDiagnostic', patientDiagnosticSchema);