import React, {Fragment} from 'react'
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {logout} from '../../actions/auth';
import PropTypes from 'prop-types';

const Navbar = ({logout, isAuthenticated, loading}) => {
  const authenLink = (
    <ul>
      <li>
        <Link onClick={logout} to='/'>
          <i className='fas fa-sign-out-alt'/>{' '}
          <span className='hide-sm'>Logout</span>
        </Link>
      </li>
    </ul>
  );
    const guestLink = (
      <ul>
      <li><Link to="/">Developers</Link></li>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
    </ul>
    );
    return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/"><i className="fas fa-code"></i> DevConnector</Link>
      </h1>
    {!loading && (<Fragment>{isAuthenticated ? authenLink : guestLink}</Fragment>)}
    </nav>
    )
}

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  loading: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading
});

export default connect(mapStateToProps, {logout})(Navbar);