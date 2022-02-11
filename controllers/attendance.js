const moment = require('moment');
const Attendance = require('../models/Attendance');

/**
 * POST /attendance/filter
 * Attendance page.
 */
exports.postAttendanceSearch = (req, res, next) => {
    const fromDate = moment(req.body.dateFrom).startOf('day').toDate();
    const toDate = moment(req.body.dateTo).startOf('day').toDate();
    const userId = req.user._doc._id.toString();
    const hourlyRate = req.user._doc.hourlyRate || 0;

    Attendance.find({todayDate: {$gte: fromDate, $lte: toDate}, userId: userId}, (err, attendanceList) => {
        if (err) {
            return next(err);
        }

        let totalNetSalary = 0;
        attendanceList = attendanceList.map(value => value._doc)
        for (let attendance of attendanceList) {
            let _checkedInAt = moment(attendance.checkedInAt);
            let _checkedOutAt = moment(attendance.checkedOutAt);
            const duration = moment.duration(_checkedOutAt.diff(_checkedInAt));
            const hours = duration.asHours().toFixed(2);
            attendance.totalHours = hours;
            attendance.netSalary = hours * hourlyRate;
            totalNetSalary += attendance.netSalary;
        }

        res.status(200).send({
            attendanceList: attendanceList,
            totalNetSalary: totalNetSalary
        });
    });
};

exports.getAttendanceSearchPage = (req, res, next) => {
    const currentTodayDate = moment().startOf('day').toDate();
    const userId = req.user._doc._id.toString();
    const hourlyRate = req.user._doc.hourlyRate || 0;

    Attendance.findOne({todayDate: currentTodayDate, userId: userId}, (err, attendance) => {
        if (err) {
            return next(err);
        }
        attendance = attendance ? attendance._doc : null;

        if (attendance) {
            let _checkedInAt = moment(attendance.checkedInAt);
            let _checkedOutAt = moment(attendance.checkedOutAt);
            attendance.checkedInAtTime = _checkedInAt.format("hh:mm A");
            attendance.checkedOutAtTime = _checkedOutAt.format("hh:mm A");

            const duration = moment.duration(_checkedOutAt.diff(_checkedInAt));
            const hours = duration.asHours().toFixed(2);
            attendance.totalWorkingHours = hours;
        }

        res.render('attendance/filter', {
            title: 'Attendance Search',
            attendance: attendance,
            hourlyRate: hourlyRate
        });
    });
};

/**
 * GET /attendance
 * Attendance page.
 */
exports.getAttendance = (req, res, next) => {
    const currentTodayDate = moment().startOf('day').toDate();
    const userId = req.user._doc._id.toString();
    const hourlyRate = req.user._doc.hourlyRate || 0;

    Attendance.findOne({todayDate: currentTodayDate, userId: userId}, (err, attendance) => {
        if (err) {
            return next(err);
        }
        attendance = attendance ? attendance._doc : null;

        if (attendance) {
            let _checkedInAt = moment(attendance.checkedInAt);
            let _checkedOutAt = moment(attendance.checkedOutAt);
            attendance.checkedInAtTime = _checkedInAt.format("hh:mm A");
            attendance.checkedOutAtTime = _checkedOutAt.format("hh:mm A");

            const duration = moment.duration(_checkedOutAt.diff(_checkedInAt));
            const hours = duration.asHours().toFixed(2);
            attendance.totalWorkingHours = hours;
        }

        res.render('attendance/home', {
            title: 'Attendance Daily',
            attendance: attendance,
            hourlyRate: hourlyRate
        });
    });
};

/**
 * POST /attendance/checkin
 * Check-in attendance for employees.
 */
exports.postAttendanceCheckin = (req, res, next) => {
    const userId = req.user._doc._id.toString();
    const currentTodayDate = moment().startOf('day').toDate();

    Attendance.findOneAndUpdate({todayDate: currentTodayDate, userId: userId}, {
        $set: {
            checkedInAt: new Date()
        }
    }, {new: true, upsert: true}, (err, attendance) => {
        if (err) {
            return next(err);
        }

        attendance = attendance ? attendance._doc : null;

        res.render('attendance/home', {
            title: 'Attendance',
            attendance: attendance
        });
    });

};

/**
 * POST /attendance/checkin
 * Check-out attendance for employees.
 */
exports.postAttendanceCheckout = (req, res, next) => {
    const userId = req.user._doc._id.toString();
    const currentTodayDate = moment().startOf('day').toDate();

    Attendance.findOneAndUpdate({todayDate: currentTodayDate, userId: userId}, {
        $set: {
            checkedOutAt: new Date()
        }
    }, {new: true}, (err, attendance) => {
        if (err) {
            return next(err);
        }

        attendance = attendance._doc;

        res.render('attendance/home', {
            title: 'Attendance',
            attendance: attendance
        });
    });

};
