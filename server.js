const express = require('express');
const cors = require('cors');
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3012;
const redirect_uri = 'https://rhythm-query.herokuapp.com/';

app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, 'client/build')));
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
	});
}

app.route('/').get((req, res) => {
	res.status(200).json('message received');
});

app.route('/login').get((req, res) => {
	var scopes =
		'user-read-private user-read-email user-top-read playlist-modify-private';
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
	const code = req.body.code.code;
	console.log(code);
	const spotify_api = await new SpotifyWebApi({
		redirectUri: redirect_uri,
		clientId: process.env.client_id,
		clientSecret: process.env.client_secret,
	});
	console.log('new spotify api created');
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
			seed_artists: req.body.seed_artists,
			seed_tracks: req.body.seed_tracks,
			target_acousticness: req.body.acousticness,
			target_danceability: req.body.danceability,
			target_energy: req.body.energy,
			target_instrumentalness: req.body.instrumentalness,
			target_valence: req.body.valence,
			limit: '20',
		})
		.then((response) => {
			console.log(response);
			res.status(200).json(response);
		})
		.catch((err) => {
			console.log(err);
		});
});

app.route('/top_artists').post(async (req, res) => {
	const spotify_api = await new SpotifyWebApi({
		redirectUri: redirect_uri,
		clientId: process.env.client_id,
		clientSecret: process.env.client_secret,
	});
	await spotify_api.setAccessToken(req.body.accessToken);

	try {
		await spotify_api
			.getMyTopArtists()
			.then(async (response) => {
				let top_artists = await response.body.items;
				console.log(top_artists);
				res.status(200).json(top_artists);
			})
			.catch((err) => {
				console.log(err);
			});
	} catch {
		(err) => {
			console.log(err);
			res.status(400).json(err);
		};
	}
});

app.route('/top_tracks').post(async (req, res) => {
	const spotify_api = await new SpotifyWebApi({
		redirectUri: redirect_uri,
		clientId: process.env.client_id,
		clientSecret: process.env.client_secret,
	});
	await spotify_api.setAccessToken(req.body.accessToken);

	try {
		await spotify_api
			.getMyTopTracks()
			.then(async (response) => {
				let top_tracks = await response.body.items;
				console.log(top_tracks);
				res.status(200).json(top_tracks);
			})
			.catch((err) => {
				console.log(err);
			});
	} catch {
		(err) => {
			console.log(err);
			res.status(400).json(err);
		};
	}
});

app.route('/playlist').post(async (req, res) => {
	//Need to receive playlist name in the body - done
	//Need to receive list of tracks via uris - done
	//need to return playlist uris into the .addTracksToPlaylist() call after the .createPlaylist() call
	//update permissions in token - done
	const track_uris = req.body.track_uris;
	console.log(track_uris);

	const spotify_api = await new SpotifyWebApi({
		redirectUri: redirect_uri,
		clientId: process.env.client_id,
		clientSecret: process.env.client_secret,
	});
	await spotify_api.setAccessToken(req.body.accessToken);

	try {
		await spotify_api
			.createPlaylist(req.body.playlist_name, {
				description: 'Generated by rhythm-query',
				public: false,
			})
			.then(async (response) => {
				console.log('New Playlist Created!');
				console.log(response);
				await spotify_api
					.addTracksToPlaylist(response.body.id, track_uris)
					.then((response) => {
						console.log(response);
						res.status(200).json(response);
					})
					.catch((err) => {
						console.log(err);
						res.status(400).json(err);
					});
			})
			.catch((err) => {
				console.log(err);
			});
	} catch {
		(err) => {
			console.log(err);
			res.status(400).json(err);
		};
	}
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