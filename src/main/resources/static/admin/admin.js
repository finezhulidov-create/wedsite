const usersTableBody = document.getElementById('usersTableBody');
const pagination = document.getElementById('pagination');
const allUsersBtn = document.getElementById('allUsersBtn');
const guestsBtn = document.getElementById('guestsBtn');

let currentPage = 0;
let currentEndpoint = '/api/admin/users'; // По умолчанию

// Загрузка данных
function loadUsers(page = 0) {
    const url = `${currentEndpoint}?page=${page}&size=10`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            usersTableBody.innerHTML = '';
            pagination.innerHTML = '';

            let items = [];
            if (Array.isArray(data)) {
                items = data;
            } else if (data.content) {
                items = data.content;
            }

            items.forEach(user => {
                const row = document.createElement('tr');

                const nameCell = document.createElement('td');
                nameCell.textContent = user.username || 'Без имени';
                nameCell.style.padding = '10px 0';

                const answersCell = document.createElement('td');
                answersCell.style.padding = '10px 0';
                if (user.answers && user.answers.length > 0) {
                    answersCell.textContent = user.answers.join(', ');
                } else {
                    answersCell.textContent = 'Нет ответов';
                }

                row.appendChild(nameCell);
                row.appendChild(answersCell);
                usersTableBody.appendChild(row);
            });

            // Пагинация (если это Page)
            if (data.totalPages && data.totalPages > 1) {
                for (let i = 0; i < Math.min(data.totalPages, 5); i++) {
                    const btn = document.createElement('button');
                    btn.textContent = i + 1;
                    btn.disabled = i === data.number;
                    btn.onclick = () => loadUsers(i);
                    pagination.appendChild(btn);
                }
            }
        })
        .catch(err => console.error('Ошибка загрузки:', err));
}

// Переключение между режимами
allUsersBtn.addEventListener('click', () => {
    currentEndpoint = '/api/admin/users';
    allUsersBtn.classList.add('active');
    guestsBtn.classList.remove('active');
    loadUsers(0);
});

guestsBtn.addEventListener('click', () => {
    currentEndpoint = '/api/admin/guests';
    guestsBtn.classList.add('active');
    allUsersBtn.classList.remove('active');
    loadUsers(0);
});

// Стили для активной кнопки (можно вынести в CSS)
const style = document.createElement('style');
style.textContent = `
    .buttons button {
        padding: 10px 20px;
        margin: 10px 5px;
        font-size: 16px;
        cursor: pointer;
        border: 1px solid #ccc;
        background: #f9f9f9;
    }
    .buttons button.active {
        background: #007bff;
        color: white;
        border-color: #007bff;
    }
`;
document.head.appendChild(style);

// Загрузка при старте
loadUsers();