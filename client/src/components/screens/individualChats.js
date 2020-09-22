import React, { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../../App";
import { Link, useParams, useHistory, Redirect } from "react-router-dom";
import { Navbar, Nav, Card, FormControl, Button, Form } from "react-bootstrap";
import "./messages.css";
import Messages from "./messages";
import ScrollToBottom from 'react-scroll-to-bottom';

const ClickOutHandler = require("react-onclickout");

const IndividualChats = () => {
  const { state, dispatch } = useContext(UserContext);
  const [results, setResults] = useState([]);
  const [messages, setMessages] = useState([]);
  const [focusedUser, setFocusedUser] = useState();
  const history = useHistory();
  const textRef = useRef();
  const { userid } = useParams();
  console.log(userid);

  useEffect(() => {

    console.log('load again')
    if (state) {
      state.socket.on('message', function (data) {
        var receivedText = data.message;
        console.log(receivedText)
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
        if (result.length !== 0) {
          setMessages(result[0].user_messages);
        } else {
          setMessages([]);
        }
      });
  }, [userid, state]);

  const send = (e) => {
    const toSend = textRef.current.value;
    e.preventDefault();
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
    state.socket.emit("message", { to: userid, message: toSend, from: state._id });

  };

  const showMessages = () => {
    var texts = "";
    if (messages) {
      texts = messages.map((each) => {
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
      <>
      <ScrollToBottom
      >
        <div className="messageHolder">
          {texts}
        </div>
      </ScrollToBottom>
      <div className = 'sendDiv'>
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

  if (!state) {
    return "loading";
  }

  return (
    <div class="grid-container">
      <Messages />
      <div>{showMessages()}</div>
    </div>
  );
};

export default IndividualChats;
