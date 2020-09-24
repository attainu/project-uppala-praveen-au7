import React from 'react'

const add_contact = (props) => {
    return (
       <form onSubmit={props.addContact}>
           <input type="email" name="email" id="email" placeholder="enter contacts email here"/>
           <button type="submit">Add Contact</button>
       </form>
    )
}

export default add_contact
