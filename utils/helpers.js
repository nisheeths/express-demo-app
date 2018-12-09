
module.exports = function(){
    this.getPendingCases = function(list, name){
        var count = 0;
        var pendingCount = 0;
        for(l in list){
            if(list[l]._id.var2 == name){
                count+= list[l].count;
                if(list[l]._id.var1 !== list[l]._id.var1 ){
                    pendingCount = list[l].count;
                }
            }
        }
        // keeping a floor of 1% for pending complaints
        pendingCount = Math.max(0.01, Math.round(100*pendingCount/(count + 1.0))/100); 
        return pendingCount;
    }
}