// Присваиваем переменным ссылки
const urlMeetings = `http://localhost:3000/meetings`;
const urlPatients = `http://localhost:3000/patients`;
const urlDoctors = `http://localhost:3000/doctors`;

// Функция, которая получает ID пользователя по хранящемуся cookie
function getDoctorID() {
    const coookies = document.cookie.split("; ").reduce((acc, item) => {
        const [name, value] = item.split("=");
        acc[name] = value;
        return acc;
    }, {});

    return coookies.doctorID;
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
        </tr>`;
        tableBlock.innerHTML += row;
    }
}

// Функция собирает все полученные данные в один объект data
function mergeData(meetings, patients, doctor) {
    const data = [];

    for (let meeting of meetings) {
        if (meeting.doctorId != doctor.id) {
            continue;
        }

        let filterResult = patients.filter(
            (item) => item.id == meeting.patientId
        );
        const patient =
            filterResult.length > 0 ? filterResult[0] : "неизвестно";

        data.push({
            id: meeting.id,
            patient: patient.name,
            doctor: doctor.name,
            date: meeting.date,
        });
    }
    return data;
}
// Функция logout
function logout() {
    document.cookie = `doctorID=;expires=${new Date(0)}`;
    window.location.href = "homepage.html";
}
// Главная функция main(), которую мы и вызываем на скрипте страницы
async function main() {
    const tableBlock = document.getElementById("appointment-table");
    const loadingBlock = document.getElementById("loading");

    tableBlock.innerHTML = "";
    loadingBlock.innerHTML = "Loading data...";

    const doctorID = getDoctorID();
    const doctorData = await sendRequest(
        `${urlDoctors}/${doctorID}`,
        loadingBlock
    );

    const meetingsData = await sendRequest(urlMeetings, loadingBlock);
    const patientsData = await sendRequest(urlPatients, loadingBlock);

    const data = mergeData(meetingsData, patientsData, doctorData);

    buildTable(data, tableBlock);
}

main();
