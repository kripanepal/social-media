import React, { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../../App";
import { Link, useParams, useHistory, Redirect } from "react-router-dom";
import { Navbar, Nav, Card, FormControl, Button, Form } from "react-bootstrap";
import "./messageSideBar.css";
import MessageSideBar from "./messageSideBar";
import ScrollToBottom from 'react-scroll-to-bottom';
import Spinners from './spinners'

const IndividualChats = () => {
  const { state, dispatch } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState([]);
  const [messages, setMessages] = useState([]);
  const [focusedUser, setFocusedUser] = useState();
  const [messageId, setMessageId] = useState();

  const history = useHistory();
  const textRef = useRef();
  const { userid } = useParams();



  useEffect(() => {
    fetch("/generatenames", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        ids: userid,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setUserInfo(result[0]);
      });
  }, [userid]
  )


  useEffect(() => {
    fetch("/fetchMessages", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        id: userid,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result)

        if (result) {
          setMessageId(result._id)
          setMessages(result.user_messages);
        } else {
          setMessages([]);
        }
      });
  }, [state, userid]);

  useEffect(() => {
    if (state) {
      state.socket.on('message', function (data) {
        var receivedText = data.message;
        if(data.to===userid)
        setMessages((pre) => {
          const newMessage = {
            date: Date.now(),
            from: data.from,
            to: data.to,
            text: receivedText,
          };
          return [...pre, newMessage];
        });
      });
    }
  }, [state])

  const send = (e) => {
    const toSend = textRef.current.value;
    e.preventDefault();
    if (!toSend || toSend === '') {
      return

    }

    textRef.current.value = "";
    fetch("/savemessage", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        toId: userid,
        toSend,
      }),
    })
    setMessages((pre) => {
      const newMessage = {
        date: Date.now(),
        from: state._id,
        to: focusedUser,
        text: toSend,
      };
      return [...pre, newMessage];
    });
    textRef.current.focus()

    state.socket.emit("message", { to: userid, message: toSend, from: state._id });

  };


  const showMessages = () => {
    var texts = "";
    if (messages) {
      texts = messages.map((each,i) => {
        return (
          <div key={i}>

            <div className={each.from === state._id ? "self" : "other"}>
              {each.from === state._id ?
                null :
                <img src={userInfo.profilePictureUrl} width='40px' style={{ borderRadius: '50%' }} />
              }
              {' '}
              <span

                className={
                  each.from === state._id ? "selfMessage" : "otherMessage"
                }
              >
                {each.text}
              </span>
            </div>
          </div>
        );
      });
    }

    return (
      <>


        <ScrollToBottom
        >
          <div className="messageHolder">
            {texts}
          </div>
        </ScrollToBottom>
        <div className='sendDiv'>
          <form onSubmit={(e) => send(e)} className="messageForm">
            <input type="text" ref={textRef} className="messageInput" />
            {"  "}
            <Button varient="primary" type="submit">
              Send
          </Button>
          </form>
        </div>
      </>
    );
  };

  const markUnread = () => {
    console.log('here')
    fetch("/unread", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        id: messageId,
      }),
    })
    history.push('/messages')
  }

  if (!state) {
    return (<Spinners />);
  }

  return (
    <>

      <div class="grid-container">
        <div className='sidebarDiv'><MessageSideBar userInfo={userInfo} markUnread={markUnread} /></div>

        <div style={{ marginLeft: '10px', marginRight: '10px' }}>{showMessages()}</div>
      </div>
    </>
  );
};

export default IndividualChats;
