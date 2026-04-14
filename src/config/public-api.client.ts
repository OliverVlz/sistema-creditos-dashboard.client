import axios from "axios";

import { getBackendBaseUrl } from "./axios.config";

export const publicApiClient = axios.create({
  baseURL: getBackendBaseUrl(),
});
