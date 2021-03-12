import React, { useState, useContext, proptypes } from "react";
import { Image, List, Form, Button, Label,Accordion,
   Container,Item,Header, Tab, Input } from 'semantic-ui-react'
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth";

import useTimer from '../../hook/useTimer';











function Lotcard(props) {
  const [frontSide, setFrontSide] = useState(true);
  const [timerText, setTimerText] = useState("Enter Now"); 
  const info = props;
  const { timer, handleStart, isActive, isPaused, handlePause } = useTimer(0)


  const formatTime = () => {
    const getSeconds = `0${(timer % 60)}`.slice(-2)
    const minutes = `${Math.floor(timer / 60)}`
    const getMinutes = `0${minutes % 60}`.slice(-2)
    const getHours = `0${Math.floor(timer / 3600)}`.slice(-2)
  
    return `${getHours} : ${getMinutes} : ${getSeconds}`
  }

  const changeTimerText = (text) => { 

    const timerT = text === "Enter Now" ? "Exit" : "Enter Now";
    setTimerText(timerT);
    handleStart()
  }

  
  const rootPanels = () => [


    { key: 'panel-1', title: 'Enter Lot', 
      content: { content: <div>

        {!isActive && !isPaused ?
          <Button primary onClick={() => {handleStart(); info.startTimer();}}>Enter Now</Button>
          : (
           <div>

          <Button primary onClick={() => {handlePause(); info.stopTimer();}}>Exit</Button>
           <p>{formatTime(timer)}</p>

          </div>
          )

        }

        
      </div>
      }
    }
   
  ]


  
  
  

  const PayPanelsContent =() => (
    <div>
      <Accordion.Accordion panels={rootPanels()} />
    </div>
  )

  
  

  return (

  

    <div >

      <List className = 'List' divided verticalAlign='middle'>
        
        <List.Item key='CU P1' >   
        
        
        <Label >

           <Label  as={Link} color='blue' ribbon  to= {info.admin? "/mapAdmin" : "/map"}>
              Map</Label> 
           
          
          
          <Label  inverted as={Link}
                  color ="black" onClick={()=> setFrontSide(!frontSide) } >
                     {info.Name} </Label>  

          

          <List.Content >
          <p>   </p> 

          { frontSide ? <div> 

            Location: 
            <Label> {info.Location}</Label> 
            <p>   </p>
          

           
           <Label>Spots</Label>
          
           

           <Button.Group >
            <Button  color='green' animated='fade' size='mini'>
              <Button.Content visible >{info.Empty}</Button.Content>
              <Button.Content hidden>Empty</Button.Content>
            </Button>
            <Button  color='red' animated='fade' size='mini'>
              <Button.Content visible >{info.Full}</Button.Content>
              <Button.Content hidden>Full</Button.Content>
            </Button>
            <Button basic color='blue' animated='fade' size='medium'>
              <Button.Content visible >{info.Total}</Button.Content>
              <Button.Content hidden>Total</Button.Content>
            </Button>
            </Button.Group>
           
            <p>   </p>

            {info.admin ? 

              ''
                
             : 
              
             

              <Accordion panels={rootPanels()}  />
              
              
              

              }
            



          </div> : <div>


          <Input  size='big' transparent = {!info.admin} readOnly={!info.admin}
           fluid label='Location:' defaultValue={info.Location}  />
          

          <Input  size='big' transparent = {!info.admin} readOnly={!info.admin} 
            fluid label='Address:' defaultValue={info.Address}  />

          
          <Input  size='big' transparent = {!info.admin} readOnly={!info.admin} 
                  fluid label='Facility Type: ' defaultValue={info.Facility}  />



          <Input  size='big' transparent = {!info.admin} readOnly={!info.admin}
           fluid label='Capacity: ' defaultValue={info.Capacity}  />



          <Input  size='big' transparent = {!info.admin} readOnly={!info.admin} 
                  fluid label='Electric Stations: ' defaultValue={info.Electric}  />



          <h2 color ='blue'>Rate Information  </h2>

          <p1 >Hourly Rate:</p1>
         

           <Input  readOnly={!info.admin}  fluid
              defaultValue={info.Rate} labelPosition='right' type='text' placeholder='Rate'>
            <Label basic>$</Label>
            <input />
            <Label color ='black'>per half hour</Label>
          </Input>

          <Input  size='large' transparent = {!info.admin} readOnly={!info.admin} fluid  
                width ={4} label='Weekday Maximum Hours: ' defaultValue={info.MtFmax}  />


          <Input  size='large' transparent = {!info.admin} readOnly={!info.admin} 
                   label='Weekend Maximum Hours: ' defaultValue={info.WEmax}  />

           {info.admin && <Label display = {info.admin} as='a' color='red' tag>  Save   </Label>}

           

          </div> }
              
            

        
          
          
        </List.Content>
        </Label>
           
      </List.Item>
    
    
     </List>

      

  
    </div>

  );
}

export default Lotcard;