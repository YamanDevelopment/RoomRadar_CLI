// this file handles building abbreviations, sorting, ratings, etc, and formats the object
import {handleSearchQuery} from "./handlesearchquery.js";
import { readFileSync, stat } from "node:fs";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildings = {
	'IN-1': 'Innovation Centre Bldg. 1',
	'IN-2': 'Innovation Centre Bldg. 2',
	'EE': 'Engineering East',
	'EG': 'Engineering West',
	'BS': 'Behavioral Sciences Building',
	'AH': 'Dorothy F. Schmidt Arts & Humanities',
	'PA': 'Dorothy F. Schmidt Performing Arts Center',
	'VA': 'Dorothy F. Schmidt Visual Arts Center',
	'GN': 'General Classroom - North',
	'GS': 'General Classroom - South',
	'AL': 'College Of Arts & Letters',
	'BU': 'Phil Smith Hall',
	'ED': 'College Of Education',
	'BC': 'College Of Medicine',
	'NU': 'College Of Nursing',
	'SE': 'Science Building',
	'LL': 'Friedberg Lifelong Learning Center',
	'IS': 'Instructional Services',
	'PS': 'Physical Science Building',
	'SC': 'Sanford Life Sciences Building',
	'SF': 'Schmidt Family Complex For Academic And Athletic Excellence',
	'SP': 'Sean Stein Pavilion',
	'SO': 'Social Science Building',
	'OC': 'Wally Sanger Owl Club Center',
	'KH': 'Barry Kaye Hall',
	'FL': 'Fleming Hall',
	'FW': 'Fleming West',
	'AC': 'Tom Oxley Athletic Center',
	'CE': 'Continuing Education Hall',
	'CM': 'Computer Center',
	'CR': 'Student Activities Center',
	'CU': 'Culture and Society Building',
	'FA': 'MARLEEN & HAROLD FORKAS ALUMNI CENTER',
	'GP': 'Glades Park Towers',
	'HP': 'Heritage Park Towers',
	'IR': 'Indian River Towers',
	'LY': 'S.E. Wimberly Library',
	'OD': 'OFFICE DEPOT CENTER FOR EXECUTIVE EDUCATION',
	'PH': 'Parliament Hall',
	'UN': 'Student Union',
};
export const RoomRadar = (query,...args) => {
	if(args[0] == "codes") return buildings
	const t = handleSearchQuery(query, {
		data: JSON.parse(readFileSync(__dirname + "/../data/room_data.json")),
		buildings: Object.values(buildings)
	});

	const date = new Date();
	const time = date.getHours() + (date.getMinutes() / 60)
	
	t.forEach(r => {
		const weekdays = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		if(!r.schedule) {
			r.status = "Available all day"
			return
		}
		if(!r.schedule[weekdays[date.getDay()]]) {
			r.status = "Available all day"
			return
		}
		r.schedule[weekdays[date.getDay()]].forEach(e => {
			e.timing = {
				start: Number(e.start.substring(0,2)) + Number(e.start.substring(3,5)) / 60,
				end: Number(e.end.substring(0,2)) + Number(e.end.substring(3,5)) / 60
			}
		})
		r.schedule[weekdays[date.getDay()]].sort((e_1, e_2) => {
			if (e_1.timing.start < e_2.timing.start) {
				return -1;
			} else if (e_1.timing.start > e_2.timing.start) {
				return 1;
			} else {
				return 0;
			}
		});
		// get room schedule for the day
		let arr = r.schedule[weekdays[date.getDay()]]
		for(let i = 0; i < arr.length; i++) {
			let e = arr[i] // e -> the ith class of the day in that room
			if(time > e.timing.start && e.timing.end > time) { // Class in progress condition
				let e_1 = arr[i+1];
				if(e_1 == null) { // if the room doesn't have a class afterward
					let timeString = getTimeString(e.timing.end)
					r.status = "Unavailable until " + timeString
					break
				} else if(Math.abs(e.timing.end - e_1.timing.start) <= 15/60) {
					let timeString = getTimeString(e_1.timing.end)
					r.status = "Unavailable until " + timeString
					break
				} else {
					let timeString = getTimeString(e_1.timing.end)
					r.status = "Unavailable until " + timeString
					break
				}
			} else if (time < e.timing.start) {
				let timeString = getTimeString(e.timing.start)
				r.status = "Available until " + timeString
				break
			} else {
				r.status = "Available for rest of day"
			}
		}
	})
	t.sort((a,b) => {
		return a.rating > b.rating ? -1 : a.rating == b.rating ? 0 : 1
	})
	return t
}
// converts a given time that follows the format above to a 12 hour string format
const getTimeString = (e) => {
	let t = Math.floor(e)
	let hours = t > 12 ? t - 12 : t;
	return hours + ":" + (Math.ceil((e - t)*60) > 9 ? Math.ceil((e - t)*60) : "0" + Math.ceil((e - t)*60)) + (t < 12 ? "AM" : "PM");
}


