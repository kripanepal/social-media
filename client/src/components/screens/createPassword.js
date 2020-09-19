import React, { useState, useContext } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { UserContext } from "../../App";
import { Card, Form, Button, Toast } from "react-bootstrap";

const UpdatePassword = () => {
  const { state, dispatch } = useContext(UserContext)
  const history = useHistory();
  const [password, setPassword] = useState("");
  const { token } = useParams()
  const [hasError, setError] = useState(false)

  const postData = () => {


    fetch("/updatepassword", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newPassword: password, token
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(["Error", data.error])
        } else {
          setError(["Success", data.message])
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

    <Card className="text-center cards" style={{ maxWidth: '600px', width: '90vw' }}>
      {hasError ? showToast() : ""}

      <Card.Body>
        <Card.Title>Instagram</Card.Title>
        <Card.Text>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Control type="password"
                placeholder="Enter a new password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }} />

            </Form.Group>


          </Form>


        </Card.Text>
        <Button variant="primary" onClick={() => postData()}>Change password</Button>
        <Card.Footer >
          <div>
            <Link to="/login">Register</Link>
          </div>




        </Card.Footer>
      </Card.Body>
    </Card>


  );
};

export default UpdatePassword;
