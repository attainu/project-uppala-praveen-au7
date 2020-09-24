import React from 'react'
import classes from "./self-card.module.css"

const selfcard = (props) => {
    return (
        <div className={classes.selfcard}>
            <img className={classes.profile_img} src="https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png" alt="name"></img>
            <p className={classes.profile_name}>name</p>
        </div>
    )
}

export default selfcard
