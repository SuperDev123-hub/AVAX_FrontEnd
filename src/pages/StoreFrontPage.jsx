import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import storeFront from "../images/storeFront.PNG";
import Drop from "../components/Drop";
import Album from "../components/Album";
import Collection from "../components/Collection";
import banner from "../images/banner.png";
// import Nft from "../components/Nft";
import Creator from "../components/Creator";
import AfterLoginFooter from "../components/AfterLoginFooter";
import {
  getMostRecentTrack,
  getTopTrackList,
  getNotableUser,
  getAlbumByTypeWithSize,
} from "../api/api1";

function StoreFrontPage({ account }) {
  const navigate = useNavigate();
  const [trackList, setTrackList] = useState([]);
  const [selectedTab, setSelectedTab] = useState("all");
  const [rankedTrackList, setRankedTrackList] = useState([]);
  const [musicList, setMusicList] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [videoList, setVideoList] = useState([]);
  const [creatorList, setCreatorList] = useState([]);

  useEffect(() => {
    const fetchTrackList = async () => {
      const { data } = await getMostRecentTrack();
      setTrackList(data);
    };

    const fetchTopTrackMusicList = async () => {
      const { data } = await getTopTrackList("music");
      setMusicList(data);
    };

    const fetchTopTrackImageList = async () => {
      const { data } = await getTopTrackList("image");
      setImageList(data);
    };

    const fetchTopTrackVideoList = async () => {
      const { data } = await getTopTrackList("video");
      setVideoList(data);
    };

    const fetchCreatorList = async () => {
      const { data } = await getNotableUser();
      let tempData = [];
      for (let i = 0; i < data.length; i++) {
        let temp = data[i];
        if (temp.firstname.length > 0) {
          temp.isChecked = false;
          tempData.push(temp);
        }
      }
      setCreatorList(tempData);
    };

    fetchTrackList();
    fetchRankedTrackList("all");
    fetchTopTrackMusicList();
    fetchTopTrackImageList();
    fetchTopTrackVideoList();
    fetchCreatorList();
  }, []);

  const fetchRankedTrackList = async (category) => {
    const { data } = await getAlbumByTypeWithSize(category, 0, 8);
    console.log(data);
    setRankedTrackList(data);
  };

  const onChangeTab = (value) => {
    setSelectedTab(value);
    fetchRankedTrackList(value, 0, 8);
  };

  const onGoToTrack = (id) => {
    navigate(`/track_list/${id}`);
  };

  return (
    <Container>
      <div className="page">
        <div className="storeFrontPage">
          <div className="header">
            <div className="header_text">
              <p className="title">
                Earn royalties from your favourite artists, songs and content
                creators!
              </p>
              <p className="info">
                Over 100,000 songs are available, and here’s an opportunity to
                own a piece of history from your favourite artist!
              </p>

              <div className="buttons">
                <button
                  className="explore"
                  onClick={() => navigate("/explore")}
                >
                  Explore
                </button>
              </div>
            </div>
            <div className="header_image">
              <img src={storeFront} alt="" />
            </div>
          </div>

          <div className="middle">
            <div className="middle_header">
              <p>Latest Drop</p>
              <button onClick={() => navigate("/explore")}>View all</button>
            </div>

            <div className="middle_collection">
              {trackList.map((item, index) => (
                <Drop key={index} item={item} type="dummy" />
              ))}
            </div>
          </div>

          <div className="banner">
            <div className="banner_info">
              <div className="title">
                Claim ownership of your favorite album.
              </div>
              <div className="info">
                Start your collection and cherish diverse ranges of iconic
                albums by the Jackson 5, Bee Gees, Eminem, Snoop Dogg, Luciano
                Pavorotti and Sex Pistols.
              </div>
              <button onClick={() => navigate("/album")}>Explore albums</button>
            </div>
            <div className="banner_image">
              <img className="banner_major_image" src={banner} alt="" />
            </div>
          </div>

          <div className="bottom">
            <p className="title">Highest Ranked</p>
            <div className="bottom_header">
              <p
                className={selectedTab === "all" ? "select" : "un-select"}
                onClick={() => onChangeTab("all")}
              >
                All
              </p>
              <p
                className={selectedTab === "image" ? "select" : "un-select"}
                onClick={() => onChangeTab("image")}
              >
                Art
              </p>
              <p
                className={selectedTab === "music" ? "select" : "un-select"}
                onClick={() => onChangeTab("music")}
              >
                Music
              </p>
              <p
                className={selectedTab === "video" ? "select" : "un-select"}
                onClick={() => onChangeTab("video")}
              >
                Video
              </p>
              <p
                className={
                  selectedTab === "collectables" ? "select" : "un-select"
                }
                onClick={() => onChangeTab("collectables")}
              >
                Collectables
              </p>
              <p
                className={
                  selectedTab === "photography" ? "select" : "un-select"
                }
                onClick={() => onChangeTab("photography")}
              >
                Photography
              </p>
            </div>

            <div className="nfts">
              {rankedTrackList.map((item, index) => (
                <Album
                  key={index}
                  item={item}
                  onGoMusicTrack={(id) => onGoToTrack(id)}
                  type="dummy"
                />
              ))}
            </div>

            {/* <div className="nfts">
              {rankedTrackList.map((item, index) => (
                <Drop key={index} item={item} type="dummy" />
              ))}
            </div> */}
          </div>
        </div>
        <div className="collections">
          <div className="collections-page">
            <div className="header">
              <div>
                Top collections over <span>Last 7 days</span>
              </div>
              <button onClick={() => navigate("/explore")}>
                View all ranking
              </button>
            </div>
            <div className="body">
              <div className="body-cell-left">
                <div className="title">Music</div>
                {musicList.map((item, index) => (
                  <Collection key={index} item={item} type="dummy" />
                ))}
              </div>
              <div className="body-cell-center">
                <div className="title">Video</div>
                {videoList.map((item, index) => (
                  <Collection key={index} item={item} type="dummy" />
                ))}
              </div>
              <div className="body-cell-right">
                <div className="title">Art</div>
                {imageList.map((item, index) => (
                  <Collection key={index} item={item} type="dummy" />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="storeFrontPage">
          <div className="middle">
            <div className="middle_header">
              <p>Notable creators</p>
              {/* <button>View all</button> */}
            </div>

            <div className="middle_collection">
              {creatorList.map((item, index) => (
                <Creator key={index} item={item} type="dummy" />
              ))}
            </div>
          </div>
        </div>
        <div className="categorySection">
          <div className="middle">
            <div className="middle_header">Categories you might love</div>

            <div className="middle_collection">
              <div
                style={{ backgroundImage: `url("/img/music.png")` }}
                className="category"
              >
                <div className="music">Music</div>
                <a className="explore">Explore more</a>
              </div>
              <div
                style={{ backgroundImage: `url("/img/colletibles.png")` }}
                className="category"
              >
                <div className="music">Collectibles</div>
                <a className="explore">Explore more</a>
              </div>
              <div
                style={{ backgroundImage: `url("/img/art.png")` }}
                className="category"
              >
                <div className="music">Art</div>
                <a className="explore">Explore more</a>
              </div>
              <div
                style={{ backgroundImage: `url("/img/photography.png")` }}
                className="category"
              >
                <div className="music">Photography</div>
                <a className="explore">Explore more</a>
              </div>
            </div>
          </div>
        </div>
        <AfterLoginFooter />
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 90vh;
  width : 100vw;
  overflow-x: hidden;

  .page{
    max-height: 90vh !important;
    overflow-y : scroll;
  ::-webkit-scrollbar{
    display : none;
  }

  .storeFrontPage {
    flex: 1;
    max-width: 1112px;
    margin-left: auto;
    margin-right: auto;
    padding-top: 30px;

    .header {
      display: flex;
      justify-content: space-between;

      .header_text {
        width: 500px;
        .title {
          font-weight: 700;
          font-size: 40px;
          margin-bottom: 20px;
        }

        .info {
          font-weight: 400;
          font-size: 16px;
          color: #858fa2;
        }

        .buttons {
          display: flex;
          margin-top: 20px;

          button {
            height: 50px;
            width: 202px;
            border-radius: 5px;
          }

          .explore {
            background: #e0335d;
            color: #ffffff;
            border: 0;
            margin-right: 20px;
          }

          .create_your_own {
            background: white;
            color: #e0335d;
            border: 1px solid #e0335d;
          }
        }
      }

      .header_image {
        img {
          width: 500px;
          object-fit: contain;
        }
      }
    }

    .middle {
      margin-top: 30px;

      .middle_header {
        display: flex;
        justify-content: space-between;
        margin-right: 16px;
        button {
          height: 45px;
          width: 170px;
          border-radius: 5px;
          background: #e0335d;
          color: #ffffff;
          border: 0;
        }

        p {
          font-weight: 700;
          font-size: 25px;
        }
      }

      .middle_collection {
        display: flex;
        flex-wrap: wrap;
        margin-top: 20px;
        width: 1130px;
        @media only screen and (max-width: 1100px) {
          width: 100%;
        }
      }
    }

    .banner_major_image {
      width: 560px;
      @media only screen and (max-width: 1480px) {
        width: 400px;
      }
      @media only screen and (max-width: 1150px) {
        width: 320px;
      }
      @media only screen and (max-width: 880px) {
        width: 280px;
      }
      @media only screen and (max-width: 768px) {
        width: 200px;
      }
      @media only screen and (max-width: 640px) {
        width: 0px;
      }
    }
    
    .banner {
      display: flex;
      height: 360px;
      width: 99%;
      border-radius: 20px;
      background: #e0335d;
      margin-top: 20px;
      .banner_image {
        width: 45%;
        display: flex;
        align-items: center;
        @media only screen and (max-width: 640px) {
          width: 0%;
        }
      }
      .banner_info {
        width: 55%;
        @media only screen and (max-width: 640px) {
          width: 80%;
        }
        margin-left: 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .title {
          font-style: normal;
          font-weight: 700;
          font-size: 40px;
          color: #fff;
          margin: 20px 0 20px 0px;
          @media only screen and (max-width: 1150px) {
            font-weight: 700;
            font-size: 32px;
          }
          @media only screen and (max-width: 900px) {
            font-weight: 700;
            font-size: 24px;
          }
          @media only screen and (max-width: 768px) {
            font-weight: 700;
            font-size: 20px;
          }
        }

        .info {
          margin-top: 10px;
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          margin-bottom: 20px;
          color: #ffffff;
        }

        button {
          width: 230px;
          height: 50px;
          background-color: #fff;
          border: 0;
          border-radius: 5px;
          font-weight: 700;
          font-size: 16px;
          text-align: center;
          color: #de456a;
          @media only screen and (max-width: 568px) {
            width: 180px;
            height: 40px;
          }
        }
      }
    }

    .bottom {
      margin-top: 30px;
      .title {
        font-weight: 700;
        font-size: 25px;
        margin-bottom: 20px;
      }

      .bottom_header {
        display: flex;
        .select{
          background-color: #e0335d;
          color: white;
          border-radius: 5px;
          padding: 5px 30px 5px 30px;
          margin-right: 30px;
          cursor: pointer;
        }

        .un-select{
         background-color: white;
          color: #858FA2;
          border-radius: 5px;
          padding: 5px 30px 5px 30px;
          margin-right: 30px;
          border : 2px solid lightgray;
          cursor: pointer;
        }
      }


      .nfts{
          margin-top : 20px;
          display :flex;
          width : fit-content;
          width : 1200px;
          flex-wrap : wrap;
          margin-bottom : 50px;
          @media only screen and (max-width: 1100px) {
            width: 100%;
          }
        }
    }
  }

  .collections {
    width: 100vw;
    background: #282828;
    padding: 50px 0;

    .collections-page {
      width: 1100px;
      min-height: 650px;
      margin-right: auto;
      margin-left: auto;
      @media only screen and (max-width: 1100px) {
        width: 95%;
      }
      .header {
        display: flex;
        justify-content: space-between;
        color: white;
        font-size: 25px;
        font-style: bold;

        span {
          color: #e0335d;
        }

        button {
          height: 45px;
          width: 230px;
          font-size: 18px;
          border-radius: 5px;
          background: #e0335d;
          color: #ffffff;
          border: 0;
        }
      }

      .body {
        display: flex;
        justify-content: space-between;
        margin-top: 40px;

        .title {
          color: white;
          font-size: 22px;
          margin-bottom: 20px;
        }

        .body-cell-left {
          width: 33%;
          padding-right: 12px;
          border-right: 1px solid #737373;
          min-height: 650px;
        }

        .body-cell-center {
          width: 33%;
          padding-left: 8px;
          padding-right: 12px;
          border-right: 1px solid #737373;
          min-height: 650px;
        }

        .body-cell-right {
          width: 33%;
          padding-left: 8px;
          min-height: 650px;
        }
      }
    }
  }

  .categorySection {
    flex: 1;
    width: 1112px;
    margin-left: auto;
    margin-right: auto;
    padding-top: 30px;

    .middle {
      margin-top: 30px;

      .middle_header {
        text-align: center;
        font-size: 24px;
        font-weight: 900;
      }

      .middle_collection {
        display: flex;
        flex-wrap: wrap;
        margin-top: 20px;
        margin-bottom: 50px;
        width: 1150px;
        @media only screen and (max-width: 1100px) {
          width: 100%;
        }

        .category {
          position: relative;
          height: 284px;
          width: 255px;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          margin-right: 28px;
          margin-bottom: 20px;

          .music {
            position: absolute;
            top: 196px;
            width: 100%;
            font-size: 24px;
            font-weight: 700;
            display: flex;
            justify-content: center;
          }

          .explore {
            position: absolute;
            width: 100%;
            top: 234px;
            font-size: 22px;
            font-weight: 500;
            display: flex;
            justify-content: center;
            color: #e0335d;
          }
        }
      }
    }
  }
`;

export default StoreFrontPage;
