//Пути для получения данных с фейкового сервера:
// http://localhost:3000/doctors - данные о докторах
// http://localhost:3000/patients - данные о пациентах
// http://localhost:3000/meetings - данные о приемах
// http://localhost:3000/prescriptions - данные о назначениях

/* Patient Registration Page */

document.addEventListener('DOMContentLoaded', function () {
    // Получение элементов формы и кнопки
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const form = document.getElementById('patientRegistrationForm');
    const registerBtn = document.getElementById('registerBtn');
    const showPasswordIcon = document.getElementById('showPassword');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    // Изначально делаем кнопку неактивной
    registerBtn.setAttribute('disabled', 'disabled');

    function validateForm() {
        const isFullNameFilled = fullNameInput.value.trim() !== '';
        const isEmailFilled = emailInput.value.trim() !== '';
        const isPasswordFilled = passwordInput.value.trim() !== '';
        const isConfirmPasswordFilled = confirmPasswordInput.value.trim() !== '';

        if (isFullNameFilled && isEmailFilled && isPasswordFilled && isConfirmPasswordFilled) {
            registerBtn.removeAttribute('disabled'); // Активируем кнопку, если все поля заполнены
        } else {
            registerBtn.setAttribute('disabled', 'disabled'); // Деактивируем кнопку, если есть незаполненные поля
        }
    }

    // Вызов функций при вводе данных в поля:
    fullNameInput.addEventListener('input', validateForm);
    emailInput.addEventListener('input', validateForm);
    passwordInput.addEventListener('input', validateForm);
    confirmPasswordInput.addEventListener('input', validateForm);

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Отменить стандартное поведение отправки формы

        // Вызов функций для валидации полей формы и сохранение результатов
        const isFullNameValid = validateFullName(fullNameInput);
        const isEmailValid = validateEmail(emailInput);
        const isPasswordValid = validatePassword(passwordInput);
        const isConfirmPasswordValid = validateConfirmPassword(confirmPasswordInput);

        // Проверка, есть ли ошибки валидации перед отправкой данных на сервер
        if (!isFullNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
            return; // Если есть ошибки, остановить отправку формы на сервер
        }

        // Создание объекта с данными для отправки на сервер
        const data = {
            id: getRandomUniqueId(),
            name: fullNameInput.value,
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
                // Сохранение ID пользователя в куки
                document.cookie = `userID=${data.id}; expires=Thu, 18 Dec 2023 12:00:00 UTC; path=/`;

                // Вызов функции для вывода ID пользователя:
                displayUserID(data.id);

            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    });

    // Функция для вывода ID пользователя в replyDiv.
    function displayUserID(id) {
        const replyDiv = document.getElementById('replyDiv');
        replyDiv.innerHTML = `Thank you for registration. Your ID: ${id}`;
    }

    // Функция для валидации полного имени
    function validateFullName(input) {
        const errorMessage = document.getElementById('fullName-error');
        if (!input.value.trim().includes(' ')) {
            errorMessage.textContent = 'Please enter both your name and surname';
            errorMessage.style.color = 'red';
            input.style.borderColor = 'red';
            return false; // Возвращаем false, если есть ошибка валидации
        } else {
            errorMessage.textContent = '';
            input.style.borderColor = '';
            return true; // Возвращаем true, если поле валидно
        }
    }

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

    // Скрипт для работы режима "просмотра" пароля:
    showPasswordIcon.addEventListener('click', function () {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
        } else {
            passwordInput.type = 'password';
        }
    });
});


