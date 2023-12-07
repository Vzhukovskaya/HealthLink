document.addEventListener("DOMContentLoaded", function () {
    const loginEmailInput = document.getElementById("loginEmail");
    const loginPasswordInput = document.getElementById("loginPassword");
    const loginForm = document.getElementById("doctorLoginForm");
    const loginBtn = document.getElementById("loginBtn");
    const notificationDiv = document.getElementById("notificationDiv");
    const showPasswordIcon = document.getElementById("showPassword");

    function validateForm() {
        if (
            loginEmailInput.value.trim() !== "" &&
            loginPasswordInput.value.trim() !== ""
        ) {
            loginBtn.removeAttribute("disabled");
        } else {
            loginBtn.setAttribute("disabled", "disabled");
        }
    }

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Отменить стандартное поведение отправки формы
        validateForm(); // Проверяем заполнение формы перед отправкой запроса

        if (loginBtn.hasAttribute("disabled")) {
            // Если форма не заполнена, прерываем выполнение запроса
            return;
        }

        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;

        // Проверяем, существует ли пользователь с таким email на сервере
        fetch(`http://localhost:3000/doctors?email=${email}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                if (data.length === 0) {
                    // Если пользователь не существует, показываем сообщение об ошибке
                    notificationDiv.style.display = "block";
                } else {
                    // Если пользователь найден, проверяем пароль
                    const doctor = data[0];
                    if (password === doctor.password) {
                        document.cookie = `doctorID=${doctor.id}; expires=Thu, 18 Dec 2023 12:00:00 UTC; path=/`;
                        window.location.href = "docdashboard.html";
                    } else {
                        // Если пароль неверный, показываем сообщение об ошибке
                        notificationDiv.style.display = "block";
                    }

                    const options = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(dataForLogin),
                    };

                    fetch("http://localhost:3000/doctors", options)
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error("Network response was not ok");
                            }
                            return response.json();
                        })
                        .then((data) => {
                            document.cookie = `doctorID=${doctorId}; expires=Thu, 18 Dec 2023 12:00:00 UTC; path=/`;
                            window.location.href = "docdashboard.html";
                        })
                        .catch((error) => {
                            console.error(
                                "There was a problem with the fetch operation:",
                                error
                            );
                        });
                }
            })
            .catch((error) => {
                console.error(
                    "There was a problem with the fetch operation:",
                    error
                );
            });
    });

    // Скрываем сообщение об ошибке при клике на него
    notificationDiv.addEventListener("click", function () {
        notificationDiv.style.display = "none";
    });

    // Скрипт для работы режима "просмотра" пароля:
    showPasswordIcon.addEventListener("click", function () {
        if (loginPasswordInput.type === "password") {
            loginPasswordInput.type = "text";
        } else {
            loginPasswordInput.type = "password";
        }
    });
});
