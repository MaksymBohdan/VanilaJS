// // твоя задача написать метод для получения данных из сети, используя XmlHttpRequest
// // давай назовем этот метод `makeRequest(url)`
// // на вход он получает адрес и возвращает промис, которые будет `resolved`  с данными,
// // если все ок или `rejected` если не получилось загрузить данные

// const makeRequest = someUrl => {
//   const promise = new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();

//     xhr.open("GET", someUrl, true);

//     xhr.onload = () => {
//       if (xhr.status === 200) {
//         resolve(xhr.response);
//       } else {
//         reject(`${xhr.status} error! Please try again`);
//       }
//     };
//     xhr.send();
//   });

//   return promise
//     .then(data => console.log("data", data))
//     .catch(err => console.error(err));
// };

// const url = "https://jsonplaceholder.typicode.com/posts/1";
// makeRequest(url);

// // давай тогда на промисы сделаешь такое
// // на вход ф-ция получает число секунд
// // каждую секунду надо выводить на консоль сколько еще осталось до конца
// // и в конце сделать `resolve()`
// // если вдруг `seconds <= 0` то тогда сделать `reject` с сообщением об ошибке
// function countDown(seconds) {
//   return new Promise(function(resolve, reject) {
//     let toEnd = seconds;

//     if (seconds > 0) {
//       const interval = setInterval(function() {
//         toEnd -= 1;
//         console.log(`${toEnd} sec remaining`);

//         if (toEnd === 0) {
//           resolve("Resolved");
//           clearInterval(interval);
//         }
//       }, 1000);
//     } else {
//       reject(new Error("Rejected"));
//     }
//   });
// }

// countDown(5)
//   .then(res => console.log(res))
//   .catch(err => console.error(err.message));

//==================================================================================================

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

const fetchUserInfo = url => {
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
};

const makeSerialRequest = urls => {
  return new Promise(resolve => {
    const arr = [];

    const reqursion = (n = 0) => {
      if (n >= urls.length) return resolve(arr);

      fetchUserInfo(urls[n]).then(res => {
        arr.push(res);
        return reqursion(n + 1);
      });
    };
    reqursion();
  });
};

fetchUserInfo('https://jsonplaceholder.typicode.com/users')
  .then(users => {
    userContainer.innerHTML += users.map(
      user =>
        `<div style="border:1px solid black; margin: 5px; padding:5px; width:300px;">
        <p><b>ID</b>: ${user.id}</p>
        <div><b>NAME</b>: ${user.name} ${user.username}</div>
      </div>`
    );

    return users.map(el => `https://jsonplaceholder.typicode.com/posts/${el.id}`);
  })
  .then(userPostsUrls => {
    return Promise.all(userPostsUrls.map(fetchUserInfo)).then(posts => {
      const postsContainer = document.querySelector('.posts-container');

      postsContainer.innerHTML += posts.map(
        post =>
          `<div style = "border:1px solid black; margin: 5px; padding:5px;"> 
          <p><b>POST ID</b>: ${post.id}</p>
          <p><b>TITLE</b>: ${post.title}</p>
          <p><b>CONTENT</b>: ${post.body}</p>
          <h2>Comments</h2>
          <ul class="comments${post.id}"></ul>
        </div>`
      );

      return posts.map(el => `https://jsonplaceholder.typicode.com/comments?postId=${el.id}`);
    });
  })
  .then(commentsUrls => {
    return makeSerialRequest(commentsUrls);
  })
  .then(commentsAll => {
    commentsAll.forEach(commentsArr => {
      const commentsDiv = document.querySelector(`.comments${commentsArr[0].postId}`);

      commentsDiv.innerHTML += commentsArr
        .map(comment => `<li style="font-style: italic;"> ${comment.body}</li>`)
        .join('');
    });
  });
