const https = require('https');
const express = require("express");

const app = express();

//---------------------------------------task 1-----------------------------------------

app.get('/todos', function(request, response) {
  const url = "https://jsonplaceholder.typicode.com/todos";

  https.get(url, res => {
    let data = '';
    res.on('data', chunk => {
      data += chunk;
    });

    res.on('end', () => {
      let requiredData = JSON.parse(data);
      requiredData.forEach((obj) => {
        delete obj.userId;
      });
      // send data with deleted userId for each object
      response.send(requiredData);
    });

  }).on('error', err => {
    console.log(err.message);
  });

});


//----------------------------------------task 2 ----------------------------------

function apiCall(url) {
  return new Promise((resolve, reject) => {
    let data = '';
    https.get(url, res => {
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        reqData = JSON.parse(data);
        //return requested data
        resolve(reqData);
      }).on('error', reject);
    });
  });
};


function getData(endpoints) {
  return Promise.all(endpoints.map(function(url) {
    return apiCall(url);
  }));
}


app.get('/user/:id', function(request, response) {
  let userId = request.params.id;

  const url1 = "https://jsonplaceholder.typicode.com/users/" + userId;
  const url2 = "https://jsonplaceholder.typicode.com/todos";

  endpoints = [url1, url2];

  getData(endpoints).then(function(results) {
    let userDetails = results[0];
    let todos = results[1];
    let reqTodos = [];
    let j = 0;
    for (i = 0; i < todos.length; i++) {
      if (todos[i].userId == userId) {
        reqTodos.push(todos[i]);
      }
    }
    //check if userDetails object is empty or not
    if (!(Object.keys(userDetails).length === 0)) {
      userDetails.todos = reqTodos;
    }
    response.send(userDetails);
  }).catch(function(err) {
    console.log(err.message);
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});