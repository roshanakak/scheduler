import { useEffect, useReducer } from 'react';

import {
  reducer,
  SET_APPLICATION_DATA,
  SET_DAY,
  SET_INTERVIEW
} from 'reducers/application';

import axios from "axios";

export default function useApplicationData() {

  // Manages the state
  // Interacts with the reducer
  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({ type: SET_DAY, day });

  // Retrieves days, appointments and interviewers from API
  // sends the info to dispatch to update the state
  useEffect(() => {
    // const source = axios.CancelToken.source();
    const days = axios.get(`/api/days`, {
      proxy: { host: 'localhost', port: 3001 },
      // cancelToken: source.token,
    });
    const appointments = axios.get(`/api/appointments`, {
      proxy: { host: 'localhost', port: 3001 },
      // cancelToken: source.token,
    });
    const interviewers = axios.get(`/api/interviewers`, {
      proxy: { host: 'localhost', port: 3001 },
      // cancelToken: source.token,
    });
    Promise.all([days, appointments, interviewers]).then(
      ([days, appointments, interviewers]) =>
        dispatch({
          type: SET_APPLICATION_DATA,
          days: days.data,
          appointments: appointments.data,
          interviewers: interviewers.data
        })
    )
    // .cath((e) => console.log("HEY ERRROR!!!!"));
    // return () => {
      // source.cancel('Request canceled');
    // };
  }, []);

  // Sends new appointment request to API
  // sends the info to dispatch to update the state
  const bookInterview = function(id, interview) {
    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then(() => {
        dispatch({ type: SET_INTERVIEW, id, interview });
      });
  };

  // Sends cancellation request to API
  // sends the info to dispatch to update the state
  const cancelInterview = function(id) {
    return axios
      .delete(`/api/appointments/${id}`)
      .then(() => {
        dispatch({ type: SET_INTERVIEW, id, interview: null });
      });
  };

  // Responsible for the Web Socket connection
  useEffect(() => {
    const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    socket.onmessage = function(event) {
      const data = JSON.parse(event.data);

      if (typeof data === 'object' && data.type) {
        return dispatch(data);
      }
    };
    return () => socket.close();
  }, []);

  return { bookInterview, cancelInterview, state, setDay };
}
