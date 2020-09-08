function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}
/*
console.log(hex2a("0x434f4e4752455353000000000000000000000000000000000000000000000000"));  //congress
console.log(hex2a("0x4248415254495941204a414e5441205041525459000000000000000000000000")); //bjp
console.log(hex2a("0x41414d204141444d492050415254590000000000000000000000000000000000")); //aap
*/
module.exports = hex2a;