import { formatClassrooms } from './parse.js';
import { scrapeAll } from './scrape.js';
import promptSync from 'prompt-sync';
const prompt = promptSync({ sigint: true });
export async function getSemesterData(semester) {
    let JSESSIONID = prompt("JSESSIONID: ");
    let SSBPool = prompt("BIGipServerboc22banxe_faup_StuRegSsb_pool (Default - 540087050.10275.0000): ");
    if (SSBPool == ""){ SSBPool = "540087050.10275.0000" }
    let path = await scrapeAll(JSESSIONID,SSBPool,[semester])
    formatClassrooms(path)
    console.log("RoomRadar succesfully updated!")
}
