angular
    .module('common')
    .factory('dateService', dateService);

dateService.$inject = ["enumService"];

function dateService(enumService) {
    
    const dateFormat = 'YYYY-MM-DD';
    const dateIntervals = enumService.taskResetIntervals;

    function formatDate(format, date) {
        if (date) {
            return moment(date).format(format);
        }

        return date;
    }

    function formatSearchDate(date) {
        return formatDate(dateFormat, date);
    }

    function formatDateTime(date) {
        return formatDate('YYYY-MM-DD HH:mm:ss', date);
    }

    function dateParser(date) {
        return new Date(moment.parseZone(date));
    }

    function isCorrectDate(value) {
        return moment(value, dateFormat, true).isValid();
    }

    function getDefaultDateTimePickerOptions() {
        return {
            enableDate: true,
            enableTime: true,
            showWeeks: false,
            buttonBar: {
                show: true,
                now: {
                    show: true,
                    text: 'Now'
                },
                today: {
                        show: true,
                        text: 'Today'
                },
                clear: {
                        show: true,
                        text: 'Clear'
                },
                date: {
                        show: false,
                        text: 'Date'
                },
                time: {
                        show: false,
                        text: 'Time'
                },
                close: {
                        show: true,
                        now: {
                        show: true,
                        text: 'Now'
                        },
                    today: {
                            show: true,
                            text: 'Today'
                    },
                    clear: {
                            show: true,
                            text: 'Clear'
                    },
                    date: {
                            show: false,
                            text: 'Date'
                    },
                    time: {
                            show: false,
                            text: 'Time'
                    },
                    close: {
                            show: true,
                            text: 'Close'
                    }
                }
            }
        };
    }

    function utcJson(date) {
        return moment.utc(date).add(-moment().utcOffset(), 'm').toJSON();
    }

    let intervals = {};
    intervals[dateIntervals.OneHour] = { Duration: 1, Type: enumService.dateTimeType.Hours };
    intervals[dateIntervals.TwoHours] = { Duration: 2, Type: enumService.dateTimeType.Hours };
    intervals[dateIntervals.OneDay] = { Duration: 1, Type: enumService.dateTimeType.Days };
    intervals[dateIntervals.OneWeek] = { Duration: 7, Type: enumService.dateTimeType.Days };
    intervals[dateIntervals.TwoWeeks] = { Duration: 14, Type: enumService.dateTimeType.Days };
    intervals[dateIntervals.OneMonth] = { Duration: 1, Type: enumService.dateTimeType.Months };

    function addDateInterval(date, isAdd, intervalType) {
        const interval = getDateInterval(intervalType);
        return addTimeToDate(date, isAdd, interval.Duration, interval.Type);
    }

    function getDateInterval(intervalType) {
        return intervals[intervalType];
    }

    function addTimeToDate(date, isAdd, duration, type) {
        var dateTimeType = enumService.dateTimeType;
        switch(type) {
            case dateTimeType.Hours:
                return addHoursToCurrent(date, isAdd, duration);
            case dateTimeType.Days:
                return addDateToCurrent(date, isAdd, duration);
            case dateTimeType.Months:
                return addMonthToCurrent(date, isAdd, duration);
        }
    }

    function addHoursToCurrent(date, isAdd, count) {
        const hours = date.getHours();
        date.setHours(isAdd ? hours + count : hours - count);
        return date;
    }

    function addDateToCurrent(date, isAdd, count) {
        const dates = date.getDate();
        date.setDate(isAdd ? dates + count : dates - count);
        return date;
    }

    function addMonthToCurrent(date, isAdd, count) {
        const month = date.getMonth()
        date.setMonth(isAdd ? month + count : month - count);
        return date;
    }

    function dateDifference(date1, date2) {
        var timeDiff = date1.getTime() - date2.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    var service = {
        formatDate: formatDate,
        formatSearchDate: formatSearchDate,
        formatDateTime: formatDateTime,
        dateParser: dateParser,
        getDefaultDateTimePickerOptions: getDefaultDateTimePickerOptions,
        isCorrectDate: isCorrectDate,
        utcJson: utcJson,
        getDateInterval: getDateInterval,
        addDateInterval: addDateInterval,
        dateDifference: dateDifference
    }

    return service;

}