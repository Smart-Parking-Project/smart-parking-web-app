import {React,useContext, useState} from 'react';
import clsx from 'clsx';
import { Icon,
    Menu, Label,
    Image,
    List as SemList
     } from 'semantic-ui-react';

     import {gql, useQuery, useMutation,graphql } from '@apollo/client'

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';

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

import { AuthContext } from "../context/auth";


import blueP from '../imgs/blueP.png';





 function DashboardAdmin() {

  const { user } = useContext(AuthContext);

  if(user ===null){

  
    return <h1>404 - Log In session expired. Please Re-Login</h1>
    
  }


  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const queryParking = gql`

  query {
    
      getAllParkingSpace {parkingLotIdentifier, spaceNumber, isOccupied,  }
      
    }
  `

  const queryCurrentSessions = gql`

  query{
    getAllUserParkingSessions {id,
      enterTime,
      exitTime,
      enterDate,
      exitDate,
      elapsedTime,
      payAmount,
      hasPaid,
      userId,}
  }
  `

  const {loading, data, error} = useQuery(queryParking, {
    pollInterval: 1000,
  });

  const 
  {data: dataSession, 
    loading: loadingSession, error: errorSession} = useQuery(queryCurrentSessions, {
     
  });


  if (loading) return <p>Loading Parking Data ...</p>     
  if (error) return `Error! ${error}`; 
  
  if (loadingSession) return <p>Loading Session  Data ...</p>     
  if (errorSession) return `Error! ${errorSession}`; 



  const pSensor = () =>  {

  const  p0 = data.getAllParkingSpace[0].isOccupied
  const  p1 = data.getAllParkingSpace[1].isOccupied
  const  p2 = data.getAllParkingSpace[2].isOccupied

  }
  
  let emptyP = 0;
  let fullP = 0;
  const lotID = data.getAllParkingSpace[0].parkingLotIdentifier;

  
  // console.log(data.getAllParkingSpace)
  
  data.getAllParkingSpace.map( (p) =>  p.isOccupied ? fullP+=1 : emptyP+=1)

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  console.log("Made it ", dataSession);

 
console.log("Made it here ", dataSession.getAllUserParkingSessions[0]);




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
            Dashboard
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

        <Container maxWidth="lg" 
                  className={clsx(classes.container, open && classes.shiftTextRight)}>

          <Grid container spacing={3}>
            {/* Parking Lot */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper flexGrow={1}>
                <Label attached='bottom right'>Admin View</Label>

                  <LotCard  admin = "true"
                            Name = {lotID} Location = "Ottawa"
                            Empty = {emptyP} Full = {fullP} Total = {emptyP+fullP}
                            Address= "123 Lane" Facility  = "Underground" 
                            Capacity = {emptyP+fullP} Electric = "No" Rate = "3"
                            MtFmax = "16" WEmax = "7"/>
                </Paper>
            </Grid>
            {/* Current Parkers */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                {ListCurrent(dataSession) }
              </Paper>
            </Grid>
            {/* Today's Parkers */}
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                {ListToday(dataSession)}
              </Paper>
            </Grid>
          </Grid>

          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}

const ListCurrent = (session) => (
    <SemList relaxed='very' size ='small'>
      <Menu compact >
      <Menu.Item size ='massive'>
        <Icon name='mail' /> Current Parkers
        <Label color='red' floating>
          2
        </Label>
      </Menu.Item>
      </Menu>
       
      <SemList.Item>
        <Image avatar src={blueP} />
        <SemList.Content>
          <SemList.Header as='a'>{session.getAllUserParkingSessions[2].userId}</SemList.Header>
          <SemList.Description>
            Entered at {session.getAllUserParkingSessions[2].enterTime}
  
            
          </SemList.Description>
        </SemList.Content>
      </SemList.Item>
  
      <SemList.Item>
        <Image avatar src={blueP} />
        <SemList.Content>
          <SemList.Header as='a'>{session.getAllUserParkingSessions[2].userId}</SemList.Header>
          <SemList.Description>
          Entered at {session.getAllUserParkingSessions[2].enterTime} 
                   </SemList.Description>
        </SemList.Content>
      </SemList.Item>
  
    </SemList>
  )
  
  const ListToday = (session) => (
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
      {new Date().getDay()}/{new Date().getMonth()}/{new Date().getFullYear()} 
            </SemList.Content>
  
        <Image avatar src={blueP} />
        
        <SemList.Content>
          
          <SemList.Header as='a'>{session.getAllUserParkingSessions[0].userId}
          
          </SemList.Header>
          
          <SemList.Description>
          
            Entered at {session.getAllUserParkingSessions[0].enterTime}
            <p>   </p>
            Left at {session.getAllUserParkingSessions[0].exitTime}
          </SemList.Description>
          
        </SemList.Content>
      </SemList.Item>
  
      <SemList.Item>
  
      <SemList.Content floated='right'>
               {new Date().getDay()}/{new Date().getMonth()}/{new Date().getFullYear()} 
            </SemList.Content>
  
        <Image avatar src={blueP} />
        <SemList.Content>
          <SemList.Header as='a'>{session.getAllUserParkingSessions[3].userId}</SemList.Header>
          <SemList.Description>
          Entered at  {session.getAllUserParkingSessions[3].enterTime}
          <p>   </p>
          Left at {session.getAllUserParkingSessions[3].exitTime}
          </SemList.Description>
        </SemList.Content>
      </SemList.Item>
  
    </SemList>
  )

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
    
    },
    container: {
      marginLeft: -120,
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
      marginLeft: 30,
    }
  }));

  export default DashboardAdmin;
