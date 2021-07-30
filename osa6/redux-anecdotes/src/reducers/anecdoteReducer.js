import anecdoteService from "../services/anecdotes";

const likeOrder = (anecdotes) => {
  return anecdotes.sort((a, b) => (a.votes < b.votes ? 1 : -1));
};

const reducer = (state = [], action) => {
  switch (action.type) {
    case "VOTE":
      const id = action.data.id;
      const votedAnecdote = state.find((a) => a.id === id);
      const changedAnecdote = {
        ...votedAnecdote,
        votes: votedAnecdote.votes + 1,
      };
      const newAnes = state.map((a) => (a.id !== id ? a : changedAnecdote));
      const newOrder = likeOrder(newAnes);
      return newOrder;
    case "NEW_ANECDOTE":
      return [...state, action.data];
    case "INIT_ANECDOTES":
      return action.data;
    default:
      return state;
  }
};

export const addNewAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch({
      type: "NEW_ANECDOTE",
      data: newAnecdote,
    });
  };
};

export const initializedAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch({
      type: "INIT_ANECDOTES",
      data: anecdotes,
    });
  };
};

export const voteFor = (id) => {
  return {
    type: "VOTE",
    data: { id },
  };
};

export default reducer;
