import React, { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../../App";
import { Link, useHistory, Redirect } from "react-router-dom";
import { Navbar, Nav, Card, FormControl, Button, Form } from "react-bootstrap";
import "./messages.css";
import "./sidebar.css";

import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { IconContext } from 'react-icons';

const Messages = () => {
  const { state, dispatch } = useContext(UserContext);
  const [results, setResults] = useState([]);
  const [chosen, setChosen] = useState([]);
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);

  const divRef = useRef()
  useEffect(() => {
    console.log(divRef)
    if (state) {
      const followings = state.followings;
      fetch("/generatenames", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          ids: followings,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          setResults(result);
        });
    }
  }, [state]);



  const showNames = () => {
    return results.map((each,index) => {
      return (
        <li key={index} className={'nav-text'}>
        <div key={each._id} style={{ marginBottom: '10px' }}
          onClick={() => { setChosen(each._id) }}
        >
          <Link to={"/messages/" + each._id}>

            <img
              src={each.profilePictureUrl}
              alt="profile"
              className="profilePicMini"
            />
            {each.name}

          </Link>
        </div>
        </li>
      );
    });
  };

  if (!state) {
    return "loading";
  }
  else {
 

  

  return(
    <div>


    <div className='sidebar'>
        <FaIcons.FaBars onClick={showSidebar} style = {{color:'black'}} />
    </div>
    <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
      <ul className='nav-menu-items' onClick={showSidebar}>
        <li className='navbar-toggle'>
            <AiIcons.AiOutlineClose />
        </li>
        {showNames()}
      </ul>
    </nav>
    </div>
  )
};
}

export default Messages;
