import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Autocomplete, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import styled from "styled-components";
import HeaderIcon from "../images/HeaderIcon.png";
import { useNavigate } from "react-router-dom";
import { getTrackList } from "../api/api1";
import GlobalActions from "../actions/global.actions";
import "../App.css";

const Header = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [trackList, setTrackList] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [tab, setTab] = useState("explore");

  let isClearSearchText = false;
  let isAllExplore = true;

  useEffect(() => {
    const fetchTrackList = async () => {
      const { data } = await getTrackList("all", true, 0, 500);
      let searchTrackList = [];
      data.map((track) => {
        if (track.track_name !== "") {
          let temp = { ...track, search_word: track.track_name };
          searchTrackList.push(temp);
        }
      });

      data.map((track) => {
        if (track.artist !== "") {
          let temp = { ...track, search_word: track.artist };
          if (!searchTrackList.includes(temp)) searchTrackList.push(temp);
        }
      });

      var result = searchTrackList.reduce((unique, o) => {
        if (!unique.some((obj) => obj.search_word === o.search_word)) {
          unique.push(o);
        }
        return unique;
      }, []);

      setTrackList(result);
    };

    fetchTrackList();
  }, []);

  const onChange = (event, value, reason, details) => {
    if (!isClearSearchText) {
      setSearchKey(value || "");
      dispatch(GlobalActions.updateSearchKey(value));
      if (value && value.length > 0) navigate("/search");
      else navigate("/platform");
    }
  };

  const onInputChange = (event, value, reason) => {};

  const onClose = () => {
    isClearSearchText = true;
    navigate("/platform");
  };

  const onKeyUp = (event) => {
    if (event.code === "enter" && event.target.value) {
      navigate(`/search/${searchKey}`);
    }
  };

  const clickLogo = () => {
    navigate("/platform");
  };

  const handleExploreAll = (type) => {
    if (isAllExplore === true) navigate(type);
    setTab("explore");
  };

  const handleExplore = (type) => {
    isAllExplore = false;
    navigate(type);
    setTab("explore");
  };

  return (
    <Container>
      <div
        style={{
          width: "100%",
          display: "flex",
          position: "relative",
        }}
      >
        <div
          className="headerIcon"
          style={{ cursor: "pointer" }}
          onClick={clickLogo}
        >
          <img src={HeaderIcon} alt="" width="180" height="30" />
        </div>
        <div className="search_container">
          <Autocomplete
            className="search_bar"
            freeSolo
            options={trackList.map((option) => option.search_word)}
            clearIcon={<ClearIcon fontSize="small" onClick={() => onClose()} />}
            renderInput={(params) => (
              <TextField
                {...params}
                label=""
                placeholder="Search artworks, collections and accounts"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                onKeyUp={onKeyUp}
              />
            )}
            value={searchKey}
            onChange={onChange}
            onInputChange={onInputChange}
          />
          <div style={{ width: "120px", right: "0px" }}>
            <div className="headerInfo" style={{ justifyContent: "right" }}>
              <div className="header_options">
                <ul>
                  <li
                    className={tab === "explore" ? "select" : "unselect"}
                    onClick={() => handleExploreAll("/platform")}
                  >
                    Explore
                    <ul>
                      <li
                        className="header_dropdown"
                        onClick={() => handleExplore("/explore/music")}
                      >
                        Music
                      </li>
                      <li
                        className="header_dropdown"
                        onClick={() => handleExplore("/explore/video")}
                      >
                        Video
                      </li>
                      <li
                        className="header_dropdown"
                        onClick={() => handleExplore("/explore/collectables")}
                      >
                        Collectables
                      </li>
                      <li
                        className="header_dropdown"
                        onClick={() => handleExplore("/explore/image")}
                      >
                        Art
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div
          className="headerInfo"
          style={{
            position: "absolute",
            right: "0px",
            top: "0px",
            bottom: "0px",
          }}
        >
          <div className="header_options">
            {props.isConnected ? (
              <User address={props.account} />
            ) : (
              <ConnectButton onClick={() => navigate("/login")} />
            )}
          </div>
        </div>
      </div>
    </Container>

    // <header className="d-flex flex-row justify-content-between align-items-center p-3 border-bottom">
    //   <div
    //     className="d-flex flex-row justify-content-start align-items-center"
    //     style={{ cursor: "pointer" }}
    //     onClick={clickLogo}
    //   >
    //     <img className="mr-5" src={HeaderIcon} width="180" height="30" />
    //   </div>

    //   <div className="d-flex flex-row justify-content-end align-items-center me-1 me-md-4">
    //     {props.isConnected ? (
    //       <User address={props.account} />
    //     ) : (
    //       <ConnectButton onClick={() => navigate("/login")} />
    //     )}
    //   </div>
    // </header>
  );
};

const ConnectButton = ({ onClick }) => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center bg-success text-white border border-white rounded-pill py-2 px-3 btn-login"
      onClick={onClick}
    >
      <p className="text-button-connect mb-0">LOG IN</p>
    </div>
  );
};

const User = ({ address }) => {
  const navigate = useNavigate();

  const clickAddress = () => {
    const url = "/profile/" + address;
    navigate(url);
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center border border-success rounded-pill p-2 px-4 button-address"
      onClick={clickAddress}
    >
      <p className="mb-0">{showAddress(address)}</p>
    </div>
  );
};

const showAddress = (addrStr) => {
  const firstStr = addrStr.substr(0, 5);
  const secondStr = addrStr.substr(38, 4);
  return firstStr + "..." + secondStr;
};

// export const Logo = () => (
//   <div style={{ display: "flex" }}>
//     <svg
//       width="60"
//       height="38"
//       viewBox="0 0 30 30"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M0 10C0 4.47715 4.47715 0 10 0H20C25.5228 0 30 4.47715 30 10V20C30 25.5228 25.5228 30 20 30H10C4.47715 30 0 25.5228 0 20V10Z"
//         fill="#E84142"
//       />
//       <path
//         d="M20.2914 15.3898C20.8111 14.4921 21.6497 14.4921 22.1693 15.3898L25.4056 21.0709C25.9252 21.9685 25.5 22.7008 24.4607 22.7008H17.941C16.9134 22.7008 16.4882 21.9685 16.9961 21.0709L20.2914 15.3898ZM14.0315 4.45277C14.5512 3.55513 15.378 3.55513 15.8977 4.45277L16.6182 5.75198L18.3189 8.74017C18.7323 9.59056 18.7323 10.5945 18.3189 11.4449L12.6142 21.3307C12.0945 22.1339 11.2323 22.6417 10.2756 22.7008H5.53942C4.50005 22.7008 4.07485 21.9803 4.59454 21.0709L14.0315 4.45277Z"
//         fill="white"
//       />
//     </svg>
//   </div>
// );

const Container = styled.div`
  background: #ffffff;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1), 0px 10px 40px rgba(0, 0, 0, 0.06);
  padding-left: 1vw;
  padding-right: 1vw;
  display: flex;
  justify-content: space-between;
  width: 100vw;
  padding-top: 1vh;
  padding-bottom: 2vh;
  height: 10vh;
  .headerIcon {
    display: flex;
    img {
      margin-top: auto;
      margin-bottom: auto;
    }
    p {
      font-size: 25px;
      font-weight: 600;
      color: #e0335d;
      margin-left: 5px;
      margin-top: auto;
      margin-bottom: auto;
    }
  }
  .search_container {
    display: flex;
    position: absolute;
    width: fit-content;
    height: fit-content;
    margin: auto;
    left: 0px;
    right: 0px;
    top: 10px;
    bottom: 0px;
    @media only screen and (max-width: 1500px) {
      left: 0px;
      right: 30vw;
    }
  }

  .search_bar {
    display: flex;
    width: 40vw;
    padding: 10px;
    @media only screen and (max-width: 1800px) {
      width: 30vw;
    }
    .css-1q60rmi-MuiAutocomplete-endAdornment {
      height: fit-content;
      margin: auto;
      top: 0px;
      bottom: 0px;
    }
    fieldset {
      legend {
        display: none;
      }
    }
  }
  .headerInfo {
    display: flex;
    .header_dropdown {
      font-size: 14px !important;
    }
    .header_options {
      display: flex;
      align-items: center;

      ul {
        text-align: left;
        display: inline;
        margin: 0;
        padding: 15px 4px 17px 0;
        list-style: none;
      }

      ul li {
        font: bold 12px/18px sans-serif;
        display: inline-block;
        margin-right: -4px;
        position: relative;
        padding: 15px 20px;
        background: #fff;
        color: #858fa2;
        cursor: pointer;
      }

      ul li:hover {
        background: #e4e4e4;
        color: #000;
        font-weight: 700;
      }

      ul li ul {
        padding: 0;
        position: absolute;
        top: 48px;
        left: 0;
        width: 150px;
        border-radius: 3px;
        box-shadow: none;
        display: none;
        opacity: 0;
        visibility: visible;
      }

      ul li ul li {
        z-index: 9999;
        border-bottom: 1px solid #e4e4e4;
        display: block;
        color: #000;
      }

      ul li ul li:hover {
        background: #e4e4e4;
      }

      ul li:hover ul {
        display: block;
        opacity: 1;
        visibility: visible;
      }

      .select {
        color: black !important;
        font-size: 14px;
        font-weight: 600;
      }

      .unselect {
        font-size: 14px;
      }

      .header_tabs {
        display: flex;
        align-items: center;

        .nav-item {
          padding: 3px 10px;
          border-bottom: 1px solid #e4e4e4;
        }

        p {
          margin-top: auto;
          margin-bottom: auto;
          margin-left: 20px;
          margin-right: 20px;
          font-weight: 600;
          /* font-family: "Poppins"; */
          font-style: normal;
          font-size: 16px;
          color: #858fa2;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }

    .notifications_icon {
      align-self: center;
      margin-left: 20px;
      img {
        width: 29px;
        object-fit: contain;
        z-index: -1;
      }
    }
    .number {
      width: 21px;
      height: 21px;
      background: #e0335d;
      border: 1px solid #ffffff;
      box-sizing: border-box;
      border-radius: 50%;
      font-size: 13px;
      color: #ffffff;
      text-align: center;
      margin-top: -20px;
      z-index: 999;
      position: sticky;
      margin-left: 13px;
    }
    .profile {
      margin-left: 30px;
      margin-right: 10px;
      align-self: center;
      .avatar {
        width: 50px;
        height: 50px;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
`;
export default Header;
