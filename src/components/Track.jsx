import React, { useState } from "react";
import styled from "styled-components";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { uploadMetaDataToPinata } from "../api/pinata";
import { IPFS_PREFIX } from "../utils/constant";
import { ClipLoader } from "react-spinners";
import { uploadImageToPinata, clipImage, IMAGE_SIZE } from "../api/pinata";
import TrackDialog from "./TrackDialog";

const GENRE_TYPE = [
  { name: "HipHop", value: "HipHop" },
  { name: "Rock", value: "Rock" },
  { name: "Punk", value: "Punk" },
  { name: "Jazz", value: "Jazz" },
  { name: "Dance & EDM", value: "Dance & EDM" },
  { name: "Metal", value: "Metal" },
  { name: "Country", value: "Country" },
  { name: "Documentary", value: "Documentary" },
  { name: "Other", value: "Other" },
];

const TRACK_TYPE = [
  { name: "Music", value: "music" },
  { name: "Video", value: "video" },
  { name: "Art", value: "image" },
  { name: "Photography", value: "photography" },
  { name: "Collectables", value: "collectables" },
  { name: "Other", value: "other" },
];
function Track(props) {
  const [trackItem, setTrackItem] = useState({
    type: "music",
    genre: "HipHop",
    artist: "",
    user_id: localStorage.getItem("userId"),
    volume_number: 1,
    nft_id: "",
    nft_metadata: "",
    album_id: props.albumId,
    image_url: props.ipfsHash,
    external_link: "",
    track_name: "",
    track_number: props.data.length + 1,
    description: "",
    quantity: "1000",
    cdn: "",
    sku: "",
  });
  const [isAddTrack, setIsAddTrack] = useState(false);
  const [isUpdateTrack, setIsUpdateTrack] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isAddingArtWork, setIsAddingArtwork] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [trackData, setTrackData] = useState({});

  const onClickUploadImage = () => {
    let img = document.getElementById("artwork-image");
    img.click();
  };

  const selectImage = async (e) => {
    if (e.target.files[0]) {
      setIsAddingArtwork(true);
      let file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = function (e) {
        let imageData = e.target.result;
        const img = new Image();
        img.onload = function () {
          clipImage(img, IMAGE_SIZE, async (logodata) => {
            let res = null;

            if (logodata) {
              let response = await fetch(logodata);
              let optimized_file = await response.blob();
              res = await uploadImageToPinata(optimized_file);
            }
            if (res) setTrackItem({ ...trackItem, image_url: res.IpfsHash });
            setIsAddingArtwork(false);
          });
        };
        img.src = imageData;
      };
      reader.readAsDataURL(file);
    }
  };

  const onChangeValue = (key, value) => {
    let tempTrackItem = { ...trackItem };
    tempTrackItem = { ...trackItem, [key]: value };
    setTrackItem(tempTrackItem);
  };

  const onAdd = async () => {
    console.log(trackItem);
    setIsAdding(true);
    const metaData = {
      name: `${trackItem.track_name}`,
      description: "This image shows the true nature of NFT.",
      image: `${IPFS_PREFIX + trackItem.image_url}`,
    };
    let metaDataRes = await uploadMetaDataToPinata(metaData);
    trackItem.nft_metadata = IPFS_PREFIX + metaDataRes.IpfsHash;
    props.onAddTrack(trackItem);
    setTimeout(() => {
      setInitialItem(parseInt(trackItem.track_number) + 1);
    }, 500);
    setIsAddTrack(false);
    setIsAdding(false);
  };

  const onCancel = () => {
    setInitialItem(parseInt(props.data.length) + 1);
    setIsAddTrack(false);
  };

  const onClickEditTrack = (track) => {
    setTrackData(track);
    setOpenDialog(true);
  };

  const onDeleteTrack = (track) => {
    props.onDeleteTrack(track);
    setInitialItem(
      parseInt(props.data.length) > 1 ? parseInt(props.data.length) - 1 : 1
    );
    setOpenDialog(false);
  };

  const onSaveTrack = async (trackItem) => {
    setIsUpdateTrack(true);
    const metaData = {
      name: `${trackItem.track_name}`,
      description: "This image shows the true nature of NFT.",
      image: `${IPFS_PREFIX + trackItem.image_url}`,
    };
    let metaDataRes = await uploadMetaDataToPinata(metaData);
    trackItem.nft_metadata = IPFS_PREFIX + metaDataRes.IpfsHash;
    console.log(trackItem);
    props.onUpdateTrack(trackItem);
    setIsUpdateTrack(false);
    setOpenDialog(false);
  };

  const onCloseDialog = () => {
    setOpenDialog(false);
  };

  const setInitialItem = (no) => {
    setTrackItem({
      type: "music",
      genre: "HipHop",
      artist: "",
      user_id: localStorage.getItem("userId"),
      volume_number: 1,
      nft_id: "",
      nft_metadata: "",
      album_id: props.albumId,
      image_url: props.ipfsHash,
      external_link: "",
      track_name: "",
      track_number: no,
      description: "",
      quantity: "1000",
      cdn: "",
      sku: "",
    });
  };

  return (
    <Container>
      <div className="track-list">
        <div className="track-header">
          <div className="no"></div>
          <div className="track">Track</div>
          <div className="quantity">Quantity</div>
          <div className="sku">SKU</div>
          <div className="description">Description</div>
          <div className="manage"> </div>
        </div>
        {props.data.map((item, index) => {
          return (
            <div
              key={index}
              className="track-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className="no">{index + 1}</div>
              <div
                className="track"
                style={{ display: "flex", alignItems: "center" }}
              >
                {item.image_url?.length > 0 ? (
                  <img
                    src={IPFS_PREFIX + item.image_url}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "4px",
                      marginRight: "8px",
                    }}
                    alt=""
                  />
                ) : (
                  <div></div>
                )}
                {item.track_name}
              </div>
              {/* <div className="artist">{item.artist}</div> */}
              <div className="quantity">{item.quantity}</div>
              <div className="sku">{item.sku}</div>
              <div className="description">{item.description}</div>
              <div
                style={{
                  width: "28px",
                  textAlign: "center",
                  color: "#e0335d",
                  borderRadius: "5px",
                  border: "1px solid #e0335d",
                }}
                onClick={() => onClickEditTrack(item)}
              >
                ...
              </div>
            </div>
          );
        })}
      </div>
      {isAddTrack && (
        <div>
          <div className="add-item">
            <input
              value={trackItem.track_number}
              style={{ width: "10%" }}
              onChange={(e) =>
                onChangeValue(
                  "track_number",
                  isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                )
              }
              placeholder="Track No"
            />

            <input
              value={trackItem.track_name}
              onChange={(e) => onChangeValue("track_name", e.target.value)}
              placeholder="Track name"
              style={{ width: "30%" }}
            />
            <FormControl>
              <InputLabel id="select-label">Type</InputLabel>
              <Select
                className="select"
                labelId="select-label"
                value={trackItem.type}
                onChange={(e) => onChangeValue("type", e.target.value)}
              >
                {TRACK_TYPE.map((item) => {
                  return (
                    <MenuItem key={item.value} value={item.value}>
                      {item.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <input
              value={trackItem.quantity}
              style={{ width: "10%" }}
              onChange={(e) =>
                onChangeValue(
                  "quantity",
                  isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                )
              }
              placeholder="Quantity"
            />
            <input
              value={trackItem.sku}
              onChange={(e) => onChangeValue("sku", e.target.value)}
              placeholder="SKU"
              style={{ width: "20%" }}
            />
          </div>
          <div className="add-item">
            <FormControl>
              <InputLabel id="select-label">Genre</InputLabel>
              <Select
                className="select"
                labelId="select-label"
                value={trackItem.genre}
                onChange={(e) => onChangeValue("genre", e.target.value)}
              >
                {GENRE_TYPE.map((item) => {
                  return (
                    <MenuItem key={item.value} value={item.value}>
                      {item.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <button
              className="btn-upload"
              onClick={() => {
                if (isAddingArtWork === false) onClickUploadImage();
              }}
            >
              {isAddingArtWork ? (
                <ClipLoader size="16" color="white"></ClipLoader>
              ) : (
                <>
                  Upload track art
                  <CloudUploadIcon
                    fontSize="medium"
                    style={{ marginLeft: "4px" }}
                  ></CloudUploadIcon>
                </>
              )}
            </button>

            <input
              type="file"
              id="artwork-image"
              style={{ display: "none" }}
              accept="image/*"
              onChange={selectImage}
            />

            <input
              style={{ width: "30%" }}
              value={trackItem.artist}
              onChange={(e) => onChangeValue("artist", e.target.value)}
              placeholder="Artist"
            />

            <input
              value={trackItem.volume_number}
              onChange={(e) =>
                onChangeValue(
                  "volume_number",
                  isNaN(parseInt(e.target.value))
                    ? ""
                    : parseInt(e.target.value)
                )
              }
              placeholder="Volume No"
              style={{ width: "15%" }}
            />
          </div>
          <div className="add-item">
            <input
              style={{ width: "49%" }}
              value={trackItem.cdn}
              onChange={(e) => onChangeValue("cdn", e.target.value)}
              placeholder="CDN"
            />
            <input
              style={{ width: "50%" }}
              value={trackItem.description}
              onChange={(e) => onChangeValue("description", e.target.value)}
              placeholder="Description"
            />
          </div>
          <div className="btn-add-track">
            <button
              className="btn-add"
              onClick={() => {
                if (isAdding === false) onAdd();
              }}
            >
              {isAdding ? (
                <ClipLoader size="16" color="white"></ClipLoader>
              ) : (
                "Add track"
              )}
            </button>
            <button className="btn-cancel" onClick={() => onCancel()}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {!isAddTrack && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="add-track" onClick={() => setIsAddTrack(true)}>
            Add new Track
            <AddCircleOutlineIcon
              fontSize="medium"
              style={{ marginLeft: "8px" }}
            />
          </div>
        </div>
      )}
      {props.data.length > 0 && (
        <>
          <div
            style={{
              backgroundColor: "#e0335d",
              height: "1px",
              width: "100%",
              marginTop: "24px",
            }}
          ></div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "24px",
            }}
          >
            <button
              className="btn-add btn-mint-all"
              onClick={async () => {
                if (isMinting === true) return;
                setIsMinting(true);
                await props.onMintAll();
                setIsMinting(false);
              }}
            >
              {isMinting ? (
                <ClipLoader size="16" color="white"></ClipLoader>
              ) : (
                "Mint all"
              )}
            </button>
          </div>
        </>
      )}
      <TrackDialog
        data={trackData}
        open={openDialog}
        updating={isUpdateTrack}
        saveTrack={onSaveTrack}
        handleDelete={onDeleteTrack}
        handleClose={onCloseDialog}
      ></TrackDialog>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  margin-top: 10px;

  .track-list {
    margin-bottom: 30px;

    .track-header {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #d3d3d3;
      padding-bottom: 10px;
      margin-bottom: 10px;

      .no {
        width: 1%;
        color: #e0335d;
      }
      .track {
        width: 29%;
      }
      .artist {
        width: 20%;
      }
      .quantity {
        width: 15%;
      }
      .sku {
        width: 15%;
      }
      .description {
        width: 20%;
      }
      .manage {
        width: 5%;
      }
    }
  }

  .add-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    input {
      border-radius: 5px;
      border: 1px solid #eaeaf1;
      height: 35px;
      padding: 0 5px;
    }

    .select {
      width: 190px;
      height: 35px;
    }
  }

  .btn-add-track {
    display: flex;
    justify-content: flex-start;
  }

  .btn-add {
    width: 150px;
    height: 40px;
    color: #ffffff;
    background-color: #e0335d;
    border-radius: 10px;
    border: none;
    margin-right: 20px;
  }

  .btn-upload {
    width: 25%;
    height: 34px;
    color: #ffffff;
    background-color: #e0335d;
    border-radius: 10px;
    border: none;
  }

  .btn-cancel {
    width: 150px;
    height: 40px;
    color: #e0335d;
    background-color: #ffffff;
    border-radius: 10px;
    border: 1px solid #e0335d;
  }

  .add-track {
    padding: 2px 8px;
    text-align: center;
    color: #e0335d;
    cursor: pointer;
    display: flex;
    font-weight: 700;
  }

  .btn-mint-all {
    margin-top: 10px;
  }

  input::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    font-size: 13px;
  }
  input::-moz-placeholder {
    /* Firefox 19+ */
    font-size: 13px;
  }
  input:-ms-input-placeholder {
    /* IE 10+ */
    font-size: 13px;
  }
  input:-moz-placeholder {
    /* Firefox 18- */
    font-size: 13px;
  }
`;
export default Track;
