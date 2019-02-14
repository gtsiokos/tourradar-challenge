import moment from 'moment';
import ellipsize from 'ellipsize';
import sortBy from 'lodash/sortBy';
import accounting from 'accounting';

import TourRating from './rating';

class TourListItem {
  constructor(state = {}){
    this.state = state;

    this.renderDates = this.renderDates.bind(this);
  }

  renderPhotos(images){
    let primary = images.find(image => image.is_primary);
    let photo = primary && primary.url
      ? primary
      : images.find(img => img.url);

    return `
      <div class='tour-list-item-photos'>
        <img class='tour-list-item-photo' src='${photo ? photo.url : ''}' />
      </div>
    `;
  }

  renderDates(dates, num){
    return dates
      .slice(0,2)
      .map(date => {
        return `
          <div class='tour-list-item-date'>
            <span>${moment(date.start, 'YYYY-MM-DD').format('DD MMM YYYY')}</span>
            <span>${date.availability > 10 ? '10+' : date.availability} place${date.availability > 1 ? 's' : ''} left</span>
          </div>
        `;
      }).join('');
  }

  render(){
    let tour = this.state;
    let rating = new TourRating().render(tour.rating);

    return `
      <div class='tour-list-item'>
        ${this.renderPhotos(tour.images)}
        <div class='tour-list-item-info'>
          <div class='tour-list-item-name'>${tour.name}</div>
          ${rating}
          <a href='#' class='tour-list-item-reviews'>${tour.reviews || 0} reviews</a>
          <div class='tour-list-item-desc'>"${ellipsize(tour.description, 100, {truncate:false})}"</div>
          <div class='tour-list-item-details'>
            <div class='tour-list-item-detail'>
              <span>DESTINATIONS</span>
              <span>${tour.cities.length} destination${tour.cities.length > 1 ? 's' : '0'}</span>
            </div>
            <div class='tour-list-item-detail'>
              <span>STARTS / ENDS IN</span>
              <span>${tour.cities[0].name} / ${tour.cities[tour.cities.length-1].name}</span>
            </div>
            <div class='tour-list-item-detail'>
              <span>OPERATOR</span>
              <span>${tour.operator_name}</span>
            </div>
          </div>
        </div>
        <div class='tour-list-item-offer'>
          <div class='tour-list-item-offer-pack'>
            <div class='tour-list-item-price'>
              <span>From</span>
              <span>${accounting.formatMoney(tour.dates[0].eur, '€', 0, '.', ',')}</span>
            </div>
            <div class='tour-list-item-duration'>
              ${tour.length} days
            </div>
          </div>
          <div class='tour-list-item-dates'>
            ${this.renderDates(tour.dates, 2)}
          </div>
          <div class='tour-list-item-btn'>
            ${'View More'}
          </div>
        </div>
      </div>
    `;
  }
}

export default TourListItem;