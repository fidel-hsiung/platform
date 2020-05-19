export const processResponse = (response) => {
  return new Promise((resolve, reject) => {
    let func;
    response.status < 300 ? func = resolve : func = reject;
    response.json().then(data => func({'status': response.status, 'data': data}));
  });
}
