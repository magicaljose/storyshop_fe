import React from 'react';
import queryString from 'query-string';
import secureStorage from 'secureStorage';
import { Redirect } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import 'assets/css/react-confirm-alert.css';

import axios from 'axios';

import loading from 'assets/img/loding_loding.gif';

import { db, auth } from 'config_db/firebase.jsx';

import config from '../config.js';
import {NODE_API} from '../constant';

import getQueries from 'queries/getQueries';
import updateQueries from 'queries/updateQueries';
import setQueries from 'queries/setQueries';

const date_diff_indays = (date1, date2) => {
  const dt1 = new Date(date1);
  const dt2 = new Date(date2);

  return Math.floor((
    Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate())
    -
    Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())
  ) /(1000 * 60 * 60 * 24));
}

class HandleUser extends React.Component {
  state = {
    fields: {},
    errors: {},
    user_in: false,
    login: false,
    errorMessage: false,
  }

  componentDidMount = () => {
      const query = queryString.parse(this.props.location.search);

      if (localStorage.getItem('storyShop_uid')) {
        return;
      }

      if (!query.upc) {
      	window.location.assign(config.HOST_URL + "/account/");
      } else {
      	const email = query.upc;

      	const usDB = (error, result) => {
      		if (error) {
				console.log(error);
			} else {
				if (result.data.docs.length > 0) {
					result.data.forEach(snap => {
						const data = snap.data();
						const uid = snap.id;

						const user_name = data.user_name || email;
						localStorage.setItem("storyShop_user_name", user_name);
						const created_date = data.created_date;
						let account_type = data.account_type;
						const expire_date = data.expire_date || "";
						const isNewUser = data.isNewUser || false;
						const doNotShowAgain = data.doNotShowAgain || false

						if (!account_type || account_type === "Trail") {
							account_type = "Lite";
						}
						if (account_type === "Pro") {
							if (expire_date) {
							  const today = new Date(data.lastSignInTime);
							  const exp = new Date(expire_date);

							  const callback = (err, res) => {
								if (err) {
									console.log(err);
								} 
								else
								{
									localStorage.setItem("storyShop_uid", uid);
									secureStorage.setItem("storeToken", {
									user_id: uid,
									user_name: user_name,
									account_type: "Lite",
									expire_date,
									account_created_date: created_date,
									isNewUser,
									doNotShowAgain
								  });
									this.setState({ user_in: true });
								}
							  }
							  if (today > exp) {
								  const fields = {
									account_type: "Lite"
								};
							  updateQueries.updateUser(uid, fields, callback);
							  }
							}
						}
						localStorage.setItem("storyShop_uid", uid);
						secureStorage.setItem("storeToken", {
							user_id: uid,
							user_name: user_name,
							account_type: account_type,
							expire_date,
							account_created_date: created_date,
							isNewUser,
							doNotShowAgain
						});
						this.setState({ user_in: true });
					})
				}
			}
		}

		getQueries.getUserWithEmail_id(email, usDB);
      }

      return;

      if (!query.upc || !query.wcp) {
        // redirect again to login page
        window.location.assign(config.HOST_URL + "/account/");
      } else {
        const email = query.upc;
        const password = query.wcp;

        auth
          .signInWithEmailAndPassword(email, password)
          .catch( (error) => {
            let errors = {
              invaliduser: error.message
            }

            this.setState({ errorMessage: true, user_email: email, error_code: error.code, error_message: error.message });
            console.log(error);
            // window.location.assign(config.HOST_URL);
          })

        auth.onAuthStateChanged(user => {
        if (user) {
        
			const usDB = (error, result) => {
				if (error) {
					console.log(error);
				} else {
					if (result.status === 1) {
						const user_name = result.data.user_name || email;
						localStorage.setItem("storyShop_user_name", user_name);
						const created_date = result.data.created_date;
						let account_type = result.data.account_type;
						const expire_date = result.data.expire_date || "";
						const isNewUser = result.data.isNewUser || false;
						const doNotShowAgain = result.data.doNotShowAgain || false;

						if (!account_type || account_type === "Trail") {
							account_type = "Lite";
						}
						if (account_type === "Pro") {
							if (expire_date) {
							  const today = new Date(result.data.lastSignInTime);
							  const exp = new Date(expire_date);

							  const callback = (err, res) => {
								if (err) {
									console.log(err);
								} 
								else
								{
									localStorage.setItem("storyShop_uid", user.uid);
									secureStorage.setItem("storeToken", {
									user_id: user.uid,
									user_name: user_name,
									account_type: "Lite",
									expire_date,
									account_created_date: created_date,
									isNewUser,
									doNotShowAgain
								  });
									this.setState({ user_in: true });
								}
							  }
							  if (today > exp) {
								  const fields = {
									account_type: "Lite"
								};
							  updateQueries.updateUser(user.uid, fields, callback);
							  }
							}
						}
						localStorage.setItem("storyShop_uid", user.uid);
						secureStorage.setItem("storeToken", {
							user_id: user.uid,
							user_name: user_name,
							account_type: account_type,
							expire_date,
							account_created_date: created_date,
							isNewUser,
							doNotShowAgain
						});
						this.setState({ user_in: true });
					}
				}
			}
			getQueries.getUserWithDoc(user.uid, usDB);
        }
        });
      }
}

helpUser = () => {
	let headers = {
		'Content-Type': 'application/json'
	}

	const { user_email, error_code, error_message } = this.state;

	axios.post(`${NODE_API}/auth/help_me`, {
		user_email, 
		error_code, 
		error_message
	}, {
		headers: headers
	}).then(response => {
		console.log(response);
	}).catch(error => {
		console.log(error);
	})
}

  render() {
    const { fields, errors, user_in, login, errorMessage } = this.state;

    if (user_in || localStorage.getItem('storyShop_uid')) {
      document.body.style.cursor = "default";

      return <Redirect to='/dashboard' />
    }

    if (login) {
      return <Redirect to='/login' />
    }

    if (errorMessage) {
      return (
        <center>
          <h2>Oops, looks like some wires got cross.</h2>
          <br />
          <h2>Please click the button below to let our technical team know about it and we'll get the wires uncrossed as soon as possible!</h2>
          <br /><br />
          <button className='world-add' onClick={this.helpUser}>Help Me!</button>
        </center>
      );
    }

    return (
      <center className='load-cntr'>
        <img src={loading} alt="loading..." />
      </center>
    )
  }
}

export default HandleUser;
