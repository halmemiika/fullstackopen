import React from "react";
import { Props, CoursePart } from "../types";

const Content = ({ courseParts }: Props) => {
  return (
    <>
      {courseParts.map((course: CoursePart) => (
        <p key={course.name.length}>
          {course.name} {course.exerciseCount}
        </p>
      ))}
    </>
  );
};

export default Content;
