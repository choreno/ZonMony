angular.module('zonMonyApp')
    .service('calendarData', calendarData);

function calendarData() {

    //This service need to have such capabilities, 
    //- provides target months and years  

    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var currentYear = new Date().getFullYear();

    return {
        months: months,
        currentYear: currentYear,
        years: range(2009, currentYear)
    };


}

//ES6 array of numbers:
const range = (start, end) => (
    Array.from({ length: end - start + 1 }, (value, index) => index + start)
);



