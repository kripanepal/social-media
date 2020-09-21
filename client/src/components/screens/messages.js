import React, { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../../App";
import { Link, useHistory, Redirect } from "react-router-dom";
import { Navbar, Nav, Card, FormControl, Button, Form } from "react-bootstrap";
import "./messages.css";
import io from "socket.io-client";

const ClickOutHandler = require("react-onclickout");

const Messages = () => {
  const { state, dispatch } = useContext(UserContext);
  const [results, setResults] = useState([]);
  const [messages, setMessages] = useState([]);
  const [focusedUser, setFocusedUser] = useState();

  const ENDPOINT = "localhost:5000";
  let socket = io(ENDPOINT);
  const history = useHistory();
  const textRef = useRef();



  useEffect(() => {
    socket.on('private',(data)=>
    {
      console.log('=========')
    })
    if (state) {
      const followings = state.followings;
      console.log(followings);
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

  const fetchMessages = (id) => {
    setFocusedUser(id);
    console.log("here");
    fetch("/fetchMessages", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.length !== 0) {
          console.log(result);
          setMessages(result[0].user_messages);
        } else {
          setMessages([]);
        }
      });
  };
  const send = (e) => {
    e.preventDefault();
    const toSend = textRef.current.value;
    textRef.current.value = "";

    socket.emit('msg',{to:focusedUser,msg:toSend})
    fetch("/savemessage", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        toId: focusedUser,
        toSend,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
      });
    setMessages((pre) => {
      console.log(pre);
      const newMessage = {
        date: Date.now(),
        from: state._id,
        to: focusedUser,
        text: toSend,
      };
      return [...pre, newMessage];
    });
  };

  const showNames = () => {
    return results.map((each) => {
      return (
        <Card key={each._id}>
          <div onClick={() => {
               
            
            fetchMessages(each._id)}}>
            <img
              src={each.profilePictureUrl}
              alt="profile"
              className="profilePicMini"
            />
            {each.name}
          </div>
        </Card>
      );
    });
  };

  const showMessages = () => {
    var texts = "";
    if (messages) {
      texts = messages.map((each) => {
        console.log(each);
        return (
          <div>
            <div className={each.from === state._id ? "self" : "other"}>
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
      <div className="messageHolder">
        {texts}

        <form onSubmit={(e) => send(e)} className="messageForm">
          <input type="text" ref={textRef} className="messageInput" />
          {"  "}
          <Button varient="primary" type="submit">
            Send
          </Button>
        </form>
      </div>
    );
  };

  if (!state) {
    return "loading";
  }
  return (
    <div class="grid-container">
      <div>{showNames()}</div>
      <div>{showMessages()}</div>
    </div>
  );
};

export default Messages;
