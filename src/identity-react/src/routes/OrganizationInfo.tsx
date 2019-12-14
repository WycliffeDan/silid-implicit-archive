import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
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

import { Organization } from '../types/Organization';
import { Agent } from '../types/Agent';
import useGetOrganizationInfoService from '../services/useGetOrganizationInfoService';

import usePutOrganizationService, {
  PutOrganization,
} from '../services/usePutOrganizationService';

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
  const [teamFormVisible, setTeamFormVisible] = useState(false);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [agentFormVisible, setAgentFormVisible] = useState(false);
  const [prevState, setPrevState] = useState<PrevState>({});

  const [orgInfo, setOrgInfo] = useState<Organization>({} as Organization);
  const [agentProfile, setAgentProfile] = useState<Agent>(JSON.parse(localStorage.getItem('profile') || '{}') as Agent);

  const classes = useStyles();

  const service = useGetOrganizationInfoService(props.match.params.id);
  let { publishOrganization } = usePutOrganizationService();

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
                  <React.Fragment>
                    {!editFormVisible ?
                      <Button id="edit-organization" variant="contained" color="secondary" onClick={() => setEditFormVisible(true)}>
                        Edit
                      </Button>
                    :
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
                        <Button id="save-organization-button" type="submit" variant="contained" color="primary" disabled={!Object.keys(prevState).length}>
                          Save
                        </Button>
                      </form>
                    }
                  </React.Fragment>
                : '' }
                {!editFormVisible ?
                    <Typography variant="body2" color="textSecondary" component="p">
                      <React.Fragment>
                        <Fab id="add-agent" color="secondary" aria-label="add-agent" className={classes.margin}>
                          <AddIcon onClick={() => setAgentFormVisible(true)} />
                        </Fab>
                        <Fab id="add-team" color="secondary" aria-label="add-team" className={classes.margin}>
                          <AddIcon onClick={() => setTeamFormVisible(true)} />
                        </Fab>
                      </React.Fragment>
                    </Typography>
                : ''}
              </React.Fragment>
            : ''}
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
