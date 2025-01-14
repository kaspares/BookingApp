function getOffersByCity(city) {
    fetch(`http://localhost:3000/offers/${city}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Nie znaleziono ofert dla podanego miasta.');
            }
            return response.json();
        })
        .then(data => {
            const offersContainer = document.getElementById('offers-container');
            offersContainer.innerHTML = ''; // Wyczyść kontener przed dodaniem nowych ofert

            if (!data.city || data.city.length === 0) {
                offersContainer.innerHTML = '<p>Brak ofert w podanym mieście.</p>';
                return;
            }

            console.log('Dane ofert:', data.city);

            // Wyświetlenie ofert
            data.city.forEach(offer => {
                const offerElement = document.createElement('div');
                offerElement.classList.add('offer');
                const mapId = `map-${offer._id}`; // Unikalny ID dla każdej mapy

                offerElement.innerHTML = `
                    <div class="offer-content">
                        <img src="${offer.imageUrl}" alt="${offer.name}" class="offer-image">
                        <div id="${mapId}" class="offer-map"></div>
                    </div>
                    <div class="offer-details">
                        <h2>${offer.name}</h2>
                        <h4>${offer.city} ${offer.adress}</h4>
                        <p>${offer.description}</p>
                        <p>Goście: ${offer.guests}</p>
                        <p>Cena: ${offer.price} zł</p>
                        <button class="reserve-button">Rezerwuję</button>
                    </div>
                    <div class="reservation-form" style="display: none;">
                        <h3>Formularz rezerwacji</h3>
                        <form id="reservation-form-${offer._id}">
                            <label for="nameClient-${offer._id}">Imię*</label>
                            <input type="text" id="nameClient-${offer._id}" required>
                            <label for="surname-${offer._id}">Nazwisko*</label>
                            <input type="text" id="surname-${offer._id}" required>
                            <label for="email-${offer._id}">Adres e-mail*</label>
                            <input type="email" id="email-${offer._id}" required>
                            <label for="phone-${offer._id}">Numer telefonu*</label>
                            <input type="tel" id="phone-${offer._id}" required>
                            <button type="submit">Zarezerwuj</button>
                        </form>
                    </div>
                `;
                offersContainer.appendChild(offerElement);

                initializeMap(mapId, offer);

                handleReservationProcess(offer, offerElement);
            });

            // Przesuń wyszukiwarkę na górę
            document.getElementById('search-container').classList.add('sticky');
        })
        .catch(error => {
            console.error('Błąd pobierania ofert:', error);
            const offersContainer = document.getElementById('offers-container');
            offersContainer.innerHTML = `<p class="error-message">${error.message}</p>`;
        });
}

// Funkcja do inicjalizacji mapy
function initializeMap(mapId, offer) {
    const map = L.map(mapId).setView(offer.coordinates, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    L.marker(offer.coordinates).addTo(map)
        .bindPopup(`<b>${offer.name}</b><br>${offer.city}`)
        .openPopup();
}

// Funkcja obsługująca proces rezerwacji
function handleReservationProcess(offer, offerElement) {
    const reserveButton = offerElement.querySelector('.reserve-button');
    const reservationForm = offerElement.querySelector('.reservation-form');

    reserveButton.addEventListener('click', () => {
        reservationForm.style.display = 'block';
        reserveButton.style.display = 'none';
    });

    const reservationFormElement = document.getElementById(`reservation-form-${offer._id}`);
    reservationFormElement.addEventListener('submit', (e) => {
        e.preventDefault();

        // Dane klienta z formularza
        const klient = {
            nameClient: document.getElementById(`nameClient-${offer._id}`).value,
            surname: document.getElementById(`surname-${offer._id}`).value,
            email: document.getElementById(`email-${offer._id}`).value,
            phoneNumber: document.getElementById(`phone-${offer._id}`).value,
        };

        // Dane rezerwacji z formularza
        const reservation = {
            offerId: offer._id,
            checkIn: new Date(document.getElementById('check-in').value).toISOString(),
            checkOut: new Date(document.getElementById('check-out').value).toISOString(),
            guestsAdults: document.getElementById('guests-adults').value,
            guestsChildren: document.getElementById('guests-children').value,
        };

        processReservation(klient, reservation, reservationFormElement, reservationForm, offer.name);
    });
}


function processReservation(klient, reservation, formElement, formContainer, offerName) {
    // Tworzenie klienta
    fetch('http://localhost:3000/klients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(klient),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Błąd przy tworzeniu klienta.');
            }
            return response.json();
        })
        .then((clientResponse) => {
            console.log('Klient utworzony:', clientResponse);

            // Dodanie ID klienta do danych rezerwacji
            reservation.klientId = clientResponse.klient._id;

            console.log('Rezerwacja z ID klienta:', reservation);

            // Tworzenie rezerwacji
            return fetch('http://localhost:3000/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reservation),
            });
        })
        .then((response) => {
            if (response.status === 409) {
                throw new Error('Wybrane terminy są już zajęte. Wybierz inne daty.');
            } else if (!response.ok) {
                throw new Error('Błąd przy tworzeniu rezerwacji.');
            }
            return response.json();
        })
        .then((reservationResponse) => {
            console.log('Rezerwacja utworzona:', reservationResponse);
            alert(`Rezerwacja na ${offerName} została pomyślnie złożona.`);
            formElement.reset();
            formContainer.style.display = 'none';
        })
        .catch((error) => {
            console.error('Błąd:', error);
            alert(error.message);
        });
}




// Obsługa kliknięcia przycisku "Szukaj"
document.getElementById('search-button').addEventListener('click', () => {
    const city = document.getElementById('city').value.trim();
    if (!city) {
        alert('Wpisz miasto przed wyszukiwaniem!');
        return;
    }
    getOffersByCity(city);
});

document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('check-in').setAttribute('min', today);
    document.getElementById('check-out').setAttribute('min', today);
});
