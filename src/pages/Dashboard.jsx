/* eslint-disable no-nested-ternary */
import {React, useContext, useState} from 'react';
import Timestamp from 'react-timestamp';
import clsx from 'clsx';
import { Icon,
    Menu, Label,
    Image,
    Button,
    List as SemList
     } from 'semantic-ui-react';



import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';

import {gql, useQuery, useMutation} from '@apollo/client'

import { AuthContext } from "../context/auth";

import { CREATE_PARKING_SESSION } from "../graphql/mutations";

import { mainListItems, secondaryListItems } from '../components/listItems';
import LotCard from '../components/DashboardUser/LotCard';
import useTimer from '../hook/useTimer';


import blueP from '../imgs/blueP.png';



function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Smart Parking Application
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24,
     // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '08px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  
  appHeader: {
    flexGrow: 1,
    display: 'flex',
    
  },

  title: {

    width: '7%'
  },

  drawerPaper: {
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  
  drawerPaperClose: {
    overflowX: 'hidden',
    
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,

  content: {
    MarginLeft: 0,
    
    flexGrow: 1,
    height: '100vh',
    alignContent: 'flex-end'
    
  },
  container: {
    marginLeft: -100,
    
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    
  },

  paper: {
    
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',

    
    
  },
  fixedHeight: {
    height: 240,
  },
  fixedWidth: {
    width: 270,
  },

   shiftTextLeft: {
    marginLeft: '0px'
    
  },
  shiftTextRight: {
    marginLeft: 45,
  },

  headTimer: {
    textAlign: 'center', 
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 0,
    width: '100%',
   
  }
}));

/*  <h1>{user.username} you are now logged into </h1> */


function Dashboard() {
  const { user } = useContext(AuthContext);
  console.log("User ",user);

  console.log("Name  ", user.username);
  console.log("Name  ", user.isAdmin);

  
  return (

    

    <div>

      <h1>Find and select a parking lot below</h1>
      <LotCard admin = "false"
            Name = "Carleton University P1" Location = "Ottawa"
            Empty = "2" Full = "5" Total = "7"
            Address= "123 Lane" Facility  = "Underground" 
            Capacity = "5" Electric = "No" Rate = "3"
              MtFmax = "16" WEmax = "7"/>

    </div>

  

  );
}




export default Dashboard;
