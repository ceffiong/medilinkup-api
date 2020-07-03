const express = require('express');
//const cors = require('cors');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const healthworkerRoutes = require('./api/routes/healthworkers');
const patientRoutes = require('./api/routes/patients');
const metricsRoutes = require('./api/routes/metrics');
const countriesRoute = require('./api/routes/countries');
const symptomsRoute = require('./api/routes/symptoms');
const diagnosticsRoute = require('./api/routes/diagnostics');
const symptomClassRoute = require('./api/routes/symptom_class');
const patientSymptomsRoute = require('./api/routes/patient_symptoms');
const patientDiagnosticsRoute = require('./api/routes/patient_diagnostics');

//morgen is for login (all requesst will go through the morgen middleware)
app.use(morgan('dev'));
//POST request body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); //extract and make json data easily readable

//For CORS

//app.use(cors())

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET');
        return res.status(200).json({})
    }
    next();
});


// Routes which should handle request
app.use('/api/healthworkers', healthworkerRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/countries', countriesRoute);
app.use('/api/symptoms', symptomsRoute);
app.use('/api/symptom_class', symptomClassRoute);
app.use('/api/diagnostics', diagnosticsRoute);
app.use('/api/patient_symptoms', patientSymptomsRoute);
app.use('/api/patient_diagnostics', patientDiagnosticsRoute)


//mongodb database connection
mongoose.connect('mongodb+srv://medilinkup:'+ process.env.MONGO_ATLAS_PW +'@medilinkup-api-2osl5.mongodb.net/medilinkupdb?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

//mongoose.connect('mongodb://localhost:27017/medilinkupdb', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

//Handle errors (all requests that went passed the above requests are errors)
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

//Handle all errors thrown in this application
//Operations that throws error e.g. db
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app; 