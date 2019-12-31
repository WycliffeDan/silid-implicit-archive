import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Fab from '@material-ui/core/Fab';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import GroupIcon from '@material-ui/icons/Group';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import { Organization } from '../types/Organization';
import { Agent } from '../types/Agent';

import useGetOrganizationInfoService from '../services/useGetOrganizationInfoService';
import usePutOrganizationService from '../services/usePutOrganizationService';
import usePutOrganizationMemberService from '../services/usePutOrganizationMemberService';
import useDeleteOrganizationService from '../services/useDeleteOrganizationService';


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

export interface PrevState {
  [key:string]: any
}

const OrganizationInfo = (props: any) => {
  const classes = useStyles();

  const [teamFormVisible, setTeamFormVisible] = useState(false);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [agentFormVisible, setAgentFormVisible] = useState(false);
  const [prevState, setPrevState] = useState<PrevState>({});
  const [toOrganization, setToOrganization] = useState(false);

  const [orgInfo, setOrgInfo] = useState<Organization>({} as Organization);
  const [agentProfile, setAgentProfile] = useState<Agent>(JSON.parse(localStorage.getItem('profile') || '{}') as Agent);

  const service = useGetOrganizationInfoService(props.match.params.id);
  let { publishOrganization } = usePutOrganizationService();
  let { putOrganizationMember } = usePutOrganizationMemberService();
  let { deleteOrganization } = useDeleteOrganizationService();

  useEffect(() => {
    if (service.status === 'loaded') {
      setOrgInfo(service.payload);
    }
  }, [service.status]);

  const handleSubmit = (evt:any) => {
    evt.preventDefault();

    const formData = new FormData(evt.target);
    let data = {} as Organization;
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    publishOrganization(data).then(results => {
      setEditFormVisible(false);
      setOrgInfo({ results, ...orgInfo } as Organization);
    }).catch(err => {
      console.log(err);
    });
  }

  const handleDelete = (evt:any) => {
    if (orgInfo.members.length > 1 || orgInfo.teams.length) {
      return window.alert('Remove all members and teams before deleting organization');
    }
    if (window.confirm('Are you sure you want to delete this organization?')) {
      deleteOrganization({id: orgInfo.id}).then(results => {
        setToOrganization(true);
      });
    }
  }

  const handleMembershipChange = (evt:any) => {
    evt.preventDefault();
    const formData = new FormData(evt.target);

    let data = {} as any;
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    putOrganizationMember(data).then(results => {
      setAgentFormVisible(false);
      orgInfo.members.push(results);
      setOrgInfo({ ...orgInfo } as Organization);
    }).catch(err => {
      console.log(err);
    });
  }

  const customMessage = (evt:React.ChangeEvent<HTMLInputElement>) => {
    evt.target.setCustomValidity(`${evt.target.name} required`);
  }

  const onChange = (evt:React.ChangeEvent<HTMLInputElement>) => {
    if (!prevState[evt.target.name]) {
      const s = { ...prevState};
      s[evt.target.name] = orgInfo[evt.target.name];
      setPrevState(s);
    }
    const f = { ...orgInfo };
    f[evt.target.name] = evt.target.value.trimLeft();
    setOrgInfo(f);
  }

  function ListItemLink(props:any) {
    return <ListItem className='organization-member-list-item' button component="a" {...props} />;
  }

  if (toOrganization) {
    return <Redirect to={{ pathname: '/organization', state: 'Organization deleted' }} />
  }

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
                  <React.Fragment>
                    {!editFormVisible ?
                      <Button id="edit-organization" variant="contained" color="primary" onClick={() => setEditFormVisible(true)}>
                        Edit
                      </Button>
                    :
                      <React.Fragment>
                        <form id="edit-organization-form" onSubmit={handleSubmit}>
                          <input type="hidden" name="id" value={orgInfo.id} />
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
                            value={orgInfo.name}
                            onChange={onChange}
                            onInvalid={customMessage}
                          />
                          <Button id="cancel-changes"
                            variant="contained" color="secondary"
                            onClick={() => {
                              setOrgInfo({ ...orgInfo, ...prevState });
                              setEditFormVisible(false);
                            }}>
                              Cancel
                          </Button>
                          <Button id="save-organization-button"
                                  type="submit" variant="contained" color="primary"
                                  disabled={!Object.keys(prevState).length}>
                            Save
                          </Button>
                        </form>
                        <Button id="delete-organization" variant="contained" color="secondary" onClick={handleDelete}>
                          Delete
                        </Button>
                      </React.Fragment>
                    }
                  </React.Fragment>
                : '' }
                {!editFormVisible && !agentFormVisible ?
                    <Typography variant="body2" color="textSecondary" component="p">
                      <React.Fragment>
                        {orgInfo.creator && (agentProfile.email === orgInfo.creator.email) ?
                          <Fab id="add-agent" color="primary" aria-label="add-agent" className={classes.margin}>
                            <PersonAddIcon onClick={() => setAgentFormVisible(true)} />
                          </Fab>
                        : '' }
                        <Fab id="add-team" color="primary" aria-label="add-team" className={classes.margin}>
                          <GroupIcon onClick={() => setTeamFormVisible(true)} />
                        </Fab>
                      </React.Fragment>
                    </Typography>
                : ''}
                {agentFormVisible ?
                  <form id="add-member-agent-form" onSubmit={handleMembershipChange}>
                    <input type="hidden" name="id" value={orgInfo.id} />
                    <TextField
                      id="email-input"
                      label="New Member Email"
                      type="email"
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                      name="email"
                      required
                      onChange={onChange}
                      onInvalid={customMessage}
                    />
                    <Button id="cancel-add-agent"
                      variant="contained" color="secondary"
                      onClick={() => {
                        setOrgInfo({ ...orgInfo, ...prevState });
                        setAgentFormVisible(false);
                      }}>
                        Cancel
                    </Button>
                    <Button id="add-member-agent-button"
                            type="submit" variant="contained" color="primary"
                            disabled={!Object.keys(prevState).length}>
                      Add
                    </Button>
                  </form>
               : ''}
              </React.Fragment>
            : ''}
          </Typography>
          {service.status === 'loading' && <div>Loading...</div>}
          {service.status === 'loaded' && orgInfo.members && orgInfo.members.length ?
            <List id="organization-member-list">
              <Typography variant="h5" component="h3">
              <React.Fragment>
                Members
              </React.Fragment>
              </Typography>
              { orgInfo.members.map(agent => (
                <ListItem button className='organization-button' key='Organizations'>
                  <ListItemIcon><InboxIcon /></ListItemIcon>
                  <ListItemLink href={`#agent/${agent.id}`}>
                    <ListItemText primary={agent.email} />
                  </ListItemLink>
                </ListItem>
              ))}
            </List> : ''}
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
