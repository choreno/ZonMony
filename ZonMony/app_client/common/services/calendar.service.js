angular.module('zonMonyApp')
    .service('calendarData', calendarData);

function calendarData() {

    //This service need to have such capabilities, 
    // 1. provides target months and years  

    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // var years = function () {

    //     var years = [];
    //     var startYear = 2009;
    //     var currentYear = new Date().getFullYear();

    //     for (var i = startYear + 1; i <= currentYear; i++) {
    //         years.push(i);
    //     }

    //     return years;
    // }

//console.log(months);


// var start = 2009; 
// var end = 2020 ; 

//  var temp = range(2010, 2020);
//  console.log(temp); 

    return {
        months: months,
        years: range(2009, new Date().getFullYear() )
    };


}

//ES6 array of numbers:
const range = (start, end) => (
  Array.from( { length: end - start + 1 }, (value, index) => index + start)
);



