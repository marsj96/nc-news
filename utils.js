exports.checkObjectLength = (obj) => {
    let length = 0;

    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            length++
        }
    }
    return length
}