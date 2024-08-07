// script2.js

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form');
    const searchBar = document.getElementById('searchBar');
    const doctorCards = document.querySelector('.doctor-cards');

    // Sample doctors data
    const doctors = [
        { name: 'Dr. John Doe', specialty: 'Cardiology', image: 'doctor1.jpg' },
        { name: 'Dr. Jane Smith', specialty: 'Neurology', image: 'doctor2.jpg' },
        // Add more sample doctors if needed
    ];

    // Function to display doctor cards
    function displayDoctors(doctors) {
        doctorCards.innerHTML = '';
        doctors.forEach(doctor => {
            const card = document.createElement('div');
            card.classList.add('doctor-card');
            card.innerHTML = `
                <img src="${doctor.image}" alt="${doctor.name}" class="doctor-image">
                <div class="doctor-info">
                    <h2>${doctor.name}</h2>
                    <p>Specialty: ${doctor.specialty}</p>
                </div>
            `;
            doctorCards.appendChild(card);
        });
    }

    // Display initial doctors
    displayDoctors(doctors);

    // Search functionality
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const searchTerm = searchBar.value.toLowerCase();
        const filteredDoctors = doctors.filter(doctor =>
            doctor.name.toLowerCase().includes(searchTerm)
        );
        displayDoctors(filteredDoctors);
    });
});
