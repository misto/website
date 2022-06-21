import { writable } from "svelte/store";
import type { MenuEntry } from "$lib/types/menu-entry.type";

export default writable<MenuEntry[]>();
