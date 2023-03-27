import React, { useState, useEffect } from "react";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import styles from "./styles.module.scss";
import { ClipLoader } from "react-spinners";
import { uploadImageToPinata, clipImage, IMAGE_SIZE } from "../api/pinata";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

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

function TrackDialog(props) {
  const { data, open, updating, saveTrack, handleDelete, handleClose } = props;
  const [isAddingArtWork, setIsAddingArtwork] = useState(false);
  const [trackItem, setTrackItem] = useState();

  useEffect(() => {
    setTrackItem(data);
  }, [data]);

  const onChangeValue = (key, value) => {
    let newTrackItem = { ...trackItem, [key]: value };
    setTrackItem(newTrackItem);
  };

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

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Track</DialogTitle>
      <DialogContent>
        <div className={styles.track_label}>Track Name</div>
        <div>
          <input
            style={{ marginRight: "10px" }}
            className={styles.track_border}
            value={trackItem?.track_name}
            onChange={(e) => onChangeValue("track_name", e.target.value)}
            placeholder="Track name"
          />
          <FormControl>
            <InputLabel id="select-label">Type</InputLabel>
            <Select
              className={styles.track_select}
              labelId="select-label"
              value={trackItem?.type}
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
        </div>

        <div style={{ display: "flex", marginTop: "10px" }}>
          <div>
            <div className={styles.track_label}>Quantity</div>
            <input
              className={styles.track_border}
              value={trackItem?.quantity}
              onChange={(e) =>
                onChangeValue(
                  "quantity",
                  isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                )
              }
              placeholder="Quantity"
            />
          </div>
          <div style={{ marginLeft: "10px" }}>
            <div className={styles.track_label}>SKU</div>
            <input
              value={trackItem?.sku}
              className={styles.track_border}
              style={{ width: "100px" }}
              onChange={(e) => onChangeValue("sku", e.target.value)}
              placeholder="SKU"
            />
          </div>
          <div style={{ marginLeft: "10px" }}>
            <div className={styles.track_label}>Volume No</div>
            <input
              value={trackItem?.volume_number}
              className={styles.track_border}
              style={{ width: "80px" }}
              onChange={(e) => onChangeValue("volume_number", e.target.value)}
              placeholder="1"
            />
          </div>
        </div>

        <div style={{ display: "flex", marginTop: "10px" }}>
          <FormControl>
            <InputLabel id="select-label">Genre</InputLabel>
            <Select
              className={styles.track_select}
              labelId="select-label"
              value={trackItem?.genre}
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
          <div style={{ marginLeft: "10px" }}>
            <button
              className={styles.btn_upload}
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
          </div>
        </div>

        <div style={{ marginTop: "10px", display: "flex" }}>
          <div>
            <div className={styles.track_label}>Artist</div>
            <input
              value={trackItem?.artist}
              className={styles.track_border}
              onChange={(e) => onChangeValue("artist", e.target.value)}
              placeholder="Artist"
            />
          </div>

          <div style={{ marginLeft: "10px" }}>
            <div className={styles.track_label}>CDN</div>
            <input
              value={trackItem?.cdn}
              className={styles.track_border}
              onChange={(e) => onChangeValue("cdn", e.target.value)}
              placeholder="CDN"
            />
          </div>
        </div>

        <div style={{ marginTop: "10px" }}>
          <div className={styles.track_label}>Description</div>
          <input
            value={trackItem?.description}
            className={styles.track_border}
            style={{ width: "100%" }}
            onChange={(e) => onChangeValue("description", e.target.value)}
            placeholder="Description"
          />
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "20px",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex" }}>
            <div>
              <button
                className={styles.btn_add}
                onClick={() => {
                  if (!isAddingArtWork) saveTrack(trackItem);
                }}
              >
                {updating ? (
                  <ClipLoader size="16" color="white"></ClipLoader>
                ) : (
                  <>Save</>
                )}
              </button>
            </div>

            <button
              className={styles.btn_cancel}
              onClick={() => {
                if (!isAddingArtWork) handleDelete(trackItem);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default TrackDialog;
