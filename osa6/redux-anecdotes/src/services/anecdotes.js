import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const getAll = async () => {
  const res = await axios.get(baseUrl);
  return res.data;
};

const createNew = async (content) => {
  const obj = { content, votes: 0 };
  const res = await axios.post(baseUrl, obj);
  return res.data;
};

const vote = async (id) => {
  const res = await axios.get(`${baseUrl}/${id}`);
  const updateRes = await axios.put(`${baseUrl}/${id}`, {
    ...res.data,
    votes: res.data.votes + 1,
  });
  return updateRes.data;
};

export default { getAll, createNew, vote };
