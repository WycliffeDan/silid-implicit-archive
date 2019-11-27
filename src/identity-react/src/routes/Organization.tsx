import React from 'react';
import TextField from '@material-ui/core/TextField';
//import useGetAgentService from '../services/useGetAgentService';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(1),
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
  }),
);

const Organization = () => {
  const classes = useStyles();
  // const profile = JSON.parse(localStorage.getItem('profile')!);
  const service = {payload: [], status: 'loaded'};//useGetOrganizationService();

//console.log(service.payload);
  return (
    <div className="agent">
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" component="h3">
            Organizations
          </Typography>

          <Fab id="add-organization" color="secondary" aria-label="add" className={classes.margin}>
            <AddIcon />
          </Fab>

          <Typography variant="body2" color="textSecondary" component="p">
            {/* {JSON.stringify(profile)} */}
            {service.status === 'loading' && <div>Loading...</div>}
            {service.status === 'loaded' && service.payload ?

            <p>organization list goes here</p> : '' }

            
            {service.status === 'error' && (
              <div>Error, the backend moved to the dark side.</div>
            )}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default Organization;
