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

let currentUser = null;
let seconds = 0;
let timer = null;
let logs = [];

function checkLogin() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const found = staffDatabase.find(s => s.nome.toLowerCase() === user.toLowerCase() && pass === s.nome + "-01");

    if (found) {
        currentUser = found;
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        document.getElementById('user-display-name').innerText = found.nome;
        document.getElementById('staffer-grade').innerText = found.grado;
        document.getElementById('staffer-id').innerText = "ITD-" + (staffDatabase.indexOf(found) + 1).toString().padStart(2, '0');
    } else { alert("Accesso Negato!"); }
}

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
    logs.unshift({ time: timeStr, date: new Date().toLocaleTimeString() });
    seconds = 0;
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

function renderLogs() {
    const list = document.getElementById('logs-list');
    list.innerHTML = logs.map(l => `<div class="log-item"><span>Durata: ${l.time}</span><span style="color:gray">${l.date}</span></div>`).join('');
}

function showSection(id) {
    document.querySelectorAll('.tab-content').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}
