/**
 * 
 *  Fleetster  Node.js Developer.
 * Test Assignment
 * 
 *  
 *      Description:
 *          Screeps game to build powerful colony.
 * 
 *      Main Purpose:
 *          -Upgrade our Room Controller.
 *          -Build structures.
 * 
 * 
 * We have 2 main roles here Harvest/Build and Upgrade creeps.
 * 
 * Upgrader creeps should work on upgrading the room Controller.
 * 
 * Harvester/Builder creep should work on building and energizing structure.
 * if harvesters doesn't found structures needs energy then convert them to builders to build structures.
 * if builder doesn't found construction sites to build then convert them to harvesters to energize structures.
 *          note about converting we don't convert all creeps at once instead we convert one by one so we can have a building and energizing case
 * Tips
 * 
 * More Extensions MORE powerful Creeps
 * we should dynamically add parts to creeps based on the energyAvailable     bodyCreator function
 * 
 * Bigger Colony Bigger Resources
 * we should every time we had full energyCapacityAvailable build an extension to push the current capacity limit for more energy reservation
 *  
 *  Dying creeps 
 * we should regenerate (powerful if we can)  creeps and maintain the 2 roles of creeps equally as many as extension we have 
 * 
 * 
 * @author     Mohamed Habashy <mohamed.habshey10@gmail.com>
 * 
 */

// requiring the harvester creep module
var roleHarvester = require('role.harvester');
// requiring the upgrader creep module
var roleUpgrader = require('role.upgrader');
// requiring the builder creep module
var roleBuilder = require('role.builder');


// Loop Module will be execute with every tick
module.exports.loop = function() {

    // current number of extensions available
    var extensions = 0;
    // current room name
    var roomName = '';
    // current spawn name
    var spwanName = '';

    // freeing memory of died creeps
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // getting current room spawn
    for (var name in Game.spawns) {
        // current spawn name as now we only use one
        spwanName = name;
    }
    // for every room we have currently only one we check if we reached full energy capacity
    // then we create upgrader creep or extension 
    for (var name in Game.rooms) {
        console.log('Room "' + name + '" has ' + Game.rooms[name].energyAvailable + ' energy');
        // current room name
        roomName = name;
        // spawn position x,y
        var spawn_pos = Game.spawns[spwanName].pos;
        // get how many extensions we have 
        extensions = Game.rooms[name].find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION);
            }
        }).length;


        /**
         * Bigger Colony Bigger Resources
         * 
         *  
         */


        // if we reached full energy capacity
        if (Game.rooms[name].energyAvailable == Game.rooms[name].energyCapacityAvailable) {
            console.log('Room "' + name + '" has FULL ' + Game.rooms[name].energyAvailable + ' energy');
            // if we reached full capacity then we must create a upgrader to help upgrading the Room Controller if we don't have any extensions 
            if (extensions == 0) {
                var newName = Game.spawns[spwanName].createCreep(bodyCreator(), undefined, {
                    role: 'upgrader'
                });
                console.log('Spawning new upgrader: ' + newName);
            }

            // when full energy create EXTENSION to store energy
            console.log('creating extension ');
            Game.rooms[name].createConstructionSite(spawn_pos.x + extensions + 1, spawn_pos.y + extensions + 1, STRUCTURE_EXTENSION);

        }
    }


    /*
     * Create creep body based on extensions available 
     * More Extensions More powerful Creeps
     *
     * 
     * @return {Array} creep body part
     * 
     */

    function bodyCreator() {
        // default creep body parts and subtract it's cost(200) from the energyAvailable
        var array = [WORK, CARRY, MOVE];

        // get floor of the quotient of the energyAvailable divided by 50 (min creep body part)
        // so we can build powerful creep based on available energy
        switch (Math.floor((Game.rooms[roomName].energyAvailable - 200) / 50)) {
            case 4:
                // we have 200 more energy than default(200) == total 400
                // create more heavy strong fast creep
                array.push(WORK);
                array.push(CARRY);
                array.push(MOVE);
                break;
            case 3:
                // we have 150 more energy than default(200) == total 350
                // create more heavy strong creep
                array.push(WORK);
                array.push(CARRY);
                break;
            case 2:
                // we have 100 more energy than default(200) == total 300
                // create more strong fast creep
                array.push(CARRY);
                array.push(MOVE);
                break;

            case 1:
                // we have 50 more energy than default(200) == total 250
                // create more fast creep
                array.push(MOVE);
                break;
            default:
                break;
        }
        // if we have 1 or extensions and our energy < 250 we should wait to harvest more energy to build big creep
        if (extensions > 1 && Game.rooms[roomName].energyAvailable < 250) {
            return 0;
        }

        // return body creep array parts
        return array;
    }


    /**
     * Keeping creeps from dying 
     * we need to maintain harvesters and upgrades as many as we have extensions
     * 
     * 
     */


    // get how many harvesters we have
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);
    // if harvesters less than extension then create new harvester
    if (harvesters.length <= extensions) {
        var newName = Game.spawns[spwanName].createCreep(bodyCreator(), undefined, {
            role: 'harvester'
        });
        console.log('Spawning new harvester: ' + newName);
    }
    // get how many upgraders we have
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    console.log('upgraders: ' + upgraders.length);
    // if upgraders less than extension then create new upgrader
    if (upgraders.length <= extensions) {
        var newName = Game.spawns[spwanName].createCreep(bodyCreator(), undefined, {
            role: 'upgrader'
        });
        console.log('Spawning new upgrader: ' + newName);
    }

    /**
     * Distribute creeps based on their roles.
     * 
     * 
     */

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}