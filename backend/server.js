const express = require('express');
const cors = require('cors');
const Search = require('./util/search');
const SpotifyWebApi = require('spotify-web-api-node');

require('dotenv').config();

const app = express();
const port = 3012;
const redirect_uri = 'http://localhost:3000/main/';

app.use(express.json());
app.use(cors());

app.route('/').get((req, res) => {
	res.status(200).json('message received');
});

app.route('/login').get((req, res) => {
	var scopes = 'user-read-private user-read-email';
	res.redirect(
		'https://accounts.spotify.com/authorize' +
			'?response_type=code' +
			'&client_id=' +
			process.env.client_id +
			(scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
			'&redirect_uri=' +
			encodeURIComponent(redirect_uri)
	);
});

app.route('/token').post(async (req, res) => {
	const code = req.body.code;
	const spotify_api = await new SpotifyWebApi({
		redirectUri: redirect_uri,
		clientId: process.env.client_id,
		clientSecret: process.env.client_secret,
	});

	await spotify_api
		.authorizationCodeGrant(code)
		.then((response) => {
			console.log(response);
			return res.status(200).json({
				accessToken: response.body.access_token,
				refreshToken: response.body.refresh_token,
				expiresIn: response.body.expires_in,
			});
		})
		.catch((err) => {
			res.status(400).json(err);
		});
});

app.route('/query').post(async (req, res) => {
	console.log(req.body);

	const spotify_api = await new SpotifyWebApi({
		redirectUri: redirect_uri,
		clientId: process.env.client_id,
		clientSecret: process.env.client_secret,
	});
	await spotify_api.setAccessToken(req.body.accessToken);
	await spotify_api
		.getRecommendations({
			seed_genres: req.body.genre,
			seed_artists: '4NHQUGzhtTLFvgF5SZesLK',
			seed_tracks: '0c6xIDDpzE81m2q797ordA',
			target_acousticness: req.body.acousticness,
			target_danceability: req.body.danceability,
			target_energy: req.body.energy,
			target_instrumentalness: req.body.instrumentalness,
			target_valence: req.body.valence,
			limit: '10',
		})
		.then((response) => {
			console.log(response);
			res.status(200).json(response);
		})
		.catch((err) => {
			console.log(err);
		});
});

app.route('/refresh').post((req, res) => {
	const refreshToken = req.body.refreshToken;
	const spotify_api = new SpotifyWebApi({
		redirectUri: redirect_uri,
		clientId: process.env.client_id,
		clientSecret: process.env.client_secret,
		refreshToken: refreshToken,
	});

	spotify_api
		.refreshAccessToken()
		.then((response) => {
			console.log('Token has been refreshed');
			res.status(200).json({
				accessToken: response.body.access_token,
				expiresIn: response.body.expires_in,
			});
		})
		.catch((err) => {
			console.log(err);
		});
});

app.listen(port, () => {
	console.log(`Server is listening on port: ${port}`);
});
