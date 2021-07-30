import React from "react";
import { useDispatch } from "react-redux";
import { addNewAnecdote } from "../reducers/anecdoteReducer";
import { notificationChange } from "../reducers/notificationReducer";

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addAnecdote = async (e) => {
    e.preventDefault();
    const content = e.target.anecdote.value;
    e.target.anecdote.value = "";
    dispatch(addNewAnecdote(content));
    dispatch(notificationChange(`you added "${content}"`));
    setTimeout(() => {
      dispatch(notificationChange(""));
    }, 5000);
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;
