import React, {Fragment, useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import {Link, withRouter, Redirect} from 'react-router-dom';
import {addEducation, getCurrentProfile} from '../../actions/profile';
import Spinner from '../layout/Spinner';

const AddEducation = ({profile: {profile, loading}, getCurrentProfile, addEducation, history}) => {
    const [formData, setFormData] = useState({
        school: '',
        degree: '',
        fieldofstudy: '',
        from: '',
        current: false,
        to: '',
        description: ''
    });
    const {school, degree, fieldofstudy, from, current, to, description} = formData;

    const onSubmit = (e) => {
        e.preventDefault();
        addEducation(formData, history);
    }

    const onChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const toggleCurrentDate = (e) => {
        setFormData({...formData, [e.target.name]: !current})
    }
    useEffect(() => {
       getCurrentProfile()
    }, [getCurrentProfile])
    return loading ? (<Spinner />) : !profile ? (<Redirect to='/create-profile' />):(
        <Fragment>
             <section className="container">
            <h1 className="large text-primary">
                Add Your Education
            </h1>
            <p className="lead">
                <i className="fas fa-graduation-cap"></i> Add any school, bootcamp, etc that
                you have attended
            </p>
            <small>* = required field</small>
            <form className="form" onSubmit={(e) => onSubmit(e)}>
                <div className="form-group">
                <input
                    type="text"
                    placeholder="* School or Bootcamp"
                    name="school"
                    required
                    value={school} onChange={(e) => onChange(e)}
                />
                </div>
                <div className="form-group">
                <input
                    type="text"
                    placeholder="* Degree or Certificate"
                    name="degree"
                    required
                    value={degree} onChange={(e) => onChange(e)}
                />
                </div>
                <div className="form-group">
                <input type="text" placeholder="Field Of Study" name="fieldofstudy" value={fieldofstudy} onChange={(e) => onChange(e)}/>
                </div>
                <div className="form-group">
                <h4>From Date</h4>
                <input type="date" name="from" value={from} onChange={(e) => onChange(e)}/>
                </div>
                <div className="form-group">
                <p>
                    <input type="checkbox" name="current" value={current} onClick={(e) => toggleCurrentDate(e)} /> Current School or Bootcamp
                </p>
                </div>
                <div className="form-group">
                <h4>To Date</h4>
                <input type="date" name="to" disabled={current ? 'disabled' : ''} value={to} onChange={(e) => onChange(e)}/>
                </div>
                <div className="form-group">
                <textarea
                    name="description"
                    cols="30"
                    rows="5"
                    placeholder="Program Description"
                    value={description} onChange={(e) => onChange(e)}
                ></textarea>
                </div>
                <input type="submit" className="btn btn-primary my-1" />
                <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
            </form>
            </section>
        </Fragment>
    )
}

AddEducation.propTypes = {
    profile: PropTypes.object.isRequired,
    getCurrentProfile: PropTypes.func.isRequired,
    addEducation: PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    profile: state.profile
});
export default connect(mapStateToProps, {getCurrentProfile, addEducation})( withRouter(AddEducation))
