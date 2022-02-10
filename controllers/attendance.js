const moment = require('moment');
const Attendance = require('../models/Attendance');

/**
 * GET /attendance
 * Attendance page.
 */
exports.getAttendance = (req, res, next) => {
    const currentTodayDate = moment().startOf('day').toDate();
    const userId = req.user._doc._id.toString();

    Attendance.findOne({todayDate: currentTodayDate, userId: userId}, (err, attendance) => {
        if (err) {
            return next(err);
        }
        attendance = attendance ? attendance._doc : null;

        if (attendance) {
            attendance.checkedInAtTime = moment(attendance.checkedInAt).format("hh:mm A");
            attendance.checkedOutAtTime = moment(attendance.checkedOutAt).format("hh:mm A");
        }

        res.render('attendance/home', {
            title: 'Attendance',
            attendance: attendance
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
