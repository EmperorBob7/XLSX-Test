const XLSX = require("xlsx");
const workbook = XLSX.readFile("WorldTriggerData.csv");
let worksheets = {};
workbook.SheetNames.forEach(x => {
    worksheets[x] = XLSX.utils.sheet_to_json(workbook.Sheets[x]);
});
let output = XLSX.utils.book_new();
let arr = [];
for (let i = 0; i < worksheets.Sheet1.length; i++) {
    if(worksheets.Sheet1[i].Attack == null)
        continue;
    arr.push({
        "Name": worksheets.Sheet1[i].Name,
        "Position": guessPosition(worksheets.Sheet1[i]),
        "Actual Position": worksheets.Sheet1[i].Position
    });
}
let ws = XLSX.utils.json_to_sheet(arr, {header: ["Name", "Position Guessed", "Actual Position"]});
XLSX.utils.book_append_sheet(output, ws, "Sheet1");
XLSX.writeFile(output, "NewFile.xlsx");

function guessPosition(obj) {
    let ret = "All-Rounder";
    if(obj.Range >= 6) {
        ret = "Sniper";
    }
    if(obj.Trion >= 5 && obj.Range >= 4 && obj.Range <= 9) {
        ret = "Shooter";
    }
    if(obj.Trion >= 5 && (obj.Range <= 4 || obj.SpecialTactics <= 3) && obj.Attack < 10) {
        ret = "Gunner";
    }
    if(obj.Trion >= 7 && obj.DefenceSupport >= 10) {
        ret = "Trapper";
    }
    return ret;
}