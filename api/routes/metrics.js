const express = require('express')
const router = express.Router();
const checkAuth = require('../middleware/check-auth')

const MetricController = require('../controller/metrics')

//Handle incoming GET requests to /metrics
router.get('/', checkAuth, MetricController.metrics_get_all)

//get total number of healthworkers
router.get('/number/:patientId', MetricController.get_total_number)

//Handle outgoing POST requests to /metries
router.post('/', checkAuth, MetricController.metric_add)

//Handle incoming GET requests to /metrics/{id}
router.get('/:metricId', checkAuth, MetricController.metric_get)


//Handle incoming GET requests to /metrics/patients/{id}
//Get all metrics record for the patient
router.get('/patients/:patientId', checkAuth, MetricController.metrics_patient_get_all)


//Handle outgoing PATCH requests to /metrics/{id}
router.patch('/:metricsId', checkAuth, MetricController.metric_update)

module.exports = router;