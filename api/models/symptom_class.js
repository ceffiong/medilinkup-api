const mongoose = require('mongoose');

const symptomClassSchema = mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId},
    classes: {type: [], required: true}
});

module.exports = mongoose.model('SymptomClass', symptomClassSchema);