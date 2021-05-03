import Main from '../components/main';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from '../components/login';

function App() {
	return (
		<div>
			<Router>
				<Switch>
					<Route path='/' exact component={Login} />
					<Route path='/main' component={Main} />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
