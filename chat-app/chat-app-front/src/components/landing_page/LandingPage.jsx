import React from 'react'
import {Switch,Route,BrowserRouter as Router} from "react-router-dom"
import Login from "./Login/Login"
import Signup from "./Signup/Signup"
import LandingNav from "./LandingNav/LandingNav"
// import classes from "./LandingPage.module.css"

const Landing_page = (props) => {
    return (
        <Router>
            <div>
                <LandingNav/>
            <Switch>
                <Route path="/signup" component={Signup}  />
                <Route path="/login" component={Login} />
            </Switch>
            </div>
        </Router>
    )
}

export default Landing_page
