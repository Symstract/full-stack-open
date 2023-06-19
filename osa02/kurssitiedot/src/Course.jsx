const Header = ({ name }) => {
  return <h1>{name}</h1>;
};

const Part = ({ part, exercises }) => {
  return (
    <p>
      {part} {exercises}
    </p>
  );
};

const Content = ({ parts }) => {
  return (
    <ul>
      {parts.map((part, index) => (
        <li key={index}>
          <Part part={part.name} exercises={part.exercises} />
        </li>
      ))}
    </ul>
  );
};

const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0);

  return <p>total of {total} exercises</p>;
};

const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default Course;
