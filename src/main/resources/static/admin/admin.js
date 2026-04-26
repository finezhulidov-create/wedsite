/**
 * Простой JS для админ-панели
 */

document.addEventListener('DOMContentLoaded', () => {
    const usersList = document.getElementById('usersList');
    const userForm = document.getElementById('userForm');
    const usernameInput = document.getElementById('username');

    // Базовый URL вашего бэкенда
    const API_URL = '/api/admin/users';  // Предполагается, что у вас есть такой эндпоинт

    // Загрузка пользователей
    const loadUsers = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Ошибка загрузки');
            const users = await response.json();

            usersList.innerHTML = users.length ? '' : '<li>Нет пользователей</li>';

            users.forEach(user => {
                const li = document.createElement('li');
                li.textContent = user.username || user.name;
                usersList.appendChild(li);
            });
        } catch (err) {
            usersList.innerHTML = `<li style="color: red;">Ошибка: ${err.message}</li>`;
            console.error(err);
        }
    };

    // Отправка формы
    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = usernameInput.value.trim();

        if (!name) return;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: name })
            });

            if (response.ok) {
                usernameInput.value = '';
                loadUsers(); // Обновить список
            } else {
                alert('Ошибка при добавлении');
            }
        } catch (err) {
            alert('Ошибка сети');
            console.error(err);
        }
    });

    // Загрузить пользователей при старте
    loadUsers();
});