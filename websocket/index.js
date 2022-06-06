const WebSocket = require('ws');

const websocketServer = (expressServer) => {
  // const server = expressServer()
  let wsUser = [];

  // 建立新的ws伺服器
  const websocketServer = new WebSocket.Server({
    // server:expressServer,
    noServer: true,
  });
  const websocketServer2 = new WebSocket.Server({
    // server:expressServer,
    noServer: true,
  });

  websocketServer.on(
    'connection',
    async function connection(websocketConnection, connectionRequest) {
      const [_path, params] = connectionRequest?.url?.split('?');
      console.log(123);
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
  websocketServer2.on(
    'connection',
    async function connection(websocketConnection, connectionRequest) {
      const [_path, params] = connectionRequest?.url?.split('?');   
      console.log(456);
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

  expressServer.on('upgrade', (request, socket, head) => {
    const [_path, params] = request?.url?.split('?')
    if (_path === '/') {
      websocketServer.handleUpgrade(request, socket, head, (ws) => {
        console.log(123)
        websocketServer.emit('connection', ws, request)
      })
    } else if (_path === '/r') {
      websocketServer2.handleUpgrade(request, socket, head, (ws) => {
        console.log(456)
        websocketServer2.emit('connection', ws, request)
      })
    } else {
      socket.destroy()
    }
  })
  // const PORT = process.env.PORT || 3005
  // server.listen(3005)
  return websocketServer;
};

module.exports = websocketServer;
