import axios from "axios";
const baseUrl = "/api/users";

const users = () => {
  const req = axios.get(baseUrl);
  return req.then((res) => res.data);
};

export default { users };
