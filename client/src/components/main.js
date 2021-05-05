import React, { useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import '../css/main.css';

const Main = (code) => {
	const [genre, setGenre] = useState('pop');
	const [acousticness, setAcousticness] = useState(0.5);
	const [danceability, setDanceability] = useState(0.5);
	const [energy, setEnergy] = useState(0.5);
	const [instrumentalness, setInstrumentalness] = useState(0.5);
	const [valence, setValence] = useState(0.5);
	const [accessToken, setAccessToken] = useState('');
	const [refreshToken, setRefreshToken] = useState('');
	const [expiryDate, setExpiryDate] = useState('');
	const [topArtists, setTopArtists] = useState([]);
	const [topTracks, setTopTracks] = useState([]);
	const [artist_seed_href, setArtist_seed_href] = useState('');
	const [track_seed_href, setTrack_seed_href] = useState('');
	const [tracks, setTracks] = useState([]);
	const [artistID, setArtistID] = useState('');
	const [trackID, setTrackID] = useState('');
	const [hideArtists, setHideArtists] = useState(true);
	const [hideTracks, setHideTracks] = useState(true);
	const [artist_src, setArtist_src] = useState('');
	const [track_src, setTrack_src] = useState('');
	const [artist_name, setArtist_name] = useState('');
	const [track_name, setTrack_name] = useState('');
	const [track_artist_name, setTrack_artist_name] = useState('');
	const [track_uris, setTrack_uris] = useState([]);

	useEffect(() => {
		const requestObj = {
			code: code,
		};
		console.log(code);

		console.log(requestObj);

		axios
			.post('/token', requestObj)
			.then(async (res) => {
				console.log(res);
				await setAccessToken(res.data.accessToken);
				setRefreshToken(res.data.refreshToken);
				setExpiryDate(res.data.expiresIn);
				window.history.pushState({}, null, '/');
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	useEffect(() => {
		if (!refreshToken || !expiryDate) return;
		const expire = setInterval(() => {
			const requestObj = {
				refreshToken: refreshToken,
			};
			axios
				.post('/refresh', requestObj)
				.then((res) => {
					setAccessToken(res.data.access_token);
					setExpiryDate(res.data.expiresIn);
				})
				.catch((err) => {
					console.log(err);
					window.location('/');
				});
		}, (expiryDate - 60) * 1000);

		return () => clearInterval(expire);
	}, [refreshToken, expiryDate]);

	useLayoutEffect(() => {
		const requestObj = {
			accessToken: accessToken,
		};

		axios
			.post('/top_artists', requestObj)
			.then((res) => {
				setTopArtists(res.data);
				console.log(res.data);
			})
			.catch((err) => {
				console.log(err);
			});

		axios
			.post('/top_tracks', requestObj)
			.then((res) => {
				setTopTracks(res.data);
				console.log(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [accessToken]);

	useLayoutEffect(() => {
		const updateTrack_uris = async () => {
			let track_uri_list = await tracks.map((song) => song.uri);
			await setTrack_uris(track_uri_list);
		};
		updateTrack_uris();
	}, [tracks]);

	const handleGenre = (e) => {
		setGenre(e.target.value);
	};
	const handleAcousticness = (e) => {
		setAcousticness(e.target.value);
	};
	const handleDanceability = (e) => {
		setDanceability(e.target.value);
	};
	const handleEnergy = (e) => {
		setEnergy(e.target.value);
	};
	const handleInstrumentalness = (e) => {
		setInstrumentalness(e.target.value);
	};
	const handleValence = (e) => {
		setValence(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!artistID || !trackID) {
			window.alert('Please select both a seed artist and seed track');
			return;
		}

		const requestObj = {
			genre: genre,
			acousticness: acousticness,
			danceability: danceability,
			energy: energy,
			instrumentalness: instrumentalness,
			valence: valence,
			seed_artists: artistID,
			seed_tracks: trackID,
			accessToken: accessToken,
		};

		axios
			.post('/query', requestObj)
			.then(async (res) => {
				console.log(res.data.body);
				await setTracks(res.data.body.tracks);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleClickArtist = (e, id, src, name, href) => {
		e.preventDefault();
		setArtistID(id);
		setArtist_src(src);
		setArtist_name(name);
		setArtist_seed_href(href);
	};

	const handleClickTrack = (e, id, src, name, artist_name, href) => {
		e.preventDefault();
		setTrackID(id);
		setTrack_src(src);
		setTrack_name(name);
		setTrack_artist_name(artist_name);
		setTrack_seed_href(href);
	};

	const handleHideArtists = (e) => {
		e.preventDefault();
		setHideArtists(!hideArtists);
	};

	const handleHideTracks = (e) => {
		e.preventDefault();
		setHideTracks(!hideTracks);
	};

	const handleNewPlaylist = (e) => {
		e.preventDefault();
		console.log(track_uris);
		const requestObj = {
			accessToken: accessToken,
			track_uris: track_uris,
			playlist_name:
				'rhythm-query: ' +
				'(' +
				genre +
				') ' +
				artist_name +
				' + ' +
				track_name,
		};

		axios
			.post('/playlist', requestObj)
			.then((res) => {
				console.log(res);
			})
			.then(() => {
				window.alert('New Playlist added to your Spotify account!');
			});
	};

	return (
		<div>
			<div className='container'>
				<div className='title-subcontainer-main'>
					<h1 className='title'>rhythm-</h1>
					<h1 className='style-2'>query</h1>
				</div>

				<h4 className='mr-bottom'>
					Here are a list of your Top Artists on Spotify. Click on one to get
					songs similar to their style:
				</h4>
				{hideArtists ? (
					<button onClick={(e) => handleHideArtists(e)}>
						Click to see your Top Artists on Spotify
					</button>
				) : (
					<div>
						<button onClick={(e) => handleHideArtists(e)}>
							Click to hide list of Top Artists
						</button>
						<div className='top-artists'>
							{topArtists &&
								topArtists.map((artist) => {
									const artist_id = artist.id;
									const img_src = artist.images[0].url;
									const artist_name = artist.name;
									const href = artist.external_urls.spotify;
									return (
										<div className='single-container'>
											<img
												className='top-artist-song-img'
												onClick={(e) =>
													handleClickArtist(
														e,
														artist_id,
														img_src,
														artist_name,
														href
													)
												}
												src={artist.images[0].url}
											></img>
											<h4 className='album-song-text'>{artist.name}</h4>
										</div>
									);
								})}
						</div>
					</div>
				)}

				<h4 className='mr-bottom'>
					Here are a list of your Top Tracks on Spotify. Click on one to get
					songs similar to its style:
				</h4>
				{hideTracks ? (
					<button onClick={(e) => handleHideTracks(e)}>
						Click to see your Top Tracks on Spotify
					</button>
				) : (
					<div>
						<button onClick={(e) => handleHideTracks(e)}>
							Click to hide list of Top Tracks
						</button>
						<div className='top-tracks'>
							{topTracks &&
								topTracks.map((song) => {
									const track_id = song.id;
									const img_src = song.album.images[0].url;
									const track_name = song.name;
									const track_artist_name = song.artists[0].name;
									const href = song.external_urls.spotify;
									return (
										<div className='single-container'>
											<img
												className='top-artist-song-img'
												onClick={(e) =>
													handleClickTrack(
														e,
														track_id,
														img_src,
														track_name,
														track_artist_name,
														href
													)
												}
												src={song.album.images[0].url}
											></img>
											<h4 className='album-song-maintext'>{song.name}</h4>
										</div>
									);
								})}
						</div>
					</div>
				)}

				<div className='container-1'>
					<div className='container-1-sub-1'>
						<div>
							<label>Genre: </label>
							<input list='genres' onChange={handleGenre}></input>
							<datalist id='genres'>
								<option value='acoustic'></option>
								<option value='afrobeat'></option>
								<option value='alt-rock'></option>
								<option value='alternative'></option>
								<option value='ambient'></option>
								<option value='anime'></option>
								<option value='black-metal'></option>
								<option value='bluegrass'></option>
								<option value='blues'></option>
								<option value='bossanova'></option>
								<option value='brazil'></option>
								<option value='breakbeat'></option>
								<option value='cantopop'></option>
								<option value='chicago-house'></option>
								<option value='children'></option>
								<option value='chill'></option>
								<option value='club'></option>
								<option value='comedy'></option>
								<option value='country'></option>
								<option value='dance'></option>
								<option value='dancehall'></option>
								<option value='death-metal'></option>
								<option value='deep-house'></option>
								<option value='detroit-techno'></option>
								<option value='disco'></option>
								<option value='disney'></option>
								<option value='dub'></option>
								<option value='dubstep'></option>
								<option value='edm'></option>
								<option value='electro'></option>
								<option value='electronic'></option>
								<option value='emo'></option>
								<option value='folk'></option>
								<option value='french'></option>
								<option value='funk'></option>
								<option value='garage'></option>
								<option value='german'></option>
								<option value='goth'></option>
								<option value='groove'></option>
								<option value='grunge'></option>
								<option value='guitar'></option>
								<option value='happy'></option>
								<option value='hard-rock'></option>
								<option value='hardcore'></option>
								<option value='hardstyle'></option>
								<option value='heavy-metal'></option>
								<option value='hip-hop'></option>
								<option value='holidays'></option>
								<option value='house'></option>
								<option value='indian'></option>
								<option value='indie'></option>
								<option value='indie-pop'></option>
								<option value='iranian'></option>
								<option value='j-dance'></option>
								<option value='j-idol'></option>
								<option value='j-pop'></option>
								<option value='j-rock'></option>
								<option value='jazz'></option>
								<option value='k-pop'></option>
								<option value='kids'></option>
								<option value='latino'></option>
								<option value='malay'></option>
								<option value='mandopop'></option>
								<option value='metal'></option>
								<option value='metalcore'></option>
								<option value='minimal-techno'></option>
								<option value='opera'></option>
								<option value='pagode'></option>
								<option value='party'></option>
								<option value='philippines-opm'></option>
								<option value='piano'></option>
								<option value='pop'></option>
								<option value='power-pop'></option>
								<option value='progressive-house'></option>
								<option value='psych-rock'></option>
								<option value='punk'></option>
								<option value='punk-rock'></option>
								<option value='r-n-b'></option>
								<option value='rainy-day'></option>
								<option value='reggae'></option>
								<option value='reggaeton'></option>
								<option value='rock'></option>
								<option value='road-trip'></option>
								<option value='rock-n-roll'></option>
								<option value='rockabilly'></option>
								<option value='romance'></option>
								<option value='sad'></option>
								<option value='salsa'></option>
								<option value='samba'></option>
								<option value='show-tunes'></option>
								<option value='singer-songwriter'></option>
								<option value='ska'></option>
								<option value='sleep'></option>
								<option value='soul'></option>
								<option value='soundtracks'></option>
								<option value='spanish'></option>
								<option value='study'></option>
								<option value='summer'></option>
								<option value='swedish'></option>
								<option value='synth-pop'></option>
								<option value='tango'></option>
								<option value='techno'></option>
								<option value='trance'></option>
								<option value='trip-hop'></option>
								<option value='turkish'></option>
								<option value='work-out'></option>
								<option value='world-music'></option>
							</datalist>
						</div>
						<div>
							<label>Acousticness: </label>
							<input
								type='range'
								value={acousticness}
								onChange={(e) => {
									handleAcousticness(e);
								}}
								min='0'
								max='1'
								step='0.1'
							/>
						</div>
						<div>
							<label>Danceability: </label>
							<input
								type='range'
								value={danceability}
								onChange={handleDanceability}
								min='0'
								max='1'
								step='0.1'
							/>
						</div>
						<div>
							<label>Energy: </label>
							<input
								type='range'
								value={energy}
								onChange={handleEnergy}
								min='0'
								max='1'
								step='0.1'
							/>
						</div>
						<div>
							<label>Instrumentalness: </label>
							<input
								type='range'
								value={instrumentalness}
								onChange={handleInstrumentalness}
								min='0'
								max='1'
								step='0.1'
							/>
						</div>
						<div>
							<label>Positivity: </label>
							<input
								type='range'
								value={valence}
								onChange={handleValence}
								min='0'
								max='1'
								step='0.1'
							/>
						</div>
					</div>
					{artist_src ? (
						<div className='container-1-sub-2'>
							<h3>Chosen Seed Artist</h3>
							<a href={artist_seed_href} target='_blank'>
								<img
									className='artist-song-img'
									src={artist_src}
									height='300px'
									width='300px'
								/>
							</a>
							<h3>{artist_name}</h3>
						</div>
					) : (
						<div>
							<div className='container-1-sub-2'>
								<h3>Chosen Seed Artist</h3>
								<a href='#'>
									<img className='artist-song-img' src={artist_src} />
								</a>
								<h3>{artist_name}</h3>
							</div>
						</div>
					)}

					{track_src ? (
						<div className='container-1-sub-3'>
							<h3>Chosen Seed Track</h3>
							<a href={track_seed_href} target='_blank'>
								<img className='artist-song-img' src={track_src} />
							</a>
							<h3>{track_name}</h3>
						</div>
					) : (
						<div className='container-1-sub-3'>
							<h3>Chosen Seed Track</h3>
							<a href='#'>
								<img
									className='artist-song-img'
									src={track_src}
									height='300px'
									width='300px'
								/>
							</a>
							<h3>{track_name}</h3>
						</div>
					)}
				</div>
			</div>
			<div className='center-button-div'>
				<button
					className='button-margin'
					onClick={(e) => {
						handleSubmit(e);
					}}
				>
					Search
				</button>
			</div>

			{tracks.length > 1 ? (
				<div className='center-button-div'>
					<h3 className='song-list-title'>Recommended Tracks:</h3>
					<button
						className='button-margin'
						onClick={(e) => handleNewPlaylist(e)}
					>
						Add Playlist with Recommended Tracks
					</button>
				</div>
			) : (
				<div></div>
			)}
			<div className='song-list'>
				{tracks &&
					tracks.map((track) => {
						const track_id = track.id;
						return (
							<div id={track_id}>
								<a href={track.external_urls.spotify} target='_blank'>
									<img
										className='artist-song-img'
										src={track.album.images[1].url}
									/>
								</a>
								<h3>{track.name}</h3>
								<h4 className='mr-bottom'>{track.artists[0].name}</h4>
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default Main;
