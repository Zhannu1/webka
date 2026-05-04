// 1 & 6-тапсырма: Батырма арқылы әрекет және ClassList
function changeHeroTheme() {
    const hero = document.querySelector('.hero');
    hero.classList.toggle('dark-hero'); // Стильді ауыстыру
    const btn = document.getElementById('themeBtn');
    btn.innerText = hero.classList.contains('dark-hero') ? "Light Mode" : "Dark Mode";
}

// 2 & 3-тапсырма: Формамен жұмыс және DOM өзгерту
function addVacancy() {
    const title = document.getElementById('vacancyTitle').value;
    if(title === "") {
        alert("Вакансия атын жазыңыз!");
        return;
    }
    const list = document.getElementById('vacancyList');
    const li = document.createElement('li');
    li.className = 'card';
    li.innerHTML = `<h3>${title}</h3><button class="btn-sm" onclick="this.parentElement.remove()">Өшіру</button>`;
    list.appendChild(li);
    document.getElementById('vacancyTitle').value = ""; // Тазалау
}

// 4-тапсырма: Көріну/Жасыру (FAQ немесе Мәзір)
function toggleInfo() {
    const info = document.getElementById('hiddenInfo');
    info.style.display = (info.style.display === 'none' || info.style.display === '') ? 'block' : 'none';
}

// 5-тапсырма: Counter (Интерактивті санауыш)
let count = 0;
if(document.getElementById('counter')) {
    setInterval(() => {
        count++;
        document.getElementById('counter').innerText = count + " қолданушы онлайн";
    }, 3000);
}

// 7, 8 & 9-тапсырма: Тіркелу, Кіру және Auth State
function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;

    if(!name || !email || pass.length < 6) {
        alert("Қате: Барлық өрісті толтырыңыз және құпиясөз кемінде 6 символ болсын!");
        return;
    }

    const userData = { name, email, pass };
    localStorage.setItem('user', JSON.stringify(userData));
    alert("Тіркелу сәтті өтті! Енді кіріңіз.");
    window.location.href = 'login.html';
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if(storedUser && storedUser.email === email && storedUser.pass === pass) {
        localStorage.setItem('isAuth', 'true');
        alert("Сәтті кірдіңіз!");
        window.location.href = 'index.html';
    } else {
        alert("Email немесе пароль қате!");
    }
}

// Авторизацияны тексеру (Бет жүктелгенде)
window.onload = function() {
    const isAuth = localStorage.getItem('isAuth');
    const user = JSON.parse(localStorage.getItem('user'));
    const authArea = document.getElementById('authArea');

    if(isAuth === 'true' && user) {
        authArea.innerHTML = `<span>Сәлем, ${user.name}!</span> <button onclick="logout()" class="btn-sm">Шығу</button>`;
    }
};

function logout() {
    localStorage.removeItem('isAuth');
    window.location.reload();
}