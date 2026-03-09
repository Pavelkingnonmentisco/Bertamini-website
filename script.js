// Lista autorizzati al Pannello Staff
const authorizedAdmins = ["Daniel", "Michele", "Mav", "Arduino", "Strepitoso", "Archadian", "Djsamy", "Cobra", "Baj", "Mirko", "Maverick", "Pavel", "Diego"];

let globalData = JSON.parse(localStorage.getItem('ITDR_DATA_V7')) || {};
let currentUser = null;
let seconds = 0;
let timer = null;
let selectedStaffer = null;

// Popolamento iniziale database
const initialStaff = [
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

if (Object.keys(globalData).length === 0) {
    initialStaff.forEach((s, i) => {
        globalData[s.nome] = { grado: s.grado, matricola: "ITD-" + (i + 1).toString().padStart(2, '0'), warns: 0, logs: [] };
    });
    localStorage.setItem('ITDR_DATA_V7', JSON.stringify(globalData));
}

function checkLogin() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const staffName = Object.keys(globalData).find(n => n.toLowerCase() === user.toLowerCase());

    if (staffName && pass === staffName + "-01") {
        currentUser = staffName;
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        if (authorizedAdmins.includes(staffName)) {
            document.getElementById('nav-admin').style.display = 'inline-block';
            populateStaffSelector();
        }
        updateUI();
    } else { alert("Dati errati!"); }
}

function updateUI() {
    const d = globalData[currentUser];
    document.getElementById('staffer-grade').innerText = d.grado;
    document.getElementById('staffer-warns').innerText = d.warns;
    document.getElementById('staffer-id').innerText = d.matricola;
    renderLogs();
}

// Timer
function startService() {
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('btn-pause').style.display = 'inline-block';
    document.getElementById('btn-stop').style.display = 'inline-block';
    document.getElementById('status-text').innerText = "In Servizio";
    timer = setInterval(() => { seconds++; updateTimerDisplay(); }, 1000);
}

function pauseService() {
    clearInterval(timer);
    document.getElementById('btn-start').innerText = "Riprendi";
    document.getElementById('btn-start').style.display = 'inline-block';
    document.getElementById('btn-pause').style.display = 'none';
    document.getElementById('status-text').innerText = "In Pausa";
}

function stopService() {
    clearInterval(timer);
    const time = document.getElementById('timer-display').innerText;
    globalData[currentUser].logs.unshift({ time, date: new Date().toLocaleString() });
    seconds = 0;
    save();
    updateTimerDisplay();
    renderLogs();
    document.getElementById('btn-start').innerText = "Inizia Servizio";
    document.getElementById('btn-start').style.display = 'inline-block';
    document.getElementById('btn-pause').style.display = 'none';
    document.getElementById('btn-stop').style.display = 'none';
    document.getElementById('status-text').innerText = "Nessun servizio attivo";
}

function updateTimerDisplay() {
    const h = Math.floor(seconds/3600).toString().padStart(2,'0');
    const m = Math.floor((seconds%3600)/60).toString().padStart(2,'0');
    const s = (seconds%60).toString().padStart(2,'0');
    document.getElementById('timer-display').innerText = `${h}:${m}:${s}`;
}

// Admin
function populateStaffSelector() {
    const sel = document.getElementById('staff-selector');
    sel.innerHTML = '<option value="">Seleziona uno staffer...</option>';
    Object.keys(globalData).sort().forEach(n => {
        sel.innerHTML += `<option value="${n}">${n}</option>`;
    });
}

function loadStaffMember() {
    selectedStaffer = document.getElementById('staff-selector').value;
    if (selectedStaffer) {
        document.getElementById('admin-controls').style.display = 'block';
        document.getElementById('edit-grado').value = globalData[selectedStaffer].grado;
        document.getElementById('edit-matricola').value = globalData[selectedStaffer].matricola;
    }
}

function updateStaffGrado() {
    globalData[selectedStaffer].grado = document.getElementById('edit-grado').value;
    save(); alert("Grado modificato!"); updateUI();
}

function updateStaffMatricola() {
    globalData[selectedStaffer].matricola = document.getElementById('edit-matricola').value;
    save(); alert("Matricola modificata!"); updateUI();
}

function modifyWarns(n) {
    globalData[selectedStaffer].warns = Math.max(0, globalData[selectedStaffer].warns + n);
    save(); updateUI();
}

function resetHours() {
    if(confirm("Resettare tutto?")) {
        globalData[selectedStaffer].logs = [];
        save(); renderLogs();
    }
}

function renderLogs() {
    const list = document.getElementById('logs-list');
    list.innerHTML = globalData[currentUser].logs.map(l => `<div class="log-item"><span>${l.time}</span><span style="color:gray">${l.date}</span></div>`).join('');
}

function showSection(id) {
    document.querySelectorAll('.tab-content').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

function save() { localStorage.setItem('ITDR_DATA_V7', JSON.stringify(globalData)); }
