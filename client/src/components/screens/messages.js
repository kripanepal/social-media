import React, { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../../App";
import { Link, useHistory, Redirect } from "react-router-dom";
import { Navbar, Nav, Card, FormControl, Button, Form } from "react-bootstrap";
import "./messages.css";
import "./sidebar.css";
import Spinners from './spinners'

import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { IconContext } from 'react-icons';

const Messages = (props) => {
  const { state, dispatch } = useContext(UserContext);
  const [results, setResults] = useState([]);
  const [chosen, setChosen] = useState([]);
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const hideSidebar = () => setSidebar(false);
  const ClickOutHandler = require("react-onclickout");

  const divRef = useRef()
  useEffect(() => {
    if(!props.userInfo)
    {
      setSidebar(true)
    }
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
    return results.map((each, index) => {
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
    return <Spinners/>;
  }
  else {



    return (
      <ClickOutHandler onClickOut={
        hideSidebar
      }>
        <div>


          <div className='sidebar'>
            <FaIcons.FaBars className = 'sideMenu' onClick={showSidebar} style={{ color: 'black' }} />
            {props.userInfo? <div class="header">
              <img src={props.userInfo.profilePictureUrl} width='60px'
                style={{ borderRadius: '50%', marginLeft: '20px' }} />
              {" "}
              <Link to={'/profile/'}>
                <span style = {{marginRight:'10px'}}>
                {props.userInfo.name}

                </span>
              </Link>
            </div>:null}
           

          </div>

          <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
            <span className='nav-menu-items' onClick={showSidebar}>

              {showNames()}
            </span>
          </nav>
        </div>
      </ClickOutHandler>

    )
  };
}

export default Messages;
