const apiUrl = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2407-FTB-ET-WEB-PT/events';

const getParties = async () => {
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Error fetching parties: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched parties:", data);

        const partyList = document.getElementById("party-list");
        partyList.innerHTML = '';

        data.data.forEach(renderParty);

    } catch (error) {
        console.error("Error fetching parties:", error);
    }
};

const renderParty = (party) => {
    const partyList = document.getElementById("party-list");
    const partyDiv = document.createElement("div");
    partyDiv.classList.add("party");

    partyDiv.innerHTML = `
        <h3>${party.name}</h3>
        <p><strong>Date:</strong> ${new Date(party.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${new Date(party.date).toLocaleTimeString()}</p>
        <p><strong>Location:</strong> ${party.location}</p>
        <p><strong>Description:</strong> ${party.description}</p>
        <button class="delete-btn" data-id="${party.id}">Delete</button>
    `;

    partyList.appendChild(partyDiv);

    const deleteBtn = partyDiv.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteParty(party.id));
};

const deleteParty = async (partyId) => {
    try {
        const response = await fetch(`${apiUrl}/${partyId}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(`Error deleting party: ${response.status} ${response.statusText}`);
        }

        console.log(`Party with id ${partyId} deleted`);

        getParties();
    } catch (error) {
        console.error("Error deleting party:", error);
    }
};

const addParty = async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const date = new Date(document.getElementById('date').value).toISOString();
    const location = document.getElementById('location').value;

    if (!name || !description || !date || !location) {
        alert('Please fill out all fields.');
        return;
    }

    const newParty = { name, description, date, location };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newParty)
        });

        if (!response.ok) {
            throw new Error(`Error adding party: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log("API response after adding party:", result);

        document.getElementById('party-form').reset();
        getParties();

    } catch (error) {
        console.error("Error adding party:", error);
    }
};

document.getElementById('party-form').addEventListener('submit', addParty);

getParties();
