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


    function render() {

        const language =
            Schedule.getLanguage();


        /*
         * Display selected month.
         */
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
         * Recurring events
         *
         * These are displayed once because they
         * repeat every week. They are not expanded
         * into individual dates.
         */
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


            <section class="schedule-section">

                <h2>
                    ${Schedule.getLabel(
                        "special",
                        language
                    )}
                </h2>

                <p>
                    ${Schedule.getLabel(
                        "noSpecial",
                        language
                    )}
                </p>

            </section>
        `;


        container.innerHTML = html;

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
