// src/core/store/index.js — Redux Toolkit store entry point
//
// Session 9: the backward-compat `useStore()` adapter and custom reactive
// store kernel have been removed. All 40 consumer files now use native
// `useSelector` / `useDispatch` from `react-redux`, importing selectors and
// action creators directly from the relevant slice files in `./slices/`.
//
// This module now simply re-exports the configured RTK store and its slice
// modules for any code that wants direct access.

export { reduxStore, default } from './store';

export * as uiSliceActions        from './slices/uiSlice';
export * as contactSliceActions   from './slices/contactSlice';
export * as channelSliceActions   from './slices/channelSlice';
export * as communitySliceActions from './slices/communitySlice';
export * as settingsSliceActions  from './slices/settingsSlice';
export * as chatSliceActions      from './slices/chatSlice';
