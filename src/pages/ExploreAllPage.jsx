import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Select, MenuItem } from "@mui/material";
import SearchIcon from "@material-ui/icons/Search";
import Drop from "../components/Drop";
import AfterLoginFooter from "../components/AfterLoginFooter";
import { searchTrack } from "../api/api1";

const TRACK_TYPE = [
  { name: "All items", value: "all" },
  { name: "Music", value: "music" },
  { name: "Video", value: "video" },
  { name: "Collectables", value: "collectables" },
  { name: "Artworks", value: "image" },
];

const LIST = [{ name: "Recently listed", value: "recent" }];

function ExploreAllPage({ account }) {
  const [searchKey, setSearchKey] = useState("");
  const [type, setType] = useState("all");
  // const [list, setList] = useState("recent");
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    const fetchDataList = async () => {
      try {
        const res = await searchTrack({
          search_word: searchKey,
          category: type,
        });
        setDataList(res.data);
      } catch (err) {
        console.log("err", err);
      }
    };

    fetchDataList();
  }, [searchKey, type]);

  return (
    <div>
      <Container>
        <div className="page">
          <div className="storeFrontPage">
            <div className="header">
              <div className="md-4 px-2 pt-1">
                <div className="search-input">
                  <SearchIcon />
                  <input
                    value={searchKey}
                    placeholder="Red hot chilli peppers"
                    onChange={(e) => setSearchKey(e.target.value)}
                  />
                </div>
              </div>
              <div className="md-2 px-2 pt-1">
                <Select
                  className="select"
                  label="Type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  {TRACK_TYPE.map((item) => {
                    return (
                      <MenuItem key={item.value} value={item.value}>
                        {item.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
              <div className="md-2 px-2 pt-1">
                {/* <Select
                  className="select"
                  label="List"
                  value={list}
                  onChange={(e) => setList(e.target.value)}
                >
                  {LIST.map((item) => {
                    return (
                      <MenuItem key={item.value} value={item.value}>
                        {item.name}
                      </MenuItem>
                    );
                  })}
                </Select> */}
              </div>
              <div className="md-1 px-2 pt-1">
                {/* <div className="btn-filter">
                  <img src={FilterIcon} alt="" />
                  <div>Filter</div>
                </div> */}
              </div>
            </div>
            <div className="middle">
              <div className="middle_collection">
                {dataList.map((item, index) => (
                  <Drop key={index} item={item} type="dummy" />
                ))}
              </div>
            </div>
          </div>
          <AfterLoginFooter />
        </div>
      </Container>
    </div>
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

  .md-4 {
    width: 40%;
  }
  .md-2 {
    width: 25%;
  }
  .md-1 {
    width: 10%;
  }
  .px-2 {
    padding: 0 10px;
  }
  .pt-1 {
    padding-top: 0px;
  }
  
  @media screen and (max-width: 992px) {
    .md-4 {
      width: 100%;
    }
    .md-2 {
      width: 100%;
    }
    .md-1 {
      width: 100%;
    }
    .px-2 {
      padding: 0 10px;
    }
    .pt-1 {
      padding-top: 20px;
    }
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
      flex-wrap: wrap;
      border-radius: 10px;
      // border: 1px solid #858fa2;
      // padding: 20px;
      width: 100%;

      .search-input {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        height: 50px;
        color: #858fa2;
        border-radius: 5px;
        border: 1px solid #858fa2;
        padding: 0 5px;

        input {
          width: 100%;
          border: none;
          outline: none;
        }
      }

      .select {
        width: 100%;
        height: 50px;
      }

      .btn-filter {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 50px;
        border-radius: 5px;
        border: 1px solid #858fa2;
        font-size: 18px;
        padding: 0 5px;
        cursor: pointer;

        div {
          padding-left: 5px;
        }
      }
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

export default ExploreAllPage;
