import Main from '../components/main';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from '../components/login';

function App() {
	return (
		<div>
			<Router>
				<Switch>
					<Route path='/login' exact component={Login} />
					<Route path='/' component={Main} />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
