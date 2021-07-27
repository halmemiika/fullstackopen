describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      name: "Cypress testing",
      username: "cypress",
      password: "test",
    };
    cy.request("POST", "http://localhost:3003/api/users/", user);
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.contains("log in to application");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#loginForm-button").click();
      cy.get("#username").type("cypress");
      cy.get("#password").type("test");
      cy.get("#login-button").click();

      cy.contains("Cypress testing logged in");
    });

    it("fails with wrong credentials", function () {
      cy.get("#loginForm-button").click();
      cy.get("#username").type("cypress");
      cy.get("#password").type("wrong");
      cy.get("#login-button").click();

      cy.get(".error")
        .should("contain", "wrong username or password")
        .and("have.css", "color", "rgb(255, 0, 0)")
        .and("have.css", "border-style", "solid");

      cy.get("html").should("not.contain", "Cypress testing logged in");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "cypress", password: "test" });
    });

    it("A blog can be created", function () {
      cy.contains("create new blog").click();
      cy.get("#title").type("cypress test blog");
      cy.get("#author").type("cypress");
      cy.get("#url").type("test.com");
      cy.contains("save").click();
      cy.contains("cypress test blog");
    });

    describe("and a blog exists", function () {
      beforeEach(function () {
        cy.createBlog({
          title: "ready cypress blog 1",
          author: "cypress",
          url: "test.com",
        });
      });

      it("it can be liked", function () {
        cy.contains("ready cypress blog 1").contains("view").click();
        cy.contains("like").click();

        cy.contains("likes").contains("1");
      });

      it("the blog can be deleted", function () {
        cy.contains("ready cypress blog 1").contains("view").click();
        cy.contains("remove").click();

        cy.get("html").should("not.contain", "test.com");
      });

      it("blogs are organized in the order of likes", function () {
        cy.createBlog({
          title: "ready cypress blog second likes",
          author: "cypress",
          url: "test.com",
          likes: 1,
        });
        cy.createBlog({
          title: "ready cypress blog most likes",
          author: "cypress",
          url: "test.com",
          likes: 10,
        });
        cy.get(".blogStyle")
          .filter("#closedBlog")
          .then((blogs) => {
            cy.get(blogs[0]).contains("ready cypress blog most likes");
            cy.get(blogs[1]).contains("ready cypress blog second likes");
          });

        cy.contains("ready cypress blog 1").contains("view").click();
        cy.contains("likes 0").parent().as("theBlog");
        cy.get("@theBlog").contains("like").click();
        cy.get("@theBlog").contains("like").click();

        cy.get(".blogStyle")
          .filter("#closedBlog")
          .then((blogs) => {
            cy.get(blogs[0]).contains("ready cypress blog most likes");
            cy.get(blogs[1]).contains("ready cypress blog 1");
          });
      });
    });
  });
});
