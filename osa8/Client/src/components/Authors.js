import React, { useState } from "react";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";
import { useQuery, useMutation } from "@apollo/client";
import Select from "react-select";

const Authors = (props) => {
  const authorsQuery = useQuery(ALL_AUTHORS);
  const [bornYear, setBornYear] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  const [EditAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (!props.show) {
    return null;
  }

  if (authorsQuery.loading) {
    return <div>loading...</div>;
  }

  const authors = authorsQuery.data.allAuthors;

  let options = [];
  if (authors.length > 1) {
    for (let i = 0; i < authors.length; i++) {
      options.push({ value: authors[i].name, label: authors[i].name });
    }
  }

  const submit = async (e) => {
    e.preventDefault();

    EditAuthor({
      variables: { name: selectedAuthor.value, setBornTo: parseInt(bornYear) },
    });

    setBornYear("");
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={submit}>
        <h2>Set birthyear</h2>
        <Select
          defaultValue={selectedAuthor}
          options={options}
          onChange={setSelectedAuthor}
        />
        <div>
          born
          <input
            value={bornYear}
            onChange={({ target }) => setBornYear(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
