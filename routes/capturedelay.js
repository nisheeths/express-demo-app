var express = require('express');
var router = express.Router();
var asyncHandler = require('express-async-handler');

router.get('/:FROM_YEAR/:FROM_MONTH/:TO_YEAR/:TO_MONTH', asyncHandler(async (req, res, next) => {
	var db = req.db;
	var collection = db.get("firdatafull");
	var data = await collection.aggregate(
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
				$match:
				{
					"ARREST_TIME_TAKEN":
					{
						$gt: -999
					}
				}
			},
			{
				$group:
				{
					_id: "$ZONE_NAME",
					count:
					{
						$avg: "$ARREST_TIME_TAKEN"
					}
				}
			},
			{
				$sort: { _id: 1 }
			}
		]
	);
	var keys = [];
	for (d in data) {
		data[d].count = Math.max(1, Math.round(data[d].count));
		keys.push(data[d]._id);
	}

	res.json([data, keys]);
}));

router.get('/:ZONE_NAME/:FROM_YEAR/:FROM_MONTH/:TO_YEAR/:TO_MONTH', asyncHandler(async (req, res, next) => {
	var db = req.db;
	var collection = db.get("firdatafull");
	var data = await collection.aggregate(
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
				$match:
				{
					"ARREST_TIME_TAKEN":
					{
						$gt: -999
					}
				}
			},
			{
				$group:
				{
					_id: "$RANGE_NAME",
					count:
					{
						$avg: "$ARREST_TIME_TAKEN"
					}
				}
			},
			{
				$sort: { _id: 1 }
			}
		]
	);
	var keys = [];
	for (d in data) {
		data[d].count = Math.max(1, Math.round(data[d].count));
		keys.push(data[d]._id);
	}

	res.json([data, keys]);
}));

router.get('/:ZONE_NAME/:RANGE_NAME/:FROM_YEAR/:FROM_MONTH/:TO_YEAR/:TO_MONTH', asyncHandler(async (req, res, next) => {
	var db = req.db;
	var collection = db.get("firdatafull");
	var data = await collection.aggregate(
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
				$match:
				{
					"ARREST_TIME_TAKEN":
					{
						$gt: -999
					}
				}
			},
			{
				$group:
				{
					_id: "$DISTRICT",
					count:
					{
						$avg: "$ARREST_TIME_TAKEN"
					}
				}
			},
			{
				$sort: { _id: 1 }
			}
		]
	);
	var keys = [];
	for (d in data) {
		data[d].count = Math.max(1, Math.round(data[d].count));
		keys.push(data[d]._id);
	}

	res.json([data, keys]);
}));

router.get('/:ZONE_NAME/:RANGE_NAME/:DISTRICT/:FROM_YEAR/:FROM_MONTH/:TO_YEAR/:TO_MONTH', asyncHandler(async (req, res, next) => {
	var db = req.db;
	var collection = db.get("firdatafull");
	var data = await collection.aggregate(
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
				$match:
				{
					"ARREST_TIME_TAKEN":
					{
						$gt: -999
					}
				}
			},
			{
				$group:
				{
					_id: "$PS",
					count:
					{
						$avg: "$ARREST_TIME_TAKEN"
					}
				}
			},
			{
				$sort: { _id: 1 }
			}
		]
	);
	var keys = [];
	for (d in data) {
		data[d].count = Math.max(1, Math.round(data[d].count));
		keys.push(data[d]._id);
	}

	res.json([data, keys]);
}));

module.exports = router;
