
module.exports = function () {
    this.getPendingCases = function (list, name) {
        var count = 0;
        var pendingCount = 0;
        for (l in list) {
            if (list[l]._id.var2 == name) {
                count += list[l].count;
                if (list[l]._id.var1 !== list[l]._id.var1) {
                    pendingCount = list[l].count;
                }
            }
        }
        // keeping a floor of 1% for pending complaints
        pendingCount = Math.max(1, Math.round(100 * pendingCount / (count + 1.0)));
        return pendingCount;
    },
        this.getArrestPercent = function (list, name) {
            var count = 0;
            var arrestCount = 0;
            for (l in list) {
                if (list[l]._id.var2 == name) {
                    count += list[l].count;
                    if (list[l]._id.var1 !== list[l]._id.var1) {
                        arrestCount = list[l].count;
                    }
                }
            }
            // keeping a floor of 1% for outstanding arrestees percentage
            arrestCount = Math.max(1, Math.round(100 * (count - arrestCount) / (count + 1.0)));
            return arrestCount;
        },
        this.checkCrimePattern = function (crimeHeads, crime, record) {
            for (pattern in crimeHeads[crime].patterns) {
                if (crimeHeads[crime].patterns[pattern].test(record._id.act)) {
                    return 1;
                }
            }
        },
        this.getTemporalCounts = function (data, month, year, heads, crime) {
            return data.filter(function (i) {
                return i._id.month == month && i._id.year == year && checkCrimePattern(heads, crime, i);
            }).reduce(function (sum, x) {
                return sum = sum + x.count;
            }, 0);
        }
}

/*
function checkCrimePattern(crime, record) {
    for (pattern in crimeHeads[crime].patterns) {
        if (crimeHeads[crime].patterns[pattern].test(record._id.act)) {
            return 1;
        }
    }
}

function getTemporalCounts(data, month, year, crime) {
    return data.filter(function (i) {
        return i._id.month == month && i._id.year == year && checkCrimePattern(crime, i);
    }).reduce(function (sum, x) {
        return sum = sum + x.count;
    }, 0);
}

*/