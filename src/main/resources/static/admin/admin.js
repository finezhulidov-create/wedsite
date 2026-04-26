/**
 * Админ-панель с пагинацией
 */

document.addEventListener('DOMContentLoaded', () => {
    const usersList = document.getElementById('usersList');
    const pagination = document.getElementById('pagination') || createPagination();
    const userForm = document.getElementById('userForm');
    const usernameInput = document.getElementById('username');

    // Базовый URL вашего бэкенда
    const API_URL = '/api/admin/users';

    // Текущая страница
    let currentPage = 0;
    const size = 10; // Количество на странице (должно совпадать с бэкендом)

    // Загрузка пользователей
    const loadUsers = async () => {
        try {
            const response = await fetch(`${API_URL}?page=${currentPage}&size=${size}`);
            if (!response.ok) throw new Error('Ошибка загрузки');
            const data = await response.json(); // Page<UserDto>

            const users = data.content;

            // Очистка списка
            usersList.innerHTML = '';

            if (users.length === 0) {
                usersList.innerHTML = '<li>Нет пользователей</li>';
                updatePagination(0, 0);
                return;
            }

            // Заполнение списка
            users.forEach(user => {
                const li = document.createElement('li');
                li.textContent = user.username || user.name;
                usersList.appendChild(li);
            });

            // Обновить пагинацию
            updatePagination(currentPage, data.totalPages);
        } catch (err) {
            usersList.innerHTML = `<li style="color: red;">Ошибка: ${err.message}</li>`;
            console.error(err);
        }
    };

    // Обновление интерфейса пагинации
    const updatePagination = (currentPage, totalPages) => {
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const pageInfo = document.getElementById('page-info');

        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage >= totalPages - 1 || totalPages === 0;

        pageInfo.textContent = `Страница ${currentPage + 1} из ${totalPages || 1}`;
    };

    // Кнопка "Назад"
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            loadUsers();
        }
    });

    // Кнопка "Вперёд"
    document.getElementById('next-page').addEventListener('click', () => {
        currentPage++;
        loadUsers();
    });

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
                currentPage = 0; // После добавления — вернуться на первую страницу
                loadUsers();
            } else {
                alert('Ошибка при добавлении');
            }
        } catch (err) {
            alert('Ошибка сети');
            console.error(err);
        }
    });

    // Создаёт пагинацию, если её нет в DOM
    function createPagination() {
        const container = document.createElement('div');
        container.id = 'pagination';
        container.style.margin = '20px 0';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.gap = '10px';

        container.innerHTML = `
            <button id="prev-page" style="padding: 8px 12px;">« Назад</button>
            <span id="page-info">Страница 1 из 1</span>
            <button id="next-page" style="padding: 8px 12px;">Вперёд »</button>
        `;

        document.querySelector('.container').appendChild(container);
        return container;
    }

    // Загрузить пользователей при старте
    loadUsers();
});