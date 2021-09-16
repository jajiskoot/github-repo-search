import { AppBar, Toolbar } from '@material-ui/core';
import { useState } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import DetailsPage from './pages/DetailsPage';
import SearchPage from './pages/SearchPage';

export default function App() {
    const [results, setResults] = useState({});
    const [result, setResult] = useState(null);

    return (
        <div className="App">
            <AppBar position="relative">
                <Toolbar>GitHub Repository Search App</Toolbar>
            </AppBar>
            <Router>
                <Switch>
                    <Route path="/details">{result ? <DetailsPage result={result} /> : <Redirect to="/" />}</Route>
                    <Route path="/">
                        <SearchPage results={results} setResults={setResults} setResult={setResult} />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}
