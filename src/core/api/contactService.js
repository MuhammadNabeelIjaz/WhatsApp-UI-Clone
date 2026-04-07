// src/core/api/contactService.js
// Mock layer — returns promise-wrapped local data.
// Backend ready: replace Promise.resolve() with axios/fetch calls.

import { contacts } from '@core/data/contacts';

export const getContacts  = ()        => Promise.resolve(contacts);
export const addContact   = (contact) => Promise.resolve({ success: true, contact });
export const deleteContact = (id)     => Promise.resolve({ success: true, id });
