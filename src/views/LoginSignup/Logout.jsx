import React from 'react';

import {auth} from 'config_db/firebase';
import secureStorage from 'secureStorage';
import config from 'views/config.js';

import loading from 'assets/img/loding_loding.gif';

class Logout extends React.Component {
  componentDidMount = () => {
    this.handleLogout();
  }

  handleLogout = () => {
    auth.signOut()
        .then(() => {
          localStorage.clear();
          secureStorage.clear();

          window.location.assign(config.HOST_URL);
        })
        .catch( (error) => {
          console.log(error);
        });
  }

  render() {
    return (
      <center className='load-cntr'>
        <img src={loading} alt="loading..." />
      </center>
    )
  }
};

export default Logout;
