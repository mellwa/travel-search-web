const config = require('../config/config');
const fetch = require('node-fetch');
const yelp = require('yelp-fusion');
const yelp_client = yelp.client(config.apiKeys().YELP);

class ApiFetch {

    google_geo_api(address, callback) {
        if(!address || !address.trim() || typeof callback !== 'function') {
            return null;
        }
        let url = config.googleApi().GEO_API+"?key="+config.apiKeys().GOOGLE+"&address="+address;
        fetch(url)
            .then(res => res.json())
            .then(json => {
                try {
                    let lat = json['results'][0]['geometry']['location']['lat'];
                    let lon = json['results'][0]['geometry']['location']['lng'];
                    let obj = {
                        lat: lat,
                        lon: lon
                    };
                    callback(obj)
                }catch (e){
                    callback(null)
                }
            })
            .catch((error) => {
                console.error(error);
                callback(null);
            });
    }

    /**
     { keyword: 'poke',
      category: 'Default',
      distance: '10',
      lat: 34.0599,
      lon: -118.3103,
      address: xxx,
      currentLoc: true }
     **/
    google_nearby_api(request, callback) {
        if(typeof callback !== 'function') {
            return null;
        }
        if(!request) {
            callback(null);
        }
        let location = request['lat']+","+request['lon'];
        let radius = parseFloat(request['distance'])*1609.34 + "";
        let keyword = request['keyword'];
        let category = this.fetch_google_types(request['category']);
        let url = config.googleApi().NEARBY_SEARCH +"?key="+config.apiKeys().GOOGLE+"&location="+location+"&radius="+radius
        +"&type="+category+"&keyword="+keyword;
        fetch(encodeURI(url))
            .then(res => res.json())
            .then(json => {
                callback(json);
            })
            .catch((error) => {
                console.error(error);
                callback(null);
            });
    }

    fetch_google_types(category) {
        if(!category) return '';
        let google_type = '';
        try {
            let type = category.trim().toLowerCase();
            console.log('type', type);
            google_type = type.replace(/\s+/g, '_');
            console.log('google type', google_type);
        }catch (e) {
            console.error('error',e);
        }
        return google_type;
    }

    google_nearby_next_page_api(token, callback) {
        if(!token || !token.trim()) callback(null);

        console.log(token);
        let url = config.googleApi().NEARBY_SEARCH+"?key="+config.apiKeys().GOOGLE+"&pagetoken="+token;
        fetch(encodeURI(url))
            .then(res => res.json())
            .then(json => {
                callback(json);
            })
            .catch((error) => {
                console.error(error);
                callback(null);
            });
    }

    google_details_api(place_id, callback) {
        let url = config.googleApi().PLACE_DETAILS+"?key="+config.apiKeys().GOOGLE+"&placeid="+place_id;
        fetch(encodeURI(url))
            .then(res => res.json())
            .then(json => {
                callback(json);
            })
            .catch((error) => {
                callback(null);
            })
    }

    //https://github.com/tonybadguy/yelp-fusion
    yelpBestMatchApi(req, callback) {
        if(typeof callback !== 'function'){
            return null;
        }
        if(!req) {
            callback(req);
        }
        yelp_client.businessMatch('best', {
            name: req['name'],
            address1: req['address'],
            city: req['city'],
            state: req['state'],
            country: req['country']
        }).then(res => {
            console.log(res);
            callback(res);
        }).catch(error => {
            console.log(error);
            callback(null);
        })
    }

    yelpReviewsApi(reqId, callback) {
        if(typeof callback !== 'function'){
            return null;
        }
        yelp_client.reviews(reqId).then(res => {
            console.log(res);
            callback(res);
        }).catch(e => {
            console.error(e);
            callback(null);
        })
    }

    /**
      {
        name: xxx,
        address: xxx,
        city: xxx,
        state: xxx,
        country
      }
     * @param req
     * @param callback
     * @returns {null}
     */
    fetchYelpReviews(req, callback) {
        if(typeof callback !== 'function'){
            return null;
        }
        if(!req) {
            callback(req);
        }
        this.yelpBestMatchApi(req, (res) => {
            if(!res){
                callback(res);
                return;
            }
            if(!res['jsonBody']
                || !res['jsonBody']['businesses']
                || !res['jsonBody']['businesses'][0]
                || !res['jsonBody']['businesses'][0]['id']){
                callback(null);
                return;
            }
            this.yelpReviewsApi(res['jsonBody']['businesses'][0]['id'], (res) => {
                if(!res || !res['jsonBody']){
                    callback(null);
                    return;
                }
                console.log(res['body']);
                callback(res['jsonBody']);
            });
        })
    }

}

const api_fetch = new ApiFetch();
module.exports = api_fetch;
// api_fetch.fetchYelpReviews({ name: 'University of Southern California',
//     address: 'University of Southern California Los Angeles, CA 90007, USA',
//     city: 'Los Angeles',
//     state: 'CA',
//     country: 'US' }
//     , (res) => {
//     console.log(res)
// });
