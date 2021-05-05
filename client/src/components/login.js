import '../css/login.css';
import axios from 'axios';

const Login = () => {
	const handleLogin = (e) => {
		e.preventDefault();
		axios.get('/login').then((res) => console.log(res));
	};

	return (
		<div>
			<div className='title-container'>
				<div className='title-subcontainer'>
					<h1 className='title'>rhythm-</h1>
					<h1 className='style-2'>query</h1>
				</div>
				<div>
					<h3>
						Find recommendations for songs similar to your favourite tracks from
						your favourite artists
					</h3>
				</div>
			</div>
			<div className='login-button-div'>
				<button onClick={(e) => handleLogin(e)} className='login-button'>
					Login to Spotify
				</button>
			</div>
		</div>
	);
};

export default Login;
