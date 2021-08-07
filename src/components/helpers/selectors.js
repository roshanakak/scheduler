// Appointments for a given day
export const getAppointmentsForDay = (state, day) => {
  const appointmentsId = state.days
    .filter(e => e.name === day)
    .map(e => e.appointments)
    .reduce((acc, val) => acc.concat(val), []);

  const appointment = [];
  appointmentsId.forEach(e => {
    appointment.push(state.appointments[e]);
  });

  return appointment;
};

// Interviewers for a given day
export const getInterviewersForDay = (state, day) => {
  const interviewersId = state.days
    .filter(e => e.name === day)
    .map(e => e.interviewers)
    .reduce((acc, val) => acc.concat(val), []);

  const interviewers = [];

  interviewersId.forEach(e => {
    interviewers.push(state.interviewers[e]);
  });

  return interviewers;
};

// Returns an object: {student, interviewer}
export const getInterview = (state, interview) => {
  if (!interview) {
    return null;
  } else {
    const student = interview.student;
    const interviewer = state.interviewers[interview.interviewer];
    const interviewObj = { student, interviewer };
    return interviewObj;
  }
};

// Returns the number of spots taken
export const getSpotsForDay = (appointments, days, day) => {
  const targetDay = days.find(e => e.name === day);
  const appointmentList = [...targetDay.appointments];
  const availableSpots = appointmentList.length;

  const appointmentsSpread = { ...appointments };

  const filledSpots = Object.values(appointmentsSpread).reduce(
    (total, appointment) => {
      if (appointmentList.includes(appointment.id)) {
        if (appointment.interview) {
          return total + 1;
        }
      }
      return total;
    },
    0
  );

  return availableSpots - filledSpots;
};
