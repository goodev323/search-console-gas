const CLIENT_ID = PropertiesService.getScriptProperties().getProperty(
  'CLIENT_ID'
);
const CLIENT_SECRET = PropertiesService.getScriptProperties().getProperty(
  'CLIENT_SECRET'
);

const getService = () => {
  const service = OAuth2.createService('searchconsole')
    .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
    .setTokenUrl('https://accounts.google.com/o/oauth2/token')
    .setClientId(CLIENT_ID)
    .setClientSecret(CLIENT_SECRET)
    .setRedirectUri(
      'https://script.google.com/macros/d/MyRsqM8ZtXw2hJK7kSpBrbbWIJxplJ2LB/usercallback'
    )
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties())
    .setScope('https://www.googleapis.com/auth/webmasters.readonly')
    .setParam('login_hint', Session.getActiveUser().getEmail())
    .setParam('access_type', 'offline')
    .setParam('approval_prompt', 'force');
  return (() => service)();
};

const authCallback = (request) => {
  const searchConsoleService = getService();
  const isAuthorized = searchConsoleService.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Success! You can close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab');
  }
};