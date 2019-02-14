import axios from 'axios';
import moment from 'moment';
import sortBy from 'lodash/sortBy';

import TourListItem from './list_item';
import '../../css/tours.css';

const SORT_TYPES = {
  LOWEST_PRICE: 'Price: lowest first',
  HIGHEST_PRICE: 'Price: highest first',
  LONGEST_TOUR: 'Duration: longest trip',
  SHORTEST_TOUR: 'Duration: shortest trip'
};

const SORT_FUNCS = {
  LOWEST_PRICE: _ => sortBy(_.dates, [date => date.eur])[0].eur,
  HIGHEST_PRICE: _ => sortBy(_.dates, [date => date.eur * -1])[0].eur * -1,
  LONGEST_TOUR: _ => _.length * -1,
  SHORTEST_TOUR: _ => _.length
}

class TourList {
  constructor(state = {}){
    let months = state.tours.reduce((acc, tour) => {
      let tour_months = tour.dates
        .filter(date => date.availability)
        .map(date => `${date.start.slice(0,-3)}-01`)

      return acc.concat(tour_months);
    }, []);

    // Context
    this.state = state;
    // SelectFilter months
    this._months = [...new Set(months)];
    // SelectSort initial value
    this.sort_type = 'LOWEST_PRICE';
    // SelectFilter props
    this.filters = {
      // SelectFilter initial month value
      month: '-1'
    };

    this.bind                 = this.bind.bind(this);
    this.getTours             = this.getTours.bind(this);
    this.renderSelectSort     = this.renderSelectSort.bind(this);
    this.renderSelectFilter   = this.renderSelectFilter.bind(this);
  }

  mount(){
    this.bind();
  }

  bind(){
    document.querySelector('#tour-select-filter').addEventListener('change', (ev, value) => {
      this.filters.month = ev.target.value;

      document.querySelector('.tour-list').innerHTML = this.getTours()
        .map(tour => new TourListItem(tour).render()).join('');
    });

    document.querySelector('#tour-select-sort').addEventListener('change', (ev, value) => {
      this.sort_type = ev.target.value;

      document.querySelector('.tour-list').innerHTML = this.getTours()
        .map(tour => new TourListItem(tour).render()).join('');
    });
  }

  getTours(){
    let tours = [...this.state.tours];
    let has_filter = this.filters.month != '-1';

    let month = has_filter 
      ? moment(this.filters.month, 'YYYY-MM-DD') 
      : null;

    tours = tours.reduce((acc, tour) => {
      tour = Object.assign({}, tour);

      tour.dates = tour.dates.filter(date => 
        (!has_filter && date.availability) || 
        (has_filter && date.availability && moment(date.start, 'YYYY-MM-DD').isSame(month, 'month'))
      );

      return tour.dates.length ? acc.concat(tour) : acc;
    }, []);

    let sort_func = SORT_FUNCS[this.sort_type];
    return sortBy(tours, [sort_func]);
  }

  renderSelectSort(){
    let options = Object.keys(SORT_TYPES)
      .map(key => { return {key:key, value:SORT_TYPES[key]} })
      .map(option => `<option value='${option.key}'>${option.value}</option>`)
      .join('');

    return `<select id='tour-select-sort'>${options}</select>`;
  }

  renderSelectFilter(){
    let options = this._months
      .map(option => `<option value='${option}'>${moment(option).format('MMMM YYYY')}</option>`)
      .join('');
    
    return `
      <select id='tour-select-filter'>
        <option value='-1'>All Months</option>
        ${options}
      </select>`;
  }

  render(){
    let tours = this.getTours();
    tours = this.getTours();
    tours = this.getTours();

    return `
      <div class='tour-container'>
        <div class='tour-filters'>
          <div class='tour-filter'>
            <label>Sort By</label>
            ${this.renderSelectSort()}
          </div>
          <div class='tour-filter'>
            <label>Filter by Month</label>
            ${this.renderSelectFilter()}
          </div>
        </div>
        <div class='tour-list'>
        ${
          tours.map(tour => new TourListItem(tour).render()).join('')
        }
        </div>
      </div>
    `;
  }
}

export default TourList;