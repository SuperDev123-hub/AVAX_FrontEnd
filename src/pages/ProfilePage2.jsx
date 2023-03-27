import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Avatar } from "@mui/material";
import copyIcon from "../images/copyIcon.PNG";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CreateIcon from "@material-ui/icons/Create";
import Drop from "../components/Drop";
import { useParams } from "react-router-dom";
import { getTrackListByUserId, updateUser } from "../api/api1";
import AfterLoginFooter from "../components/AfterLoginFooter";
import AuthActions from "../actions/auth.actions";
import { uploadImageToPinata, clipImage, BANNER_WIDTH } from "../api/pinata";
import { IPFS_PREFIX } from "../utils/constant";

function ProfilePage2() {
  const { address } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.Auth.user);
  const [isEdit, setIsEdit] = useState(false);
  const [profileInfo, setProfileInfo] = useState(user);
  const [image, setImage] = useState(null);
  const [banner, setBanner] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [trackList, setTrackList] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchTrackList = async () => {
      const { data } = await getTrackListByUserId(user.id);
      setTrackList(data);
    };

    fetchTrackList();
  }, [user]);

  useEffect(() => {
    setProfileInfo(user);
  }, [user]);

  const onClickUploadImage = () => {
    let img = document.getElementById("profile-edit-image");
    img.click();
  };

  const selectImage = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const onClickUploadBanner = () => {
    let img = document.getElementById("profile-edit-banner");
    img.click();
  };

  const selectBanner = (e) => {
    if (e.target.files[0]) {
      setBanner(e.target.files[0]);
    }
  };

  const saveProfile = async (e) => {
    setUploading(true);
    try {
      let resImage,
        resBanner = null;
      if (image) {
        resImage = await uploadImageToPinata(image);
      }
      const reader = new FileReader();
      reader.onload = function (e) {
        let imageData = e.target.result;
        const img = new Image();
        img.onload = function () {
          clipImage(img, BANNER_WIDTH, async (logodata) => {
            if (logodata) {
              let response = await fetch(logodata);
              let optimized_file = await response.blob();
              resBanner = await uploadImageToPinata(optimized_file);
              const data = {
                ...profileInfo,
                avatar: image ? resImage.IpfsHash : profileInfo.avatar,
                banner: banner ? resBanner.IpfsHash : profileInfo.banner,
              };
              await updateUser(data);

              dispatch(AuthActions.fetchSuccess(data));
              setUploading(false);
              setIsEdit(false);
            }
          });
        };
        img.src = imageData;
      };
      reader.readAsDataURL(banner);
    } catch (err) {
      setUploading(false);
      console.log("err", err);
    }
  };

  const onChangeProfileInfo = (key, value) => {
    setProfileInfo({ ...profileInfo, [key]: value });
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Container>
      <div className="page">
        <div className="profilePage">
          <div className="top">
            <div className="cover_photo">
              {!isEdit ? (
                profileInfo?.banner ? (
                  <img
                    style={{ objectFit: "cover" }}
                    src={`${IPFS_PREFIX}${profileInfo?.banner}`}
                    alt=""
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#e3e3e3",
                    }}
                  ></div>
                )
              ) : (
                <div style={{ position: "relative" }}>
                  {banner ? (
                    <img
                      style={{ cursor: "pointer", objectFit: "cover" }}
                      src={URL.createObjectURL(banner)}
                      alt=""
                      onClick={() => onClickUploadBanner()}
                    />
                  ) : profileInfo?.banner !== null ? (
                    <img
                      style={{ cursor: "pointer", objectFit: "cover" }}
                      src={`${IPFS_PREFIX}${profileInfo?.banner}`}
                      alt=""
                      onClick={() => onClickUploadBanner()}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#e3e3e3",
                      }}
                    ></div>
                  )}
                  <CreateIcon
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      cursor: "pointer",
                    }}
                    fontSize="large"
                    onClick={() => onClickUploadBanner()}
                  />
                  <input
                    type="file"
                    id="profile-edit-banner"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={selectBanner}
                  />
                </div>
              )}
            </div>
            <div className="top_info">
              <div className="follow_button">
                {!isEdit ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Avatar
                      src={`${IPFS_PREFIX}${profileInfo?.avatar}`}
                      className="avatar"
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {image ? (
                      <Avatar
                        src={URL.createObjectURL(image)}
                        className="avatar"
                      />
                    ) : (
                      <Avatar
                        src={`${IPFS_PREFIX}${profileInfo?.avatar}`}
                        className="avatar"
                      />
                    )}
                    <AddCircleIcon
                      className="add-avatar"
                      color="primary"
                      onClick={() => onClickUploadImage()}
                    />
                    <input
                      type="file"
                      id="profile-edit-image"
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={selectImage}
                    />
                  </div>
                )}
                <div>
                  {isEdit ? (
                    <button
                      className="follow"
                      style={{ backgroundColor: "#e0335d", color: "white" }}
                      onClick={() => saveProfile()}
                    >
                      {uploading ? "Saving..." : "Save"}
                    </button>
                  ) : (
                    <button className="follow" onClick={() => setIsEdit(true)}>
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {isEdit ? (
                <div>
                  <div className={"input-group"}>
                    <input
                      className={"input"}
                      placeholder="Name"
                      value={profileInfo?.firstname}
                      onChange={(e) =>
                        onChangeProfileInfo("firstname", e.target.value)
                      }
                    />
                  </div>
                </div>
              ) : (
                <p className="name">{profileInfo?.firstname}</p>
              )}

              <div className="address">
                {copied ? <p>Copied!</p> : <p>{address.slice(0, 15)}...</p>}

                <img
                  className="copy_icon"
                  style={{ cursor: "pointer" }}
                  src={copyIcon}
                  alt=""
                  onClick={copyAddress}
                />
              </div>
            </div>
          </div>
          <div className="bottom">
            {/* <div className="header">
              <div className="header_options">
                <div className="collected">
                  <p>Collected</p>
                  <span>10</span>
                </div>
                <div className="option">
                  <p>Created</p>
                  <span>10</span>
                </div>
                <div className="option">
                  <p>Favourited</p>
                  <span>10</span>
                </div>
                <div className="option">
                  <p>Activity</p>
                  <span>10</span>
                </div>
              </div>
              <div className="header-right">
                <p className="offers">Earning</p>
                <p className="offers">Offers</p>
              </div>
            </div> */}

            <div className="bottom_content">
              {/* <div className="bottom_header_2">
                <div className="left">
                  <div className="search_bar">
                    <img src={SearchIcon} alt="" />
                    <input type="text" placeholder="Red hot chilli peppers" />
                  </div>

                  <Select className="inner_div" value={"all"} onChange={null}>
                    <MenuItem value={"all"}>All items</MenuItem>
                  </Select>

                  <Select
                    className="inner_div"
                    value={"recent"}
                    onChange={null}
                  >
                    <MenuItem value={"recent"}>Recently Listed</MenuItem>
                  </Select>
                </div>

                <div className="right">
                  <div className="inner_div">
                    <p>Filter</p>
                    <img src={FilterIcon} alt="" />
                  </div>
                </div>
              </div> */}

              <div className="nfts">
                {trackList.map((item, index) => (
                  <Drop
                    key={index}
                    item={item}
                    user_type={user.usertype}
                    type="dummy"
                  />
                ))}
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
  width: 100vw;
  overflow-x: hidden;

  .page {
    /* height : fit-content; */
    max-height: 90vh !important;
    overflow-y: scroll;
    ::-webkit-scrollbar {
      display: none;
    }
  }

  .profilePage {
    flex: 1;
    display: flex;
    flex-direction: column;

    .top {
      .cover_photo {
        height: 160px;
        background-size: cover;
        width: 100vw;
        background-position: center;
        background-repeat: no-repeat;

        img {
          width: 100vw;
          height: 160px;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
      }

      .save {
        &:hover {
          background-color: #f5f4f4 !important;
        }
      }

      .top_info {
        margin-left: 170px;

        .follow_button {
          display: flex;
          justify-content: space-between;
          width: 80vw;

          label {
            p {
              color: blue;
              text-align: center;

              &:hover {
                cursor: pointer;
                color: #0099ff;
              }
            }
          }

          .avatar {
            height: 200px;
            width: 200px;
            margin-top: -100px;
            border: 10px solid white;
          }

          .add-avatar {
            z-index: 9999;
            margin-top: -51px;
            margin-left: 128px;
            font-size: 50px;
          }

          button {
            height: 50px !important;
            margin-top: 20px;
            background-color: white;
            border: 2px solid gray;
            border-radius: 5px;
            width: 180px;
            color: gray;
            font-weight: 500;

            &:hover {
              cursor: pointer;
            }
          }
        }

        .input-group {
          margin-top: 30px;
        }

        .input {
          height: 50px;
          padding: 8px 16px;
          box-sizing: border-box;
          font-size: 16px;
          color: #333;
          border-radius: 10px;
          outline: none;
          border: 1px solid #eaeaf1;

          &:focus {
            box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
          }
        }

        .name {
          font-weight: 700;
          font-size: 30px;
          margin-top: 10px;
        }

        .address {
          border: 2px solid lightgray;
          border-radius: 10px;
          padding: 10px;
          display: flex;
          width: 270px;
          margin-top: 20px;

          p {
            flex: 1;
            margin-top: auto;
            margin-bottom: auto;
            text-align: center;
            color: #858fa2;
            font-size: 18px;
          }
          .copy_icon {
            width: 28px;
          }

          .logo {
            width: 20px;
            margin-right: 8px;
          }
        }

        .other_info {
          width: 660px;
          color: #858fa2;
          margin-top: 20px;
        }

        .joined_on {
          font-weight: 700;
          font-size: 14px;
          color: #858fa2;
          margin-top: 20px;
        }
      }
    }

    .bottom {
      margin-top: 30px;
      .header {
        margin-left: 170px;
        display: flex;
        justify-content: space-between;
        width: 80vw;
        border-bottom: 1px solid lightgray;

        .collected {
          color: #e0335d !important;
          border-bottom: 2px solid #e0335d !important;
          display: flex;
          margin-right: 40px;
          padding-bottom: 20px;

          p {
            font-weight: 500;
            font-size: 18px;
          }

          span {
            margin-left: 5px;
            font-size: 15px;
            margin-top: 3px;
            margin-bottom: auto;
          }
        }

        .header_options {
          display: flex;

          .option {
            display: flex;
            margin-right: 40px;
            padding-bottom: 20px;
            p {
              font-weight: 500;
              font-size: 18px;
              color: #4a5568;
            }

            span {
              margin-left: 5px;
              color: #4a5568;
              font-size: 15px;
              margin-top: 3px;
              margin-bottom: auto;
            }
          }
        }

        .header-right {
          display: flex;
          justify-content: flex-end;

          .offers {
            font-weight: 500;
            font-size: 18px;
            color: #4a5568;
            margin-left: 24px;
          }
        }
      }

      .bottom_content {
        background-color: #fffbfb;
        padding-top: 30px;

        .bottom_header_2 {
          display: flex;
          justify-content: space-between;
          padding: 15px;
          border: 1px solid gray;
          border-radius: 10px;
          background-color: white;
          width: 1100px;
          margin-left: 170px;

          .left {
            display: flex;

            .inner_div {
              border: 1px solid lightgray;
              border-radius: 5px;
              padding: 10px;
              display: flex;
              width: 180px;
              height: 59px;
              justify-content: space-between;
              margin-right: 15px;

              fieldset {
                border: none;
              }

              p {
                font-size: 14px;
              }

              img {
                width: 15px;
              }
            }

            .search_bar {
              display: flex;
              width: 450px;
              border: 1px solid lightgray;
              border-radius: 5px;
              padding: 10px;
              margin-right: 15px;
              background: #f3f3f4;

              input {
                outline-width: 0;
                border: 0;
                width: 95%;
                background: #f3f3f4;
              }

              img {
                width: 16px;
                object-fit: contain;
                margin-right: 5px;
              }
            }
          }

          .right {
            .inner_div {
              border: 1px solid lightgray;
              border-radius: 5px;
              padding: 13px 10px;
              display: flex;
              width: 88px;
              height: 59px;
              justify-content: space-between;

              p {
                font-size: 16px;
              }

              img {
                width: 16px;
              }
            }
          }
        }

        .nfts {
          margin-left: 170px;
          margin-top: 20px;
          display: flex;
          flex-wrap: wrap;
          /* justify-content : space-around; */
          margin-bottom: 50px;
        }
      }
    }
  }
`;

export default ProfilePage2;
