import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { headerLinksStyle } from 'variables/styles';
import { Button, Menu } from 'material-ui';
import MenuItem from 'material-ui/Menu/MenuItem';
import { Redirect } from 'react-router-dom';
import {auth} from 'config_db/firebase';
import NativeSelect from '@material-ui/core/NativeSelect';
import { Dropdown } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import config from 'views/config.js';

import secureStorage from 'secureStorage';

import getQueries from 'queries/getQueries';
import updateQueries from 'queries/updateQueries';
import setQueries from 'queries/setQueries';
class HeaderLinks extends React.Component {
  state = {
    user_out: false,
  }

  componentDidMount = () => {
	  let user_name = localStorage.getItem("storyShop_user_name");
	  const uid = localStorage.getItem("storyShop_uid");

	  //const ref = fire.database().ref();
	  //const user = ref.child("user");
	  //const child = user.child(uid);

	  if (uid) {
		  const usDB = (error, result) => {
				if (error) {
					console.log(error);
				} else {
					if (result.status === 0) {
						this.handleLogout();
					}
				}
			 }
		   getQueries.getUserWithDoc(uid,usDB);
	  }

	  /* if (!user_name) {
		  child.once("value").then(snapshot => user_name = snapshot.val().user_name);
	  } */

	  this.setState({user_name});
  }

  handleLogout = () => {
    auth.signOut()
        .then(() => {
          localStorage.clear();
          secureStorage.clear();
          //this.setState({ user_out: true });
          window.location.assign(config.HOST_URL + '/wp-json/reactapi/logout');
        })
        .catch( (error) => {
          alert(error)
        });
  }

  handleChange = event => {
	  if (event.target.value === "logout") {
		  this.handleLogout();
	  }
  }

  handleClick = (name, event) => {
    this.setState({ [name]: event.currentTarget });
  };

  handleClose = name => {
    this.setState({ [name]: null });
  };

  handleDropChange = (event, { name, value }) => {
	  if (value.toLowerCase() === "logout") {
		  this.handleLogout();
	  } else if (value.toLowerCase() === "upgrade") {
      window.location.assign(config.HOST_URL + '/product/storyshop/');
    } else if (value.toLowerCase() === "account_management") {
      window.location.assign(config.HOST_URL + '/account/');
    }
  }

  render(){
    const { classes } = this.props;
    const { user_out, user_name, anchorEl } = this.state;

    if (user_out) {
      return <Redirect to='/login' />
    }

    const token = secureStorage.getItem("storeToken");
    let account_type = "Lite";

    if (token) {
      account_type = token.account_type;
    }

    let options = [
      {text: user_name, value: "user"},
      {text: "Account Management", value: "account_management"},
      {text: "Upgrade to Pro!", value: "upgrade"},
      {text: "Logout", value: "logout"}
    ];

    if (account_type === "Pro") {
      options = [
        {text: user_name, value: "user"},
        {text: "Account Management", value: "account_management"},
        {text: "Logout", value: "logout"}
      ];
    }

    return (
      <div className="but_padd">
		<Dropdown selection
		  className='menu-db'
		  icon={<i className="fa fa-angle-down" aria-hidden="true"></i>}
		  name="user_menu"
		  text={user_name}
		  options={options}
		  onChange={this.handleDropChange}
		/>
	  </div>
    );
  }
}

export default withStyles(headerLinksStyle)(HeaderLinks);
