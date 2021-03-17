import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';
import user from './user';
import postReducer from './post';

const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      // console.log('HYDRATE', action);
      // console.log(state);
      return {
        ...state,
        ...action.payload,
        user: {
          ...action.payload.user,
          isLoggedIn: state.user.isLoggedIn,
          isLoggedOut: state.user.isLoggedOut,
        },
      };

    default: {
      const combinedReducer = combineReducers({
        user,
        postReducer,
      });
      return combinedReducer(state, action);
    }
  }
};

export default rootReducer;
