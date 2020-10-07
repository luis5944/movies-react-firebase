import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { db } from "../firebase/firebase-config";
import Swal from "sweetalert2";
import { Button, Dialog, DialogContent } from "@material-ui/core";

export const Movie = ({ data }) => {
  const IMAGES_API = `https://image.tmdb.org/t/p/w1280/`;
  const { id, title, poster_path, overview, vote_average, release_date } = data;
  const year = release_date ? release_date.split("-")[0] : "";
  const [open, setOpen] = useState(false);
  const [youtubeId, setYoutubeId] = useState("");

  const videoYoutube = async () => {
    const resp = await fetch(
      `http://api.themoviedb.org/3/movie/${id}/videos?api_key=5c9963d2881951727e213403f42041b2`
    );
    const data = await resp.json();
    console.log(data);
    if (data.results.length === 0) {
      setYoutubeId("");
    } else {
      setYoutubeId(data.results[0].key);
    }
  };
  const handleClickOpen = () => {
    videoYoutube();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
    let existMovieOnWathList = false;

    await db
      .collection(`${user.uid}/movies/favourites`)
      .where("title", "==", newFavouriteMovie.title)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          existMovieOnWathList = true;
        });
      });

    if (existMovieOnWathList) {
      Swal.fire(":(", `${title} is already on your watchlist`, "error");
      return;
    }
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
        <img src={require("../resource/no.png")} alt="" />
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

          <div>
            <Button variant="text" color="primary" onClick={handleClickOpen}>
              <img src={require("../resource/mult.ico")} alt={title} />
            </Button>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent>
                <iframe
                  title={title}
                  allowFullScreen="allowfullscreen"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  width="560.7"
                  height="315"
                  type="text/html"
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&fs=1&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0&origin=https://youtubeembedcode.com`}
                ></iframe>

                {/* <div>
                    <h1>I can't find it. Check this link</h1>
                    <a
                      href={`https://www.youtube.com/results?search_query=${title} ${year}+movie`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={require("../resource/mult.ico")} alt={title} />
                    </a>
                  </div> */}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};
