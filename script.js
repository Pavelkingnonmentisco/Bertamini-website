const staffDatabase = [
    {nome: "Daniel", grado: "Founder", psw: "Daniel-01"},
    {nome: "Michele", grado: "Founder", psw: "Michele-01"},
    {nome: "Mav", grado: "Co-Founder", psw: "Mav-01"},
    {nome: "Arduino", grado: "Owner", psw: "Arduino-01"},
    {nome: "Strepitoso", grado: "Co Owner", psw: "Strepitoso-01"},
    {nome: "Archadian", grado: "Co Owner", psw: "Archadian-01"},
    {nome: "Djsamy", grado: "Community Manager", psw: "Djsamy-01"},
    {nome: "Cobra", grado: "Community Manager", psw: "Cobra-01"},
    {nome: "Baj", grado: "Server Supervisor", psw: "Baj-01"},
    {nome: "Mirko", grado: "Staff Manager", psw: "Mirko-01"},
    {nome: "Maverick", grado: "Staff Manager", psw: "Maverick-01"},
    {nome: "Pavel", grado: "Supervisor", psw: "Pavel-01"},
    {nome: "Diego", grado: "Supervisor", psw: "Diego-01"},
    {nome: "Hydro", grado: "Head Admin", psw: "Hydro-01"},
    {nome: "Fabbri", grado: "Senior Admin", psw: "Fabbri-01"},
    {nome: "Matz", grado: "Senior Admin", psw: "Matz-01"},
    {nome: "Nathalino", grado: "Senior Admin", psw: "Nathalino-01"},
    {nome: "Viper", grado: "Admin", psw: "Viper-01"},
    {nome: "Xenoo", grado: "Admin", psw: "Xenoo-01"},
    {nome: "Adamo", grado: "Head Mod", psw: "Adamo-01"},
    {nome: "Gabriel", grado: "Moderator", psw: "Gabriel-01"},
    {nome: "Chorno", grado: "Moderator", psw: "Chorno-01"},
    {nome: "Joker", grado: "Moderator", psw: "Joker-01"},
    {nome: "Nenne", grado: "Trial Mod", psw: "Nenne-01"},
    {nome: "Mattia", grado: "Trial Mod", psw: "Mattia-01"},
    {nome: "Lollo", grado: "Senior Helper", psw: "Lollo-01"},
    {nome: "Simo", grado: "Helper", psw: "Simo-01"},
    {nome: "Vortex", grado: "Helper", psw: "Vortex-01"},
    {nome: "Void", grado: "Helper", psw: "Void-01"},
    {nome: "Sangue", grado: "Trial Helper", psw: "Sangue-01"},
    {nome: "Ibra", grado: "Trial Helper", psw: "Ibra-01"},
    {nome: "Noxen", grado: "Trial Helper", psw: "Noxen-01"},
    {nome: "Ash", grado: "Trial Helper", psw: "Ash-01"}
];

let globalData = JSON.parse(localStorage.getItem('ITD_V4_System')) || {};
let currentUser = null;
let seconds = 0;
let timer = null;
let logs = [];

function checkLogin() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const found = staffDatabase.find(s => s.nome.toLowerCase() === user.toLowerCase() && pass === s.psw);

    if (found) {
        currentUser = found;
        if (!globalData[found.nome]) globalData[found.nome] = { warns: 0, totalSeconds: 0 };
        
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        
        document.getElementById('user-display-name').innerText = found.nome;
        document.getElementById('staffer-grade').innerText = found.grado;
        document.getElementById('staffer-warns').innerText = globalData[found.nome].warns;
        
        const idx = staffDatabase.findIndex(x => x.nome === currentUser.nome) + 1;
        document.getElementById('staffer-id').innerText = `ITD-${idx.toString().padStart(2, '0')}`;

        const admins = ["Founder", "Owner", "Co-Founder", "Co Owner", "Supervisor", "Staff Manager"];
        if (admins.includes(found.grado)) document.getElementById('nav-admin').style.display = 'inline-block';
        
    } else { alert("Dati errati! Ricorda il formato (Es: Nome-01)"); }
}

function startService() {
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('btn-pause').style.display = 'inline-block';
    document.getElementById('btn-stop').style.display = 'inline-block';
    document.getElementById('status-text').innerText = "in servizio";
    document.getElementById('status-text').style.color = "#00d4ff";
    timer = setInterval(() => {
        seconds++;
        updateDisplay();
    }, 1000);
}

function pauseService() {
    clearInterval(timer);
    document.getElementById('btn-start').style.display = 'inline-block';
    document.getElementById('btn-start').innerText = "riprendi";
    document.getElementById('btn-pause').style.display = 'none';
    document.getElementById('status-text').innerText = "in pausa";
    document.getElementById('status-text').style.color = "#fbbf24";
}

function stopService() {
    clearInterval(timer);
    const timeStr = document.getElementById('timer-display').innerText;
    logs.unshift({ time: timeStr, date: new Date().toLocaleTimeString() });
    
    globalData[currentUser.nome].totalSeconds += seconds;
    seconds = 0;
    
    updateDisplay();
    renderLogs();
    
    localStorage.setItem('ITD_V4_System', JSON.stringify(globalData));

    document.getElementById('btn-start').innerText = "inizia servizio";
    document.getElementById('btn-pause').style.display = 'none';
    document.getElementById('btn-stop').style.display = 'none';
    document.getElementById('btn-start').style.display = 'inline-block';
    document.getElementById('status-text').innerText = "nessun servizio attivo";
    document.getElementById('status-text').style.color = "";
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
