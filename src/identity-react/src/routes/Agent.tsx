import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import usePostAgentService, {
  PostAgent,
} from '../services/usePostAgentService';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3, 2),
    },
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
      width: '100%',
    },
    card: {
      marginLeft: '25%',
      marginTop: '4%',
      maxWidth: 720,
    },
    media: {
      height: 140,
    },
    error: {
      color: 'rgba(232, 10, 10, 0.87)',
    },
    loaded: {
      color: 'rgba(19, 162, 64, 0.87)',
    },
  })
);

const Agent = () => {
  const classes = useStyles();
  const profile = JSON.parse(localStorage.getItem('profile')!);
  const initialStarshipState: PostAgent = {
    name: '',
    email: '',
    // passengers: '',
    // cost_in_credits: ''
  };
  const [starship, setStarship] = useState<PostAgent>(initialStarshipState);
  const { service, publishAgent } = usePostAgentService();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setStarship(prevStarship => ({
      ...prevStarship,
      [event.target.name]: event.target.value,
    }));
  };
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    publishAgent(starship).then(() => setStarship(initialStarshipState));
  };
  return (
    <div className="agent">
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" component="h3">
            Profile
          </Typography>
          {/* {JSON.stringify(profile)} */}
          <form onSubmit={handleFormSubmit}>
            <TextField
              id="standard-number"
              label="First Name"
              type="string"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
              value={profile.given_name}
              onChange={handleChange}
            />
            <TextField
              id="standard-number"
              label="Last Name"
              type="string"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
              value={profile.family_name}
              onChange={handleChange}
            />
            <TextField
              id="standard-number"
              label="Display Name"
              type="string"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
              value={profile.nickname}
              onChange={handleChange}
            />
            <TextField
              id="standard-number"
              label="Email"
              type="string"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
              value={profile.email}
              onChange={handleChange}
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.button}
              startIcon={<SaveIcon />}
              type="submit"
            >
              Save
            </Button>
            {service.status === 'loading' && <div>Sending...</div>}
            {service.status === 'loaded' && (
              <div className={classes.loaded}>Data saved!</div>
            )}
            {service.status === 'error' && (
              <div className={classes.error}>
                There was an error in saving your data.
              </div>
            )}
          </form>
          <br></br>
          {/* {service.status === 'loading' && <div>Loading...</div>}
            {service.status === 'loaded' &&
              service.payload.results.map(starship => (
                <div key={starship.url}>
                  <TextField
                    id="standard-number"
                    label="Name"
                    type="string"
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                    value={starship.name}
                  />
                  <br></br>
                  <TextField
                    id="standard-number"
                    label="Model"
                    type="string"
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                    value={starship.model}
                  />
                  <br></br>
                  <TextField
                    id="standard-number"
                    label="Passengers"
                    type="string"
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                    value={starship.passengers}
                  />
                  <br></br>
                  <br></br>
                </div>
              ))}
            {service.status === 'error' && (
              <div>Error, the backend moved to the dark side.</div>
            )} */}
        </CardContent>
      </Card>
    </div>
  );
};

export default Agent;
