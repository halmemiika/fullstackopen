import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import BlogForm from "./BlogForm";

test("<BlogForm> calls onSubmit with right details", () => {
  const createBlog = jest.fn();

  const component = render(<BlogForm createBlog={createBlog} />);

  const formTitle = component.container.querySelector("#title");
  const formAuthor = component.container.querySelector("#author");
  const formUrl = component.container.querySelector("#url");
  const form = component.container.querySelector("form");

  fireEvent.change(formTitle, {
    target: { value: "test test test" },
  });
  fireEvent.change(formAuthor, {
    target: { value: "jest" },
  });
  fireEvent.change(formUrl, {
    target: { value: "jest.com" },
  });
  fireEvent.submit(form);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe("test test test");
  expect(createBlog.mock.calls[0][0].author).toBe("jest");
  expect(createBlog.mock.calls[0][0].url).toBe("jest.com");
});
