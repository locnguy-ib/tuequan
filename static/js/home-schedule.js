(function () {
    "use strict";

    const recurringEvents = window.recurringEvents || [];
    const specialEvents = window.specialEvents || [];

    function getLanguage() {
        return localStorage.getItem("language") || "vi";
    }

    function parseDate(dateString) {
        if (!dateString) return null;

        const value = String(dateString).substring(0, 10);
        const parts = value.split("-");

        if (parts.length !== 3) return null;

        return new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );
    }

    function formatDate(date, language) {
        if (language === "en") {
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            });
        }

        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    }

    function render() {

        const language = getLanguage();

        const container =
            language === "en"
                ? document.getElementById("homeScheduleEn")
                : document.getElementById("homeScheduleVi");

        if (!container) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = specialEvents
            .map(event => ({
                event: event,
                date: parseDate(event.date)
            }))
            .filter(item =>
                item.date && item.date >= today
            )
            .sort((a, b) =>
                a.date - b.date
            )
            .slice(0, 3);

        let html = "";

        if (upcoming.length) {

            html += '<div class="home-schedule-list">';

            upcoming.forEach(item => {

                const event = item.event;

                const title =
                    language === "en"
                        ? event.title_en
                        : event.title;

                const location =
                    language === "en"
                        ? event.location_en
                        : event.location;

                html += `
                    <article class="home-schedule-event">

                        <h3>
                            <a href="${event.permalink}">
                                ${title || ""}
                            </a>
                        </h3>

                        <div>
                            📅 ${formatDate(item.date, language)}
                        </div>

                        <div>
                            🕐 ${event.time || ""}
                        </div>

                        <div>
                            📍 ${location || ""}
                        </div>

                    </article>
                `;
            });

            html += "</div>";

        } else {

            html = language === "en"
                ? "<p>No upcoming special events.</p>"
                : "<p>Hiện chưa có sự kiện đặc biệt sắp tới.</p>";
        }

        container.innerHTML = html;
    }

    document.addEventListener(
        "DOMContentLoaded",
        render
    );

    document.addEventListener(
        "languageChanged",
        render
    );

})();
