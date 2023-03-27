import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Drop from "../components/Drop";
import AfterLoginFooter from "../components/AfterLoginFooter";
import { getTrackByAlbum } from "../api/api1";

function TrackListPage() {
  const { album_id } = useParams();
  const navigate = useNavigate();
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    fetchAlbumTrack(album_id);
  }, [album_id]);

  const fetchAlbumTrack = async (id) => {
    let res = await getTrackByAlbum(album_id, "all");
    setDataList(res.data);
  };

  const onBack = async () => {
    navigate("/platform");
  };

  return (
    <div>
      <Container>
        <div className="page">
          <Banner />
          <div className="back">
            <ArrowBackIcon fontSize="large" onClick={() => onBack()} />
          </div>

          <div className="storeFrontPage">
            <div className="header"></div>
            <div className="middle">
              <div className="middle_collection">
                <>
                  {dataList.map((item, index) => (
                    <Drop key={index} item={item} type="dummy" />
                  ))}
                </>
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

export default TrackListPage;
