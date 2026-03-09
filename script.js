// LISTA ADMIN AUTORIZZATI (Controllo Rigido)
const ADMIN_AUTORIZZATI = ["Daniel", "Michele", "Mav", "Arduino", "Strepitoso", "Archadian", "Djsamy", "Cobra", "Baj", "Mirko", "Maverick", "Pavel", "Diego"];

const GRADI_LISTA = [
    "Founder", "Co-Founder", "Owner", "Co Owner", "Community Manager", 
    "Server Supervisor", "Staff Manager", "Supervisor", "Head Admin", 
    "Senior Admin", "Admin", "Trial Admin", "Head Mod", "Senior Mod", 
    "Moderator", "Trial Mod", "Head Helper", "Senior Helper", "Helper", "Trial Helper"
];

// DATABASE COMPLETO 33 MEMBRI
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
let currentUser = null;
let seconds = 0, timerInterval = null;

// Funzione di sincronizzazione (Eseguita all'avvio)
function syncSystem() {
    staffDatabase.forEach((s, i) => {
        const id = (i + 1).toString().padStart(2, '0');
        const userKey = s.nome.toLowerCase(); // Chiave sempre minuscola per evitare errori
        
        if (!globalData[s.nome]) globalData[s.nome] = { warns: 0, totalSeconds: 0 };
        
        // Genera credenziali standard se non esistono già (es. caricate da nuove aggiunte)
        if (!credentials[userKey]) {
            credentials[userKey] = {
                psw: s.nome.charAt(0).toUpperCase() + "-" + id,
                matricola: "ITD-" + id,
                grado: s.grado,
                nomeOriginale: s.nome
            };
        }
    });
}
syncSystem();

// FUNZIONE DI LOGIN CORRETTA
function checkLogin() {
    const userIn = document.getElementById('username').value.trim().toLowerCase();
    const passIn = document.getElementById('password').value.trim();
    
    console.log("Tentativo login per:", userIn); // Debug in console

    if (credentials[userIn]) {
        if (credentials[userIn].psw === passIn) {
            // Login Successo
            const data = credentials[userIn];
            currentUser = { 
                nome: data.nomeOriginale, 
                matricola: data.matricola, 
                grado: data.grado 
            };

            // Controllo permessi Admin (confronto esatto nomi)
            if (ADMIN_AUTORIZZATI.includes(data.nomeOriginale)) {
                document.getElementById('nav-admin').style.display = 'block';
            }

            document.getElementById('login-overlay').style.display = 'none';
            document.getElementById('main-content').style.display = 'flex';
            initData();
        } else {
            alert("Password Errata! Ricorda il formato (Es: Daniel-01)");
        }
    } else {
        alert("Utente non trovato nel database!");
    }
}

// Inizializzazione Dati Interfaccia
function initData() {
    const n = currentUser.nome;
    document.getElementById('staffer-name').innerText = n.toUpperCase();
    document.getElementById('staffer-grade').innerText = currentUser.grado;
    document.getElementById('staffer-id').innerText = currentUser.matricola;
    document.getElementById('staffer-warns').innerText = globalData[n].warns;
    document.getElementById('staffer-logs').innerText = formatTime(globalData[n].totalSeconds);

    // Update Pannello Admin
    const adminSelect = document.getElementById('select-staff-admin');
    if(adminSelect) {
        adminSelect.innerHTML = staffDatabase.map(s => `<option value="${s.nome}">${s.nome}</option>`).join("");
    }
    
    const gradeSelect = document.getElementById('new-staff-grade');
    if(gradeSelect) {
        gradeSelect.innerHTML = GRADI_LISTA.map(g => `<option value="${g}">${g}</option>`).join("");
    }

    // Report Ore
    document.getElementById('admin-hours-body').innerHTML = staffDatabase.map(s => `
        <tr>
            <td>${s.nome}</td>
            <td>${s.grado}</td>
            <td>${globalData[s.nome].warns}</td>
            <td>${formatTime(globalData[s.nome].totalSeconds)}</td>
        </tr>
    `).join("");

    // Tabella Matricole
    document.getElementById('staffTableBody').innerHTML = staffDatabase.map((s, i) => `
        <tr><td>ITD-${(i+1).toString().padStart(2,'0')}</td><td>${s.nome}</td><td>${s.grado}</td></tr>
    `).join("");
}

// Timer
function startService() {
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('btn-stop').style.display = 'inline-block';
    timerInterval = setInterval(() => {
        seconds++;
        let h = Math.floor(seconds/3600).toString().padStart(2,'0');
        let m = Math.floor((seconds%3600)/60).toString().padStart(2,'0');
        let s = (seconds%60).toString().padStart(2,'0');
        document.getElementById('timer-display').innerText = h + ":" + m + ":" + s;
    }, 1000);
}

function stopService() {
    clearInterval(timerInterval);
    globalData[currentUser.nome].totalSeconds += seconds;
    seconds = 0;
    document.getElementById('timer-display').innerText = "00:00:00";
    document.getElementById('btn-start').style.display = 'inline-block';
    document.getElementById('btn-stop').style.display = 'none';
    initData();
}

// Admin Actions
function addNewStaff() {
    const n = document.getElementById('new-staff-name').value.trim();
    const g = document.getElementById('new-staff-grade').value;
    const p = document.getElementById('new-staff-pass').value.trim();
    if(n && p) {
        staffDatabase.push({ nome: n, grado: g });
        credentials[n.toLowerCase()] = { psw: p, matricola: "ITD-NEW", grado: g, nomeOriginale: n };
        syncSystem(); initData();
        alert("Staffer aggiunto!");
    }
}

function modifyWarn(v) {
    const t = document.getElementById('select-staff-admin').value;
    globalData[t].warns = Math.max(0, globalData[t].warns + v);
    initData();
}

function formatTime(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return h + "h " + m + "m";
}

function showSection(id) {
    document.querySelectorAll('.tab-content').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}
