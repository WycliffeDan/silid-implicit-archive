// src/App.js
// See: https://auth0.com/docs/quickstart/spa/react/01-login
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './home/Home';
import Auth from './auth/Auth';
import Callback from './callback/Callback';
import { parseQuery } from './utils/parseQuery';

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
    auth.handleAuthentication();
  }
};


function App() {

  return (
    <div className="App">
<<<<<<< Updated upstream
           <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Identity
          </Typography>
          {!isAuthenticated && (
        <Button id="login-button" color="inherit" onClick={() => loginWithRedirect({})}>Log in</Button>
      )}
          {/* <Button color="inherit">Login</Button> */}
        </Toolbar>
      </AppBar>
=======
>>>>>>> Stashed changes
      <BrowserRouter>
      <Route
          path="/"
          render={props => <Home auth={auth} {...props} />}
        />
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
