import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Moment from 'react-moment';
import {delExperience} from '../../actions/profile';
import {withRouter} from 'react-router-dom';

const Experience = ({experience, delExperience, history}) => {
    const experiences = experience.map(exp => {
        return (
            <tr key={exp._id}>
                <td>{exp.title}</td>
                <td className='hide-sm'>{exp.company}</td>
                <td>
                    <Moment format='YYYY/MM/DD'>{exp.from}</Moment> --{' '}
                    {
                        exp.to === null ? (' Now') : (<Moment format='YYYY/MM/DD'>{exp.to}</Moment>)
                    }
                </td>
                <td>
                    <button className='btn btn-danger' onClick={() => delExperience(exp._id, history)}>Delete</button>
                </td>
            </tr>
        );
    })
    return (
        <Fragment>
            <h2 className="my-2">Work Experience</h2>
            <table className="table">
                <thead>
                <tr>
                    <th>Title</th>
                    <th className="hide-sm">Company</th>
                    <th className="hide-sm">Years</th>
                    <th />
                </tr>
                </thead>
                <tbody>{experiences}</tbody>
            </table>
        </Fragment>
    )
}

Experience.propTypes = {
    education: PropTypes.array.isRequired,
    delExperience: PropTypes.func.isRequired
}

export default connect(null, {delExperience})(withRouter(Experience))
