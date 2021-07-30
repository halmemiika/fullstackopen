import React from "react";
import { filterChange } from "../reducers/filterReducer";
import { useDispatch } from "react-redux";

const Filter = () => {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const filter = e.target.value;
    dispatch(filterChange(filter));
  };

  const style = {
    marginBottom: 10,
  };

  return (
    <div style={style}>
      filter <input name="filter" onChange={handleChange} />
    </div>
  );
};

export default Filter;
