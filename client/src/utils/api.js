import axiosInstance from "./axios";

export function getRoomLists() {
  const result = axiosInstance.get("/getRooms");

  return result;
}

export function getResults() {
  const records = axiosInstance.get("/get-results");

  return records;
}
