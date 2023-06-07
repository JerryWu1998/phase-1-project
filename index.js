// Create a global variable to check the meme's owner
let currentUser = "";


// Use fetch GET to receive all done memes
document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/done-memes")
    .then(response => response.json())
    .then(data => {
      // call function to access array
      accessMemes(data);
      // set default to show first meme
      showDetail(data[0]);
    })
})


// Function to access meme array
function accessMemes(memeArray) {
  // select the container where to put memes
  const memeContainer = document.querySelector('#meme-container');
  // iterate through array
  memeArray.forEach((singleMeme) => {
    // create single meme div
    const singleMemeContainer = document.createElement('div');
    const singleMemeImage = document.createElement('img');
    singleMemeContainer.textContent = singleMeme.name;
    singleMemeImage.src = singleMeme.image;
    // append single meme to DOM
    singleMemeContainer.append(singleMemeImage);
    memeContainer.append(singleMemeContainer);
    // add event listener to each meme (click to show name and big picture)
    singleMemeImage.addEventListener('click', () => {
      showDetail(singleMeme);
    })
  })
}


// After click image, shows detail
function showDetail(singleMemeData) {
  // update name and image in detail area
  const nameDetail = document.querySelector('#detail-name');
  nameDetail.textContent = singleMemeData.name;
  const imageDetail = document.querySelector('#detail-image');
  imageDetail.src = singleMemeData.image;
}


// Function for search bar
function searchMeme() {
  // select input value and meme names
  let searchValue = document.querySelector('#search-input').value;
  let memeItems = document.querySelector('#meme-container').getElementsByTagName("div");
  // use forloop to check if matches
  for (let i = 0; i < memeItems.length; i++) {
    let memeName = memeItems[i].textContent.toLowerCase();
    // show meme if there at least one letter match
    if (memeName.indexOf(searchValue.toLowerCase()) > -1) {
      memeItems[i].style.display = "";
    } else {
      memeItems[i].style.display = "none";
    }
  }
}


// Upload a new meme with name, url and description
document.querySelector('#new-meme').addEventListener('submit', (e) => {
  e.preventDefault();
  if (currentUser === "") {
    window.alert("For adding meme, you have to log in first.")
  } else {
    if (e.target.image.value === "" || e.target.name.value === "" || e.target.description.value === "") {
      window.alert("Please fill out all the forms.")
    } else {
      const newUploadMeme = {
        name: e.target.name.value,
        image: e.target.image.value,
        description: e.target.description.value
      };
      // use fetch POST to add new meme in db.json
      fetch("http://localhost:3000/done-memes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUploadMeme)
      })
        // add meme into the page
        .then(accessMemes([newUploadMeme]))
        .then(window.alert("Add meme successfully."))
    }
  }
})


// Use fetch GET to receive all faces
document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/memes-creating")
    .then(response => response.json())
    .then(data => {
      // call function to access array
      accessFaces(data);
      // set default to show first face
    })
})


// Function to access faces array
function accessFaces(faceArray) {
  // select the container where to put faces
  const faceContainer = document.querySelector('#new-meme-container');
  // iterate through array
  faceArray.forEach((singleFace) => {
    // create single face div
    const singleFaceContainer = document.createElement('div');
    const singleFaceImage = document.createElement('img');
    singleFaceContainer.textContent = singleFace.name;
    singleFaceImage.src = singleFace.image;
    // append single face to DOM
    singleFaceContainer.append(singleFaceImage);
    faceContainer.append(singleFaceContainer);
    // add event listener to each meme (click to show name and big picture)
    singleFaceImage.addEventListener('click', () => {
      draw(singleFace);
    })
  })
}



// Draw the image and text
function draw(face) {
  const canvas = document.querySelector('#canvas');
  const ctx = canvas.getContext('2d');
  let img = new Image();
  img.src = face.image;
  img.addEventListener("load", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
    ctx.drawImage(img, 0, 0, img.width, img.height,
      (canvas.width - img.width * ratio) / 2, (canvas.height - img.height * ratio) / 2,
      img.width * ratio, img.height * ratio);
    ctx.font = '50px impact';
    ctx.strokeStyle = "black"
    ctx.lineWidth = 10;
    ctx.miterLimit = 2;
    // add text into the canvas
    const topText = document.querySelector('#create-meme').topText.value;
    const bottomText = document.querySelector('#create-meme').bottomText.value;
    ctx.textAlign = "center";
    ctx.strokeText(topText, canvas.width / 2, 90);
    ctx.textAlign = "center";
    ctx.strokeText(bottomText, canvas.width / 2, 450);
    ctx.fillStyle = "white"
    ctx.lineWidth = 4
    ctx.textAlign = "center";
    ctx.fillText(topText, canvas.width / 2, 90);
    ctx.textAlign = "center";
    ctx.fillText(bottomText, canvas.width / 2, 450);
  })
}


// Show log in, hide sign up
function logInShow() {
  if (currentUser !== "") {
    // pop out message if user already logged in
    window.alert("You are already logged in. If you want to switch accounts, please log out first.");
  } else {
    document.querySelector('#log-in').style.display = "block";
    document.querySelector('#sign-up').style.display = "none";
  }
}


// Add event listener for log in
document.querySelector('#log-in').addEventListener('submit', (e) => {
  e.preventDefault();
  checkLoginInfo(e.target.username.value, e.target.password.value);
})


// Function that check the username and password
function checkLoginInfo(inputUsername, inputPassword) {
  // use fetch GET to receive all users info
  fetch("http://localhost:3000/user-list")
    .then(response => response.json())
    .then(usersData => {
      // use for loop to go over all users in db.json
      for (singleUser of usersData) {
        if (inputUsername === singleUser.username && inputPassword === singleUser.password) {
          // if matched, the login button becomes username, hide the text bar
          currentUser = inputUsername;
          document.querySelector('#log-in-button').textContent = "Account: " + currentUser;
          document.querySelector("#log-in").style.display = "none";
          window.alert("You have successfully logged in.");
          break;
        } else if (singleUser === usersData.at(-1)) {
          // if all username and password won't match, pop out wrong message
          window.alert("Wrong Username or Password.");
        }
      }
    })
}


// Show sign up, hide sign in
function signUp() {
  document.querySelector('#sign-up').style.display = "block";
  document.querySelector('#log-in').style.display = "none";
}


// Add event listener for sign up
document.querySelector('#sign-up').addEventListener('submit', (e) => {
  e.preventDefault();
  addSignUpInfo(e.target.username.value, e.target.password.value);
})


// Function that add sign up user into db.json
function addSignUpInfo(inputUsername, inputPassword) {
  // username cannot less than 5 characters
  if (inputUsername.length < 5) {
    window.alert("The username is too short, at least five characters.");
  } else if (inputPassword.length < 5) {
    // password cannot less than 5 characters
    window.alert("The password is too short, at least five characters.");
  } else {
    // check if the username already exists
    checkUserName(inputUsername)
      .then(usernameExists => {
        if (usernameExists) {
          window.alert("The username already exists, please use another username.");
        } else {
          // create a new user object
          const newUser = {
            username: inputUsername,
            password: inputPassword
          };
          // use POST to add user data into db.json
          fetch("http://localhost:3000/user-list", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser)
          })
            .then(() => {
              window.alert("You have successfully signed up.");
            })
        }
      })
  }
}


// Async function will return true if the username already exists
async function checkUserName(inputUsername) {
  const response = await fetch("http://localhost:3000/user-list");
  const usersData = await response.json();
  // create a array contains all usernames
  const userNamelist = usersData.map(singleUser => singleUser.username);
  for (const user of userNamelist) {
    if (inputUsername === user) {
      return true;
    }
  }
  return false;
}



// Log out
function logOut() {
  if (currentUser === "") {
    // pop out message if user haven't logged in
    window.alert("You haven't logged in yet.");
  } else {
    // clear current user, pop out log out message
    currentUser = "";
    document.querySelector('#log-in-button').textContent = "Log in";
    window.alert("You logged out successfully.");
  }
}


// 3D hover effect
// credit: https://codepen.io/Chokcoco/pen/mdpGXjj

const multiple = 10;
// area in which mouse movement will be tracked
const mouseOverContainer = document.getElementById("movement-container");
// the element that will be moved
const element = document.getElementById("canvas");

function transformElement(x, y) {
  // Gets pozition of element we want to move
  let box = element.getBoundingClientRect();
  // Calculates rotation value of x 
  let calcX = -(y - box.y - (box.height / 2)) / multiple;
  // Calculates rotation value of y
  let calcY = (x - box.x - (box.width / 2)) / multiple;
  // Sets the transform property to the combination of rotation values of x and y and sets those values to degrees
  element.style.transform  = "rotateX("+ calcX +"deg) " + "rotateY("+ calcY +"deg)";
}

// When you mouse-over the container, it triggers the transformation function
mouseOverContainer.addEventListener('mousemove', (e) => {
  window.requestAnimationFrame(function(){
    transformElement(e.clientX, e.clientY);
  });
});

// When you take the mouse off the element, it takes away the transformation function and sets the position back to normal
mouseOverContainer.addEventListener('mouseleave', (e) => {
  window.requestAnimationFrame(function(){
    element.style.transform = "rotateX(0) rotateY(0)";
  });
});