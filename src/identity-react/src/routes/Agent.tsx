import React, { useState, FormEvent } from 'react';
//import Auth from '../auth/Auth';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  }),
);

interface IProps  {
//  auth: Auth;
}

const Agent = (props: IProps) => {
  const classes = useStyles();

  const profile = JSON.parse(localStorage.getItem('profile')!);

  const [name, setName] = useState(profile.displayName);
  const [email, setEmail] = useState(profile.emails[0].value);
  const [dirty, setDirty] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  return (
    <div className="agent">
      <h4>
        Profile Page 
      </h4>
      <form className={classes.container} onSubmit={handleSubmit} onChange={() => setDirty(true)}>
        <TextField
          required
          name="name"
          label="Name"
          value={name}
          className={classes.textField}
          margin="normal"
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          required
          name="email"
          label="Email"
          type="email"
          value={email}
          className={classes.textField}
          margin="normal"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.button}
          disabled={!dirty}
        >Save</Button>
      </form>
    </div>
  );
}

export default Agent;
