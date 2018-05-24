import React from 'react';
import { Dropdown } from 'semantic-ui-react';

const FriendsDropDown = (props) => (
  <Dropdown className='dropdown-friends' placeholder='Select Friend' search selection options={props.friends} onChange={(e, data) => props.updateFriendsPage(data.options[data.value])}/>
)

export default FriendsDropDown;