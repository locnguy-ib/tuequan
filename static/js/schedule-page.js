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


    function render() {

        const language =
            Schedule.getLanguage();


        monthTitle.textContent =
            new Date().toLocaleDateString(
                language === "vi" ? "vi-VN" : "en-US",
                {
                    month: "long",
                    year: "numeric"
                }
            );


        previousButton.textContent =
            `← ${Schedule.getLabel("previous", language)}`;

        nextButton.textContent =
            `${Schedule.getLabel("next", language)} →`;


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


    /*
     * Month navigation will be connected when
     * special events are merged into the schedule.
     *
     * For now the recurring section is independent
     * of the selected month.
     */

    previousButton.addEventListener(
        "click",
        function () {
            render();
        }
    );


    nextButton.addEventListener(
        "click",
        function () {
            render();
        }
    );


    render();

})();
