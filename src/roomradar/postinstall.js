import { getSemesterData } from "./update_data"

console.log("Conducting initial setup..")

const current_semester = String(year) + ((month >= 1 && month < 5) ? '01' : month >= 5 && month < 8 ? '05' : '08');
console.log(`Current semester is ${current_semester}`)
writeFileSync(path.join(__dirname,"/semester.txt"),current_semester,"utf8");

getSemesterData(current_semester)
console.log("Initial setup complete!")
console.log("Welcome to RoomRadar!")