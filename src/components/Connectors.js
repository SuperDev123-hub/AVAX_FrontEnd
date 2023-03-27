import { InjectedConnector } from "@web3-react/injected-connector";

export const injected = new InjectedConnector({
  supportedChainIds: [1, 4, 43113, 43114],
});
