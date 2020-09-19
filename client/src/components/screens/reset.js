import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { Card, Form, Button, Toast } from "react-bootstrap";

const Reset = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const user = JSON.parse(localStorage.getItem('user'))
  const [hasError, setError] = useState(false)

  if (user) {
    history.push('/')
  }
  const postData = () => {
    console.log(email);
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setError(["Error", "Invalid email address"])
      return;
    }

    fetch("/resetpassword", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(["Error", data.error])
        } else {
          setError(["Success", "Instructions sent to your mailbox"])

        }
      })
      .catch((err) => console.log(err));
  };

  const showToast = () => {
    return (
      <Toast onClose={() => {
        setError(false); history.push('/login')
      }} delay={3000} autohide>
          <Toast.Header className= {hasError[0]}>
                  <strong className="mr-auto">{hasError[0]}</strong>
        </Toast.Header>
        <Toast.Body>{hasError[1]}</Toast.Body>
      </Toast>)
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
                <Form.Control type="email" placeholder="Enter email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }} />

              </Form.Group>


            </Form>


          </Card.Text>
          <Button variant="primary" onClick={() => postData()}>Send an email</Button>
          <Card.Footer >
            <div>
              <Link to="/login">Login</Link>
            </div>




          </Card.Footer>
        </Card.Body>
      </Card>
    </>

  );
};

export default Reset;
