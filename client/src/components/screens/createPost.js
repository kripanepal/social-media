import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Form, Toast } from 'react-bootstrap'
import { UserContext } from "../../App";
import imagePlaceholder from '../imagePlaceHolder.jpg'
import Spinners from './spinners'
const CreatePost = (props) => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState();
  const [url, setUrl] = useState();
  const [showLoading, setShowLoading] = useState(false)
  const [hasError, setError] = useState(false)
  const { state } = useContext(UserContext)
  const ref = useRef();
const fetchData = props.fetchData

// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (url || title) {

      setShowLoading(true)
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          picUrl: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(["Error", data.error])
          } else {
            setError(["Success", "Post uploaded"])
            fetchData()
            setShowLoading(false)
            setImage()
            setTitle('')

          }
        })
        .catch((err) => console.log(err));
    }

// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  const imageShow = () => {
    return image ? URL.createObjectURL(image) : imagePlaceholder
  }
  const showToast = () => {
    return (
      <Toast onClose={() => { setShowLoading(false); setError(false);history.push('/') }} autohide>
        <Toast.Header className={hasError[0]}>
          <strong className="mr-auto">{hasError[0]}</strong>
        </Toast.Header>
        <Toast.Body>{hasError[1]}</Toast.Body>
      </Toast>)
  }

  const postDetails = () => {

    if (image) {
      const filename = image.name
      const extFile = (filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename)

      if (extFile === "jpg" || extFile === "jpeg" || extFile === "png") {
        setShowLoading(true)

      } else {
        setShowLoading(false)
        setImage()
        alert("Only jpg/jpeg and png files are allowed!");
        return
      }

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
          setUrl(data.url);
        })
        .catch((err) => console.log(err));
    }
    else {
      setUrl(null)
    }


  };



  if (hasError) {
    return (<>
      {hasError ? showToast() : <Spinners/>}

    </>)

  
  }
  if(showLoading)
  {
    console.log('ihasdfsad')
    return(<Spinners/>)
  }
  if (state) {
    return (


      <div className="center " style={{ maxWidth: '600px', width: '90vw' }}>
        {hasError ? showToast() : ""}



        {showLoading?<Spinners/>:null}

          <Form>
            <input type='file' id="exampleFormControlFile1" label="Add a picture: "
              accept="image/*"
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
              ref={ref}
              style={{ display: 'none' }}
            />
            <div className='flex-container' style={{ display: 'flex', justifyContent: "space-evenly" }}>
              <div>
                <Link to='/profile'>
                  <img src={state.profilePictureUrl} width={'50px'} style={{ borderRadius: '50%' }}  alt ={'profile'} />

                </Link>

              </div>
              <div className="input-with-icon">
                <input type="text" className="form-control"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
                <div className="btn btn-default icon"
                  onClick={(e) => {
                    e.preventDefault()
                      ; (ref.current.click())
                  }}>
                  <div className="glyphicon glyphicon-search">
                    <img src={imageShow()} width='40px'  alt ={'profile'}/>
                  </div>
                </div>
              </div>
              <span style={{ width: '10%' }}>
                <Button variant="primary" onClick={() => postDetails()}>Post</Button>
              </span>

            </div>
          </Form>
        
      </div>
    )
  }
  return (
    <Spinners/>
  )
};

export default CreatePost;
