//Setup
import cliProgress from 'cli-progress';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getData(JSESSIONID,BIGipServerboc22banxe_faup_StuRegSsb_pool,termID,max_size,pg_offset=0) {
    const url = `https://bannerxe.fau.edu/StudentRegistrationSsb/ssb/searchResults/searchResults?txt_term=${termID}
    //          &startDatepicker=&endDatepicker=&pageOffset=${pg_offset}&pageMaxSize=${max_size}&sortColumn=subject
    //          Description&sortDirection=asc`;

    const response = await fetch(url, {
        headers: {
            'Cookie': `JSESSIONID=${JSESSIONID};BIGipServerboc22banxe_faup_StuRegSsb_pool=${BIGipServerboc22banxe_faup_StuRegSsb_pool}`,
        },
    });
    if(!response.ok) throw new Error("Registrar data update failed!") 
    return response.json()
}
//Function to scrape info w/ puppeteer
export async function scrapeAll(JSESSIONID, BIGipServerboc22banxe_faup_StuRegSsb_pool,termID){
    let n_path;
    const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
   
    fs.writeFile(path.join(__dirname,`../data/${termID}.data.json`), "");
    console.log(` Scraping term ${termID}\n`);
    //get total count
    const max_size = (await getData(JSESSIONID,BIGipServerboc22banxe_faup_StuRegSsb_pool,termID,1)).totalCount
    let remaining = max_size % 500
    progress.start(max_size,0);
    let courses = [];
    for (let num=0;num<max_size;){
        let data = (await getData(JSESSIONID,BIGipServerboc22banxe_faup_StuRegSsb_pool,termID,max_size,num))
        let dataJson = data.data
        for(let i = 0; i < Object.keys(dataJson).length; i++){
            try{
                for(let j = 0; j < Object.keys(dataJson[i].faculty).length; j++){
                    delete dataJson[i].faculty[j].category;
                    delete dataJson[i].faculty[j].class;
                    delete dataJson[i].faculty[j].courseReferenceNumber;
                    delete dataJson[i].faculty[j].term;
                    // delete dataJson[i].faculty[j].primaryIndicator;
                }
                for(let j = 0; j < Object.keys(dataJson[i].meetingsFaculty).length; j++){
                    delete dataJson[i].meetingsFaculty[j].class;
                    delete dataJson[i].meetingsFaculty[j].faculty;
                    delete dataJson[i].meetingsFaculty[j].term;
                    delete dataJson[i].meetingsFaculty[j].courseReferenceNumber;
                    delete dataJson[i].meetingsFaculty[j].category;
                    delete dataJson[i].meetingsFaculty[j].meetingTime.term;
                    delete dataJson[i].meetingsFaculty[j].meetingTime.meetingType;
                    delete dataJson[i].meetingsFaculty[j].meetingTime.meetingTypeDescription;
                    delete dataJson[i].meetingsFaculty[j].meetingTime.courseReferenceNumber;
                    delete dataJson[i].meetingsFaculty[j].meetingTime.category;
                    delete dataJson[i].meetingsFaculty[j].meetingTime.meetingScheduleType;
                    delete dataJson[i].meetingsFaculty[j].meetingTime.class;
                }
                delete dataJson[i].crossList;
                delete dataJson[i].crossListCapacity;
                delete dataJson[i].crossListCount;
                delete dataJson[i].crossListAvailable;
                delete dataJson[i].reservedSeatSummary;
                delete dataJson[i].instructionalMethod;
                delete dataJson[i].specialApproval;
                delete dataJson[i].specialApprovalDescription;
                delete dataJson[i].instructionalMethodDescription;
                delete dataJson[i].sectionAttributes;
                delete dataJson[i].creditHourIndicator;
                delete dataJson[i].openSection;
                delete dataJson[i].linkIdentifier;
                delete dataJson[i].additionalFees;
                delete dataJson[i].partOfTermDescription;
            } catch(error){
                console.log("There was an error during parsing:",error)
                continue;
            }
            courses.push(dataJson[i])
        }
        if(max_size - num > remaining) num += 500;
        else num += remaining
        progress.update(num);
    }
    progress.stop()
    console.log("\nCourse data obtained!")
    return courses
    
}
