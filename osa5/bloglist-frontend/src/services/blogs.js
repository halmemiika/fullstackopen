import axios from "axios";
import storage from "../utils/storage";

const baseUrl = "/api/blogs";

const getConfig = () => {
  return {
    headers: { Authorization: `bearer ${storage.loadUser().token}` },
  };
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newObject) => {
  const res = await axios.post(baseUrl, newObject, getConfig());
  return res.data;
};

const update = (id, newObject) => {
  const req = axios.put(`${baseUrl}/${id}`, newObject);
  return req.then((res) => res.data);
};

const remove = async (id) => {
  await axios.delete(`${baseUrl}/${id}`, getConfig());
};

const addComment = async (id, comment) => {
  const req = await axios.post(`${baseUrl}/${id}/comments`, comment);
  console.log(req.data);
};

export default { getAll, create, update, remove, addComment };
