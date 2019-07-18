import path from 'path';
import fs from 'fs';
import http from 'http';
import express from 'express';
import socket from 'socket.io';
import ss from 'socket.io-stream';
import googleSearch from './utils/googleSearch';
import loger from './utils/loger';

const testLog = loger(__dirname + '/test.log');
const app = express();
const server = http.Server(app);
const io = socket(server);
server.listen(3000);

app.use('/assets', express.static(__dirname + '/client/assets'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

io.on('connect', client => {
  const userAgent = client.handshake.headers['user-agent'];
  const addr = client.request.connection.remoteAddress;

  const dataStart = `${addr} "${userAgent}" - New`;
  testLog(dataStart + ' connection');

  client.on('json', async data => {
    try {
      const { searchInformation } = await googleSearch(data.query);

      await testLog(
        `${dataStart} JSON: ${JSON.stringify(data)}, About ${
          searchInformation.formattedTotalResults
        } results.`
      );
      client.emit('json', { status: 200 });
    } catch (error) {
      client.emit('json', { status: 500 });
    }
  });

  client.on('rawData', async text => {
    try {
      await testLog(`${dataStart} RAW: ${text}`);
      client.emit('rawData', { status: 200 });
    } catch (error) {
      client.emit('rawData', { status: 500 });
    }
  });

  ss(client).on('image', (stream, data) => {
    const filename = `${new Date().getTime()}_${path.basename(data.name)}`;
    const pathToDir = path.resolve(__dirname, 'client', 'assets', 'img');

    if (!fs.existsSync(pathToDir)) {
      fs.mkdirSync(pathToDir);
    }

    const pathToFile = path.resolve(pathToDir, filename);
    stream.pipe(fs.createWriteStream(pathToFile));

    stream.on('error', err => {
      fs.unlink(pathToFile, err => {
        if (err) throw err;
      });
      client.emit('image', { status: 500 });
    });

    stream.on('finish', () => {
      testLog(
        `${dataStart} Image: http://localhost:3000/assets/img/${filename}`
      );
      client.emit('image', { status: 200 });
    });
  });
});
