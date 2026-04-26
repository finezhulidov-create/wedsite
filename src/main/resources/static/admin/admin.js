/**
 * Админ-панель с пагинацией (безопасная версия)
 */

document.addEventListener('DOMContentLoaded', () => {
    const usersList = document.getElementById('usersList');
    const userForm = document.getElementById('userForm');
    const usernameInput = document.getElementById('username');

    // Базовый URL вашего бэкенда
    const API_URL = '/api/admin/users';

    // Текущая страница
    let currentPage = 0;
    const size = 10;

    // Загрузка пользователей
    const loadUsers = async () => {
        try {
            const response = await fetch(`${API_URL}?page=${currentPage}&size=${size}`);
            if (!response.ok) throw new Error(`Ошибка ${response.status}`);
            const data = await response.json();

            if (!data.hasOwnProperty('content')) {
                throw new Error('Неверный формат ответа: ожидался Page<UserDto>');
            }

            const users = data.content;
            usersList.innerHTML = '';

            if (users.length === 0) {
                usersList.innerHTML = '<li>Нет пользователей</li>';
            } else {
                users.forEach(user => {
                    const li = document.createElement('li');
                    li.textContent = user.username || user.name || 'Без имени';
                    usersList.appendChild(li);
                });
            }

            updatePagination(currentPage, data.totalPages || 0);
        } catch (err) {
            console.error('Ошибка загрузки:', err);
            usersList.innerHTML = `<li style="color: red;">Ошибка: ${err.message}</li>`;
        }
    };

    // Обновление пагинации
    const updatePagination = (current, total) => {
        let pagination = document.getElementById('pagination');
        if (!pagination) {
            pagination = createPagination();
        }

        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const pageInfo = document.getElementById('page-info');

        if (prevBtn) prevBtn.disabled = current === 0;
        if (nextBtn) nextBtn.disabled = current >= total - 1 || total === 0;
        if (pageInfo) pageInfo.textContent = `Страница ${current + 1} из ${total || 1}`;
    };

    // Создание пагинации
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
        document.querySelector('.container')?.appendChild(container);
        return container;
    }

    // Добавляем обработчики только ПОСЛЕ создания кнопок
    const setupPaginationListeners = () => {
        document.getElementById('prev-page')?.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                loadUsers();
            }
        });

        document.getElementById('next-page')?.addEventListener('click', () => {
            currentPage++;
            loadUsers();
        });
    };

    // Отправка формы
    userForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = usernameInput?.value.trim();

        if (!name) {
            alert('Введите имя');
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: name })
            });

            if (response.ok) {
                usernameInput.value = '';
                currentPage = 0;
                loadUsers();
            } else {
                alert('Ошибка при добавлении');
            }
        } catch (err) {
            alert('Ошибка сети');
            console.error(err);
        }
    });

    // 🚀 Инициализация
    const init = () => {
        if (!usersList) {
            console.error('❌ Элемент #usersList не найден');
            return;
        }

        // Создаём пагинацию, если её нет
        if (!document.getElementById('pagination')) {
            createPagination();
        }

        // Устанавливаем слушатели
        setupPaginationListeners();

        // Загружаем пользователей
        loadUsers();
    };

    // Запуск
    init();
});