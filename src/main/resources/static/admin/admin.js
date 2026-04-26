/**
 * Админ-панель: отображение пользователей в таблице
 */

document.addEventListener('DOMContentLoaded', () => {
    const usersTableBody = document.getElementById('usersTableBody');
    const userForm = document.getElementById('userForm');
    const usernameInput = document.getElementById('username');
    const pagination = document.getElementById('pagination') || createPaginationContainer();

    // Базовый URL вашего бэкенда
    const API_URL = '/api/admin/users';

    // Параметры пагинации
    let currentPage = 0;
    const size = 10;

    /**
     * Загрузка пользователей с сервера
     */
    const loadUsers = async () => {
        try {
            const response = await fetch(`${API_URL}?page=${currentPage}&size=${size}`);
            if (!response.ok) throw new Error(`Ошибка ${response.status}: ${response.statusText}`);

            const data = await response.json();

            if (!data.hasOwnProperty('content')) {
                throw new Error('Неверный формат ответа: ожидался Page<UserDto>');
            }

            const users = data.content;
            usersTableBody.innerHTML = '';

            if (users.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = '<td colspan="2" style="text-align: center;">Нет пользователей</td>';
                usersTableBody.appendChild(row);
            } else {
                users.forEach(user => {
                    const row = document.createElement('tr');

                    // Колонка Username
                    const nameCell = document.createElement('td');
                    nameCell.textContent = user.username || 'Аноним';
                    nameCell.style.padding = '10px';
                    nameCell.style.borderBottom = '1px solid #ddd';

                    // Колонка Answers
                    const answersCell = document.createElement('td');
                    answersCell.style.padding = '10px';
                    answersCell.style.borderBottom = '1px solid #ddd';
                    answersCell.style.whiteSpace = 'pre-line'; // Перенос по строкам
                    answersCell.style.maxWidth = '400px';
                    answersCell.style.wordBreak = 'break-word';

                    if (Array.isArray(user.answers) && user.answers.length > 0) {
                        answersCell.textContent = user.answers.join('\n');
                    } else {
                        answersCell.textContent = '—';
                    }

                    row.appendChild(nameCell);
                    row.appendChild(answersCell);
                    usersTableBody.appendChild(row);
                });
            }

            updatePagination(currentPage, data.totalPages || 0);
        } catch (err) {
            console.error('Ошибка загрузки пользователей:', err);
            usersTableBody.innerHTML = `
                <tr>
                    <td colspan="2" style="color: red; text-align: center;">
                        Ошибка: ${err.message}
                    </td>
                </tr>
            `;
        }
    };

    /**
     * Обновление пагинации
     */
    const updatePagination = (current, total) => {
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const pageInfo = document.getElementById('page-info');

        if (prevBtn) prevBtn.disabled = current === 0;
        if (nextBtn) nextBtn.disabled = current >= total - 1 || total === 0;
        if (pageInfo) pageInfo.textContent = `Страница ${current + 1} из ${total || 1}`;
    };

    /**
     * Создание контейнера пагинации
     */
    function createPaginationContainer() {
        const container = document.createElement('div');
        container.id = 'pagination';
        container.style.margin = '20px 0';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.gap = '10px';
        container.style.justifyContent = 'center';

        container.innerHTML = `
            <button id="prev-page" style="padding: 8px 12px;">« Назад</button>
            <span id="page-info">Страница 1 из 1</span>
            <button id="next-page" style="padding: 8px 12px;">Вперёд »</button>
        `;

        const target = document.querySelector('.container') || document.body;
        target.appendChild(container);
        return container;
    }

    /**
     * Установка слушателей на кнопки пагинации
     */
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

    /**
     * Добавление нового пользователя
     */
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
                alert('Ошибка при добавлении пользователя');
            }
        } catch (err) {
            alert('Ошибка сети. Проверьте подключение.');
            console.error(err);
        }
    });

    /**
     * Инициализация
     */
    const init = () => {
        if (!usersTableBody) {
            console.error('❌ Элемент #usersTableBody не найден');
            return;
        }

        // Создаём пагинацию, если её нет
        if (!document.getElementById('pagination')) {
            createPaginationContainer();
        }

        // Устанавливаем слушатели
        setupPaginationListeners();

        // Загружаем пользователей
        loadUsers();
    };

    // Запуск
    init();
});