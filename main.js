// settings in properties. 
const CLIENT_ID = PropertiesService.getScriptProperties().getProperty('CLIENT_ID');
const CLIENT_SECRET = PropertiesService.getScriptProperties().getProperty('CLIENT_SECRET');
const SITE_URL = PropertiesService.getScriptProperties().getProperty('SITE_URL');

const NO_DATA_STR = "#N/A";

const updateSheets = () => {
  initializeSheetDates();
  const searchParams = getSearchParams();
  const dateColumns = getDateColumns();
  for(const searchParam of searchParams) {
    for(const dateColumn of dateColumns) {
      if(isDataCell(searchParam.row, dateColumn.column)){
        continue;
      }
      const requestBody = buildRequestBody(dateColumn.date, searchParam.url, searchParam.keyword);
      const response = requestSearchConsoleAPI(requestBody);
      const orderData = extractPosition(response);
      pasteData(searchParam.row, dateColumn.column, orderData)
    }
  }
  autoResizeColumn();
}

const onOpen = () => {
  // 更新用のメニューを追加
  SpreadsheetApp.getUi()
      .createMenu('Search Console')
      .addItem('最新の情報を取得', 'updateSheets')
      .addToUi();
}