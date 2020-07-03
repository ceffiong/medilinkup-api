const mongoose = require('mongoose');

const diagnosticSchema = mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId},
    diagnostics: {type: [], required: true}
});

module.exports = mongoose.model('Diagnostic', diagnosticSchema);