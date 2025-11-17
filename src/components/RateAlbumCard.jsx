import React, { useState, useEffect, useRef } from "react";
import "../index.css";
import { fetchAlbumSongs } from "../fetchAlbums.js";

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function RateAlbumCard({
  setSelectedAlbum,
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
}) {
  const [Rate, setRate] = useState(false);
  const [Done, setDone] = useState(false);
  const [ReviewDone, setReviewDone] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);

  const [songs, setSongs] = useState([]);
  const [ButtonText, setButtonText] = useState("Rate This Album");
  const textareaRef = useRef();
  const titleRef = useRef();
  const [hasReview, setHasReview] = useState(false);
  const [hasReview2, setHasReview2] = useState(false);

  useEffect(() => {
    //console.log(albumId);
    if (albumId && token) {
      fetchAlbumSongs(albumId, token, setSongs);
    }
  }, [albumId, token]);

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
          <div className="RateAlbumCoverDiv">
            <img className="RateAlbumCover" src={imageUrl} alt={albumTitle} />
          </div>

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
                <div className="RateButtonDiv">
                  <button className="niceButton">Rating: {rating}</button>
                </div>
                <div
                  className="RateButtonDiv"
                  onClick={() => {
                    setRate(true);
                    setButtonText("Submit Rating");
                    onClick();
                  }}
                >
                  <button className="niceButton">Change Rating</button>
                </div>
              </>
            )}
          </div>
        </div>

        {Rate != true && (
          <div className="songsBox">
            {songs.map(({ name, durationMs }) => (
              <div className="songCard" key={name}>
                <p>{name}</p>
                <p>{formatDuration(durationMs)} min</p>
              </div>
            ))}
          </div>
        )}

        {Rate === true && !Done && (
          <>
            <div className="review-block">
              {/* Rating row */}
              <div>
                <h1></h1>
              </div>
              <div className="rating-header">
                <span className="rating-title">Rating</span>
                <span className="rating-value">
                  {selectedRating ? `${selectedRating} of 10` : ""}
                </span>
              </div>

              <div className="star-rating">
                <input
                  type="radio"
                  id="star10"
                  name="rating"
                  value="10"
                  onChange={(e) => setSelectedRating(Number(e.target.value))}
                />
                <label htmlFor="star10"></label>

                <input
                  type="radio"
                  id="star9"
                  name="rating"
                  value="9"
                  onChange={(e) => setSelectedRating(e.target.value)}
                />
                <label htmlFor="star9"></label>

                <input
                  type="radio"
                  id="star8"
                  name="rating"
                  value="8"
                  onChange={(e) => setSelectedRating(e.target.value)}
                />
                <label htmlFor="star8"></label>

                <input
                  type="radio"
                  id="star7"
                  name="rating"
                  value="7"
                  onChange={(e) => setSelectedRating(e.target.value)}
                />
                <label htmlFor="star7"></label>

                <input
                  type="radio"
                  id="star6"
                  name="rating"
                  value="6"
                  onChange={(e) => setSelectedRating(e.target.value)}
                />
                <label htmlFor="star6"></label>

                <input
                  type="radio"
                  id="star5"
                  name="rating"
                  value="5"
                  onChange={(e) => setSelectedRating(e.target.value)}
                />
                <label htmlFor="star5"></label>

                <input
                  type="radio"
                  id="star4"
                  name="rating"
                  value="4"
                  onChange={(e) => setSelectedRating(e.target.value)}
                />
                <label htmlFor="star4"></label>

                <input
                  type="radio"
                  id="star3"
                  name="rating"
                  value="3"
                  onChange={(e) => setSelectedRating(e.target.value)}
                />
                <label htmlFor="star3"></label>

                <input
                  type="radio"
                  id="star2"
                  name="rating"
                  value="2"
                  onChange={(e) => setSelectedRating(e.target.value)}
                />
                <label htmlFor="star2"></label>

                <input
                  type="radio"
                  id="star1"
                  name="rating"
                  value="1"
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
              <input
                onChange={(e) => setHasReview(e.target.value.trim().length > 0)}
                ref={titleRef}
                type="text"
                className="review-title-input"
                placeholder="Review title"
              />

              {/* Review body textarea */}
              <textarea
                onChange={(e) =>
                  setHasReview2(e.target.value.trim().length > 0)
                }
                ref={textareaRef}
                className="review-textarea"
                placeholder="Add a review..."
              ></textarea>
              {Rate != false &&
                selectedRating &&
                !Done &&
                hasReview &&
                hasReview2 && (
                  <button
                    className="niceButton2"
                    onClick={() => {
                      // handleAlbumRated({
                      //   albumTitle,
                      //   rating: selectedRating,
                      // });
                      SelectedAlbum.rating = selectedRating;
                      SelectedAlbum.reviewText = textareaRef.current.value;
                      SelectedAlbum.reviewTitle = titleRef.current.value;

                      setDone(true);
                    }}
                  >
                    {ButtonText}
                  </button>
                )}
            </div>
          </>
        )}
        {Rate != false && Done && (
          <>
            <div style={{ margin: "auto" }}>
              <h2 style={{ margin: "auto" }}>Thank you for the review!</h2>
              <button
                className="niceButton2"
                onClick={() => {
                  setRatedAlbum();
                  setSelectedAlbum(null);
                }}
              >
                Finish Submission
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default RateAlbumCard;

/*<input type="radio" id="star10" name="rating" value="10" />
              <label for="star10"></label>
              <input type="radio" id="star9" name="rating" value="9" />
              <label for="star9"></label>
              <input type="radio" id="star8" name="rating" value="8" />
              <label for="star8"></label>
              <input type="radio" id="star7" name="rating" value="7" />
              <label for="star7"></label>
              <input type="radio" id="star6" name="rating" value="6" />
              <label for="star6"></label>*/

/*<div class="rating">
              <input type="radio" id="star1" name="rating" value="1" />
              <label for="star1"></label>
              <input type="radio" id="star2" name="rating" value="2" />
              <label for="star2"></label>
              <input type="radio" id="star3" name="rating" value="3" />
              <label for="star3"></label>
              <input type="radio" id="star4" name="rating" value="4" />
              <label for="star4"></label>
              <input type="radio" id="star5" name="rating" value="5" />
              <label for="star5"></label>
            </div>*/
