import React from "react";

import "components/DayListItem.scss";

import classnames from "classnames";

export default function DayListItem(props) {
  const liClass = classnames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": !props.spots
  });

  return (
    <li className={liClass} onClick={props.setDay}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}

const formatSpots = function(spots) {
  let str = '';
  if (spots === 0) {
    str = 'no spots remaining'; 
  } else if (spots === 1) {
    str = '1 spot remaining'; 
  } else {
    str = `${spots} spots remaining`;
  }
  return str;
}