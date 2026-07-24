const XLSX = require('xlsx');

try {
  const workbook = XLSX.readFile('g:\\PMS\\Park view city leads 8-5-26 (1).xlsx');
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  console.log("Headers:");
  console.log(jsonData[0]);
  console.log("Sample Data:");
  console.log(jsonData[1]);
} catch (error) {
  console.error("Error reading file:", error.message);
}
