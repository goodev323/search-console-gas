const doc = SpreadsheetApp.getActiveSpreadsheet();
const targetSheet = doc.getSheetByName('コンテンツ管理シート');
const KEYWORD_COLUMN_KEY = "キーワード";
const URL_COLUMN_KEY = "公開URL";
const PUBLIC_DATE_COLUMN_KEY = "公開日";
const IMPORTED_COLUMN_KEY = "取込済";

const updateSheets = () => {
  if(!targetSheet){
    throw new Error('コンテンツ管理シートが見つかりません。')
  }
  const isUpdateDate = initializeSheetDates(targetSheet);
  const accessToken = getAccessToken();
  if (!accessToken) {
    return;
  }

  const table = targetSheet.getDataRange().getValues();
  const header = table[0];
  if(!header.includes(KEYWORD_COLUMN_KEY) || !header.includes(URL_COLUMN_KEY) || !header.includes(PUBLIC_DATE_COLUMN_KEY) || !header.includes(IMPORTED_COLUMN_KEY)){
    throw new Error('必要なカラムが存在していません。')
  }
  const getColumn = (key: string) => {
    if(!header.includes(key)){
      throw new Error(`[${key}]の列が存在していません。`);
    }
    return header.indexOf(key);
  }
  const keywordColumn = getColumn(KEYWORD_COLUMN_KEY);
  const urlColumn = getColumn(URL_COLUMN_KEY);
  const publicDateColumn = getColumn(PUBLIC_DATE_COLUMN_KEY);
  const importedColumn = getColumn(IMPORTED_COLUMN_KEY);

  for(let i = 1; i < table.length; i++){
    const column = table[i];
    const keyword: string = column[keywordColumn] as string;
    const url: string = column[urlColumn] as string;
    const publicDate: Date = column[publicDateColumn] as Date
    const isImported: boolean = column[importedColumn] as boolean;
    if(!keyword || !url){
      continue;
    }
    if(!isUpdateDate && isImported){
      continue;
    }
    for(let j = 0; j < header.length; j++){
      const headerDate = header[j];
      if(!(headerDate instanceof Date)){
        continue;
      }
      const tableData = table[i][j]; 
      if(typeof tableData === "number"){
        continue;
      }
      if(headerDate > publicDate) {
        table[i][j] = fetchSearchOrder(accessToken, headerDate, url, keyword);
      } else {
        table[i][j] = "-";
      }
    }
    table[i][importedColumn] = true;
  }
  targetSheet.getRange(1, 1, table.length, table[0].length).setValues(table);
};

const onOpen = () => {
  // 更新用のメニューを追加
  SpreadsheetApp.getUi()
    .createMenu('Search Console')
    .addItem('最新の情報を取得', 'updateSheets')
    .addToUi();
};
