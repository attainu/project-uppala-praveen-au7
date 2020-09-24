import React, { Component } from 'react'
import Contact from "./contact/contact"
import classes from "./contacts.module.css"
import axios from "axios"
import AddContact from "./add-contact/add-contact"
import {ContactProvider} from "../../contexts/contact_context/contact_context"


class contacts extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             friends:[],
             newFriend:{}
           
        }
    }
    componentDidMount() {
        axios.get('https://jsonplaceholder.typicode.com/users').then(user=>{
            this.setState({friends:user.data.slice(0,3)})
        })
    }
    addContact = async (e)=>{
        e.preventDefault()
        const email = e.target.email.value
        const new_friend = await axios.get('https://jsonplaceholder.typicode.com/users/4')
        

    }

    
    render() {
        return (
            <div>
                <ul >
                    {this.state.friends.map(friend=><li key={friend.id} >{
                        <ContactProvider value={friend.email}>
                            <Contact name ={friend.name}  />
                        </ContactProvider>
                    }</li>)}
                </ul>
                <AddContact addContact={this.addContact}/>
            </div>
        )
    }
}

export default contacts
