import React from 'react';
import { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import useGetAgentService from '../services/useGetAgentService';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

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
  })
);

export interface FormData {
  name?: string 
}

const Agent = () => {
  const [formData, setFormData] = useState<FormData>({});

  const classes = useStyles();
  // const profile = JSON.parse(localStorage.getItem('profile')!);
  const service = useGetAgentService();


  const handleSubmit = (evt:React.FormEvent<EventTarget>) => {
    evt.preventDefault();
    console.log('Submitting');
  }

  return (
    <div className="agent">
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" component="h3">
            Profile Page
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
                  value={service.payload.email}
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
                  value={service.payload.name}
                  onChange={(evt) => setFormData({ ...formData, name: evt.target.value }) }
                />
                <Button id="cancel-changes"
                  variant="contained" color="secondary"
                  onClick={() => {
                    console.log("BEFORE");
                    console.log(JSON.stringify(formData));
                    setFormData({});
                    console.log("AFTER");
                    console.log(JSON.stringify(formData));
 
                  }}
                  disabled={!Object.keys(formData).length}>
                  hidden={!Object.keys(formData).length}>
                    Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary" disabled={!Object.keys(formData).length}>
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
  );
};

export default Agent;
