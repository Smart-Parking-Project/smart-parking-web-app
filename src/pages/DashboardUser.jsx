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

import {gql, useQuery, useMutation,graphql } from '@apollo/client'

import { AuthContext } from "../context/auth";

import { CREATE_PARKING_SESSION, END_PARKING_SESSION, PAID_FOR_SESSION} from "../graphql/mutations";

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



/*  <h1>{user.username} you are now logged into </h1> */

function getCurrentTime(){

  const today = new Date();

    const timeNow = `${today.getHours()  }:${  today.getMinutes()  }:${  today.getSeconds()}`;
  
    return <Timestamp 
        options={{ includeDay: false, includeYear: false, includeMonth: false,
      twentyFourHour: true }} date={today} />;
}

  

function DashboardUser() {
  

  const classes = useStyles();

  const { user } = useContext(AuthContext);

  if(user ===null){

  
    return <h1>404 - Log In session expired. Please Re-Login</h1>
    
  }

//  console.log("Is first = false ",first===false);



//   const first = true;
//   console.log("first is false");

//    const queryisAdmin = gql`

//   query getAdmin($username: String!){
    
//     getUser(username: $username)
//       {username, isAdmin}
      
//     }
//   `

//   const {loading: userLoading, data: userData, error: userError} = useQuery(queryisAdmin, {
//     variables: { username: user.username },
//   });
//   if (userLoading) return <p>Loading ...</p>;
//   if (userError) return `Error! ${userError}`;





//   console.log(" admin is now  ",first);

  // console.log("Data", userData.getUser);
  // console.log("UN", userData.getUser.username);
  // console.log("isAdmin? ", userData.getUser.isAdmin.toString());



  // console.log("Is Still admin? = ",isAdmin);
  

  const [open, setOpen, timerOn, setTimerOn] = useState(false);


  
  
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight, classes.fixedWidth);
  const timerStyle = clsx(classes.paper, classes.fixedHeight, 'stopwatch-card');

  const [enter, setEnter ] = useState();
  const [exit, setExit] = useState();

  
  const [sessionStart,
    {data: dataSession, 
      loading: loadingSession, error: errorSession}] = useMutation(CREATE_PARKING_SESSION, {
        onCompleted: (data) => {
          console.log("Session Dataaa ", data, data.createParkingSession.id);
        }
      });

  const [sessionEnd,
    {data: dataSesh, 
      loading: loadingSesh, error: errorSesh}] = useMutation(END_PARKING_SESSION, {
        onCompleted: (data) => {
          console.log("Completed");
          console.log("Sesh Daaata ", data, data.endParkingSession);
        }
      });

      const [sessionPay,
        {data: dataPay, 
          loading: loadingPay, error: errorPay}] = useMutation(PAID_FOR_SESSION, {
            onCompleted: (data) => {
              console.log("Paid");
              console.log("money ", data);
            }
          });

      
      
  const iniTimer = () => {
    handleStart();

    
    setEnter(getCurrentTime());

    const timeStart = new Date();
    

    const date = (`${timeStart.toLocaleString('en-us', { month: 'long' })  
                  } ${  timeStart.getDay().toString()}, ${
                   timeStart.getFullYear().toString()}`)

    const time = (`${timeStart.getHours().toString()  }:${  timeStart.getMinutes().toString() }:${ 
                    timeStart.getSeconds().toString()}`)
        
    console.log("User ID ", user.id);
    console.log("Session Starts ");
    console.log(timeStart,timeStart.getFullYear());
    console.log("Dates")

          console.log(date)

          
          console.log(time)

          console.log("before mutat")
    
    console.log(dataSession)

    console.log("Check create mut",user.id,time,date);


    const sesh = sessionStart({
      variables: {
        userId: user.id,
        enterTime: time,
        enterDate: date,
        hasPaid: false,
      },
      
    });


    
  
  }
  

  const exiTimer = () => {

    setExit(getCurrentTime());
    handlePause();

    const timeStop = new Date();
    

    const date = (`${timeStop.toLocaleString('en-us', { month: 'long' })  
                  } ${  timeStop.getDay().toString()}, ${
                    timeStop.getFullYear().toString()}`)

      const time = (`${timeStop.getHours().toString()  }:${  timeStop.getMinutes().toString() }:${ 
      timeStop.getSeconds().toString()}`)
    
      
      console.log("Check mut ",dataSession.createParkingSession.id,time,date,formatTime(timer));

      const seshEND = sessionEnd({
        variables: {
          id: dataSession.createParkingSession.id,
          exitTime: time,
          exitDate: date,
          elapsedTime: formatTime(timer) ,
        },
        
      });

      const seshPay = sessionPay({
        variables: {
          id: dataSession.createParkingSession.id,
          hasPaid: true,
        },
        
      });
      
      
      console.log("After mut ");

  
     

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

  
  // console.log(data.getAllParkingSpace)
  
  data.getAllParkingSpace.map( (p) =>  p.isOccupied ? fullP+=1 : emptyP+=1)

  

  
 

  // console.log(emptyP);
  // console.log(fullP);

  const logAway = () => { localStorage.clear("token"); 
  
    
 
  }
  

  const ListCurrent = (name) => (
    <SemList relaxed='very' size ='large' >
      <Menu compact >
      <Menu.Item size ='massive' >
        <Icon name='mail' /> Current Session
      </Menu.Item>
      </Menu>
  
      {isActive && 
        <SemList.Item>
        <Image avatar src={blueP} />
        <SemList.Content>
          <SemList.Header as='a'>{name}</SemList.Header>
          <SemList.Description>         
            Entered at &nbsp;         
            {enter}
          </SemList.Description>
        </SemList.Content>
        </SemList.Item>
      }

  {!isPaused && timer!==0 &&
        
       <SemList.Item>
        <Image avatar src={blueP} />
        <SemList.Content>
          <SemList.Header as='a'>{name}</SemList.Header>
          <SemList.Description>           
            Exited at &nbsp;       
            {exit}
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

      {console.log("Let's see ",data,"  ",dataSession," ", dataSesh,"  ",dataPay)}
      <p> </p>
      <Label color='blue' horizontal />

      

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

                
                
                   <Link onClick = {logAway} color="inherit" href="/login">
                          Log out                  </Link>



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
                          startTimer = {iniTimer} stopTimer = {exiTimer}
                          Name = {lotID} Location = "Ottawa"
                          Empty = {emptyP} Full = {fullP} Total = {emptyP+fullP}
                          Address= "123 Lane" Facility  = "Underground" 
                          Capacity = {emptyP+fullP} Electric = "No" Rate = "3"
                            MtFmax = "16" WEmax = "7"/>
                      </Paper>
                    </Grid>
            
                    {/* Current Session */}
                    <Grid item xs={12} md={4} lg={3} >
                      <Paper  >
                          {ListCurrent(user.username) }
                      </Paper>
                    </Grid>

                    {/* Previous Sessions */}
                    <Grid item xs={12}>
                      <Paper className={classes.paper&&classes.newWidth}>
                      {ListToday(user.username)}
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



const ListToday = (username) => (
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
        
        <SemList.Header as='a'>{username}
        
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
        <SemList.Header as='a'>{username}</SemList.Header>
        <SemList.Description>
        Entered at  09:09 AM
        <p>   </p>
        Left at 11:20 AM
        </SemList.Description>
      </SemList.Content>
    </SemList.Item>

  </SemList>
)

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
  newWidth:{
    width: 350,
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
  
export default DashboardUser;
