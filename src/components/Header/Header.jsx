import React from 'react';
import PropTypes from 'prop-types';
import {
    Menu
} from 'material-ui-icons';
import { withStyles } from '@material-ui/core/styles';
import {
    AppBar, Toolbar, IconButton, Hidden, Button,
} from 'material-ui';
import { Link, Redirect } from 'react-router-dom';

import { confirmAlert } from 'react-confirm-alert';
import 'assets/css/react-confirm-alert.css';

import { headerStyle } from 'variables/styles';

import HeaderLinks from './HeaderLinks';
import logo from 'assets/img/logo-white-letters-no-beta.png';
// import logo from 'assets/img/Beta Logo Final.png';
import '@mdi/font/css/materialdesignicons.css';

import secureStorage from 'secureStorage';

import {auth} from 'config_db/firebase';
import config from 'views/config.js';

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

class Header extends React.Component {
  state = {
      redirect: false,
      isHovering: false
  }

  componentDidMount = () => {
    let token = secureStorage.getItem("storeToken");
    const uid = localStorage.getItem("storyShop_uid");

    if (!token) {
      secureStorage.clear();

      // this.setState({ redirect: true });

      return;
    }

    if (uid !== token.user_id) {
      secureStorage.clear();

      return;
    }

    if (uid) {
    	return;
      auth.onAuthStateChanged(user => {
        if (user && user.uid === uid) {
           const usDB = (error, result) => {
				if (error) {
					console.log(error);
				} else {
					if (result.status === 1) {
					const user_name = result.data.user_name || "";
					const account_date = result.data.created_date;
					let account_type = result.data.account_type;
					const expire_date = result.data.expire_date || "";

						if (account_type === "Lite" || account_type === "Trail") {
							token["account_type"] = "Lite";
							secureStorage.setItem("storeToken", token);
						} else if (account_type === "Pro") {
							if (expire_date) {
							  const today = new Date();
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
										account_created_date: account_date,
										isNewUser: result.data.isNewUser,
										doNotShowAgain: result.data.doNotShowAgain || false
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
							} else {
							  token["account_type"] = account_type;
							  secureStorage.setItem("storeToken", token);
							}
						}
					}
				}
			}
			getQueries.getUserWithDoc(uid,usDB);
		}
		else {
          secureStorage.clear();
          localStorage.clear();

          window.location.assign(config.HOST_URL + '/account/');
        }
		
        });
      } 
  }

    
    handleMouseEnter = (event) => {
    	this.setState({ isHovering: true });
    }

    handleMouseLeave = (event) => {
    	this.setState({ isHovering: false });
    }
  

  render() {
    const { classes, color } = this.props;
    const uid = localStorage.getItem("storyShop_uid");

    if (!uid || this.state.redirect) {
      // return <Redirect to="/login" />
    }
    // classes.appBar + (color !== undefined ? " " + classes[color]:"") + " main-header"

    return (
      <header className="main-header app-bar">
	<div className= "default-hd-app cont-inner">
		<div className="header-cont">
          <div className="header-flex">
            {/* Here we create navbar brand, based on route name */}
            <Link
	            className='dashboard-logo' 
	            to='/dashboard'>
	            <img src={logo}/>
                <span className="fixed-hov-ob">Return to Dashboard</span>
            </Link>
          </div>

          {uid && (<HeaderLinks />)}

					{/*}<Hidden mdUp>
						<IconButton
							className={classes.appResponsive}
							color="inherit"
							aria-label="open drawer"
							onClick={this.props.handleDrawerToggle}>
							<Menu />
						</IconButton>
					</Hidden>*/}
			</div>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  color: PropTypes.oneOf(["primary","info","success","warning","danger"])
};

export default withStyles(headerStyle, { withTheme: true })(Header);
