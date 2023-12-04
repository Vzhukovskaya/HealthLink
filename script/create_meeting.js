
/*function getDoctors() {
    fetch('http://localhost:3000/doctors')
        .then((result) => { return result.json() })
        .then((data) => { console.log(data) })
        .catch((error) => console.log(error))
}

getDoctors();

function addDoctor() {
    fetch('http://localhost:3000/doctors',
        {
            method: 'POST',
            body: JSON.stringify(
                {
                    id: 28,
                    name: "Dr. Anna Fedosova",
                    email: "doctor4@gmail.com",
                    password: "300687"
                }
            ),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }
    )
        .then((result) => { return result.json() })
        .then((data) => { console.log(data) })
        .catch((error) => console.log(error))
}

window.onload = getDoctors();*/

const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalCreateMeeting = document.getElementById('modalCreateMeeting');
const modalCancelBtn = document.getElementById('modalCancelBtn');
const modalAgreeBtn = document.getElementById('modalAgreeBtn');
const createMeetBtn = document.getElementById('createMeetBtn');
const docDashboardLogout = document.getElementById('docDashboardLogout');
const modalCreateMeetForm = document.getElementById('modalCreateMeetForm');
const modalFormCloseBtn = document.getElementById('modalFormCloseBtn');
const modalFormCancelBtn = document.getElementById('modalFormCancelBtn');
const modalFormAgreeBtn = document.getElementById('modalFormAgreeBtn');
const modalForm = document.getElementById('modalForm');
const modalNameInput = document.getElementById('modalNameInput');

//Закрытие модального окна по нажатию на "крестик"
modalCloseBtn.addEventListener('click', () => {
    modalCreateMeeting.style.display = 'none';
});
//Закрытие модального окна по нажатию на "Cancel"
modalCancelBtn.addEventListener('click', () => {
    modalCreateMeeting.style.display = 'none';
});
//Открытие формы для создания встречи по нажатию на "Create meeting" в модальном окне и закрытие модального окна
modalAgreeBtn.addEventListener('click', () => {
    modalCreateMeeting.style.display = 'none';
    modalCreateMeetForm.style.display = 'block';
});
//Открытие модального окна при нажатии на кнопку "Create meeting" на основной странице
createMeetBtn.addEventListener('click', () => {
    modalCreateMeeting.style.display = 'block';
});
//Закрытие и обновление формы при нажатии на "крестик"
modalFormCloseBtn.addEventListener('click', () => {
    modalCreateMeetForm.style.display = 'none';
    modalForm.reset();
});
//Закрытие и обновление формы при нажатии на "Cancel"
modalFormCancelBtn.addEventListener('click', () => {
    modalCreateMeetForm.style.display = 'none';
    modalForm.reset();
});

//Здесь будет подтягиваться айдишник пациента из хранилища
let patientId = 3;

//Функция для формирования таблицы приемов (Patient Queue)
function makeHtmlPatientQueue(object) {
    const table = document.getElementById('doctorDashbordTable');

    let newLine = document.createElement('tr');

    let newName = document.createElement('td');
    newName.textContent = object.patient.name;
    newLine.append(newName);

    let newDate = document.createElement('td');
    newDate.textContent = object.date;
    newLine.append(newDate);

    let newEmail = document.createElement('td');
    newEmail.textContent = object.patient.email;
    newLine.append(newEmail);

    let newOption = document.createElement('td');
    newOption.innerHTML = '<button class="doctor-dashbord__table_btn">Request Entry</button>';
    newLine.append(newOption);

    table.append(newLine);

}
//Функция для получения данных сервера о приемах и отображение в таблице Patient Queue
function getMeetings() {
    fetch('http://localhost:3000/meetings?_expand=patient&patientId=' + patientId)
        .then((result) => { return result.json() })
        .then((data) => data.forEach(object => makeHtmlPatientQueue(object)))
        .then((data) => { return data[0].patient.name })
        .catch((error) => console.log(error))
}
//Функция для выхода из профиля
function logout() {
    document.localStorage.clear();
    document.sessionStorage.clear();
    window.location.href = "login.html";
}
//Функция создания JSON для отправки на сервер инфо о новом приеме
function createMeeting() {
    let newMeeting = {
        id: 89995,
        date: "Apr 23, 2021 - 13.00AM",
        patientId: 2,
        doctorID: 1,
        meetLink: "https://meet.google.com/gfa-caog-gytr",
        requested: false
    };
    return newMeeting;

}
//Функция для отправки данных о новом приеме на сервер
function addMeeting() {
    fetch('http://localhost:3000/meetings',
        {
            method: 'POST',
            body: JSON.stringify(createMeeting()),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }
    )
        .then((result) => { return result.json() })
        .then((data) => { console.log(data) })
        .catch((error) => console.log(error))
}


//Слушатель события для добавления встречи на сервер
modalFormAgreeBtn.addEventListener('click', addMeeting);

let patientName = '123';
modalNameInput.value = patientName;

//Слушатель для выхода из учетки
docDashboardLogout.addEventListener('click', logout);
//Загрузка встреч пациента при загрузке страницы
window.onload = getMeetings();




