import React from "react";

const Part = ({ parts }) => {
  const total = parts.map((obj) => obj.exercises).reduce((a, b) => a + b);
  return (
    <>
      {parts.map((part) => (
        <p key={part.id}>
          {part.name} {part.exercises}
        </p>
      ))}
      <h3>total of {total} exercises</h3>
    </>
  );
};

const Content = ({ name, parts }) => {
  return (
    <>
      <h1>{name}</h1>
      <Part parts={parts} />
    </>
  );
};

const Course = ({ courses }) => {
  return (
    <>
      {courses.map((course) => (
        <Content key={course.id} name={course.name} parts={course.parts} />
      ))}
    </>
  );
};

export default Course;
