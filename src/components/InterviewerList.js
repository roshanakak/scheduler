import React from "react";

import "components/InterviewerList.scss";
import InterviewerListItem from "components/InterviewerListItem";


export default function DayList(props) {

  

  // return (
  //   <section className="interviewers">
  //     <h4 className="interviewers__header text--light">Interviewer</h4>
  //     <ul className="interviewers__list"></ul>
  //   </section>
  // );



  return (
    <section className="interviewers">
    <h4 className="interviewers__header text--light">Interviewer</h4>
    <ul className="interviewers__list"></ul>
      {
        props.interviewers.map(interviewer => (
          <InterviewerListItem 
            id={interviewer.id}
            name={interviewer.name} 
            avatar={interviewer.avatar} 
            selected={interviewer.selected}
            setInterviewer={props.setInterviewer}  
          />
          ))
      }
    <ul className="interviewers__list"></ul>
    </section>
  )

}