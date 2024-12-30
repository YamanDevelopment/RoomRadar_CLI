import { start } from "repl";
import path from 'path';
import { fileURLToPath } from 'url';
import {default as fsWithCallbacks} from 'fs'
const fsp = fsWithCallbacks.promises
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


function formatTime12Hour(timeStr) {
  if(timeStr == null){
    return "EMPTY";
  }
  const hour = parseInt(timeStr.slice(0, 2), 10);
  const minutes = timeStr.slice(2, 4);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes}${ampm}`;
}


export async function formatClassrooms(fname) {
  try {
    console.log("Parsing semester data...")
    const rawjson = await fsp.readFile(fname, 'utf-8');
    const json = JSON.parse(rawjson);
    const classroomSchedule = {}; 

    for (let i = 0; i < json.data.length; i++) {
      const classData = json.data[i];
      const campus = classData.campusDescription;
      const meeting = classData.meetingsFaculty[0].meetingTime;
      const building = meeting.building;
      const room = meeting.room;
      let startTime = meeting.beginTime;
      let endTime = meeting.endTime;

      // console.log(room);
      // console.log(startTime);
      // console.log(endTime);

      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      if (campus !== 'Distance Learning' && building && room) {
        const location = `${building}${room}`;

        if (!classroomSchedule[location]) {
          classroomSchedule[location] = {
            Sunday: [],
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
          };
        }

        const times = `${formatTime12Hour(startTime)} - ${formatTime12Hour(endTime)}`;
        days.forEach((day) => {
          if (meeting[day.toLowerCase()] && !classroomSchedule[location][day].includes(times)) {
            if(startTime && endTime) {
              if(!startTime.match(":")) startTime = startTime.slice(0,2) + ":" + startTime.slice(2,startTime.length);
              if(!endTime.match(":"))endTime = endTime.slice(0,2) + ":" + endTime.slice(2,endTime.length);
              classroomSchedule[location][day].push({start:startTime,end:endTime});
            }
            
          }
          
        });
      }
    }
    const rd_rawjson = await JSON.parse(await fsp.readFile(path.join(__dirname,"../data/room_data.json"),'utf-8'));
    let keys = Object.keys(rd_rawjson);
    keys.forEach(key => rd_rawjson[key].schedule = {})
    keys = Object.keys(classroomSchedule);
    keys.forEach(key => {
      if(rd_rawjson[key]) {
        if(rd_rawjson[key].schedule) rd_rawjson[key].schedule = classroomSchedule[key];
      } 
    })
    fsp.writeFile(path.join(__dirname,"../data/room_data.json"),JSON.stringify(rd_rawjson));
    }catch(error) {
        console.error(error)
    }

    console.log("Semester data parsed!")
}
