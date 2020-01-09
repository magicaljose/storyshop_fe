import React from 'react';
import PropTypes from 'prop-types';
import secureStorage from 'secureStorage';
import { withStyles } from '@material-ui/core/styles';
import { Switch, Route, Redirect } from 'react-router-dom';

// creates a beautiful scrollbar
import PerfectScrollbar from 'perfect-scrollbar';
import "perfect-scrollbar/css/perfect-scrollbar.css";
import config from 'views/config.js';

import { Header } from 'components';

import appRoutes from 'routes/app.jsx';

// import { appStyle } from 'variables/styles';

const drawerWidth = 260;

const transition = {
    WebkitTransition: 'all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)',
    MozTransition: 'all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)',
    OTransition: 'all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)',
    MsTransition: 'all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)',
    transition: 'all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)',
};

const container = {
    paddingRight: '15px',
    paddingLeft: '15px',
    marginRight: 'auto',
    marginLeft: 'auto',
};

const appStyle = theme => ({
    wrapper: {
        position: 'relative',
        top: '0',
        height: '100vh',
    },
    mainPanel: {
        [theme.breakpoints.up('md')]: {
            width: `calc(100% - ${drawerWidth}px)`,
        },
        overflow: 'auto',
        position: 'relative',
        float: 'right',
        ...transition,
        maxHeight: '100%',
        width: '100%',
    },
    content: {
        marginTop: '70px',
        padding: '30px 15px',
        minHeight: 'calc(100% - 123px)',
    },
    container,
    map:{
        marginTop: '70px',
    }
});

const switchRoutes = (<Switch>
  {
    appRoutes.map((prop,key) => {
      if (prop.redirect)
        return (
          <Redirect exact from={prop.path} to={prop.to} key={key}/>
        );

    	  return (
    		  <Route exact path={prop.path} component={prop.component} key={key}/>
    	  );
    })
  }
</Switch>);

class App extends React.Component{
  state = {
    mobileOpen: false,
  };

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  getRoute(){
    return this.props.location.pathname !== "/maps";
  }

  componentWillMount() {
    let token = secureStorage.getItem("storeToken");

      if (token) {
        if (token.exp) {
            if (token.exp < new Date().getTime()) {
                localStorage.clear();

                window.location.assign(config.HOST_URL + "/account/");
            }
        } else {
            localStorage.clear();
            secureStorage.clear();

            window.location.assign(config.HOST_URL + "/account/");
        }
      }
  }

  componentDidMount(){
    if(window.innerWidth > 991)
      {
        // eslint-disable-next-line
        // const ps = new PerfectScrollbar(this.refs.mainPanel);
      }
  }

  componentDidUpdate(){
    this.refs.mainPanel.scrollTop = 0;
  }

  render(){
    const { classes, ...rest } = this.props;
    return (
      <div className="app-wrapper" ref="mainPanel">
        <Header
          routes={appRoutes}
          handleDrawerToggle={this.handleDrawerToggle}
          {...rest}
        />
        {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
        {
          this.getRoute() ?(
            <div id="main-pg" className="app-cont-3">
              <div className="default-app">
                {switchRoutes}
              </div>
            </div>
          ):(
            <div className={classes.map}>
              {switchRoutes}
            </div>
          )
        }
        {/*this.getRoute() ? (<Footer />):(null)*/}
      </div>
      //</div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(appStyle, { withTheme: true })(App);
