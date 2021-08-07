import React from 'react';

import 'components/DayListItem.scss';

const classNames = require('classnames');

export default function DayListItem(props) {
  const { name, spots, selected, setDay } = props;

  const liClass = classNames('day-list__item', {
    'day-list__item--selected': selected,
    'day-list__item--full': spots === 0
  });

  return (
    <li className={liClass} onClick={() => setDay(name)} data-testid="day">
      <h2>{name}</h2>
      <h3>
        {(spots ? (spots === 1 ? '1 spot ' : spots + ' spots ') : 'no spots ') +
          'remaining'}
      </h3>
    </li>
  );
}
