import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { db } from "../firebase/firebase-config";
import Swal from "sweetalert2";

export const Movie = ({ data }) => {
  const IMAGES_API = `https://image.tmdb.org/t/p/w1280/`;

  const { title, poster_path, overview, vote_average, release_date } = data;

  const year = release_date ? release_date.split("-")[0] : "";
  const setVoteClass = (vote) => {
    if (vote >= 7) {
      return "green";
    } else if (vote >= 5) {
      return "orange";
    } else {
      return "red";
    }
  };

  //Grabar en firestore
  //1ºNecesito el uid del user
  const { user } = useContext(UserContext);

  const handleNewFavouriteMovie = async () => {
    if (user.uid === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Login to add to the Watchlist",
      });

      return;
    }
    const newFavouriteMovie = {
      title,
      poster_path,
      overview,
      vote_average,
      release_date,
    };

    Swal.fire("Added", `${title} added to your watchlist`, "success");

    await db.collection(`${user.uid}/movies/favourites`).add(newFavouriteMovie);
  };

  const handleDeleteFavourite = async (e) => {
    if (user.uid === "") {
      alert("Something wrong");
      return;
    }
    await db.doc(`${user.uid}/movies/favourites/${data.id}`).delete();
    window.location = "/watchlist";
    // window.location.reload();
  };

  return (
    <div className="movie">
      {poster_path !== null ? (
        <img src={IMAGES_API + poster_path} alt={title} />
      ) : (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png"
          alt=""
        />
      )}
      <div className="movie-info">
        <h3>{title}</h3>
        <span className={`tag ${setVoteClass(vote_average)}`}>
          {vote_average}
        </span>
      </div>

      <div className="movie-over">
        <h2>Storyline:</h2>
        <p>{overview}</p>
        <div className="movie-links">
          <a
            href={`https://yts.mx/browse-movies/${title} ${year}/all/all/0/latest/0/all`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={require("../resource/ut.ico")} alt={title} />
          </a>
          {window.location.pathname === "/watchlist" ? (
            <img
              src={require("../resource/dwatch.ico")}
              alt={title}
              onClick={handleDeleteFavourite}
            />
          ) : (
            <img
              src={require("../resource/watch.ico")}
              alt={title}
              onClick={handleNewFavouriteMovie}
            />
          )}

          <a
            href={`https://www.youtube.com/results?search_query=${title} ${year}+movie`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={require("../resource/mult.ico")} alt={title} />
          </a>
        </div>
      </div>
    </div>
  );
};
