import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Drop from "../components/Drop";
import AfterLoginFooter from "../components/AfterLoginFooter";
import { searchTrack } from "../api/api1";

function SearchPage({ account }) {
  const navigate = useNavigate();
  const search = useSelector((state) => state.Global.searchKey);
  const [trackList, setTrackList] = useState([]);

  useEffect(() => {
    const fetchSearchTrackList = async () => {
      const data = { search_word: search, category: "all" };
      const res = await searchTrack(data);
      if (res.data) {
        setTrackList(res.data);
      } else {
        setTrackList([])
      }
    };

    fetchSearchTrackList();
  }, [search]);

  return (
    <Container>
      <div className="back">
        <ArrowBackIcon fontSize="large" onClick={() => navigate("/platform")} />
      </div>
      <div className="page">
        <div className="storeFrontPage">
          <div className="header"></div>
          <div className="middle">
            <div className="middle_collection">
              {trackList.map((item, index) => (
                <Drop key={index} item={item} type="dummy" />
              ))}
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

  .back {
    padding-top: 40px;
    padding-left: 50px;
  }

  .page{
    max-height: 90vh !important;
    overflow-y : scroll;
  ::-webkit-scrollbar{
    display : none;
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

export default SearchPage;
