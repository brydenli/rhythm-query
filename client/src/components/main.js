import React, { useState, useEffect, useLayoutEffect } from 'react';
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css';
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
	const [tracks, setTracks] = useState([]);
	const [artistID, setArtistID] = useState('');
	const [trackID, setTrackID] = useState('');

	useEffect(() => {
		const requestObj = {
			code: code,
		};

		console.log(requestObj);

		axios
			.post('http://localhost:3012/token', requestObj)
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
				.post('http://localhost:3012/refresh', requestObj)
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
			.post('http://localhost:3012/top_artists', requestObj)
			.then((res) => {
				setTopArtists(res.data);
				console.log(res.data);
			})
			.catch((err) => {
				console.log(err);
			});

		axios
			.post('http://localhost:3012/top_tracks', requestObj)
			.then((res) => {
				setTopTracks(res.data);
				console.log(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [accessToken]);

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
			.post('http://localhost:3012/query', requestObj)
			.then(async (res) => {
				console.log(res.data.body);
				await setTracks(res.data.body.tracks);
				console.log(tracks);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleClickArtist = (e, id) => {
		e.preventDefault();
		console.log(id);
		setArtistID(id);
	};

	const handleClickTrack = (e, id) => {
		e.preventDefault();
		console.log(id);
		setTrackID(id);
	};

	let data = [
		{
			data: {
				acousticness: 0.2,
				danceability: 0.3,
				energy: 0.3,
				instrumentalness: 1,
				valence: 0.3,
			},
			meta: { color: 'blue' },
		},
		{
			data: {
				acousticness: 0.7,
				danceability: 0.5,
				energy: 0.4,
				instrumentalness: 0.6,
				valence: 0.8,
			},
			meta: { color: 'green' },
		},
		{
			data: {
				acousticness: 0.1,
				danceability: 0.8,
				energy: 0.9,
				instrumentalness: 0.5,
				valence: 0.6,
			},
			meta: { color: 'red' },
		},
	];

	let captions = {
		acousticness: 'Acousticness',
		danceability: 'Danceability',
		energy: 'Energy',
		instrumentalness: 'Instrumentalness',
		valence: 'Valence',
	};

	return (
		<div>
			<div className='container'>
				<div>
					<h1>rhythm-query</h1>
				</div>

				<h3>
					Here are a list of your Top Artists on Spotify. Click on one to get
					songs similar to their style:
				</h3>
				<div className='top-artists'>
					{topArtists &&
						topArtists.map((artist) => {
							const artist_id = artist.id;
							return (
								<div id={artist_id}>
									<img
										onClick={(e) => handleClickArtist(e, artist_id)}
										src={artist.images[0].url}
										height='160px'
										width='160px'
									></img>
									<h3>{artist.name}</h3>
								</div>
							);
						})}
				</div>
				<h3>
					Here are a list of your Top Tracks on Spotify. Click on one to get
					songs similar to its style:
				</h3>
				<div className='top-tracks'>
					{topTracks &&
						topTracks.map((song) => {
							const track_id = song.id;
							return (
								<div>
									<img
										onClick={(e) => handleClickTrack(e, track_id)}
										src={song.album.images[0].url}
										height='160px'
										width='160px'
									></img>
									<h4>{song.name}</h4>
									<h3>{song.artists[0].name}</h3>
								</div>
							);
						})}
				</div>
				<div className='container-1'>
					<div>
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
							<h5 className='data-value'>{acousticness}</h5>
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
							<h5 className='data-value'>{danceability}</h5>
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
							<h5 className='data-value'>{energy}</h5>
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
							<h5 className='data-value'>{instrumentalness}</h5>
						</div>
						<div>
							<label>Valence: </label>
							<input
								type='range'
								value={valence}
								onChange={handleValence}
								min='0'
								max='1'
								step='0.1'
							/>
							<h5 className='data-value'>{valence}</h5>
						</div>
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
					</div>
					<div>
						<div className='chart-container'>
							<RadarChart data={data} captions={captions} size={375} />
						</div>
						<div className='legend-container'>
							<h5>
								Legend: <br /> Example Lofi Hip-Hop song - Blue
								<br /> Example Country song - Green
								<br /> Example Hip Hop song - Red
							</h5>
						</div>
					</div>
				</div>
				<div>
					<button
						onClick={(e) => {
							handleSubmit(e);
						}}
					>
						Search
					</button>
				</div>
			</div>
			<div className='song-list'>
				{tracks &&
					tracks.map((track) => {
						const track_id = track.id;
						return (
							<div id={track_id}>
								<a href={track.external_urls.spotify} target='_blank'>
									<img src={track.album.images[1].url} />
								</a>
								<h4>{track.name}</h4>
								<h3>{track.artists[0].name}</h3>
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default Main;
