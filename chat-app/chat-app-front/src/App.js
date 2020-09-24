import React,{Component} from 'react';
// import Navin from "./components/nav_in/nav_in"
// import {BrowserRouter as Router} from 'react-router-dom'
// import LandingPage from "./components/landing_page/LandingPage"
import Sender from "./components/RTC/Sender/Sender"

import './App.css';

class App extends Component{
  constructor(props) {
    super(props)
  
    this.state = {
       
    }
  }
  render(){
    return (
      
        <div className="App">
        {/* <Navin/> */}
        {/* <Signup/> */}
        {/* <Login/> */}
        {/* <Landing_nav/> */}
        {/* <LandingPage/> */}
        <Sender/>
      </div>
      
    );
  }
  
}

export default App;
