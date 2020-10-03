import { db } from "../firebase/firebase-config";

export const loadFavourites = async (uid) => {
  if (uid !== "") {
    const moviesSnap = await db.collection(`${uid}/movies/favourites/`).get();

    const moviesFav = [];

    moviesSnap.forEach((movieSnap) => {
      moviesFav.push({
        id: movieSnap.id,
        ...movieSnap.data(),
      });
    });

    return moviesFav;
  }
};
