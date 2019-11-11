import React from 'react';
import Auth from '../auth/Auth';
import AppBar from '../components/Appbar';

interface IProps  {
  auth: Auth;
}

const Agent = (props: IProps) => {
  console.log('test');
  const { auth } = props;

  return (
    <div className="agent">
      <AppBar {...props} />
      <h4>
        Hello, everybody!!
      </h4>
    </div>
  );
}

export default Agent;
