// src/core/store/hooks.js — Typed-style RTK hooks
//
// Thin wrappers around `react-redux`'s `useDispatch` / `useSelector`. As slices
// are migrated (Sessions 1-6), these are the hooks the backward-compat
// `useStore()` adapter (in `index.js`) will use internally. They are also
// available for any future code that wants to talk to the RTK store directly.

import { useDispatch, useSelector } from 'react-redux';

/** useAppDispatch — returns the RTK store's dispatch function */
export const useAppDispatch = () => useDispatch();

/** useAppSelector — selects a value from the RTK store, re-renders on change */
export const useAppSelector = useSelector;
