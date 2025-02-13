import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  role: string | null;
  loading: boolean;
}

const initialState: UserState = {
  role: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserRoleLoading: (state) => {
      state.loading = true;
    },
    setUserRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
      state.loading = false;
    },
    clearUserRole: (state) => {
      state.role = null;
      state.loading = false;
    },
  },
});

export const { setUserRole, clearUserRole, setUserRoleLoading } = userSlice.actions;
export default userSlice.reducer;
