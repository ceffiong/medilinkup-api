const mongoose = require('mongoose');

const metricSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    patient: {
        _id: {type: mongoose.Schema.Types.ObjectId, required: true},
        name: {first_name: {type: String, required: true}, last_name: {type: String, required: true}}
    },
    height: {type: Number, required: true},
    weight: {type: Number, required: true},
    BMI: {type: Number, required: true},
    weight_status: {type: String, required: true},
    pregnancy_status: {type: String, required: false},
    blood_group: {type: String, required: false},
    smoking_status: {type: String, required: false},
    current_alcohol_drinking: {type: String, required: false},
    comorbidity: {answer: {type: String, required: false}, details: {type: String, required: false}},
    indication_for_testing: {type: String, required: true},
    created_by: {type: mongoose.Schema.Types.ObjectId, required: true},
    created_at: {type: Date, required: true},
    updated_by: {type: mongoose.Schema.Types.ObjectId, required: true},
    updated_at: {type: Date, required: true}
});

module.exports = mongoose.model('Metric', metricSchema);