const apiUrl = "https://restcountries.com/v3.1/all";
const searchBar = document.getElementById("searchBar");
const countryList = document.getElementById("countryList");
const favoritesList = document.getElementById("favoritesList");
const favoritesCount = document.getElementById("favoritesCount");
const themeToggle = document.getElementById("themeToggle");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Fetch and display countries
async function fetchCountries() {
    const response = await fetch(apiUrl);
    const countries = await response.json();
    displayCountries(countries);
}

function displayCountries(countries) {
    countryList.innerHTML = "";
    countries.forEach(country => {
        const card = document.createElement("div");
        card.classList.add("country-card");
        card.innerHTML = `
            <img src="${country.flags.png}" alt="${country.name.common}">
            <h3>${country.name.common}</h3>
            <i class="favorite-icon ${favorites.includes(country.name.common) ? 'favorited' : ''}" data-name="${country.name.common}">${favorites.includes(country.name.common) ? '★' : '☆'}</i>
            <div class="country-info">
                <p><strong>Region:</strong> ${country.region}</p>
                <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Languages:</strong> ${Object.values(country.languages || {}).join(", ")}</p>
            </div>
        `;
        countryList.appendChild(card);
    });
    addFavoriteListeners();
}

// Add event listeners to favorite icons
function addFavoriteListeners() {
    const favoriteIcons = document.querySelectorAll(".favorite-icon");
    favoriteIcons.forEach(icon => {
        icon.addEventListener("click", (e) => {
            const countryName = e.target.dataset.name;
            toggleFavorite(countryName, e.target);
        });
    });
}

// Toggle favorite countries
function toggleFavorite(countryName, icon) {
    if (favorites.includes(countryName)) {
        favorites = favorites.filter(name => name !== countryName);
        icon.classList.remove('favorited');
        icon.textContent = '☆'; // Change icon to unfavorited
    } else {
        if (favorites.length < 5) {
            favorites.push(countryName);
            icon.classList.add('favorited');
            icon.textContent = '★'; // Change icon to favorited
        } else {
            alert("You can only have 5 favorites!");
            return;
        }
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    updateFavoritesCount();
    displayFavorites();
}

// Display favorites
function displayFavorites() {
    favoritesList.innerHTML = "";
    favorites.forEach(name => {
        const li = document.createElement("li");
        li.textContent = name;
        favoritesList.appendChild(li);
    });
}

// Update favorites count
function updateFavoritesCount() {
    favoritesCount.textContent = `(${favorites.length})`;
}

// Search functionality
searchBar.addEventListener("input", (e) => {
    const searchValue = e.target.value.toLowerCase();
    fetchCountries().then(() => {
        const filteredCountries = Array.from(countryList.children).filter(card => 
            card.querySelector("h3").textContent.toLowerCase().includes(searchValue)
        );
        countryList.innerHTML = "";
        filteredCountries.forEach(card => countryList.appendChild(card));
    });
});

// Theme toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    themeToggle.classList.toggle("fa-moon");
    themeToggle.classList.toggle("fa-sun");
});

// Initial fetch
fetchCountries();
displayFavorites();
updateFavoritesCount();
