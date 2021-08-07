import React from 'react';

import DayListItem from 'components/DayListItem';

export default function DayList(props) {
  const { appointments, days, getSpotsForDay, selectedDay, setDay } = props;

  const dayList = days.map(day => (
    <DayListItem
      key={day.id}
      name={day.name}
      spots={getSpotsForDay(appointments, days, day.name)|| 5}
      selected={day.name === selectedDay}
      setDay={setDay}
    />
  ));

  return <ul id={dayList}>{dayList}</ul>;
}
