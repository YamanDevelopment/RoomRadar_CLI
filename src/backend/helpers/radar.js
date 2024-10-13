
const assert = require('node:assert').strict;
function handleSearchQuery(query, config) {
    try {
        assert(config.data);
        assert(config.buildings && Array.isArray(config.buildings));
    } catch(error) {
        console.error("Error in searching:", error);
        return error;
    }
    let roomNumbers = Object.keys(config.data);
    let rooms = Object.values(config.data);
    let results = {
        rooms: [],
        buildings: [],
        roomNumbers: [],
    };
    // special case: room is searched in format of "Building_Name Room #" (valid at FAU)
    if(query.split(" ").length > 1) results.rooms = results.rooms.concat(rooms.filter(room => CheckRoom(query,room)))
    else {
        // checking room numbers
        let counter = 0;
        if(query.split(" ").length == 1) results.roomNumbers = results.roomNumbers.concat(roomNumbers.filter(num => CheckNum(query,num)))

        // checking building names
        let buildings = [...config.buildings]
        results.buildings = results.buildings.concat(buildings.filter(bldg => bldg.includes(query) || bldg.includes(query.toUpperCase()) || bldg.includes(query.toLowerCase()) || bldg.includes(getStdCase(query))))
        console.log("results: ", results.buildings)
    }
    // result handling!
    if(results.rooms.length > 0) return results.rooms
    else {
        let fResults = [];
        // logic issue, WILL include duplicate rooms for queries less than 3 characters.
        if(results.buildings > 0) for(bldg of results.buildings) fResults.concat(rooms.filter(room => room.Building == bldg))
        if(results.roomNumbers > 0) for(num of results.roomNumbers) fResults.push(data[num])
        return fResults;
    }
}

 // convert the query to standard case (capitalize each word)
const getStdCase = (query) => {
    for(word of query) {
        word[0].toUpperCase();
    }
    return query.toString();
}
const CheckNum = (query, num) => {
    for(i in query) if(query[i] != num[i]) return false
    return true
}
const CheckRoom = (query, room) => {
    // Force type compliance
    try {
        assert(query.length > 1 && query.match(/[0-9]+/));
    } catch(error) {
        return "query non compliant";
    }
    
    assert(room.Building && room.Room)
    // string manip to get building name and room # (assumes last word is room #)
    query = query.split(" ");
    let num = query[query.length-1];
    query.pop()
    query = query.toString()
   
    let std_case = getStdCase(query)
    // building/room # check
    if(room.Building.includes(query.toLowerCase()) || room.Building.includes(std_case)) {
        return room.Room.includes(num);
    }
}
module.exports = {handleSearchQuery}