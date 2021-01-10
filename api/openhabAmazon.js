var request = require('request');

function setItemState(itemName, state) {
  return new Promise(function (resolve, reject) {
    try {
      if (itemName === undefined)
        reject(Error('Passed itemName is undefined'));

      if (state === undefined)
        reject(Error('Passed state is undefined'));

      request({
        method: 'PUT',
        uri: `http://openhab.pinanet.de:8080/rest/items/${itemName}/state`,
        header: {
          'Content-Type': 'text/plain'
        },
        body: state.toUpperCase()

      },
        function (error, response, body) {
          if (error) {
            reject(error);
          } else if (response.statusCode == 400) {
            reject(Error(`Passed state not parseable: '${state}'`));
          } else if (response.statusCode == 404) {
            reject(Error(`Item not found ${itemName}`));
          }
          resolve(response.statusCode);
        }
      );
    } catch (e) {
      reject(e);
    }
  });
}

function setItemCommand(itemName, command) {
  return new Promise(function (resolve, reject) {
    try {
      if (itemName === undefined)
        reject(Error('Passed itemName is undefined'));

      if (command === undefined)
        reject(Error('Passed state is undefined'));

      request({
        method: 'POST',
        uri: `http://openhab.pinanet.de:8080/rest/items/${itemName}`,
        header: {
          'Content-Type': 'text/plain'
        },
        body: command
      },
        function (error, response, body) {
          if (error) {
            reject(error);
          } else if (response.statusCode == 400) {
            reject(Error(`Passed command not parseable: '${command}'`));
          } else if (response.statusCode == 404) {
            reject(Error(`Item not found ${itemName}`));
          }
          resolve(response.statusCode);
        }
      );
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  changeItemState: (itemName, commandName) => setItemState(itemName, commandName),
  sendItemCommand: (itemName, command) => setItemCommand(itemName, command)
};