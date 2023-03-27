import React, { useState, useEffect } from "react";
import styled from "styled-components";
import paly_image from "../images/play.svg";
import { IPFS_PREFIX } from "../utils/constant";

function DropTrack(props) {
  const { item } = props;
  const price_str = "0.001";

  const onPlay = () => {
    window.open(props.item.cdn, "_blank");
  };

  return (
    <>
      <Container>
        <div
          className="cover_image"
          style={{
            backgroundImage: `url(${IPFS_PREFIX}${item.image_url})`,
          }}
        >
          {props.item.type === "video" || props.item.type === "music" ? (
            <div
              style={{ width: "100%", height: "100%", position: "relative" }}
              onClick={onPlay}
            >
              <img
                src={paly_image}
                alt=""
                style={{
                  position: "absolute",
                  width: "80px",
                  height: "80px",
                  right: "0px",
                }}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="drop_details">
          <div>
            <div className="name">{item.track_name}</div>
            <div className="price">
              <div className="quid">{price_str} QUID</div>
            </div>
          </div>
          <div className="type">Track</div>
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: fit-content;
  width: 351px;
  border-radius: 10px;
  border: 1px solid lightgray;
  margin-right: 20px;
  margin-bottom: 20px;

  .cover_image {
    height: 343px;
    width: 349px;
    /* background-image: url("https://media.npr.org/assets/img/2012/02/02/mona-lisa_custom-31a0453b88a2ebcb12c652bce5a1e9c35730a132.jpg"); */
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom: 1px solid lightgray;
  }

  .drop_details {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: end;
    padding: 0 15px 0 15px;
    width: 100%;
    margin-bottom: 20px;

    .name {
      font-weight: 500;
      font-size: 20px;
      margin-left: 2px;
      margin-right: 40px;
      margin-bottom: 5px;
      width: 100%;
      height: 40px;
    }

    .price {
      margin-top: 20px;
      .quid {
        font-weight: 700;
        font-size: 20px;
        color: #e0335d;
      }
      .count {
        font-weight: 700;
        font-size: 20px;
        color: #e0335d;
        margin-top: 5px;
      }

      .dollar {
        font-weight: 400;
        font-size: 15px;
        color: #858fa2;
      }
    }

    .type {
      border-radius: 3px;
      border: 1px solid #e4e4e4;
      padding: 3px 10px;
    }
  }
`;
export default DropTrack;
