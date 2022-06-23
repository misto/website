import type { Release } from "$lib/types/release";

export const releases: Release[] = [
  {
    name: "2022.05.1",
    releaseDate: new Date("2022-05-23"),
  },
].sort((a, b) => {
  return b.releaseDate.getTime() - a.releaseDate.getTime();
});
