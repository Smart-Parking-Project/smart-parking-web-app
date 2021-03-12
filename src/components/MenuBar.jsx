import React, { useState, useContext } from "react";
import { Menu, Dropdown, Icon, Sidebar, 
  Segment, Header, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";

import SideBarItem from "./SideBarItem";

import DashboardAdmin from "../pages/DashboardAdmin"

import Lotcard from "./DashboardUser/LotCard";

function MenuBar() {
  const { user, logout } = useContext(AuthContext);
  const { pathname } = window.location;
  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => setActiveItem(name);


  const [visible, setVisible] = useState(false);
  



  



  const menuBar = user ? (

    

    <div>

     
     
     <Menu inverted pointing secondary size="massive" color="blue">

      
      
      <Menu.Item onClick={() => setVisible(prevVisible => prevVisible - 1)}> 
        <Icon name="sidebar" /> 
      </Menu.Item>



             


      <Menu.Item name={user.username} active as={Link} to="/Dashboard" />

      
      
        <Menu.Menu position="right">

          <Menu.Item icon='settings' active as={Link} to="/AccountSettings"/>
        
        <Menu.Item name="logout" onClick={logout} as={Link} to="/" />
        

      </Menu.Menu>

      

      {/*
      <Menu borderless vertical stackable fixed='left' className='side-nav'>
      <SideBarItem highlight='true'  label='Home' icon='home'/>
      <SideBarItem label='Trending' icon='fire'/>
      <SideBarItem label='Followers' icon='spy'/>
      <SideBarItem label='History' icon='history'/>
      <SideBarItem label='Watch later' icon='clock'/>
      <SideBarItem label='Liked videos' icon='thumbs up'/>
      <SideBarItem label='Movies and Shows' icon='film'/>
      <SideBarItem label='Report history' icon='flag'/>
      <SideBarItem label='Help' icon='help circle'/>
      <SideBarItem label='Send feedback' icon='comment'/>
      </Menu>

      */}
     </Menu>

  

      <Sidebar.Pushable as={Segment}>
          <Sidebar
            as={Menu}
            size = 'huge'
            animation='push'
            icon='labeled'
            inverted
            onHide={() => setVisible(false)}
            vertical
            visible={visible}
            width='thin'
            
          >
            <Menu.Item as='a' >
             
              Home
            </Menu.Item>
            <Menu.Item as='a'>
             
              Sales
            </Menu.Item>
            <Menu.Item as='a'>
              
              Customers
            </Menu.Item>
          </Sidebar>

          <Sidebar.Pusher dimmed={visible}>
          <Segment placeholder>

              <DashboardAdmin visible = {visible}/>
              
           </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>

    </div>

    
  ) : (

    <Menu pointing secondary size="massive" color="blue">
      <Menu.Item
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />

      <Menu.Menu position="right">
        <Menu.Item
          name="login"
          active={activeItem === "login"}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
        <Menu.Item
          name="register"
          active={activeItem === "register"}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
      </Menu.Menu>
    </Menu>




    

  );

  return menuBar;
}

export default MenuBar;
