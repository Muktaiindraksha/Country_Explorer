let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let countriesData = []; 

const themeToggleButton = document.getElementById("themeToggle");
themeToggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    themeToggleButton.textContent = document.body.classList.contains("dark-theme") ? "🌙" : "🌞";
});

function updateFavoriteCount() {
    document.getElementById("favoriteCount").textContent = favorites.length;
}

function displayCountries(countries) {
    const countryList = document.getElementById("countryList");
    countryList.innerHTML = "";
    
    countries.forEach(country => {
        const countryCard = document.createElement("div");
        countryCard.classList.add("country-card");
        
        countryCard.innerHTML = `
            <img src="${country.flags.png}" alt="Flag of ${country.name}">
            <h3>${country.name}</h3>
            <span class="favorite-icon ${favorites.includes(country.name) ? 'favorited' : ''}"
                  onclick="toggleFavorite('${country.name}', this)">&#9829;</span>
            <div class="country-info">
                <p>Region: ${country.region}</p>
                <p>Capital: ${country.capital}</p>
                <p>Population: ${country.population}</p>
                <p>Language: ${country.languages[0].name}</p>
            </div>
        `;
        
        countryList.appendChild(countryCard);
    });
    
    updateFavoriteCount();
}

function toggleFavorite(countryName, iconElement) {
    const index = favorites.indexOf(countryName);
    if (index > -1) {
        favorites.splice(index, 1);
        iconElement.classList.remove('favorited');
    } else {
        favorites.push(countryName);
        iconElement.classList.add('favorited');
    }
    
    localStorage.setItem("favorites", JSON.stringify(favorites));
    updateFavoriteCount();
}


async function fetchCountries() {
    const response = await fetch("https://restcountries.com/v2/all");
    countriesData = await response.json();
    displayCountries(countriesData);
}

function filterCountries() {
    const region = document.getElementById("regionFilter").value;
    const language = document.getElementById("languageFilter").value;

    let filteredCountries = countriesData;
    
    if (region) {
        filteredCountries = filteredCountries.filter(country => country.region === region);
    }
    
    if (language) {
        filteredCountries = filteredCountries.filter(country =>
            country.languages.some(lang => lang.name === language)
        );
    }

    displayCountries(filteredCountries);
}

document.getElementById("searchBar").addEventListener("input", function() {
    const searchTerm = this.value.toLowerCase();
    const filteredCountries = countriesData.filter(country => 
        country.name.toLowerCase().includes(searchTerm)
    );
    displayCountries(filteredCountries);
});

async function initialize() {
    await fetchCountries();

    document.getElementById("regionFilter").addEventListener("change", filterCountries);
    document.getElementById("languageFilter").addEventListener("change", filterCountries);
}
initialize();


