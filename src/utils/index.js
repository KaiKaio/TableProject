export const sleep = function (timeout = 50) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, timeout)
  })
}