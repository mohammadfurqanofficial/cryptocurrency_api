export const cron = () => {
    console.log("This is cron API");
    saveCoinHistory();
    console.log("This is cron after API");
    res.status(200).json({ success: true });
}