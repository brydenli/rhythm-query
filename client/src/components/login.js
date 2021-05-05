import '../css/login.css';
import axios from 'axios';

const URL =
	'https://accounts.spotify.com/authorize?response_type=code&client_id=4e716fccbad34912910fe5b374b1945c&scope=user-read-private%20user-read-email%20user-top-read%20playlist-modify-private&redirect_uri=' +
	encodeURIComponent('https://rhythm-query.herokuapp.com/');

const Login = () => {
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
				<a href={URL} className='login-button'>
					Login to Spotify
				</a>
			</div>
		</div>
	);
};

export default Login;
