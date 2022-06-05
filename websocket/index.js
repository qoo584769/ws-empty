const WebSocket = require('ws');

const websocketServer = (expressServer) => {
  const server = expressServer()
  let wsUser = [];

  // 建立新的ws伺服器
  const websocketServer = new WebSocket.Server({
    // server:expressServer
    noServer: true,
  });

  websocketServer.on(
    'connection',
    async function connection(websocketConnection, connectionRequest) {
      const [_path, params] = connectionRequest?.url?.split('?');
      console.log(_path);
      console.log(params);

      websocketConnection.userid = params;

      wsUser.push({userid:params,ws:websocketConnection})

      websocketConnection.on('message', async (message) => {
        const data = JSON.parse(message);
        websocketConnection.send(JSON.stringify(data))
      });
    }
  );
  const PORT = process.env.PORT || 3005
  server.listen(3005)
  return websocketServer;
};

module.exports = websocketServer;
