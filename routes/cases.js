var express = require('express');
var router = express.Router();
var asyncHandler = require('express-async-handler');
require('../utils/helpers')();

router.get('/:FROM_YEAR/:FROM_MONTH/:TO_YEAR/:TO_MONTH', asyncHandler(async (req, res, next) => {
	var db = req.db;
	var collection = db.get("firdatafull");
	var data = await collection.aggregate(
		[
			{
				$match:
				{
					REG_YEAR: {
						$gte: Number(req.params['FROM_YEAR']),
						$lte: Number(req.params['TO_YEAR'])
					},
					REG_MONTH: {
						$gte: Number(req.params['FROM_MONTH']),
						$lte: Number(req.params['TO_MONTH'])
					}
				}
			},
			{
				$group:
				{
					_id: {
						var1: "$CHARGSHEET_OR_NOT",
						var2: "$ZONE_NAME"
					},
					count: { $sum: 1 }
				}
			},
			{
				$sort: { _id: 1 }
			}
		]
	);

	var names = [];
	for (d in data) {
		names.push(data[d]._id.var2);
	}
	names = [... new Set(names)];

	var output = [], keys = [];
	for (n in names) {
		output.push({
			_id: names[n],
			count: getPendingCases(data, names[n])
		});
		keys.push({
			_id: names[n]
		});
	}
	res.json([output, keys]);
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
					REG_YEAR: {
						$gte: Number(req.params['FROM_YEAR']),
						$lte: Number(req.params['TO_YEAR'])
					},
					REG_MONTH: {
						$gte: Number(req.params['FROM_MONTH']),
						$lte: Number(req.params['TO_MONTH'])
					}
				}
			},

			{
				$group:
				{
					_id: {
						var1: "$CHARGSHEET_OR_NOT",
						var2: "$RANGE_NAME"
					},
					count: { $sum: 1 }
				}
			},
			{
				$sort: { _id: 1 }
			}
		]
	);

	var names = [];
	for (d in data) {
		names.push(data[d]._id.var2);
	}
	names = [... new Set(names)];

	var output = [], keys = [];
	for (n in names) {
		output.push({
			_id: names[n],
			count: getPendingCases(data, names[n])
		});
		keys.push({
			_id: names[n]
		});
	}
	res.json([output, keys]);
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
					REG_YEAR: {
						$gte: Number(req.params['FROM_YEAR']),
						$lte: Number(req.params['TO_YEAR'])
					},
					REG_MONTH: {
						$gte: Number(req.params['FROM_MONTH']),
						$lte: Number(req.params['TO_MONTH'])
					}
				}
			},
			{
				$group:
				{
					_id: {
						var1: "$CHARGSHEET_OR_NOT",
						var2: "$DISTRICT"
					},
					count: { $sum: 1 }
				}
			},
			{
				$sort: { _id: 1 }
			}
		]
	);

	var names = [];
	for (d in data) {
		names.push(data[d]._id.var2);
	}
	names = [... new Set(names)];

	var output = [], keys = [];
	for (n in names) {
		output.push({
			_id: names[n],
			count: getPendingCases(data, names[n])
		});
		keys.push({
			_id: names[n]
		});
	}
	res.json([output, keys]);
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
					REG_YEAR: {
						$gte: Number(req.params['FROM_YEAR']),
						$lte: Number(req.params['TO_YEAR'])
					},
					REG_MONTH: {
						$gte: Number(req.params['FROM_MONTH']),
						$lte: Number(req.params['TO_MONTH'])
					}
				}
			},
			{
				$group:
				{
					_id: {
						var1: "$CHARGSHEET_OR_NOT",
						var2: "$PS"
					},
					count: { $sum: 1 }
				}
			},
			{
				$sort: { _id: 1 }
			}
		]
	);

	var names = [];
	for (d in data) {
		names.push(data[d]._id.var2);
	}
	names = [... new Set(names)];

	var output = [], keys = [];
	for (n in names) {
		output.push({
			_id: names[n],
			count: getPendingCases(data, names[n])
		});
		keys.push({
			_id: names[n]
		});
	}
	res.json([output, keys]);
}));

module.exports = router;
