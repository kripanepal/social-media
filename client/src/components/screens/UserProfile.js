import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams, Redirect, Link } from 'react-router-dom'
import { FcLike } from 'react-icons/fc';
import { FaComment } from 'react-icons/fa'
import Spinners from './spinners'

import { Card, CardColumns, Button } from "react-bootstrap";
import './home.css'

const Profile = () => {
    const [data, setData] = useState(null);
    const { state, dispatch } = useContext(UserContext)
    const { userid } = useParams()


    useEffect(() => {

        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setData(result)
               

            })
    }, [userid])


    const followUser = () => {
    
        fetch('/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                toBeFollowed: userid
            })
        }).then(res => res.json())
            .then(result => {
                dispatch({ type: "UPDATE", payload: { followings: result.followings, followers: result.followers } })
                localStorage.setItem("user", JSON.stringify(result))
                setData((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, result._id]
                        }
                    }
                })
                console.log('done')
   
            })
    }
    const unfollowUser = () => {
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                toBeUnfollowed: userid
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                dispatch({ type: "UPDATE", payload: { followings: result.followings, followers: result.followers } })
                localStorage.setItem("user", JSON.stringify(result))

                setData((prevState) => {
                    const newFollower = prevState.user.followers.filter(item => item !== result._id)
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollower
                        }
                    }
                })
                console.log('doner')

            })
    }


    if (data) {

        if (state._id === userid) {
            return <Redirect push to="/profile" />
        }

        return (



            <Card className="text-center cards">

                <div>
                    <div className='profile'>
                        <div className="profile-pic">
                            <img
                                style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                                src={data.user.profilePictureUrl} alt = {"profile"}
                            />
                            {state.followings.includes(userid) ? <Button variant="danger"
                                onClick={() => unfollowUser()}>Unfollow
        </Button> : <Button variant="success"
                                    onClick={() => followUser()}

                                >
                                    Follow
        </Button>}{" "}
        {state.followings.includes(userid) ? <Button variant="primary"><Link to = {'/messages/'+userid}><span style = {{color:'white'}}>Send message
            </span>
        </Link>
        </Button> : null}
                        </div>
                        <div className='profile-description'>
                            <div>{data ? data.user.name : "loading"}
                            </div>
                            <span>
                                {data ? data.user.email : "loading"}
                            </span>
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
                    <CardColumns>
                        {data.posts.map((item,i) => {
                            return (
                                <Card key={i}>
                                    <Link to={`/post/${item._id}`} style={{ textDecoration: 'none', color: 'black' }}>
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
    }

    return (<Spinners/>)

};

export default Profile;
