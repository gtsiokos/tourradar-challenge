class TourRating {
  render(rating = 0){
    let int_rating = parseInt(rating);
    let is_decimal = rating % int_rating != 0;

    return `
      <div class='tour-list-item-rating'>
      ${
        new Array(5).fill(0).map((star, index) => {
          if(!rating) return `<span class='fa fa-star-o'></span>`;

          return (index+1 <= int_rating)
            ? `<span class='fa fa-star'></span>`
            : is_decimal
              ? `<span class='fa fa-star-half-o'></span>`
              : `<span class='fa fa-star-o'></span>`;
        }).join('')
      }
      </div>
    `;
  }
}

export default TourRating;