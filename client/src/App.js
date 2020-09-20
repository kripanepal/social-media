import React, { useEffect, createContext, useReducer } from 'react';
import NavBar from './components/navbar'
import "./App.css"
import Home from './components/screens/home'
import Login from './components/screens/login'
import Profile from './components/screens/profile'
import Signup from './components/screens/signup'
import CreatePost from './components/screens/createPost'
import UserProfile from './components/screens/UserProfile'
import Reset from './components/screens/reset'
import UpdatePassword from './components/screens/createPassword'
import Post from './components/screens/post'
import Messages from './components/screens/messages'
import io from "socket.io-client";


import FollowedPosts from './components/screens/followedPosts'
import { initialState, reducer } from './reducers/userReducer'
import { BrowserRouter, Route, useHistory, Switch, Link } from 'react-router-dom'

export const UserContext = createContext()

const Routing = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const history = useHistory()



  return (
    <Switch>
      <Route exact path='/'>
        <Home />
      </Route>
      <Route path='/signup'>
        <Signup />
      </Route>
      <Route path='/login'>
        <Login />
      </Route>
      <Route exact path='/profile'>
        <Profile />
      </Route>
      <Route path='/createpost'>
        <CreatePost />
      </Route>
      <Route path='/profile/:userid'>
        <UserProfile />
      </Route>
      <Route path='/followedposts'>
        <FollowedPosts />
      </Route>
      <Route path='/resetpassword'>
        <Reset />
      </Route>
      <Route path='/reset/:token'>
        <UpdatePassword />
      </Route>
      <Route path='/post/:postid'>
        <Post />
      </Route>
      <Route path='/messages'>
        <Messages />
      </Route>
    </Switch>
  )
}
function App() {
  const ENDPOINT = 'localhost:5000';
  let socket;
  socket = io(ENDPOINT);

  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <div className="App">
        
        <BrowserRouter>
          <div className = 'contain'>
            <NavBar />
            <Routing />
          </div>

        </BrowserRouter>
      </div>
    </UserContext.Provider>
  );
}

export default App;
