import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../App";
import { Card, Button, Form, Toast } from 'react-bootstrap'
import Spinners from './spinners'

const Login = () => {
  const { state, dispatch } = useContext(UserContext)
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showLoading, setShowLoading] = useState(false)
  const [hasError, setError] = useState(false)

  const user = JSON.parse(localStorage.getItem('user'))
  if (user) {
    history.push('/')
  }
  const postData = () => {

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      console.log('here')
      setError(["Error", "Invalid email address"])
      return

    }

    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(["Error", data.error])

          history.push('/login')
        } else {
          console.log('logged in')
          setError(["Success", "User logged in"])
          showToast()
          localStorage.setItem('jwt', data.token)
          console.log(data.user)
          localStorage.setItem('user', JSON.stringify(data.user))
          dispatch({ type: "USER", payload: data.user })
          history.push('/')
        }
      })
      .catch((err) => console.log(err));
  };

  const showToast = () => {
    return (
      <Toast onClose={() => setError(false)} delay={3000} autohide>
          <Toast.Header className= {hasError[0]}>
                  <strong className="mr-auto">{hasError[0]}</strong>
        </Toast.Header>
        <Toast.Body>{hasError[1]}</Toast.Body>
      </Toast>)
  }
  if (showLoading) {
    return (<>
      <Spinners/>
    </>)
  }



  return (
    <>
      {hasError ? showToast() : ""}
      <Card className="text-center cards" style={{ maxWidth: '600px', width: '90vw' }}>
        <Card.Body>
          <Card.Title>Instagram</Card.Title>
          <Card.Text>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Control type="email" placeholder="Enter email" value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }} />

              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Control type="password" placeholder="Password" value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }} />
              </Form.Group>


            </Form>


          </Card.Text>
          <Button variant="primary" onClick={() => postData()}>Login</Button>
          <Card.Footer >
            <div style={{ marginBottom: '5px' }}>
              <Link to="/resetpassword">Forgot password</Link>
            </div>

            <Link to="/signup">Register</Link>
          </Card.Footer>
        </Card.Body>
      </Card>

    </>
  );
};

export default Login;
