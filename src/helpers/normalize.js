export const arrayToObj = (arr) => {
  return arr.reduce((acc, item, i) => {
    acc[item.id] = item
    return acc
  }, {})
}

export const objToArray = (obj) => {
  return Object.keys(obj).map(key => (obj[key]))
}
