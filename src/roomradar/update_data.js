const {formatClassrooms} = require('./parse.js');
const {scrapeAll} = require("./scrape.js")
async function getSemesterData(semester) {
    const prompt = require("prompt-sync")({ sigint: true });
    let JSESSIONID = prompt("JSESSIONID: ");
    let SSBPool = prompt("BIGipServerboc22banxe_faup_StuRegSsb_pool (Default - 540087050.10275.0000): ");
    if (SSBPool == ""){ SSBPool = "540087050.10275.0000" }
    let path = await scrapeAll(JSESSIONID,SSBPool,[semester])
    formatClassrooms(path)
    console.log("RoomRadar succesfully updated!")
}


module.exports = { getSemesterData }