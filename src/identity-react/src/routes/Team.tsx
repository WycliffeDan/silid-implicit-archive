import React, { useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Fab from '@material-ui/core/Fab';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Button from '@material-ui/core/Button';
import { Team } from '../types/Team';
import { Agent } from '../types/Agent';
import Flash from '../components/Flash';

import useGetTeamInfoService from '../services/useGetTeamInfoService';

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

const TeamInfo = (props: any) => {
  const classes = useStyles();

  const [editFormVisible, setEditFormVisible] = useState(false);
  const [agentFormVisible, setAgentFormVisible] = useState(false);
  const [flashProps, setFlashProps] = useState({} as any);
  const [teamInfo, setTeamInfo] = useState<Team>({} as Team);
  const [agentProfile, setAgentProfile] = useState<Agent>(JSON.parse(localStorage.getItem('profile') || '{}') as Agent);

  const service = useGetTeamInfoService(props.match.params.id);

  useEffect(() => {
    if (service.status === 'loaded') {
      setTeamInfo(service.payload);
    }
  }, [service.status]);

  return (
    <div className="team">
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" component="h3">
            {service.status === 'loading' && <div>Loading...</div>}
            {service.status === 'loaded' ?
              <React.Fragment>
                <React.Fragment>
                  {teamInfo.name} 
                </React.Fragment>
                {teamInfo.creator && (agentProfile.email === teamInfo.creator.email) ?
                  <React.Fragment>
                    {!editFormVisible ?
                      <Button id="edit-team" variant="contained" color="primary" onClick={() => setEditFormVisible(true)}>
                        Edit
                      </Button>
                    : ''}
                  </React.Fragment>
                : ''}
                {!editFormVisible && !agentFormVisible ?
                  <Typography variant="body2" color="textSecondary" component="p">
                    <React.Fragment>
                      {teamInfo.creator && (agentProfile.email === teamInfo.creator.email) ?
                        <Fab id="add-agent" color="primary" aria-label="add-agent" className={classes.margin}>
                          <PersonAddIcon onClick={() => setAgentFormVisible(true)} />
                        </Fab>
                      : '' }
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
      { flashProps.message ? <Flash message={flashProps.message} variant={flashProps.variant} /> : '' }
      { flashProps.errors ? flashProps.errors.map(error => <Flash message={error.message} variant={flashProps.variant} />) : '' }
    </div>
  );
};

export default TeamInfo;
