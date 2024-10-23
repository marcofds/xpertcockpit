        // Initialize the map with a default view (Bern)
        var map = L.map('map').setView([46.9481, 7.4474], 13);
        
        // Load and display OpenStreetMap tiles with a custom style
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Array to store markers and city names
        var markers = [];
        var cityNames = [];
        var confirmationDiv = document.getElementById('confirmation');

        // Function to display selected city
        function showCity() {
            var cityCoordinates = document.getElementById('cities').value.split(',');
            var lat = cityCoordinates[0];
            var lon = cityCoordinates[1];
            document.getElementById('latitude').value = lat;
            document.getElementById('longitude').value = lon;
        }

        // Function to update the map based on coordinates
        function updateMap() {
            var lat = document.getElementById('latitude').value;
            var lon = document.getElementById('longitude').value;

            if (!lat || !lon) {
                alert('Please select a city or enter valid coordinates');
                return;
            }

            // Add a marker at the new coordinates with a smooth animation
            var marker = L.marker([lat, lon], { icon: L.icon({
                iconUrl: './assets/icons/placeholder_blue.png', // Default icon color
                iconSize: [41, 41],
                iconAnchor: [21, 41]
            })})
                .addTo(map)
                .bindPopup("Location: " + lat + ", " + lon)
                .openPopup();

            // Store the marker in the array
            markers.push(marker);
            var cityName = "Location: " + lat + ", " + lon; // Use city name placeholder
            cityNames.push(cityName);

            // Update the city list display
            updateCityList(cityName, marker);

            // Adjust the map view to fit all markers
            var group = L.featureGroup(markers);
            map.fitBounds(group.getBounds());
        }

// Function to update the city list display
function updateCityList(cityName, marker) {
    var cityContainer = document.getElementById('cityContainer');

    // Get the current date and time for when the city is added
    var entryTime = new Date(); // Store the entry time

    var cityItem = document.createElement('div');
    cityItem.className = 'city-item';

    // Create a span for the city name
    var cityNameDisplay = document.createElement('span');
    cityNameDisplay.textContent = cityName;
    cityNameDisplay.className = 'city-name'; // Class for city name

    // Create a span for the timer
    var timerDisplay = document.createElement('span');
    timerDisplay.className = 'timer-display'; // Class for timer display

    // Create a div to hold the city name and timer
    var cityContent = document.createElement('div');
    cityContent.className = 'city-content';

    // Append city name and timer display to city content
    cityContent.appendChild(cityNameDisplay); // City name on the left
    cityContent.appendChild(timerDisplay); // Timer display on the right

    // Create the delete button
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function() {
        removeCity(this, cityName);
    };

    // Append the city content and delete button to city item
    cityItem.appendChild(cityContent);
    cityItem.appendChild(deleteButton); // Append the delete button to city item
    cityContainer.appendChild(cityItem); // Add the city item to the container

    // Function to update the timer display
    function updateTimer() {
        var currentTime = new Date();
        var elapsedTime = Math.floor((currentTime - entryTime) / 1000); // Calculate elapsed time in seconds
        var minutes = Math.floor(elapsedTime / 60);
        var seconds = elapsedTime % 60;
        timerDisplay.textContent = `${minutes}m ${seconds}s`; // Update timer display

        // Check if elapsed time is greater than 60 seconds
        if (elapsedTime > 60) {
            cityNameDisplay.classList.add('flash-red'); // Add flash class
        } else {
            cityNameDisplay.classList.remove('flash-red'); // Remove flash class
        }
    }

    // Start the timer
    setInterval(updateTimer, 1000); // Update every second

    // Event listener to show confirmation when the marker is clicked
    marker.on('click', function (e) {
        // Show the confirmation div
        confirmationDiv.style.display = 'block';
        confirmationDiv.style.left = e.originalEvent.clientX + 'px';
        confirmationDiv.style.top = e.originalEvent.clientY + 'px';

        // Set up the confirm and cancel button actions
        document.getElementById('confirmButton').onclick = () => {
            var currentIconUrl = marker.getIcon().options.iconUrl;
            var newIconUrl = currentIconUrl === '.assets/icons/placeholder_red.png' ? './assets/icons/placeholder_blue.png' : './assets/icons/placeholder_red.png';
            marker.setIcon(L.icon({
                iconUrl: newIconUrl,
                iconSize: [41, 41],
                iconAnchor: [21, 41]
            }));
            confirmationDiv.style.display = 'none'; // Hide confirmation
        };

        document.getElementById('cancelButton').onclick = () => {
            confirmationDiv.style.display = 'none'; // Hide confirmation
        };
    });
}



        // Function to remove a city
        function removeCity(button, cityName) {
            // Find the index of the city in the markers array
            var index = cityNames.indexOf(cityName);
            if (index > -1) {
                // Remove the marker from the map
                map.removeLayer(markers[index]);
                markers.splice(index, 1); // Remove from markers array
                cityNames.splice(index, 1); // Remove from city names array

                // Remove the city item from the list
                var cityContainer = document.getElementById('cityContainer');
                cityContainer.removeChild(button.parentElement);
            }
        }

        // Right-click context menu
        map.on('contextmenu', function (e) {
            var newLat = e.latlng.lat;
            var newLon = e.latlng.lng;

            var cityName = prompt("Enter city name:");
            if (cityName) {
                var option = document.createElement("option");
                option.value = newLat + ',' + newLon;
                option.text = cityName;
                document.getElementById("cities").add(option);
                updateMapWithNewCity(newLat, newLon, cityName);
            }
        });

        // Function to update the map with the new city coordinates
        function updateMapWithNewCity(lat, lon, cityName) {
            var marker = L.marker([lat, lon], { icon: L.icon({
                iconUrl: './assets/icons/placeholder_blue.png', // Default icon color
                iconSize: [41, 41],
                iconAnchor: [21, 41]
            })})
            .addTo(map)
            .bindPopup(cityName + ": " + lat + ", " + lon)
            .openPopup();

            markers.push(marker);
            cityNames.push(cityName);
            updateCityList(cityName, marker);
            var group = L.featureGroup(markers);
            map.fitBounds(group.getBounds());
        }