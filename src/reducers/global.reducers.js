import { GlobalConstants } from "../actionType/global.actionTypes";

export function Global(
  state = {
    searchKey: "",
  },
  action
) {
  switch (action.type) {
    case GlobalConstants.UPDATE_SEARCH_KEY: {
      return {
        ...state,
        searchKey: action.payload,
      };
    }
    default: {
      return state;
    }
  }
}
