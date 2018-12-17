var express = require('express');
var router = express.Router();
var asyncHandler = require('express-async-handler');
var crimeHeads = require('../utils/crimeHeads');


router.get('/:FROM_YEAR/:FROM_MONTH/:TO_YEAR/:TO_MONTH', asyncHandler(async (req, res, next) => {
	var db = req.db;
	var collection = db.get("firdatafull");	
	const data = await collection.aggregate(
		[
			{
				$sample: 
				{
					size: 50000
				}
			},
			{
				$match:
				{
					date:
					{
						$gte: new Date(req.params['FROM_YEAR'] + "-" + req.params['FROM_MONTH']),
						$lte: new Date(req.params['TO_YEAR'] + "-" + req.params['TO_MONTH'])
					}
				}
			},			
			{
				$unwind: "$ACT_SECTION"
			},
			{
				$group:
				{
					_id: "$ACT_SECTION",
					count:
					{
						$sum: 1
					}
				}
			},
			{
				$sort:
				{
					count: -1
				}
			}
		]
	);

	const keys = await collection.aggregate(
		[		
			{
				$group:
				{
					_id: "$ZONE_NAME"
				}
			},
			{
				$sort:
				{
					_id: 1
				}
			}
		]
	);

	var vals = new Array();
	for (var crime in crimeHeads) {
		var item = crimeHeads[crime].key;
		var crimeCount = 0;
		for (var temp in data) {
			for (pattern in crimeHeads[crime].patterns) {
				if (crimeHeads[crime].patterns[pattern].test(data[temp]._id)) {
					crimeCount += data[temp].count;
				}
			}
		}

		vals.push({ _id: crimeHeads[crime].key, count: crimeCount });
	}
	var crimeSum = 0;
	for (v in vals) {
		crimeSum += vals[v].count;
	}
	for (v in vals) {
		vals[v].count = Math.max(0.01, Math.round(100 * vals[v].count / crimeSum) / 100);
	}
	res.json([vals, keys]);
}));


router.get('/:ZONE_NAME/:FROM_YEAR/:FROM_MONTH/:TO_YEAR/:TO_MONTH', asyncHandler(async (req, res, next) => {
	var db = req.db;
	var collection = db.get("firdatafull");	
	const data = await collection.aggregate(
		[
			{
				$match:
				{
					"ZONE_NAME": req.params['ZONE_NAME']
				}
			},
			{
				$match:
				{
					date:
					{
						$gte: new Date(req.params['FROM_YEAR'] + "-" + req.params['FROM_MONTH']),
						$lte: new Date(req.params['TO_YEAR'] + "-" + req.params['TO_MONTH'])
					}
				}
			},			
			{
				$unwind: "$ACT_SECTION"
			},
			{
				$group:
				{
					_id: "$ACT_SECTION",
					count:
					{
						$sum: 1
					}
				}
			},
			{
				$sort:
				{
					count: -1
				}
			}
		]
	);

	const keys = await collection.aggregate(
		[
			{
				$match:
				{
					"ZONE_NAME": req.params['ZONE_NAME']
				}
			},
			{
				$group:
				{
					_id: "$RANGE_NAME"
				}
			},
			{
				$sort:
				{
					_id: 1
				}
			}
		]
	);
	var vals = new Array();	
	for (var crime in crimeHeads) {
		var item = crimeHeads[crime].key;
		var crimeCount = 0;
		for (var temp in data) {
			for (pattern in crimeHeads[crime].patterns) {
				if (crimeHeads[crime].patterns[pattern].test(data[temp]._id)) {
					crimeCount += data[temp].count;
				}
			}
		}

		vals.push({ _id: crimeHeads[crime].key, count: crimeCount });
	}
	var crimeSum = 0;
	for (v in vals) {
		crimeSum += vals[v].count;
	}
	for (v in vals) {
		vals[v].count = Math.max(0.01, Math.round(100 * vals[v].count / crimeSum) / 100);
	}
	res.json([vals, keys]);
}));

router.get('/:ZONE_NAME/:RANGE_NAME/:FROM_YEAR/:FROM_MONTH/:TO_YEAR/:TO_MONTH', asyncHandler(async (req, res, next) => {
	var db = req.db;
	var collection = db.get("firdatafull");	
	const data = await collection.aggregate(
		[
			{
				$match:
				{
					"RANGE_NAME": req.params['RANGE_NAME']
				}
			},
			{
				$match:
				{
					date:
					{
						$gte: new Date(req.params['FROM_YEAR'] + "-" + req.params['FROM_MONTH']),
						$lte: new Date(req.params['TO_YEAR'] + "-" + req.params['TO_MONTH'])
					}
				}
			},			
			{
				$unwind: "$ACT_SECTION"
			},
			{
				$group:
				{
					_id: "$ACT_SECTION",
					count:
					{
						$sum: 1
					}
				}
			},
			{
				$sort:
				{
					count: -1
				}
			}
		]
	);

	const keys = await collection.aggregate(
		[
			{
				$match:
				{
					"RANGE_NAME": req.params['RANGE_NAME']
				}
			},
			{
				$group:
				{
					_id: "$DISTRICT"
				}
			},
			{
				$sort:
				{
					_id: 1
				}
			}
		]
	);

	var vals = new Array();
	for (var crime in crimeHeads) {
		var item = crimeHeads[crime].key;
		var crimeCount = 0;
		for (var temp in data) {
			for (pattern in crimeHeads[crime].patterns) {
				if (crimeHeads[crime].patterns[pattern].test(data[temp]._id)) {
					crimeCount += data[temp].count;
				}
			}
		}

		vals.push({ _id: crimeHeads[crime].key, count: crimeCount });		
	}
	var crimeSum = 0;
	for (v in vals) {
		crimeSum += vals[v].count;
	}
	for (v in vals) {
		vals[v].count = Math.max(0.01, Math.round(100 * vals[v].count / crimeSum) / 100);
	}
	res.json([vals, keys]);
}));


router.get('/:ZONE_NAME/:RANGE_NAME/:DISTRICT/:FROM_YEAR/:FROM_MONTH/:TO_YEAR/:TO_MONTH', asyncHandler(async (req, res, next) => {
	var db = req.db;
	var collection = db.get("firdatafull");	
	const data = await collection.aggregate(
		[
			{
				$match:
				{
					"DISTRICT": req.params['DISTRICT']
				}
			},
			{
				$match:
				{
					date:
					{
						$gte: new Date(req.params['FROM_YEAR'] + "-" + req.params['FROM_MONTH']),
						$lte: new Date(req.params['TO_YEAR'] + "-" + req.params['TO_MONTH'])
					}
				}
			},			
			{
				$unwind: "$ACT_SECTION"
			},
			{
				$group:
				{
					_id: "$ACT_SECTION",
					count:
					{
						$sum: 1
					}
				}
			},
			{
				$sort:
				{
					count: -1
				}
			}
		]
	);

	const keys = await collection.aggregate(
		[
			{
				$match:
				{
					"DISTRICT": req.params['DISTRICT']
				}
			},
			{
				$group:
				{
					_id: "$PS"
				}
			},
			{
				$sort:
				{
					_id: 1
				}
			}
		]
	);

	var vals = new Array();
	for (var crime in crimeHeads) {
		var item = crimeHeads[crime].key;
		var crimeCount = 0;
		for (var temp in data) {
			for (pattern in crimeHeads[crime].patterns) {
				if (crimeHeads[crime].patterns[pattern].test(data[temp]._id)) {
					crimeCount += data[temp].count;
				}
			}
		}

		vals.push({ _id: crimeHeads[crime].key, count: crimeCount });		
	}
	var crimeSum = 0;
	for (v in vals) {
		crimeSum += vals[v].count;
	}
	for (v in vals) {
		vals[v].count = Math.max(0.01, Math.round(100 * vals[v].count / crimeSum) / 100);
	}
	res.json([vals, keys]);
}));

router.get('/:ZONE_NAME/:RANGE_NAME/:DISTRICT/:PS/:FROM_YEAR/:FROM_MONTH/:TO_YEAR/:TO_MONTH', asyncHandler(async (req, res, next) => {
	var db = req.db;
	var collection = db.get("firdatafull");
	const data = await collection.aggregate(
		[
			{
				$match:
				{
					"PS": req.params['PS']
				}
			},
			{
				$match:
				{
					date:
					{
						$gte: new Date(req.params['FROM_YEAR'] + "-" + req.params['FROM_MONTH']),
						$lte: new Date(req.params['TO_YEAR'] + "-" + req.params['TO_MONTH'])
					}
				}
			},			
			{
				$unwind: "$ACT_SECTION"
			},
			{
				$group:
				{
					_id: "$ACT_SECTION",
					count:
					{
						$sum: 1
					}
				}
			},
			{
				$sort:
				{
					count: -1
				}
			}
		]
	);

	const keys = await collection.aggregate(
		[
			{
				$match:
				{
					"PS": req.params['PS']
				}
			},
			{
				$group:
				{
					_id: "$PS"
				}
			},
			{
				$sort:
				{
					_id: 1
				}
			}
		]
	);


	var vals = new Array();	
	for (var crime in crimeHeads) {
		var item = crimeHeads[crime].key;
		var crimeCount = 0;
		for (var temp in data) {
			for (pattern in crimeHeads[crime].patterns) {
				if (crimeHeads[crime].patterns[pattern].test(data[temp]._id)) {
					crimeCount += data[temp].count;
				}
			}
		}

		vals.push({ _id: crimeHeads[crime].key, count: crimeCount });		
	}
	var crimeSum = 0;
	for (v in vals) {
		crimeSum += vals[v].count;
	}
	for (v in vals) {
		vals[v].count = Math.max(0.01, Math.round(100 * vals[v].count / crimeSum) / 100);
	}
	res.json([vals, keys]);
}));

module.exports = router;
