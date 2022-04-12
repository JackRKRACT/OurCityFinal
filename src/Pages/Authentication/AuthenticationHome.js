import React from 'react';
import { Button, InputGroup, FormControl, ButtonGroup } from 'react-bootstrap';
import Modal from 'react-modal';
import CityMap from '../../Components/CityMap';

const axios = require('axios').default;

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

export default class AuthenticationHome extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            startLogin: true,
            isRegister: false,
            isLoggedIn: false,
            user: "",
            password: "",
            cookie: {
                this_cookie: "none",
                this_user: "Guest",
            },
            incorrectLogin: false,
        };

        this.finishAuth = this.finishAuth.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.renderLogin = this.renderLogin.bind(this);
        this.changeType = this.changeType.bind(this);
        this.setCookie = this.setCookie.bind(this);
    }

    changeType(e) {
        e.preventDefault();
        var curr_mode = this.state.isRegister
        this.setState({
            isRegister: !curr_mode
        })
    }

    setCookie(cookie, user) {
        var new_cookie = {
            this_cookie: cookie,
            this_user: user,
        }
        this.setState({
            cookie: new_cookie,
        })
    }

    finishAuth() {
        this.setState({
            startLogin: false,
            startRegister: false,
            incorrectLogin: false,
        })
    }

    handleChange(e) {
        //console.log(e.target.name + " : " + e.target.value)
        this.setState ({
            [e.target.name]: e.target.value
        })
    }

    handleRegister(e) {
        let host = "http://127.0.0.1"
        let port = "5000"
        let url = host + ":" + port + "/registerUser"
        axios({
            method: 'post',
            url: url,
            data: {
              user: this.state.user,
              password: this.state.password,
            }
        });
        this.changeType(e);
        e.preventDefault();   
    }
  
    handleLogin(e) {
        let host = "http://127.0.0.1"
        let port = "5000"
        let url = host + ":" + port + "/authUser"

        var data = {
            user: this.state.user,
            password: this.state.password,
        }

        axios.post(url, data).then((response) => {
            if (response.data === "invalid_login") {
                this.setState({
                    incorrectLogin: true
                })
            } else {
                this.setCookie(response.data, this.state.user);
                this.finishAuth();
            }
            
        }).catch((error) => {
            console.log(error);
        });

        e.preventDefault();
    }

    render() {
        return (
            <div>
                {this.renderLogin()}
                {!this.state.startLogin &&
                    <CityMap userCookie={this.state.cookie}/>
                }
            </div>
        )
    }

    renderLogin() {
        return (
            <Modal
            isOpen={this.state.startLogin}
            onRequestClose={this.finishAuth}
            style={customStyles}
            contentLabel="User Authentication Modal"
            >
            <div className="application">
                {!this.state.isRegister && <h2>Login</h2>}
                {this.state.isRegister && <h2>Register</h2>}
                <InputGroup>
                <InputGroup.Text>User</InputGroup.Text>
                <FormControl id="user" name="user" onChange={this.handleChange}/>
                </InputGroup>
                <InputGroup>
                <InputGroup.Text>Password</InputGroup.Text>
                <FormControl type="password" id="password" name="password" onChange={this.handleChange}/>
                </InputGroup>
                {this.state.incorrectLogin && <p>Invalid login. Please try again.</p>}
                {!this.state.isRegister &&
                    <ButtonGroup>
                        <Button variant="outline-primary" onClick={this.handleLogin}>Submit</Button>
                        <Button variant="outline-primary" onClick={this.changeType}>Register</Button>
                    </ButtonGroup>
                }
                {this.state.isRegister &&
                    <ButtonGroup>
                        <Button variant="outline-primary" onClick={this.handleRegister}>Submit</Button>
                        <Button variant="outline-primary" onClick={this.changeType}>Login</Button>
                    </ButtonGroup>
                }
            </div>
          </Modal>
        )
    }
}
