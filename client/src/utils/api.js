import axiosInstance from "./axios";

export function getRoomLists() {
  const result = axiosInstance.get("/getRooms");

  return result;
}
