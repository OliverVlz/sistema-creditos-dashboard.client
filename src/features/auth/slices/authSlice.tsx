import { createSlice } from '@reduxjs/toolkit';
import { RegisterSliceState } from '../models/registerModel';
import { createAsyncRegisterReducer } from './operations/registerOperations';

const initialState: RegisterSliceState = {
  isLoggedIn: false,
  isRegistered: false,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setIsRegistered: (state, action) => {
      state.isRegistered = action.payload;
    },
  },
  extraReducers: (builder) => {
    createAsyncRegisterReducer({ builder });
  },
});

export const { setIsLoggedIn, setIsRegistered } = authSlice.actions;

export default authSlice.reducer;
