// в "редактор скриптов" в меню выбрать: 
// - Опубликовать 
// - Развернуть как веб-приложение 
// - Как запускать приложение: От моего имени
// - Кто имеет доступ к приложению: Все, включая анонимных пользователей
// - Обновить и получить Текущий URL веб-приложения:   
var SHEET_URL = "https://docs.google.com/spreadsheets/d/178agwdIps-k_cHemF6GoE6HJzQ6yBlgYqnQETbNURHk/edit#gid=0";
    
function doGet(e) {
    var lock = LockService.getPublicLock(); 
    lock.waitLock(30000);  // 30 seconds
    var result = null;
    try {
        var ssa = SpreadsheetApp.openByUrl(SHEET_URL);
        var sheet = ssa.getSheets()[0]
        var nextRow = setValues(sheet, e);
        result = {"result" : "success", "row" : nextRow};
    } catch(e) {
        result = {"result" : "error", "error" : e};
    }
    lock.releaseLock();
    return ContentService.createTextOutput(JSON.stringify(result))
                         .setMimeType(ContentService.MimeType.JSON);
}

function setValues(sheet, e) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn())     // row, column, rows, columns 
                     .getValues()[0];
  var newrow = []; 
  for (i in headers) {
    newrow.push(e.parameter[headers[i]]);
  }
  var nextRow = sheet.getLastRow() + 1;      
  sheet.getRange(nextRow, 1, 1, newrow.length)
       .setValues([newrow]);
  return nextRow;     
}


