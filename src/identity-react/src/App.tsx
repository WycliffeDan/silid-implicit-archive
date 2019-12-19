// src/App.js
// See: https://auth0.com/docs/quickstart/spa/react/01-login
import React from 'react';
import { Redirect } from 'react-router-dom';
import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom';
import Home from './routes/Home';
import Agent from './routes/Agent';
import Organization from './routes/Organization';
import OrganizationInfo from './routes/OrganizationInfo';
import Auth from './auth/Auth';
import Callback from './callback/Callback';
import { parseQuery } from './utils/parseQuery';
import PrivateRoute from './components/PrivateRoute';

const auth = new Auth();

const handleAuthentication = (props: any) => {
  const { location } = props;
  if (location.search !== '') {
    const params = parseQuery(location.search);
    if (params.inviteId && typeof params.inviteId === 'string') {
      localStorage.setItem('inviteId', params.inviteId);
    }
  }
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication().then(res => {
      console.log('res');
      console.log(res);
      return <Redirect to='/' />;
    }).catch(err => {
      console.log('err');
      console.log(err);
      return <Redirect to='/' />;
    });
  }
};


function App() {
  return (
    <div className="App">
      <HashRouter>
        <Route
          path="/"
          render={props => <Home auth={auth} {...props} />}
        />
        <Switch>
          <PrivateRoute path="/agent" auth={auth} component={Agent} redirect="/" />
          <PrivateRoute path="/organization/:id" auth={auth} component={OrganizationInfo} redirect="/" />
          <PrivateRoute path="/organization" auth={auth} component={Organization} redirect="/" />
        </Switch>
      </HashRouter>
      <BrowserRouter>
        <Route
            path="/callback"
            render={props => {
              handleAuthentication(props);
              return <Callback {...props} />;
            }}
          />
      </BrowserRouter>
    </div>
  );
}

export default App;
