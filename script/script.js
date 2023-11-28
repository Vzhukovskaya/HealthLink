/* Patient Registration Page */

document.addEventListener('DOMContentLoaded', function () {
    const formBtn = document.querySelector('.form-btn');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    formBtn.addEventListener('click', function (event) {
        if (!emailRegex.test(emailInput.value)) {
            alert('Please enter a valid email address');
            event.preventDefault();
        }

        if (!passwordRegex.test(passwordInput.value)) {
            alert('Please enter a valid password. It should contain at least 1 digit, 1 uppercase letter, 1 lowercase letter, and have a minimum length of 8 characters.');
            event.preventDefault();
        }

        if (passwordInput.value !== confirmPasswordInput.value) {
            alert('Passwords do not match');
            event.preventDefault();
        }
    });
});

// // Пример GET/POST запроса к фейковому серверу
// fetch('http://') // Замените URL на  API
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(data => {
//         // Обработка полученных данных
//         console.log('Data:', data);
//         // Здесь нужно обновить интерфейс, используя полученные данные
//     })
//     .catch(error => {
//         console.error('There was a problem with the fetch operation:', error);
//     });

