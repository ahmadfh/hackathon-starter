const mongoose = require('mongoose');
const moment = require('moment');
const currentTodayDate = moment().startOf('day').toDate();

const attendanceSchema = new mongoose.Schema({
  userId: String,
  todayDate: {type: Date, default: currentTodayDate},
  checkedInAt: Date,
  checkedOutAt: Date
}, { timestamps: true });

/**
 * middleware.
 */
attendanceSchema.pre('save', function save(next) {
  const attendance = this;
  next();
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
