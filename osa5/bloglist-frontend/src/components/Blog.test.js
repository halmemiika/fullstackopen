import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import Blog from "./Blog";

test("renders blog with title and author", () => {
  const blog = {
    title: "test blog",
    author: "jest",
    likes: 1,
    url: "dontshow.com",
  };

  const component = render(<Blog blog={blog} />);

  const div = component.container.querySelector(".blogStyle");
  expect(div).toHaveTextContent("test blog");
  expect(div).toHaveTextContent("jest");
  expect(div).not.toHaveTextContent("dontshow.com");
});

test("likes and url will be shown when button is pressed", () => {
  const blog = {
    title: "test blog",
    author: "jest",
    likes: 1,
    url: "dontshow.com",
    user: {
      username: "jest",
    },
  };

  const component = render(<Blog blog={blog} />);
  const button = component.getByText("view");
  fireEvent.click(button);

  const div = component.container.querySelectorAll(".blogStyle")[1];
  expect(div).toHaveTextContent("dontshow.com");
  expect(div).toHaveTextContent("likes");
});

test("when like button is pressed twice", () => {
  const blog = {
    title: "test blog",
    author: "jest",
    likes: 1,
    url: "dontshow.com",
    user: {
      username: "jest",
    },
  };

  const mockHandler = jest.fn();

  const component = render(<Blog blog={blog} handleLikes={mockHandler} />);
  const button = component.getByText("like");
  fireEvent.click(button);
  fireEvent.click(button);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
