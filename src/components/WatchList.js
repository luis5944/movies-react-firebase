import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { loadFavourites } from "../helper/loadFavourites";
import { Movie } from "./Movie";

export const WatchList = () => {
  const [favMovies, setFavMovies] = useState([]);
  const { user } = useContext(UserContext);


  useEffect(() => {
    const favs = async () => {
      const favsGet = await loadFavourites(user.uid);
      setFavMovies(favsGet);
    };
    favs();
  }, [user.uid]);

  return (
    <div>
      {!user.uid ? (
        <h1 className="not-login">You are not login</h1>
      ) : (
        <div className="movie-container">
          {favMovies && favMovies.length > 0 ? (
            favMovies.map((fav) => {
              return <Movie key={fav.id} data={fav} />;
            })
          ) : (
            <h1 className="not-login">Add movies to have a WatchList</h1>
          )}
        </div>
      )}
    </div>
  );
};
