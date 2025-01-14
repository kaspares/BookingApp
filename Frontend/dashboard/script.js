document.addEventListener("DOMContentLoaded", function () {
    const reservationsApi = 'http://localhost:3000/reservations'; // API do rezerwacji

    // Pobierz dane o rezerwacjach z API
    fetch(reservationsApi)
        .then(response => response.json())
        .then(data => {
            console.log('Rezerwacje:', data.reservations);

            // Znajdź tabelę na stronie
            const reservationsTable = document.getElementById("reservationsTable").getElementsByTagName("tbody")[0];

            // Iteracja po każdej rezerwacji
            data.reservations.forEach(reservation => {
                console.log('Rezerwacja:', reservation);

                const row = reservationsTable.insertRow();

                // Dodaj dane do wiersza
                row.insertCell(0).innerHTML = reservation.offer.name || 'Brak danych';
                row.insertCell(1).innerHTML = reservation.offer.city || 'Brak danych';
                row.insertCell(2).innerText = reservation.klient.nameClient || 'Brak danych';
                row.insertCell(3).innerText = reservation.klient.surname || 'Brak danych';
                row.insertCell(4).innerText = new Date(reservation.checkIn).toLocaleDateString();
                row.insertCell(5).innerText = new Date(reservation.checkOut).toLocaleDateString();
                row.insertCell(6).innerText = reservation.guestsAdults || 'Brak danych';
                row.insertCell(7).innerText = reservation.guestsChildren || '0';
                row.insertCell(8).innerText = reservation.klient.email || 'Brak danych';
                row.insertCell(9).innerText = reservation.klient.phoneNumber || 'Brak danych';
            });
        })
        .catch(error => {
            console.error('Błąd podczas pobierania danych:', error);
        });
});
