/*const User = require('../models/user');
const Exercise = require('../models/Exercise');
const mongoose = require('mongoose');

// Helper function to get date N days ago
function getDateNDaysAgo(n) {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date;
}

// Healthcare Dashboard KPIs controller
const getHealthcareDashboardKPIs = async (req, res) => {
  try {
    // Total children followed (count of children in all parents)
    const totalChildrenFollowed = await User.aggregate([
      { $match: { userType: 'parent' } },
      { $unwind: '$children' },
      { $count: 'totalChildren' }
    ]);

    // Total behavioral evaluations done (assuming evaluations stored somewhere - placeholder 0)
    const totalBehavioralEvaluations = 0;

    // Average time between two evaluations per child (placeholder 0)
    const avgTimeBetweenEvaluations = 0;

    // Exercise validation rate (accepted exercises / total exercises)
    const totalExercises = await Exercise.countDocuments();
    const acceptedExercises = await Exercise.countDocuments({ status: 'accepted' });
    const validationRate = totalExercises > 0 ? (acceptedExercises / totalExercises) * 100 : 0;

    // Number of exercises rejected or requested for revision
    const rejectedExercises = await Exercise.countDocuments({ status: 'rejected' });

    // Average behavior score evolution (placeholder 0)
    const avgBehaviorScoreEvolution = 0;

    // Number of children with behavioral regression (placeholder 0)
    const childrenWithRegression = 0;

    // Number of contacts with parents (assuming stored in contacts or messages - placeholder 0)
    const contactsWithParents = 0;

    // Average number of evaluations per child (placeholder 0)
    const avgEvaluationsPerChild = 0;

    res.json({
      success: true,
      data: {
        totalChildrenFollowed: totalChildrenFollowed.length > 0 ? totalChildrenFollowed[0].totalChildren : 0,
        totalBehavioralEvaluations,
        avgTimeBetweenEvaluations,
        validationRate,
        rejectedExercises,
        avgBehaviorScoreEvolution,
        childrenWithRegression,
        contactsWithParents,
        avgEvaluationsPerChild
      }
    });
  } catch (error) {
    console.error('Error fetching healthcare dashboard KPIs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch healthcare dashboard KPIs', error: error.message });
  }
};

module.exports = {
  getHealthcareDashboardKPIs
};
*/