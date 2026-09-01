(function () {
    "use strict";

    const container =
        document.getElementById("monthlySchedule");

    const monthTitle =
        document.getElementById("scheduleMonth");

    const previousButton =
        document.getElementById("previousMonth");

    const nextButton =
        document.getElementById("nextMonth");


    let currentDate = new Date();


    function getMonthTitle(language) {

        return new Intl.DateTimeFormat(
            language === "vi" ? "vi-VN" : "en-US",
            {
                month: "long",
                year: "numeric"
            }
        ).format(currentDate);

    }


    function parseDate(dateString) {

        const dateOnly =
            String(dateString).substring(0, 10);

        const parts =
            dateOnly.split("-");

        if (parts.length !== 3) {
            return null;
        }

        return new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );

    }


    function formatDate(dateString, language) {

        const date =
            parseDate(dateString);

        if (!date) {
            return dateString || "";
        }

        return new Intl.DateTimeFormat(
            language === "vi" ? "vi-VN" : "en-US",
            {
                day: "numeric",
                month: "numeric",
                year: "numeric"
            }
        ).format(date);

    }


    function formatDateRange(event, language) {

        const start =
            parseDate(event.date);

        if (!start) {
            return "";
        }


        if (!event.date_to) {

            return formatDate(
                event.date,
                language
            );

        }


        const end =
            parseDate(event.date_to);

        if (!end) {
            return formatDate(
                event.date,
                language
            );
        }


        const locale =
            language === "vi"
                ? "vi-VN"
                : "en-US";


        /*
         * English:
         * September 6–8, 2026
         *
         * Vietnamese:
         * 6–8/9/2026
         */
        if (language === "en") {

            if (
                start.getMonth() === end.getMonth() &&
                start.getFullYear() === end.getFullYear()
            ) {

                const month =
                    new Intl.DateTimeFormat(
                        locale,
                        { month: "long" }
                    ).format(start);

                return `${month} ${start.getDate()}–${end.getDate()}, ${start.getFullYear()}`;

            }


            return `${formatDate(event.date, language)} – ${formatDate(event.date_to, language)}`;

        }


        if (
            start.getMonth() === end.getMonth() &&
            start.getFullYear() === end.getFullYear()
        ) {

            return `${start.getDate()}–${end.getDate()}/${start.getMonth() + 1}/${start.getFullYear()}`;

        }


        return `${formatDate(event.date, language)} – ${formatDate(event.date_to, language)}`;

    }


    function getSpecialEvents() {

        const events =
            window.specialEvents || [];


        const year =
            currentDate.getFullYear();

        const month =
            currentDate.getMonth();


        /*
         * IMPORTANT:
         *
         * Only the START date is used
         * for monthly filtering.
         */
        return events.filter(event => {

            if (!event.date) {
                return false;
            }


            const dateString =
                String(event.date).substring(0, 10);

            const parts =
                dateString.split("-");


            if (parts.length !== 3) {
                return false;
            }


            const eventYear =
                Number(parts[0]);

            const eventMonth =
                Number(parts[1]) - 1;


            return (
                eventYear === year &&
                eventMonth === month
            );

        });

    }


    function renderSpecialEvents(language) {

        const events =
            getSpecialEvents();


        let html = `
            <section class="schedule-section">

                <h2>
                    ${Schedule.getLabel(
                        "special",
                        language
                    )}
                </h2>
        `;


        if (!events.length) {

            html += `
                <p class="schedule-empty">
                    ${Schedule.getLabel(
                        "noSpecial",
                        language
                    )}
                </p>
            `;

        } else {

            html += `
                <div class="schedule-table-wrapper">

                    <table class="schedule-table">

                        <thead>
                            <tr>

                                <th>
                                    ${language === "vi"
                                        ? "Sự kiện"
                                        : "Event"}
                                </th>

                                <th>
                                    ${language === "vi"
                                        ? "Ngày & Giờ"
                                        : "Date & Time"}
                                </th>

                                <th>
                                    ${language === "vi"
                                        ? "Người hướng dẫn"
                                        : "Facilitator"}
                                </th>

                                <th>
                                    ${language === "vi"
                                        ? "Địa điểm"
                                        : "Location"}
                                </th>

                            </tr>
                        </thead>

                        <tbody>
            `;


            events.forEach(event => {

                const title =
                    language === "en"
                        ? event.title_en
                        : event.title;

                const facilitator =
                    language === "en"
                        ? event.facilitator_en
                        : event.facilitator;

                const location =
                    language === "en"
                        ? event.location_en
                        : event.location;


                html += `
                    <tr>

                        <td>
                            <a href="${event.permalink}">
                                ${title}
                            </a>
                        </td>

                        <td>
                            <div>
                                ${formatDateRange(
                                    event,
                                    language
                                )}
                            </div>

                            <div class="schedule-time">
                                ${event.time || ""}
                            </div>
                        </td>

                        <td>
                            ${facilitator || "—"}
                        </td>

                        <td>
                            ${location || "—"}
                        </td>

                    </tr>
                `;

            });


            html += `
                        </tbody>

                    </table>

                </div>
            `;

        }


        html += `
            </section>
        `;


        return html;

    }


    function renderRecurringEvents(language) {

        const events =
            Schedule.getRecurringEvents();


        let html = `
            <section class="schedule-section">

                <h2>
                    ${Schedule.getLabel(
                        "recurring",
                        language
                    )}
                </h2>
        `;


        if (!events.length) {

            html += `
                <p>
                    ${Schedule.getLabel(
                        "noRecurring",
                        language
                    )}
                </p>
            `;

        } else {

            html += `
                <div class="schedule-table-wrapper">

                    <table class="schedule-table">

                        <thead>
                            <tr>

                                <th>
                                    ${language === "vi"
                                        ? "Sinh hoạt"
                                        : "Event"}
                                </th>

                                <th>
                                    ${language === "vi"
                                        ? "Ngày & Giờ"
                                        : "Date & Time"}
                                </th>

                                <th>
                                    ${language === "vi"
                                        ? "Người hướng dẫn"
                                        : "Facilitator"}
                                </th>

                                <th>
                                    ${language === "vi"
                                        ? "Địa điểm"
                                        : "Location"}
                                </th>

                            </tr>
                        </thead>

                        <tbody>
            `;


            events.forEach(event => {

                const title =
                    Schedule.getTitle(
                        event,
                        language
                    );

                const facilitator =
                    language === "en"
                        ? event.facilitator_en
                        : event.facilitator_vi;

                const location =
                    Schedule.getLocation(
                        event,
                        language
                    );

                const days =
                    Schedule.getDayNames(
                        event.days,
                        language
                    );


                html += `
                    <tr>

                        <td>
                            ${title}
                        </td>

                        <td>

                            <div>
                                ${days}
                            </div>

                            <div class="schedule-time">
                                ${event.time || ""}
                            </div>

                        </td>

                        <td>
                            ${facilitator || "—"}
                        </td>

                        <td>
                            ${location || "—"}
                        </td>

                    </tr>
                `;

            });


            html += `
                        </tbody>

                    </table>

                </div>
            `;

        }


        html += `
            </section>
        `;


        return html;

    }


    function render() {

        const language =
            Schedule.getLanguage();


        monthTitle.textContent =
            getMonthTitle(language);


        previousButton.textContent =
            `← ${Schedule.getLabel(
                "previous",
                language
            )}`;


        nextButton.textContent =
            `${Schedule.getLabel(
                "next",
                language
            )} →`;


        /*
         * Special Events FIRST
         */
        let html =
            renderSpecialEvents(language);


        /*
         * Recurring Events SECOND
         */
        html +=
            renderRecurringEvents(language);


        container.innerHTML =
            html;

    }


    previousButton.addEventListener(
        "click",
        function () {

            currentDate.setMonth(
                currentDate.getMonth() - 1
            );

            render();

        }
    );


    nextButton.addEventListener(
        "click",
        function () {

            currentDate.setMonth(
                currentDate.getMonth() + 1
            );

            render();

        }
    );


    render();

})();
