// Obtenir les éléments du formulaire et de la liste des invités
const form = document.getElementById("inviteForm");
const inviteList = document.getElementById("inviteList");

// Charger les invités et les tables à partir des fichiers JSON et CSV
loadInvites();
loadTables();

// Fonction pour charger les invités à partir d'un fichier JSON
function loadInvites() {
    const inviteFile = "invites.json";
    fetch(inviteFile)
        .then(response => response.json())
        .then(data => {
            invites = data.invités;
            updateInviteList();
        })
        .catch(error => console.error("Erreur de chargement des invités: " + error));
}

// Fonction pour charger les tables à partir d'un fichier CSV
function loadTables() {
    const tableFile = "tables.csv";
    fetch(tableFile)
        .then(response => response.text())
        .then(data => {
            const lines = data.split("\n");
            const headers = lines[0].split(",");
            const tables = [];
            
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(",");
                if (values.length == headers.length) {
                    const table = {};
                    for (let j = 0; j < headers.length; j++) {
                        table[headers[j]] = values[j];
                    }
                    tables.push(table);
                }
            }
            
            tableCapacities = tables;
            updateTableSelect();
        })
        .catch(error => console.error("Erreur de chargement des tables: " + error));
}

// Fonction pour mettre à jour la liste des invités à l'écran
function updateInviteList() {
    inviteList.innerHTML = "";
    
    for (let i = 0; i < invites.length; i++) {
        const invite = invites[i];
        const listItem = document.createElement("li");
        listItem.textContent = invite.nom + " - Table " + invite.table + " - " + invite.repas;
        inviteList.appendChild(listItem);
    }
}

// Fonction pour mettre à jour le sélecteur de table dans le formulaire
function updateTableSelect() {
    const tableSelect = document.getElementById("table");
    tableSelect.innerHTML = "";
    
    for (let i = 0; i < tableCapacities.length; i++) {
        const table = tableCapacities[i];
        const option = document.createElement("option");
        option.value = table.table;
        option.textContent = "Table " + table.table + " (" + table.capacité_max + ")";
        tableSelect.appendChild(option);
    }
}

// Fonction pour gérer la soumission du formulaire
function submitForm(event) {
    event.preventDefault();
    
    const invite = {
        nom: document.getElementById("name").value,
        table: document.getElementById("table").value,
        repas: document.getElementById("meal").value
    };
    
    // Vérifier si la table sélectionnée n'est pas déjà pleine
    const selectedTable = tableCapacities.find(table => table.table == invite.table);
    if (selectedTable && selectedTable.capacité_assignée == selectedTable.capacité_max) {
        alert("Cette table est déjà pleine. Veuillez choisir une autre table.");
        return;
    }
    
    // Ajouter l'invité à la liste des invités et à l'objet d'invites
    invites.push(invite);
    updateInviteList();
    
    // Mettre à jour la capacité assignée de la table sélectionnée
    selectedTable.capacité_assignée++;
    
    // Sauvegarder les invités dans un fichier JSON
    saveInvites();
}

// Fonction pour sauvegarder les invités dans un fichier JSON
function saveInvites() {
    const inviteFile = "invites.json";
    const data = { invités: invites };
    fetch(inviteFile, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => console.log("Invites sauvegardées avec succès: " + data))
        .catch(error => console.error("Erreur de sauvegarde des invités: " + error));
}

// Ajouter un écouteur d'événement pour la soumission du formulaire
form.addEventListener("submit", submitForm);
