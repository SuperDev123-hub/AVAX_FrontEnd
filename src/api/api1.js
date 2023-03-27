import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_SERVER;

// User
export async function getUserList(page, count) {
  const result = await axios.get(
    `/user/get_user_list?page=${page}&count=${count}`
  );

  return result.data;
}

export async function getNotableUser() {
  const result = await axios.get(`/user/get_notable_user`);

  return result.data;
}

export async function createUserByAddress(data) {
  const result = await axios
    .post("/user/create_user_by_address", data)
    .then(async function (response) {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });

  return result;
}

export async function updateUser(data) {
  const result = await axios
    .post("/user/update_user", data)
    .then(async function (response) {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });

  return result;
}

// Album
export async function getAlbumList(data) {
  const result = await axios.get("/album/get_album_list");

  return result.data;
}

export async function getAlbumByType(type) {
  const result = await axios.get(`/album/get_album_by_type?type=${type}`);

  return result.data;
}

export async function getAlbumByTypeWithSize(type, page, count) {
  const result = await axios.get(
    `/album/get_album_by_type?type=${type}&page=${page}&count=${count}`
  );

  return result.data;
}

export async function createAlbum(data) {
  const result = await axios
    .post("/album/create_album", data)
    .then(async function (response) {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });

  return result;
}

// Track
export async function getTrackList(
  category = "all",
  rank = false,
  page,
  count
) {
  const result = await axios.get(
    `/track/get_track_list?category=${category}&rank=${rank}&page=${page}&count=${count}`
  );

  return result.data;
}

export async function getTopTrackList(category) {
  const result = await axios.get(
    `/track/get_top_track_list?category=${category}`
  );

  return result.data;
}

export async function getTrackListByAdmin(page, count) {
  const result = await axios.get(
    `/track/get_track_by_admin?page=${page}&count=${count}`
  );

  return result.data;
}

// Most Recent Track
export async function getMostRecentTrack() {
  const result = await axios.get(`/track/get_most_recent_track`);

  return result.data;
}

export async function getTrackListByUserId(userId) {
  const result = await axios.get(
    `/track/get_track_by_user_id?user_id=${userId}`
  );

  return result.data;
}

export async function getTrackByAlbum(userId, type) {
  const result = await axios.get(
    `/track/get_track_by_album?album_id=${userId}&type=${type}`
  );

  return result.data;
}

export async function searchTrack(data) {
  const result = await axios
    .post("/track/search_track", data)
    .then(async function (response) {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return [];
    });

  return result;
}

export async function getExploreDesc(type) {
  const result = await axios.get(`/track/get_explore_desc?type=${type}`);

  return result.data;
}

export async function createTrack(data) {
  const result = await axios
    .post("/track/create_track", data)
    .then(async function (response) {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });

  return result;
}

export async function createMultipleTrack(data) {
  const result = await axios
    .post("/track/create_multiple_track", data)
    .then(async function (response) {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });

  return result;
}

export async function setTrackVisible(data) {
  const result = await axios
    .post("/track/set_track_visible", data)
    .then(async function (response) {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });

  return result;
}

export async function setUserVisible(data) {
  const result = await axios
    .post("/user/set_user_visible", data)
    .then(async function (response) {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });

  return result;
}

export async function buyTrack(data) {
  const result = await axios
    .post("/track/buy_track", data)
    .then(async function (response) {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });

  return result;
}
