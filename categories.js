const CATEGORIES = [
    { id: "food", label: "Food", isIncome: false },
    { id: "salary", label: "Salary", isIncome: true },
    { id: "clothing",label: "Clothing", isIncome: false },
    { id: "games", label: "Games", isIncome: false }
];

function renderCategorySelect(selectId, categories) {
    var select = document.getElementById(selectId);
    select.innerHTML = "";

    var option = document.createElement("option");
    option.value = "";
    option.textContent = "Select Category";
    option.disabled = true;
    option.selected = true;
    select.appendChild(option);

    for (var i = 0; i < categories.length; i++) {
        var option = document.createElement("option");
        option.value = categories[i].id;
        option.textContent = categories[i].label;
        select.appendChild(option);
    }
}

function getCategoryById(id) {
    for (var i = 0; i < CATEGORIES.length; i++) {
        if (CATEGORIES[i].id === id) return CATEGORIES[i];
    }
    return id || "";
}

renderCategorySelect("eventTitle", CATEGORIES);