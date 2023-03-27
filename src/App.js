import "./App.css";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Loading from "./components/Loading";
import Header from "./components/Header";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./components/Connectors";
import Swal from "sweetalert2";
import MintPage from "./pages/mint";
import CreateAlbum from "./pages/CreateAlbum";
import LoginPage from "./pages/LoginPage";
import AfterLoginHeader from "./components/AfterLoginHeader";
import StoreFrontPage from "./pages/StoreFrontPage";
import ProfilePage2 from "./pages/ProfilePage2";
import Dashboard from "./pages/Dashboard";
import ExploreAllPage from "./pages/ExploreAllPage";
import ExplorePage from "./pages/ExplorePage";
import SearchPage from "./pages/SearchPage";
import AlbumPage from "./pages/AlbumPage";
import TrackListPage from "./pages/TrackListPage";

function App() {
  const { active, account, library, activate } = useWeb3React();
  const [isLoaded, setLoaded] = useState(false);
  const [conn, setConn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (active) setConn(true);
    else setConn(false);
  }, [active]);

  const connectMetamask = async () => {
    console.log("Ran");
    if (window.ethereum) {
      try {
        // check if the chain to connect to is installed
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x4" }], // chainId must be in hexadecimal numbers
        });
        // await activate(injected);
      } catch (error) {
        console.log("Error code is", error.code);
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x4",
                  rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
                },
              ],
            });
          } catch (addError) {
            console.log(addError);
          }
        }
      }
    } else {
      Swal.fire({
        title: "Metamask",
        text: "Please install metamask extension",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  if (!isLoaded) return <Loading />;

  return (
    <div className="container-fluid p-0">
      <Router>
        {conn ? (
          <AfterLoginHeader account={account} isConnected={conn} />
        ) : (
          <Header
            isConnected={conn}
            account={account}
            onClick={connectMetamask}
          />
        )}
        <Routes>
          <Route path="/" exact element={<Navigate to="/platform" />} />
          <Route
            path="/login"
            exact
            element={<LoginPage connect={connectMetamask} />}
          />
          <Route
            path="/platform"
            exact
            element={<StoreFrontPage account={account} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
          <Route
            path="/explore"
            exact
            element={<ExploreAllPage library={library} account={account} />}
          />
          <Route path="/explore">
            <Route
              path=":type"
              element={<ExplorePage library={library} account={account} />}
            />
          </Route>
          <Route path="/track_list">
            {/* {account ? ( */}
            <Route path=":album_id" element={<TrackListPage />} />
            {/* ) : (
              <Route
                path=""
                element={<LoginPage connect={connectMetamask} />}
              />
            )} */}
          </Route>
          <Route
            path="/album"
            exact
            element={
              account ? <AlbumPage /> : <LoginPage connect={connectMetamask} />
            }
          />
          <Route
            path="/search"
            element={<SearchPage library={library} account={account} />}
          />
          <Route
            path="/create"
            exact
            element={
              account ? (
                <MintPage library={library} account={account} />
              ) : (
                <LoginPage connect={connectMetamask} />
              )
            }
          />
          <Route
            path="/create-album"
            exact
            element={
              account ? (
                <CreateAlbum />
              ) : (
                <LoginPage connect={connectMetamask} />
              )
            }
          />
          <Route path="/dashboard" exact element={<Dashboard />} />
          <Route path="/profile">
            <Route
              path=":address"
              element={
                account ? (
                  <ProfilePage2 />
                ) : (
                  <LoginPage connect={connectMetamask} />
                )
              }
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
