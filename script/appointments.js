// Присваиваем переменным ссылки
const urlMeetings = `http://localhost:3000/meetings`;
const urlPatients = `http://localhost:3000/patients`;
const urlDoctors = `http://localhost:3000/doctors`;

// Функция, которая получает ID пользователя по хранящемуся cookie
function getUserID() {
    const coookies = document.cookie.split("; ").reduce((acc, item) => {
        const [name, value] = item.split("=");
        acc[name] = value;
        return acc;
    }, {});

    return coookies.userID;
}
// Функция, которая посылает запрос в целом
async function sendRequest(url, loadingBlock) {
    return await fetch(url)
        .then((response) => {
            loadingBlock.innerHTML = "";
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.status);
        })
        .then((data) => {
            console.log(data);
            return data;
        });
}
// Функция, которая рендерит таблицу после получения данных
function buildTable(data, tableBlock) {
    for (let i = 0; i < data.length; i++) {
        let row = `<tr>
            <td>${data[i].id}</td>
            <td>${data[i].patient}</td>
            <td>${data[i].doctor}</td>
            <td>${data[i].date}</td>
            <td><button data-id=${data[i].id} class="cancel_button">Cancel</button></td>
        </tr>`;
        tableBlock.innerHTML += row;
    }
}
// Фукнция удаления записи
async function deleteAppointment(id) {
    return await fetch(`${urlMeetings}/${id}`, {
        method: "DELETE",
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((data) => {
            console.log("+", data);
            return data;
        })
        .catch((err) => console.log(`cannot delete element: ${err}`));
}
// Функция собирает все полученные данные в один объект data
function mergeData(meetings, doctors, user) {
    const data = [];

    for (let meeting of meetings) {
        if (meeting.patientId != user.id) {
            continue;
        }

        let filterResult = doctors.filter(
            (item) => item.id == meeting.doctorID
        );
        const doctor = filterResult.length > 0 ? filterResult[0] : "неизвестно";

        data.push({
            id: meeting.id,
            doctor: doctor.name,
            patient: user.name || "неизвестно",
            date: meeting.date,
        });
    }
    return data;
}
// Функция logout
function logout() {
    document.localStorage.clear();
    document.sessionStorage.clear();
    window.location.href = "login.html";
}
// Главная функция main(), которую мы и вызываем на скрипте страницы
async function main() {
    const tableBlock = document.getElementById("appointment-table");
    const loadingBlock = document.getElementById("loading");

    tableBlock.innerHTML = "";
    loadingBlock.innerHTML = "Loading data...";

    const patientID = getUserID();
    const patientData = await sendRequest(
        `${urlPatients}/${patientID}`,
        loadingBlock
    );

    const meetingsData = await sendRequest(urlMeetings, loadingBlock);
    const doctorsData = await sendRequest(urlDoctors, loadingBlock);

    const data = mergeData(meetingsData, doctorsData, patientData);

    buildTable(data, tableBlock);

    const buttons = document.querySelectorAll("button[data-id]");
    for (let button of buttons) {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            deleteAppointment(e.target.dataset.id);
        });
    }
}

main();
