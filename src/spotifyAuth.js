// spotifyAuth.js
const clientId = "198f3046d64c4939a13ea8578b392fe0";
const redirectUri =
  import.meta.env.PROD
    ? "https://kauefortuna.github.io/AlbumRanker/"
    : "http://127.0.0.1:5173/";
const scopes = ["user-top-read", "user-read-private", "user-read-email"];

// Generate a random string
function generateRandomString(length) {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";
  for (let i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

// SHA256 helper
async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Step 1: Redirect to Spotify login
export async function redirectToSpotifyAuth() {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await sha256(codeVerifier);
  localStorage.setItem("code_verifier", codeVerifier);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: scopes.join(" "),
    redirect_uri: redirectUri,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  });

  window.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// Step 2: Exchange the code for a token
export async function getAccessToken() {
  const code = new URLSearchParams(window.location.search).get("code");
  const verifier = localStorage.getItem("code_verifier");

  if (!code) return null;

  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    code_verifier: verifier,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await response.json();
  localStorage.setItem("spotify_token", data.access_token);
  window.history.replaceState({}, document.title, redirectUri); // clean URL
  return data.access_token;
}