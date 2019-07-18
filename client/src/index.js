import io from 'socket.io-client';
import ss from 'socket.io-stream';
import sendData, { sendAfter } from './sendData';

const msDelay = 2000;
const socket = io.connect('http://localhost:3000');
const collectionData = [
  ['json', { type: 'test', query: 'node js development' }],
  ['rawData', 'Test here!']
];

const getRandomElem = () => {
  const randInd = ~~(Math.random() * collectionData.length);
  return collectionData[randInd];
};

socket.on('connect', () => {
  console.log('соединение установлено');
  const [event, data] = getRandomElem();
  sendData(socket, event, data);
});

socket.on('json', ({ status }) => {
  if (status === 200) {
    const [event, data] = getRandomElem();
    sendAfter(msDelay)(socket, event, data);
  }
});

socket.on('rawData', ({ status }) => {
  if (status === 200) {
    const [event, data] = getRandomElem();
    sendAfter(msDelay)(socket, event, data);
  }
});

socket.on('disconnect', () => {
  console.log('Поетряно соединение');
});

document.getElementById('FileBox').addEventListener('change', e => {
  const file = e.target.files[0];
  const stream = ss.createStream();
  const blobStream = ss.createBlobReadStream(file);
  let size = 0;

  blobStream.on('data', function(chunk) {
    size += chunk.length;
    console.log(Math.floor((size / file.size) * 100) + '%');
  });

  ss(socket).emit('image', stream, { size: file.size, name: file.name });
  blobStream.pipe(stream);
});
