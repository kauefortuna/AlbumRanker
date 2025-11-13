import React, { useState, useEffect, useRef } from "react";
import "../index.css";
import { fetchAlbumSongs } from "../fetchAlbums.js";

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function RatedAlbumCard({
  // Image,
  // title,
  // artist,
  // onClick,
  // rating,
  // reviewText,
  // reviewTitle,
  SelectedAlbum,
  imageUrl,
  albumTitle,
  artistName,
  onClose,
  token,
  albumId,
  release,
  onClick,
  handleAlbumRated,
  rating,
  setRatedAlbum,
  reviewTitle,
  reviewText,
  onDelete,
}) {
  useEffect(() => {
    //console.log(albumId);
    if (albumId && token) {
      fetchAlbumSongs(albumId, token, setSongs);
    }
  }, [albumId, token]);
  const [Rate, setRate] = useState(false);
  const [Done, setDone] = useState(false);
  const [ReviewDone, setReviewDone] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);

  const [songs, setSongs] = useState([]);
  const [ButtonText, setButtonText] = useState("Rate This Album");
  const textareaRef = useRef();
  const titleRef = useRef();
  const [change, setChange] = useState(false);

  return (
    <>
      <div className="RateAlbumOverlay" onClick={onClose}></div>

      <div className="RateAlbumCard">
        <button
          className="CloseButton"
          onClick={() => {
            {
              onClose();
            }
          }}
        >
          ✕
        </button>
        <div className="RateAlbumLeft">
          <img className="RateAlbumCover" src={imageUrl} alt={albumTitle} />
          <div className="RateAlbumInfo">
            <h2>{albumTitle}</h2>
            <br></br>
            <p>{artistName}</p>
            <br></br>
            <p>{release}</p>

            {Rate != true && SelectedAlbum.rating == null && (
              <div
                className="RateButtonDiv"
                onClick={() => {
                  setRate(true);
                  setButtonText("Submit Rating");
                  onClick();
                }}
              >
                <button className="niceButton">{ButtonText}</button>
              </div>
            )}

            {Rate != true && SelectedAlbum.rating != null && (
              <>
                <div
                  className="RateButtonDiv"
                  onClick={() => {
                    setRate(true);
                    setButtonText("Submit Rating");
                    setChange(true);
                  }}
                >
                  <button className="niceButton">Change Rating</button>
                </div>
                <div className="RateButtonDiv" onClick={onDelete}>
                  <button className="niceButton">Delete Rating</button>
                </div>
              </>
            )}

            {change && !Done && selectedRating && (
              <>
                <div
                  className="RateButtonDiv"
                  onClick={() => {
                    setRate(true);
                    setButtonText("Submit Rating");
                    setSelectedRating(rating);
                    SelectedAlbum.rating = selectedRating;
                    SelectedAlbum.reviewText = textareaRef.current.value;
                    SelectedAlbum.reviewTitle = titleRef.current.value;

                    setDone(true);
                  }}
                >
                  <button className="niceButton">Submit Change</button>
                </div>
              </>
            )}
          </div>
        </div>

        {!Done && (
          <>
            <div className="review-block">
              {/* Rating row */}
              <div>
                <h1></h1>
              </div>
              <div className="rating-header">
                <span className="rating-title">Rating</span>
                <span className="rating-value">
                  {selectedRating
                    ? `${selectedRating} of 10`
                    : `${SelectedAlbum.rating} of 10`}
                </span>
              </div>

              <div className={change ? "star-rating" : "star-rating2"}>
                <input
                  type="radio"
                  id="star10"
                  name="rating"
                  value="10"
                  checked={(rating == 10 && !change) || selectedRating == 10}
                  onChange={(e) => setSelectedRating(Number(e.target.value))}
                />
                <label htmlFor="star10"></label>

                <input
                  type="radio"
                  id="star9"
                  name="rating"
                  value="9"
                  checked={(rating == 9 && !change) || selectedRating == 9}
                  onChange={(e) => setSelectedRating(e.target.value)}
                />
                <label htmlFor="star9"></label>

                <input
                  type="radio"
                  id="star8"
                  name="rating"
                  value="8"
                  checked={(rating == 8 && !change) || selectedRating == 8}
                  onChange={(e) => setSelectedRating(e.target.value)}
                />
                <label htmlFor="star8"></label>

                <input
                  type="radio"
                  id="star7"
                  name="rating"
                  value="7"
                  checked={(rating == 7 && !change) || selectedRating == 7}
                  onChange={(e) => setSelectedRating(e.target.value)}
                />
                <label htmlFor="star7"></label>

                <input
                  type="radio"
                  id="star6"
                  name="rating"
                  value="6"
                  checked={(rating == 6 && !change) || selectedRating == 6}
                  onChange={(e) => setSelectedRating(e.target.value)}
                />
                <label htmlFor="star6"></label>

                <input
                  type="radio"
                  id="star5"
                  name="rating"
                  value="5"
                  checked={(rating == 5 && !change) || selectedRating == 5}
                  onChange={(e) => setSelectedRating(e.target.value)}
                />
                <label htmlFor="star5"></label>

                <input
                  type="radio"
                  id="star4"
                  name="rating"
                  value="4"
                  checked={(rating == 4 && !change) || selectedRating == 4}
                  onChange={(e) => setSelectedRating(e.target.value)}
                />
                <label htmlFor="star4"></label>

                <input
                  type="radio"
                  id="star3"
                  name="rating"
                  value="3"
                  checked={(rating == 3 && !change) || selectedRating == 3}
                  onChange={(e) => setSelectedRating(e.target.value)}
                />
                <label htmlFor="star3"></label>

                <input
                  type="radio"
                  id="star2"
                  name="rating"
                  value="2"
                  checked={(rating == 2 && !change) || selectedRating == 2}
                  onChange={(e) => setSelectedRating(e.target.value)}
                />
                <label htmlFor="star2"></label>

                <input
                  type="radio"
                  id="star1"
                  name="rating"
                  value="1"
                  checked={(rating == 1 && !change) || selectedRating == 1}
                  onChange={(e) => setSelectedRating(e.target.value)}
                />
                <label htmlFor="star1"></label>

                <button
                  type="button"
                  className="clear-rating"
                  onClick={() => {
                    document
                      .querySelectorAll(".star-rating input")
                      .forEach((el) => (el.checked = false));
                    setSelectedRating(null);
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Review label */}
              <div className="section-heading">Review</div>

              {/* Review title input */}
              <textarea
                disabled={!change}
                ref={titleRef}
                type="text"
                className="review-title-input"
                placeholder="Review title"
              >
                {reviewTitle}
              </textarea>

              {/* Review body textarea */}
              <textarea
                disabled={!change}
                ref={textareaRef}
                className="review-textarea"
                placeholder="Add a review..."
              >
                {reviewText}
              </textarea>
              {/* <div className="songsBox">
                {songs.map(({ name, durationMs }) => (
                  <div className="songCard" key={name}>
                    <p>{name}</p>
                    <p>{formatDuration(durationMs)} min</p>
                  </div>
                ))}
              </div> */}
            </div>
          </>
        )}
        {Rate != false && Done && (
          <h2 style={{ margin: "auto" }}>Thank you for the review!</h2>
        )}
      </div>
    </>
  );
  // return (
  //   <div className="AlbumCard2" onClick={onClick}>
  //     <img className="AlbumCover2" src={Image} alt={title}></img>
  //     <p className="AlbumDescript2">
  //       {title}
  //       <br />
  //       <span className="ArtistName2">{artist}</span>

  //       <br />
  //       <br />
  //       <span className="ArtistName2">Rating: {rating} </span>
  //       <br />
  //       <br />
  //       <span className="ArtistName2">Review Title: {reviewTitle} </span>
  //       <br />
  //       <br />
  //       <span className="ArtistName2">Review Text: {reviewText} </span>
  //     </p>
  //   </div>
  // );
}

export default RatedAlbumCard;
