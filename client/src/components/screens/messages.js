import React, { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../../App";
import { Link, useHistory, Redirect } from "react-router-dom";
import { Navbar, Nav, Card, FormControl, Button, Form } from "react-bootstrap";
import "./messages.css";

const Messages = () => {
  const { state, dispatch } = useContext(UserContext);
  const [results, setResults] = useState([]);

  useEffect(() => {
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
    return results.map((each) => {
      return (
        <div key={each._id}>
          <Link to={"/messages/" + each._id}>
            <div>
              <img
                src={each.profilePictureUrl}
                alt="profile"
                className="profilePicMini"
              />
              {each.name}
            </div>
          </Link>
        </div>
      );
    });
  };

  if (!state) {
    return "loading";
  }
  else
  {
    return <div>{showNames()}</div>;

  }
};

export default Messages;
