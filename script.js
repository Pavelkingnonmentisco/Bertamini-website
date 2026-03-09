// LISTA ADMIN CON ACCESSO AL PANNELLO
const ADMIN_AUTORIZZATI = ["Daniel", "Michele", "Mav", "Arduino", "Strepitoso", "Archadian", "Djsamy", "Cobra", "Baj", "Mirko", "Maverick", "Pavel", "Diego"];

const GRADI_LISTA = ["Founder", "Co-Founder", "Owner", "Co Owner", "Community Manager", "Server Supervisor", "Staff Manager", "Supervisor", "Head Admin", "Senior Admin", "Admin", "Trial Admin", "Head Mod", "Senior Mod", "Moderator", "Trial Mod", "Head Helper", "Senior Helper", "Helper", "Trial Helper"];

// DATABASE CON PASSWORD FISSE PER TUTTI
let staffDatabase = [
    {nome: "Daniel", grado: "Founder", psw: "D-101"},
    {nome: "Michele", grado: "Founder", psw: "M-202"},
    {nome: "Mav", grado: "Co-Founder", psw: "M-303"},
    {nome: "Arduino", grado: "Owner", psw: "A-404"},
    {nome: "Strepitoso", grado: "Co Owner", psw: "S-505"},
    {nome: "Archadian", grado: "Co Owner", psw: "A-606"},
    {nome: "Baj", grado: "Server Supervisor", psw: "B-707"},
    {nome: "Cobra", grado: "Community Manager", psw: "C-808"},
    {nome: "Djsamy", grado: "Community Manager", psw: "D-909"},
    {nome: "Mirko", grado: "Staff Manager", psw: "M-111"},
    {nome: "Maverick", grado: "Staff Manager", psw: "M-222"},
    {nome: "Pavel", grado: "Supervisor", psw: "P-333"},
    {nome: "Diego", grado: "Supervisor", psw: "D-444"},
    {nome: "Hydro", grado: "Head Admin", psw: "H-555"},
    {nome: "Fabbri", grado: "Senior Admin", psw: "F-666"},
    {nome: "Matz", grado: "Senior Admin", psw: "M-777"},
    {nome: "Nathalino", grado: "Senior Admin", psw: "N-888"},
    {nome: "Viper", grado: "Admin", psw: "V-999"},
    {nome: "Xenoo", grado: "Admin", psw: "X-123"},
    {nome: "Adamo", grado: "Head Mod", psw: "A-321"},
    {nome: "Gabriel", grado: "Moderator", psw: "G-456"},
    {nome: "Chorno", grado: "Moderator", psw: "C-654"},
    {nome: "Joker", grado: "Moderator", psw: "J-789"},
    {nome: "Nenne", grado: "Trial Mod", psw: "N-987"},
    {nome: "Mattia", grado: "Trial Mod", psw: "M-147"},
    {nome: "Lollo", grado: "Senior Helper", psw: "L-258"},
    {nome: "Simo", grado: "Helper", psw: "S-369"},
    {nome: "Vortex", grado: "Helper", psw: "V-741"},
    {nome: "Void", grado: "Helper", psw: "V-852"},
    {nome: "Sangue", grado: "Trial Helper", psw: "S-963"},
    {nome: "Ibra", grado: "Trial Helper", psw: "I-159"},
    {nome: "Noxen", grado: "Trial Helper", psw: "N-357"},
    {nome: "Ash", grado: "Trial Helper", psw: "A-951"}
];

let globalData = JSON.parse(localStorage.getItem('LSC_Data')) || {}; 
let credentials = {}; 
let currentUser = null;
let seconds = 0, timerInterval = null;

function syncSystem() {
    staffDatabase.forEach((s, i) => {
        const userKey = s.nome.toLowerCase();
        if (!globalData[s.nome]) globalData[s.nome] = { warns: 0, totalSeconds: 0 };
        
        credentials[userKey] = {
            psw: s.psw,
            matricola: "ITD-" + (i + 1).toString().padStart(2, '0'),
            grado: s.grado,
            nomeOriginale: s.nome
        };
    });
    localStorage.setItem('LSC_Credentials', JSON.stringify(credentials));
}

syncSystem();

function checkLogin() {
    const userIn = document.getElementById('username').value.trim().toLowerCase();
    const passIn = document.getElementById('password').value.trim();
    
    if (credentials[userIn] && credentials[userIn].psw === passIn) {
        const data = credentials[userIn];
        currentUser = { nome: data.nomeOriginale, matricola: data.matricola, grado: data.grado };
        
        if (ADMIN_AUTORIZZATI.includes(data.nomeOriginale)) {
            document.getElementById('nav-admin').style.display = 'block';
        }

        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('main-content').style.display = 'flex';
        initData();
    } else {
        alert("Credenziali Errate!");
    }
}

function initData() {
    const n = currentUser.nome;
    document.getElementById('staffer-name').innerText = n.toUpperCase();
    document.getElementById('staffer-grade').innerText = currentUser.grado;
    document.getElementById('staffer-warns').innerText = globalData[n].warns;
    document.getElementById('staffer-logs').innerText = formatTime(globalData[n].totalSeconds);

    document.getElementById('new-staff-grade').innerHTML = GRADI_LISTA.map(g => `<option value="${g}">${g}</option>`).join("");
    document.getElementById('admin-hours-body').innerHTML = staffDatabase.map(s => `<tr><td>${s.nome}</td><td>${s.grado}</td><td>${globalData[s.nome].warns}</td><td>${formatTime(globalData[s.nome].totalSeconds)}</td></tr>`).join("");
    document.getElementById('staffTableBody').innerHTML = staffDatabase.map((s, i) => `<tr><td>ITD-${(i+1).toString().padStart(2,'0')}</td><td>${s.nome}</td><td>${s.grado}</td></tr>`).join("");
}

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
    localStorage.setItem('LSC_Data', JSON.stringify(globalData));
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

function addNewStaff() {
    const n = document.getElementById('new-staff-name').value.trim();
    const g = document.getElementById('new-staff-grade').value;
    let p = document.getElementById('new-staff-pass').value.trim();
    if(n && p) {
        staffDatabase.push({ nome: n, grado: g, psw: p });
        syncSystem(); initData();
        alert("Aggiunto!");
    }
}
