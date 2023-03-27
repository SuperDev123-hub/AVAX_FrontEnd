import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import paly_image from "../images/play.svg";
import showToast from "../components/toast";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useContract from "../utils/sc.interaction";
import PLATFORM_ABI from "../abi/SongPlatform.json";
import { CONTRACT_ADDRESS, IPFS_PREFIX } from "../utils/constant";

import PriceInput from "./PriceInput";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import styles from "./styles.module.scss";
import { buyTrack } from "../api/api1";
import LogoIcon from "../images/logo.png";

function Drop(props) {
  const { item, user_type } = props;
  const navigate = useNavigate();
  const { loadContract } = useContract();
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [reaminCount, setRemainCount] = useState(0);
  const [isBuying, setIsBuying] = useState(false);
  const [play, setPlay] = useState(false);

  const user = useSelector((state) => state.Auth.user);
  const price_str = "0.001";

  useEffect(() => {
    setRemainCount(item.buy_count);
  }, [item.buy_count]);

  const clickBuy = async () => {
    if (reaminCount < quantity) {
      toast.error("Exceeds NFT quantity.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    setIsBuying(true);
    try {
      const platformContract = await loadContract(
        CONTRACT_ADDRESS.PLATFORM,
        PLATFORM_ABI
      );
      // const songTrack = await loadContract(CONTRACT_ADDRESS.NFT, SongTrack_ABI);
      // const price = await songTrack.nftPrice();

      const price = ethers.utils.parseEther(price_str);
      let quantityVal = parseInt(quantity);
      let tx = await platformContract.createMarketSale(
        CONTRACT_ADDRESS.NFT,
        item.nft_id,
        quantity,
        { value: price.mul(quantityVal) }
      );
      await tx.wait();
      let param = {
        track_id: item.id,
        user_id: user.id,
        price: price_str,
        count: quantity,
      };
      buyTrack(param);
    } catch (err) {
      console.log(err);
      showToast("error", "Error on Buy NFT", err.message);
      setIsBuying(false);
      handleClose();
      return;
    }
    setRemainCount(reaminCount - quantity);
    toast.success("User bought NFT successfully.", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setTimeout(() => {
      setIsBuying(false);
      handleClose();
    }, 3000);
  };
  const onPlay = () => {
    if (item.cdn) {
      setPlay(true);
    }
  };

  const onPause = () => {
    setPlay(false);
  };

  const handleClickOpen = () => {
    if (Object.keys(user).length === 0 && user.constructor === Object) {
      navigate("/login");
      return;
    }
    if (user?.usertype === "admin") {
      toast.error("Admin user can't buy NFT.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Container>
        <div
          className="cover_image"
          style={{
            zIndex: 100,
            backgroundImage: !play && `url(${IPFS_PREFIX}${item.image_url})`,
            backgroundColor: "#000000",
          }}
        >
          {item.cdn && item.cdn.length > 0 ? (
            <div
              style={{ width: "100%", height: "100%", position: "relative" }}
            >
              {play ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#242526",
                      color: "white",
                      width: "100%",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: "10px",
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                      zIndex: 100,
                    }}
                  >
                    <ArrowBackIcon className="back_icon" onClick={onPause} />
                  </div>
                  <iframe
                    title={item.cdn}
                    style={{
                      zIndex: 1,
                      flex: 1,
                    }}
                    width="100%"
                    src={item.cdn}
                  ></iframe>
                </div>
              ) : (
                  <img
                    src={paly_image}
                    alt=""
                    style={{
                      position: "absolute",
                      width: "80px",
                      height: "80px",
                      right: "0px",
                      bottom: "-10px",
                      cursor: "pointer",
                    }}
                    onClick={onPlay}
                  />
                )}
            </div>
          ) : (
              <></>
            )}
        </div>
        {!play && (
          <div className="user_info">
            <Avatar src={`${IPFS_PREFIX}${item.avatar}`} className="avatar" />
            <p>{item.firstname}</p>
          </div>
        )}

        <div
          className="drop_details"
          style={{ marginTop: play ? "10px" : "20px" }}
        >
          <div className="name">{item.track_name}</div>
        </div>
        <div className="drop_details">
          <img
            src={LogoIcon}
            width="26"
            height="20"
            style={{ alignSelf: "center" }}
            alt=""
          />
          <div className="price" style={{ marginLeft: "4px" }}>
            <div className="quid">{price_str} QUID</div>
          </div>
          <div className="price" style={{ marginLeft: "auto" }}>
            <div className="quid">
              {reaminCount} / {item.quantity}
            </div>
          </div>
        </div>

        {user_type && user_type === "user" && (
          <div
            style={{
              marginTop: "-20px",
              paddingRight: "15px",
              width: "100%",
              fontWeight: "700",
              fontSize: "20px",
              color: "#e0335d",
              textAlign: "right",
            }}
          >
            {item.bought} RIGHTS
          </div>
        )}

        {user_type && user_type === "user" ? (
          <div style={{ height: "10px" }}></div>
        ) : (
            <div className="buttons">
              <button onClick={handleClickOpen}>Buy now</button>
            </div>
          )}
      </Container>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Buy NFT</DialogTitle>
        <DialogContent>
          <div
            className={styles.cover_image}
            style={{
              backgroundImage: `url(${IPFS_PREFIX}${item.image_url})`,
            }}
          >
            {item.type === "video" || item.type === "music" ? (
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
          <div className={styles.user_info}>
            <Avatar
              src={`${IPFS_PREFIX}${item.avatar}`}
              className={styles.avatar}
            />
            <p>{item.firstname}</p>
          </div>
          <div className={styles.drop_details} style={{ width: "330px" }}>
            <p className={styles.name}>{item.track_name}</p>
          </div>

          <div
            className={styles.drop_details}
            style={{ width: "330px", marginTop: "-20px" }}
          >
            <img
              src={LogoIcon}
              width="26"
              height="20"
              style={{ alignSelf: "center" }}
              alt=""
            />
            <div className={styles.price} style={{ marginLeft: "4px" }}>
              <div className={styles.quid}>{price_str} QUID</div>
            </div>
            <div className={styles.price} style={{ marginLeft: "auto" }}>
              <div className={styles.quid}>
                {reaminCount} / {item.quantity}
              </div>
            </div>
          </div>
          <PriceInput
            className={styles.formInput}
            placeholder="Quantity"
            decimals={2}
            value={"" + quantity}
            onChange={(val) => setQuantity(val)}
          />
        </DialogContent>
        <DialogActions>
          <div className={styles.buttons}>
            <button onClick={isBuying ? null : clickBuy}>
              {isBuying ? (
                <ClipLoader size="16" color="white"></ClipLoader>
              ) : (
                  "Buy now"
                )}
            </button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}

const Container = styled.div`
  height: fit-content;
  width: 351px;
  border-radius: 10px;
  border: 1px solid lightgray;
  margin-right: 22px;
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

  .back_icon {
    &:hover {
      cursor: pointer;
    }
  }

  .user_info {
    width: 170px;
    height: 40px;
    background-color: white;
    display: flex;
    margin-left: 10px;
    margin-top: -50px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.25);
    border-radius: 64px;
    align-items: center;
    z-index: 200;
    .avatar {
      margin-right: 8px;
    }

    p {
      font-weight: 600;
      font-size: 16px;
      margin-top: auto;
      margin-bottom: auto;
    }
  }

  .drop_details {
    margin-top: 10px;
    display: flex;
    padding: 0 15px 0 15px;
    width: 100%;
    margin-bottom: 20px;

    .name {
      font-weight: 500;
      font-size: 20px;
      margin-left: 2px;
      margin-right: 10px;
      width: 100%;
      height: 58px;
      word-break: break-word;
      overflow: hidden;
    }

    .price {
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
  }

  .buttons {
    width: 100%;
    display: flex;
    padding: 0px 0 20px 0;
    justify-content: center;
    button {
      width: 90%;
      /* margin-left : auto;
      margin-right : auto; */
      background-color: #e0335d;
      color: white;
      padding: 8px 0 8px 0;
      border-radius: 5px;
      border: 0;

      &:hover {
        cursor: pointer;
      }
    }
  }
`;
export default Drop;
