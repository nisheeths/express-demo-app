var express = require('express');
var router = express.Router();
var asyncHandler = require('express-async-handler');
var crimeHeads = require('../utils/crimeHeads');

router.get('/', asyncHandler(async (req, res, next) => {
	var db = req.db;
	var collection = db.get("firdata");
	const denominator = await collection.count({});
	const data = await collection.aggregate([{ $unwind: "$ACT_SECTION" }, { $group: { _id: "$ACT_SECTION", count: { $sum: 1 } } }, { $sort: { count: -1 } }]);
	const keys = await collection.aggregate([{ $group: { _id: "$ZONE_NAME" } }, { $sort: { _id: 1 } }]);
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
		vals.push({ _id: crimeHeads[crime].key, count: Math.round(100 * crimeCount / (denominator * 1.0)) / 100 });
	}
	res.json([vals, keys]);
}));

router.get('/:ZONE_NAME', asyncHandler(async (req, res, next) => {
	var db = req.db;
	var collection = db.get("firdata");
	const denominator = await collection.count({ "ZONE_NAME": req.params['ZONE_NAME'] });
	const data = await collection.aggregate([{ $match: { "ZONE_NAME": req.params['ZONE_NAME'] } }, { $unwind: "$ACT_SECTION" }, { $group: { _id: "$ACT_SECTION", count: { $sum: 1 } } }, { $sort: { count: -1 } }]);
	const keys = await collection.aggregate([{ $match: { "ZONE_NAME": req.params['ZONE_NAME'] } }, { $group: { _id: "$RANGE_NAME" } }, { $sort: { _id: 1 } }]);
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
		vals.push({ _id: crimeHeads[crime].key, count: Math.round(100 * crimeCount / (denominator * 1.0)) / 100 });
	}
	res.json([vals, keys]);
}));

router.get('/:ZONE_NAME/:RANGE_NAME', asyncHandler(async (req, res, next) => {
	var db = req.db;
	var collection = db.get("firdata");
	const denominator = await collection.count({ "RANGE_NAME": req.params['RANGE_NAME'] });
	const data = await collection.aggregate([{ $match: { "RANGE_NAME": req.params['RANGE_NAME'] } }, { $unwind: "$ACT_SECTION" }, { $group: { _id: "$ACT_SECTION", count: { $sum: 1 } } }, { $sort: { count: -1 } }]);
	const keys = await collection.aggregate([{ $match: { "RANGE_NAME": req.params['RANGE_NAME'] } }, { $group: { _id: "$DISTRICT" } }, { $sort: { _id: 1 } }]);
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
		vals.push({ _id: crimeHeads[crime].key, count: Math.round(100 * crimeCount / (denominator * 1.0)) / 100 });
	}
	res.json([vals, keys]);
}));

router.get('/:ZONE_NAME/:RANGE_NAME/:DISTRICT', asyncHandler(async (req, res, next) => {
	var db = req.db;
	var collection = db.get("firdata");
	const denominator = await collection.count({ "DISTRICT": req.params['DISTRICT'] });
	const data = await collection.aggregate([{ $match: { "DISTRICT": req.params['DISTRICT'] } }, { $unwind: "$ACT_SECTION" }, { $group: { _id: "$ACT_SECTION", count: { $sum: 1 } } }, { $sort: { count: -1 } }]);
	const keys = await collection.aggregate([{ $match: { "DISTRICT": req.params['DISTRICT'] } }, { $group: { _id: "$PS" } }, { $sort: { _id: 1 } }]);
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
		vals.push({ _id: crimeHeads[crime].key, count: Math.round(100 * crimeCount / (denominator * 1.0)) / 100 });
	}
	res.json([vals, keys]);
}));

router.get('/:ZONE_NAME/:RANGE_NAME/:DISTRICT/:PS', asyncHandler(async (req, res, next) => {
	var db = req.db;
	var collection = db.get("firdata");
	const denominator = await collection.count({ "PS": req.params['PS'] });
	const data = await collection.aggregate([{ $match: { "PS": req.params['PS'] } }, { $unwind: "$ACT_SECTION" }, { $group: { _id: "$ACT_SECTION", count: { $sum: 1 } } }, { $sort: { count: -1 } }]);
	const keys = await collection.aggregate([{ $match: { "PS": req.params['PS'] } }, { $group: { _id: "$PS" } }, { $sort: { _id: 1 } }]);
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
		vals.push({ _id: crimeHeads[crime].key, count: Math.round(100 * crimeCount / (denominator * 1.0)) / 100 });
	}
	res.json([vals, keys]);
}));

module.exports = router;
