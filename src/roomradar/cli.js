#!/usr/bin/env node

const path = require('path');
const { RoomRadar } = require(path.resolve(__dirname, './radar'));
const Table = require('cli-table3');
const [,, ...args] = process.argv

if (args.length == 0) {
    console.log("Welcome to RoomRadar!");
    console.log("Usage:");
    console.log("  node cli.js help                - Get an overview of the possible queries.");
    console.log("  node cli.js \"Your Search Query\" - Pass in your search query to find a room or building.");
    process.exit(0);
} else if (args[0] === 'help') {
    console.log("RoomRadar CLI Help:");
    console.log("  Pass in your search query as an argument to find a room or building.");
    console.log("  Example:");
    console.log("    node cli.js \"ED112\"");
    console.log("    node cli.js \"Engineering 1\"");
    process.exit(0);
} else {
    const radar = RoomRadar(args[0]);
    displayTable(radar);
}
function displayTable(data) {
    const table = new Table({
        head: ['Room number', 'Type','Status'],
        colWidths: [15, 20, 35]
    });
    for(room of data) table.push([room.Number, room.RoomType ,room.status])

    console.log(table.toString());
}

// threw this in for when i compute room rating
function generateRatingScale(rating) {
    const maxRating = 5;
    const filledStars = '★'.repeat(rating);
    const emptyStars = '☆'.repeat(maxRating - rating);
    return filledStars + emptyStars;
}
