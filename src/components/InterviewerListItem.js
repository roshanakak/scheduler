import React from "react";

import "components/InterviewerListItem.scss";

import classnames from "classnames";

export default function DayListItem(props) {

  const liClass = classnames("interviewers__item", {
    "interviewers__item--selected": props.selected
  });


  return (
    <li className={liClass} onClick={() => props.setInterviewer(props.name)}>
      <img
        key={props.id}
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      /> 
      {props.name}
    </li>
  );
}