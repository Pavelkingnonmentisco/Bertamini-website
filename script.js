const staffDatabase = [
    {nome: "Daniel", grado: "Founder", psw: "Daniel-01"},
    {nome: "Michele", grado: "Founder", psw: "Michele-01"},
    {nome: "Mav", grado: "Co-Founder", psw: "Mav-01"},
    {nome: "Arduino", grado: "Owner", psw: "Arduino-01"},
    {nome: "Strepitoso", grado: "Co Owner", psw: "Strepitoso-01"},
    {nome: "Archadian", grado: "Co Owner", psw: "Archadian-01"},
    {nome: "Baj", grado: "Server Supervisor", psw: "Baj-01"},
    {nome: "Cobra", grado: "Community Manager", psw: "Cobra-01"},
    {nome: "Djsamy", grado: "Community Manager", psw: "Djsamy-01"},
    {nome: "Mirko", grado: "Staff Manager", psw: "Mirko-01"},
    {nome: "Maverick", grado: "Staff Manager", psw: "Maverick-01"},
    {nome: "Pavel", grado: "Supervisor", psw: "Pavel-01"},
    {nome: "Diego", grado: "Supervisor", psw: "Diego-01"},
    {nome: "Hydro", grado: "Head Admin", psw: "Hydro-01"},
    {nome: "Nik", grado: "Admin", psw: "Nik-01"},
    {nome: "Simo", grado: "Admin", psw: "Simo-01"},
    {nome: "Black", grado: "Admin", psw: "Black-01"},
    {nome: "Jack", grado: "Moderator", psw: "Jack-01"},
    {nome: "Lollo", grado: "Moderator", psw: "Lollo-01"},
    {nome: "Kekko", grado: "Moderator", psw: "Kekko-01"},
    {nome: "Fede", grado: "Moderator", psw: "Fede-01"},
    {nome: "Tommy", grado: "Helper", psw: "Tommy-01"},
    {nome: "Ale", grado: "Helper", psw: "Ale-01"},
    {nome: "Seby", grado: "Helper", psw: "Seby-01"},
    {nome: "Riky", grado: "Helper", psw: "Riky-01"},
    {nome: "Gio", grado: "Helper", psw: "Gio-01"},
    {nome: "Luca", grado: "Trial Helper", psw: "Luca-01"},
    {nome: "Marco", grado: "Trial Helper", psw: "Marco-01"},
    {nome: "Ash", grado: "Trial Helper", psw: "Ash-01"},
    {nome: "Pietro", grado: "Trial Helper", psw: "Pietro-01"},
    {nome: "Vito", grado: "Trial Helper", psw: "Vito-01"},
    {nome: "Lillo", grado: "Trial Helper", psw: "Lillo-01"},
    {nome: "Zio", grado: "Trial Helper", psw: "Zio-01"}
];

let globalData = JSON.parse(localStorage.getItem('ITD_Data_Final')) || {};
let currentUser = null;
let seconds = 0;
let timerInterval = null;

function checkLogin() {
    const uInput = document.getElementById('username').value.trim();
    const pInput = document.getElementById('password').value.trim();
    const found = staffDatabase.find(u => u.nome.toLowerCase() === uInput.toLowerCase());

    if (found && found.psw === pInput) {
        currentUser = found;
        if (!globalData[found.nome]) globalData[found.nome] = { warns: 0, totalSeconds: 0 };
        
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        
        const adminGradi = ["Founder", "Owner", "Co-Founder", "Co Owner", "Supervisor", "Staff Manager"];
        if (adminGradi.includes(found.grado)) document.getElementById('nav-admin').style.display = 'inline-block';

        updateUI();
    } else {
        alert("Password errata! Ricorda il formato (Es: Nome-01)");
    }
}

function updateUI() {
    document.getElementById('user-display-name').innerText = currentUser.nome;
    document.getElementById('staffer-grade').innerText = currentUser.grado;
    document.getElementById('staffer-warns').innerText = globalData[currentUser.nome].warns;
    document.getElementById('staffer-id').innerText = `ITD-${(staffDatabase.findIndex(x => x.nome === currentUser.nome) + 1).toString().padStart(2, '0')}`;
}

function startService() {
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('btn-stop').style.display = 'inline-block';
    document.getElementById('status-text').innerText = "Servizio attivo";
    timerInterval = setInterval(() => {
        seconds++;
        let h = Math.floor(seconds/3600).toString().padStart(2,'0');
        let m = Math.floor((seconds%3600)/60).toString().padStart(2,'0');
        let s = (seconds%60).toString().padStart(2,'0');
        document.getElementById('timer-display').innerText = `${h}:${m}:${s}`;
    }, 1000);
}

function stopService() {
    clearInterval(timerInterval);
    globalData[currentUser.nome].totalSeconds += seconds;
    seconds = 0;
    document.getElementById('timer-display').innerText = "00:00:00";
    document.getElementById('status-text').innerText = "Nessun servizio attivo";
    document.getElementById('btn-start').style.display = 'inline-block';
    document.getElementById('btn-stop').style.display = 'none';
    localStorage.setItem('ITD_Data_Final', JSON.stringify(globalData));
}

function showSection(id) {
    document.querySelectorAll('.tab-content').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}
