const Country = require('../models/country');
const mongoose = require('mongoose');

exports.countries_get_all = (req, res, next) => {
    Country.find()
        .select('_id name')
        .exec()
        .then(docs => {
            if(docs.length > 0){
                res.status(200).json(docs);
            }else{
                res.status(200).json({
                    message: "No entries found!"
                });
            }
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        })
}

exports.country_get = (req, res, next) => {
    Country.findOne({"name": req.params.name})
        .sort('cities')
        .select('cities _id')
        .exec()
        .then(doc => {
            if (doc){
                res.status(200).json(doc);
            }else{
                res.status(404).json({
                    message: "No valid entry found for provided id"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err});
        });
}