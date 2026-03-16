import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    { id: 1, name: 'Windows', lastActive: 'today at 2:34 am', os: 'Windows' },
    { id: 2, name: 'Windows', lastActive: 'yesterday at 4:49 pm', os: 'Windows' },
  ],
};

const linkedDevicesSlice = createSlice({
  name: 'linkedDevices',
  initialState,
  reducers: {
    removeDevice(state, action) {
      state.items = state.items.filter(d => d.id !== action.payload);
    },
    renameDevice(state, action) {
      const { id, name } = action.payload;
      const device = state.items.find(d => d.id === id);
      if (device) device.name = name;
    },
  },
});

export const { removeDevice, renameDevice } = linkedDevicesSlice.actions;
export const selectLinkedDevices = state => state.linkedDevices.items;
export default linkedDevicesSlice.reducer;
