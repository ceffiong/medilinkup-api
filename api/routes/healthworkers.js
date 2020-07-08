const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth')

const HealthWorkerController = require('../controller/healthworkers');

//Handle incoming GET requests to /healthworkers
router.get('/', checkAuth, HealthWorkerController.healthworkers_get_all)

//get total number of healthworkers
router.get('/number', HealthWorkerController.get_total_number)

//filter
router.get('/filter/:filter', checkAuth, HealthWorkerController.healthworkers_filter);

//verify token and refresh if current token is valid
router.get('/verify/:healthworkerId', checkAuth, HealthWorkerController.healthworkers_verify)


//sign up user
router.post('/signup', HealthWorkerController.healthworker_signup)

//send welcome email after signup
router.post('/email', HealthWorkerController.welcome_email)

router.put('/forgot-password', HealthWorkerController.forgot_password)

router.put('/reset-password', HealthWorkerController.reset_password)


//sign in user
router.post('/login', HealthWorkerController.healthworker_login)

//is token valid?


//Handle outgoing POST requests to /healthworkers
router.post('/', checkAuth, HealthWorkerController.healthworker_add);

//Handles incoming GET requests to /healthworkers/{id}
router.get('/:healthworkerId', checkAuth, HealthWorkerController.healthworker_get)

//Handle outgoing PATCH requests to /healthworkers/{id}
router.patch('/:healthworkerId', checkAuth, HealthWorkerController.healthworker_update)

//Delete for Super Admin Only
router.delete('/:healthworkerId', checkAuth, HealthWorkerController.healthworker_delete)

module.exports = router;