import React from 'react';
import TextField from '@material-ui/core/TextField';
import useGetOrganizationService from '../services/useGetOrganizationService';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// Remove this junk later
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

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
  const service = useGetOrganizationService();

  function ListItemLink(props:any) {
    return <ListItem button component="a" {...props} />;
  }

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
          {service.status === 'loading' && <div>Loading...</div>}
          {service.status === 'loaded' && service.payload.results.length ? 
            <List id="organization-list">
              { service.payload.results.map(org => (
                <ListItem button id='organization-button' key='Organizations'>
                  <ListItemIcon><InboxIcon /></ListItemIcon>
                  <ListItemLink href='#organization'>
                    <ListItemText primary='Organizations' />
                  </ListItemLink>
                </ListItem>
              ))}
            </List> : ''}
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
