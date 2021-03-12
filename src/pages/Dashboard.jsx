import React, { useState, useContext } from "react";
import { Image, List, Form, Button, Label,Accordion, Grid } from 'semantic-ui-react'
import { useMutation } from "@apollo/client";
import NumberInput from 'semantic-ui-react-numberinput';
import { Link } from "react-router-dom";
import { ListRounded } from "@material-ui/icons";
import { AUTHENTICATE_USER } from "../graphql/mutations";
import { useForm } from "../util/authHooks";
import { AuthContext } from "../context/auth";
import Lotcard from "../components/DashboardUser/LotCard";



import blueP from '../imgs/blueP.png';




const ListExampleDivided = () => (
  <List divided verticalAlign='middle'>
    <List.Item>
      <List.Content>
        <List.Header as='a'>Carleton University P1</List.Header>
      </List.Content>
    </List.Item>
    <List.Item>
      <Image avatar src='https://react.semantic-ui.com/images/avatar/small/stevie.jpg' />
      <List.Content>
        <List.Header as='a'>Carleton University P1</List.Header>
      </List.Content>
    </List.Item>
    <List.Item>
      <Image avatar src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />
      <List.Content>
        <List.Header as='a'>Hospital Lane</List.Header>
      </List.Content>
    </List.Item>
  </List>
)


const ButtonE = () => (
  <Button.Group>
    <Button>30m</Button>
    <Button.Or />
    <Button positive>1hr</Button>
  </Button.Group>
)



function Dashboard() {
  const { user } = useContext(AuthContext);
  
  return (

    

    <div>

      <h1>Find and select a parking lot below</h1>
      <Lotcard admin = "false"
            Name = "Carleton University P1" Location = "Ottawa"
            Empty = "2" Full = "5" Total = "7"
            Address= "123 Lane" Facility  = "Underground" 
            Capacity = "5" Electric = "No" Rate = "3"
              MtFmax = "16" WEmax = "7"/>

    </div>

  

  );
}

function Dash(props) {
  <List divided verticalAlign='middle'>
    <List.Item>
      <Image avatar src='https://react.semantic-ui.com/images/avatar/small/daniel.jpg' />
      <List.Content>
        <List.Header as='a'>Carleton University P1</List.Header>
      </List.Content>
    </List.Item>
    <List.Item>
      <Image avatar src='https://react.semantic-ui.com/images/avatar/small/stevie.jpg' />
      <List.Content>
        <List.Header as='a'>Carleton University P1</List.Header>
      </List.Content>
    </List.Item>
    <List.Item>
      <Image avatar src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />
      <List.Content>
        <List.Header as='a'>Hospital Lane</List.Header>
      </List.Content>
    </List.Item>
  </List>
}


export default Dashboard;
