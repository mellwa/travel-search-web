import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ReviewsConstant} from "./reviews_contants";
import {trigger, state, style, animate, transition} from '@angular/animations';
import * as moment from 'moment';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css'],
  animations: [
    trigger('reviews_state', [
      state('show', style({
        opacity: 1
      })),
      state('off', style({
        opacity: 0
      })),
      transition('off => show', [
        animate(800, style({opacity: 1}))
      ])
    ])
  ]
})
export class ReviewsComponent implements OnInit, OnChanges {

  @Input() input_model;

  model = {
    reviews:{
      current: ReviewsConstant.GOOGLE_REVIEW,
      options: [ReviewsConstant.GOOGLE_REVIEW, ReviewsConstant.YELP_REVIEW]
    },
    sort:{
      current: ReviewsConstant.DEFAULT_ORDER,
      options: [ReviewsConstant.DEFAULT_ORDER, ReviewsConstant.HIGHEST_RATING, ReviewsConstant.LOWEST_RATING,
                ReviewsConstant.MOST_RECENT, ReviewsConstant.LEAST_RECENT]
    },
    google_reviews: [],
    yelp_reviews: [],
    current_reviews: []
  };

  review_state = 'show';

  constructor() {}

  ngOnInit() {
    this.model.current_reviews = this.model.google_reviews;
  }

  ngOnChanges() {
    this.init_reviews();
  }

  init_reviews() {
    // console.log('REVIEWS DATA', this.input_model);
    if(this.input_model['google']) {
      this.model.google_reviews = [];
      for (let i = 0; i < this.input_model['google'].length; i++){
        let author = {};
        if(this.input_model['google'][i]['author_name'] && this.input_model['google'][i]['author_name'].trim()) {
          author['author_name'] = this.input_model['google'][i]['author_name'];
        }else{
          author['author_name'] = 'Anonymous';
        }
        author['author_url'] = this.input_model['google'][i]['author_url'];
        author['profile_url'] = this.input_model['google'][i]['profile_photo_url'];
        author['rating'] = this.input_model['google'][i]['rating'];
        author['text'] = this.input_model['google'][i]['text'];
        author['date'] = this.formateTime(this.input_model['google'][i]['time']);
        author['time'] = this.input_model['google'][i]['time'];
        this.model.google_reviews.push(author)
      }
    }
    if(this.input_model['yelp']) {
      this.model.yelp_reviews = [];
      let yelp_reviews = this.input_model['yelp'];
      for(let i = 0; i < yelp_reviews.length; i++) {
        let author = {};
        if(yelp_reviews[i]['user']&&yelp_reviews[i]['user']['name']){
          author['author_name'] = yelp_reviews[i]['user']['name'];
        }
        else{
          author['author_name'] = 'Anonymous';
        }
        if(yelp_reviews[i]['user']&&yelp_reviews[i]['user']['image_url']){
          author['profile_url'] = yelp_reviews[i]['user']['image_url'];
        }
        author['author_url'] = yelp_reviews[i]['url'];
        author['rating'] = yelp_reviews[i]['rating'];
        author['text'] = yelp_reviews[i]['text'];
        author['date'] = yelp_reviews[i]['time_created'];
        author['time'] = this.convertDate2Time(yelp_reviews[i]['time_created']);
        this.model.yelp_reviews.push(author);
      }
    }
    if(this.model.reviews.current == ReviewsConstant.GOOGLE_REVIEW) {
      this.model.current_reviews = this.model.google_reviews;
    }else {
      this.model.current_reviews = this.model.yelp_reviews;
    }
  }

  formateTime(time) {
    if(!time) return null;
    try {
      return moment(time, 'X').format('YYYY-MM-DD HH:mm:ss');
    }catch (e) {
      console.error(e);
      return null;
    }
  }

  convertDate2Time(date_str) {
    if(!date_str || !date_str.trim()) return null;
    try{
      return moment(date_str, 'YYYY-MM-DD HH:mm:ss').format('X');
    }catch (e) {
      console.error(e);
      return null;
    }
  }

  reviewsChangeHandler(review) {
    if(this.model.reviews.current == review) return;
    this.model.reviews.current = review;
    if(review == ReviewsConstant.GOOGLE_REVIEW) {
      this.model.current_reviews = this.model.google_reviews;
    }
    else {
      this.model.current_reviews = this.model.yelp_reviews;
    }
    this.sortChangeHandler(this.model.sort.current);
    this.review_state = 'off';
    setTimeout(() => {
      this.review_state = 'show';
    }, 10);
  }

  sortChangeHandler(type) {
    this.model.sort.current = type;
    var current_reviews = this.currentReviews();
    current_reviews = current_reviews.slice();
    switch (type) {
      case ReviewsConstant.HIGHEST_RATING:
        this.model.current_reviews = this.highestRatingSort(current_reviews);
        break;
      case ReviewsConstant.LOWEST_RATING:
        this.model.current_reviews = this.lowestRatingSort(current_reviews);
        break;
      case ReviewsConstant.MOST_RECENT:
        this.model.current_reviews = this.mostRecentSort(current_reviews);
        break;
      case ReviewsConstant.LEAST_RECENT:
        this.model.current_reviews = this.leastRecentSort(current_reviews);
        break;
      default:
        this.model.current_reviews = current_reviews;
        break;
    }
  }

  currentReviews() {
    if(this.model.reviews.current == ReviewsConstant.GOOGLE_REVIEW) {
      return this.model.google_reviews;
    }
    return this.model.yelp_reviews;
  }

  highestRatingSort(current_reviews) {
    current_reviews.sort((a,b) => {
      if(a['rating'] < b['rating']) return 1;
      else return -1;
    });
    return current_reviews;
  }

  lowestRatingSort(current_reviews) {
    current_reviews.sort((a,b) => {
      if(a['rating'] > b['rating']) return 1;
      else return -1;
    });
    return current_reviews;
  }

  mostRecentSort(current_reviews) {
    current_reviews.sort((a,b) => {
      if(a['time'] < b['time']) return 1;
      else return -1;
    });
    return current_reviews;
  }

  leastRecentSort(current_reviews){
    current_reviews.sort((a,b) => {
      if(a['time'] > b['time']) return 1;
      else return -1;
    });
    return current_reviews;
  }

}
