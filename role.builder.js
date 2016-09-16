/**
 *  Builder Creep Module 
 * 
 * Description
 *      what builder creep should do?
 * 
 * if creep's energy is empty then look for source and start working to carry energy
 * if creep's energy is full then 
 *          if their is construction sites -> go build them
 *          if not then convert this creep to harvesters to help harvesters instead of stopping
 * 
 * 
 * 
 * 
 */
var roleBuilder = {

    /** 
     * Run function will be used to tell builder creep what to do
     * 
     * 
     * @param {Creep} creep 
     * 
     * **/
    run: function(creep) {
        // if creep's energy is empty harvest
        if (creep.memory.building && creep.carry.energy == 0) {
            // set building to false 
            creep.memory.building = false;
            // say harvesting for better game visibility 
            creep.say('harvesting');
        }
        // if creep's energy is full  and is not building go  build
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            // set building to true 
            creep.memory.building = true;
            // say building for better game visibility 
            creep.say('building');
        }
        // if creep now is full energy and ready to build
        if (creep.memory.building) {
            // find construction sites
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            // if we have targets then go to them and build them
            if (targets.length) {
                // if target not in creep's range move closer to it 
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    // move creep one tick closer to the target
                    creep.moveTo(targets[0]);
                }
            } else {
                // if we don't have targets to build then this creep will stop work 
                //so we convert it to harvester to harvest energy instead of waiting
                creep.memory.role = 'harvester';
                // say converting  for better game visibility 
                creep.say('converting to harvester');
            }

        } else {
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

module.exports = roleBuilder;