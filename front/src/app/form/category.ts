
export class Category {

  categoryList = ['Default', 'Airport', 'Amusement Park', 'Aquarium', 'Art Gallery',
                  'Bakery', 'Bar', 'Beauty Salon', 'Bowling Alley', 'Bus Station',
                  'Cafe', 'Campground', 'Car Rental', 'Casino', 'Lodging', 'Movie Theater',
                  'Museum', 'Night Club', 'Park', 'Parking', 'Restaurant', 'Shopping Mall',
                  'Stadium', 'Subway Station', 'Taxi Stand', 'Train Station', 'Transit Station',
                  'Travel Agency', 'Zoo'];

  constructor() {

  }

  list() {
    return this.categoryList;
  }

}
