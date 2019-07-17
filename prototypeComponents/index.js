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
  this.renderData = null;
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

  selectorGenerator: function(options) {
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
    const { eventType, selectorFromKey, method } = this.selectorGenerator(this.options);

    document.querySelector(selectorFromKey).addEventListener(eventType, method);
  },

  render: function(data) {
    this.renderData = data;
  },

  renderTo: function(container) {
    this.container = container;
    container.innerHTML += this.renderData;
  },

  destroy: function() {
    this.container.remove();
    this.container = null;
    this.renderData = null;

    if (!this.options) return;

    const { eventType, selectorFromKey, method } = selectorGenerator(this.options);

    document.querySelector(selectorFromKey).removeEventListener(eventType, method);
  }
};

//============UserComponent

const UserComponent = function(options) {
  Component.call(this, options, renderData, container);
};

UserComponent.prototype = Object.create(Component.prototype);
UserComponent.prototype.constructor = UserComponent;

// const UserComponent = function(options) {
//   Component.call(this, options);
//   this.renderData = null;
//   this.container = null;
// };
// UserComponent.prototype = Object.create(Component.prototype);
// UserComponent.prototype.constructor = UserComponent;

console.log(UserComponent.fetchData);

UserComponent.fetchData('https://jsonplaceholder.typicode.com/users').then(response => {
  const usersToRender = response.map(userTemplate).join('');
  UserComponent.render(usersToRender);
  UserComponent.renderTo(userContainer);
});

//============PostsComponent
const optionsForPosts = {
  events: {
    'div.users-container click': getPosts
  }
};

// const PostsComponent = function
const PostsComponent = new Component(optionsForPosts);

PostsComponent.attachEventHandlers();

function getPosts(event) {
  if (event.target.nodeName !== 'BUTTON') return;

  PostsComponent.fetchData(`https://jsonplaceholder.typicode.com/posts?userId=${event.target.id}`).then(response => {
    const postsToRender = response.map(postTemplate).join('');

    if (PostsComponent.renderData) postContainer.innerHTML = '';

    PostsComponent.render(postsToRender);
    PostsComponent.renderTo(postContainer);
  });
}

// ============CommentComponent
// const optionsForComments = {
//   events: {
//     'div.posts-container click': getComments
//   }
// };

// const CommentsComponent = new Component(optionsForComments);

// CommentsComponent.attachEventHandlers();

// function getComments(event) {
//   if (event.target.nodeName !== 'BUTTON') return;

//   fetchData(`https://jsonplaceholder.typicode.com/comments?postId=${event.target.id}`).then(response => {
//     const commentContainer = document.querySelector(`.comment${response[0].postId}`);
//     const commentsToRender = response.map(commentTemplate).join('');

//     if (CommentsComponent.renderData) commentContainer.innerHTML = '';

//     CommentsComponent.render(commentsToRender);
//     CommentsComponent.renderTo(commentContainer);
//   });
// }

// ============Destroy
// setTimeout(() => {
//   CommentsComponent.destroy();
// }, 6000);

// setTimeout(() => {
//   PostsComponent.destroy();
// }, 7000);

// setTimeout(() => {
//   UserComponent.destroy();
// }, 8000);
