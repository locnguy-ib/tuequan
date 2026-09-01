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

    function formatEventDate(dateString, language) {

        const dateOnly =
            String(dateString).substring(0, 10);
    
        const parts =
            dateOnly.split("-");
    
    
        if (parts.length !== 3) {
            return dateOnly;
        }
    
    
        const year =
            Number(parts[0]);
    
        const month =
            Number(parts[1]) - 1;
    
        const day =
            Number(parts[2]);
    
    
        const date =
            new Date(year, month, day);
    
    
        return new Intl.DateTimeFormat(
            language === "vi" ? "vi-VN" : "en-US",
            {
                weekday: "long",
                day: "numeric",
                month: "numeric"
            }
        ).format(date);
    
    }


    function getSpecialEvents() {

        const events =
            window.specialEvents || [];
    
        const year =
            currentDate.getFullYear();
    
        const month =
            currentDate.getMonth();
    
    
        return events.filter(event => {
    
            if (!event.date) {
                return false;
            }
    
    
            /*
             * Treat the event date as a calendar date.
             * Do not let the browser timezone change it.
             *
             * Hugo may output the date as:
             *
             * 2026-09-06
             *
             * or:
             *
             * 2026-09-06T00:00:00Z
             */
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
                <div class="special-events">
            `;


            events.forEach(event => {

                const title =
                    language === "en"
                        ? event.title_en
                        : event.title;

                const location =
                    language === "en"
                        ? event.location_en
                        : event.location;

                const description =
                    language === "en"
                        ? event.description_en
                        : event.description;


                html += `
                    <article class="special-event">

                        <div class="special-event-date">
                            ${formatEventDate(
                                event.date,
                                language
                            )}
                        </div>

                        <h3>
                            ${title}
                        </h3>

                        <div class="schedule-time">
                            🕐 ${event.time || ""}
                        </div>

                        <div class="schedule-location">
                            📍 ${location || ""}
                        </div>
                `;


                if (description) {

                    html += `
                        <p class="special-event-description">
                            ${description}
                        </p>
                    `;

                }


                if (event.zoom) {

                    html += `
                        <div class="schedule-zoom">

                            <a
                                href="${event.zoom}"
                                target="_blank"
                                rel="noopener"
                            >
                                ${Schedule.getLabel(
                                    "zoom",
                                    language
                                )}
                            </a>

                            ${
                                event.zoom_info
                                    ? `<span>${event.zoom_info}</span>`
                                    : ""
                            }

                        </div>
                    `;

                }


                html += `
                        <a
                            class="special-event-link"
                            href="${event.permalink}"
                        >
                            ${language === "en"
                                ? "View event →"
                                : "Xem sự kiện →"}
                        </a>

                    </article>
                `;

            });


            html += `
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

                <div class="recurring-events">
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

            events.forEach(event => {

                const title =
                    Schedule.getTitle(
                        event,
                        language
                    );

                const location =
                    Schedule.getLocation(
                        event,
                        language
                    );

                const zoomInfo =
                    Schedule.getZoomInfo(
                        event,
                        language
                    );

                const days =
                    Schedule.getDayNames(
                        event.days,
                        language
                    );


                html += `
                    <article class="recurring-event">

                        <h3>${title}</h3>

                        <div class="recurring-days">
                            ${days}
                        </div>

                        <div class="schedule-time">
                            🕐 ${event.time}
                        </div>

                        <div class="schedule-location">
                            📍 ${location}
                        </div>
                `;


                if (event.zoom) {

                    html += `
                        <div class="schedule-zoom">

                            <a
                                href="${event.zoom}"
                                target="_blank"
                                rel="noopener"
                            >
                                ${Schedule.getLabel(
                                    "zoom",
                                    language
                                )}
                            </a>

                            ${
                                zoomInfo
                                    ? `<span>${zoomInfo}</span>`
                                    : ""
                            }

                        </div>
                    `;

                }


                html += `
                    </article>
                `;

            });

        }


        html += `
                </div>

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
         * Special events FIRST.
         */
        let html =
            renderSpecialEvents(language);


        /*
         * Recurring events SECOND.
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
