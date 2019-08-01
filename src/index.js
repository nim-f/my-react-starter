import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Logo from './images/logo.png'

console.log('working')

const App = () => (<div>123<img src={Logo} alt="logo" /></div>)
const wrapper = document.getElementById("App");
ReactDOM.render(<App />, wrapper)
