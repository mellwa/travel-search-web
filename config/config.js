
class Config {

    apiKeys() {
        return({
            GOOGLE: 'AIzaSyBfNgCQIzlNLQiTyVI7qJfpHsufihMtVjE',
            YELP: 'BQqMGQ6BNn4f98X9NquhYTh9rWivr9462ta6fk9h7kJZPiKZXJX3VwzwUe56-SLULpkuMHbrM6rgW45K2IWfO7Lcl4IGAPziy93lYOcPkOhXmvpJ0seQiMu_0jPDWnYx',
            YELP_CLIENT_ID:'z0BqFDA_neTKdcqPfLd1eQ'
        })
    }

    googleApi() {
        return({
            GEO_API: "https://maps.googleapis.com/maps/api/geocode/json",
            NEARBY_SEARCH: "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
            PLACE_DETAILS: "https://maps.googleapis.com/maps/api/place/details/json"
        })
    }

    yelpApi() {
        return({
            BEST_MATCHES: "https://api.yelp.com/v3/businesses/matches/best",
            BUSINESSES: "https://api.yelp.com/v3/businesses/"
        })
    }
}

const config = new Config();
module.exports = config;
