import React from 'react';

import UserPage from "./components/UserPage/UserPage"
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"
import LandingPage from "./components/landing_page/LandingPage"
import {connect} from "react-redux"
import { Route,Switch } from 'react-router-dom';
import Sender from './components/RTC/Sender/Sender';
import Receiver from './components/RTC/Receiver/Receiver';

function App(props) {
  return (
  <Switch>
    <ProtectedRoute exact path="/user/:id"  component={UserPage}  />
      <ProtectedRoute exact path="/user/:user/call/:contact" component={Sender}/>
      <ProtectedRoute exact path="/user/join/:user" component={Receiver} />
    <Route path="/"  render={(props)=><LandingPage {...props}/>}/>
    </Switch>
  );
}

const mapStateToProps = (state) => { 
  return {
    isAuthenticated:state.isAuthenticated
  }
}


export default connect(mapStateToProps)(App);
