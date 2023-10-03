// Show the HTML elements for displaying the beer information 
const beerName = document.getElementById('beer-name');
const beerImage = document.getElementById('beer-image');
const beerDescription = document.getElementById('beer-description');
const beerReviewForm = document.getElementById('review-form');
const beerReviewText = document.getElementById('review');

function beerDisplay(beer) {

    // Declare variables to enable editing the beer description
    const beerDescriptionForm = document.getElementById('description-form');
    const beerEditDescription = document.getElementById('description');
    
    beerDescriptionForm.reset();

    // Remove all the existing reviews from the list
    const beerReviewList = document.getElementById('review-list');
    while (beerReviewList.firstElementChild) {
        beerReviewList.removeChild(beerReviewList.lastElementChild)
    };

    // Display the name, image and description of beers

    beerName.textContent = beer.name,
        beerImage.src = beer.image_url,
        beerDescription.textContent = beer.description,
        beerEditDescription.value = beer.description


    for (let review of beer.reviews) {
        let beerReview = document.createElement('li');
        beerReview.textContent = review;
        beerReviewList.appendChild(beerReview);
    }

    // Update beer description
    beerDescriptionForm.addEventListener('submit', updateDescription);

    // function call to update description
    function updateDescription(event) {
        // e.preventDefault() prevents page from reloading
        event.preventDefault();
        beer.description = beerEditDescription.value;
        updateBeer(beer)
    };
    // Add reviews after click event
    beerReviewForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Check if the review input element filled
        if (beerReviewText.value !== '') {

            beer.reviews.push(beerReviewText.value)
            updateBeer(beer)
        } else {
            alert('Please add Review!')
        }
    });
};


// function to update a beer object on the server using fetch API
function updateBeer(beer) {

// Updating a specific beer object using its id
    fetch(`http://localhost:3000/beers/${beer.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(beer)
        })
        .then(response => response.json())
        .then(data => beerDisplay(data))

};

// function to fetch data from a server using fetch API and return a promise object
function fetchData(beer = null) {
    let baseURL = 'http://localhost:3000/beers/'
        //use class to  create a promise using the promise constructor
    return new Promise((resolve, ) => {
        let url = beer == null ? baseURL : `${baseURL + beer}`
        fetch(url)
            .then(response => response.json())
            .then(data => resolve(data))

    })
};


// function to display beers in a navigation list on left
function navDisplay(beers) {
    const navBeerList = document.querySelector('#beer-list');
    while (navBeerList.firstElementChild) {

        // Remove all existing list items from navigation list
        navBeerList.removeChild(navBeerList.lastElementChild)
    };

    beers.forEach(beer => {
        const navElement = document.createElement('li');
        navElement.textContent = beer.name;
        navElement.setAttribute('index', beer.id);
        navBeerList.append(navElement)

        // Add an event listener to the list item element to handle click events
        navElement.addEventListener('click', (event) => {
            // Fetch data for a specific beer using its id value
            fetchData(event.target.getAttribute('index'))
                .then(beer => {
                    beerDisplay(beer);
                });
        });
    });

};

// Define a function to initialize the page
function initializeFlataBeer() {
    // Fetch data for all beers and display them in the navigation list
    fetchData()
        .then(beers => navDisplay(beers))
        // Fetch data for the first beer and display it on the page 
    fetchData(1)
        .then(beers => beerDisplay(beers))

};
// Call the initializeFlataBeer function
initializeFlataBeer()
