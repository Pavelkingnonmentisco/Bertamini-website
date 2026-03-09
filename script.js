// DATABASE COMPLETO
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
let globalWarns = {}; // Simulazione DB richiami
staffDatabase.forEach((s, i) => {
    const id = (i + 1).toString().padStart(2, '0');
    credentials[s.nome.toLowerCase()] = {
        psw: s.nome.charAt(0).toUpperCase() + "-" + id,
        matricola: "ITD-" + id,
        grado: s.grado
    };
});

let currentUser = null, seconds = 0, timerInterval = null, startTime = null, sessions = 0;

function checkLogin() {
    const user = document.getElementById('username').value.trim().toLowerCase();
    const pass = document.getElementById('password').value.trim();
    
    if (credentials[user] && credentials[user].psw === pass) {
        currentUser = { nome: user, ...credentials[user] };
        
        // Controllo Permessi Admin
        const isAdmin = ["Founder", "Owner", "Co-Founder", "Co Owner", "Server Supervisor", "Supervisor"].includes(currentUser.grado);
        if (isAdmin) document.getElementById('nav-admin').style.display = 'block';

        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('main-content').style.display = 'flex';
        initData();
    } else { document.getElementById('login-error').style.display = 'block'; }
}

function showSection(id) {
    document.querySelectorAll('.tab-content').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

// Logica Timer
function startService() {
    startTime = new Date().toLocaleString();
    document.getElementById('timer-status').innerText = "IN SERVIZIO STAFF";
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('btn-pause').style.display = 'inline-block';
    document.getElementById('btn-stop').style.display = 'inline-block';
    timerInterval = setInterval(() => { seconds++; updateDisplay(); }, 1000);
}

function pauseService() {
    clearInterval(timerInterval);
    document.getElementById('timer-status').innerText = "IN PAUSA";
    document.getElementById('btn-pause').innerText = "Riprendi";
    document.getElementById('btn-pause').onclick = resumeService;
}

function resumeService() {
    document.getElementById('timer-status').innerText = "IN SERVIZIO STAFF";
    document.getElementById('btn-pause').innerText = "Metti in Pausa";
    document.getElementById('btn-pause').onclick = pauseService;
    timerInterval = setInterval(() => { seconds++; updateDisplay(); }, 1000);
}

function updateDisplay() {
    const h = Math.floor(seconds/3600).toString().padStart(2,'0');
    const m = Math.floor((seconds%3600)/60).toString().padStart(2,'0');
    const s = (seconds%60).toString().padStart(2,'0');
    document.getElementById('timer-display').innerText = `${h}:${m}:${s}`;
}

function stopService() {
    clearInterval(timerInterval);
    sessions++;
    document.getElementById('staffer-logs').innerText = sessions;
    const row = `<tr><td>${startTime}</td><td>${new Date().toLocaleTimeString()}</td><td>${document.getElementById('timer-display').innerText}</td><td>OK</td></tr>`;
    document.getElementById('history-body').innerHTML += row;
    seconds = 0; updateDisplay();
    document.getElementById('btn-start').style.display = 'inline-block';
    document.getElementById('btn-pause').style.display = 'none';
    document.getElementById('btn-stop').style.display = 'none';
}

// Gestione Richiami
function modifyWarn(val) {
    const target = document.getElementById('select-staff').value;
    if (!globalWarns[target]) globalWarns[target] = 0;
    globalWarns[target] = Math.max(0, globalWarns[target] + val);
    alert(`Richiami per ${target}: ${globalWarns[target]}`);
    initData();
}

function initData() {
    // Profilo
    const displayName = currentUser.nome.charAt(0).toUpperCase() + currentUser.nome.slice(1);
    document.getElementById('staffer-name').innerText = displayName;
    document.getElementById('staffer-id').innerText = currentUser.matricola;
    document.getElementById('staffer-grade').innerText = currentUser.grado;
    document.getElementById('staffer-warns').innerText = globalWarns[displayName] || 0;

    // Tabelle
    document.querySelector('#staffTable tbody').innerHTML = staffDatabase.map((s,i) => 
        `<tr><td>ITD-${(i+1).toString().padStart(2,'0')}</td><td>${s.nome}</td><td>${s.grado}</td><td style="color:#44ff44">●</td></tr>`).join("");
    
    const select = document.getElementById('select-staff');
    if(select) select.innerHTML = staffDatabase.map(s => `<option value="${s.nome}">${s.nome}</option>`).join("");

    // Turni (da Hydro in poi)
    const tStaff = staffDatabase.slice(13).map(s => s.nome);
    let idx = 0;
    document.querySelector('#scheduleTable tbody').innerHTML = ["Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato","Domenica"].map(g => {
        let p = [], s = [];
        for(let j=0; j<3; j++) p.push(tStaff[idx++ % tStaff.length]);
        for(let j=0; j<3; j++) s.push(tStaff[idx++ % tStaff.length]);
        return `<tr><td><strong>${g}</strong></td><td>${p.join(", ")}</td><td>${s.join(", ")}</td></tr>`;
    }).join("");
}

function exportTableToCSV(id, file) {
    let rows = document.getElementById(id).closest('table').querySelectorAll("tr");
    let csv = Array.from(rows).map(r => Array.from(r.querySelectorAll("td,th")).map(c => c.innerText).join(",")).join("\n");
    let a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], {type:"text/csv"}));
    a.download = file; a.click();
}
