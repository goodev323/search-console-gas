const getAccessToken = (): string | null => {
  const service = getService();
  if (!service.hasAccess()) {
    alertAuth(service);
    return null;
  }
  return service.getAccessToken();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const alertAuth = (service: any) => {
  const authorizationUrl = service.getAuthorizationUrl();
  const msg = `次のURLにアクセスし、ログインを完了したのち、再度実行してください。\n${authorizationUrl}`;
  Logger.log(msg);
  Browser.msgBox(msg);
};
