import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Auth from '../auth/Auth';

interface IProps  {
  component: React.Component,
  auth: Auth
}

const PrivateRoute = ({ component, auth, ...rest }: IProps) => (
  <Route {...rest} render={(props) => (
    auth.isAuthenticated
      ? <React.Component {...props} />
      : <Redirect to='/' />
  )} />
)

export default PrivateRoute;
