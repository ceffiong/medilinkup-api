const mongoose = require('mongoose');

const symptomSchema = mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId},
    symptoms: {type: [], required: true}
});

module.exports = mongoose.model('Symptom', symptomSchema);