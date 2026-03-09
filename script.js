const staffDatabase = [
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
    {nome: "Ash", grado: "Trial Helper", psw: "A-951"}
];

let globalData = JSON.parse(localStorage.getItem('ITD_Data_Final')) || {}; 
let currentUser = null;
let seconds = 0;
let timerInterval = null;

function checkLogin() {
    const userIn = document.getElementById('username').value.trim();
    const passIn = document.getElementById('password').value.trim();
    const found = staffDatabase.find(u => u.nome.toLowerCase() === userIn.toLowerCase());

    if (found && found.psw === passIn) {
        currentUser = found;
        if (!globalData[found.nome]) globalData[found.nome] = { warns: 0, totalSeconds: 0 };
        
        const adminGradi = ["Founder", "Owner", "Co-Founder", "Co Owner", "Supervisor", "Community Manager", "Server Supervisor", "Staff Manager"];
        if (adminGradi.includes(found.grado)) {
            document.getElementById('nav-admin').style.display = 'inline-block';
        }

        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        updateUI();
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}

function updateUI() {
    const n = currentUser.nome;
    document.getElementById('user-display-name').innerText = n;
    document.getElementById('staffer-grade').innerText = currentUser.grado;
    document.getElementById('staffer-warns').innerText = globalData[n].warns;
    document.getElementById('staffer-id').innerText = `ITD-${(staffDatabase.findIndex(x => x.nome === n) + 1).toString().padStart(2, '0')}`;

    document.getElementById('staffTableBody').innerHTML = staffDatabase.map((s, i) => `
        <tr><td>ITD-${(i+1).toString().padStart(2,'0')}</td><td>${s.nome}</td><td>${s.grado}</td></tr>
    `).join("");

    document.getElementById('admin-hours-body').innerHTML = staffDatabase.map(s => `
        <tr><td>${s.nome}</td><td>${s.grado}</td><td>${globalData[s.nome]?.warns || 0}</td><td>${formatTime(globalData[s.nome]?.totalSeconds || 0)}</td></tr>
    `).join("");
    
    document.getElementById('select-staff-admin').innerHTML = staffDatabase.map(s => `<option value="${s.nome}">${s.nome}</option>`).join("");
}

function startService() {
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('btn-stop').style.display = 'inline-block';
    document.getElementById('status-text').innerText = "SERVIZIO ATTIVO";
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
    document.getElementById('status-text').innerText = "NESSUN SERVIZIO ATTIVO";
    document.getElementById('btn-start').style.display = 'inline-block';
    document.getElementById('btn-stop').style.display = 'none';
    localStorage.setItem('ITD_Data_Final', JSON.stringify(globalData));
    updateUI();
}

function formatTime(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return `${h}h ${m}m`;
}

function showSection(id) {
    document.querySelectorAll('.tab-content').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

function modifyWarn(v) {
    const t = document.getElementById('select-staff-admin').value;
    globalData[t].warns = Math.max(0, globalData[t].warns + v);
    localStorage.setItem('ITD_Data_Final', JSON.stringify(globalData));
    updateUI();
}
