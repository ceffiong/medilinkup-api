const mongoose = require('mongoose');

const patientSymptomSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    patient: {
        _id: mongoose.Schema.Types.ObjectId,
        name: {first_name: {type: String, required: true}, last_name: {type: String, required: true}}
    },
    symptom: {type: String, required: true},
    symptom_class: {type: String, require: true},
    outcome: {type: String, require: true},
    onset: {type: Date, required: true},
    location: {country: {type: String, required: true}, city: {type: String, required: true}},
    duration: {type: Number, required: true},
    severity: {type: String, required: true},
    admission_date: {type: Date, required: true},
    discharged_death_date: {type: Date, required: true},
    comment: {type: String, required: false},
    created_by: {type: mongoose.Schema.Types.ObjectId, required: true},
    created_at: {type: Date, required: true},
    updated_by: {type: mongoose.Schema.Types.ObjectId, required: true},
    updated_at: {type: Date, required: true}
});

module.exports = mongoose.model('PatientSymptom', patientSymptomSchema);