/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";

import {gql, useQuery} from '@apollo/client'

import _, { intersectionBy } from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";

const ResponsiveReactGridLayout = WidthProvider(Responsive);




export default class LotMap extends React.Component {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    className: "layout",
    rowHeight: 30,
    onLayoutChange () {},
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    layout: {i: String, x: Number, y: Number, w: Number, h: Number,
       isResizable: Boolean, isEmpty: Boolean}

  };

  

  constructor(props) {
    super(props);

    const data = props;

    console.log("Dee",data);

    const initialT = [

      { i: (data.lotData[0].spaceNumber-1).toString(), x: 2, y: 0, w: 1, h: 6, 
        isResizable: false,
         isDraggable: data.admin, 
      static: data.lotData[0].isOccupied},

      { i: (data.lotData[1].spaceNumber-1).toString(), x: 3, y: 0, w: 1, h: 6, 
        isResizable: false,
          isDraggable: data.admin, 
      static: data.lotData[1].isOccupied},

      { i: (data.lotData[2].spaceNumber-1).toString(), x: 2, y: 6, w: 1, h: 6 , 
        isResizable: false, 
        isDraggable: data.admin, 
      static: data.lotData[2].isOccupied},
      
      { i: (data.lotData[3].spaceNumber-1).toString(), x: 3, y: 6, w: 1, h: 6 , 
        isResizable: false, 
        isDraggable: data.admin, 
      static: data.lotData[3].isOccupied},
    ];
    
    console.log("Dataa ", data );


    this.state = {
      newCounter: data.lotData.length,
      roadCount: 0,
      gateCount: 0,
      layouts: initialT,
      admin: data.admin
    };

   

    console.log("Initial", `${  this.state.newCounter}`);
    console.log("State ", `${  this.state}`);
    console.log("length ", `${  data.lotData.length}`);
  }


  componentDidUpdate = (prevProps) => {
/*
    console.log("comp did update ");
    console.log(this.props, "  previous: ", prevProps);
    */
    // Typical usage (don't forget to compare props):
    if (prevProps && 
      prevProps.lotData !== this.props.lotData) {

        
      this.onOccupancyChange(this.props, this.state.layouts);
    
    }
    
  }
 

   initialize= (props) =>{ 
      const data = props;
      /*
      console.log("DATA2 IS HEREEEEE");

      console.log(data);
     */
    const initial = [

    { i: (data.layouts[0].i).toString(), x: 0, y: 2, w: 1, h: 6, 
      isResizable: false,
       isDraggable: data.admin, 
    static: data.layouts[0].static},
    { i: (data.layouts[1].i).toString(), x: 0, y: 3, w: 1, h: 6, 
      isResizable: false,
        isDraggable: data.admin, 
    static: data.layouts[1].static},

    { i: (data.layouts[2].i).toString(), x: 6, y: 2, w: 1, h: 6 , 
      isResizable: false, 
      isDraggable: data.admin, 
    static: data.layouts[2].static},

    { i: (data.layouts[3].i).toString(), x: 6, y: 3, w: 1, h: 6 , 
      isResizable: false, 
      isDraggable: data.admin, 
    static: data.layouts[3].static},
    
  ];
  return initial;

  }

  

  onOccupancyChange = (newProps, currentState) => {

  

    const newLayouts = currentState;
   

    const newData = newProps.lotData.map((p) =>  ({i: p.spaceNumber.toString(), 
        x: 2, y: 3, w: 1, h: 6,
        isResizable: false,isDraggable: false,  static: p.isOccupied}));

      
      

           
        newProps.lotData.map( (p) => 
 
          newLayouts[p.spaceNumber-1].static = p.isOccupied
 
        );
            
    this.setState({ layouts: newLayouts});

  }

  onLayoutChange = (layouts) => {
    this.setState({ layouts });
  }


   onAddSpaceHorizontal = () => {
    console.log("adding", `p${  this.state.newCounter}`);

    this.setState((prevState) => ({
      layouts: prevState.layouts.concat({
        i: prevState.newCounter.toString(),
        x: Infinity,
        y: Infinity, // puts it at the bottom
        w: 2,
        h: 3,
        minW: 2,
        maxW: 2,
        minH: 3,
        maxH: 3,
        isResizable: false,
        isEmpty: true
      }),
      newCounter: prevState.newCounter + 1
    }));
  };

   onAddSpaceVertical = () => {
    console.log("adding", `p${  this.state.newCounter}`);
    console.log("STate ", `p${  this.state}`);
    this.setState((prevState) => ({
      // Add a new item. It must have a unique key!
      layouts: prevState.layouts.concat({
        
        i:  prevState.newCounter.toString(),
        x: Infinity,
        y: Infinity, // puts it at the bottom
        w: 1,
        h: 6,
        minW: 1,
        maxW: 1,
        minH: 6,
        maxH: 6,
        isResizable: false,
        isEmpty: true
      }),
      newCounter: prevState.newCounter + 1,
      
    }));

    console.log(this.state);
    
  };


   onAddRoad = () => {
    console.log("adding", `road${  this.state.roadCount}`);
    this.setState((prevState) => ({
      // Add a new item. It must have a unique key!
      layouts: prevState.layouts.concat({
        i: `R${  prevState.roadCount}`,
        x: Infinity,
        y: Infinity,
        w: 1,
        h: 1
      }),
      roadCount: prevState.roadCount + 1
    }));
  };

  onAddGate = () => {
    console.log("adding", `gate${  this.state.roadCount}`);
    this.setState((prevState) => ({
      // Add a new item. It must have a unique key!
      layouts: prevState.layouts.concat({
        i: `Gate${  prevState.gateCount}`,
        x: Infinity,
        y: Infinity,
        w: 1,
        h: 1,
        
      }),
      gateCount: prevState.gateCount + 1
    }));
  };



  onRemoveItem= (i) => {
    console.log("removing", i);
    this.setState((prevState) => ({ layouts: _.reject(prevState.layouts, { i}) }));
  }

  

  createElement = (el) =>{

    const removeStyle = {
      position: "absolute",
      right: "2px",
      top: 0,
      cursor: "pointer"
    };

    const spaceStyle={
      empty: "react-grid-item",
      full: "react-grid-item-Full"

    }


     const spaceColor= (el.isEmpty ? spaceStyle.empty : spaceStyle.full)
      
    const i = el.add ? "+" : el.i;
    const row= el.y > 5 ? "B" : "A";
    const secondId = el.i>1? el.i-2:el.i;

    return (
      <div key={i} data-grid={el}  >
        <div className="text">Level 1</div>
        

        <div className="text">{row} {secondId}</div>
       
        {this.state.admin &&
        <span
          className="remove"
          style={removeStyle}
          onClick={this.onRemoveItem.bind(this, i)}
        >
          x
        </span>
        }
      
      </div>

    );
  }

  

  render(){


  
    return (
      <div> 
          
        {this.state.admin &&
          <div> 
          <p> </p>
          <button type="button" onClick={this.onAddSpaceVertical}>
            Add Vertical Parking Space
          </button>
          <button type="button" onClick={this.onAddSpaceHorizontal}>
            Add Horizontal Parking Space
          </button>
          <button type="button" onClick={this.onAddRoad}>Add Road</button>
          <button type="button" onClick={this.onAddGate}>Add Gate</button>
          <p> </p>
          </div>
        }
        <div>

        <ResponsiveReactGridLayout 
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...this.props}
          layouts = {this.state.layouts}
          onBreakpointChange={this.onBreakpointChange}
          className="layout"
          onLayoutChange={this.onLayoutChange}
          compactType="null"
          preventCollision 
          autoSize={false}
          breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
           cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
        >
          
          {_.map(this.state.layouts, el => this.createElement(el))}
        </ResponsiveReactGridLayout>
        </div>
      </div>
    );
    
  }
}


   

  
  
  




