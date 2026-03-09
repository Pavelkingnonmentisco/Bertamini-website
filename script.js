// CONFIGURAZIONE GRADI UFFICIALE
const GRADI_LISTA = [
    "Founder", "Co-Founder", "Owner", "Co Owner", "Community Manager", 
    "Server Supervisor", "Staff Manager", "Supervisor", "Head Admin", 
    "Senior Admin", "Admin", "Trial Admin", "Head Mod", "Senior Mod", 
    "Moderator", "Trial Mod", "Head Helper", "Senior Helper", "Helper", "Trial Helper"
];

let staffDatabase = [
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

let globalData = {}; 
let credentials = {};
let currentUser = null, seconds = 0, timerInterval = null, startTime = null;

function updateCredentials() {
    credentials = {};
    staffDatabase.forEach((s, i) => {
        const id = (i + 1).toString().padStart(2, '0');
        const defaultPass = s.nome.charAt(0).toUpperCase() + "-" + id;
        
        credentials[s.nome.toLowerCase()] = {
            psw: credentials[s.nome.toLowerCase()]?.psw || defaultPass,
            matricola: "ITD-" + id,
            grado: s.grado
        };
        if (!globalData[s.nome]) globalData[s.nome] = { warns: 0, totalSeconds: 0 };
    });
}
updateCredentials();

function checkLogin() {
    const user = document.getElementById('username').value.trim().toLowerCase();
    const pass = document.getElementById('password').value.trim();
    if (credentials[user] && credentials[user].psw === pass) {
        currentUser = { nome: user, ...credentials[user] };
        const isAdmin = ["Founder", "Owner", "Co-Founder", "Co Owner", "Server Supervisor", "Supervisor"].includes(currentUser.grado);
        if (isAdmin) document.getElementById('nav-admin').style.display = 'block';
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('main-content').style.display = 'flex';
        initData();
    } else { document.getElementById('login-error').style.display = 'block'; }
}

function stopService() {
    clearInterval(timerInterval);
    const nomeF = currentUser.nome.charAt(0).toUpperCase() + currentUser.nome.slice(1);
    globalData[nomeF].totalSeconds += seconds;
    seconds = 0;
    document.getElementById('timer-display').innerText = "00:00:00";
    document.getElementById('btn-start').style.display = 'inline-block';
    document.getElementById('btn-stop').style.display = 'none';
    initData();
}

// ADMIN FUNCTIONS
function addNewStaff() {
    const n = document.getElementById('new-staff-name').value.trim();
    const g = document.getElementById('new-staff-grade').value;
    const p = document.getElementById('new-staff-pass').value.trim();
    if(n) {
        staffDatabase.push({nome: n, grado: g});
        if(p) { // Se è stata inserita una password custom, la salviamo prima dell'update
            if(!credentials[n.toLowerCase()]) credentials[n.toLowerCase()] = {};
            credentials[n.toLowerCase()].psw = p;
        }
        updateCredentials(); initData();
        alert(`Staffer ${n} aggiunto con successo!`);
    }
}

function removeStaff() {
    const t = document.getElementById('select-staff-admin').value;
    staffDatabase = staffDatabase.filter(s => s.nome !== t);
    updateCredentials(); initData();
}

function formatTime(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return `${h}h ${m}m`;
}

function initData() {
    const dName = currentUser.nome.charAt(0).toUpperCase() + currentUser.nome.slice(1);
    document.getElementById('staffer-name').innerText = dName;
    document.getElementById('staffer-id').innerText = credentials[currentUser.nome.toLowerCase()].matricola;
    document.getElementById('staffer-grade').innerText = credentials[currentUser.nome.toLowerCase()].grado;
    document.getElementById('staffer-warns').innerText = globalData[dName].warns;
    document.getElementById('staffer-logs').innerText = formatTime(globalData[dName].totalSeconds);

    // Gradi nel select
    document.getElementById('new-staff-grade').innerHTML = GRADI_LISTA.map(g => `<option value="${g}">${g}</option>`).join("");
    
    // Lista Admin Rapida
    document.getElementById('select-staff-admin').innerHTML = staffDatabase.map(s => `<option value="${s.nome}">${s.nome}</option>`).join("");
    
    // Tabella Ore (Pannello Admin)
    document.getElementById('admin-hours-body').innerHTML = staffDatabase.map(s => `
        <tr>
            <td>${s.nome}</td>
            <td>${s.grado}</td>
            <td style="color:${globalData[s.nome].warns > 0 ? '#ff4444' : '#aaa'}">${globalData[s.nome].warns}</td>
            <td style="color:var(--primary); font-weight:bold;">${formatTime(globalData[s.nome].totalSeconds)}</td>
        </tr>
    `).join("");

    // Matricole
    document.getElementById('staffTableBody').innerHTML = staffDatabase.map((s,i) => `<tr><td>ITD-${(i+1).toString().padStart(2,'0')}</td><td>${s.nome}</td><td>${s.grado}</td></tr>`).join("");
}

// Timer e Utility restano invariate (vedi codici precedenti)
function startService() {
    document.getElementById('timer-status').innerText = "IN SERVIZIO STAFF";
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('btn-stop').style.display = 'inline-block';
    timerInterval = setInterval(() => { seconds++; updateTimerDisplay(); }, 1000);
}
function updateTimerDisplay() {
    const h = Math.floor(seconds/3600).toString().padStart(2,'0');
    const m = Math.floor((seconds%3600)/60).toString().padStart(2,'0');
    const s = (seconds%60).toString().padStart(2,'0');
    document.getElementById('timer-display').innerText = `${h}:${m}:${s}`;
}
function showSection(id) {
    document.querySelectorAll('.tab-content').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}
function modifyWarn(v) { 
    const t = document.getElementById('select-staff-admin').value;
    globalData[t].warns = Math.max(0, globalData[t].warns + v); initData(); 
}
