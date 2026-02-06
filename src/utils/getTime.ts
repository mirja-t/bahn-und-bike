export const getTime = (minutes: number, lang: string) => {
    const strMinute = lang === "de" ? "Minute" : "minute";
    const strMinutes = lang === "de" ? "Minuten" : "minutes";
    const strHour = lang === "de" ? "Stunde" : "hour";
    const strHours = lang === "de" ? "Stunden" : "hours";
    const getTimeFormat = (minutes: number) => {
        if (minutes === 1) return `${minutes} ${strMinute}`;
        if (minutes < 60) {
            return `${minutes} ${strMinutes}`;
        } else if (minutes === 60) {
            return `1:00 ${strHour}`;
        } else {
            const hrs = Math.floor(minutes / 60);
            let mnts = minutes % 60 < 10 ? "0" + (minutes % 60) : minutes % 60;
            mnts = mnts === 0 ? "00" : mnts;
            return `${hrs}:${mnts} ${strHours}`;
        }
    };
    const timeFormat = getTimeFormat(minutes);

    return timeFormat;
};
