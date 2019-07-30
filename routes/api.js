require('dotenv').config();
const express = require('express');
const router = express.Router();
const moment = require('moment')
const mapbox = require('@mapbox/mapbox-sdk/services/geocoding');
const axios = require('axios');
const geocodingClient = mapbox({
    accessToken: process.env.MAPBOX_PUBLIC_KEY
})

router.get('/', (req, res) => {
  res.json({type: 'success', message: 'You access the protected API route'});
});


// get /api/address?address=   query
router.get('/address', (req, res) => {
  let address = req.query.address;
  console.log('address is ', address);
  geocodingClient.forwardGeocode({
    query: address 
  }).send().then(function(response) {
    let result = {
      center: response.body.features[0].center,
      neighborhood: response.body.features[0].context[0].text,
      zipcode: response.body.features[0].context[1].text,
      city: response.body.features[0].context[2].text,
      state: response.body.features[0].context[3].short_code.substring(3)  
    }
    console.log(result);
    res.json(result)
      // let results = response.body.features.map(function(feature) {
      //     return feature.center 
      // })
      // res.render('map', {results});
})
})

// get /api/disasters?state=zipcode=
router.get('/disasters', (req, res) => {
  let startdate = moment().subtract(10, 'years');
  axios.get(`https://www.fema.gov/api/open/v1/DisasterDeclarationsSummaries?$filter=state%20eq%20%27${req.query.state}%27%20and%20declarationDate%20gt%20%27${startdate}%27`).then(response => {
    let disasters = response.data.DisasterDeclarationsSummaries;
    console.log(disasters);
    let disastersSummary = {
                              total: 0,
                              score: '',
                              details: {
                                Fire: 0,
                                Flood: 0,
                                'Mud/Landslide': 0,
                                Earthquake: 0,
                                Tornado: 0,
                                Hurricane: 0
                              }
                            };
    disasters.forEach(disaster => {
      if (disaster.placeCode === req.query.zipcode) {
        console.log(disaster.incidentType);
        if (disastersSummary['details'][disaster.incidentType]) {
          disastersSummary['details'][disaster.incidentType]++;
          disastersSummary['total']++;
        } else {
          disastersSummary['details'][disaster.incidentType] = 1;
          disastersSummary['total']++;
        }
      }
    })
    
    switch(true) {
      case disastersSummary.total <= 2:
        disastersSummary.score = 'Low';
        break;
      case disastersSummary.total < 10:
        disastersSummary.score = 'Medium';
        break;
      case disastersSummary.total >= 10:
        disastersSummary.score = 'Low';
        break;
    }

    console.log(disastersSummary);
    res.json(disastersSummary)
  })
})

module.exports = router;