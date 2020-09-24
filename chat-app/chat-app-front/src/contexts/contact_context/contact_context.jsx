import React from "react";

const contactContext = React.createContext()

const ContactProvider = contactContext.Provider
const ContactConsumer = contactContext.Consumer

export {ContactProvider,ContactConsumer}