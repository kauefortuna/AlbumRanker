export async function fetchAlbum(query, token, setFilteredAlbums) {
  if (!query || !token) return;

  setFilteredAlbums([]);

  try {
    // Combine artist & album search flexibility (e.g. "thriller michael")
    const formattedQuery = query.split(" ").join("%20");

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${formattedQuery}&type=album&limit=36&market=US`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!data.albums || !data.albums.items) {
      console.error("No albums found for query:", query);
      return;
    }

        ///need to fix this to have the ID also pass token to fetch songs
    const formattedAlbums = data.albums.items.map((album) => ({
      genres: album.genres ? album.genres.join(", ") : "Unknown",
      release:album.release_date,
      albumId: album.id,
      imageUrl: album.images[0]?.url,
      albumTitle: album.name,
      artistName: album.artists.map((a) => a.name).join(", "),
      rating: null,
      reviewTitle: null,
      reviewText: null,
    }));

    setFilteredAlbums(formattedAlbums);
  } catch (err) {
    console.error("Error fetching albums:", err);
  }
}








export async function fetchAlbumSongs(albumId, token, setSongs) {
  if (!albumId || !token) return;

  setSongs([]); // clear old data

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/albums/${albumId}/tracks?limit=50`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!data.items) {
      console.error("No songs found for album:", albumId);
      return;
    }

    const formattedSongs = data.items.map((track) => ({
      name: track.name,
      durationMs: track.duration_ms,
    }));

    setSongs(formattedSongs);
    //console.log("Fetched tracks:", data);
  } catch (err) {
    console.error("Error fetching songs:", err);
  }
}