import React from 'react';
import TextField from '@material-ui/core/TextField';
import useGetAgentService from '../services/useGetAgentService';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

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

const Agent = () => {
  const classes = useStyles();
  // const profile = JSON.parse(localStorage.getItem('profile')!);
  const service = useGetAgentService();

  return (
    <div className="agent">
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" component="h3">
            Profile Page
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {/* {JSON.stringify(profile)} */}
            {service.status === 'loading' && <div>Loading...</div>}
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
            )}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default Agent;
