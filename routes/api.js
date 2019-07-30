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
    // console.log(disasters);
    let disastersSummary = {
                              total: 0,
                              score: 0,
                              rank: '',
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
        disastersSummary.rank = 'Low';
        disastersSummary.score = disastersSummary.total/10;
        break;
      case disastersSummary.total < 10:
        disastersSummary.rank = 'Medium';
        disastersSummary.score = disastersSummary.total/10;
        break;
      case disastersSummary.total >= 10:
        disastersSummary.rank = 'High';
        disastersSummary.score = disastersSummary.total/10;
        break;
    }

    console.log(disastersSummary);
    res.json(disastersSummary)
  })
})

// get /api/airquality?city=
router.get('/airquality', (req, res) => {
  let city = req.query.city;
  console.log('get air quality for', city)
  const api_key='96298018a036fd8a07f5e2dc464e98adc3eaadb3';
  const url = `https://api.waqi.info/feed/${city}/?token=${api_key}`
  axios.get(url).then(result => { 
      let airResponse = result.data
      let aqi = airResponse.data.aqi;
      let rank ='';
      if(!aqi){
        rank = '';
      }
      else if(aqi <= 50){
        rank = "Good";
      }else if(aqi > 50 && aqi <= 100){
        rank = "Moderate";
      }else{
        rank = "Unhealthy"
      }

      let details = {}
      for (let key in airResponse.data.iaqi) {
        details[key] = airResponse.data.iaqi[key].v
      }

      let air = {
        total: airResponse.data.aqi,
        rank,
        score: airResponse.data.aqi/100,
        details
        }
    console.log(air);
    res.json(air);
  })
})

// get /api/crime?neighborhood=
router.get('/crime', (req, res) => {
  const API_URL = 'https://data.seattle.gov/resource/4fs7-3vj5.json';
  let neighborhood = req.query.neighborhood;
  let startDate = moment('2000-01-01', 'YYYY-MM-DD');
  console.log(startDate);
  console.log('get crime record for ', neighborhood);
  axios.get(API_URL).then(response => response.data)
  .then((data) => {
    let crimeData = {
      total: 0,
      rank: '',
      score: 0,
      details: {
        Theft: 0,
        Robbery: 0,
        Burglary: 0,
        'Sex Offense': 0,
        Drug: 0,
        Murder: 0
      }
    }
    let temp = {};
    data.forEach(crime => {
      if (crime.neighborhood.toLowerCase().includes(neighborhood.toLowerCase())) {
        if (temp[crime.crime_subcategory]) {
          temp[crime.crime_subcategory]++;
        } else {
          temp[crime.crime_subcategory] = 1;
        }
        crimeData.total++;
      }
    })

    for (let key in temp) {
      switch(true) {
        case key.includes('THEFT'):
          crimeData.details.Theft += temp[key];
          break;
        case key.includes('ROBBERY') || key === 'CAR PROWL':
          crimeData.details.Robbery += temp[key];
          break;
        case key.includes('BURGLARY'):
          crimeData.details.Burglary += temp[key];
          break;
        case key.includes('SEX') || key === 'RAPE':
          crimeData.details['Sex Offense'] += temp[key];
          break;
        case key === 'NARCOTIC':
          crimeData.details.Drug += temp[key];
          break;
        case key === 'HOMICIDE':
          crimeData.details.Murder += temp[key];
          break;

      }
    }

    switch(true) {
      case crimeData.total <= 25:
        crimeData.rank = 'Good';
        break;
      case crimeData.total <= 50:
        crimeData.rank = 'OK';
        break;
      case crimeData.total <= 75:
        crimeData.rank = 'Bad';
        break;
      case crimeData.total <= 100:
        crimeData.rank = 'Danger';
        break;
      case crimeData.total > 100:
        crimeData.rank = 'Move';
        break;
    }
    crimeData.score = crimeData.total/50

    console.log(crimeData);
    res.json(crimeData);
})
})

module.exports = router;