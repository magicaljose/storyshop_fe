import React from 'react';
import { Button, TextField } from 'material-ui';
import { Redirect } from 'react-router-dom';
import {auth} from 'config_db/firebase';
import query_string from 'query-string';

class Resetpassword extends React.Component {
  state = {
    fields: {},
    errors: {},
	  success:'',
	  reset:'Reset Password',
    resetSuccess: false,
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    let { fields } = this.state;

    fields[name] = value;

    this.setState({ fields });
  }

  submitRestForm = (event) => {
    event.preventDefault();
    let errors = {};

    if (this.validateForm()) {
      let auth = auth;
      let query = this.props.location.search;

      if (query) {
        let actionCode = query_string
          .parse(query, { ignoreQueryPrefix: true })
          .oobCode;

        auth.verifyPasswordResetCode(actionCode)
            .then( () => {
              let newPassword = this.state.fields.password;

              auth.confirmPasswordReset(actionCode, newPassword)
                  .then( () => this.setState({resetSuccess: true}))
                  .catch( (error) => {
                    errors['invalidUser'] = error;
                    this.setState({errors});
                  })
            })
            .catch( (error) => {
              errors['invalidUser'] = error.message;
              this.setState({errors});
            })
      }
      else {
        errors['invalidUser'] = "* You are on wrong place. Please play pogo on your TV";
        this.setState({errors});
      }
    }
  }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields['password']) {
      formIsValid = false;
      errors['password'] = "*Please enter your password";
    }

    if (typeof fields["password"] !== "undefined") {
      if (!fields["password"].match(/^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/)) {
        formIsValid = false;
        errors["password"] = "*Password should be at minimum 8 characters composed of uppercase and lowercase letters, numbers, and special characters.";
      }
    }

    if (!fields['cnfPassword']) {
      formIsValid = false;
      errors['cnfPassword'] = "*Please confirm your password";
    }

    if (fields['password'] !== fields['cnfPassword']) {
      formIsValid = false;
      errors['password'] = "*Please re-check your password";
      errors['cnfPassword'] = "*Please re-check your password";
    }

    this.setState({ errors });

    return formIsValid;
  }

  render() {
    if (this.state.resetSuccess) {
      return <Redirect to="/login" />
    }

    if (localStorage.getItem('storyShop_uid')) {
      return <Redirect to='/' />
    }

	  return(
      <div id="main-Forgot-container" className="login-container">
        <div id="reset" className="inner_box">
          <h3>Reset Password</h3>
          <div className="errorMsg">{this.state.errors.invalidUser}</div>
          <div className="successMsg">{this.state.success}</div>
          <form method="post"  name="ForgotForm"  onSubmit= {this.submitRestForm} >
            <TextField margin="dense" id="password" label="Set New Password" type="password"
              name="password" value={this.state.fields.password} onChange={this.handleChange}
              fullWidth />
		        <div className="errorMsg">{this.state.errors.password}</div>
            <TextField margin="dense" id="cnf_password" label="Confirm Password" type="password"
              name="cnfPassword" value={this.state.fields.cnfPassword} onChange={this.handleChange}
              fullWidth />
		        <div className="errorMsg">{this.state.errors.cnfPassword}</div>

		        <Button type="submit" variant="outlined" color="primary" fullWidth>
				      {this.state.reset}
            </Button>
          </form>
        </div>
      </div>
	  );
  }
}

export default Resetpassword;
