const $ = require('jquery');
const fetch = require('node-fetch');

const Search = async (
	genre,
	acousticness,
	danceability,
	energy,
	instrumentalness,
	valence,
	accessToken
) => {
	const result = await fetch(
		`https://api.spotify.com/v1/recommendations?limit=5&market=US&seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_genres=${genre}&seed_tracks=0c6xIDDpzE81m2q797ordA&target_acousticness=${acousticness}&target_danceability=${danceability}&target_energy=${energy}&target_instrumentalness=${instrumentalness}&target_valence=${valence}`,
		{
			method: 'GET',
			headers: { Authorization: `Bearer ${accessToken}` },
		}
	);

	return result;
};

module.exports = Search;
