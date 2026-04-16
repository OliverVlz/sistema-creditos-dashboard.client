import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { mainCustomAxios } from "../../../../config/axios.config";
import { ClientsState } from "../client.slices";
import { Client } from "../../models/clientsTableModel";
import { ClientApiResponse } from "../../models/clientsTableModel";

type FetchClientsParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
  organizationId?: string;
  uploadedByExcel?: string;
};

type FetchClientsResponse = {
  clients: Client[];
  pagination: ClientsState["pagination"];
  query: Required<FetchClientsParams>;
};

export const fetchClients = createAsyncThunk(
  "clients/fetchClients",
  async ({
    page = 1,
    limit = 10,
    searchTerm = "",
    status = "",
    organizationId = "",
    uploadedByExcel = "",
  }: FetchClientsParams = {}): Promise<FetchClientsResponse> => {
    const params: Record<string, string | number> = {
      page,
      limit,
    };

    if (searchTerm) params.terms = searchTerm;
    if (status) params.status = status;
    if (organizationId) params.organizationId = organizationId;
    if (uploadedByExcel) params.uploadedByExcel = uploadedByExcel;

    const response = await mainCustomAxios.get("/clients/all", { params });
    const responseData = response.data?.data;
    const clientList: ClientApiResponse[] = Array.isArray(responseData)
      ? responseData
      : Array.isArray(responseData?.data)
        ? responseData.data
        : [];

    const pagination = response.data?.pagination ??
      responseData?.pagination ?? {
        currentPage: page,
        totalPages: 1,
        total: clientList.length,
        limit,
        hasNextPage: false,
        hasPreviousPage: false,
      };

    const clients = clientList.map(
      (client: ClientApiResponse): Client => ({
        id: client.userId, // IMPORTANTE: Usar userId para editar, NO clientId ni documentNumber
        isActive: client.isActive,
        fullName:
          client.fullName ||
          `${client.firstName || ""} ${client.lastName || ""}`.trim(),
        documentNumber: client.documentNumber,
        email: client.email,
        phoneNumber: client.phoneNumber,
        organization: client.organization,
        employmentStatus: client.employmentStatus,
        createdAt: client.createdAt,
      }),
    );
    return {
      clients,
      pagination,
      query: {
        page,
        limit,
        searchTerm,
        status,
        organizationId,
        uploadedByExcel,
      },
    };
  },
);

interface createAsyncFetchClientsReducerArgs {
  builder: ActionReducerMapBuilder<ClientsState>;
}

export const createAsyncFetchClientsReducer = ({
  builder,
}: createAsyncFetchClientsReducerArgs) => {
  builder
    .addCase(fetchClients.pending, (state: ClientsState) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(
      fetchClients.fulfilled,
      (state: ClientsState, action: PayloadAction<FetchClientsResponse>) => {
        state.loading = false;
        state.clients = action.payload.clients;
        state.pagination = action.payload.pagination;
        state.query = action.payload.query;
      },
    )
    .addCase(
      fetchClients.rejected,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (state: ClientsState, action: any) => {
        state.loading = false;
        state.error = action.error.message;
      },
    );
};
