const express = require('express')
const router = express.Router();
const SymptomClassController = require('../controller/symptom_class')

//Handle incoming GET request to /countries
router.get('/', SymptomClassController.symptom_class_get_all);
router.post('/', SymptomClassController.symptom_class_add)


module.exports = router;