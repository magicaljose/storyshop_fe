import React from 'react';
import { TextField, Button } from 'material-ui';
import { Redirect } from "react-router-dom";

import {db, auth} from 'config_db/firebase';
import secureStorage from 'secureStorage';
import axios from 'axios';
import { API_URL } from '../constant.js';

import { confirmAlert } from 'react-confirm-alert';
import 'assets/css/react-confirm-alert.css';

const date_diff_indays = (date1, date2) => {
  const dt1 = new Date(date1);
  const dt2 = new Date(date2);

  return Math.floor((
    Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate())
    -
    Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())
  ) /(1000 * 60 * 60 * 24));
}

class Login extends React.Component {
  state = {
    fields: {},
    errors: {},
    user_in: false,
  }

  componentDidMount = () => {
    this.props.history.push("/app");
  }

  handleChange = (event) => {
    let { fields } = this.state;
    const { name, value } = event.target;

    fields[name] = value;

    this.setState({ fields });
  }

  submitLoginForm = (event) => {
    event.preventDefault();

    const { fields } = this.state;
    const email = fields.emailid;
    const password = fields.password;

    const headers = {
      'Content-Type': 'application/json',
    }

    axios.post(API_URL + "login", {
    	username: email,
    	password: password
    }, {
    	headers: headers
    }).then((result) => {
    	if (result.data.status === 1) {
    		const uMail = result.data.data.user_email;
    		const uPass = result.data.data.user_pass;

    		this.firebaseLogin(uMail, uPass);
    	} else {
    		const errors = {
              invaliduser: result.data.message
            }

            this.setState({ errors });
    	}
    }).catch(error => {
    	console.log(error);
    })
  }

  firebaseLogin = (email, password) => {
  	auth
          .signInWithEmailAndPassword(email, password)
          .catch( (error) => {
            let errors = {
              invaliduser: error.message
            }

            this.setState({ errorMessage: true });
            console.log(error);
            // window.location.assign(config.HOST_URL);
          })

        auth.onAuthStateChanged(user => {
          if (user) {
        db.ref("user").child(user.uid)
        .once('value').then(snapshot => {
          const val = snapshot.val();

          const user_name = val.user_name || email;
          const created_date = val.created_date;
          let account_type = val.account_type;
          const expire_date = val.expire_date || "";

          if (!account_type) {
            account_type = "Lite";
          }

          localStorage.setItem("storyShop_user_name", user_name);

          /*if (account_type === "Trail") {
            const days = date_diff_indays(new Date(user.metadata.creationTime).toDateString(), new Date(user.metadata.lastSignInTime).toDateString());

            if (days > 30) {
              confirmAlert({
                title: 'Trail period is over',
                message: `We hope you enjoyed it! Now you can "Upgrade to Pro" or "Stick with Lite".`,
                buttons: [
                  {
                    label: 'Upgrade to Pro',
                    onClick: () => {
                      // Remove after implementing pro feature 
                      fire.database().ref().child("user").child(user.uid).update({
                        account_type: "Lite"
                      }).then(() => {
                        localStorage.setItem("storyShop_uid", user.uid);

                        secureStorage.setItem("storeToken", {
                          user_id: user.uid,
                          user_name: user_name,
                          account_type: "Lite",
                          expire_date,
                          account_created_date: created_date
                        });

                        window.location.assign(config.HOST_URL + '/product/storyshop/');
                      });
                      // ************************************
                    }
                  },
                  {
                    label: 'Stick with Lite',
                    onClick: () => {
                      fire.database().ref().child("user").child(user.uid).update({
                        account_type: "Lite"
                      }).then(() => {
                        localStorage.setItem("storyShop_uid", user.uid);

                        secureStorage.setItem("storeToken", {
                          user_id: user.uid,
                          user_name: user_name,
                          account_type: "Lite",
                          expire_date,
                          account_created_date: created_date
                        });

                        this.setState({ user_in: true });
                      });
                    }
                  }
                ],
                onClickOutside: () => {
                  fire.database().ref().child("user").child(user.uid).update({
                        account_type: "Lite"
                      }).then(() => {
                        localStorage.setItem("storyShop_uid", user.uid);

                        secureStorage.setItem("storeToken", {
                          user_id: user.uid,
                          user_name: user_name,
                          account_type: "Lite",
                          expire_date,
                          account_created_date: created_date
                        });

                        this.setState({ user_in: true });
                      });
                },
                onKeypressEscape: () => {
                  fire.database().ref().child("user").child(user.uid).update({
                        account_type: "Lite"
                      }).then(() => {
                        localStorage.setItem("storyShop_uid", user.uid);

                        secureStorage.setItem("storeToken", {
                          user_id: user.uid,
                          user_name: user_name,
                          account_type: "Lite",
                          expire_date,
                          account_created_date: created_date
                        });

                        this.setState({ user_in: true });
                      });
                }
              });

              return;
            }
          } */

          if (account_type === "Pro") {
            if (expire_date) {
              const today = new Date(user.metadata.lastSignInTime);
              const exp = new Date(expire_date);

              if (today > exp) {
                db.ref().child("user").child(user.uid).update({
                  account_type: "Lite"
                }).then(() => {
                  localStorage.setItem("storyShop_uid", user.uid);

                  secureStorage.setItem("storeToken", {
                    user_id: user.uid,
                    user_name: user_name,
                    account_type: "Lite",
                    expire_date,
                    account_created_date: created_date
                  });

                  this.setState({ user_in: true });
                })

                return;
              }
            }
          }

          localStorage.setItem("storyShop_uid", user.uid);

          secureStorage.setItem("storeToken", {
            user_id: user.uid,
            user_name: user_name,
            account_type: "Lite",
            expire_date,
            account_created_date: created_date
          });

          this.setState({ user_in: true });
        })
          }
        });

    return;

    db.ref()
      .child('user')
      .orderByChild("email_id").equalTo(email)
      .once('value').then(snapshot => {
        if (!snapshot.val()) {
          let errors = {
            invaliduser: "Email id or password is wrong or does not exists!",
          };

          this.setState({errors});
        }
        snapshot.forEach(snap => {
          const user_id = snap.key;
          const val = snap.val();

          const user_name = val.user_name || email;
          const created_date = val.created_date;
          let account_type = val.account_type;

          localStorage.setItem("storyShop_uid", user_id);
          localStorage.setItem("storyShop_user_name", user_name);

          if (!account_type) {
            account_type = "Lite";
          }

          if (account_type === "Trail") {
            const days = date_diff_indays(new Date(created_date).toDateString(), new Date().toDateString());

            if (days > 30) {
              confirmAlert({
                title: 'Trail period is over',
                message: `We hope you enjoyed it! Now you can "Upgrade to Pro" or "Stick with Lite".`,
                buttons: [
                  {
                    label: 'Upgrade to Pro',
                    onClick: () => {
                      // Remove after implementing pro feature
                      db.ref().child("user").child(user_id).update({
                        account_type: "Lite"
                      });

                      secureStorage.setItem("storeToken", {
                        user_id,
                        user_name,
                        account_type: "Lite",
                        account_created_date: created_date
                      });

                      alert("Feature is not available. You are requested to use Lite for now! Thanks");

                      this.setState({ user_in: true });
                      // ************************************
                    }
                  },
                  {
                    label: 'Stick with Lite',
                    onClick: () => {
                      db.ref().child("user").child(user_id).update({
                        account_type: "Lite"
                      });

                      secureStorage.setItem("storeToken", {
                        user_id,
                        user_name,
                        account_type: "Lite",
                        account_created_date: created_date
                      });

                      this.setState({ user_in: true });
                    }
          		    }
                ]
              });

              return;
            }
          } else {
            secureStorage.setItem("storeToken", {
              user_id,
              user_name,
              account_type,
              account_created_date: created_date
            });
          }

  			  this.setState({ user_in: true });
        });
      });
  }

  validateForm() {
    let { fields } = this.state;
    let errors = {};
    let formIsValid = true;

    if (!fields["emailid"]) {
      formIsValid = false;
      errors["emailid"] = "*Please enter your email-ID.";
    }

    if (typeof fields["emailid"] !== "undefined") {
      //regular expression for email validation
      var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      if (!pattern.test(fields["emailid"])) {
        formIsValid = false;
        errors["emailid"] = "*Please enter valid email-ID.";
      }
    }

    if (!fields["password"]) {
      formIsValid = false;
      errors["password"] = "*Please enter your password.";
    }

    this.setState({ errors });

    return formIsValid;
  }

  render() {
    const { fields, errors, user_in } = this.state;

    if (user_in || localStorage.getItem('storyShop_uid')) {
      document.body.style.cursor = "default";

      return <Redirect to='/dashboard' />
    }

    return (
      <div id="main-login-container" className='login-container'>
        <div id="login" className="inner_box">
          <h3>Sign In</h3>
		      <div className="errorMsg">{errors.invaliduser}</div>
          <form method="post"  name="LoginForm" onSubmit={this.submitLoginForm}>
		        <TextField className="cmn-size" autoFocus margin="dense" id="email" label="Email Id" type="email" name="emailid" value={fields.emailid || ''} onChange={this.handleChange} fullWidth/>
		        <div className="errorMsg">{errors.emailid}</div>
		        <TextField className="cmn-size" margin="dense" id="password" label="Password" type="password" name="password" value={fields.password || ''} onChange={this.handleChange} fullWidth/>
		        <div className="errorMsg">{errors.password}</div>
		        <Button type="submit" variant="contained" color="primary" className="brown-button" fullWidth>
              Sign In
            </Button>
		        <div className="forgot">
		          {/*<a href="/signup">Create an account</a> • <a href="/forgotpassword" className="password-reset">Forgot password?</a>*/}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
