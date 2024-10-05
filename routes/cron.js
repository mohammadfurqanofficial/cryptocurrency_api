export default function handler(req, res) {
    console.log("This is cron function");
    res.status(200).end('Hello Cron!');
}