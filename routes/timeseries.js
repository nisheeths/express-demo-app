
collection.aggregate([{$project: {date:{$dateFromString: {dateString: '$REG_DT'}}}}, {$project: {m: {$month: '$date'}}}, {$group: {_id: "$m", count: {$sum:1}}}])

db.firdatafull.aggregate([{$addFields: {date:{$dateFromString: {dateString: '$REG_DT'}}}}, {$addFields: {REG_MONTH: {$month: '$date'}}}])