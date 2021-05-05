import '../css/login.css';

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
				<a href='http://localhost:3012/login' className='login-button'>
					Login to Spotify
				</a>
			</div>
		</div>
	);
};

export default Login;
