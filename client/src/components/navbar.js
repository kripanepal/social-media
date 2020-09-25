import React, { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../App";
import { Link, useHistory } from "react-router-dom";
import { Navbar, Nav, Card, FormControl, Button, Form,Modal } from "react-bootstrap";
const ClickOutHandler = require("react-onclickout");

const NavBar = () => {

  const { state, dispatch } = useContext(UserContext);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);  const [result, setResult] = useState([]);
  const history = useHistory();
  const searchInput = useRef();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      console.log(history.location.pathname);

      dispatch({ type: "USER", payload: user });
    } else {
      console.log(history.location.pathname);
      if (
        !(
          history.location.pathname.startsWith("/reset") ||
          history.location.pathname.startsWith("/signup")
        )
      ) {
        history.push("/login");
      }
    }
  }, [history,dispatch]);

  const handleSearch = (text) => {
    if (text&& text.length >= 2) {
      fetch(`/search/${text}`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
        .then((result) => {
          setResult(result);
        });
    } else {

      setResult([]);
    }
  };

  const format = () => {
    return result.map((each) => {
      return (
        <div
          key={each._id}
          onClickOut={() => {
            searchInput.current.value = "";
            setResult([]);
          }}
        >
          <Card>
            <Link
              to={`/profile/${each._id}`}
              onClick={() => {
                searchInput.current.value = "";
                setResult([]);
              }}
            >
              <img
                src={each.profilePictureUrl}
                alt="profile"
                className="profilePicMini"
              />
              {"  " + each.name}
            </Link>
          </Card>
        </div>
      );
    });
  };

  

  const showModel = () =>
  {

    return (   <Modal show={show} onHide={handleClose} animation={true}>
      <Modal.Header closeButton>
        <Modal.Title>Log out</Modal.Title>
      </Modal.Header>
      <Modal.Body>Do you want to log out?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => {
          handleClose()
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/login");
            }}>
          Yes
        </Button>
        <Button variant="primary" onClick={handleClose}>
          No
        </Button>
      </Modal.Footer>
    </Modal>)
  }

  const renderList = () => {
    if (state) {
      return (
        <>
          <Nav.Link href="/profile">Profile</Nav.Link>
          <Nav.Link href="/followedposts">Followed users</Nav.Link>
          <Nav.Link href="/messages">Messages</Nav.Link>
          <Nav.Link href="/createpost">Create a post</Nav.Link>

          <Nav.Link
           
            className="btn"
          >
           <Button  onClick={handleShow} variant="danger">
           Log out
             </Button> 
          </Nav.Link>
        </>
      );
    } else {
      return (
        <>
          <Nav.Link href="/login">Login</Nav.Link>
          <Nav.Link href="/signup">Sign up</Nav.Link>
        </>
      );
    }
  };
  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="light" sticky="top">
        <Navbar.Brand href="/">Insta</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">{renderList()}</Nav>
          {state ? (
            <Form inline>
              <FormControl
                type="text"
                placeholder="Search"
                ref={searchInput}
                className="mr-sm-2"
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            </Form>
          ) : null}
        </Navbar.Collapse>
      </Navbar>
      <div className = 'holder'>
        {state ?<div   className="searchResults">
            <ClickOutHandler 
          onClickOut={() => {
            searchInput.current.value = "";
            setResult([])}}
      >{format()}</ClickOutHandler> 
        </div> : null}
        {showModel()}
      </div>
    </>
  );
};

export default NavBar;
