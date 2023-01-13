import { browser } from "$app/environment";

import { writable } from "svelte/store";

const defaultValue = false;

const initialValue = browser ? JSON.parse(window.localStorage.getItem("doublePageview")) ?? defaultValue : defaultValue;

export const doublePageview = writable(initialValue);

doublePageview.subscribe((value) => {
    if (browser) {
        window.localStorage.setItem("doublePageview", JSON.stringify(value));
    }
});

export { doublePageview as default };