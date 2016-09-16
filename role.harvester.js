/**
 *  Harvester Creep Module 
 * 
 * Description
 *      what harvester creep should do?
 * 
 * if creep's energy is empty then look for source and start working to carry energy
 * if creep's energy is full then 
 *          if their is structures needs energy -> go give them
 *          if not then convert this creep to builder to help builders instead of stopping
 * 
 * 
 * 
 * 
 */
var roleHarvester = {

   /** 
     * Run function will be used to tell harvester creep what to do
     * 
     * 
     * @param {Creep} creep 
     * 
     * **/
    run: function (creep) {
             // if creep is not full energy go to source to carry energy

        if (creep.carry.energy < creep.carryCapacity) {
              // find all sources within room
            var sources = creep.room.find(FIND_SOURCES);
             // if source is not in creep's range 
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                // move one tick closer to the source
                creep.moveTo(sources[0]);
                 // say harvesting for better game visibility 
                creep.say('harvesting');
            }
        }
        else {
            // if creep now is full energy and ready to energize structure

            // find structures
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    // for now filter only on extension and spawn structure  which energy is not full capacity
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                }
            });
            // if their is structures needs energy
            if (targets.length > 0) {
                // if target is not in creep's range 
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                     // move creep one tick closer to the target
                    creep.moveTo(targets[0]);
                }
            } else {
                  // if we don't have targets to energize then this creep will stop work 
                //so we convert it to builder to build structure instead of waiting
                creep.memory.role = 'builder';
                  // say converting  for better game visibility 
                creep.say('converting to builder');
            }
        }
    }
};

module.exports = roleHarvester;