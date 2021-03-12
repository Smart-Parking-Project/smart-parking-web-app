import React from 'react';
import {gql, useQuery} from '@apollo/client'

import clsx from 'clsx';
import { Icon,
    Menu, Label,
    Image,
    List as SemList
     } from 'semantic-ui-react';
import { makeStyles } from '@material-ui/core/styles';
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
import { mainListItems, secondaryListItems } from '../components/listItems';
import LotCard from '../components/DashboardUser/LotCard';

import LotMap from "./Map";



import blueP from '../imgs/blueP.png';



function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
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
  title: {
    flexGrow: 1,
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
    overflow: 'auto',
  },
  container: {
    marginLeft: 30,
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

   shiftTextLeft: {
    marginLeft: '0px'
    
  },
  shiftTextRight: {
    marginLeft: drawerWidth,
  }
}));

 function DashMapAdmin() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const query = gql`

  query {
    
      getAllParkingSpace {parkingLotIdentifier, spaceNumber, isOccupied,  }
      
    }
  `

  const {loading, data, error} = useQuery(query, {
    pollInterval: 1000,
  });

  if (loading) return <p>Loading Parking Data ...</p>     
  if (error) return `Error! ${error}`; 

  return (
    <div className={classes.root}>

      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
          Admin Parking Lot Map
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{mainListItems("/dashAdmin")}</List>
        <Divider />
        <List>{secondaryListItems}</List>
      </Drawer>

      <main className={clsx(
        classes.content)}>

        <div className={classes.appBarSpacer} />

        <Container maxWidth="lg" className={classes.container}>


          <LotMap admin lotData = {data.getAllParkingSpace}/>         
            <Label attached='bottom right'>Admin View</Label>

        </Container>
      </main>
    </div>
  );
}

const ListCurrent = () => (
    <SemList relaxed='very' size ='small'>
      <Menu compact >
      <Menu.Item size ='massive'>
        <Icon name='mail' /> Current Parkers
        <Label color='red' floating>
          5
        </Label>
      </Menu.Item>
      </Menu>
  
      
      <SemList.Item>
        <Image avatar src={blueP} />
        <SemList.Content>
          <SemList.Header as='a'>Rachel</SemList.Header>
          <SemList.Description>
            Entered at
  
            03:10 PM
          </SemList.Description>
        </SemList.Content>
      </SemList.Item>
  
      <SemList.Item>
        <Image avatar src={blueP} />
        <SemList.Content>
          <SemList.Header as='a'>Lindsay</SemList.Header>
          <SemList.Description>
          Entered at
  
          02:58 PM
          </SemList.Description>
        </SemList.Content>
      </SemList.Item>
  
      <SemList.Item>
        <Image avatar src={blueP} />
        <SemList.Content>
          <SemList.Header as='a'>Matthew</SemList.Header>
          <SemList.Description>
          Entered at
  
          02:44 PM
          </SemList.Description>
        </SemList.Content>
      </SemList.Item>
  
      <SemList.Item>
        <Image avatar src={blueP} />
        <SemList.Content>
          <SemList.Header as='a'>Jenny Hess</SemList.Header>
          <SemList.Description>
          Entered at
  
            02:16 PM
          </SemList.Description>
        </SemList.Content>
      </SemList.Item>
  
      <SemList.Item>
        <Image avatar src= {blueP} />
        <SemList.Content>
          <SemList.Header as='a'>Veronika Ossi</SemList.Header>
          <SemList.Description>
            Entered at
  
            02:00 PM
            </SemList.Description>
        </SemList.Content>
      </SemList.Item>
      
    </SemList>
  )
  
  const ListToday = () => (
    <SemList  relaxed='very' size ='small'>
      <Menu compact >
      <Menu.Item size ='massive'>
        <Icon name='mail' /> Todays Parkers
        <Label color='red' floating>
          2
        </Label>
      </Menu.Item>
      </Menu>
  
      
      <SemList.Item>
      
      <SemList.Content floated='right'>
               10-Feb-2021
            </SemList.Content>
  
        <Image avatar src={blueP} />
        
        <SemList.Content>
          
          <SemList.Header as='a'>Sam
          
          </SemList.Header>
          
          <SemList.Description>
          
            Entered at 01:10 PM
            <p>   </p>
            Left at 01:40 PM
          </SemList.Description>
          
        </SemList.Content>
      </SemList.Item>
  
      <SemList.Item>
  
      <SemList.Content floated='right'>
               10-Feb-2021
            </SemList.Content>
  
        <Image avatar src={blueP} />
        <SemList.Content>
          <SemList.Header as='a'>Maria</SemList.Header>
          <SemList.Description>
          Entered at  09:09 AM
          <p>   </p>
          Left at 11:20 AM
          </SemList.Description>
        </SemList.Content>
      </SemList.Item>
  
    </SemList>
  )

  export default DashMapAdmin;
