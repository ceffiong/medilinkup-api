const mongoose = require('mongoose');

const countrySchema = mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId},
    name: {type: String, required: true},
    cities: {type: [], required: true}
});

module.exports = mongoose.model('Country', countrySchema);