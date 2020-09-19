import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useHistory, Link } from 'react-router-dom'
import { Card, CardColumns, Toast } from "react-bootstrap";
import { AiTwotoneEdit } from 'react-icons/ai'
import { FcLike, FcLikePlaceholder } from 'react-icons/fc';
import { FaComment } from 'react-icons/fa'
import './profile.css'
const Profile = () => {
  const [data, setData] = useState({});
  const { state, dispatch } = useContext(UserContext)
  const [loading, setLoading] = useState(true);
  const [hasError, setError] = useState(false)
  const history = useHistory()

  useEffect(() => {
    fetch('/myposts', {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      }
    }).then(res => res.json())
      .then(result => {
        setData(result)
        setLoading(false)
      })
  }, [state])

  const generateLink = (image) => {
    const filename = image.name
    const extFile = (filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename)

    if (extFile == "jpg" || extFile == "jpeg" || extFile == "png") {
      setLoading(true)

    } else {
      setLoading(false)
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

        changePicture(data.url)

      })
      .catch((err) => console.log(err));

  }
  const showToast = () => {
    return (
      <Toast onClose={() => setError(false)} delay={15000} autohide>
        <Toast.Header className={hasError[0]}>
          <strong className="mr-auto">{hasError[0]}</strong>
        </Toast.Header>
        <Toast.Body>{hasError[1]}</Toast.Body>
      </Toast>)
  }

  const changePicture = (url) => {
    console.log(url)
    fetch("/updateprofilepicture", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),

      },
      body: JSON.stringify({

        profilePictureUrl: url
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          setError(["Error", data.error])
        } else {
          setError(["Success", 'Profile picture updated'])
          console.log(result)
          dispatch({ type: "USER", payload: result })
          localStorage.setItem("user", JSON.stringify(result))
          history.push('/profile')

        }
      })
      .catch((err) => console.log(err));
  }

  if (loading) {

    return (<div>Loading...</div>)
  }
  else {
    return (
      <Card className="text-center cards">
        {hasError ? showToast() : ""}

        <div>
          <div className='profile'>
            <div class="profile-pic">
              <img
                style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                src={data.user.profilePictureUrl}
              />
              <label className="edit">
                <AiTwotoneEdit />
                <input type="file" style={{ display: 'none' }}
                  type="file"
                  onChange={(e) => {
                    generateLink(e.target.files[0]);

                  }}
                />
              </label>
            </div>
            <div className='profile-description'>
              <div>{data ? data.user.name : "loading"}
              </div>
              <p>
                {data ? data.user.email : "loading"}
              </p>
              <div
                style={{

                  width: '100%'
                }}
              >
                <span>{data.posts.length} posts </span>
                <span>{' ' + data.user.followers.length} followers </span>
                <span>{data.user.followings.length} followings </span>
              </div>
            </div>
          </div>
        </div>
        <div className="gallery">
          <CardColumns className='image'>
            {data.posts.map(item => {

              return (
                <Card>
                  <Link to={`/post/${item._id}`}  style={{ textDecoration: 'none', color: 'black' }}>
                    {item.picture ? <> <Card.Img variant="bottom"
                      src={item.picture}
                      className='singleImage'
                      alt={item.title}
                      key={item.postedBy._id} />
                      <span className='pictureFooter'>
                        <span>
                          <FcLike />{item.likes.length}
                        </span>
                        <span>
                          <FaComment />{item.comments.length}
                        </span>
                      </span></> : <div className=''>
                      {item.title} <div className='postFooter'>
                        <span>
                          <FcLike />{item.likes.length}
                        </span>
                        <span>
                          <FaComment />{item.comments.length}
                        </span>
                      </div>
                      </div>}



                  </Link>

                </Card>)
            })}
          </CardColumns>

        </div>

      </Card>
    );
  };
}
export default Profile;
