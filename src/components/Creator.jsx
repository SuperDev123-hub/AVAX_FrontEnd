import React from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import { IPFS_PREFIX } from "../utils/constant";

function Creator(props) {
  return (
    <>
      <Container>
        <div
          className="banner_image"
          style={{
            backgroundImage: `url(${IPFS_PREFIX}${props.item.banner})`,
          }}
        />
        <div className="avatar">
          <Avatar
            src={`${IPFS_PREFIX}${props.item.avatar}`}
            className="avatar_image"
          />
        </div>
        <div className="user_name">
          {props.item.firstname + " " + props.item.lastname}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: fit-content;
  width: 206px;
  height: 240px;
  border-radius: 10px;
  border: 1px solid #d3d3d3;
  margin-right: 20px;
  margin-bottom: 20px;

  .banner_image {
    height: 108px;
    width: 100%;
    background-color: #ebebeb;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  .avatar {
    margin-top: -70px;
    width: 100%;

    .avatar_image {
      width: 134px;
      height: 134px;
      margin: 0 auto;
      border: 5px solid #ffffff;
    }
  }

  .user_name {
    margin-top: 10px;
    text-align: center;
    font-size: 20px;
    font-weight: 900;
  }
`;

export default Creator;
