// Make fetch request to API
fetch('http://localhost:3000/memes')
    .then(response => response(json))
    .then(function(data){
        accessMemes(data)
        renderFirstMeme(data[0])
    });

// Function to access array
function accessMemes(memeArray){
    // Iterate through array
    memeArray.forEach(renderMeme)
}