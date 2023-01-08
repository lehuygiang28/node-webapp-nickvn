function chiaLayPhanNguyen(a, b) {
    return (a - (a % b)) / b;
}

function chiaLayPhanDu(a, b) {
    return a % b;
}

module.exports = {
    chiaLayPhanNguyen: chiaLayPhanNguyen,
    chiaLayPhanDu: chiaLayPhanDu,
};
