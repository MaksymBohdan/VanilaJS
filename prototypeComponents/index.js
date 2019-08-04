const body = document.querySelector('body');
const section = document.createElement('section');
const userTitle = document.createElement('h1');
const postsTitle = document.createElement('h1');
const userContainer = document.createElement('div');
const postContainer = document.createElement('div');

body.prepend(section);
userTitle.textContent = 'LIST OF USERS';
postsTitle.textContent = 'POSTS OF USER #1';
section.append(userTitle);
section.append(postsTitle);
userContainer.classList.add('users-container');
postContainer.classList.add('posts-container');
userContainer.setAttribute('style', 'display:flex; flex-wrap: wrap;');
userTitle.after(userContainer);
postsTitle.after(postContainer);

const userTemplate = function(user) {
  return `<div class=user-template" style="border:1px solid black; margin: 5px; padding:5px; width:300px; background-color: grey;">
  <p><b>ID</b>: ${user.id}</p>
  <div><b>NAME</b>: ${user.name} ${user.username}</div>
  <button data-id="${user.id}">Load Post</button>
</div>`;
};

const postTemplate = function(post) {
  return `<div style = "border:1px solid black; margin: 5px; padding:5px;" > 
  <p><b>POST ID</b>: ${post.id}</p>
  <p><b>TITLE</b>: ${post.title}</p>
  <p><b>CONTENT</b>: ${post.body}</p>
  <h2>Comments</h2>
  <button data-id="${post.id}">Load Commnets</button>
  <ul class="comment${post.id}"></ul>
</div>`;
};

const commentTemplate = function(comment) {
  return `<li style="font-style: italic;"> ${comment.body}</li>`;
};

const errorTemplate = function(err) {
  return `<h1>${err.body}</h1>`;
};

const usersUrl = 'https://jsonplaceholder.typicode.com/users';
const urlComments = 'https://jsonplaceholder.typicode.com/comments?postId=';
const urlPosts = 'https://jsonplaceholder.typicode.com/posts?userId=';

function Component(options, url, container, template) {
  this.options = options;
  this.url = url;
  this.container = container;
  this.template = template;
  this.dataToRender = [];
}

Component.prototype = {
  fetchData: function() {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open('GET', this.url, true);
      xhr.onload = () => {
        if (xhr.status === 200) {
          this.dataToRender = JSON.parse(xhr.response);
          this.preventDublicates(this.container);
          this.renderTo(this.container);

          resolve();
        } else {
          this.dataToRender = [{ body: 'Sorry! Please, try again' }];
          this.template = errorTemplate;
          this.renderTo(this.container);

          reject(new Error('Rejected'));
        }
      };
      xhr.send();
    });
  },

  selectorCreator: function(options) {
    const { events } = options;
    const selectorsArr = [];

    for (const key in events) {
      const eventType = key.split(' ').reverse()[0];
      const selectorFromKey = key
        .split(' ')
        .slice(0, -1)
        .toString();
      const method = events[key];

      selectorsArr.push({ eventType, selectorFromKey, method });
    }
    return selectorsArr;
  },

  attachEventHandlers: function() {
    const selectors = this.selectorCreator(this.options);

    selectors.map(selector => {
      const { eventType, selectorFromKey, method } = selector;

      return document.querySelector(selectorFromKey).addEventListener(eventType, this[method].bind(this));
    });
  },

  render: function(data) {
    return data.map(this.template).join('');
  },

  renderTo: function(container) {
    const convertedData = document.createRange().createContextualFragment(this.render(this.dataToRender));

    container.append(convertedData);
  },

  destroy: function() {
    this.container.remove();
    this.container = null;

    if (!this.options) return;

    const selectorsToRemove = this.selectorCreator(this.options);

    selectorsToRemove.map(selector => {
      const { eventType, selectorFromKey, method } = selector;

      return document.querySelector(selectorFromKey).removeEventListener(eventType, this[method].bind(this));
    });
  },

  preventDublicates: function(container) {
    if (container.innerHTML !== '') {
      container.innerHTML = '';
    }
  }
};

//============UserComponent
const UserComponent = function(options, url, container, template) {
  Component.call(this, options, url, container, template);
};

UserComponent.prototype = Object.create(Component.prototype);
UserComponent.prototype.constructor = UserComponent;

const userComponent = new UserComponent(null, usersUrl, userContainer, userTemplate);

userComponent.fetchData();

//============PostsComponent
const PostsComponent = function(options, container, url, template) {
  Component.call(this, options, container, url, template);
};

PostsComponent.prototype = Object.create(Component.prototype);
PostsComponent.prototype.constructor = PostsComponent;
PostsComponent.prototype.getPosts = function(event) {
  if (event.target.nodeName !== 'BUTTON') return;
  const baseUrl = this.url;

  this.url = `${baseUrl}${event.target.dataset.id}`;
  this.fetchData();
  this.url = baseUrl;
};

const optionsForPosts = {
  events: {
    'div.users-container click': 'getPosts'
  }
};

const postsComponent = new PostsComponent(optionsForPosts, urlPosts, postContainer, postTemplate);

postsComponent.attachEventHandlers();

// ============CommentComponent

const CommentsComponent = function(options, url, container, template) {
  Component.call(this, options, url, container, template);
};

CommentsComponent.prototype = Object.create(Component.prototype);
CommentsComponent.prototype.constructor = CommentsComponent;
CommentsComponent.prototype.getComments = function(event) {
  if (event.target.nodeName !== 'BUTTON') return;
  const baseUrl = this.url;
  const id = event.target.dataset.id;

  this.url = `${baseUrl}${id}`;
  this.container = document.querySelector(`.comment${id}`);
  this.fetchData();
  this.url = baseUrl;
};

const optionsForComments = {
  events: {
    'div.posts-container click': 'getComments'
  }
};

const commentsComponent = new CommentsComponent(optionsForComments, urlComments, null, commentTemplate);

commentsComponent.attachEventHandlers();

// ============Destroy
// setTimeout(() => {
//   commentsComponent.destroy();
// }, 6000);

// setTimeout(() => {
//   postsComponent.destroy();
// }, 7000);

// setTimeout(() => {
//   userComponent.destroy();
// }, 8000);

// ===============
// error if url wrong xxx
//no dublicates
// destroy
