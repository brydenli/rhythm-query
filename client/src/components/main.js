import React, { useState, useEffect } from 'react';
import RadarChart from 'react-svg-radar-chart';
import axios from 'axios';
import 'react-svg-radar-chart/build/css/index.css';
import '../css/main.css';

const Main = () => {
	const [genre, setGenre] = useState('pop');
	const [acousticness, setAcousticness] = useState(0.5);
	const [danceability, setDanceability] = useState(0.5);
	const [energy, setEnergy] = useState(0.5);
	const [instrumentalness, setInstrumentalness] = useState(0.5);
	const [valence, setValence] = useState(0.5);
	const [data_, setData_] = useState([0.5, 0.5, 0.5, 0.5, 0.5]);
	const [accessToken, setAccessToken] = useState('');
	const [refreshToken, setRefreshToken] = useState('');
	const [expiryDate, setExpiryDate] = useState('');
	const [tracks, setTracks] = useState([]);

	useEffect(() => {
		const path = window.location.href;
		const code = path.slice(33);

		const requestObj = {
			code: code,
		};

		axios
			.post('http://localhost:3012/token', requestObj)
			.then((res) => {
				console.log(res);
				setAccessToken(res.data.accessToken);
				setRefreshToken(res.data.refreshToken);
				setExpiryDate(res.data.expiresIn);
				window.history.pushState({}, null, '/');
			})
			.catch((err) => {
				console.log(err);
				window.location = '/login';
			});
	}, []);

	useEffect(() => {
		if (refreshToken || expiryDate) return;
		const requestObj = {
			refreshToken: refreshToken,
		};
		axios.post('http://localhost:3012/refresh', requestObj).then((res) => {
			setAccessToken(res.data.access_token);
			setExpiryDate(res.data.expiresIn);
		});
	}, [refreshToken, expiryDate]);

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

	const handleSubmit = async (
		e,
		genre,
		acousticness,
		danceability,
		energy,
		instrumentalness,
		valence,
		accessToken
	) => {
		e.preventDefault();

		const requestObj = {
			genre: genre,
			acousticness: acousticness,
			danceability: danceability,
			energy: energy,
			instrumentalness: instrumentalness,
			valence: valence,
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

	const data = [
		{
			data: {
				acousticness: data_[0],
				danceability: data_[1],
				energy: data_[2],
				instrumentalness: data_[3],
				valence: data_[4],
			},
			meta: { color: 'green' },
		},
	];

	const captions = {
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

				<div className='container-1'>
					<div>
						<div>
							<label>Acousticness</label>
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
							<label>Danceability</label>
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
							<label>Energy</label>
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
							<label>Instrumentalness</label>
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
							<label>Valence</label>
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
							<label>Genre</label>
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
						<RadarChart captions={captions} data={data} size={450} />
					</div>
				</div>
				<div>
					<button
						onClick={(e) => {
							handleSubmit(
								e,
								genre,
								acousticness,
								danceability,
								energy,
								instrumentalness,
								valence,
								accessToken
							);
						}}
					>
						Search
					</button>
				</div>
			</div>
			<div className='song-list'>
				{tracks &&
					tracks.map((track) => {
						return (
							<div>
								<img src={track.album.images[1].url} />

								<h3>{track.name}</h3>
								<h4>{track.artists[0].name}</h4>
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default Main;