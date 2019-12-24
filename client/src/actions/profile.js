import axios from 'axios';
import {GET_PROFILE, PROFILE_ERROR} from './types';
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