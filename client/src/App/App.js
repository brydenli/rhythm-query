import Main from '../components/main';
import Login from '../components/login';

const code = new URLSearchParams(window.location.search).get('code');

function App() {
	return <div>{code ? <Main code={code} /> : <Login />}</div>;
}

export default App;
