import activityScheduler from './activities/ActivityScheduler';

module.exports.loop = function ()
{
    activityScheduler.init();
    // for as long as we have cpu to spend
    activityScheduler.run();
};