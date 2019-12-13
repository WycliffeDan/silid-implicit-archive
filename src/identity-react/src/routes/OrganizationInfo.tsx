import React, { useState, useEffect } from 'react';
//import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
//import List from '@material-ui/core/List';
//import ListItem from '@material-ui/core/ListItem';
//import ListItemIcon from '@material-ui/core/ListItemIcon';
//import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
//// Remove this junk later
//import InboxIcon from '@material-ui/icons/MoveToInbox';
//import MailIcon from '@material-ui/icons/Mail';
//
//import useGetOrganizationInfoService, { OrganizationInfos } from '../services/useGetOrganizationInfoService';
import { Organization } from '../types/Organization';
import { Agent } from '../types/Agent';
import useGetOrganizationInfoService from '../services/useGetOrganizationInfoService';
//import usePostOrganizationInfoService, {
//  PostOrganizationInfo,
//} from '../services/usePostOrganizationInfoService';

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

const OrganizationInfo = (props: any) => {
  const [formVisible, toggleFormVisible] = useState(false);
  const [orgInfo, setOrgInfo] = useState<Organization>({} as Organization);
  const [agentProfile, setAgentProfile] = useState<Agent>(JSON.parse(localStorage.getItem('profile') || '{}') as Agent);

  const classes = useStyles();

  const service = useGetOrganizationInfoService(props.match.params.id);
//  let { publishOrganizationInfo } = usePostOrganizationInfoService();

  useEffect(() => {
    if (service.status === 'loaded') {
      setOrgInfo(service.payload);
    }
  }, [service.status]);

//  const handleSubmit = (evt:any) => {
//    evt.preventDefault();
//
//    const formData = new FormData(evt.target);
//    let data = {} as any;
//    for (const [key, value] of formData.entries()) {
//      data[key] = value;
//    }
//
//    publishOrganizationInfo(data).then(results => {
//      toggleFormVisible(false);
//      setOrgList({ results: [results, ...orgList.results] } as OrganizationInfos);
//    }).catch(err => {
//      console.log(err);
//    });
//  }
//
//  const customMessage = (evt:React.ChangeEvent<HTMLInputElement>) => {
//    evt.target.setCustomValidity(`${evt.target.name} required`);
//  }
//
//  function ListItemLink(props:any) {
//    return <ListItem className='organization-list-item' button component="a" {...props} />;
//  }

  

  return (
    <div className="organization">
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" component="h3">
            {service.status === 'loading' && <div>Loading...</div>}
            {service.status === 'loaded' ?
              <React.Fragment>
                <React.Fragment>
                  {orgInfo.name} 
                </React.Fragment>
                {orgInfo.creator && (agentProfile.email === orgInfo.creator.email) ?
                  <Button id="edit-organization" variant="contained" color="secondary">
                    Edit
                  </Button>
                : ''}
              </React.Fragment>
            : ''}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
          {service.status === 'loaded' && (
            <Fab id="add-team" color="secondary" aria-label="add" className={classes.margin}>
             <AddIcon onClick={() => toggleFormVisible(true)} />
            </Fab>
          )}
          </Typography>

          {service.status === 'error' && (
            <Typography id="error-message" variant="h5" component="h3">
              {service.error}
            </Typography>
          )}
        </CardContent>
      </Card>

    </div>
  );
};

export default OrganizationInfo;

//      <Card className={classes.card}>
//        <CardContent>
//          <Typography variant="h5" component="h3">
//            OrganizationInfos
//          </Typography>
//
//          { formVisible ?
//            <form id="add-organization-form" onSubmit={handleSubmit}>
//              <TextField
//                id="name-input"
//                label="Name"
//                type="text"
//                className={classes.textField}
//                InputLabelProps={{
//                  shrink: true,
//                }}
//                margin="normal"
//                name="name"
//                required
//                placeholder="Enter new organization name"
//                onInvalid={customMessage}
//              />
//              <Button id="cancel-changes"
//                variant="contained" color="secondary"
//                onClick={() => {
//                  toggleFormVisible(false)
//                }}>
//                  Cancel
//              </Button>
//              <Button id="add-organization-button" type="submit" variant="contained" color="primary">
//                Add
//              </Button>
//            </form> :
//
//            <Fab id="add-organization" color="secondary" aria-label="add" className={classes.margin}>
//             <AddIcon onClick={() => toggleFormVisible(true)} />
//            </Fab>
//          }
//
//          <Typography variant="body2" color="textSecondary" component="p">
//          {service.status === 'loading' && <div>Loading...</div>}
//          {service.status === 'loaded' && orgList.results.length ?
//            <List id="organization-list">
//              { orgList.results.map(org => (
//                <ListItem button className='organization-button' key='OrganizationInfos'>
//                  <ListItemIcon><InboxIcon /></ListItemIcon>
//                  <ListItemLink href='#organization'>
//                    <ListItemText primary={org.name} />
//                  </ListItemLink>
//                </ListItem>
//              ))}
//            </List> : ''}
//          {service.status === 'error' && (
//            <div>Error, the backend moved to the dark side.</div>
//          )}
//          </Typography>
//        </CardContent>
//      </Card>
