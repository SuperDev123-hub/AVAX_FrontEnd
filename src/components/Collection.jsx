import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { IPFS_PREFIX } from "../utils/constant";

function Collection(props) {
  const navigate = useNavigate();

  return (
    <Container>
      <div className="collection">
        {props.item.image_url?.length > 0 ? (
          <img
            className="img_box"
            src={`${IPFS_PREFIX}${props.item.image_url}`}
            alt=""
          />
        ) : (
          <div className="img_box"></div>
        )}
        <div className="content">
          <div style={{ height: "48px", overflow: "hidden" }}>
            {props.item.track_name}
          </div>
          <div className="symbol">
            <div className="percent">+30.56%</div>
            <div className="earn">%84.3</div>
          </div>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: fit-content;
  width: 100%;
  height: 101px;
  border-radius: 10px;
  border: 1px solid #737373;
  margin-bottom: 20px;

  .img_box {
    width: 83px;
    height: 95px;
    border-radius: 8px;
    border: 1px solid #737373;
    margin-right: 5px;
    margin-left: 1px;
    margin-top: 2px;
    margin-bottom: 2px;
    object-fit: cover;
  }
  .collection {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: white;

    .content {
      padding: 5px;
      overflow: hidden;
      margin-right: 5px;
      flex: 1;
      .symbol {
        display: flex;
        justify-content: flex-start;

        .percent {
          color: #25e783;
          margin-right: 5px;
        }

        .earn {
          margin-left: auto;
        }
      }
    }
  }
`;
export default Collection;
