const express = require('express')
const router = express.Router();
const CountryController = require('../controller/countries')

//Handle incoming GET request to /countries
router.get('/', CountryController.countries_get_all);

//Handle incoming GET request to /countries/{name}
router.get('/:name', CountryController.country_get)

module.exports = router;