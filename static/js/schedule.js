(function () {
    "use strict";

    const recurringEvents = window.recurringEvents || [];

    const dayNames = {
        en: {
            Sunday: "Sunday",
            Monday: "Monday",
            Tuesday: "Tuesday",
            Wednesday: "Wednesday",
            Thursday: "Thursday",
            Friday: "Friday",
            Saturday: "Saturday"
        },

        vi: {
            Sunday: "Chủ Nhật",
            Monday: "Thứ Hai",
            Tuesday: "Thứ Ba",
            Wednesday: "Thứ Tư",
            Thursday: "Thứ Năm",
            Friday: "Thứ Sáu",
            Saturday: "Thứ Bảy"
        }
    };

    const labels = {
        en: {
            recurring: "Recurring Events",
            special: "Special Events",
            previous: "Previous",
            next: "Next",
            zoom: "Zoom",
            noRecurring: "No recurring events.",
            noSpecial: "No special events."
        },

        vi: {
            recurring: "Sinh hoạt định kỳ",
            special: "Sự kiện đặc biệt",
            previous: "Tháng trước",
            next: "Tháng sau",
            zoom: "Zoom",
            noRecurring: "Không có sinh hoạt định kỳ.",
            noSpecial: "Không có sự kiện đặc biệt."
        }
    };
    

    function getLanguage() {
        return localStorage.getItem("language") || "vi";
    }


    function getDayNames(days, language) {

        return days
            .map(day => dayNames[language][day] || day)
            .join(", ");

    }


    function getTitle(event, language) {

        return language === "en"
            ? event.title_en
            : event.title_vi;

    }


    function getLocation(event, language) {

        return language === "en"
            ? event.location_en
            : event.location_vi;

    }


    function getZoomInfo(event, language) {

        return language === "en"
            ? event.zoom_info_en
            : event.zoom_info_vi;

    }


    window.Schedule = {

        getLanguage,

        getDayNames,

        getTitle,

        getLocation,

        getZoomInfo,

        getLabel: function (name, language) {

            language = language || getLanguage();

            return labels[language][name];

        },

        getRecurringEvents: function () {

            return recurringEvents;

        }

    };

})();
