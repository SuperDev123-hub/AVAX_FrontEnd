/* eslint-disable react/no-unescaped-entities */
import React, { useCallback, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cx from "classnames";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { useDropzone } from "react-dropzone";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { useWeb3React } from "@web3-react/core";
import showToast from "../components/toast";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import BootstrapTooltip from "../components/BootstrapTooltip";
import CSVIcon from "../images/csv.png";
import { createAlbum, createMultipleTrack } from "../api/api1";
import { uploadImageToPinata, clipImage, IMAGE_SIZE } from "../api/pinata";
import { uploadMetaDataToPinata } from "../api/pinata";
import { IPFS_PREFIX } from "../utils/constant";

import uploadIcon from "../components/assets/upload.svg";
import CloseIcon from "@material-ui/icons/Close";

import styles from "./styles.module.scss";
import { formatError } from "../utils";
import Track from "../components/Track";
import _ from "underscore";
import NFT_ABI from "../abi/SongTrack.json";
import { CONTRACT_ADDRESS } from "../utils/constant";
import useContract from "../utils/sc.interaction";

const accept = ["image/*,audio/*,video/*"];

const CollectionCreate = () => {
  const navigate = useNavigate();
  const { loadContract } = useContract();
  const { account } = useWeb3React();

  const imageRef = useRef();
  const [deploying, setDeploying] = useState(false);
  const [logo, setLogo] = useState(null);
  const [albumImage, setAlbumImage] = useState(null);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(null);
  const [symbol, setSymbol] = useState("");
  const [symbolError, setSymbolError] = useState(null);
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [addressError, setAddressError] = useState("");
  const [cdnLink, setCDNLink] = useState("");
  const [sku, setSKU] = useState("");
  const [isCreateAlbum, setIsCreateAlbum] = useState(true);
  const [albumId, setAlbumId] = useState(0);
  const [ipfsHash, setIpfsHash] = useState("");
  const [trackList, setTrackList] = useState([]);
  const [csvData, setCsvData] = useState(null);
  const [loadingTrack, setLoadingTrack] = useState(false);

  useEffect(() => {
    setLogo(null);
    setName("");
    setNameError(null);
    setSymbol("");
    setSymbolError(null);
    setDescription("");
    setDescriptionError(null);
    setEmail("");
    setEmailError(null);
    setAddressError(null);
    setCDNLink("");
    setSKU("");
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    console.log("This file is ", acceptedFiles[0]);
    let imgFile;

    if (acceptedFiles[0].type.indexOf("image") !== -1) {
      imgFile = acceptedFiles[0];
    }
    setLogo(imgFile);

    const reader = new FileReader();
    reader.onload = function (e) {
      setAlbumImage(e.target.result);
    };
    reader.readAsDataURL(imgFile);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: accept.join(", "),
    multiple: false,
    onDrop,
    maxSize: 157286400,
  });

  const removeImage = () => {
    setLogo(null);
    if (imageRef.current) {
      imageRef.current.value = "";
    }
  };

  const validateName = () => {
    if (name.length === 0) {
      setNameError("This field can't be blank");
    } else {
      setNameError(null);
    }
  };

  const validateSymbol = () => {
    if (symbol.length === 0) {
      setSymbolError("This field can't be blank");
    } else {
      setSymbolError(null);
    }
  };

  const validateDescription = () => {
    if (description.length === 0) {
      setDescriptionError("This field can't be blank");
    } else {
      setDescriptionError(null);
    }
  };

  // const validEmail = (email) => /(.+)@(.+){2,}\.(.+){2,}/.test(email);

  // const validateEmail = () => {
  //   if (email.length === 0) {
  //     setEmailError("This field can't be blank");
  //   } else if (validEmail(email)) {
  //     setEmailError(null);
  //   } else {
  //     setEmailError("Invalid email address.");
  //   }
  // };

  const isValid = (() => {
    if (!logo) return false;
    if (nameError) return false;
    if (descriptionError) return false;
    if (addressError) return false;
    if (symbol.length === 0) return false;
    // if (email.length === 0) return false;
    // if (!validEmail(email)) return false;
    return true;
  })();

  const handleCreate = async () => {
    setDeploying(true);
    const img = new Image();
    img.onload = function () {
      clipImage(img, IMAGE_SIZE, async (logodata) => {
        try {
          let response = await fetch(logodata);
          let optimized_file = await response.blob();
          const res = await uploadImageToPinata(optimized_file);
          const data = {
            image_path: res.IpfsHash,
            title: name,
            artist_name: symbol,
            description: description,
            cdn: cdnLink,
            sku: sku,
            contact_email: email,
          };

          const resAlbum = await createAlbum(data);

          setAlbumId(resAlbum.data[0].id);
          setIpfsHash(res.IpfsHash);
          setIsCreateAlbum(false);
          setDeploying(false);
        } catch (err) {
          showToast("error", formatError(err));
          console.log(err);
          setDeploying(false);
        }
      });
    };
    img.src = albumImage;
  };

  const handleAddTrack = (data) => {
    if (data.artist === "") data.artist = symbol;
    let tempTrackList = [...trackList];
    tempTrackList.push(data);
    setTrackList(tempTrackList);
  };

  const handleUpdateTrack = (track) => {
    let tempTrackList = [];
    trackList.map((item) => {
      if (item.track_number === track.track_number) {
        tempTrackList.push(track);
      } else {
        tempTrackList.push(item);
      }
    });
    setTrackList(tempTrackList);
  };

  const handleDeleteTrack = (track) => {
    let tempTrackList = [];
    trackList.map((item) => {
      if (item.track_number !== track.track_number) {
        tempTrackList.push(item);
      }
    });
    setTrackList(tempTrackList);
  };

  const getNFTIDs = (events) => {
    if (events == null) {
      return 0;
    }
    const eventList = events.filter((el) => el.event === "BatchMint");
    if (eventList.length > 0) {
      return eventList[0].args.ids;
    }
    return 0;
  };

  const handleMintAll = async () => {
    try {
      let supplys = _.pluck(trackList, "quantity");
      let uris = _.pluck(trackList, "nft_metadata");

      const contract = await loadContract(CONTRACT_ADDRESS.NFT, NFT_ABI);
      let tx;
      let plateFee = await contract.platformFee();

      tx = await contract.mintBatch(account, supplys, uris, {
        value: plateFee,
      });
      const confrimedTx = await tx.wait();

      const nftIDs = getNFTIDs(confrimedTx.events);

      const newList = _.map(trackList, function (el, index) {
        return { ...el, nft_id: nftIDs[index].toNumber() };
      });
      await createMultipleTrack(newList);
      navigate("/");
    } catch (err) {
      console.log(err);
      showToast("error", formatError(err));
    }
  };

  const onClickCSVIcon = () => {
    let img = document.getElementById("csv-file");
    img.click();
  };

  const csvToArray = (str, delimiter = ",") => {
    const header_row = str.slice(0, str.indexOf("\n")).split("\r")[0];
    const headers = header_row.split(delimiter);
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");

    const arr = rows.map(function (row) {
      const values = row.split("\r")[0].split(delimiter);
      const el = headers.reduce(function (object, header, index) {
        object[header] = values[index];
        return object;
      }, {});
      return el;
    });

    return arr;
  };

  useEffect(() => {
    if (csvData !== null) getTrackFromCSV(csvData);
  }, [csvData]);

  const getTrackFromCSV = async (dataList) => {
    let tempTrackList = [];
    setLoadingTrack(true);
    for (let i = 0; i < dataList.length; i++) {
      let trackItem = dataList[i];
      if (trackItem.track_number === "") continue;
      let track = { ...trackItem, album_id: albumId };
      track.user_id = localStorage.getItem("userId");

      if (track.nft_metadata === "") {
        if (track.image_url === undefined || track.image_url === "") {
          track.image_url = ipfsHash;
        }
        const metaData = {
          name: `${track.track_name}`,
          description: "This image shows the true nature of NFT.",
          image: `${IPFS_PREFIX + track.image_url}`,
        };
        let metaDataRes = await uploadMetaDataToPinata(metaData);
        track.nft_metadata = IPFS_PREFIX + metaDataRes.IpfsHash;
      }
      if (track.quantity === "") track.quantity = "1000";
      tempTrackList.push(track);
    }
    setLoadingTrack(false);
    setTrackList(tempTrackList);
    setCsvData(null);
  };

  const importCSVFile = async (e) => {
    if (e.target.files[0]) {
      const input = e.target.files[0];
      const reader = new FileReader();
      reader.onload = function (e) {
        const text = e.target.result;
        const data = csvToArray(text);
        setCsvData(data);
      };
      reader.readAsText(input);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.back}>
        <ArrowBackIcon fontSize="large" onClick={() => navigate("/create")} />
      </div>
      <div className={styles.inner}>
        <div className={styles.title}>Create New Album</div>
        <br />
        <div style={{ fontSize: "16px" }}>
          Let'smake your ownership to an NFT
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputTitle}>Album Informantion *</div>
          <div className={styles.board}>
            <div {...getRootProps({ className: styles.uploadCont })}>
              <input {...getInputProps()} ref={imageRef} accept="image/*" />
              {logo ? (
                <>
                  <>
                    <img
                      className={styles.image}
                      src={URL.createObjectURL(logo)}
                      alt=""
                    />
                  </>
                  <div className={styles.overlay}>
                    <CloseIcon
                      className={styles.remove}
                      onClick={removeImage}
                    />
                  </div>
                </>
              ) : (
                <>
                  <img src={uploadIcon} alt="" />
                  <div className={styles.uploadtitle}>Drag and drop Image</div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputTitle}>Title *</div>
          <div className={styles.inputWrapper}>
            <input
              className={cx(styles.input, nameError && styles.hasError)}
              maxLength={40}
              placeholder="Album Title"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={validateName}
            />
            <div className={styles.lengthIndicator}>{name.length}/40</div>
            {nameError && <div className={styles.error}>{nameError}</div>}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputTitle}>Artist Name*&nbsp;</div>
          <div className={styles.inputWrapper}>
            <input
              className={cx(styles.input, symbolError && styles.hasError)}
              maxLength={20}
              placeholder="Artist Name"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              onBlur={validateSymbol}
            />
            <div className={styles.lengthIndicator}>{symbol.length}/20</div>
            {symbolError && <div className={styles.error}>{symbolError}</div>}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputTitle}>Description *</div>
          <div className={styles.inputWrapper}>
            <textarea
              className={cx(
                styles.input,
                styles.longInput,
                descriptionError && styles.hasError
              )}
              maxLength={200}
              placeholder="Provide your description for this Album"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={validateDescription}
            />
            <div className={styles.lengthIndicator}>
              {description.length}/200
            </div>
            {descriptionError && (
              <div className={styles.error}>{descriptionError}</div>
            )}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputTitle}>CDN link</div>
          <div className={styles.inputWrapper}>
            <input
              className={cx(styles.input)}
              placeholder="CDN link"
              value={cdnLink}
              onChange={(e) => setCDNLink(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputTitle}>SKU</div>
          <div className={styles.inputWrapper}>
            <input
              className={cx(styles.input)}
              placeholder="SKU"
              value={sku}
              onChange={(e) => setSKU(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputTitle}>
            Contact Email *&nbsp;
            <BootstrapTooltip
              title="We will use this email to notify you about this album application. This will not be shared with others."
              placement="top"
            >
              <HelpOutlineIcon />
            </BootstrapTooltip>
          </div>
          <div className={styles.inputWrapper}>
            <input
              className={cx(styles.input, emailError && styles.hasError)}
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // onBlur={validateEmail}
            />
            {emailError && <div className={styles.error}>{emailError}</div>}
          </div>
        </div>

        {isCreateAlbum && (
          <div className={styles.buttonsWrapper}>
            <div
              className={cx(
                styles.createButton,
                (deploying || !isValid) && styles.disabled
              )}
              onClick={isValid && !deploying ? handleCreate : null}
            >
              {deploying ? "Creating..." : "Create New Album"}
            </div>
          </div>
        )}

        {!isCreateAlbum && (
          <div>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "right",
                  marginTop: "20px",
                }}
              >
                <div onClick={() => onClickCSVIcon()}>
                  <img src={CSVIcon} alt="" width="30" height="32" />
                  <input
                    type="file"
                    id="csv-file"
                    accept=".csv"
                    style={{ display: "none" }}
                    onChange={importCSVFile}
                  />
                </div>
              </div>
              <Track
                albumId={albumId}
                ipfsHash={ipfsHash}
                data={trackList}
                onAddTrack={handleAddTrack}
                onUpdateTrack={handleUpdateTrack}
                onDeleteTrack={handleDeleteTrack}
                onMintAll={handleMintAll}
              />
            </div>
          </div>
        )}
      </div>

      <Dialog open={loadingTrack}>
        <DialogTitle>Loading Tracks...</DialogTitle>
      </Dialog>
    </div>
  );
};

export default CollectionCreate;
