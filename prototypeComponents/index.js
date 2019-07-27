// надо разработать небольшую библиотечку для создания компонентов,
// и автоматизировать слушание ивентов внутри компонента
// возьми задание с промисов, там где мы загружали пользователей с постами
// и переделай его используя свой компонент
// тебе надо будет создать 3 компонента
// `UserComponent`, `CommentComponent`, `PostComponent`
// только после загрузки юзеров остальное не надо загружать,
// сделать для каждого пользователя ссылку, по клику на которой будут грузиться посты

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
  <button id="${user.id}">Load Post</button>
</div>`;
};

const postTemplate = function(post) {
  return `<div style = "border:1px solid black; margin: 5px; padding:5px;" > 
  <p><b>POST ID</b>: ${post.id}</p>
  <p><b>TITLE</b>: ${post.title}</p>
  <p><b>CONTENT</b>: ${post.body}</p>
  <h2>Comments</h2>
  <ul class="comments${post.id}"></ul>
  <button id="${post.id}">Load Commnets</button>
  <ul class="comment${post.id}"></ul>
</div>`;
};

const commentTemplate = function(comment) {
  return `<li style="font-style: italic;"> ${comment.body}</li>`;
};

function Component(options) {
  this.options = options;
  this.container = null;
}

Component.prototype = {
  fetchData: function(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject(new Error('Rejected'));
        }
      };
      xhr.send();
    });
  },

  selectorCreator: function(options) {
    const { events } = options;

    for (const key in events) {
      const eventType = key.split(' ').reverse()[0];
      const selectorFromKey = key
        .split(' ')
        .slice(0, -1)
        .toString();
      const method = events[key];

      return { eventType, selectorFromKey, method };
    }
  },

  attachEventHandlers: function() {
    const { eventType, selectorFromKey, method } = this.selectorCreator(this.options);

    document.querySelector(selectorFromKey).addEventListener(eventType, this[method].bind(this));
  },

  render: function(data, toContainer) {
    if (this.container) toContainer.innerHTML = '';

    this.container = toContainer;
    toContainer.innerHTML += data;
  },

  destroy: function() {
    this.container.remove();
    this.container = null;

    if (!this.options) return;

    const { eventType, selectorFromKey, method } = this.selectorCreator(this.options);

    document.querySelector(selectorFromKey).removeEventListener(eventType, this[method].bind(this));
  }
};

//============UserComponent
const UserComponent = function(options) {
  Component.call(this, options);
  this.container = null;
};

UserComponent.prototype = Object.create(Component.prototype);
UserComponent.prototype.constructor = UserComponent;

const userComponent = new UserComponent(null);

userComponent.fetchData('https://jsonplaceholder.typicode.com/users').then(response => {
  const usersToRender = response.map(userTemplate).join('');

  userComponent.render(usersToRender, userContainer);
});

//============PostsComponent
const PostsComponent = function(options) {
  Component.call(this, options);
  this.container = null;
};

PostsComponent.prototype = Object.create(Component.prototype);
PostsComponent.prototype.constructor = PostsComponent;
PostsComponent.prototype.getPosts = function(event) {
  if (event.target.nodeName !== 'BUTTON') return;

  this.fetchData(`https://jsonplaceholder.typicode.com/posts?userId=${event.target.id}`).then(response => {
    const postsToRender = response.map(postTemplate).join('');

    this.render(postsToRender, postContainer);
  });
};

const optionsForPosts = {
  events: {
    'div.users-container click': 'getPosts'
  }
};

const postsComponent = new PostsComponent(optionsForPosts);

postsComponent.attachEventHandlers();

// ============CommentComponent
const CommentsComponent = function(options) {
  Component.call(this, options);
  this.container = null;
};

CommentsComponent.prototype = Object.create(Component.prototype);
CommentsComponent.prototype.constructor = CommentsComponent;
CommentsComponent.prototype.getComments = function(event) {
  if (event.target.nodeName !== 'BUTTON') return;

  commentsComponent
    .fetchData(`https://jsonplaceholder.typicode.com/comments?postId=${event.target.id}`)
    .then(response => {
      const commentContainer = document.querySelector(`.comment${response[0].postId}`);
      const commentsToRender = response.map(commentTemplate).join('');

      this.render(commentsToRender, commentContainer);
    });
};

const optionsForComments = {
  events: {
    'div.posts-container click': 'getComments'
  }
};

const commentsComponent = new CommentsComponent(optionsForComments);

commentsComponent.attachEventHandlers();

// ============Destroy
setTimeout(() => {
  commentsComponent.destroy();
}, 6000);

setTimeout(() => {
  postsComponent.destroy();
}, 7000);

setTimeout(() => {
  userComponent.destroy();
}, 8000);
