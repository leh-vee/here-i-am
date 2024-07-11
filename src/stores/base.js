import { writable } from 'svelte/store';

export const nPiesScored = writable(0);
export const isDataInitialized = writable(false);
export const isVerseNumberVisible = writable(false);
export const isReaderEngaged = writable(false);