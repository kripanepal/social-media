import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { Link} from "react-router-dom";

import "./messageSideBar.css";
import Spinners from './spinners'

import * as FaIcons from 'react-icons/fa';


const MessageSideBar = (props) => {
  const { state } = useContext(UserContext);
  const [results, setResults] = useState([]);
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const hideSidebar = () => setSidebar(false);
  const ClickOutHandler = require("react-onclickout");

  useEffect(() => {
    if (!props.userInfo) {
      setSidebar(true)
    }

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
  }, [state,props.userInfo]);



  const showNames = () => {
    return results.map((each, index) => {
      return (
        <li key={index} className={'nav-text'}>
          <div key={each._id} style={{ marginBottom: '10px' }}
          >
            <Link to={"/messages/" + each._id}>

              <img
                src={each.profilePictureUrl}
                alt="profile"
                className="profilePicMini"
              />
              <span style={{ color: 'rgb(42 226 218)' }}>{each.name}
              </span>

            </Link>
          </div>
        </li>
      );
    });
  };

  if (!state) {
    return <Spinners />;
  }
  else {



    return (
      <ClickOutHandler onClickOut={
        hideSidebar
      }>
        <div>


          <div className='sidebar'>
            <FaIcons.FaBars className='sideMenu' onClick={showSidebar} style={{ color: 'black' }} />
            {props.userInfo ? <div className="header">
              <img src={props.userInfo.profilePictureUrl} width='60px'
                style={{ borderRadius: '50%', marginLeft: '20px' }} alt ={'friend'} />
              {" "}
              <Link to={'/profile/'}>
                <span style={{ marginRight: '10px' }}>
                  {props.userInfo.name}

                </span>
              </Link>
            </div> : null}


          </div>

          <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
            <span className='nav-menu-items' onClick={showSidebar}>
              {props.markUnread ? <div className={'markAsUnread'}
                onClick={() => props.markUnread()}>
                Mark as unread</div> :
                <div className={'markAsUnread'}>
                  Select a user
                      </div>}

              {showNames()}
            </span>
          </nav>
        </div>
      </ClickOutHandler>

    )
  };
}

export default MessageSideBar;
