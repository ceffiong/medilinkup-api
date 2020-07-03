const express = require('express')
const router = express.Router();
const SymptomController = require('../controller/symptoms')

//Handle incoming GET request to /symptoms
router.get('/', SymptomController.symptoms_get_all);
router.post('/', SymptomController.symptoms_add);

module.exports = router;