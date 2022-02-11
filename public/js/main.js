/* eslint-env jquery, browser */
$(document).ready(() => {

    $(".keypad .item").click(function () {
        let keypadNumber = $(this).attr('data-number');
        if (keypadNumber === 'delete') {
            let password = $("#password").val().split('');
            password.pop();
            password = password.join('');
            $("#password").val(password);
        } else {
            let password = $("#password").val() + keypadNumber;
            $("#password").val(password);
        }
    })

    // Place JavaScript code here...
    $("#btn-checkin").click(() => {
        fetch('/attendance/checkin', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({a: 1, b: 'Textual content'})
        }).then(response => {
            window.location.reload();
        }).catch(error => {
            // handle the error
            console.log(content);
        });
    });

    $("#btn-checkout").click(() => {
        fetch('/attendance/checkout', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        }).then(response => {
            window.location.reload();
        }).catch(error => {
            // handle the error
            console.log(error);
        });
    });

    if (document.getElementById("fromDate"))
        document.getElementById("fromDate").valueAsDate = new Date();

    if (document.getElementById("toDate"))
        document.getElementById("toDate").valueAsDate = moment().add(1, 'weeks').toDate();
    ;

    $("#btn-search").click(() => {
        let _dateFrom = $("#fromDate").val();
        let _dateTo = $("#toDate").val();
        fetch('/attendance/search', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({dateFrom: _dateFrom, dateTo: _dateTo})
        }).then(response => response.json()).then(response => {
            $("#searchResult tbody").empty();
            const attendanceList = response.attendanceList;
            const totalNetSalary = response.totalNetSalary;
            let counter = 1;
            for (let attendance of attendanceList) {
                let todayDate = moment(attendance.todayDate);
                $("#searchResult tbody").append(`<tr><th>${counter}</th><td>${todayDate.format("MMMM do YYYY")}</td><td>${attendance.totalHours}</td><td><strong>${attendance.netSalary}₪</strong></td></tr>`);
                counter++;
            }

            $("#searchResult tbody").append(`<tr class=""><th><h4>TOTAL</h4></th><td></td><td></td><td></td><td><h4>${totalNetSalary}₪</h4></td></tr>`);

            console.log(response);
        }).catch(error => {
            // handle the error
            console.log(error);
        });
    });
});
