const express = require('express')
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const PatientSymptomsController = require('../controller/patient_symptoms')


//Handle outgoing POST requests to /patient_symptoms
router.post('/', checkAuth, PatientSymptomsController.patient_symptoms_add)


//get total number of healthworkers
router.get('/number/:patientId', PatientSymptomsController.get_total_number)

//Handle incoming GET requests to /patient_symptoms/patients/{id}
router.get('/patients/:patientId', checkAuth, PatientSymptomsController.patient_symptoms_get_all)


//Handle outgoing PATCH requests to /patient_symptoms/{id}
router.patch('/:symtompId', checkAuth, PatientSymptomsController.patient_symptom_update)

module.exports = router;