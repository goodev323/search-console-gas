const BASE_DATE = new Date(2020, 0, 1);
const HEADER_ROW = 1;

/**
 * シート日付行に、BASE_DATEから現在日付-3までの値をセットする。
 * Search Consoleの日付更新は約1~2日前となるので、念のため3日前までを設定することにする。
 * 日付間隔は7日毎。
 */
const initializeSheetDates = (sheet: GoogleAppsScript.Spreadsheet.Sheet) => {
  const lastColumn = sheet.getLastColumn();
  const headerLastColumnValue: string | Date = sheet.getRange(HEADER_ROW, lastColumn).getValue();

  const dataDateArray: Array<Date> = [];
  let dataDate: Date;
  if(headerLastColumnValue instanceof Date){
    // 日付カラムがすでに存在する場合は続きから入力する
    dataDate = headerLastColumnValue;
  } else{
    // 日付カラムが1つもない場合は、BASE_DATEから入力する
    dataDate = new Date(BASE_DATE);
    dataDateArray.push(new Date(BASE_DATE));
  }
  
  const lastDataDate = new Date();
  lastDataDate.setDate(lastDataDate.getDate() - 3);

  let i = 1;
  while(true){
    dataDate.setDate(dataDate.getDate() + 7);
    if(dataDate > lastDataDate){
      break;
    }
    dataDateArray.push(new Date(dataDate));
    i++;
  }
  if(!dataDateArray.length){
    return;
  }
  // セットするために二次元配列に変換
  const dataDateValues = [dataDateArray];
  sheet.getRange(HEADER_ROW, lastColumn + 1, 1, dataDateArray.length).setValues(dataDateValues);
  return lastColumn !== sheet.getLastColumn();
}

/**
 * 全データテーブルを返す。
 */
const getAllDataTable = (sheet: GoogleAppsScript.Spreadsheet.Sheet) => {
  const lastDataColumn = sheet.getLastColumn();
  const lastDataRow = sheet.getLastRow();
  const dataTable:Array<Array<TableDataType>> = sheet.getRange(1, 1, lastDataRow, lastDataColumn).getValues();
  return dataTable;
}

const setDataTable = (sheet: GoogleAppsScript.Spreadsheet.Sheet, table: TableDataType[][]) => {
  const header = table[0];
  let dataStartColumn = 0;
  for(const data of header){
    if(data instanceof Date){
      break;
    }
    dataStartColumn++;
  }
  dataStartColumn--;
  const dataTable = table.map(row => row.slice(dataStartColumn));
  sheet.getRange(1, dataStartColumn + 1, table.length, dataTable[0].length).setValues(dataTable);
}
