import { legacy_createStore as createStore, combineReducers } from 'redux';

import userReducer from './features/user/reducer';
import subwebReducer from './features/subweb/reducer';
import allgamesReducer from './features/allgames/reducer';
import gamesReducer from './features/games/reducer';
import abilitiesReducer from './features/abilities/reducer';
import skinsReducer from './features/skins/reducer';
import skins2Reducer from './features/skins2/reducer';
import ruinedReducer from './features/ruined/reducer';
import galleryReducer from './features/gallery/reducer';
import toastReducer from './features/toast/reducer';

class Store {
  #store;

  constructor() {
    this.#store = createStore(
      combineReducers({
        user: userReducer,
        subweb: subwebReducer,
        allgames: allgamesReducer,
        games: gamesReducer,
        abilities: abilitiesReducer,
        skins: skinsReducer,
        skins2: skins2Reducer,
        ruined: ruinedReducer,
        gallery: galleryReducer,
        toast: toastReducer,
      })
    );
  }

  dispatch(action) {
    this.#store.dispatch(action);
  }

  get state() {
    return this.#store.getState();
  }
}

const store = new Store();
export default store;
