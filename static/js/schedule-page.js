(function () {
    "use strict";

    let currentDate = new Date();

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

        const year =
            currentDate.getFullYear();

        const month =
            currentDate.getMonth();


        monthTitle.textContent =
            `${Schedule.getMonthName(month, language)} ${year}`;


        previousButton.textContent =
            `← ${Schedule.getLabel("previous", language)}`;

        nextButton.textContent =
            `${Schedule.getLabel("next", language)} →`;


        const monthData =
            Schedule.getMonth(year, month);


        let html = "";


        monthData.days.forEach(day => {

            const weekday =
                Schedule.getDayName(
                    day.weekday,
                    language
                );


            html += `
                <section class="schedule-day">

                    <div class="schedule-date">

                        <strong>
                            ${weekday}
                        </strong>

                        <span>
                            ${day.day}/${month + 1}
                        </span>

                    </div>

                    <div class="schedule-events">
            `;


            day.events.forEach(event => {

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


                html += `
                    <article class="schedule-event">

                        <h3>
                            ${title}
                        </h3>

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


            html += `
                    </div>

                </section>
            `;

        });


        if (!html) {

            html = `
                <p class="schedule-empty">
                    ${Schedule.getLabel(
                        "noEvents",
                        language
                    )}
                </p>
            `;

        }


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
