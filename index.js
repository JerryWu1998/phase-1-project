// Create global variables to check the meme's owner and the meme you wanna edit
let currentUser = "";
let currentMemeId;

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
    const singleMemeName = document.createElement('p')
    singleMemeName.textContent = singleMeme.name;
    singleMemeContainer.classList.add(singleMeme.owner);
    singleMemeContainer.setAttribute('id', singleMeme.id);
    // create img into div
    const singleMemeImage = document.createElement('img');
    singleMemeImage.src = singleMeme.image;
    // append single meme to DOM
    singleMemeContainer.append(singleMemeName);
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
  // set current meme id as the selected one
  currentMemeId = singleMemeData.id;
  // update name and image in detail area
  const nameDetail = document.querySelector('#detail-name');
  nameDetail.textContent = document.getElementById(currentMemeId).querySelector('p').textContent;
  const imageDetail = document.querySelector('#detail-image');
  imageDetail.src = document.getElementById(currentMemeId).querySelector('img').src;
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


// Function to show the current user's memes
function showMyMeme() {
  if (currentUser === "") {
    // user should log in first
    window.alert("Please log in.")
  } else if (document.querySelector('#show-my-meme').textContent === "My Meme") {
    // show current user's meme, change the button to show all meme
    let memeItems = document.querySelector('#meme-container').getElementsByTagName("div");
    for (let i = 0; i < memeItems.length; i++) {
      if (memeItems[i].className === currentUser) {
        memeItems[i].style.display = "";
        // set the owner's last meme as the current meme
        document.querySelector('#detail-name').textContent = memeItems[i].textContent;
        document.querySelector('#detail-image').src = memeItems[i].getElementsByTagName('img')[0].src;
        currentMemeId = memeItems[i].id;
      } else {
        memeItems[i].style.display = "none";
      }
    }
    document.querySelector('#show-my-meme').textContent = "All Meme";
    document.querySelector('#edit-meme-button').style.display = "block";
  } else {
    // show all meme, change the button to current user's meme
    showAllMeme();
    document.querySelector('#edit-meme-button').style.display = "none";
  }
}


// Function that show all meme
function showAllMeme() {
  let memeItems = document.querySelector('#meme-container').getElementsByTagName("div");
  for (let i = 0; i < memeItems.length; i++) {
    memeItems[i].style.display = "";
  }
  document.querySelector('#show-my-meme').textContent = "My Meme";
}


// Function to rename selected Meme
function renameMeme() {
  // change name in DOM
  const newName = document.querySelector('#rename-input').value;
  const divElement = document.getElementById(currentMemeId);
  const pElement = divElement.querySelector('p');
  pElement.textContent = newName;
  document.querySelector('#detail-name').textContent = newName;
  document.querySelector('#rename-input').value = "";
  // change name in db.json
  fetch(`http://localhost:3000/done-memes/${currentMemeId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: newName
    })
  })
}


// Function to delete selected Meme
function deleteMeme() {

}





// Upload a new meme with name and url
document.querySelector('#new-meme').addEventListener('submit', (e) => {
  e.preventDefault();
  if (currentUser === "") {
    window.alert("For adding meme, you have to log in first.")
  } else {
    if (e.target.image.files.length === 0 || e.target.name.value === "") {
      window.alert("Please fill out all the forms.")
    } else {
      const reader = new FileReader();
      reader.onload = function (event) {
        const newUploadMeme = {
          name: e.target.name.value,
          image: event.target.result,
          owner: currentUser
        };
        // add meme into the page
        accessMemes([newUploadMeme])
        window.alert("Add meme successfully.")
        // use fetch POST to add new meme in db.json
        fetch("http://localhost:3000/done-memes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUploadMeme)
        })
      }
      reader.readAsDataURL(e.target.image.files[0]);
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
      // placeholder img
      draw(data[0])
    })
})


// Function to access faces array
function accessFaces(faceArray) {
  // select the container where to put faces
  const faceContainer = document.querySelector('#new-meme-container');
  // iterate through array
  faceArray.slice(1).forEach((singleFace) => {
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
  e.target.username.value = "";
  e.target.password.value = "";
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
          // if matched, the login button becomes username, hide the text bar, show log out
          currentUser = inputUsername;
          document.querySelector('#log-in-button').textContent = "Account: " + currentUser;
          document.querySelector("#log-in").style.display = "none";
          document.querySelector("#log-out-button").style.display = "block";
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
  e.target.username.value = "";
  e.target.password.value = "";
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
  // clear current user
  currentUser = "";
  // reset nav bar
  document.querySelector('#log-in-button').textContent = "Log in";
  document.querySelector("#log-out-button").style.display = "none";
  // hide edit button
  document.querySelector('#edit-meme-button').style.display = "none";
  // reset all meme in meme-container
  showAllMeme();
  // pop out log out message
  window.alert("You logged out successfully.");
}


// 3D hover effect for creating meme preview
// credit: https://codepen.io/Chokcoco/pen/mdpGXjj

// area in which mouse movement will be tracked
const mouseOverContainer = document.getElementById("movement-container");
// the element that will be moved
const element = document.getElementById("canvas");

function transformElement(x, y) {
  // Gets pozition of element we want to move
  let box = element.getBoundingClientRect();
  // Calculates rotation value of x 
  let calcX = -(y - box.y - (box.height / 2)) / 5;
  // Calculates rotation value of y
  let calcY = (x - box.x - (box.width / 2)) / 5;
  // Sets the transform property to the combination of rotation values of x and y and sets those values to degrees
  element.style.transform = `perspective(1000px) rotateX(${calcX}deg) rotateY(${calcY}deg)`
}

// When you mouse-over the container, it triggers the transformation function
element.addEventListener('mousemove', (e) => {
  window.requestAnimationFrame(function () {
    transformElement(e.clientX, e.clientY);
  });
});

// When you take the mouse off the element, it takes away the transformation function and sets the position back to normal
element.addEventListener('mouseleave', (e) => {
  window.requestAnimationFrame(function () {
    element.style.transform = "rotateX(0) rotateY(0)";
  });
});


// 3D hover effect for large meme preview
// area in which mouse movement will be tracked
const card = document.getElementById('detail-image')

card.addEventListener('mousemove', cardMouseMove)

function cardMouseMove(event){
  const cardWidth = card.offsetWidth
  const cardHeight = card.offsetHeight
  // x center would = furthest most left position of card / 2 = center
  const centerX = card.offsetLeft + cardWidth/2
  // y center would = furthest most top position of card / 2 = center
  const centerY = card.offsetTop + cardHeight/2
  // get mouse position
  const mouseX = event.clientX - centerX
  const mouseY = event.clientY - centerY
  // calculate roation values
  const rotaterX = (-1)*25*mouseY/(cardHeight/2)
  const rotaterY = 25*mouseX/(cardWidth/2)
  card.style.transform = `perspective(1000px) rotateX(${rotaterX}deg) rotateY(${rotaterY}deg)`
}

card.addEventListener('mouseleave', cardMouseLeave)
function cardMouseLeave(event){
  card.style.transform = `rotateX(0deg) rotateY(0deg)`
}