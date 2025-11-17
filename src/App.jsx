//to-do : favourite song, average rating graph

import SearchBar from "./components/SearchBar";
import AlbumCard from "./components/AlbumCard";
import "./index.css";
import "./mobile.css";
import { useState, useEffect, useRef } from "react";
import Iridescence from "./Iridescence.jsx";
//import { loginUrl } from "./spotifyAuth.js";
import Carousel from "./Carousel.jsx";
import "./Carousel.css";
import CarouselReverse from "./CarouselReverse.jsx";
import { redirectToSpotifyAuth, getAccessToken } from "./spotifyAuth.js";
import { fetchAlbum } from "./fetchAlbums";
import RateAlbumCard from "./components/RateAlbumCard.jsx";
import RatedAlbumCard from "./components/RatedAlbumCard.jsx";

function isObjectNotInArray(arr, obj) {
  return arr.some((item) => item.albumId == obj.albumId);
}
function setSelectedIntoRated(arr, obj, func) {
  arr.map((item) => {
    if (item.albumId == obj.albumId) {
      func(item);
    }
  });
}

function App() {
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".HeaderBar");
      const scrollY = window.scrollY;
      const maxScroll = 300; // Adjust for when it becomes fully solid
      const opacity = Math.min(scrollY / maxScroll + 0.3, 0.95); // Clamp between 0 and 1
      header.style.backgroundColor = `rgba(124, 68, 150, ${opacity})`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [token, setToken] = useState(null);
  const [loadingToken, setLoadingToken] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("spotify_token");

    // 1. Try localStorage first
    if (stored) {
      setToken(stored);
      setLoadingToken(false);
      return;
    }

    // 2. Fall back to getAccessToken (e.g. from URL / backend)
    getAccessToken()
      .then((t) => {
        if (t) {
          setToken(t);
          localStorage.setItem("spotify_token", t);
        }
      })
      .finally(() => {
        setLoadingToken(false);
      });
  }, []);
  function handleSpotifyError() {
    localStorage.removeItem("spotify_token");
    window.location.reload();
  }

  const [userId, setUserId] = useState(null);

  const [AllAlbums, setAllAlbums] = useState([]);
  const [albums, setAlbums] = useState([]);

  const [query, setQuery] = useState("");

  const [inputValue, setInputValue] = useState("");

  const [viewMode, setViewMode] = useState("all");

  const [AlbumArray1, setAlbumArray1] = useState([]);
  const [AlbumArray2, setAlbumArray2] = useState([]);

  const [FilteredAlbums, setFilteredAlbums] = useState([]);

  const [SelectedAlbum, setSelectedAlbum] = useState(null);

  const [ratedAlbum, setRatedAlbum] = useState(null);

  const [btn1, setBtn1] = useState(true);
  const [btn2, setBtn2] = useState(false);
  const [btn3, setBtn3] = useState(false);

  const [ratedAlbums, setRatedAlbums] = useState(() => {
    try {
      console.log("Loading rated albums from localStorage");
      return JSON.parse(localStorage.getItem("ratedAlbums") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("ratedAlbums", JSON.stringify(ratedAlbums));
  }, [ratedAlbums]);

  const handleAlbumRated = (album, rating) => {
    setRatedAlbums((prev) => {
      const idx = prev.findIndex((x) => x.albumId === album.albumId);
      const updated = { ...prev[idx], ...album, rating };

      if (idx === -1) return [...prev, { ...album, rating }];

      const copy = prev.slice();
      copy[idx] = updated;
      return copy;
    });
  };

  const handleDeleteRating = (albumId) => {
    // 1. Remove from rated list
    setRatedAlbums((prev) => prev.filter((a) => a.albumId !== albumId));

    // 2. Reset SelectedAlbum fields if it's the same album
    setSelectedAlbum((prev) => {
      if (!prev || prev.albumId !== albumId) return prev;

      return {
        ...prev,
        rating: null,
        reviewText: null,
        reviewTitle: null,
      };
    });

    const effectiveSelectedAlbum =
      SelectedAlbum &&
      (ratedAlbums.find((item) => item.albumId === SelectedAlbum.albumId) ||
        SelectedAlbum);

    // 3. (Optional) also clear from other lists that may carry the rating
    setFilteredAlbums((prev) =>
      prev.map((a) =>
        a.albumId === albumId
          ? { ...a, rating: null, reviewText: null, reviewTitle: null }
          : a
      )
    );

    setAllAlbums((prev) =>
      prev.map((a) =>
        a.albumId === albumId
          ? { ...a, rating: null, reviewText: null, reviewTitle: null }
          : a
      )
    );
    setSelectedAlbum(null);
  };

  //for proofing
  // useEffect(() => {
  //   console.log("Rated Albums (state):", ratedAlbum);
  // }, [ratedAlbum]);

  // const filteredAlbums =
  //   query.trim() === ""
  //     ? []
  //     : AllAlbums.filter(
  //         ({ albumTitle, artistName }) =>
  //           albumTitle.toLowerCase().includes(query.toLowerCase()) ||
  //           artistName.toLowerCase().includes(query.toLowerCase())
  //       );

  async function fetchData({ token, setAllAlbums }) {
    if (!token) return;

    const timeRanges = ["short_term", "medium_term", "long_term"];
    const allAlbums = [];
    const seen = new Set();

    for (const range of timeRanges) {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/me/top/tracks?limit24&time_range=${range}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await response.json();

        if (!data.items) {
          handleSpotifyError();
          console.error(`Error fetching ${range} tracks:`, data);
          continue;
        }

        for (const track of data.items) {
          const album = track.album;
          if (!seen.has(album.id)) {
            seen.add(album.id);
            allAlbums.push({
              imageUrl: album.images[0]?.url,
              albumTitle: album.name,
              artistName: album.artists[0]?.name,
              timeRange: range, // tag so you know which range it came from
            });
          }
        }
      } catch (err) {
        console.error(`Spotify fetch error (${range}):`, err);
      }
    }

    setAllAlbums(allAlbums);
  }

  useEffect(() => {
    if (!token || !userId) return;
    fetchData({ token, setAllAlbums });
  }, [token, userId]);
  //chat

  useEffect(() => {
    getAccessToken().then((token) => {
      if (token) setToken(token);
    });
  }, []);

  // 🧑‍💻 Fetch user ID after login
  useEffect(() => {
    if (!token) return;

    fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        return res.json();
      })
      .then((userData) => setUserId(userData.id))
      .catch((err) => console.error("Failed to get user:", err));
  }, [token]);

  //fetch top albums
  useEffect(() => {
    if (!token) return;

    fetch(
      "https://api.spotify.com/v1/me/top/tracks?limit=24&time_range=medium_term",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          const uniqueAlbums = [];
          const seen = new Set();

          for (let track of data.items) {
            const album = track.album;
            if (!seen.has(album.id)) {
              seen.add(album.id);
              uniqueAlbums.push({
                imageUrl: album.images[0]?.url,
                albumTitle: album.name,
                artistName: album.artists[0]?.name,
              });
            }
          }

          setAlbums(uniqueAlbums.slice(0, 24));
        } else {
          handleSpotifyError();
          console.error("Error fetching top tracks:", data);
        }
      })
      .catch((err) => console.error("Spotify fetch error:", err));
  }, [token, userId]);

  //asdasdassadsa

  useEffect(() => {
    if (albums.length > 0) {
      const covers = albums.map(({ imageUrl }) => imageUrl);
      const half = Math.ceil(covers.length / 2);

      setAlbumArray1(covers.slice(0, half));
      setAlbumArray2(covers.slice(half));
    }
  }, [albums]);

  const [RatedResults, setRatedResults] = useState([]);

  const [foundRated, setFoundRated] = useState(true);

  const searchRatedAlbums = (query) => {
    const q = query.toLowerCase();

    const results = ratedAlbums.filter(
      (a) =>
        a.albumTitle.toLowerCase().includes(q) ||
        a.artistName.toLowerCase().includes(q)
    );

    if (results.length === 0) {
      setFoundRated(false);
    } else {
      setFoundRated(true);
    }

    setRatedResults(results);
  };

  if (loadingToken) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return (
      <div className="login-page">
        <Iridescence
          color={[0.6, 0.4, 0.8]}
          mouseReact={false}
          amplitude={0.1}
          speed={1.0}
        />
        <div className="AppMain" style={{ margin: "10% auto" }}>
          <h1>Album Ranker 3000</h1>
          <button className="login-btn" onClick={redirectToSpotifyAuth}>
            Login with Spotify
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Iridescence
        color={[0.6, 0.45, 0.75]}
        mouseReact={false}
        amplitude={0.1}
        speed={1.0}
      ></Iridescence>
      <div className="AppMain" style={{ margin: "0 auto" }}>
        <div className="HeaderBar">
          <h1>Album Ranker 3000</h1>

          <div className="HeaderSearch">
            <div className="HeaderSearch">
              <SearchBar
                inputValue={inputValue}
                setInputValue={setInputValue}
                value={inputValue}
                onChange={(e) => setInputValue(e)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    setFilteredAlbums([]);
                    e.preventDefault();
                    setQuery(inputValue);

                    if (viewMode === "Rated") {
                      // 🔍 Search only inside rated albums
                      searchRatedAlbums(inputValue);
                    } else {
                      setFilteredAlbums([]);
                      // 🔍 Normal Spotify search
                      await fetchAlbum(inputValue, token, setFilteredAlbums);
                      setViewMode("filtered");
                      setBtn1(false);
                      setBtn2(true);
                      setBtn3(false);
                    }

                    setSelectedAlbum(null);
                  } else {
                    return;
                  }
                }}
              />
            </div>
          </div>

          <div className="HeaderButtons">
            <button
              className={btn1 ? "active-btn2" : "active-btn"}
              onClick={() => {
                setViewMode("all");
                setFilteredAlbums([]);
                setRatedResults([]);
                setSelectedAlbum(null);
                setBtn1(true);
                setBtn2(false);
                setBtn3(false);
              }}
            >
              All Albums
            </button>
            <button
              onClick={() => {
                setViewMode("filtered");
                setFilteredAlbums([]);
                setRatedResults([]);
                setSelectedAlbum(null);
                setBtn1(false);
                setBtn2(true);
                setBtn3(false);
              }}
              className={btn2 ? "active-btn2" : "active-btn"}
            >
              Filtered Albums
            </button>
            <button
              onClick={() => {
                setViewMode("Rated");
                setFilteredAlbums([]);
                setRatedResults([]);
                setSelectedAlbum(null);
                setBtn1(false);
                setBtn2(false);
                setBtn3(true);
              }}
              className={btn3 ? "active-btn2" : "active-btn"}
            >
              Rated Albums
            </button>
            <button
              onClick={() => {
                setViewMode("Rated");
                setFilteredAlbums([]);
                setRatedResults([]);
                setSelectedAlbum(null);
                setBtn1(false);
                setBtn2(false);
                setBtn3(true);
              }}
              className={btn3 ? "active-btn2" : "active-btn"}
            >
              LOGOUT
            </button>
            {viewMode === "Rated" && ratedAlbums.length > 0 && (
              <button
                onClick={() => {
                  const confirmDelete = window.confirm(
                    "Are you sure you want to delete all ratings?"
                  );
                  if (confirmDelete) {
                    setRatedAlbums([]);
                    setRatedResults([]);
                    setSelectedAlbum(null);
                  }
                }}
                className="active-btn"
              >
                Delete All Ratings
              </button>
            )}
          </div>
        </div>

        <div>
          <br></br>
          <br></br>
        </div>
        {viewMode === "all" && (
          <>
            <div className="carousel-wrapper">
              <Carousel
                AlbumsArray={AlbumArray1}
                setSelectedAlbum={setSelectedAlbum}
              ></Carousel>
            </div>
            <div className="carousel-wrapper">
              <CarouselReverse AlbumsArray={AlbumArray2}></CarouselReverse>
            </div>
          </>
        )}

        {viewMode === "Rated" && (
          <>
            <div className="AlbumsContainer">
              {ratedAlbums.length == 0 && <p>No rated albums found.</p>}
              {!foundRated && <p>Album(s) not found.</p>}
              {RatedResults.length > 0 &&
                RatedResults.map((a) => (
                  <AlbumCard
                    key={`${a.albumTitle}-${a.artistName}`}
                    Image={a.imageUrl}
                    title={a.albumTitle}
                    artist={a.artistName}
                    onClick={() => {
                      setSelectedAlbum(a);
                    }}
                    rating={a.rating}
                    reviewTitle={a.reviewTitle}
                    reviewText={a.reviewText}
                  />
                ))}
              {RatedResults.length == 0 &&
                foundRated &&
                ratedAlbums.map((a) => (
                  <AlbumCard
                    key={`${a.albumTitle}-${a.artistName}`}
                    Image={a.imageUrl}
                    title={a.albumTitle}
                    artist={a.artistName}
                    onClick={() => {
                      setSelectedAlbum(a);
                    }}
                    rating={a.rating}
                    reviewTitle={a.reviewTitle}
                    reviewText={a.reviewText}
                  />
                ))}
              {SelectedAlbum != null && (
                <div className="AlbumsContainer">
                  <RatedAlbumCard
                    SelectedAlbum={SelectedAlbum}
                    release={SelectedAlbum.release}
                    genre={SelectedAlbum.genres}
                    token={token}
                    albumId={SelectedAlbum.albumId}
                    key={`${SelectedAlbum.albumTitle}-${SelectedAlbum.artistName}`}
                    imageUrl={SelectedAlbum.imageUrl}
                    artistName={SelectedAlbum.artistName}
                    albumTitle={SelectedAlbum.albumTitle}
                    onClose={() => setSelectedAlbum(null)}
                    onClick={() => {
                      console.log(
                        `Rate button clicked for ${SelectedAlbum.albumTitle} by ${SelectedAlbum.artistName} rating: ${SelectedAlbum.rating}`
                      );
                    }}
                    rating={SelectedAlbum.rating}
                    reviewTitle={SelectedAlbum.reviewTitle}
                    reviewText={SelectedAlbum.reviewText}
                    setRatedAlbum={() => {
                      // setRatedAlbum(SelectedAlbum);
                      setRatedAlbums((prevRatedAlbums) => [
                        ...prevRatedAlbums,
                        SelectedAlbum,
                      ]);
                    }}
                    onDelete={() => handleDeleteRating(SelectedAlbum.albumId)}
                    Rated={true}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {viewMode === "filtered" && (
          <div className="AlbumsContainer">
            {FilteredAlbums.length == 0 && (
              <p>No albums found. Try searching for something else.</p>
            )}
            {FilteredAlbums.map((album) => (
              <AlbumCard
                key={`${album.albumTitle}-${album.artistName}`}
                Image={album.imageUrl}
                title={album.albumTitle}
                artist={album.artistName}
                onClick={() => {
                  const ratedMatch = ratedAlbums.find(
                    (a) => a.albumId === album.albumId
                  );

                  // if this album is in ratedAlbums, prefer that object
                  setSelectedAlbum(ratedMatch || album);
                  // setSelectedAlbum(album);
                }}
              />
            ))}
            {SelectedAlbum != null &&
              !isObjectNotInArray(ratedAlbums, SelectedAlbum) && (
                <div className="AlbumsContainer">
                  <RateAlbumCard
                    setSelectedAlbum={setSelectedAlbum}
                    SelectedAlbum={SelectedAlbum}
                    release={SelectedAlbum.release}
                    genre={SelectedAlbum.genres}
                    token={token}
                    albumId={SelectedAlbum.albumId}
                    key={`${SelectedAlbum.albumTitle}-${SelectedAlbum.artistName}`}
                    imageUrl={SelectedAlbum.imageUrl}
                    artistName={SelectedAlbum.artistName}
                    albumTitle={SelectedAlbum.albumTitle}
                    onClose={() => setSelectedAlbum(null)}
                    onClick={() => {
                      console.log(
                        `Rate button clicked for ${SelectedAlbum.albumTitle} by ${SelectedAlbum.artistName} rating: ${SelectedAlbum.rating}`
                      );
                    }}
                    rating={SelectedAlbum.rating}
                    reviewTitle={SelectedAlbum.reviewTitle}
                    reviewText={SelectedAlbum.reviewText}
                    setRatedAlbum={() => {
                      setRatedAlbum(SelectedAlbum);
                      handleAlbumRated(SelectedAlbum, SelectedAlbum.rating);
                    }}
                    Rated={false}
                  />
                </div>
              )}
            {SelectedAlbum != null &&
              isObjectNotInArray(ratedAlbums, SelectedAlbum) && (
                <div className="AlbumsContainer">
                  <RatedAlbumCard
                    SelectedAlbum={SelectedAlbum}
                    release={SelectedAlbum.release}
                    genre={SelectedAlbum.genres}
                    token={token}
                    albumId={SelectedAlbum.albumId}
                    key={`${SelectedAlbum.albumTitle}-${SelectedAlbum.artistName}`}
                    imageUrl={SelectedAlbum.imageUrl}
                    artistName={SelectedAlbum.artistName}
                    albumTitle={SelectedAlbum.albumTitle}
                    onClose={() => setSelectedAlbum(null)}
                    onClick={() => {
                      console.log(
                        `Rate button clicked for ${SelectedAlbum.albumTitle} by ${SelectedAlbum.artistName} rating: ${SelectedAlbum.rating}`
                      );
                    }}
                    rating={SelectedAlbum.rating}
                    reviewTitle={SelectedAlbum.reviewTitle}
                    reviewText={SelectedAlbum.reviewText}
                    setRatedAlbum={() => {
                      // setRatedAlbum(SelectedAlbum);
                      setRatedAlbums((prevRatedAlbums) => [
                        ...prevRatedAlbums,
                        SelectedAlbum,
                      ]);
                    }}
                    onDelete={() => handleDeleteRating(SelectedAlbum.albumId)}
                    Rated={true}
                  />
                </div>
              )}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
