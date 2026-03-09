const staffDatabase = [
    {nome: "Daniel", grado: "Founder"}, {nome: "Michele", grado: "Founder"}, {nome: "Mav", grado: "Co-Founder"},
    {nome: "Arduino", grado: "Owner"}, {nome: "Strepitoso", grado: "Co Owner"}, {nome: "Archadian", grado: "Co Owner"},
    {nome: "Djsamy", grado: "Community Manager"}, {nome: "Cobra", grado: "Community Manager"}, {nome: "Baj", grado: "Server Supervisor"},
    {nome: "Mirko", grado: "Staff Manager"}, {nome: "Maverick", grado: "Staff Manager"}, {nome: "Pavel", grado: "Supervisor"},
    {nome: "Diego", grado: "Supervisor"}, {nome: "Hydro", grado: "Head Admin"}, {nome: "Fabbri", grado: "Senior Admin"},
    {nome: "Matz", grado: "Senior Admin"}, {nome: "Nathalino", grado: "Senior Admin"}, {nome: "Viper", grado: "Admin"},
    {nome: "Xenoo", grado: "Admin"}, {nome: "Adamo", grado: "Head Mod"}, {nome: "Gabriel", grado: "Moderator"},
    {nome: "Chorno", grado: "Moderator"}, {nome: "Joker", grado: "Moderator"}, {nome: "Nenne", grado: "Trial Mod"},
    {nome: "Mattia", grado: "Trial Mod"}, {nome: "Lollo", grado: "Senior Helper"}, {nome: "Simo", grado: "Helper"},
    {nome: "Vortex", grado: "Helper"}, {nome: "Void", grado: "Helper"}, {nome: "Sangue", grado: "Trial Helper"},
    {nome: "Ibra", grado: "Trial Helper"}, {nome: "Noxen", grado: "Trial Helper"}, {nome: "Ash", grado: "Trial Helper"}
];

// Caricamento dati da memoria locale
let globalData = JSON.parse(localStorage.getItem('ITD_Management_V5')) || {};
let currentUser = null;
let seconds = 0;
let timer = null;
let selectedStaffer = null;

// Inizializza database se vuoto
staffDatabase.forEach(s => {
    if (!globalData[s.nome]) {
        globalData[s.nome] = { warns: 0, totalSeconds: 0, logs: [] };
    }
});

function checkLogin() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const found = staffDatabase.find(s => s.nome.toLowerCase() === user.toLowerCase() && pass === s.nome + "-01");

    if (found) {
        currentUser = found;
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        
        // Verifica Permessi Admin
        const admins = ["Founder", "Owner", "Co-Founder", "Co Owner", "Supervisor", "Staff Manager"];
        if (admins.includes(found.grado)) {
            document.getElementById('nav-admin').style.display = 'inline-block';
            populateStaffSelector();
        }

        updateUI();
    } else { alert("Accesso Negato!"); }
}

function updateUI() {
    document.getElementById('user-display-name').innerText = currentUser.nome;
    document.getElementById('staffer-grade').innerText = currentUser.grado;
    document.getElementById('staffer-warns').innerText = globalData[currentUser.nome].warns;
    document.getElementById('staffer-id').innerText = "ITD-" + (staffDatabase.findIndex(x => x.nome === currentUser.nome) + 1).toString().padStart(2, '0');
    renderLogs();
}

// LOGICA TIMER
function startService() {
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('btn-pause').style.display = 'inline-block';
    document.getElementById('btn-stop').style.display = 'inline-block';
    document.getElementById('status-text').innerText = "in servizio";
    timer = setInterval(() => { seconds++; updateDisplay(); }, 1000);
}

function pauseService() {
    clearInterval(timer);
    document.getElementById('btn-start').style.display = 'inline-block';
    document.getElementById('btn-start').innerText = "riprendi";
    document.getElementById('btn-pause').style.display = 'none';
    document.getElementById('status-text').innerText = "in pausa";
}

function stopService() {
    clearInterval(timer);
    const timeStr = document.getElementById('timer-display').innerText;
    globalData[currentUser.nome].logs.unshift({ time: timeStr, date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() });
    globalData[currentUser.nome].totalSeconds += seconds;
    
    seconds = 0;
    saveData();
    updateDisplay();
    renderLogs();
    
    document.getElementById('btn-start').innerText = "inizia servizio";
    document.getElementById('btn-pause').style.display = 'none';
    document.getElementById('btn-stop').style.display = 'none';
    document.getElementById('btn-start').style.display = 'inline-block';
    document.getElementById('status-text').innerText = "nessun servizio attivo";
}

function updateDisplay() {
    const h = Math.floor(seconds/3600).toString().padStart(2,'0');
    const m = Math.floor((seconds%3600)/60).toString().padStart(2,'0');
    const s = (seconds%60).toString().padStart(2,'0');
    document.getElementById('timer-display').innerText = `${h}:${m}:${s}`;
}

// LOGICA ADMIN
function populateStaffSelector() {
    const sel = document.getElementById('staff-selector');
    staffDatabase.forEach(s => {
        let opt = document.createElement('option');
        opt.value = s.nome;
        opt.innerText = s.nome + " (" + s.grado + ")";
        sel.appendChild(opt);
    });
}

function loadStaffMember() {
    selectedStaffer = document.getElementById('staff-selector').value;
    document.getElementById('admin-controls').style.display = selectedStaffer ? 'block' : 'none';
}

function modifyWarns(amount) {
    if (!selectedStaffer) return;
    globalData[selectedStaffer].warns = Math.max(0, globalData[selectedStaffer].warns + amount);
    saveData();
    alert(`Richiami di ${selectedStaffer} aggiornati a: ${globalData[selectedStaffer].warns}`);
    if (selectedStaffer === currentUser.nome) updateUI();
}

function resetHours() {
    if (!selectedStaffer || !confirm(`Vuoi davvero resettare le ore di ${selectedStaffer}?`)) return;
    globalData[selectedStaffer].totalSeconds = 0;
    globalData[selectedStaffer].logs = [];
    saveData();
    alert(`Ore e Log di ${selectedStaffer} resettati.`);
    if (selectedStaffer === currentUser.nome) updateUI();
}

function addManualLog() {
    const ore = prompt("Quante ore vuoi aggiungere? (Formato HH:MM:SS)", "01:00:00");
    if (ore) {
        globalData[selectedStaffer].logs.unshift({ time: ore, date: "Aggiunto Manualmente" });
        saveData();
        alert("Turno aggiunto con successo.");
        if (selectedStaffer === currentUser.nome) updateUI();
    }
}

function renderLogs() {
    const list = document.getElementById('logs-list');
    list.innerHTML = globalData[currentUser.nome].logs.map(l => `
        <div class="log-item">
            <span><strong>${l.time}</strong></span>
            <span style="color:gray">${l.date}</span>
        </div>
    `).join('');
}

function showSection(id) {
    document.querySelectorAll('.tab-content').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

function saveData() {
    localStorage.setItem('ITD_Management_V5', JSON.stringify(globalData));
}
