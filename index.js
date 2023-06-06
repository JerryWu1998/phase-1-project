// use fetch GET to receive all done memes
document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/done-memes")
  .then(response => response.json())
  .then(data => {
    // call function to access array
    accessMemes(data);
    // set default to show first meme
    showDetail(data[0]);
  });
})


// function to access array
function accessMemes(memeArray) {
  // select the container where to put memes
  const memeContainer = document.querySelector('#meme-container');
  // iterate through array
  memeArray.forEach((singleMeme) => {
    // create single meme div
    const singleMemeList = document.createElement('div');
    const singleMemeImage = document.createElement('img');
    singleMemeList.textContent = singleMeme.name;
    singleMemeImage.src = singleMeme.image;
    // append single meme to DOM
    singleMemeList.append(singleMemeImage);
    memeContainer.append(singleMemeList);
    // add event listener to each meme (click to show name and big picture)
    singleMemeImage.addEventListener('click', () => {
      showDetail(singleMeme);
    })
  });
}


// after click image, shows detail
function showDetail(singleMemeData) {
  // update name and image in detail area
  const nameDetail = document.querySelector('#detail-name');
  nameDetail.textContent = singleMemeData.name;
  const imageDetail = document.querySelector('#detail-image');
  imageDetail.src = singleMemeData.image;
}


// function for search bar
function searchMeme() {
  // select input value and meme names
  let searchValue = document.querySelector('#search-input').value;
  let memeItems = document.querySelector('#meme-container').getElementsByTagName("div");
  // use forloop to check if matches
  for (let i = 0; i < memeItems.length; i++) {
    let memeName = memeItems[i].textContent.toLowerCase();
    console.log(memeName)
    // show meme if there at least one letter match
    if (memeName.indexOf(searchValue.toLowerCase()) > -1) {
      memeItems[i].style.display = "";
    } else {
      memeItems[i].style.display = "none";
    }
  }
}


// upload a new meme with name, url and description
document.querySelector('#new-meme').addEventListener('submit', (e) => {
  e.preventDefault();
  const newUploadMeme = {
    name: e.target.name.value,
    image: e.target.image.value,
    description: e.target.description.value
  }
  // use fetch POST to add new meme in db.json
  fetch("http://localhost:3000/done-memes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUploadMeme)
  })
    // add meme into the page
    .then(accessMemes([newUploadMeme]));
})