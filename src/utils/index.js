export const sleep = function (timeout = 50) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, timeout)
  })
}

export const unique = function (arr) {
  return Array.from(new Set(arr))
}