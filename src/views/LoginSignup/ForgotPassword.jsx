import React from 'react';
import { TextField, Button } from 'material-ui';
import { Link, Redirect } from "react-router-dom";
import {auth} from 'config_db/firebase';

class ForgotPassword extends React.Component {
  state = {
    fields: {},
    errors: {},
	  forgot : 'Reset Password',
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    let { fields } = this.state;

    fields[name] = value;

    this.setState({ fields });
  }

  submitForgotForm = (event) => {
    event.preventDefault();

    if (this.validateForm()) {
      let auth = auth
      let email = this.state.fields.emailid;

      auth.sendPasswordResetEmail(email)
          .then(() => alert("Please Check Your email"))
          .catch((error) => alert(error.message))

      this.setState({ value: "", forgot : 'Reset Password....'});
    }
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

    this.setState({ errors });

    return formIsValid;
  }

  render() {
    const { errors, fields, forgot } = this.state;

    if (localStorage.getItem('storyShop_uid')) {
      return <Redirect to='/' />
    }

    return (
      <div id="main-Forgot-container" className="login-container">
        <div id="forgot" className="inner_box">
          <h3>Forgot Password</h3>
          <div className="errorMsg">{errors.invalidMail}</div>
		      <div className="successMsg">{errors.successMail}</div>
          <form method="post"  name="ForgotForm"  onSubmit= {this.submitForgotForm} >
            <TextField margin="dense" id="email" label="Email Id" type="email" name="emailid" value={fields.emailid} onChange={this.handleChange} fullWidth/>
		        <div className="errorMsg">{errors.emailid}</div>

		        <Button type="submit" variant="outlined" color="primary" fullWidth>
              {forgot}
            </Button>

		        <div className="forgot">
		          Dont have an account yet? <Link to="/signup">Sign Up</Link>
		          <br/>
              Already have an account? <Link to="/login" class="password-reset">Sign In</Link>
            </div>
          </form>
        </div>
      </div>

    );
  }
}

export default ForgotPassword;
