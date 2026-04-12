import axios from "axios";

import { appConfig } from "./app.config";

const getBaseUrl = () => {
  if (appConfig.apiUrl) return appConfig.apiUrl;
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost"
  ) {
    return "https://72.61.79.221.nip.io";
  }
  return "http://localhost:3000";
};

export const publicApiClient = axios.create({
  baseURL: getBaseUrl(),
});
