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
				window.location = '/';
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
					<h5>{accessToken}</h5>
				</div>
				<div>
					<RadarChart captions={captions} data={data} size={450} />
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
						Button
					</button>
				</div>
				<div>
					<div>
						<label>Genre</label>
						<select name='genre' onChange={handleGenre}>
							<option value='pop'>Pop</option>
							<option value='country'>Country</option>
						</select>
						<h3>Genre Chosen: {genre}</h3>
					</div>
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
				</div>
			</div>
			<div>
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
