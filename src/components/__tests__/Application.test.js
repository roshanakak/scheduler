/*
  We are rendering `<Application />` down below, so we need React.createElement
*/
import React from 'react';

/*
  We import our helper functions from the react-testing-library
  The render function allows us to render Components
*/
import {
  cleanup,
  fireEvent,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  getByText,
  prettyDOM,
  queryByAltText,
  queryByText,
  render,
  waitForElement
} from '@testing-library/react';

/*
  We import the component that we are testing
*/
import Application from 'components/Application';

import axios from 'axios';

afterEach(cleanup);

describe('Appointment', () => {
  it('1. defaults to Monday and changes the schedule when a new day is selected (promise)', () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText('Monday')).then(() => {
      fireEvent.click(getByText('Tuesday'));
      expect(getByText('Leopold Silvers')).toBeInTheDocument();
    });
  });

  it('2. changes the schedule when a new day is selected ES2017 (await)', async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText('Monday'));

    fireEvent.click(getByText('Tuesday'));

    expect(getByText('Leopold Silvers')).toBeInTheDocument();
  });

  it('3. loads data, books an interview and reduces the spots remaining for the first day by 1', async () => {
    // const { container } = render(<Application />);

    // await waitForElement(() => getByText(container, "Archie Cohen"));
    // const appointments = getAllByTestId(container, "appointment");
    // const appointment = getAllByTestId(container, "appointment")[0];

    // console.log(prettyDOM(appointments));
    // console.log(prettyDOM(appointment));

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, 'Add'));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones' }
    });
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));

    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, 'Lydia Miller-Jones'));

    const day = getAllByTestId(container, 'day').find(day =>
      queryByText(day, 'Monday')
    );

    expect(getByText(day, '5 spots remaining')).toBeInTheDocument();
  });

  it('4. loads data, cancels an interview and increases the spots remaining for Monday by 1', async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, 'appointment').find(
      appointment => queryByText(appointment, 'Archie Cohen')
    );

    fireEvent.click(queryByAltText(appointment, 'Delete'));

    // 4. Check that the confirmation message is shown.
    expect(
      getByText(appointment, 'Are you sure you would like to delete?')
    ).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, 'Confirm'));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, 'Deleting')).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, 'Add'));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, 'day').find(day =>
      queryByText(day, 'Monday')
    );

    expect(getByText(day, '2 spots remaining')).toBeInTheDocument();

    // debug();
  });

  it('5. loads data, edits an interview and keeps the spots remaining for Monday the same', async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // 3. Click the "Edit" button on the booked appointment.
    const appointment = getAllByTestId(container, 'appointment').find(
      appointment => queryByText(appointment, 'Archie Cohen')
    );

    fireEvent.click(queryByAltText(appointment, 'Edit'));

    // 4. Target the field with enter student name
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones' }
    });

    // 5. Save appointment
    fireEvent.click(getByText(appointment, 'Save'));

    // 6. Saving sate
    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    // 7. Once saved, wait for appointment "Lydia Miller-Jones" to display
    await waitForElement(() => getByText(appointment, 'Lydia Miller-Jones'));

    // 8. For Monday
    const day = getAllByTestId(container, 'day').find(day =>
      queryByText(day, 'Monday')
    );

    // 9. Make sure that the amount of spots is still at one
    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();
  });

  it('6. shows the save error when failing to save an appointment', async () => {
    // Setting: Fake an error with axios (once)
    axios.put.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // 3. Get the first spot
    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments[0];

    // 4. Add an appointment
    fireEvent.click(getByAltText(appointment, 'Add'));

    // 5. Enters the name for an appointment
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones' }
    });
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));

    // 6. Click the "Save" button on the confirmation.
    fireEvent.click(getByText(appointment, 'Save'));

    // 7. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    // 8. An error should be rendered.
    await waitForElement(() =>
      getByText(appointment, 'Could not save appointment.')
    );
  });

  it('7. shows the delete error when failing to delete an existing appointment', async () => {
    // Setting: Fake an error with axios (once)
    axios.delete.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, 'appointment').find(
      appointment => queryByText(appointment, 'Archie Cohen')
    );

    fireEvent.click(queryByAltText(appointment, 'Delete'));

    // 4. Check that the confirmation message is shown.
    expect(
      getByText(appointment, 'Are you sure you would like to delete?')
    ).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, 'Confirm'));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, 'Deleting')).toBeInTheDocument();

    // 7. An error should be rendered.
    await waitForElement(() =>
      getByText(appointment, 'Could not delete appointment.')
    );
  });
});
