import React, { useEffect, useRef, useState, useCallback } from "react";
import { RadioGroup, Radio } from "react-radio-group";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import cx from "classnames";
import { useWeb3React } from "@web3-react/core";
import { useDropzone } from "react-dropzone";
import Skeleton from "react-loading-skeleton";
import Select from "react-dropdown-select";

import CloseIcon from "@material-ui/icons/Close";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import BootstrapTooltip from "../../components/BootstrapTooltip";
import PriceInput from "../../components/PriceInput";

import { ToastContainer, toast } from "react-toastify";
import showToast from "../../components/toast";
import useContract from "../../utils/sc.interaction";
import { createTrack, getAlbumList } from "../../api/api1";
import {
  IMAGE_SIZE,
  clipImage,
  uploadImageToPinata,
  uploadMetaDataToPinata,
} from "../../api/pinata";
import { Toaster } from "react-hot-toast";
import NFT_ABI from "../../abi/SongTrack.json";
import { CONTRACT_ADDRESS, IPFS_PREFIX } from "../../utils/constant";
import uploadIcon from "../../components/assets/upload.svg";
import styles from "./styles.module.scss";

const accept = ["image/*,audio/*,video/*"];

const GENRE_TYPE = [
  { name: "HipHop", value: "HipHop" },
  { name: "Rock", value: "Rock" },
  { name: "Punk", value: "Punk" },
  { name: "Jazz", value: "Jazz" },
  { name: "Dance & EDM", value: "Dance & EDM" },
  { name: "Metal", value: "Metal" },
  { name: "Country", value: "Country" },
];

const PaintBoard = () => {
  const navigate = useNavigate();

  const { loadContract } = useContract();

  const { account } = useWeb3React();

  const imageRef = useRef();
  const [selected, setSelected] = useState([]);
  const [collections, setCollections] = useState([]);
  const [file, setFile] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [fileType, setFileType] = useState("music");
  const [name, setName] = useState("");
  const [artist, setArtist] = useState("");
  const [trackNumber, setTrackNumber] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [xtra, setXtra] = useState("");
  const [sku, setSku] = useState("");

  const [isMinting, setIsMinting] = useState(false);
  const [genre, setGenre] = useState([GENRE_TYPE[0]]);
  const user = useSelector((state) => state.Auth.user);

  const getCollections = async () => {
    try {
      const { data } = await getAlbumList();
      setCollections(data);
      console.log("Data is ", data);
      if (data.length) {
        setSelected([data[0]]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    console.log("This file is ", acceptedFiles[0]);
    let imgFile;
    if (acceptedFiles[0].type.indexOf("image") !== -1) {
      imgFile = acceptedFiles[0];
    }

    setFile(imgFile);
    const reader = new FileReader();
    reader.onload = function (e) {
      setImageData(e.target.result);
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
    setFile(null);
    if (imageRef.current) {
      imageRef.current.value = "";
    }
  };

  const handleTypeChange = (type) => {
    setFileType(type);
  };

  // const imageToBase64 = () => {
  //   return new Promise((resolve, reject) => {
  //     let reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       resolve(reader.result);
  //     };
  //     reader.onerror = (err) => {
  //       reject(err);
  //     };
  //   });
  // };

  // const audioToBase64 = () => {
  //   return new Promise((resolve, reject) => {
  //     let reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       resolve(reader.result);
  //     };
  //     reader.onerror = (err) => {
  //       reject(err);
  //     };
  //   });
  // };

  const validateMetadata = () => {
    return name !== "" && account !== "" && selected.length;
  };

  const resetMintingStatus = () => {
    setTimeout(() => {
      setIsMinting(false);
    }, 1000);
  };

  const getNFTID = (events) => {
    if (events == null) {
      return 0;
    }
    const eventList = events.filter((el) => el.event === "URI");
    if (eventList.length > 0) {
      return eventList[0].args["id"].toNumber();
    }
    return 0;
  };

  const mintNFT = async () => {
    setIsMinting(true);
    const img = new Image();
    img.onload = function () {
      clipImage(img, IMAGE_SIZE, async (logodata) => {
        try {
          let res = null;
          if (logodata) {
            let response = await fetch(logodata);
            let optimized_file = await response.blob();
            res = await uploadImageToPinata(optimized_file);
          }

          const ipfsHash = res ? res.IpfsHash : selected[0].image_path;

          const metadata = {
            name: `${name}`,
            description: "This image shows the true nature of NFT.",
            image: `${IPFS_PREFIX + ipfsHash}`,
          };

          let metaDataRes = await uploadMetaDataToPinata(metadata);
          const contract = await loadContract(CONTRACT_ADDRESS.NFT, NFT_ABI);
          let tx;
          let plateFee = await contract.platformFee();
          console.log(IPFS_PREFIX + metaDataRes.IpfsHash);
          tx = await contract.mint(
            account,
            quantity,
            IPFS_PREFIX + metaDataRes.IpfsHash,
            {
              value: plateFee,
            }
          );
          const confrimedTx = await tx.wait();
          const nftID = getNFTID(confrimedTx.events);

          const data = {
            type: fileType,
            user_id: user.id,
            artist: artist,
            album_id: selected[0].id,
            image_url: ipfsHash,
            track_name: name,
            track_number: trackNumber,
            description: description,
            quantity: quantity,
            external_link: externalLink,
            cdn: xtra,
            sku: sku,
            nft_id: nftID,
            genre: genre[0].value,
            nft_metadata: IPFS_PREFIX + metaDataRes.IpfsHash,
          };

          await createTrack(data);

          toast.success("New item is minted successfully.", {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          setIsMinting(false);

          setTimeout(() => {
            navigate("/");
          }, 3500);
        } catch (error) {
          console.log(error);
          showToast("error", "Error on Mint NFT", error.message);
        }
        resetMintingStatus();
      });
    };
    img.src = imageData;
  };

  return (
    <div className={styles.container}>
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
      <div className={styles.back}>
        <ArrowBackIcon fontSize="large" onClick={() => navigate("/")} />
      </div>
      <div className={styles.body}>
        <Toaster />
        <div className={styles.title}>Create New Item</div>
        <div style={{ fontSize: "16px", margin: "10px 0" }}>
          Let'smake your ownership to an NFT
        </div>
        <div className={styles.board}>
          <div {...getRootProps({ className: styles.uploadCont })}>
            <input {...getInputProps()} ref={imageRef} accept="image/*" />
            {file ? (
              <>
                <>
                  <img
                    className={styles.image}
                    alt=""
                    src={URL.createObjectURL(file)}
                  />
                  {/* {fileType === "image" ? (
                    <img
                      className={styles.image}
                      src={URL.createObjectURL(file)}
                    />
                  ) : fileType === "video" ? (
                    <video
                      className={styles.image}
                      src={URL.createObjectURL(file)}
                    />
                  ) : (
                    <audio controls>
                      <source src={URL.createObjectURL(file)} />
                    </audio>
                  )} */}
                </>
                <div className={styles.overlay}>
                  <CloseIcon className={styles.remove} onClick={removeImage} />
                </div>
              </>
            ) : (
              <>
                <img src={uploadIcon} alt="" />
                <div className={styles.uploadtitle}>Drag and drop Image</div>
                {/* <div className={styles.uploadsubtitle}>
                  Image, Videos, Audio or 3d Model
                </div> */}
              </>
            )}
          </div>
        </div>
        <div className={styles.panel}>
          <div className={styles.panelInputs}>
            <div className={styles.panelLeft}>
              <RadioGroup
                name="nft"
                selectedValue={fileType}
                onChange={handleTypeChange}
                className={styles.formLabel}
                style={{
                  display: "flex",
                  gap: "30px",
                  marginTop: "20px",
                  marginBottom: "20px",
                }}
              >
                <div className={styles.categoryContainer}>
                  <Radio value="music" />
                  <div className={styles.categoryItem}>Music</div>
                </div>
                <div className={styles.categoryContainer}>
                  <Radio value="video" />
                  <div className={styles.categoryItem}>Video</div>
                </div>
                <div className={styles.categoryContainer}>
                  <Radio value="collectables" />
                  <div className={styles.categoryItem}>Collectables</div>
                </div>
                <div className={styles.categoryContainer}>
                  <Radio value="image" />
                  <div className={styles.categoryItem}>Artwork</div>
                </div>
                <div className={styles.categoryContainer}>
                  <Radio value="photography" />
                  <div className={styles.categoryItem}>Photography</div>
                </div>
              </RadioGroup>

              <div className={styles.formGroup}>
                <p className={styles.formLabel}>Albums</p>
                <Select
                  options={collections}
                  disabled={isMinting}
                  values={selected}
                  onChange={([col]) => {
                    setSelected([col]);
                  }}
                  className={styles.select}
                  placeholder="Choose Collection"
                  itemRenderer={({ item, methods }) => (
                    <div
                      key={item.erc721Address}
                      className={styles.collection}
                      onClick={() => {
                        methods.clearAll();
                        methods.addItem(item);
                      }}
                    >
                      <img
                        src={`${IPFS_PREFIX}${item.image_path}`}
                        className={styles.collectionLogo}
                        alt=""
                      />
                      <div className={styles.collectionName}>{item.title}</div>
                    </div>
                  )}
                  contentRenderer={({ props: { values } }) =>
                    values.length > 0 ? (
                      <div className={styles.collection}>
                        <img
                          src={`${IPFS_PREFIX}${values[0].image_path}`}
                          className={styles.collectionLogo}
                          alt=""
                        />
                        <div className={styles.collectionName}>
                          {values[0].title}
                        </div>
                      </div>
                    ) : (
                      <div className={styles.collection} />
                    )
                  }
                />
              </div>
              <div
                className={cx(styles.button)}
                onClick={() => {
                  navigate("/create-album");
                }}
              >
                Create New Album
              </div>
              <div className={styles.formGroup}>
                <p className={styles.formLabel}>Artist</p>
                <input
                  className={styles.formInput}
                  maxLength={40}
                  placeholder="Artist"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  disabled={isMinting}
                />
                <div className={styles.lengthIndicator}>{artist.length}/40</div>
              </div>
              <div className={styles.formGroup}>
                <p className={styles.formLabel}>Track Name</p>
                <input
                  className={styles.formInput}
                  maxLength={40}
                  placeholder="Track Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isMinting}
                />
                <div className={styles.lengthIndicator}>{name.length}/40</div>
              </div>
              <div className={styles.formGroup}>
                <p className={styles.formLabel}>Track Number</p>
                <input
                  className={styles.formInput}
                  maxLength={20}
                  placeholder="Track Number"
                  value={trackNumber}
                  onChange={(e) => setTrackNumber(e.target.value)}
                  disabled={isMinting}
                />
                <div className={styles.lengthIndicator}>
                  {trackNumber.length}/20
                </div>
              </div>

              <div className={styles.formGroup}>
                <p className={styles.formLabel}>Types</p>
                <Select
                  options={GENRE_TYPE}
                  disabled={isMinting}
                  values={genre}
                  onChange={([col]) => {
                    setGenre([col]);
                  }}
                  className={styles.select}
                  placeholder="Choose Type"
                  itemRenderer={({ item, methods }) => (
                    <div
                      key={item.name}
                      className={styles.collection}
                      onClick={() => {
                        methods.clearAll();
                        methods.addItem(item);
                      }}
                    >
                      <div className={styles.collectionName}>{item.name}</div>
                    </div>
                  )}
                  contentRenderer={({ props: { values } }) =>
                    values.length > 0 ? (
                      <div className={styles.collection}>
                        <div className={styles.collectionName}>
                          {values[0].name}
                        </div>
                      </div>
                    ) : (
                      <div className={styles.collection} />
                    )
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <p className={styles.formLabel}>Description</p>
                <textarea
                  className={cx(styles.formInput, styles.longInput)}
                  maxLength={120}
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isMinting}
                />
                <div className={styles.lengthIndicator}>
                  {description.length}/120
                </div>
              </div>
            </div>
            <div className={styles.panelRight}>
              <div className={styles.formGroup}>
                <p className={styles.formLabel}>Quantity</p>
                <PriceInput
                  className={styles.formInput}
                  placeholder="Quantity"
                  decimals={2}
                  value={"" + quantity}
                  onChange={(val) => setQuantity(val)}
                  disabled={isMinting}
                />
              </div>
              <div className={styles.formGroup}>
                <p className={styles.formLabel}>External Link</p>
                <input
                  className={styles.formInput}
                  placeholder="External Link"
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  disabled={isMinting}
                />
              </div>
              <div className={styles.formGroup}>
                <p className={styles.formLabel}>
                  CDN Link(Optional)&nbsp;
                  <BootstrapTooltip
                    title="Link to the document which proves your ownership of this image."
                    placement="top"
                  >
                    <HelpOutlineIcon />
                  </BootstrapTooltip>
                </p>
                <input
                  className={styles.formInput}
                  placeholder="CDN"
                  value={xtra}
                  onChange={(e) => setXtra(e.target.value)}
                  disabled={isMinting}
                />
              </div>
              <div className={styles.formGroup}>
                <p className={styles.formLabel}>SKU(Optional)</p>
                <input
                  className={styles.formInput}
                  maxLength={40}
                  placeholder="SKU"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  disabled={isMinting}
                />
                <div className={styles.lengthIndicator}>{sku.length}/40</div>
              </div>
            </div>
          </div>

          <div
            className={cx(
              styles.button,
              (isMinting || !account || !validateMetadata()) && styles.disabled
            )}
            onClick={
              isMinting || !account || !validateMetadata() ? null : mintNFT
            }
          >
            {/* <ClipLoader size="16" color="white"></ClipLoader> */}
            {isMinting ? "Minting..." : "Mint"}
          </div>
          <div className={styles.fee}>
            <Skeleton width={330} height={22} />
          </div>
          <div className={styles.mintStatusContainer}></div>
        </div>
      </div>
    </div>
  );
};

export default PaintBoard;
