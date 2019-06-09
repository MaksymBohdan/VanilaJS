// твоя задача написать метод для получения данных из сети, используя XmlHttpRequest
// давай назовем этот метод `makeRequest(url)`
// на вход он получает адрес и возвращает промис, которые будет `resolved`  с данными, 
// если все ок или `rejected` если не получилось загрузить данные

// const makeRequest = (someUrl) => {
//   const promise = new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();

//     xhr.open('GET', someUrl, true);

//     xhr.onload = () => {
//       if (xhr.status === 200) {
//         resolve(xhr.response);
//       } else {
//         reject(`${xhr.status} error! Please try again`)
//       }
//     }
//     xhr.send()
//   })

//   return promise
//     .then(data => console.log('data', data))
//     .catch(err => console.error(err))
// }

// const url = 'https://jsonplaceholder.typicode.com/posts/1';
// makeRequest(url)


// давай тогда на промисы сделаешь такое
// на вход ф-ция получает число секунд
// каждую секунду надо выводить на консоль сколько еще осталось до конца
// и в конце сделать `resolve()`
// если вдруг `seconds <= 0` то тогда сделать `reject` с сообщением об ошибке
// function countDown(seconds) {
//   return new Promise(function (resolve, reject) {
//     let toEnd = seconds;

//     if (seconds > 0) {
//       const interval = setInterval(function () {
//         toEnd -= 1;
//         console.log(`${toEnd} sec remaining`);

//         if (toEnd === 0) {
//           resolve('Resolved')
//           clearInterval(interval);
//         }

//       }, 1000)
//     } else {
//       reject(new Error("Rejected"))
//     }
//   });
// }

// countDown(5)
//   .then(res => console.log(res))
//   .catch(err => console.error(err.message))

