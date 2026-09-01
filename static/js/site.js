function setLanguage(language) {
    localStorage.setItem("language", language);
    updateLanguage();
}

function updateLanguage() {

    const language =
        localStorage.getItem("language") || "vi";

    document
        .querySelectorAll(".vietnamese")
        .forEach(function(element) {

            element.style.display =
                language === "vi" ? "block" : "none";

        });

    document
        .querySelectorAll(".english")
        .forEach(function(element) {

            element.style.display =
                language === "en" ? "block" : "none";

        });
}

document.addEventListener("DOMContentLoaded", updateLanguage);
