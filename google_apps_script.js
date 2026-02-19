const SHEET_NAME = "Contact_Form_Responses";

function doPost(e) {
    const lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        const doc = SpreadsheetApp.getActiveSpreadsheet();
        let sheet = doc.getSheetByName(SHEET_NAME);

        if (!sheet) {
            sheet = doc.insertSheet(SHEET_NAME);
            // Create headers if sheet is new
            sheet.appendRow(["Timestamp", "Name", "Email", "Phone", "Message"]);
        }

        // Check if headers exist, if not create them (double check for existing sheet with no headers)
        if (sheet.getLastRow() === 0) {
            sheet.appendRow(["Timestamp", "Name", "Email", "Phone", "Message"]);
        }

        const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        const nextRow = sheet.getLastRow() + 1;

        const newRow = headers.map(function (header) {
            if (header === "Timestamp") return new Date();
            // key names must match the 'name' attributes in your HTML form
            // e.g. <input name="name"> matches header "Name" (case-insensitive logic below)

            const paramName = Object.keys(e.parameter).find(k => k.toLowerCase() === header.toLowerCase());
            return paramName ? e.parameter[paramName] : "";
        });

        sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

        return ContentService
            .createTextOutput(JSON.stringify({ "result": "success", "row": nextRow }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (e) {
        return ContentService
            .createTextOutput(JSON.stringify({ "result": "error", "error": e }))
            .setMimeType(ContentService.MimeType.JSON);
    } finally {
        lock.releaseLock();
    }
}
