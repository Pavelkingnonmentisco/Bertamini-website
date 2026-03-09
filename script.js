// FORZA IL RESET DEI VECCHI DATI (Eseguilo una volta)
// Se vuoi resettare tutto il database, togli il commento alla riga sotto:
// localStorage.clear(); 

const ADMIN_AUTORIZZATI = ["Daniel", "Michele", "Mav", "Arduino", "Strepitoso", "Archadian", "Djsamy", "Cobra", "Baj", "Mirko", "Maverick", "Pavel", "Diego"];

const GRADI_LISTA = ["Founder", "Co-Founder", "Owner", "Co Owner", "Community Manager", "Server Supervisor", "Staff Manager", "Supervisor", "Head Admin", "Senior Admin", "Admin", "Trial Admin", "Head Mod", "Senior Mod", "Moderator", "Trial Mod", "Head Helper", "Senior Helper", "Helper", "Trial Helper"];

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

let globalData = JSON.parse(localStorage.getItem('LSC_Data')) || {}; 
let credentials = {}; // Lo resettiamo ogni volta all'avvio per applicare le nuove password

function gen3Digits() { return Math.floor(100 + Math.random() * 900); }

function syncSystem() {
    console.log("--- RESET E GENERAZIONE CREDENZIALI ---");
    staffDatabase.forEach((s, i) => {
        const userKey = s.nome.toLowerCase();
        if (!globalData[s.nome]) globalData[s.nome] = { warns: 0, totalSeconds: 0 };
        
        let pass;
        // PASSWORD FISSE DI EMERGENZA
        if(s.nome === "Daniel") pass = "D-101";
        else if(s.nome === "Michele") pass = "M-202";
        else if(s.nome === "Mav") pass = "M-303";
        else if(s.nome === "Arduino") pass = "A-404";
        else pass = s.nome.charAt(0).toUpperCase() + "-" + gen3Digits();

        credentials[userKey] = {
            psw: pass,
            matricola: "ITD-" + (i + 1).toString().padStart(2, '0'),
            grado: s.grado,
            nomeOriginale: s.nome
        };
        console.log(`User: ${s.nome} | Psw: ${pass}`);
    });
    // Salviamo le credenziali pulite
    localStorage.setItem('LSC_Credentials', JSON.stringify(credentials));
}

syncSystem();

function checkLogin() {
    const userIn = document.getElementById('username').value.trim().toLowerCase();
    const passIn = document.getElementById('password').value.trim();
    
    // Debug rapido per te
    console.log("Tentativo:", userIn, "Pass:", passIn);

    if (credentials[userIn]) {
        if (credentials[userIn].psw === passIn) {
            const data = credentials[userIn];
            currentUser = { nome: data.nomeOriginale, matricola: data.matricola, grado: data.grado };
            
            if (ADMIN_AUTORIZZATI.includes(data.nomeOriginale)) {
                document.getElementById('nav-admin').style.display = 'block';
            }

            document.getElementById('login-overlay').style.display = 'none';
            document.getElementById('main-content').style.display = 'flex';
            initData();
        } else {
            alert("Password Errata! Per Daniel usa: D-101");
        }
    } else {
        alert("Utente non trovato!");
    }
}

// ... il resto delle funzioni (initData, startService, stopService, addNewStaff) rimane uguale a prima
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
function formatTime(sec) { const h = Math.floor(sec / 3600); const m = Math.floor((sec % 3600) / 60); return h + "h " + m + "m"; }
function showSection(id) { document.querySelectorAll('.tab-content').forEach(s => s.style.display = 'none'); document.getElementById(id).style.display = 'block'; }
function startService() { document.getElementById('btn-start').style.display = 'none'; document.getElementById('btn-stop').style.display = 'inline-block'; timerInterval = setInterval(() => { seconds++; let h = Math.floor(seconds/3600).toString().padStart(2,'0'); let m = Math.floor((seconds%3600)/60).toString().padStart(2,'0'); let s = (seconds%60).toString().padStart(2,'0'); document.getElementById('timer-display').innerText = h + ":" + m + ":" + s; }, 1000); }
function stopService() { clearInterval(timerInterval); globalData[currentUser.nome].totalSeconds += seconds; seconds = 0; document.getElementById('timer-display').innerText = "00:00:00"; document.getElementById('btn-start').style.display = 'inline-block'; document.getElementById('btn-stop').style.display = 'none'; localStorage.setItem('LSC_Data', JSON.stringify(globalData)); initData(); }
