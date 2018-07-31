var express = require('express');
var router = express.Router();
var path = require('path');
var config = require('../config/config');
var api_data_fetch = require('../api/api_data_fetch')
var indexHtmlDir = path.join(__dirname, '..', 'hw8front/dist/index.html');

router.get('/', (req, res) => {
    console.log('get main page');
    res.sendFile(indexHtmlDir);
});

/**
 { keyword: 'poke',
  category: 'Default',
  distance: '10',
  lat: 34.0599,
  lon: -118.3103,
  address: xxx,
  currentLoc: true }
 **/
router.get('/search', (req, res) => {
    console.log("*************** form data ******************");
     console.log(req.query);
     let body = req.query;
     let current_location = {
           lat: body['lat'],
           lon: body['lon']
       };
     if(body['address']) {
         api_data_fetch.google_geo_api(body['address'], (result) => {
             if(!result) {
                 res.json({message: 'error'});
                 return;
             }
             body['lat'] = result['lat'];
             body['lon'] = result['lon'];
             current_location.lat = body['lat'];
             current_location.lon = body['lon'];
             api_data_fetch.google_nearby_api(body, (result) => {
                 if(!result) {
                     res.json({message: 'error'});
                     return;
                 }
                 result['current_location'] = current_location;
                 res.json(result);
             });
         });
     }
     else {
         api_data_fetch.google_nearby_api(body, (result) => {
             if(!result) {
                 res.json({message: 'error'});
                 return;
             }
             result['current_location'] = current_location;
             res.json(result);
         });
     }
});

/**
 {
    pagetoken=xxxxxxxx
 }
 */
router.get('/next_page', (req, res) => {
    console.log('nextpage ');
    let body = req.query;
    console.log(body);
    if(body['pagetoken']) {
        var token = body['pagetoken'];
        api_data_fetch.google_nearby_next_page_api(token, (result) => {
            console.log(result);
            let empty = {
                message: 'no next page'
            };
            if(!result) {
                res.json(empty);
                return;
            }
            res.json(result);
        });
    }else{
        var error = {
            status:'error',
            msg: 'no next page token send'
        };
        res.json(error);
    }
});


/**
 * placeid=ChIJE80IjrXHwoARZo6wiQusTrc
 */
router.get('/details', (req, res) => {
   let body = req.query;
   if(body['placeid']){
       var place_id = body['placeid'];
       api_data_fetch.google_details_api(place_id, (result) => {
          let error = {
              status: 'error'
          };
          if(!result) {
              res.json(error);
              return;
          }
          res.json(result);
       });
   }
   else {
       var error = {
           status: 'error',
           msg: 'no placeid received'
       };
       res.json(error);
   }
});

/**
 {
    name: xxx,
    address: xxx,
    city: xxx,
    state: xxx,
    country: xxx
  }
 */
router.get('/yelp_review', (req, res) => {
    let body = req.query;
    console.log('yelp request', body);
    api_data_fetch.fetchYelpReviews(body, (json_res) => {
        if(!json_res){
            let empty = {
                message: 'no review'
            };
            res.json(empty);
            return;
        }
        else {
            res.json(json_res);
        }
    })
});

module.exports = router;