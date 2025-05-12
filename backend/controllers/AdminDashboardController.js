/*const User = require('../models/user');
const Feedback = require('../models/Feedback');
const Exercise = require('../models/Exercise');

const mongoose = require('mongoose');

// Helper function to get date N days ago
function getDateNDaysAgo(n) {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date;
}

// Admin Dashboard KPIs controller
const getAdminDashboardKPIs = async (req, res) => {
  try {
    let totalActiveUsersByRole;
    let newUsersPerWeek;
    let newUsersPerMonth;
    let deactivatedUsersCount;
    let totalFeedbacks;
    let avgResponseTime = 0;
    let totalConnectionsDaily = 0;
    let totalConnectionsWeekly = 0;
    let userDistributionByRole;
    let totalUsers;
    let activeUsers;
    let activityRate = 0;
    let activeLast7DaysPercent = 0;
    let exercisesValidatedCount;
    let exercisesNonValidatedCount;
    let validationLoad;
    let usersWithFeedback;
    let usersWithFeedbackCount;

    try {
      totalActiveUsersByRole = await User.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$userType', count: { $sum: 1 } } }
      ]);
    } catch (error) {
      console.error('Error in totalActiveUsersByRole aggregation:', error);
      throw error;
    }

    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);

    try {
      newUsersPerWeek = await User.countDocuments({ createdAt: { $gte: oneWeekAgo } });
      newUsersPerMonth = await User.countDocuments({ createdAt: { $gte: oneMonthAgo } });
    } catch (error) {
      console.error('Error in newUsersPerWeek or newUsersPerMonth count:', error);
      throw error;
    }

    try {
      deactivatedUsersCount = await User.countDocuments({ isActive: false });
    } catch (error) {
      console.error('Error in deactivatedUsersCount count:', error);
      throw error;
    }

    try {
      totalFeedbacks = await Feedback.countDocuments();
    } catch (error) {
      console.error('Error in totalFeedbacks count:', error);
      throw error;
    }

    try {
      userDistributionByRole = await User.aggregate([
        { $group: { _id: '$userType', count: { $sum: 1 } } }
      ]);
    } catch (error) {
      console.error('Error in userDistributionByRole aggregation:', error);
      throw error;
    }

    try {
      totalUsers = await User.countDocuments();
      activeUsers = await User.countDocuments({ isActive: true });
      activityRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
    } catch (error) {
      console.error('Error in activity rate calculation:', error);
      throw error;
    }

    try {
      exercisesValidatedCount = await Exercise.countDocuments({ status: 'accepted' });
      exercisesNonValidatedCount = await Exercise.countDocuments({ status: { $ne: 'accepted' } });
    } catch (error) {
      console.error('Error in exercises count:', error);
      throw error;
    }

    try {
      validationLoad = await Exercise.aggregate([
        { $match: { status: 'accepted', approvedBy: { $ne: null } } },
        { $group: { _id: '$approvedBy', count: { $sum: 1 } } }
      ]);
    } catch (error) {
      console.error('Error in validationLoad aggregation:', error);
      throw error;
    }

    try {
      usersWithFeedback = await Feedback.distinct('userEmail');
      usersWithFeedbackCount = usersWithFeedback.length;
    } catch (error) {
      console.error('Error in usersWithFeedback count:', error);
      throw error;
    }

    res.json({
      success: true,
      data: {
        totalActiveUsersByRole,
        newUsersPerWeek,
        newUsersPerMonth,
        deactivatedUsersCount,
        totalFeedbacks,
        avgResponseTime,
        totalConnectionsDaily,
        totalConnectionsWeekly,
        userDistributionByRole,
        activityRate,
        activeLast7DaysPercent,
        exercisesValidatedCount,
        exercisesNonValidatedCount,
        validationLoad,
        usersWithFeedbackCount
      }
    });
  } catch (error) {
    console.error('Error fetching admin dashboard KPIs:', error.stack);
    res.status(500).json({ success: false, message: 'Failed to fetch admin dashboard KPIs', error: error.message });
  }
};

module.exports = {
  getAdminDashboardKPIs
};
*/