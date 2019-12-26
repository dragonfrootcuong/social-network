import axios from 'axios';
import {GET_PROFILE, PROFILE_ERROR, DELETE_EXPERIENCE, DELETE_EDUCATION} from './types';
import {setAlert} from './alert';

export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me');
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

export const createProfile = (form, history, edit = false) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }; 
        await axios.post('/api/profile', form, config);
        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success', 3000));
        history.push('/dashboard');
    } catch (err) {
        dispatch(setAlert('Wrong went create profile', 'danger', 3000));
        history.push('/create-profile');
    }
}

// Add Experience
export const addExperience = (form, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }; 
        await axios.put('/api/profile/experience', form, config);
        dispatch(setAlert('Added Experience','success', 3000));
        history.push('/dashboard');
    } catch (err) {
        dispatch(setAlert('Wrong when add experience', 'danger', 3000));
        history.push('/add-experience');
    }
}

// Add Education
export const addEducation = (form, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }; 
        await axios.put('/api/profile/education', form, config);
        dispatch(setAlert('Added Education','success', 3000));
        history.push('/dashboard');
    } catch (err) {
        dispatch(setAlert('Wrong when add education', 'danger', 3000));
        history.push('/add-education');
    }
}

// Delete Experience
export const delExperience = (expId, history) => async dispatch => {
    try { 
        const res = await axios.delete('/api/profile/experience/' + expId);
        dispatch({
            type: DELETE_EXPERIENCE,
            payload:res.data
        });
        dispatch(setAlert('Delete Experience','success', 3000));
        history.push('/dashboard');
    } catch (err) {
        dispatch(setAlert('Something When Wrong', 'danger', 3000));
        history.push('/dashboard');
    }
}

// Delete Experience
export const delEducation = (expId, history) => async dispatch => {
    try { 
        const res = await axios.delete('/api/profile/education/' + expId);
        dispatch({
            type: DELETE_EDUCATION,
            payload:res.data
        });
        dispatch(setAlert('Delete Education','success', 3000));
        history.push('/dashboard');
    } catch (err) {
        dispatch(setAlert('Something When Wrong', 'danger', 3000));
        history.push('/dashboard');
    }
}