import React from 'react';
import Auth from '../auth/Auth';
import AppBar from '../components/Appbar';

interface IProps {
  auth: Auth;
}

const Home = (props: IProps) => {
  return (
    <div className="home">
      <AppBar {...props} />
    </div>
  );
};

export default Home;
