const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");

const authToken = helper.testAuth;

describe("find initial blogs", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("there are right amount of blogs", async () => {
    const res = await api.get("/api/blogs");

    expect(res.body).toHaveLength(helper.initialBlogs.length);
  });

  test("all blogs have id", async () => {
    const blogs = await api.get("/api/blogs");
    console.log(blogs.body);
    blogs.body.forEach((blog) => {
      expect(blog.id).toBeDefined();
    });
  });
});

describe("tests for users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.insertMany(helper.testUser);
  });

  test("creation succcees with fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "memer",
      name: "meme 69",
      password: "meme",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "root",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("`username` to be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("creation fails with proper statuscode if no password is given", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "badtest",
      name: "bad test user",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("password missing");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("creation fails with proper statuscode if password is too short", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "badtest",
      name: "bad test user",
      password: "12",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain(
      "password must be at least 3 characters long"
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("creation fails with proper statuscode if name is too short", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "ba",
      name: "bad test user",
      password: "1234",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain(
      "is shorter than the minimum allowed length"
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

describe("viewing specific blog", () => {
  test("succeeds with valid id", async () => {
    const blogsAtStart = await helper.blogsInDb();

    const blogToView = blogsAtStart[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const processedBlog = JSON.parse(JSON.stringify(blogToView));
    expect(resultBlog.body).toEqual(processedBlog);
  });

  test("fails with 404 if doesnt exist", async () => {
    const validNonexistingId = await helper.nonExistingId();

    await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
  });

  test("fails with 400 if invalid id", async () => {
    const invalidId = "101654eaf21v68eav1w96a";

    await api.get(`/api/blogs/${invalidId}`).expect(400);
  });
});

describe("addition of new blog", () => {
  test("fails with 400 if data is not valid", async () => {
    const badBlog = {
      title: "badblog",
      author: "badblog author",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", authToken)
      .send(badBlog)
      .expect(400);

    const totalBlogs = await helper.blogsInDb();
    expect(totalBlogs).toHaveLength(helper.initialBlogs.length);

    const titles = totalBlogs.map((blog) => blog.title);
    expect(titles).not.toContain("badblog");
  });

  test("can add without likes and likes will be 0", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const testBlog = {
      title: "test 0 likes",
      author: "jest",
      url: "jest.com",
      user: helper.testUser._id,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", authToken)
      .send(testBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const totalBlogs = await helper.blogsInDb();
    expect(totalBlogs).toHaveLength(blogsAtStart.length + 1);

    const titles = totalBlogs.map((blog) => blog.title);
    expect(titles).toContain("test 0 likes");

    expect(totalBlogs.find((blog) => blog.title === "test 0 likes").likes).toBe(
      0
    );
  });

  test("valid blog can be added", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const newBlog = {
      title: "testblog",
      author: "jest",
      url: "jest.com",
      likes: 1,
      user: helper.testUser._id,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", authToken)
      .send(newBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const totalBlogs = await helper.blogsInDb();
    expect(totalBlogs).toHaveLength(blogsAtStart.length + 1);

    const titles = totalBlogs.map((blog) => blog.title);
    expect(titles).toContain("testblog");
  });

  test("adding a blog fails with 401 if user is not authorizized", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const newBlog = {
      title: "testblog",
      author: "jest",
      url: "jest.com",
      likes: 1,
      user: helper.testUser._id,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    const totalBlogs = await helper.blogsInDb();
    expect(totalBlogs).toHaveLength(blogsAtStart.length);

    const titles = totalBlogs.map((blog) => blog.title);
    expect(titles).toContain("testblog");
  });
});

describe("deletion of a blog", () => {
  test("succeeds with 204 if Id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[7];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", authToken)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtStart).toHaveLength(blogsAtEnd.length + 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).not.toContain(blogToDelete.title);
  });
});

describe("updating likes of a blog", () => {
  test("succeeds with 200 and new like count is updated", async () => {
    const blogs = await helper.blogsInDb();
    const blogToUpdate = blogs[0];

    const updateBlog = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: 20,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updateBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const newBlogs = await helper.blogsInDb();
    expect(newBlogs[0].likes).toBe(20);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
