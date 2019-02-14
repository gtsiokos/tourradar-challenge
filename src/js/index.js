import axios from 'axios';
import TourList from './tours/list';

import '../css/reset.css';
import '../css/base.css';

class App {
  constructor(){
  }

  mount(state={}){
    [
      TourList
    ].map(Component => new Component(state).mount());
  }

  render(state={}){
    return [
      TourList
    ].map(Component => new Component(state).render()).join('');
  }
}

if(typeof window !== 'undefined'){
  require('domready')(async () => {
    let request = await axios.get(process.env.API_URL);

    new App().mount({
      tours: request.data
    });
  })
}

export default App;