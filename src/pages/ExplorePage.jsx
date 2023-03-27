import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Album from "../components/Album";
import Drop from "../components/Drop";
import AfterLoginFooter from "../components/AfterLoginFooter";
import {
  getAlbumByType,
  getExploreDesc,
  getTrackList,
  getTrackByAlbum,
} from "../api/api1";

function ExplorePage() {
  const { type } = useParams();
  const [dataList, setDataList] = useState([]);
  const [description, setDescription] = useState("");
  const [isAlbum, setIsAlbum] = useState(true);

  useEffect(() => {
    const fetchDescription = async () => {
      const res = await getExploreDesc(type);
      setDescription(res.data);
    };

    const fetchAlbumList = async () => {
      const res = await getAlbumByType(type);
      setDataList(res.data);
    };

    const fetchTrackList = async () => {
      const res = await getTrackList(type, true, 0, 100);
      setDataList(res.data);
    };

    fetchDescription();
    if (type === "music" || type === "video") {
      fetchAlbumList();
    } else {
      fetchTrackList();
    }
  }, [type]);

  const onGoMusicTrack = async (id) => {
    let res = await getTrackByAlbum(id, type);
    setDataList(res.data);
    setIsAlbum(false);
  };

  const onBack = async () => {
    let res = await getAlbumByType(type);
    setDataList(res.data);
    setIsAlbum(true);
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div>
      <Container>
        <div className="page">
          <Banner />
          {!isAlbum && (
            <div className="back">
              <ArrowBackIcon fontSize="large" onClick={() => onBack()} />
            </div>
          )}
          {isAlbum ? (
            <div className="title">Explore {capitalizeFirstLetter(type)}</div>
          ) : (
              <div className="title" style={{ marginTop: "-32px" }}>
                Explore {capitalizeFirstLetter(type)} Track
              </div>
            )}
          {isAlbum && <div className="description">{description}</div>}
          <div className="storeFrontPage">
            <div className="header"></div>
            <div className="middle">
              <div className="middle_collection">
                {type === "music" || type === "video" ? (
                  <>
                    {isAlbum ? (
                      <>
                        {dataList.map((item, index) => (
                          <Album
                            key={index}
                            item={item}
                            onGoMusicTrack={(id) => onGoMusicTrack(id)}
                            type="dummy"
                          />
                        ))}
                      </>
                    ) : (
                        <>
                          {dataList.map((item, index) => (
                            <Drop key={index} item={item} type="dummy" />
                          ))}
                        </>
                      )}
                  </>
                ) : (
                    <>
                      {dataList.map((item, index) => (
                        <Drop key={index} item={item} type="dummy" />
                      ))}
                    </>
                  )}
              </div>
            </div>
          </div>
          <AfterLoginFooter />
        </div>
      </Container>
    </div>
  );
}

const Banner = styled.div`
  width: 100vw;
  height: 160px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url("/img/explore_banner.png");
`;

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

  .back {
    padding-top: 30px;
    padding-left: 30px;
    cursor: pointer;
  }

  .title {
    text-align: center;
    font-size: 26px;
    font-weight: 700;
    margin-top: 30px;
  }

  .description {
    max-width: 60vw;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    margin-top: 10px;
  }

  .storeFrontPage {
    flex: 1;
    width: 70vw;
    margin-left: auto;
    margin-right: auto;
    padding-top: 30px;

    .header {
      display: flex;
      justify-content: space-between;
    }

    .middle {
      margin-top: 30px;

      .middle_header {
        display: flex;
        justify-content: space-between;

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
        width: 75vw;
      }
    }
  }
`;

export default ExplorePage;
