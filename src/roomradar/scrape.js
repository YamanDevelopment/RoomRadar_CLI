//Setup
const cliProgress = require('cli-progress');
const puppeteer = require('puppeteer');
const fs = require('fs').promises;

//Function to scrape info w/ puppeteer
async function scrapeAll(JSESSIONID, BIGipServerboc22banxe_faup_StuRegSsb_pool, termIDs){
    const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    const browser = await puppeteer.launch( { headless: true });
    const page = await browser.newPage();
    const cookiesString = await fs.readFile('./assets/cookie.json');
    const cookies = JSON.parse(cookiesString);
    cookies[0].value = JSESSIONID;
    cookies[1].value = BIGipServerboc22banxe_faup_StuRegSsb_pool;

    let path;

    await page.setCookie(...cookies);
    for(let i = 0; i < termIDs.length; i++){
        console.log(` Scraping term ${termIDs[i]}\n`);
        progress.start(25,0);
        let alldata = {
            data: []
        };
        //5125
        for (let num=0;num<=5125;num+=205){
            await page.goto(`https://bannerxe.fau.edu/StudentRegistrationSsb/ssb/searchResults/searchResults?txt_term=${termIDs[i]}&startDatepicker=&endDatepicker=&uniqueSessionId=&pageOffset=${ num }&pageMaxSize=205&sortColumn=subjectDescription&sortDirection=asc`);
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
            progress.update(num/205);
        }
        fs.appendFile(`../data/${termIDs[i]}.json`, (JSON.stringify(alldata, null, 4)));
        path = `../data/${termIDs[i]}.json`
        progress.stop();
    }
    await browser.close();

    console.log('\n\nSemester data scraped...\n');
    return path
}

module.exports = { scrapeAll }