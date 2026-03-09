// Membri per i turni (Solo quelli indicati)
const turniStaff = [
    "Hydro", "Fabbri", "Matz", "Nathalino", "Viper", "Xenoo", "Adamo", 
    "Gabriel", "Chorno", "Joker", "Nenne", "Mattia", "Lollo", "Simo", 
    "Vortex", "Void", "Sangue", "Ibra", "Noxen", "Ash"
];

// Elenco completo matricole
const matricole = [
    "Daniel", "Michele", "Mav", "Arduino", "Strepitoso", "Archadian", "Baj", 
    "Cobra", "Djsamy", "Mirko", "Maverick", "Pavel", "Diego", "Hydro", "Fabbri", 
    "Matz", "Nathalino", "Viper", "Xenoo", "Adamo", "Gabriel", "Chorno", "Joker", 
    "Nenne", "Mattia", "Lollo", "Simo", "Vortex", "Void", "Sangue", "Ibra", "Noxen", "Ash"
];

const giorni = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];

// Funzione Login
function checkLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    
    // Regola password: Iniziale Nome + 123 (Es: Hydro -> H123)
    if (user && pass === user.charAt(0).toUpperCase() + "123") {
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        initSite();
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}

function initSite() {
    generateStaffTable();
    generateSchedule();
}

// Genera Tabella Staff
function generateStaffTable() {
    const tbody = document.querySelector('#staffTable tbody');
    matricole.forEach((nome, i) => {
        const id = (i + 1).toString().padStart(2, '0');
        tbody.innerHTML += `<tr>
            <td><span class="badge">ITD-${id}</span></td>
            <td>${nome}</td>
            <td style="color: #44ff44;">● Attivo</td>
        </tr>`;
    });
}

// Genera Turni (3 pom e 3 sera per giorno)
function generateSchedule() {
    const tbody = document.querySelector('#scheduleTable tbody');
    let staffIndex = 0;

    giorni.forEach(giorno => {
        let pom = [], sera = [];
        
        // Prendi 3 per il pomeriggio
        for(let j=0; j<3; j++) {
            pom.push(turniStaff[staffIndex % turniStaff.length]);
            staffIndex++;
        }
        // Prendi 3 per la sera
        for(let j=0; j<3; j++) {
            sera.push(turniStaff[staffIndex % turniStaff.length]);
            staffIndex++;
        }

        tbody.innerHTML += `<tr>
            <td><strong>${giorno}</strong></td>
            <td>${pom.join(", ")}</td>
            <td>${sera.join(", ")}</td>
        </tr>`;
    });
}
