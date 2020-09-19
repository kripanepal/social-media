import React, { useState, useEffect, useContext, } from "react";
import ScrollToBottom from 'react-scroll-to-bottom';
import { useParams, useHistory } from 'react-router-dom'
import { UserContext } from "../../App";
import { Link } from 'react-router-dom'
import { Card, Form, Toast, Tooltip, OverlayTrigger, Button } from 'react-bootstrap'
import { FcLike, FcLikePlaceholder } from 'react-icons/fc';
import { AiFillDelete } from 'react-icons/ai'
import './home.css'
import diff from '../dateCalculator'
const Home = () => {
    const [data, setData] = useState();
    const { state, dispatch } = useContext(UserContext)
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(false)
    const { postid } = useParams()
    const history = useHistory()
    useEffect(() => {
        fetch(`/getpost/${postid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                setData(result)
                setLoading(false)
            })
    }, [])

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
        console.log('liking')
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


                setData(result)
            }).catch(err => {
                console.log(err)
            })
    };

    const unlikePost = (id) => {
        console.log('unliking')

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


                setData(result)
            }).catch(err => {
                console.log(err)
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
                setData(result)
            }).catch(err => {
                console.log(err)
            })
    }



    const deletePost = (id) => {
        console.log('deleting')
        fetch(`/deletepost/${id}`, {
            method: "delete",
            headers: {

                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(history.push('/'))

            .catch((err) => console.log(err));
    };
    if (loading) {
        return (<div>Loading...</div>)
    }



    if (!data || data.length === 0) {
        return (<div>No posts</div>)
    }



    if (data)


        return (
            <>

                <Card className="text-left cards" style={{ maxWidth: '600px', width: '90vw' }}>
                    <Card.Body>
                        <Card.Title className='name' style={{ padding: '7px' }}>
                        <div >

                            <Link to={'/profile/' + data.postedBy._id} style={{ textDecoration: 'none', color: 'black' }}>
                                <img className="profilePicMini" src={data.postedBy.profilePictureUrl}
                                /> {" "}{data.postedBy.name} </Link>
                            {
                                data.postedBy._id === state._id ?
                                    <AiFillDelete style={{ float: 'right' }} className="material-icons" onClick={() => deletePost(data._id)} />
                                    :
                                    <div></div>
                            }
                             <div className = 'time'>
                      <small>
                      {diff(data.createdAt)}

                      </small>
                    </div>
                 
                  </div>
                        </Card.Title>
                        <Card.Text>
                            <h4>
                                {data.title}
                            </h4>
                        </Card.Text>
                        {data.picture ? <Card.Img variant="bottom" src={data.picture} /> : null}

                        <Card.Footer className='post_comments'>
                            <div >
                                <div className='likesComments'>
                                    <span className='likes'>
                                        {data.likes.length !== 0 ?
                                            <OverlayTrigger delay={{ hide: 1000 }} overlay={
                                                <Tooltip >
                                                    {data.likes.map(nameOfPerson => {
                                                        const url = '/profile/' + nameOfPerson._id
                                                        return (<Link to={url}>
                                                            <div>{nameOfPerson._id == state._id ? 'you' : nameOfPerson.name}</div>
                                                        </Link>)
                                                    })}
                                                </Tooltip>}>
                                                <span style={{ marginLeft: '10px' }}>
                                                    {data.likes.length} {(data.likes.length === 1) ? "like" : "likes"}
                                                </span>
                                            </OverlayTrigger> : "0 likes"}
                                    </span>
                                    <span>
                                        {data.comments.length} {(data.comments.length === 1) ? "comment" : "comments"}
                                    </span>
                                </div>
                                <hr />
                                <div style={{ display: 'flex', justifyContent: 'space-around', margin: '0px auto' }}>
                                    <div>
                                        {
                                            data.likes.find(o => o._id === state._id) ?
                                                <FcLike width='3em' onClick={() => unlikePost(data._id)} /> :
                                                <FcLikePlaceholder width='3em' onClick={() => likePost(data._id)} />
                                        } like
                      </div>
                                    <div>comment</div>




                                </div>
                                <div>
                                    <ScrollToBottom className="comments"
                                    >
                                        {data.comments.map((comment, i) =>
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
                                        makeComment(e.target[0].value, data._id)
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
                </Card>
                <span className='postDeleteMessage'>{toast ? showToast() : ""}
                </span>
            </>

        )




};

export default Home;
