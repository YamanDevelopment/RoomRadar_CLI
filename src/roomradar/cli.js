#!/usr/bin/env node
import { RoomRadar } from './radar.js';
import Table from 'cli-table3';
import { readFileSync, writeFileSync } from 'fs';
import { getSemesterData } from './update_data.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const [,, ...args] = process.argv;
let day = null;

const date = new Date();
const month = date.getMonth() + 1;
const t = date.getDate();
const year = date.getFullYear();
const semester = readFileSync(path.join(__dirname,"/semester.txt"),"utf8")
// Check if the semester has changed
const current_semester = String(year) + ((month >= 1 && month < 5) ? '01' : month >= 5 && month < 8 ? '05' : '08');
if(current_semester != semester || args.includes("--update") || args.includes("-u")) {
    console.log("New semester detected (or update flag given). Updating semester file...");
    writeFileSync(path.join(__dirname,"/semester.txt"),current_semester,"utf8");
    await getSemesterData(current_semester);
}

if (args.length == 0) {
    console.log("Welcome to RoomRadar!");
    console.log("Usage:");
    console.log("  roomradar help                - Get an overview of the possible queries and how they should be formatted.");
    console.log("  roomradar \"Your Search Query\" - Pass in your search query to find a room or building.");
    process.exit(0);
} else if (args[0] === 'help') {
    console.log("RoomRadar CLI Help:");
    console.log("  Pass in your search query as an argument to find a room or building.");
    console.log("  Example:");
    console.log("    roomradar \"ED112\" # returns College of Education Rm 112");
    console.log("    roomradar \"Engineering 1 # returns all 1st floor rooms in any engineering building\"");
    console.log("    roomradar \"ED1\" # Returns all rooms in College of Edu on first floor");
    console.log("    roomradar \"Engineering East 2\" # returns all rooms in Engineering East on second floor");
    console.log("  Your search query can contain a partial room number, partial building name, or a partial building name AND room number");
    console.log("  Add the --schedule flag to view the schedules of the resulting rooms")
    console.log("  Example:");
    console.log("     roomradar \"ED112\" --schedule")
    console.log("     roomradar \"Engineering 102\" --schedule")
    console.log("  Pair the --day flag with the --schedule flag to find the schedules of the resulting rooms for days other than today.")
    console.log("     roomradar \"ED112\" --schedule --day Tuesday")
    console.log("     roomradar \"Engineering 102\" --schedule --day Tuesday")    
    process.exit(0);
} else {
    let queries = [];
    let schedule_bool = false;
    for (let i = 0; i < args.length; i++) {
        if (args[i] === "-s" || args[i] === "--schedule") {
            schedule_bool = true;
        } else if (args[i] === "-d" || args[i] === "-D" || args[i] === "--day") {
            day = args.splice(i + 1, 1)[0]; // Remove the day argument and store it
            args.splice(i, 1); // Remove the flag itself
            i--; // Adjust the index to account for the removed element
        } else if (args[i] === "codes") {
            console.log(RoomRadar(null,"codes"))
        } 
        else if (!args[i].startsWith("-")) {
            queries.push(args[i]);
        }
    }
    if(!schedule_bool) {
        for(let query of queries) {
            console.log(`Search query ${query}:`);
            displayTable(RoomRadar(query));
        }
    } else {
        for(let query of queries) {
            console.log(`Search query ${query}:`);
            displayScheduleTable(RoomRadar(query));
        }
    }
    

}
function displayTable(data) {
    const table = new Table({
        head: ['Room number', 'Type','Status', 'Rating'],
        colWidths: [15, 20, 25, 12]
    });
    for(let room of data) table.push([room.Number, room.RoomType ,room.status, generateRatingScale(room)])

    console.log(table.toString());
}

function displayScheduleTable(data) {
    const table = new Table({
        head: ['Room number', `Today's schedule`, 'Rating'],
        colWidths: [15, 40]
    });
    
    for(const room of data) {
        if(room.schedule) {
            if(Object.keys(room.schedule).includes(getDay())) {
                room.schedule_string = ""
                for(const course of room.schedule[getDay()]) {
                    room.schedule_string += course.start + " to " + course.end + "\n"
                }
                table.push([room.Number,room.schedule_string, generateRatingScale(room)]);
            }
            else table.push([room.Number,"Available all day"]); 
        } else table.push([room.Number,"Room has no schedule"])
        
    }

    console.log(table.toString());
}

// threw this in for when i compute room rating
function generateRatingScale(room) {
    let gap = 10;
    let rating;
    if(room.schedule) {
        if(Object.keys(room.schedule).includes(getDay())) {
            for(let course of room.schedule[getDay()]) {
                if(room.timing) gap -= (course.timing.end - course.timing.start);
                else break;
            }
        }
    } else return "?"
   
    if(gap < 1) rating = 1;
    if(gap > 1 && gap < 2) rating = 2;
    if(gap > 2 && gap < 3) rating = 3;
    if(gap > 4 && gap < 5) rating = 4;
    if(gap > 5) rating = 5;

    const maxRating = 5;
    const filledStars = '★ '.repeat(rating);
    const emptyStars = '☆ '.repeat(maxRating - rating);
    return filledStars + emptyStars;
}

function getDay() {
    if(day != null) return day;
    const weekdays = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date();
    return weekdays[date.getDay()];
}

