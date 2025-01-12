//Setup
import cliProgress from 'cli-progress';
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//Function to scrape info w/ puppeteer
export async function scrapeAll(JSESSIONID, BIGipServerboc22banxe_faup_StuRegSsb_pool, termIDs){
    const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    const browser = await puppeteer.launch( { headless: true });
    const page = await browser.newPage();
    const cookiesString = await fs.readFile(path.join(__dirname,'../data/cookie.json'));
    const cookies = JSON.parse(cookiesString);
    cookies[0].value = JSESSIONID;
    cookies[1].value = BIGipServerboc22banxe_faup_StuRegSsb_pool;

    let n_path;

    await page.setCookie(...cookies);
    for(let i = 0; i < termIDs.length; i++){
        fs.writeFile(path.join(__dirname,`../data/${termIDs[i]}.json`), "");
        console.log(` Scraping term ${termIDs[i]}\n`);
        
        let alldata = {
            data: []
        };
        //get total count
        await page.goto(`https://bannerxe.fau.edu/StudentRegistrationSsb/ssb/searchResults/searchResults?txt_term=${termIDs[i]}&startDatepicker=&endDatepicker=&pageOffset=0&pageMaxSize=50&sortColumn=subjectDescription&sortDirection=asc`);
        const data = await page.evaluate( () => {
            const spans = Array.from(document.querySelectorAll('pre'));
            console.log(spans)
            const urls = spans.map(span => span.innerHTML);
            console.log(typeof urls);
            return urls
        }); 
        const max_size = JSON.parse(data).totalCount;
        let remaining = max_size % 500
        let completed = max_size;
        progress.start(max_size,0);
        for (let num=0;num<max_size;){
            await page.goto(`https://bannerxe.fau.edu/StudentRegistrationSsb/ssb/searchResults/searchResults?txt_term=${termIDs[i]}&startDatepicker=&endDatepicker=&pageOffset=${num}&pageMaxSize=${max_size}&sortColumn=subjectDescription&sortDirection=asc`);
            const data = await page.evaluate( () => {
                const spans = Array.from(document.querySelectorAll('pre'));
                console.log(spans)
                const urls = spans.map(span => span.innerHTML);
                console.log(typeof urls);
                return urls
            }); 
            let dataJson = (JSON.parse(data)).data;
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
                    continue;
                }
                alldata.data.push(dataJson[i]);
            }
            if(completed - num > remaining) num += 500;
            else num += remaining
            progress.update(num);
        }
        fs.appendFile(path.join(__dirname,`../data/${termIDs[i]}.json`), JSON.stringify(alldata, null, 4));
        n_path = path.join(__dirname,`../data/${termIDs[i]}.json`)
        progress.stop();
    }
    await browser.close();

    console.log('\n\nSemester data scraped...\n');
    return n_path
}
