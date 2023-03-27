import { combineReducers } from "redux";

import { Auth } from "./auth.reducers";
import { ConnectWallet } from "./connectwallet.reducers";
import { Global } from "./global.reducers";

const rootReducer = combineReducers({
  Auth,
  ConnectWallet,
  Global,
});

export default rootReducer;
