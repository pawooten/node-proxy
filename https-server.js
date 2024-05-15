import fs from 'fs';
import httpProxy from 'http-proxy';
import url from 'url';
// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
// process.env.https_proxy = 'http://127.0.0.1:8888'
const httpsOptions = {
    key: fs.readFileSync("C:\\certificates\\localhost.key"),
    cert: fs.readFileSync("C:\\certificates\\localhost.crt")
};

// All https, all the time
const targets = {
    'bff': 'https://localhost:5002',
    'api': 'https://localhost:5001'
};
const port = 3001;
const proxyOptions = {
    ssl: httpsOptions,
    target: targets.api,
    secure: false
};
const authTokenQueryStringParameterName = 'authtoken';
const proxy = httpProxy.createServer(proxyOptions);
proxy.on('proxyReq', async (proxyReq, req, res, options) => {
    const parsedRequest = url.parse(req.url, true);
    const queryStringAuthToken = parsedRequest.query[authTokenQueryStringParameterName];
    if (!queryStringAuthToken) {
        console.log(`No ${authTokenQueryStringParameterName} (case sensitive!) query string parameter found!`);
    } else {
        console.log(`${authTokenQueryStringParameterName} query string parameter found: ${queryStringAuthToken}` );

        // proxyReq.setHeader('Hyland-Permission-Context', 'Healthcare;documentId=88397');
        // const tokenExchangeResult = await exchangeToken(queryStringAuthToken);
        // console.log(tokenExchangeResult);
        // proxyReq.setHeader('Authorization', `Bearer ${queryStringAuthToken}`);
    }
});
proxy.listen(port, () => console.log(`HTTPS Proxy to ${proxyOptions.target} listening on ${port}`));

