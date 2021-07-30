import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { voteFor } from "../reducers/anecdoteReducer";
import { notificationChange } from "../reducers/notificationReducer";

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </>
  );
};

const AnecdoteList = () => {
  const filter = useSelector((state) => state.filter);
  const anecdotes = useSelector((state) => state.anecdote);
  const filteredAnecdotes = anecdotes.filter(
    (anecdote) =>
      anecdote.content.toLowerCase().indexOf(filter.toLowerCase()) !== -1
  );
  const dispatch = useDispatch();

  return (
    <>
      {filteredAnecdotes.map((anecdote) => (
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => {
            dispatch(voteFor(anecdote.id));
            dispatch(notificationChange(`you voted for "${anecdote.content}"`));
            setTimeout(() => {
              dispatch(notificationChange(""));
            }, 5000);
          }}
        />
      ))}
    </>
  );
};

export default AnecdoteList;
