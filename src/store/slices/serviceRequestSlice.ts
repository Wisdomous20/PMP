import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ServiceRequestState {
  concern: string
  details: string
}

const initialState: ServiceRequestState = {
  concern: '',
  details: '',
}

const serviceRequestSlice = createSlice({
  name: 'serviceRequest',
  initialState,
  reducers: {
    setConcern: (state, action: PayloadAction<string>) => {
      state.concern = action.payload
    },
    setDetails: (state, action: PayloadAction<string>) => {
      state.details = action.payload
    },
    resetServiceRequest: () => initialState,
  },
})

export const { setConcern, setDetails, resetServiceRequest } = serviceRequestSlice.actions
export default serviceRequestSlice.reducer
