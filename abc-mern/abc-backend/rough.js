const newObj = {
    'a':[1,2,3,4]
}
const a = newObj['a']
newObj['b'] = [5,6,7,8]
console.log( Object.keys(newObj),a,newObj)