module.exports = function (obj1, obj2) {
  if (!obj1 || !obj2 || typeof obj1 != 'object' || typeof obj2 != 'object') {
    throw new Error('merge([object], [object])')
  }
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)
  const obj = {}
  keys1.forEach(key => {
    obj[key] = obj1[key]
  })
  keys2.forEach(key => {
    obj[key] = obj2[key]
  })
  return obj
}