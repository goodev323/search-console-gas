/*
* Search Console APIにPOSTするクエリパラメータを作成する。
*
* 以下のgoogle公式Search Console APIページでquery parametersの確認、テストが可能
* https://developers.google.com/webmaster-tools/search-console-api-original/v3/searchanalytics/query
*
* ここでは、指定日付時点のURL & キーワードが一致したデータを取得している。
*
* @param date Date 日付(YYYY-MM-DD)
* @param unscope_url Array 除外するURLのリスト
* @return Hash レスポンス
*/
const buildRequestBody = (date, url, keyword) => {
  return {
    rowLimit: 100,
    startDate: date,
    endDate: date,
    searchType: "web",
    dimensions: ["page"],
    startRow: 0,
    rowLimit: 1,
    aggregationType: "byPage",
    dimensions: ["page", "query"],
    dimensionFilterGroups:[
      {
        "groupType": "and",
        "filters": [
          {
            dimension: "page",
            operator: "equals",
            expression: url
          },
          {
            dimension: "query",
            operator: "equals",
            expression: keyword
          }
        ]
      }
    ]
  }
}

/**
* paramsのデータを、サーチコンソールにリクエストする。
* 共通処理であるため、編集不要
*/
const requestSearchConsoleAPI = params => {
  var service = getService();
  var response = UrlFetchApp.fetch('https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fwww.zerorenovation.com/searchAnalytics/query', {
    method : "post",
    contentType: "application/json",   
    headers: {
      Authorization: 'Bearer ' + service.getAccessToken(),
    },
    payload:JSON.stringify(params),
  });
  return response;
}

/**
 * レスポンスデータから、順位を抽出する。
 * @param {*} response 
 */
const extractPosition = response => {
  const responseData = JSON.parse(response);
  const rows = responseData.rows;
  if(!rows || rows.length === 0){
    return NO_DATA_STR;
  }
  const position = rows[0].position;
  if(!position){
    return NO_DATA_STR;
  }
  return floorPosition(position);
}

/**
 * 順位表示用に、小数第二位以下を切り捨てる
 * @param {*} position 
 */
const floorPosition = position => {
  const base = 100;
  return Math.floor(position * base) / 100;
}