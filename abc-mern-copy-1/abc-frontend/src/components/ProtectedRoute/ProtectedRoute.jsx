import React from 'react'
import {Route,Redirect} from "react-router-dom"
import {connect} from "react-redux"

const ProtectedRoute = ({component:Component,isAuthenticated,...rest}) => {
    
   console.log('props',{component:Component,isAuthenticated,...rest})
    return (
        <Route {...rest}   render={
            (props)=>{
            if(isAuthenticated){
                return <Component {...props}/>
            }else{
                return <Redirect to={{
                    pathname:"/login",
                    state:{
                        from:props.location
                    }
                }} />
            }
        }
        } />
        // <div>
        //     <h1>Protected Route</h1>
        // </div>
    )
}

const mapStateToProps = state => {
    console.log('protected Route', state)
    return {
        isAuthenticated: state.user.isAuthenticated
    }
}

export default connect(mapStateToProps)(ProtectedRoute)
