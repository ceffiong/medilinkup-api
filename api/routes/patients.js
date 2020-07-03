const express = require('express')
const router = express.Router();
const checkAuth = require('../middleware/check-auth')
const PatientController = require('../controller/patients')


//Handle incoming GET requests to /patients
router.get('/', checkAuth, PatientController.patients_get_all)

//get total number of patients
router.get('/number', PatientController.get_total_number)


//Handle incoming GET requests to /patients
router.get('/filter/:filter', checkAuth, PatientController.patients_filter)

//get patients in a particular country
router.get('/countries/:country', checkAuth, PatientController.patients_country)

//Handle outgoing POST requests to /patients
router.post('/', checkAuth, PatientController.patient_add)

//Handle incoming GET requests to /patients/{id}
router.get('/:patientId', checkAuth, PatientController.patient_get)

//Handle outgoing PATCH requests to /patients/{id}
router.patch('/:patientId', checkAuth, PatientController.patient_update)

module.exports = router;