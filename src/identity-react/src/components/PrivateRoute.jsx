import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {

  let { auth } = rest;

  return (
    <Route {...rest} render={(props) => (
      auth.isAuthenticated()
        ? <Component {...props} />
        : <Redirect to='/' />
    )} />
  );
};

export default PrivateRoute;
