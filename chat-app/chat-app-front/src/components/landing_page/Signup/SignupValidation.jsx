const firstName = /^[a-z]{3,10}$/i
const lastName = /^[a-z]{3,10}$/i
const email = /^[a-z]\w{3,25}[^_]@[a-z]{2,10}\.com|net|org|in|gov$/
const username = /^[a-zA-Z]\w{3,9}[a-zA-Z0-9]{1,5}$/
const password = /^[a-zA-Z]\w{3,9}[a-zA-Z0-9]{1,5}$/

const validate={
    FIRSTNAME: (value)=>firstName.test(value),
    LASTNAME:(value)=>lastName.test(value),
    EMAIL:(value)=>email.test(value),
    USERNAME:(value)=>username.test(value),
    PASSWORD:(value)=>password.test(value)
}

export default validate