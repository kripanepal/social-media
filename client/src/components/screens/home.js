import React, { useState, useEffect, useContext, useRef } from "react";
import ScrollToBottom from 'react-scroll-to-bottom';

import { UserContext } from "../../App";
import { Link } from 'react-router-dom'
import { Card, Form, Toast, Tooltip, OverlayTrigger, Button } from 'react-bootstrap'
import { FcLike, FcLikePlaceholder } from 'react-icons/fc';
import { AiFillDelete } from 'react-icons/ai'
import './home.css'
import Status from './createPost'

import diff from '../dateCalculator'

const Home = () => {
  const [data, setData] = useState();
  const { state, dispatch } = useContext(UserContext)
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(false)
  const [showComments, setShowComments] = useState('totalComments')


  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    fetch('/allpost', {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('jwt')
      }
    }).then(res => res.json())
      .then(result => {
        console.log(result)


        setData(result.posts)
        setLoading(false)
      })
  }



  const showToast = () => {
    return (
      <Toast className='deletePostTost' onClose={() => setToast(false)} delay={3000} autohide>
        <Toast.Header className={toast[0]}>
          <strong className="mr-auto">{toast[0]}</strong>
        </Toast.Header>
        <Toast.Body>{toast[1]}</Toast.Body>
      </Toast>)
  }

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postID: id,
      }),
    })
      .then(res => res.json())
      .then(result => {

        const newData = data.map(item => {
          if (item._id == result._id) {
            return result
          } else {
            return item
          }
        })
        setData(newData)
      }).catch(err => {
      })
  };

  const unlikePost = (id) => {

    fetch('/unlike', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: id
      })
    }).then(res => res.json())
      .then(result => {
        const newData = data.map(item => {
          if (item._id == result._id) {
            return result
          } else {
            return item
          }
        })
        setData(newData)
      }).catch(err => {
      })
  }
  const makeComment = (text, postId) => {
    fetch('/comment', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId,
        text
      })
    }).then(res => res.json())
      .then(result => {
        const newData = data.map(item => {
          if (item._id == result._id) {
            return result
          } else {
            return item
          }
        })
        setData(newData)
      }).catch(err => {
      })
  }



  const deletePost = (id) => {
    fetch(`/deletepost/${id}`, {
      method: "delete",
      headers: {

        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.filter(item => {
          return (item._id !== result._id)
        })
        setToast(['Success', "Post deleted"])
        setData(newData)
      })
      .catch((err) => console.log(err));
  };
  
  

  if (!loading) {

    if (data.length === 0 || !data) {
      return (<div className='center'>
        <Status fetchData={fetchData} />
        <div >No posts</div></div>)
    }

    const toReturn = (

      data.map((each) => {

        return (
          <>


            <Card className="text-left cards" style={{ maxWidth: '600px', width: '90vw' }}>
              <Card.Body>
                <Card.Title className='name' style={{ padding: '7px' }}>
                  <div >
                  <Link to={'/profile/' + each.postedBy._id} style={{ textDecoration: 'none', color: 'black' }}>
                    <img className="profilePicMini" src={each.postedBy.profilePictureUrl}
                    /> {" "}{each.postedBy.name} </Link>
                                      {
                    each.postedBy._id === state._id ?
                      <AiFillDelete style={{ float: 'right' }} className="material-icons" onClick={() => deletePost(each._id)} />
                      :
                      <div></div>
                  }
                    <div className = 'time'>
                      <small>
                      {diff(each.createdAt)}

                      </small>
                    </div>
                 
                  </div>
                 

                </Card.Title>
                <Link to={`/post/${each._id}`} style={{ cursor: 'default', textDecoration: 'none', color: 'black' }}>
                  <Card.Text>
                    <h4>
                      {each.title}
                    </h4>
                  </Card.Text>

                  {each.picture ? <Card.Img variant="bottom" src={each.picture} /> : null}

                </Link>


                <Card.Footer className='post_comments'>
                  <div >
                    <div className='likesComments'>
                      <span className='likes'>
                        {each.likes.length !== 0 ?
                          <OverlayTrigger delay={{ hide: 1000 }} overlay={
                            <Tooltip >
                              {each.likes.map(nameOfPerson => {
                                const url = '/profile/' + nameOfPerson._id
                                return (<Link to={url}>
                                  <div>{nameOfPerson._id == state._id ? 'you' : nameOfPerson.name}</div>
                                </Link>)
                              })}
                            </Tooltip>}>
                            <span style={{ marginLeft: '10px' }}>
                              {each.likes.length} {(each.likes.length === 1) ? "like" : "likes"}
                            </span>
                          </OverlayTrigger> : "0 likes"}

                      </span>
                      <span onClick={() => {

                        showComments === undefined ? setShowComments("totalComments") : setShowComments(undefined)
                      }}
                      >
                        {each.comments.length} {(each.comments.length === 1) ? "comment" : "comments"}
                      </span>
                    </div>
                    <hr />
                    <div style={{ display: 'flex', justifyContent: 'space-around', margin: '0px auto' }}>
                      <div style={{ cursor: 'pointer' }}>
                        {
                          each.likes.find(o => o._id === state._id) ?
                            <FcLike className='svg' width='3em' onClick={() => unlikePost(each._id)} /> :
                            <FcLikePlaceholder className='svg' width='3em' onClick={() => likePost(each._id)} />
                        } like
                      </div>
                      <div onClick={() => {

                        showComments === undefined ? setShowComments("totalComments") : setShowComments(undefined)
                      }}
                      >comment</div>




                    </div>
                    <div className={showComments}>
                      <ScrollToBottom className="comments"
                      >
                        {each.comments.map((comment, i) =>
                          <div key={comment._id}>
                            <span style={{ fontWeight: "500" }}>
                              <Link to={'/profile/' + comment.postedBy._id}>{comment.postedBy.name + " "} </Link>
                            </span>
                            <span> {comment.text}</span>
                          </div>

                        )}
                      </ScrollToBottom>

                      <Form onSubmit={(e) => {
                        e.preventDefault()
                        makeComment(e.target[0].value, each._id)
                        e.target[0].value = ""

                      }}>
                        <Form.Group >
                          <Form.Control type="text" placeholder="Enter a comment"
                          />
                        </Form.Group>
                      </Form>
                    </div>


                  </div>
                </Card.Footer>
              </Card.Body>
              <span className='postDeleteMessage'>{toast ? showToast() : ""}
              </span>
            </Card>

          </>

        )
      })

    );

    return (
      <>
        <Status fetchData={fetchData} />
        {toReturn}
      </>
    )
  }

  return (<div>Loading...</div>)

};

export default Home;
