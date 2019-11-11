import React from 'react';
import Auth from '../auth/Auth';
import AppBar from '../components/Appbar';

interface IProps  {
  auth: Auth;
}

const Agent = (props: IProps) => {

  const { auth } = props;

  return (
    <div className="agent">
      <h4>
        Profile Page 
      </h4>
    </div>
  );
}

export default Agent;
