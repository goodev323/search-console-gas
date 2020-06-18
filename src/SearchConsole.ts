const DATE_FORMAT = 'yyyy-MM-dd';
const TIME_ZONE = 'Asia/Tokyo';
const SITE_URL = PropertiesService.getScriptProperties().getProperty(
  'SITE_URL'
);
const NO_DATA_STR = "#N/A";

/**
 * 検索順位をSearchConsoleから取得する。
 * @param accessToken
 * @param date
 * @param url
 * @param keyword
 */
const fetchSearchOrder = (
  accessToken: string,
  date: Date,
  url: string,
  keyword: string
) => {
  const requestBody = buildRequestBody(date, url, keyword);
  const response = requestSearchConsoleAPI(accessToken, requestBody);
  return extractPosition(response);
};

/*
 * Search Console APIにPOSTするクエリパラメータを作成する。
 *
 * 以下のgoogle公式Search Console APIページでquery parametersの確認、テストが可能
 * https://developers.google.com/webmaster-tools/search-console-api-original/v3/searchanalytics/query
 *
 * ここでは、指定日付時点のURL & キーワードが一致したデータを取得している。
 *
 * @param date Date 日付
 * @param unscope_url Array 除外するURLのリスト
 * @return Hash レスポンス
 */
const buildRequestBody = (date: Date, url: string, keyword: string) => {
  const formatedDate = Utilities.formatDate(date, TIME_ZONE, DATE_FORMAT);
  return {
    startDate: formatedDate,
    endDate: formatedDate,
    searchType: 'web',
    startRow: 0,
    rowLimit: 1,
    aggregationType: 'byPage',
    dimensions: ['page', 'query'],
    dimensionFilterGroups: [
      {
        groupType: 'and',
        filters: [
          {
            dimension: 'page',
            operator: 'equals',
            expression: url,
          },
          {
            dimension: 'query',
            operator: 'equals',
            expression: keyword,
          },
        ],
      },
    ],
  };
};

/**
 * paramsのデータを、サーチコンソールにリクエストする。
 * 共通処理であるため、編集不要
 */
const requestSearchConsoleAPI = (accessToken, params) => {
  const response = UrlFetchApp.fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${SITE_URL}/searchAnalytics/query`,
    {
      method: 'post',
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
      payload: JSON.stringify(params),
    }
  );
  return response;
};

/**
 * レスポンスデータから、順位を抽出する。
 * @param {*} response
 */
const extractPosition = (response: GoogleAppsScript.URL_Fetch.HTTPResponse) => {
  const responseData = JSON.parse(response.toString());
  const rows = responseData.rows;
  if (!rows || rows.length === 0) {
    return NO_DATA_STR;
  }
  const position: number = rows[0].position;
  if (!position) {
    return NO_DATA_STR;
  }
  return floorPosition(position);
};

/**
 * 順位表示用に、小数第二位以下を切り捨てる
 * @param {*} position
 */
const floorPosition = (position: number) => {
  const base = 100;
  return Math.floor(position * base) / 100;
};
