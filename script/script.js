/* Patient Registration Page */

document.addEventListener('DOMContentLoaded', function () {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    formBtn.addEventListener('click', function (event) {
        validateEmail(emailInput);
        validatePassword(passwordInput);
        validateConfirmPassword(confirmPasswordInput);

        event.preventDefault(); // Остановить отправку формы, если есть ошибки
    });

    // Функция для проверки корректности email
    function validateEmail(input) {
        const errorMessage = document.getElementById('email-error');
        if (!emailRegex.test(input.value)) {
            errorMessage.textContent = 'Please enter a valid email address';
            errorMessage.style.color = 'red';
            input.style.borderColor = 'red';
        } else {
            errorMessage.textContent = '';
            input.style.borderColor = '';
        }
    }

    // Функция для проверки корректности пароля
    function validatePassword(input) {
        const errorMessage = document.getElementById('password-error');
        if (!input.value.match(passwordRegex)) {
            errorMessage.textContent = 'Please enter a valid password. It should contain at least 1 digit, 1 uppercase letter, 1 lowercase letter, and have a minimum length of 8 characters.';
            errorMessage.style.color = 'red';
            input.style.borderColor = 'red';
        } else {
            errorMessage.textContent = '';
            input.style.borderColor = '';
        }
    }

    // Функция для проверки совпадения паролей
    function validateConfirmPassword(input) {
        const errorMessage = document.getElementById('confirmPassword-error');
        const password = passwordInput.value;
        if (input.value !== password) {
            errorMessage.textContent = 'Passwords not match';
            errorMessage.style.color = 'red';
            input.style.borderColor = 'red';
        } else {
            errorMessage.textContent = '';
            input.style.borderColor = '';
        }
    }

    // Добавление обязательного поля
    const inputs = document.querySelectorAll('input[required]');
    inputs.forEach(function (input) {
        input.addEventListener('input', function () {
            if (!input.value.trim()) {
                input.nextElementSibling.textContent = 'This field is required';
                input.nextElementSibling.style.color = 'red';
                input.style.borderColor = 'red';
            } else {
                input.nextElementSibling.textContent = '';
                input.style.borderColor = ''; // Вернуть стандартный цвет границы
            }
        });
    });

//Пути для получения данных с фейкового сервера:
// http://localhost:3000/doctors - данные о докторах
// http://localhost:3000/patients - данные о пациентах
// http://localhost:3000/meetings - данные о приемах
// http://localhost:3000/prescriptions - данные о назначениях



