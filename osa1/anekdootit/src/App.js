import React, { useState } from "react";

const Header = (props) => {
  return <h1>{props.text}</h1>;
};

const Button = (props) => {
  return <button onClick={props.handleClick}>{props.text}</button>;
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
  ];

  const [selected, setSelected] = useState(0);
  const [allVotes, setVote] = useState(Array(anecdotes.length).fill(0));
  console.log(allVotes);
  const copy = [...allVotes];
  const maxVoteIndex = allVotes.indexOf(Math.max.apply(Math, allVotes));

  const addVote = () => {
    copy[selected] += 1;
    setVote(copy);
  };

  return (
    <div>
      <Header text="Anecdote of the day" />
      <p>{anecdotes[selected]}</p>
      <p>has {allVotes[selected]} votes</p>
      <Button handleClick={addVote} text="vote" />
      <Button
        handleClick={() =>
          setSelected(Math.floor(Math.random() * anecdotes.length))
        }
        text="next anecdote"
      ></Button>
      <Header text="Anecdote with most votes" />
      <p>{anecdotes[maxVoteIndex]}</p>
      <p>has {allVotes[maxVoteIndex]} votes</p>
    </div>
  );
};

export default App;
