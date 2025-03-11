function getHighestIndex(arr: number[]) {
    if(arr.length == 0) return -1

    let maxValue = Math.max(...arr)
    return arr.indexOf(maxValue)
}


// test
console.log(getHighestIndex([10, 20, 30, 40, 50]))
