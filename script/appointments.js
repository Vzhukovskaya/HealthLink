const urlMeetings = `http://localhost:3000/meetings`;
const urlPatients = `http://localhost:3000/patients`;
const urlDoctors = `http://localhost:3000/doctors`;

async function main() {
    const tableBlock = document.getElementById("appointment-table");
    const loadingBlock = document.getElementById("loading");

    tableBlock.innerHTML = "";
    loadingBlock.innerHTML = "Loading data...";

    function buildTable(data) {
        for (let i = 0; i < data.length; i++) {
            let row = `<tr>
                <td>${data[i].id}</td>
                <td>${data[i].patient}</td>
                <td>${data[i].doctor}</td>
                <td>${data[i].date}</td>
                <td><button data-id=${data[i].id}>Cancel</button></td>
            </tr>`;
            tableBlock.innerHTML += row;
        }
    }

    const meetingsData = await fetch(urlMeetings)
        .then((response) => {
            loadingBlock.innerHTML = "";
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.status);
        })
        .then((data) => data);

    const patientsData = await fetch(urlPatients)
        .then((response) => {
            loadingBlock.innerHTML = "";
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.status);
        })
        .then((data) => data);

    const doctorsData = await fetch(urlDoctors)
        .then((response) => {
            loadingBlock.innerHTML = "";
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.status);
        })
        .then((data) => data);

    function mergeData(meetings, doctors, users) {
        const data = [];

        for (meeting of meetings) {
            let filterResult = doctors.filter(
                (item) => item.id == meeting.doctorID
            );
            const doctor =
                filterResult.length > 0 ? filterResult[0] : "неизвестно";

            filterResult = users.filter((item) => item.id == meeting.patientId);
            const user =
                filterResult.length > 0 ? filterResult[0] : "неизвестно";

            data.push({
                id: meeting.id,
                doctor: doctor.name,
                patient: user.name,
                date: meeting.date,
            });
        }
        return data;
    }

    const data = mergeData(meetingsData, doctorsData, patientsData);

    buildTable(data);

    const buttons = document.querySelectorAll("button[data-id]");
    for (button of buttons) {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            deleteAppointment(e.target.dataset.id);
        });
    }
}

main();

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

function logout() {
    localStorage.clear();
}
