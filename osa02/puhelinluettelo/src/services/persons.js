import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/persons",
});

const getAll = () => {
  return API.get()
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

const create = (person) => {
  return API.post("/", person)
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

const update = (id, person) => {
  return API.put(`/${id}`, person)
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

const remove = (id) => {
  return API.delete(`/${id}`).catch((err) => console.log(err));
};

export default { getAll, create, update, remove };
