/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT FOR LOVE REPORT LANDING PAGE & CHECKOUT
 * ==============================================================================
 * 
 * INSTRUCTIONS FOR DEPLOYMENT:
 * 1. Open Google Sheets (https://sheets.new) and create a new blank spreadsheet.
 * 2. In row 1, set the following Column Headers:
 *    A1: Timestamp | B1: Order ID | C1: Name | D1: Email | E1: Contact | F1: DOB | G1: Gender | H1: City | I1: Package | J1: Price | K1: Payment Status
 * 3. Go to Extensions > Apps Script in the Google Sheet menu.
 * 4. Paste this entire code into Code.gs (replacing everything).
 * 5. Click "Deploy" > "New deployment".
 * 6. Select type: "Web app".
 * 7. Set:
 *    - Description: "Love Report Checkout API"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (CRITICAL: MUST be set to "Anyone")
 * 8. Click "Deploy" and grant permissions when prompted.
 * 9. Copy the generated "Web App URL" (e.g. https://script.google.com/macros/s/.../exec).
 * 10. Paste the Web App URL into the Admin Settings Panel or checkout config!
 * ==============================================================================
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = {};
    
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    }
    
    var timestamp = new Date();
    var orderId = data.orderId || "ORD-" + Math.floor(100000 + Math.random() * 900000);
    var name = data.name || "";
    var email = data.email || "";
    var contact = data.contact || "";
    var dob = data.dob || "";
    var gender = data.gender || "";
    var city = data.city || "";
    var selectedPackage = data.package || "";
    var price = data.price || "";
    var paymentStatus = data.paymentStatus || "Pending";
    
    // Append Row to Google Sheet
    sheet.appendRow([
      timestamp,
      orderId,
      name,
      email,
      contact,
      dob,
      gender,
      city,
      selectedPackage,
      price,
      paymentStatus
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      "status": "success",
      "message": "Order saved successfully to Google Sheet",
      "orderId": orderId
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error",
      "message": error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    "status": "success",
    "message": "Love Report Google Apps Script Webhook API is Live & Ready!"
  })).setMimeType(ContentService.MimeType.JSON);
}
