import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import useGetAgentService from '../services/useGetAgentService';

import usePostAgentService, {
  PostAgent,
} from '../services/usePostAgentService';

import usePutAgentService, {
  PutAgent,
} from '../services/usePutAgentService';

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

export interface FormData {
  [key:string]: any,
  name?: string,
  email?: string,
  id?: number
}

export interface PrevState {
  [key:string]: any
}

const Agent = () => {
  const [formData, setFormData] = useState<FormData>({});
  const [prevState, setPrevState] = useState<PrevState>({});

  const classes = useStyles();
  const service = useGetAgentService();

//  const profile = JSON.parse(localStorage.getItem('profile')!);
//  const initialStarshipState: PostAgent = {
//    name: '',
//    email: '',
//    // passengers: '',
//    // cost_in_credits: ''
//  };
//  const [starship, setStarship] = useState<PostAgent>(initialStarshipState);
//  const { service, publishAgent } = usePostAgentService();
  let { publishAgent } = usePutAgentService();


  useEffect(() => {
    if (service.status === 'loaded') {
      setFormData(service.payload);
    }
  }, [service.status]);


  const handleSubmit = (evt:React.FormEvent<EventTarget>) => {
    evt.preventDefault();
    publishAgent(formData).then(results => {
      setPrevState({});
    }).catch(err => {
      console.log(err);
    });
  }

  const onChange = (evt:React.ChangeEvent<HTMLInputElement>) => {
    if (!prevState[evt.target.name]) {
      const s = { ...prevState};
      s[evt.target.name] = formData[evt.target.name];
      setPrevState(s);
    }
    const f = { ...formData };
    f[evt.target.name] = evt.target.value;
    setFormData(f);
  }

  const customMessage = (evt:React.ChangeEvent<HTMLInputElement>) => {
    evt.target.setCustomValidity(`${evt.target.name} required`);
  }

  return (
    <div className="agent">
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" component="h3">
            Profile
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {service.status === 'loading' && <div>Loading...</div>}
            {service.status === 'loaded' && service.payload ?
              <form onSubmit={handleSubmit}>
                <TextField
                  id="email-input"
                  label="Email"
                  type="email"
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                  name="email"
                  disabled
                  value={formData.email}
                />
                <br></br>
                <TextField
                  id="name-input"
                  label="Name"
                  type="text"
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                  name="name"
                  required
                  value={formData.name}
                  onChange={onChange}
                  onInvalid={customMessage}
                />
                { Object.keys(prevState).length ?
                  <Button id="cancel-changes"
                    variant="contained" color="secondary"
                    onClick={() => {
                      setFormData({ ...formData, ...prevState });
                      setPrevState({});
                    }}>
                      Cancel
                  </Button> : ''
                }
                <Button type="submit" variant="contained" color="primary" disabled={!Object.keys(prevState).length}>
                  Save
                </Button>
              </form> : ''}
            {service.status === 'error' && (
              <div>Error, the backend moved to the dark side.</div>
            )}
          </Typography>
        </CardContent>
      </Card>
    </div>
  )    
//          {/* {JSON.stringify(profile)} */}
//          {/*<form onSubmit={handleFormSubmit}>
//            <TextField
//              id="standard-number"
//              label="First Name"
//              type="string"
//              className={classes.textField}
//              InputLabelProps={{
//                shrink: true,
//              }}
//              margin="normal"
//              value={profile.given_name}
//              onChange={handleChange}
//            />
//            <TextField
//              id="standard-number"
//              label="Last Name"
//              type="string"
//              className={classes.textField}
//              InputLabelProps={{
//                shrink: true,
//              }}
//              margin="normal"
//              value={profile.family_name}
//              onChange={handleChange}
//            />
//            <TextField
//              id="standard-number"
//              label="Display Name"
//              type="string"
//              className={classes.textField}
//              InputLabelProps={{
//                shrink: true,
//              }}
//              margin="normal"
//              value={profile.nickname}
//              onChange={handleChange}
//            />
//            <TextField
//              id="standard-number"
//              label="Email"
//              type="string"
//              className={classes.textField}
//              InputLabelProps={{
//                shrink: true,
//              }}
//              margin="normal"
//              value={profile.email}
//              onChange={handleChange}
//            />
//            <Button
//              variant="contained"
//              color="primary"
//              size="large"
//              className={classes.button}
//              startIcon={<SaveIcon />}
//              type="submit"
//            >
//              Save
//            </Button>
//            {service.status === 'loading' && <div>Sending...</div>}
//            {service.status === 'loaded' && (
//              <div className={classes.loaded}>Data saved!</div>
//            )}
//            {service.status === 'error' && (
//              <div className={classes.error}>
//                There was an error in saving your data.
//              </div>
//            )}
//          </form>
//          <br></br> */}
//          {/* {service.status === 'loading' && <div>Loading...</div>}
//            {service.status === 'loaded' &&
//              service.payload.results.map(starship => (
//                <div key={starship.url}>
//                  <TextField
//                    id="standard-number"
//                    label="Name"
//                    type="string"
//                    className={classes.textField}
//                    InputLabelProps={{
//                      shrink: true,
//                    }}
//                    margin="normal"
//                    value={starship.name}
//                  />
//                  <br></br>
//                  <TextField
//                    id="standard-number"
//                    label="Model"
//                    type="string"
//                    className={classes.textField}
//                    InputLabelProps={{
//                      shrink: true,
//                    }}
//                    margin="normal"
//                    value={starship.model}
//                  />
//                  <br></br>
//                  <TextField
//                    id="standard-number"
//                    label="Passengers"
//                    type="string"
//                    className={classes.textField}
//                    InputLabelProps={{
//                      shrink: true, */}
//
};

export default Agent;
