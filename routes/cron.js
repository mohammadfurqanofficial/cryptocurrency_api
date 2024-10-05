export default function handler(req, res) {
    console.log("This is cron function");
    saveCoinHistory();
    
    console.log("This is cron after function");
    res.status(200).end('Hello Cron!');
}