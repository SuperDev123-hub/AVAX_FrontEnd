import Axios from "axios";
import FormData from "form-data";

const url_file = "https://api.pinata.cloud/pinning/pinFileToIPFS";
const url_json = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
const API_KEY = "ad8fefbf46bbee791ba6";
const API_SECRET =
  "4f7a29d94721d68a54693c588c94fb40892e42964b245b49342c0ccbf245abd9";
export const IMAGE_SIZE = 360;
export const BANNER_WIDTH = 512;

export async function uploadImageToPinata(data) {
  const formData = new FormData();
  formData.append("file", data);
  const result = await Axios.post(url_file, formData, {
    maxContentLength: "Infinity",
    headers: {
      "Content-Type": `multipart/form-data;boundary=${formData._boundary}`,
      pinata_api_key: API_KEY,
      pinata_secret_api_key: API_SECRET,
    },
  })
    .then(async function (response) {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });

  return result;
}

export async function uploadMetaDataToPinata(data) {
  const result = await Axios.post(url_json, data, {
    headers: {
      pinata_api_key: API_KEY,
      pinata_secret_api_key: API_SECRET,
    },
  })
    .then(async function (response) {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });

  return result;
}

export function clipImage(image, size, cb) {
  var MAX_WIDTH = size;
  var MAX_HEIGHT = size;

  var width = image.width;
  var height = image.height;

  // Change the resizing logic
  if (width > height) {
    if (width > MAX_WIDTH) {
      height = height * (MAX_WIDTH / width);
      width = MAX_WIDTH;
    }
  } else {
    if (height > MAX_HEIGHT) {
      width = width * (MAX_HEIGHT / height);
      height = MAX_HEIGHT;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, width, height);
  cb(canvas.toDataURL());
}
