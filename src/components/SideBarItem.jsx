import React from 'react';
import {Icon, Menu} from "semantic-ui-react";

export function SideBarItem(props) {

    const edit = props;
  // React will ignore custom boolean attributes, therefore we pass a string
  // we use this attribute in our SCSS for styling
  const highlight = edit.highlight ? 'highlight-item' : null;
  return (
      <Menu.Item className={['sidebar-item', highlight].join(' ')}>
        <div className='sidebar-item-alignment-container'>
          <span><Icon size='large' name={edit.icon}/> </span>
          <span>{edit.label}</span>
        </div>
      </Menu.Item>
  );
}

export default SideBarItem;