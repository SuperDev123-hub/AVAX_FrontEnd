import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Autocomplete, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import styled from "styled-components";
import HeaderIcon from "../images/HeaderIcon.png";
import NotificationIcon from "../images/Notification.svg";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import { getTrackList } from "../api/api1";
import GlobalActions from "../actions/global.actions";
import { IPFS_PREFIX } from "../utils/constant";

function AfterLoginHeader({ account }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.Auth.user);
  const [profileUrl, setProfileUrl] = useState(undefined);
  const [name, setName] = useState();
  const [trackList, setTrackList] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [tab, setTab] = useState("explore");

  let isAllExplore = true;
  let isClearSearchText = false;

  useEffect(() => {
    setName(user.firstname);
    setProfileUrl(user.avatar);
  }, [user]);

  useEffect(() => {
    const fetchRankedTrackList = async () => {
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
          searchTrackList.push(temp);
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

    fetchRankedTrackList();
  }, []);

  const onChange = (event, value, reason, details) => {
    if (!isClearSearchText) {
      setSearchKey(value || "");
      dispatch(GlobalActions.updateSearchKey(value));
      if (value && value.length > 0) navigate("/search");
      else navigate("/platform");
    }
  };

  const clickLogo = () => {
    navigate("/platform");
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
              <li
                className={tab === "resource" ? "select" : "unselect"}
                onClick={() => {
                  setTab("resource");
                }}
              >
                Resource
              </li>
              {user.usertype === "admin" && (
                <li
                  className={tab === "create" ? "select" : "unselect"}
                  onClick={() => {
                    navigate("/create");
                    setTab("create");
                  }}
                >
                  Create
                </li>
              )}
              {user.usertype === "admin" && (
                <li
                  className={tab === "dashboard" ? "select" : "unselect"}
                  onClick={() => {
                    navigate("/dashboard");
                    setTab("dashboard");
                  }}
                >
                  Dashboard
                </li>
              )}
            </ul>
            <div className="notifications_icon">
              <div>
                <img src={NotificationIcon} alt="" />
                <div className="number">10</div>
              </div>
            </div>
            <div className="profile">
              <Avatar
                src={`${IPFS_PREFIX}${profileUrl}`}
                className="avatar"
                onClick={() => navigate(`/profile/${account}`)}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
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
export default AfterLoginHeader;
