/** 
 * 
 * Upgrader Creep Module 
 * 
 * 
* Description
*      what upgrader creep should do?
* 
* if creep's energy is empty then look for source and start working to carry energy
* if creep's energy is full then go upgrade room controller 
*         
*         
* 
*/
var roleUpgrader = {

    /** 
    * Run function will be used to tell upgrader creep what to do
    * 
    * 
    * @param {Creep} creep 
    * 
    * **/
    run: function (creep) {
        // if creep's energy is empty harvest
        if (creep.memory.upgrading && creep.carry.energy == 0) {
            // set upgrading to false
            creep.memory.upgrading = false;
            // say harvesting for better game visibility 
            creep.say('harvesting');
        }
        // if creep's energy is full  and is not upgrading go  build
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            // set upgrading to true 
            creep.memory.upgrading = true;
            // say upgrading for better game visibility 
            creep.say('upgrading');
        }
        // if creep now is full energy and ready to build
        if (creep.memory.upgrading) {
            // if Room Controller not in creep's range move closer to it 
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                // move creep one tick closer to the Room Controller
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            // if creep is not full energy go to source to carry energy

            // find all sources within room
            var sources = creep.room.find(FIND_SOURCES);
            // if source is not in creep's range 
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                // move one tick closer to the source
                creep.moveTo(sources[0]);
            }
        }
    }
};

module.exports = roleUpgrader;