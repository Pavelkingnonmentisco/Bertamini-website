// Database Nomi e Gradi (in ordine di matricola)
const staffDatabase = [
    {nome: "Daniel", grado: "Founder"}, {nome: "Michele", grado: "Founder"},
    {nome: "Mav", grado: "Co-Founder"}, {nome: "Arduino", grado: "Owner"},
    {nome: "Strepitoso", grado: "Co Owner"}, {nome: "Archadian", grado: "Co Owner"},
    {nome: "Baj", grado: "Server Supervisor"}, {nome: "Cobra", grado: "Community Manager"},
    {nome: "Djsamy", grado: "Community Manager"}, {nome: "Mirko", grado: "Staff Manager"},
    {nome: "Maverick", grado: "Staff Manager"}, {nome: "Pavel", grado: "Supervisor"},
    {nome: "Diego", grado: "Supervisor"}, {nome: "Hydro", grado: "Head Admin"},
    {nome: "Fabbri", grado: "Senior Admin"}, {nome: "Matz", grado: "Senior Admin"},
    {nome: "Nathalino", grado: "Senior Admin"}, {nome: "Viper", grado: "Admin"},
    {nome: "Xenoo", grado: "Admin"}, {nome: "Adamo", grado: "Head Mod"},
    {nome: "Gabriel", grado: "Moderator"}, {nome: "Chorno", grado: "Moderator"},
    {nome: "Joker", grado: "Moderator"}, {nome: "Nenne", grado: "Trial Mod"},
    {nome: "Mattia", grado: "Trial Mod"}, {nome: "Lollo", grado: "Senior Helper"},
    {nome: "Simo", grado: "Helper"}, {nome: "Vortex", grado: "Helper"},
    {nome: "Void", grado: "Helper"}, {nome: "Sangue", grado: "Trial Helper"},
    {nome: "Ibra", grado: "Trial Helper"}, {nome: "Noxen", grado: "Trial Helper"},
    {nome: "Ash", grado: "Trial Helper"}
];

const credentials = {};
staffDatabase.forEach((staff, index) => {
    const matricolaNum = (index + 1).toString().padStart(2, '0');
    credentials[staff.nome.toLowerCase()] = {
        password: staff.nome.charAt(0).toUpperCase() + "-" + matricolaNum,
        matricola: "ITD-" + matricolaNum,
        grado: staff.grado
    };
});

let currentUser = null;
let seconds = 0, timerInterval = null, startTime = null, sessionCount = 0;

function checkLogin() {
    const userIn = document.getElementById('username').value.trim().toLowerCase();
    const passIn = document.getElementById('password').value.trim();
    
    if (credentials[userIn] && credentials[userIn].password === passIn) {
        currentUser = { nome: userIn, ...credentials[userIn] };
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('main-content').style.display = 'flex';
        initData();
    } else { 
        document.getElementById('login-error').style.display = 'block'; 
    }
}

function showSection(id) {
    document.querySelectorAll('.tab-content').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

// Timer
function startService() {
    startTime = new Date().toLocaleString();
    document.getElementById('timer-status').innerText = "IN SERVIZIO";
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('btn-pause').style.display = 'inline-block';
    document.getElementById('btn-stop').style.display = 'inline-block';
    timerInterval = setInterval(() => { seconds++; updateDisplay(); }, 1000);
}

function updateDisplay() {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    document.getElementById('timer-display').innerText = `${h}:${m}:${s}`;
}

function stopService() {
    clearInterval(timerInterval);
    sessionCount++;
    document.getElementById('staffer-logs').innerText = sessionCount;
    const row = `<tr><td>${startTime}</td><td>${new Date().toLocaleTimeString()}</td><td>${document.getElementById('timer-display').innerText}</td><td>OK</td></tr>`;
    document.getElementById('history-body').innerHTML += row;
    seconds = 0; updateDisplay();
    document.getElementById('btn-start').style.display = 'inline-block';
    document.getElementById('btn-pause').style.display = 'none';
    document.getElementById('btn-stop').style.display = 'none';
}

function initData() {
    // Info Profilo
    document.getElementById('staffer-name').innerText = currentUser.nome.toUpperCase();
    document.getElementById('staffer-id').innerText = currentUser.matricola;
    document.getElementById('staffer-grade').innerText = currentUser.grado;

    // Tabella Matricole
    const mBody = document.querySelector('#staffTable tbody');
    mBody.innerHTML = "";
    staffDatabase.forEach((staff, i) => {
        mBody.innerHTML += `<tr><td>ITD-${(i+1).toString().padStart(2,'0')}</td><td>${staff.nome}</td><td>${staff.grado}</td><td style="color:#44ff44">●</td></tr>`;
    });

    // Tabella Turni (Membri da Hydro ITD-14 in poi)
    const tBody = document.querySelector('#scheduleTable tbody');
    tBody.innerHTML = "";
    const giorni = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
    const turniStaff = staffDatabase.slice(13).map(s => s.nome);
    let idx = 0;
    giorni.forEach(g => {
        let p = [], s = [];
        for(let j=0; j<3; j++) { p.push(turniStaff[idx % turniStaff.length]); idx++; }
        for(let j=0; j<3; j++) { s.push(turniStaff[idx % turniStaff.length]); idx++; }
        tBody.innerHTML += `<tr><td><strong>${g}</strong></td><td>${p.join(", ")}</td><td>${s.join(", ")}</td></tr>`;
    });
}

function exportTableToCSV(tableId, filename) {
    let csv = [];
    let rows = document.getElementById(tableId).closest('table').querySelectorAll("tr");
    rows.forEach(r => {
        let cols = r.querySelectorAll("td, th");
        let row = [];
        cols.forEach(c => row.push(c.innerText.replace(/,/g, ";")));
        csv.push(row.join(","));
    });
    let link = document.createElement("a");
    link.href = window.URL.createObjectURL(new Blob([csv.join("\n")], {type: "text/csv"}));
    link.download = filename;
    link.click();
}
