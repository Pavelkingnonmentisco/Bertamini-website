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

let globalData = JSON.parse(localStorage.getItem('ITD_System_Data_V2')) || {};
let currentUser = null;
let timerSeconds = 0;
let timerInterval = null;

function checkLogin() {
    const userIn = document.getElementById('username').value.trim();
    const passIn = document.getElementById('password').value.trim();
    const found = staffDatabase.find(u => u.nome.toLowerCase() === userIn.toLowerCase());

    if (found && found.psw === passIn) {
        currentUser = found;
        if (!globalData[found.nome]) globalData[found.nome] = { warns: 0, totalSeconds: 0 };
        
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        
        // Pannello admin visibile solo a gradi alti
        const admins = ["Founder", "Owner", "Co-Founder", "Co Owner", "Supervisor", "Staff Manager"];
        if (admins.includes(found.grado)) document.getElementById('nav-admin').style.display = 'inline-block';

        updateUI();
    } else {
        alert("Password Errata! Ricorda il formato (Es: Nome-01)");
    }
}

function updateUI() {
    document.getElementById('user-display-name').innerText = currentUser.nome;
    document.getElementById('staffer-grade').innerText = currentUser.grado;
    document.getElementById('staffer-warns').innerText = globalData[currentUser.nome].warns;
    const idx = staffDatabase.findIndex(x => x.nome === currentUser.nome) + 1;
    document.getElementById('staffer-id').innerText = `ITD-${idx.toString().padStart(2, '0')}`;
}

function showSection(id) {
    document.querySelectorAll('.tab-content').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

function startService() {
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('btn-stop').style.display = 'inline-block';
    document.getElementById('status-text').innerText = "Servizio in corso";
    document.getElementById('status-text').style.color = "#00d4ff";

    timerInterval = setInterval(() => {
        timerSeconds++;
        const h = Math.floor(timerSeconds/3600).toString().padStart(2,'0');
        const m = Math.floor((timerSeconds%3600)/60).toString().padStart(2,'0');
        const s = (timerSeconds%60).toString().padStart(2,'0');
        document.getElementById('timer-display').innerText = `${h}:${m}:${s}`;
    }, 1000);
}

function stopService() {
    clearInterval(timerInterval);
    globalData[currentUser.nome].totalSeconds += timerSeconds;
    timerSeconds = 0;
    document.getElementById('timer-display').innerText = "00:00:00";
    document.getElementById('status-text').innerText = "Nessun servizio attivo";
    document.getElementById('status-text').style.color = "";
    document.getElementById('btn-start').style.display = 'inline-block';
    document.getElementById('btn-stop').style.display = 'none';
    localStorage.setItem('ITD_System_Data_V2', JSON.stringify(globalData));
}
