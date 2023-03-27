import { GlobalConstants } from "../actionType/global.actionTypes";

const GlobalActions = {
  updateSearchKey,
};

function updateSearchKey(searchKey) {
  return (dispatch) => {
    dispatch(_updateSearchKey(searchKey));
  };
}

const _updateSearchKey = (searchKey) => {
  return {
    type: GlobalConstants.UPDATE_SEARCH_KEY,
    payload: searchKey,
  };
};

export default GlobalActions;
