const authorizedAdmins = ["Daniel", "Michele", "Mav", "Arduino", "Strepitoso", "Archadian", "Djsamy", "Cobra", "Baj", "Mirko", "Maverick", "Pavel", "Diego"];

// DATABASE VERSION 9 (Update se cambi struttura)
let globalData = JSON.parse(localStorage.getItem('ITDR_DATA_V9')) || {};
let currentUser = null;
let seconds = 0;
let timer = null;
let selectedStaffer = null;

// Popolamento iniziale se il database è vuoto
const initialStaff = [
    {nome: "Daniel", grado: "Founder"}, {nome: "Michele", grado: "Founder"}, {nome: "Mav", grado: "Co-Founder"},
    {nome: "Arduino", grado: "Owner"}, {nome: "Strepitoso", grado: "Co Owner"}, {nome: "Archadian", grado: "Co Owner"},
    {nome: "Djsamy", grado: "Community Manager"}, {nome: "Cobra", grado: "Community Manager"}, {nome: "Baj", grado: "Server Supervisor"},
    {nome: "Mirko", grado: "Staff Manager"}, {nome: "Maverick", grado: "Staff Manager"}, {nome: "Pavel", grado: "Supervisor"},
    {nome: "Diego", grado: "Supervisor"}
    // ... Altri membri aggiunti dinamicamente o tramite arruolamento
];

if (Object.keys(globalData).length === 0) {
    initialStaff.forEach((s, i) => {
        globalData[s.nome] = { 
            pass: s.nome + "-01", // Password default
            grado: s.grado, 
            matricola: "ITD-" + (i + 1).toString().padStart(2, '0'), 
            warns: 0, 
            totalSeconds: 0, 
            logs: [] 
        };
    });
    save();
}

function checkLogin() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    
    // Cerca lo staffer nel database (case insensitive per il nome)
    const staffName = Object.keys(globalData).find(n => n.toLowerCase() === user.toLowerCase());

    if (staffName && pass === globalData[staffName].pass) {
        currentUser = staffName;
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        
        if (authorizedAdmins.includes(staffName)) {
            document.getElementById('nav-admin').style.display = 'inline-block';
            populateStaffSelector();
        }
        updateUI();
    } else { alert("Credenziali errate o utente inesistente!"); }
}

function updateUI() {
    const d = globalData[currentUser];
    document.getElementById('staffer-grade').innerText = d.grado;
    document.getElementById('staffer-warns').innerText = d.warns;
    document.getElementById('staffer-id').innerText = d.matricola;
    document.getElementById('staffer-total-hours').innerText = formatTime(d.totalSeconds || 0);
    renderLogs();
}

// ARRUOLAMENTO NUOVO STAFF
function addNewStaff() {
    const name = document.getElementById('new-name').value.trim();
    const pass = document.getElementById('new-pass').value.trim();
    const grade = document.getElementById('new-grade').value.trim();
    const mat = document.getElementById('new-mat').value.trim();

    if (!name || !pass || !grade || !mat) {
        alert("Compila tutti i campi per l'arruolamento!");
        return;
    }

    if (globalData[name]) {
        alert("Questo nome utente esiste già nel database!");
        return;
    }

    globalData[name] = {
        pass: pass,
        grado: grade,
        matricola: mat,
        warns: 0,
        totalSeconds: 0,
        logs: []
    };

    save();
    alert("Staffer " + name + " arruolato con successo!");
    
    // Pulisce i campi
    document.getElementById('new-name').value = "";
    document.getElementById('new-pass').value = "";
    document.getElementById('new-grade').value = "";
    document.getElementById('new-mat').value = "";
    
    populateStaffSelector();
}

// --- FUNZIONI TIMER E UI (Mantenere le stesse della versione precedente) ---
function formatTime(totalSec) {
    const h = Math.floor(totalSec/3600).toString().padStart(2,'0');
    const m = Math.floor((totalSec%3600)/60).toString().padStart(2,'0');
    const s = (totalSec%60).toString().padStart(2,'0');
    return `${h}:${m}:${s}`;
}

function startService() {
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('btn-pause').style.display = 'inline-block';
    document.getElementById('btn-stop').style.display = 'inline-block';
    document.getElementById('status-text').innerText = "In Servizio";
    timer = setInterval(() => { seconds++; document.getElementById('timer-display').innerText = formatTime(seconds); }, 1000);
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
    globalData[currentUser].totalSeconds += seconds;
    globalData[currentUser].logs.unshift({ time, date: new Date().toLocaleString() });
    seconds = 0;
    save();
    document.getElementById('timer-display').innerText = "00:00:00";
    updateUI();
    document.getElementById('btn-start').innerText = "Inizia Servizio";
    document.getElementById('btn-start').style.display = 'inline-block';
    document.getElementById('btn-pause').style.display = 'none';
    document.getElementById('btn-stop').style.display = 'none';
    document.getElementById('status-text').innerText = "Nessun servizio attivo";
}

// --- ADMIN CONTROLS ---
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
    save(); alert("Grado aggiornato!"); updateUI();
}

function updateStaffMatricola() {
    globalData[selectedStaffer].matricola = document.getElementById('edit-matricola').value;
    save(); alert("Matricola aggiornata!"); updateUI();
}

function modifyWarns(n) {
    globalData[selectedStaffer].warns = Math.max(0, globalData[selectedStaffer].warns + n);
    save(); updateUI();
}

function resetHours() {
    if(confirm("Vuoi azzerare i log di " + selectedStaffer + "?")) {
        globalData[selectedStaffer].totalSeconds = 0;
        globalData[selectedStaffer].logs = [];
        save(); updateUI();
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

function save() { localStorage.setItem('ITDR_DATA_V9', JSON.stringify(globalData)); }
