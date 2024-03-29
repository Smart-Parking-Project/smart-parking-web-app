import React from 'react';
import {gql, useQuery, useMutation} from '@apollo/client'
import clsx from 'clsx';
import { Icon,
    Menu, Label,
    Image,Button,
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

 function DashMap() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const [mapData, setMapData] = React.useState();

  const mutation = gql`

  
    mutation {
        updateParkingSpace(id: "6035c931a1ffe80204b8de3a"
          , parkingSpaceDetails: { isOccupied: true})
          {
            spaceNumber
            isOccupied
          }
        }



  `

  const query = gql`

  query {
    
      getAllParkingSpace {parkingLotIdentifier, spaceNumber, isOccupied,  }
      
    }
  `
    const muData = useMutation(mutation);


  const {loading, data, error} = useQuery(query, {
    pollInterval: 1000,
  });

  if (loading) return <p>Loading Parking Data ...</p>     
  if (error) return `Error! ${error}`; 

  const pSensor = () =>  {

  const  p0 = data.getAllParkingSpace[0].isOccupied
  const  p1 = data.getAllParkingSpace[1].isOccupied
  const  p2 = data.getAllParkingSpace[2].isOccupied
  const p3 = true  
  }
  
  let emptyP = 0;
  let fullP = 0;

  const lotID = data.getAllParkingSpace[0].parkingLotIdentifier;


  
  data.getAllParkingSpace.map( (p) =>  p.isOccupied ? fullP+=1 : emptyP+=1)


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
          Parking Lot Map
          </Typography>


          <Link onClick = {localStorage.clear("token")} color="inherit" href="/login">
                          Log out                  </Link>

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
        <List>{mainListItems("/dash")}</List>
        <Divider />
        <List>{secondaryListItems}</List>
      </Drawer>
      
      <main className={clsx(
        classes.content)}>

        <div className={classes.appBarSpacer} />

        <Container maxWidth="lg" className={classes.container}>

      {/* }
          <Button onClick = { muData[0]}>

          Set true
          </Button>
          
      
          {console.log("Dates")}
          {console.log(new Date().toLocaleString('en-us', { month: 'long' }),
            new Date().getDay().toString(),
          ",",new Date().getFullYear().toString())}

          {console.log(new Date().getHours().toString(),":",new Date().getMinutes().toString(),":"
          ,new Date().getSeconds().toString())}
       */}

          <div>Full Spots:  {fullP}</div> 
          <div>Empty Spots: {emptyP}</div>
          <div>Total Spots: {emptyP+fullP}</div>
          <LotMap admin={false} lotData = {data.getAllParkingSpace}/>
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

  export default DashMap;
