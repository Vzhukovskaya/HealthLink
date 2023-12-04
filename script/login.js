/* Patient Login Page */

document.addEventListener('DOMContentLoaded', function () {
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');
    const loginForm = document.getElementById('patientLoginForm');
    const loginBtn = document.getElementById('loginBtn');
    const notificationDiv = document.getElementById('notificationDiv');
    const showPasswordIcon = document.getElementById('showPassword');

    loginEmailInput.addEventListener('input', validateForm);
    loginPasswordInput.addEventListener('input', validateForm);

    // Функция validateForm проверяет, заполнены ли оба поля. Если оба поля заполнены, кнопка "Login" становится активной, в противном случае она остается неактивной.
    function validateForm() {
        if (loginEmailInput.value.trim() !== '' && loginPasswordInput.value.trim() !== '') {
            loginBtn.removeAttribute('disabled');
        } else {
            loginBtn.setAttribute('disabled', 'disabled');
        }
    }

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Отменить стандартное поведение отправки формы

        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;

        // Создание объекта с данными для отправки на сервер
        const data = {
            email: email,
            password: password
        };

        // Опции для fetch-запроса
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        // Выполнение POST-запроса на сервер (необходимо указать правильный URL)
        fetch('http://localhost:3000/patients', options)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .then(data => {
                const serverPassword = data.password;

                if (password === serverPassword) {
                    document.cookie = `userID=${data.id}; expires=Thu, 18 Dec 2023 12:00:00 UTC; path=/`;
                    window.location.href = 'create_meeting.html';
                } else {
                    notificationDiv.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    });

    // Скрываем сообщение об ошибке при клике на него
    notificationDiv.addEventListener('click', function () {
        notificationDiv.style.display = 'none';
    });

    // Скрипт для работы режима "просмотра" пароля:
    showPasswordIcon.addEventListener('click', function () {
        if (loginPasswordInput.type === 'password') {
            loginPasswordInput.type = 'text';
        } else {
            loginPasswordInput.type = 'password';
        }
    });
});
