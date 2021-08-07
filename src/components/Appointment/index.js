import React, { useEffect } from 'react';

import './styles.scss';
import Confirm from './Confirm';
import Empty from './Empty';
import Error from './Error';
import Form from './Form';
import Header from './Header';
import Show from './Show';
import Status from './Status';

import useVisualMode from 'hooks/useVisualMode';

export default function Appointment(props) {
  const {
    bookInterview,
    cancelInterview,
    id,
    interview,
    interviewers,
    time
  } = props;

  const CONFIRM = 'CONFIRM';
  const CREATE = 'CREATE';
  const DELETING = 'DELETING';
  const EDIT = 'EDIT';
  const EMPTY = 'EMPTY';
  const ERROR_DELETE = 'ERROR_DELETE';
  const ERROR_SAVE = 'ERROR_SAVE';
  const SAVING = 'SAVING';
  const SHOW = 'SHOW';

  // Tracks initial mode, submits SHOW or EMPTY based on (interview === null)?
  const { mode, transition, back } = useVisualMode(interview ? SHOW : EMPTY);

  // Changes the state when the update comes from Web Sockets
  useEffect(() => {
    if (interview && mode === EMPTY) {
      transition(SHOW);
    }
    if (interview === null && mode === SHOW) {
      transition(EMPTY);
    }
  }, [interview, transition, mode]);

  // Creates an interview object
  function genInterview(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    return interview;
  }

  // Outputs one Appointment
  return (
    <article className="appointment" data-testid="appointment">
      <Header time={time} />
      {mode === CONFIRM && (
        <Confirm
          onCancel={() => transition(SHOW)}
          onConfirm={() => {
            transition(DELETING, true);
            cancelInterview(id)
              .then(() => transition(EMPTY))
              .catch(() => {
                transition(ERROR_DELETE, true);
              });
          }}
          message="Are you sure you would like to delete?"
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={interviewers}
          onSave={(name, interviewer) => {
            transition(SAVING);
            bookInterview(id, genInterview(name, interviewer))
              .then(() => transition(SHOW))
              .catch(() => {
                transition(ERROR_SAVE, true);
              });
          }}
          onCancel={() => back()}
        />
      )}
      {mode === DELETING && <Status message="Deleting" />}
      {mode === EDIT && (
        <Form
          name={interview.student}
          interviewer={interview.interviewer.id}
          interviewers={interviewers}
          onSave={(name, interviewer) => {
            transition(SAVING);
            bookInterview(id, genInterview(name, interviewer))
              .then(() => transition(SHOW))
              .catch(() => {
                transition(ERROR_SAVE, true);
              });
          }}
          onCancel={() => back()}
        />
      )}
      {(mode === EMPTY || mode === SHOW) && !interview && (
        <Empty onAdd={() => transition(CREATE)} />
      )}
      {mode === ERROR_DELETE && (
        <Error message="Could not delete appointment." onClose={() => back()} />
      )}
      {mode === ERROR_SAVE && (
        <Error message="Could not save appointment." onClose={() => back()} />
      )}
      {mode === SAVING && <Status message="Saving" />}
      {(mode === EMPTY || mode === SHOW) && interview && (
        <Show
          student={interview.student}
          interviewer={interview.interviewer}
          onEdit={() => transition(EDIT)}
          onDelete={() => transition(CONFIRM)}
        />
      )}
    </article>
  );
}
