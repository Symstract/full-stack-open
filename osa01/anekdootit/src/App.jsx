import { useState } from "react";

const VoteButton = ({ setPoints, points, selected }) => {
  const handleClick = () => {
    const newPoints = [...points];
    newPoints[selected] += 1;
    setPoints(newPoints);
  };

  return <button onClick={handleClick}>vote</button>;
};

const NextButton = ({ setSelected, count }) => {
  const handleClick = () => {
    setSelected(Math.round(Math.random() * count));
  };

  return <button onClick={handleClick}>next anecdote</button>;
};

const AnecdoteOfTheDay = ({
  anecdotes,
  points,
  setPoints,
  selected,
  setSelected,
}) => {
  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {points[selected]} votes</p>
      <VoteButton setPoints={setPoints} points={points} selected={selected} />
      <NextButton setSelected={setSelected} count={anecdotes.length - 1} />
    </div>
  );
};

const MostVotedAnecdote = ({ anecdotes, points }) => {
  const mostVotes = points.indexOf(Math.max(...points));

  return (
    <div>
      <h2>Anecdote with most votes</h2>
      <p>{anecdotes[mostVotes]}</p>
      <p>has {points[mostVotes]} votes</p>
    </div>
  );
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(new Array(anecdotes.length).fill(0));

  return (
    <div>
      <AnecdoteOfTheDay
        anecdotes={anecdotes}
        points={points}
        setPoints={setPoints}
        selected={selected}
        setSelected={setSelected}
      />
      <MostVotedAnecdote anecdotes={anecdotes} points={points} />
    </div>
  );
};

export default App;
