var nameInput = document.getElementById("name-input");
var nameBtn = document.getElementById("submit-btn-name");
var titleInput = document.getElementById("title-input");
var titleBtn = document.getElementById("submit-btn-title");
var titlesList = document.getElementById("titles-list");
var imagesList = document.getElementById("images-list");
var imagesSection = document.getElementById("images-section");
var startOverBtn = document.getElementById("submit-btn-startover");

const watchmode_api_key = "WImwIw6CGs2o5Lsg9Io6YkEV9ip0oEMA5c3g0dJ8";
const giphy_api_key = "TEO60zBkEeYuD3lQieCc6BMsBxbxmiwU";

// The nameBtn listener will save the name to local storage and hide this view and display the next view.
nameBtn.addEventListener("click", function(event) {
    event.preventDefault();
    console.log("name submitted");

    var name = nameInput.value.trim();
    nameInput.value = "";

    localStorage.setItem("name", JSON.stringify(name));
    console.log("name saved in local storage:", name);

    // hide the nameForm and display the titleForm
    var nameForm = document.getElementById("name-form");
    nameForm.setAttribute("class", "is-hidden");
    var titleForm = document.getElementById("title-form");
    titleForm.classList.remove("is-hidden");

});

// The titleBtn listener will hide this view and pass the title to getTitles.
titleBtn.addEventListener("click", function(event) {
    event.preventDefault();
    console.log("title submitted");

    var title = titleInput.value.trim();
    getTitles(title)

    // hide the titleForm, the titles-list will populate in getTitles
    var titleForm = document.getElementById("title-form");
    titleForm.setAttribute("class", "is-hidden")
});

// The renderName function will retrieve the name from local storage to display in getTitles.
function renderName() {
    console.log("rendering name");

    var storedName = JSON.parse(localStorage.getItem("name"));
    console.log("name rendered from local storage:", storedName);

    if (storedName !== null) {

        var nameOutput = document.createElement("h2");

        nameOutput.textContent = storedName + ", pick a title."

        titlesList.appendChild(nameOutput);
        titlesList.setAttribute("class", "is-size-4");
    }
};

// The getTitles function will retrieve a list of 5 titles from the watchmode api and display 5 buttons for those titles.
function getTitles(title) {
    console.log("getTitles")

    renderName()

    var requestURL = `https://api.watchmode.com/v1/search/?apiKey=${watchmode_api_key}&search_field=name&search_value=${title}`
  
    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            var numOfTitles = data.title_results.length;
            if (numOfTitles > 5) numOfTitles === 5;
            for (var i = 0; i < 5; i++) {
                if (!document.getElementById(data.title_results[i].imdb_id)) {
                    console.log("appendChild");
                    var titleBtnHere = document.createElement("button");
                    titleBtnHere.textContent = data.title_results[i].name;
                    titleBtnHere.id = data.title_results[i].imdb_id;
                    titleBtnHere.setAttribute("class", "titleBtn button mx-4 my-4 is-dark")
                    titlesList.appendChild(titleBtnHere);
                }
            }
        })
        .catch(function (error){
            console.log(error)
        })
};

// The titlesList listener will hide the title buttons, display the imagesSection, and pass the selected title to getGiphy.
titlesList.addEventListener('click', function (e) {
    var title = titleInput.value.trim();
    if (e.target.classList.contains('titleBtn')) {
        selectedTitle = e.target.innerHTML;
        console.log("titlesList event");

        getGiphy(e.target.innerHTML, e.target.id);
    }

    // hide the titlesList section, display the imagesSection
    titlesList.setAttribute("class", "is-hidden")
    imagesSection.classList.remove("is-hidden");
});

// The getGiphy function will pass in the selected title, retrieve and display a giphy based on that title.
function getGiphy(selectedTitle, imdb_id) {
    console.log("getGiphy: " + selectedTitle + ", " + imdb_id);

    var requestURL = `https://api.giphy.com/v1/gifs/search?api_key=${giphy_api_key}&q=${selectedTitle}&limit=1`;
  
    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("getGiphy data");
            console.log(data)

            if (!document.getElementById("img_" + imdb_id)) {
                var imgHere = document.createElement("img");
                console.log("image url: " + data.data[0].source);
                imgHere.setAttribute("src", `https://i.giphy.com/media/${data.data[0].id}/giphy.webp`);
                imagesList.appendChild(imgHere);
                imgHere.id = "img_" + imdb_id;
            }

        })
        .catch(function (error){
            console.log(error)
        })
};

// The startOverBtn listener will call startOver, hide imagesSection and display nameForm. 
startOverBtn.addEventListener("click", function(event) {
    event.preventDefault();
    console.log("start over");

    startOver()

    titleInput.value = ""

    // hide the imagesSection section, display the nameForm
    imagesSection.setAttribute("class", "is-hidden")
    var nameForm = document.getElementById("name-form");
    nameForm.classList.remove("is-hidden");
});

// The startOver function will clear previous titles and images.
function startOver() {
    var childTitle = titlesList.lastElementChild; 
    while (childTitle) {
        titlesList.removeChild(childTitle);
        childTitle = titlesList.lastElementChild;
    }

    var childImages = imagesList.lastElementChild; 
    while (childImages) {
        imagesList.removeChild(childImages);
        childImages = imagesList.lastElementChild;
    }
};

function init() {
    console.log("initialize application");
};

init();