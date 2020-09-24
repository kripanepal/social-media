import React, { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../../App";
import { Link} from "react-router-dom";
import "./messageSideBar.css";
import Spinners from './spinners'
import './messages.css'
import MessageSideBar from "./messageSideBar";


const Messages = (props) => {
    const { state, dispatch } = useContext(UserContext);
    const [results, setResults] = useState([]);



    useEffect(() => {

        if (state) {
            const followings = state.followings;
            fetch("/fetchinbox", {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("jwt"),
                }
            })
                .then((res) => res.json())
                .then((result) => {
                    setResults(result);
                });
        }
    }, [state]);

    const header = () => {
        return <div>
            <div>

                <img src={state.profilePictureUrl} width='50px' style={{ borderRadius: '50%' }} />
                Chats
            </div>
        </div>
    }

    const showDate = (date) => {
        const tempDate = new Date(date)
        if (tempDate.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)) {
            return (date.getHours() + ':' + date.getMinutes())

        }
        else {
            var d = date.getDate();
            var m = date.getMonth() + 1;
            var y = date.getFullYear();
            return (d <= 9 ? '0' + d : d) + '-' + (m <= 9 ? '0' + m : m) + '-' + y;

        }
    }



    const inbox = () => {
        const fullInfo = results.map((each,i) => {
            const messageSentBy = each.user_messages[0].from
            const otherUser = each.user_messages[0].from._id === state._id ? each.user_messages[0].to : each.user_messages[0].from
            console.log(showDate(new Date(each.user_messages[0].date)))

            const message = each.user_messages[0].text
            const show = messageSentBy._id === state._id ? 'you: ' : messageSentBy.name + ': '
            const read = each.readBy.includes(state._id) ? null : "unread"
            console.log(each.readBy, state._id, read)
            return (

                <Link to={"/messages/" + otherUser._id} className='mainChat' key={i}>
                    <div>
                        <img src={messageSentBy.profilePictureUrl} width='50px' style={{ borderRadius: '50%' }} />
                    </div>
                    <div style={{ marginLeft: '10px' }} className={read} >
                        <div style={{
                            fontWeight: 'bold',
                            display: "flex",
                            justifyContent: "space-between",
                            width:'230px'
                        }}>
                            {otherUser.name}
                            <span style={{ fontWeight: 'lighter' }}>
                                {showDate(new Date(each.user_messages[0].date))}
                            </span>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div style={{ marginRight: '5px', display: 'flex' }}>
                                {show}
                            </div>
                            <div className=''>{message}</div>{' '}
                        </div>

                    </div>
                </Link>)
        })
        return fullInfo

    }

    if (!state) {
        return <Spinners />;
    }
    else {


        return (

            <div className='chats'>
            <MessageSideBar/>
                {header()}
                {inbox()}


            </div>

        )
    };
}

export default Messages;
