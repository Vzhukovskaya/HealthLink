//Пути для получения данных с фейкового сервера:
// http://localhost:3000/doctors - данные о докторах
// http://localhost:3000/patients - данные о пациентах
// http://localhost:3000/meetings - данные о приемах
// http://localhost:3000/prescriptions - данные о назначениях

/* Patient Registration Page */

document.addEventListener('DOMContentLoaded', function () {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const form = document.getElementById('patientRegistrationForm');
    const registrationForm = document.querySelector('.registration-form');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Отменить стандартное поведение отправки формы

        // Вызов функций для валидации полей формы и сохранение результатов
        const isEmailValid = validateEmail(emailInput);
        const isPasswordValid = validatePassword(passwordInput);
        const isConfirmPasswordValid = validateConfirmPassword(confirmPasswordInput);

        // Проверка, есть ли ошибки валидации перед отправкой данных на сервер
        if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
            return; // Если есть ошибки, остановить отправку формы на сервер
        }

        // Создание объекта с данными для отправки на сервер
        const data = {
            id: getRandomUniqueId(),
            email: emailInput.value,
            password: passwordInput.value
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
                // Сохранение ID пользователя в localStorage после успешной регистрации
                localStorage.setItem('userId', data.id);

                // Вывод сообщения о регистрации с ID пользователя
                const userId = localStorage.getItem('userId');
                // const replyDiv = document.getElementById('replyDiv');
                // const notification = document.createElement('div');
                // notification.classList.add('notification');
                alert(`Thank you for registration, yours ID: ${userId}.`);

                replyDiv.appendChild(notification);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    });

    // Функция для проверки корректности email
    function validateEmail(input) {
        const errorMessage = document.getElementById('email-error');
        if (!emailRegex.test(input.value)) {
            errorMessage.textContent = 'Please enter a valid email address';
            errorMessage.style.color = 'red';
            input.style.borderColor = 'red';
            return false; // Возвращаем false, если есть ошибка валидации
        } else {
            errorMessage.textContent = '';
            input.style.borderColor = '';
            return true; // Возвращаем true, если поле валидно
        }
    }

    // Функция для проверки корректности пароля
    function validatePassword(input) {
        const errorMessage = document.getElementById('password-error');
        if (!input.value.match(passwordRegex)) {
            errorMessage.textContent = 'Please enter a valid password. It should contain at least 1 digit, 1 uppercase letter, 1 lowercase letter, and have a minimum length of 8 characters.';
            errorMessage.style.color = 'red';
            input.style.borderColor = 'red';
            return false; // Возвращаем false, если есть ошибка валидации
        } else {
            errorMessage.textContent = '';
            input.style.borderColor = '';
            return true; // Возвращаем true, если поле валидно
        }
    }

    // Функция для проверки совпадения паролей
    function validateConfirmPassword(input) {
        const errorMessage = document.getElementById('confirmPassword-error');
        const password = passwordInput.value;
        if (input.value !== password) {
            errorMessage.textContent = 'Passwords do not match';
            errorMessage.style.color = 'red';
            input.style.borderColor = 'red';
            return false; // Возвращаем false, если есть ошибка валидации
        } else {
            errorMessage.textContent = '';
            input.style.borderColor = '';
            return true; // Возвращаем true, если поле валидно
        }
    }

    // Создаем массив для хранения сгенерированных идентификаторов
    let generatedIds = [];

    function getRandomUniqueId() {
        let newId;
        do {
            newId = Math.floor(Math.random() * 100) + 1; // Генерация случайного числа от 1 до 100
        } while (generatedIds.includes(newId)); // Повторяем генерацию, пока новый ID уже существует

        // Добавляем новый ID в массив сгенерированных ID
        generatedIds.push(newId);

        return newId;
    }
});

/* Patient Login Page */

document.addEventListener('DOMContentLoaded', function () {
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');
    const loginForm = document.getElementById('patientLoginForm');
    const loginBtn = document.getElementById('loginBtn');

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
                const notificationDiv = document.getElementById('notification');

                if (data.loggedIn) {
                    window.location.href = 'create_meeting.html'; // Перенаправление на другую страницу при успешном входе
                } else {
                    notificationDiv.textContent = 'Login failed. Please check your credentials.'; // Вывод сообщения об ошибке
                    notificationDiv.style.color = 'red'; // Пример добавления стиля для сообщения об ошибке

                    // Скрыть сообщение через 5 секунд (300000 миллисекунд)
                    setTimeout(function () {
                        notificationDiv.textContent = ''; // Очистить текст сообщения
                    }, 300000);
                }
            })
            .catch(error => {
                const notificationDiv = document.getElementById('notification');
                notificationDiv.textContent = 'There was a problem with the fetch operation: ' + error.message; // Вывод сообщения об ошибке запроса
                notificationDiv.style.color = 'red'; // Пример добавления стиля для сообщения об ошибке
            });
    });
});


const notificationDiv = document.getElementById('notificationDiv');
const closeNotificationBtn = document.getElementById('closeNotificationBtn');
const loginPasswordInput = document.getElementById('loginPassword');
const showPasswordIcon = document.getElementById('showPassword');


// Показываем сообщение об ошибке при нажатии на кнопку входа
const loginBtn = document.getElementById('loginBtn');
loginBtn.addEventListener('click', function (event) {
    event.preventDefault(); // Отменяем стандартное поведение кнопки

    // Здесь должен быть ваш код отправки запроса и обработки ответа
    // ...

    const data = {
        loggedIn: false // Пример ответа от сервера
    };

    if (!data.loggedIn) {
        notificationDiv.style.display = 'block'; // Отображаем сообщение об ошибке
    }
});

// Скрываем сообщение об ошибке при клике на него
notificationDiv.addEventListener('click', function () {
    notificationDiv.style.display = 'none'; // Скрываем сообщение об ошибке
});

// Скрипт для работы режима "просмотра" пароля:
showPasswordIcon.addEventListener('click', function () {
    if (loginPasswordInput.type === 'password') {
        loginPasswordInput.type = 'text';
    } else {
        loginPasswordInput.type = 'password';
    }
});



