export default function handler() {
    console.log("This is cron API");
    response.status(200).json({ success: true });
}