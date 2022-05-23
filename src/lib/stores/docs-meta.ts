import type { DocsMeta } from "$lib/types/docs-meta";
import { writable } from "svelte/store";

export const docsMeta = writable<DocsMeta>();
