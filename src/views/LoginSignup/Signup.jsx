import React from 'react';
import { TextField, Button, Checkbox } from 'material-ui';
import  { Link, Redirect } from 'react-router-dom';
import {auth, db} from 'config_db/firebase';
import { confirmAlert } from 'react-confirm-alert';
import 'assets/css/react-confirm-alert.css';

class SignUp extends React.Component {
  state = {
    fields: {},
    errors: {},
    signup : 'Sign Up',
    success: false,
  }

  handleCaptchaChange = (value) => {
    this.setState({ value });
  }

  handleChange = (event) => {
    let { fields } = this.state;
    const { name, value } = event.target;

    fields[name] = value.trim();
    this.setState({ fields });
  }

  submitSignUpForm = (event) => {
    event.preventDefault();

    const { fields } = this.state;
    const fname = fields.fname;
    const lname = fields.lname;
    const email = fields.emailid;
    const password = fields.password;

    if (this.validateForm()) {
      auth
          .createUserWithEmailAndPassword(email, password)
          .then( (data) => {
            let ref = db.ref();
            let user = ref.child("user");
            let child = user.child(data.user.uid);
            let user_data = {
              user_name: `${fname} ${lname}`,
			        email_id: email,
              created_date: new Date().toISOString(),
              account_type: "Trial",
            }

            child.set(user_data);

			confirmAlert({
			  title: 'You have successfully registered',
			  message: `You will use this ${email} to log in`,
			  buttons: [
				{
				  label: 'Ok',
				  onClick: () => this.setState({success: true})
				}
			  ]
			});
          })
          .catch( (error) => {
            alert(error.message);
          } );

      this.setState({ signup : 'Sign Up....'});
    }
  }

  validateForm = () => {
    let { fields } = this.state;
    let errors = {};
    let formIsValid = true;

    if (!fields["fname"]) {
      formIsValid = false;
      errors["fname"] = "*Please enter your First Name.";
    }

    if (typeof fields["fname"] !== "undefined") {
      if (fields["fname"].match(/^[a-zA-Z ]*$/) === null) {
        formIsValid = false;
        errors["fname"] = "*Please enter alphabet characters only.";
      }
    }
    if (!fields["lname"]) {
      formIsValid = false;
      errors["lname"] = "*Please enter your Last Name.";
    }

    if (typeof fields["lname"] !== "undefined") {
      if (!fields["lname"].match(/^[a-zA-Z ]*$/)) {
        formIsValid = false;
        errors["lname"] = "*Please enter alphabet characters only.";
      }
    }
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

    if (typeof fields["password"] !== "undefined") {
      if (!fields["password"].match(/^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/)) {
        formIsValid = false;
        errors["password"] = "*Password is required (minimum 8 characters with letters, digits and special characters).";
      }
    }
	  if (!fields["agree"]) {
      formIsValid = false;
      errors["agree"] = "*Please accept the user agreement.";
    }

    this.setState({ errors });

    return formIsValid;
  }

  render() {
    const { fields, errors, checked, signup, success } = this.state;

    if (success) {
      return <Redirect to='/login' />
    }

    if (localStorage.getItem('storyShop_uid')) {
      return <Redirect to='/' />
    }

    return (
      <div id="main-SignUp-container" className="login-container">
        <div id="signup" className="inner_box">
          <h3>Sign Up</h3>
          <form name="SignUpForm"  onSubmit= {this.submitSignUpForm} >

            <TextField autoFocus margin="dense" id="fname" label="First Name" type="text" name="fname" value={fields.fname} onChange={this.handleChange} fullWidth/>
		        <div className="errorMsg">{errors.fname}</div>

		        <TextField margin="dense" id="lname" label="Last Name" type="text" name="lname" value={fields.lname} onChange={this.handleChange} fullWidth/>
		        <div className="errorMsg">{errors.lname}</div>

            <TextField margin="dense" id="email" label="Email Id" type="email" name="emailid" value={fields.emailid} onChange={this.handleChange} fullWidth/>
		        <div className="errorMsg">{errors.emailid}</div>

            <TextField margin="dense" id="password" label="Password" type="password" name="password" value={fields.password} onChange={this.handleChange} fullWidth/>
		        <div className="errorMsg">{errors.password}</div>

            <div className="terms-agree">
              <Checkbox checked={checked} onChange={this.handleChange} value="agree" name="agree" id="agree"/>
		          <p>I certify that I am 18 years of age or older, and I agree to the <a href="/legal/user_agreement" target="_blank" tabindex="-1">User Agreement</a> and <a href="/legal/privacy" target="_blank" tabindex="-1">Privacy Policy</a></p>
            </div>

		        <div className="errorMsg">{errors.agree}</div>

            <Button type="submit" variant="contained" color="primary" className="brown-button" fullWidth>
              {signup}
            </Button>
		        <div className="forgot">
              Already have an account? <Link to="/login">Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default SignUp;
