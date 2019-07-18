import fs from 'fs';

const dataEnd = '\n\n';

export default pathToLog => info => {
  fs.writeFile(
    pathToLog,
    `[${new Date()}] ${info}${dataEnd}`,
    { flag: 'a+' },
    err => {
      if (err) throw err;
    }
  );
};
