const doc = SpreadsheetApp.getActiveSpreadsheet();
const sheet = doc.getSheetByName("Data");
const BASE_DATE = new Date(2020, 0, 1);
const BASE_DATE_CELL = [2, 4]; // [row, column]
const KEYWORD_COLUMN = 2;
const URL_COLUMN = 3;
const BASE_PARAMS_ROW = 3;

/**
 * シートのD2-に、2020-01-01から現在までの日付をセットする。
 */
const initializeSheetDates = () => {
  const date = new Date(BASE_DATE);
  sheet.getRange(BASE_DATE_CELL[0], BASE_DATE_CELL[1]).setValue(date);
  
  const today = new Date();
  let i = 1;
  while(true){
    date.setDate(date.getDate() + 7);
    if(date > today){
      break;
    }
    const range = sheet.getRange(BASE_DATE_CELL[0], BASE_DATE_CELL[1] + i);
    if(range.isBlank()){
      range.setValue(date);
    }
    i++;
  }
}

/**
 * 日付とカラム番号の配列を返す。
 */
const getDateColumns = () => {
  const lastColumns = sheet.getLastColumn();
  let dateColumns = [];
  for(let i = BASE_DATE_CELL[1]; i <= lastColumns; i++){
    const date = sheet.getRange(BASE_DATE_CELL[0], i).getValue();
    const dateColumn = {
      date: Utilities.formatDate( date, 'Asia/Tokyo', 'yyyy-MM-dd'),
      column: i
    };
    dateColumns.push(dateColumn);
  }
  return dateColumns;
}

/**
 * サーチコンソールパラメータを、シートから取得する。
 * @return [{keyword: キーワード, url: URL}]
 */
const getSearchParams = () => {
  const params = [];
  const lastParamRow = sheet.getLastRow();
  for(let i = BASE_PARAMS_ROW; i <= lastParamRow; i++) {
    const paramArray = sheet.getRange(i, KEYWORD_COLUMN, 1, 2).getValues();
    const param = {
      keyword: paramArray[0][0],
      url: paramArray[0][1],
      row: i
    };
    params.push(param);
  }
  return params;
}

/**
 * 指定したセルが空欄(NODATA)であることを判断する
 * @param {*} row 
 * @param {*} column 
 */
const isDataCell = (row, column) => {
  const range = sheet.getRange(row, column);
  if(range.isBlank()){
    return false;
  }
  const value = range.getValue();
  if(value === NO_DATA_STR){
    return false;
  }
  return true;
}

/**
 * 指定したセルが空欄(NODATA)であることを判断する
 * @param {*} row 
 * @param {*} column 
 * @param {*} data 
 * @param {*} nodataStr 
 */
const pasteData = (row, column, data) => {
  const range = sheet.getRange(row, column);
  if(data){
    range.setValue(data);
  } else {
    range.setValue(NO_DATA_STR);
  }
}


/**
 * 列幅を自動調整する。
 */
const autoResizeColumn = () => {
  const lastColumns = sheet.getLastColumn();
  for(let i = BASE_DATE_CELL[1]; i <= lastColumns; i++) {
    sheet.setColumnWidth(i, 40);
  }
}