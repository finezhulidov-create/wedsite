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

                // Ячейка с кнопкой "Удалить"
                const actionsCell = document.createElement('td');
                actionsCell.style.padding = '10px 0';
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Удалить';
                deleteBtn.style.backgroundColor = '#dc3545';
                deleteBtn.style.color = 'white';
                deleteBtn.style.border = 'none';
                deleteBtn.style.padding = '5px 10px';
                deleteBtn.style.cursor = 'pointer';
                deleteBtn.style.borderRadius = '4px';
                deleteBtn.style.fontSize = '14px';

                // Обработчик клика по кнопке
                deleteBtn.onclick = (e) => {
                    e.preventDefault();
                    if (!confirm(`Вы уверены, что хотите удалить пользователя ${user.username}?`)) return;

                    fetch('/api/admin/deleteuser', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: user.id })
                    })
                    .then(response => {
                        if (response.ok) {
                            row.remove(); // Удаляем строку из таблицы
                            loadAgreesCount(); // Обновляем счётчик согласных
                        } else {
                            alert('Ошибка при удалении');
                        }
                    })
                    .catch(err => {
                        console.error('Ошибка:', err);
                        alert('Произошла ошибка при удалении');
                    });
                };

                actionsCell.appendChild(deleteBtn);
                row.appendChild(nameCell);
                row.appendChild(answersCell);
                row.appendChild(actionsCell); // Добавляем колонку действий
                usersTableBody.appendChild(row);
            });

            // Пагинация
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

// Загрузка количества согласных гостей
function loadAgreesCount() {
    fetch('/api/admin/agres')
        .then(response => response.json())
        .then(count => {
            document.getElementById('agreesCount').textContent = count;
        })
        .catch(err => {
            console.error('Ошибка при загрузке количества:', err);
            document.getElementById('agreesCount').textContent = 'ошибка';
        });
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

// Загрузка при старте
document.addEventListener('DOMContentLoaded', () => {
    loadUsers(0);
    loadAgreesCount();
});