import React, { useState, useEffect ,useCallback} from "react";
import { Link, useHistory } from "react-router-dom";
import { Card, Form, Button,Toast } from "react-bootstrap";
import Spinners from './spinners'

const Signup = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [profilePictureUrl, setprofilePictureUrl] = useState(null);
  const [image, setImage] = useState();
  const [hasError, setError] = useState(false)

  const user = JSON.parse(localStorage.getItem('user'))
  if (user) {
    history.push('/')
  }
  const [showLoading, setShowLoading] = useState(false)
  const upload = useCallback(() => {
    // eslint-disable-next-line
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setError(["Error", "Invalid email address"])
      setShowLoading(false)
      return;
    }
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        password,
        email,
        profilePictureUrl
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(["Error", data.error,'/signup'])
        } else {
          setError(["Success", "User Registered. please log in",'/login'])
        }
      })
      .catch((err) => console.log(err));
  },[email,name,password,profilePictureUrl])
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (profilePictureUrl) {
      setShowLoading(true)
      upload()
    }
  }, [profilePictureUrl,upload])


  const postData = () => {
  if(!name||!email||!password)
  {
    setError(["Error", "please include all the fields"])

    return
  }

    if (image) {
      setShowLoading(true)

      uploadProfilePicture()
    }

    else {
      setShowLoading(true)

      upload()
    }
  }

  const showToast = () => {
    return (
      <Toast onClose={() => {setError(false);
      if(hasError[2])
        {
          setShowLoading(false)
          history.push(hasError[2])
        }
      }} delay={3000} autohide>
          <Toast.Header className= {hasError[0]}>
                  <strong className="mr-auto">{hasError[0]}</strong>
        </Toast.Header>
        <Toast.Body>{hasError[1]}</Toast.Body>
      </Toast>)
  }

  const uploadProfilePicture = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "denpmf1qv");
    fetch(`	https://api.cloudinary.com/v1_1/denpmf1qv/image/upload`, {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then(data => {
        console.log(data)
        setprofilePictureUrl(data.url);
        console.log(profilePictureUrl);
      })
      .catch((err) => console.log(err));
  };
  if (showLoading) {
    return (<>
      {hasError ? showToast() : <Spinners/>}
    </>)
  }

  return (
    <Card className="text-center cards" style={{ maxWidth: '600px',width:'90vw' }}>
            {hasError ? showToast() : ""}
      <Card.Body>
        <Card.Title>Instagram</Card.Title>
        
          <Form>
            <Form.Group controlId="formBasicName">
              <Form.Control type="input" placeholder="Enter your name" value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }} />
            </Form.Group>
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
            <Form.Group style={{ textAlign: 'left' }}>
              <Form.File id="exampleFormControlFile1" label="Profile Picture"
                accept="image/*"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                }} />
            </Form.Group>
          </Form>
        
        <Button variant="primary" onClick={() => postData()}>Register</Button>
        <Card.Footer >
          <Link to="/login">Already have an account?</Link>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};

export default Signup;
