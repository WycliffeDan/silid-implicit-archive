import React from 'react';
import Auth from '../auth/Auth';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

interface IProps  {
  auth: Auth;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    link: {
      margin: theme.spacing(1),
    },
  }),
);

const Home = (props: IProps) => {
  const classes = useStyles();
  const { auth } = props;

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Identity
        </Typography>
        {!auth.isAuthenticated() && (
          <Button id="login-button" color="inherit" onClick={() => auth.login()}>Login</Button>
        )}
        {auth.isAuthenticated() && ( 
          <>
            <Link id="profile-link" to="/agent" color="inherit"  className={classes.link}>Profile</Link>
            <Button id="logout-button" color="inherit" onClick={() => auth.logout()}>Logout</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}


export default Home;

