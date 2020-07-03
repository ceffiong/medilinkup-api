const express = require('express')
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const PatientDiagnosticController = require('../controller/patient_diagnostics')


//Handle outgoing POST requests to /patient_diagnostics
router.post('/', checkAuth, PatientDiagnosticController.patient_diagnostic_add)

//get total number of healthworkers
router.get('/number/:patientId', PatientDiagnosticController.get_total_number)

//Handle incoming GET requests to /patient_diagnostics/patients/{id}
router.get('/patients/:patientId', checkAuth, PatientDiagnosticController.patient_diagnostics_get_all)


//Handle outgoing PATCH requests to /patient_diagnostics/{id}
router.patch('/:diagnosticId', checkAuth, PatientDiagnosticController.patient_diagnostic_update)

module.exports = router;