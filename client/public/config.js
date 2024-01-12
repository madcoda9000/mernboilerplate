// set here the API url
var BASE_URL = "http://localhost:3001";
var APP_TITLE = "GreatApp Inc";

var WEB_URL = window.location.origin;
var meta = document.createElement("meta");
meta.httpEquiv = "Content-Security-Policy";
meta.content = "default-src 'self' " + WEB_URL + " " + BASE_URL + "; ";
meta.content += "script-src 'self' " + WEB_URL + " " + BASE_URL + "; ";
meta.content += "script-src-elem 'self' " + WEB_URL + " " + BASE_URL + "; ";
meta.content += "script-src-attr 'self' " + WEB_URL + " " + BASE_URL + "; ";
meta.content += "style-src data: 'unsafe-inline' 'unsafe-hashes' 'self' " + WEB_URL + " " + BASE_URL + "; ";
meta.content += "style-src-elem data: 'unsafe-inline' 'unsafe-hashes' 'self' " + WEB_URL + " " + BASE_URL + "; ";
meta.content += "style-src-attr data: 'unsafe-inline' 'unsafe-hashes' 'self' " + WEB_URL + " " + BASE_URL + "; ";
meta.content += "img-src otpauth: data: 'self' " + WEB_URL + " " + BASE_URL + "; ";
meta.content += "font-src 'self' " + WEB_URL + " " + BASE_URL + "; ";
meta.content += "connect-src 'self' " + WEB_URL + " " + BASE_URL + ";";
meta.content += "media-src 'self' " + WEB_URL + " " + BASE_URL + "; ";
meta.content += "object-src 'self' " + WEB_URL + " " + BASE_URL + "; ";
meta.content += "child-src 'self' " + WEB_URL + " " + BASE_URL + "; ";
meta.content += "worker-src 'self' " + WEB_URL + " " + BASE_URL + "; ";
meta.content += "form-action 'self' " + WEB_URL + " " + BASE_URL + "; ";
meta.content += "base-uri 'self' " + WEB_URL + "; manifest-src 'self' " + WEB_URL + ";";
document.getElementsByTagName("head")[0].append(meta);
document.title = window.APP_TITLE;
