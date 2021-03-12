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

import {gql, useQuery} from '@apollo/client'

import { AuthContext } from "../context/auth";



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
function getCurrentTime(){



  const today = new Date();

    const timeNow = `${today.getHours()  }:${  today.getMinutes()  }:${  today.getSeconds()}`;
  
  return <Timestamp options={{ includeDay: false, includeYear: false, includeMonth: false,
    twentyFourHour: true }} date={today} />;
  }

function DashboardUser() {
  const classes = useStyles();
  const { user } = useContext(AuthContext);

  
  const [open, setOpen, timerOn, setTimerOn] = useState(false);

  
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const timerStyle = clsx(classes.paper, classes.fixedHeight, 'stopwatch-card');

  const iniTimer = () => {
    handleStart();
  }
  

  const formatTime = () => {
    const getSeconds = `0${(timer % 60)}`.slice(-2)
    const minutes = `${Math.floor(timer / 60)}`
    const getMinutes = `0${minutes % 60}`.slice(-2)
    const getHours = `0${Math.floor(timer / 3600)}`.slice(-2)

    return `${getHours} : ${getMinutes} : ${getSeconds}`
  }

  const { timer, isActive, isPaused, handleStart, 
          handlePause, handleResume, handleReset } = useTimer(0)



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

  const pSensor = () =>  {

  const  p0 = data.getAllParkingSpace[0].isOccupied
  const  p1 = data.getAllParkingSpace[1].isOccupied
  const  p2 = data.getAllParkingSpace[2].isOccupied

  }
  
  let emptyP = 0;
  let fullP = 0;
  const lotID = data.getAllParkingSpace[0].parkingLotIdentifier;

  
  console.log(data.getAllParkingSpace)
  
  data.getAllParkingSpace.map( (p) =>  p.isOccupied ? fullP+=1 : emptyP+=1)

  console.log(emptyP);
  console.log(fullP);

  const ListCurrent = (name) => (
    <SemList relaxed='very' size ='small'>
      <Menu compact >
      <Menu.Item size ='massive'>
        <Icon name='mail' /> Current Session

      </Menu.Item>
      </Menu>
  
      {isActive && 
      <SemList.Item>
        <Image avatar src={blueP} />
        <SemList.Content>
          <SemList.Header as='a'>{name}</SemList.Header>
          <SemList.Description>
            
            Entered at
            
            <p> </p>
            <div>
            {getCurrentTime()}
            </div>
          </SemList.Description>
        </SemList.Content>
      </SemList.Item>
      }

      {!isPaused && timer!==0 &&
  
  <div className = {classes.headTimer}>        
  <Label color='red' horizontal >
      Parking Duration

  </Label>
  
  <p> </p>

    {formatTime(timer)} 
    </div>
  }
  
  
  {isActive && isPaused &&
  <div className = {classes.headTimer}>
  
  
  <Label color='green' horizontal >
      Parking Duration:
  </Label>
  <p> </p>

    {formatTime(timer)} 
    </div>
  }
  
  
    </SemList>
  )
  

  return(

        
        
      <div className={classes.root}>
                            

            <CssBaseline />
            <AppBar position="absolute" 
                    className={clsx(classes.appBar, open && classes.appBarShift)}>
                      
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
                
                <div className={classes.appHeader}>   
                
                <Typography    component="h1" variant="h6"
                             color="inherit" noWrap className={classes.title}>
                  Dashboard
                </Typography>


                

                
                  </div>
                
                

                <IconButton color="inherit">
                  <Badge badgeContent={4} color="secondary" >
                    <NotificationsIcon  />
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
              <List>{mainListItems("/dash")}</List>
              <Divider />
              <List>{secondaryListItems}</List>
            </Drawer>
            
            <main className={clsx( classes.content)}>

              <div className={classes.appBarSpacer} />




              <Container maxWidth="lg" 
                  className={clsx(classes.container, open && classes.shiftTextRight)}>
                  <Grid container spacing={7}> 

                    {/* Lot card */}
                    <Grid item xs={12} md={4} lg={3}  > 



                      <Paper  flexGrow={1}>
                        
                        <LotCard 
                          startTimer = {iniTimer} stopTimer = {handlePause}
                          Name = {lotID} Location = "Ottawa"
                          Empty = {emptyP} Full = {fullP} Total = {emptyP+fullP}
                          Address= "123 Lane" Facility  = "Underground" 
                          Capacity = {emptyP+fullP} Electric = "No" Rate = "3"
                            MtFmax = "16" WEmax = "7"/>

                      </Paper>
              
                    </Grid>

                  {/* Timer  
                  <Grid item xs={12} md={4} lg={3}>
                    <Paper className={fixedHeightPaper}>
                      <p>{formatTime(timer)}</p>
                      <div className='buttons'>
                        {
                          !isActive && !isPaused ?
                            <Button onClick={handleStart}>Start</Button>
                            : (
                              isPaused ? <Button onClick={handlePause}>Pause</Button> :
                                <Button onClick={handleResume}>Resume</Button>
                            )
                        }
                         <Button onClick={handleReset} disabled={!isActive}>Reset</Button>
                      </div>
                      </Paper>
                  </Grid>
                  */}
            
            {/* Current Parkers */}
            <Grid item xs={12} md={4} lg={3}>
              
              <Paper className={fixedHeightPaper}>
                     {ListCurrent(user.username) }
                     
                                   </Paper>
            </Grid>
            {/* Today's Parkers */}
            <Grid item xs={12}>
              <Paper className={classes.paper}>
              {ListToday()}
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



const ListToday = () => (
  <SemList  relaxed='very' size ='small'>
    <Menu compact >
    <Menu.Item size ='massive'>
      <Icon name='mail' /> Previous Sessions
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
  
export default DashboardUser;
