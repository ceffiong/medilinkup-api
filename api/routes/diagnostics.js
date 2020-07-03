const express = require('express')
const router = express.Router();
const DiagnosticController = require('../controller/diagnostics')

//Handle incoming GET request to /countries
router.get('/', DiagnosticController.diagnostics_get_all);

router.post('/', DiagnosticController.diagnostics_add);

module.exports = router;