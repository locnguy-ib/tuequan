(function () {
    "use strict";

    const recurringEvents = window.recurringEvents || [];

    const dayNames = {
        en: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ],
        vi: [
            "Chủ Nhật",
            "Thứ Hai",
            "Thứ Ba",
            "Thứ Tư",
            "Thứ Năm",
            "Thứ Sáu",
            "Thứ Bảy"
        ]
    };

    const monthNames = {
        en: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ],
        vi: [
            "Tháng 1",
            "Tháng 2",
            "Tháng 3",
            "Tháng 4",
            "Tháng 5",
            "Tháng 6",
            "Tháng 7",
            "Tháng 8",
            "Tháng 9",
            "Tháng 10",
            "Tháng 11",
            "Tháng 12"
        ]
    };

    const labels = {
        en: {
            previous: "Previous",
            next: "Next",
            zoom: "Zoom",
            noEvents: "No scheduled activities this month."
        },
        vi: {
            previous: "Tháng trước",
            next: "Tháng sau",
            zoom: "Zoom",
            noEvents: "Không có sinh hoạt định kỳ trong tháng này."
        }
    };


    /*
     * Get the current site language.
     *
     * This assumes the existing site language selector
     * stores "vi" or "en" on the document.
     *
     * We will connect this to the existing language
     * selector when we build the UI.
     */
    function getLanguage() {

        if (
            document.documentElement.lang === "en" ||
            document.body.classList.contains("language-en")
        ) {
            return "en";
        }

        return "vi";
    }


    function getDaysInMonth(year, month) {

        return new Date(year, month + 1, 0).getDate();

    }


    function getEventsForDate(date) {

        const dayName =
            [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ][date.getDay()];


        return recurringEvents.filter(event => {

            return Array.isArray(event.days) &&
                   event.days.includes(dayName);

        });

    }


    function getEventTitle(event, language) {

        return language === "en"
            ? event.title_en
            : event.title_vi;

    }


    function getEventLocation(event, language) {

        return language === "en"
            ? event.location_en
            : event.location_vi;

    }


    function getZoomInfo(event, language) {

        return language === "en"
            ? event.zoom_info_en
            : event.zoom_info_vi;

    }


    /*
     * Build one month's recurring events.
     *
     * This function does NOT render anything.
     * It only returns structured data.
     *
     * The homepage and full schedule page
     * will both use this same function.
     */
    function buildMonth(year, month) {

        const daysInMonth =
            getDaysInMonth(year, month);

        const days = [];


        for (let day = 1; day <= daysInMonth; day++) {

            const date =
                new Date(year, month, day);

            const events =
                getEventsForDate(date);


            if (!events.length) {
                continue;
            }


            days.push({
                date,
                day: day,
                weekday: date.getDay(),
                events
            });

        }


        return {
            year,
            month,
            days
        };

    }


    /*
     * Public API
     *
     * The UI files will use:
     *
     * Schedule.getMonth(...)
     * Schedule.getLanguage(...)
     * Schedule.getDayName(...)
     */
    window.Schedule = {

        getMonth: buildMonth,

        getLanguage: getLanguage,

        getDayName: function (weekday, language) {

            return dayNames[language || getLanguage()][weekday];

        },

        getMonthName: function (month, language) {

            return monthNames[language || getLanguage()][month];

        },

        getLabel: function (name, language) {

            return labels[language || getLanguage()][name];

        },

        getTitle: getEventTitle,

        getLocation: getEventLocation,

        getZoomInfo: getZoomInfo

    };

})();
