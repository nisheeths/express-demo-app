var express = require('express');
var router = express.Router();
var asyncHandler = require('express-async-handler');
require('../utils/helpers')();


router.get('/:FROM_YEAR/:FROM_MONTH/:TO_YEAR/:TO_MONTH', asyncHandler(async (req, res, next) => {
	var db = req.db;
	var collection = db.get("complaints");
	var data = await collection.aggregate(
		[
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
				$group:
				{
					_id: {
						var1: "$PENDING",
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
			count: getPendingComplaints(data, names[n])
		});
		keys.push({
			_id: names[n]
		});
	}
	res.json([output, keys]);
}));

router.get('/:ZONE_NAME/:FROM_YEAR/:FROM_MONTH/:TO_YEAR/:TO_MONTH', asyncHandler(async (req, res, next) => {
	var db = req.db;
	var collection = db.get("complaints");
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
				$group:
				{
					_id: {
						var1: "$PENDING",
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
			count: getPendingComplaints(data, names[n])
		});
		keys.push({
			_id: names[n]
		});
	}
	res.json([output, keys]);
}));

router.get('/:ZONE_NAME/:RANGE_NAME/:FROM_YEAR/:FROM_MONTH/:TO_YEAR/:TO_MONTH', asyncHandler(async (req, res, next) => {
	var db = req.db;
	var collection = db.get("complaints");
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
				$group:
				{
					_id: {
						var1: "$PENDING",
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
			count: getPendingComplaints(data, names[n])
		});
		keys.push({
			_id: names[n]
		});
	}
	res.json([output, keys]);
}));

router.get('/:ZONE_NAME/:RANGE_NAME/:DISTRICT/:FROM_YEAR/:FROM_MONTH/:TO_YEAR/:TO_MONTH', asyncHandler(async (req, res, next) => {
	var db = req.db;
	var collection = db.get("complaints");
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
				$group:
				{
					_id: {
						var1: "$PENDING",
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
			count: getPendingComplaints(data, names[n])
		});
		keys.push({
			_id: names[n]
		});
	}
	res.json([output, keys]);
}));


/*

router.get('/:FROM_YEAR/:FROM_MONTH/:TO_YEAR/:TO_MONTH', function (req, res) {
	var db = req.db;
	var collection = db.get("services");
	collection.aggregate([{ $group: { _id: "$ZONE_NAME", count: { $sum: "$COMPLAINT_TOTAL" } } }, { $sort: { _id: 1 } }], function (e, total) {
		collection.aggregate([{ $group: { _id: "$ZONE_NAME", count: { $sum: "$COMPLAINT_PENDING" } } }, { $sort: { _id: 1 } }], function (e, pending) {
			var output = JSON.parse(JSON.stringify(total));
			for (i = 0; i < total.length; i++) {
				output[i].count = 0.03;
				for (j = 0; j < pending.length; j++) {
					if (total[i]._id == pending[j]._id) {
						output[i].count = (pending[j].count * 1.0) / total[i].count;
						output[i].count = Math.round(100*output[i].count);
					}
				}
			}
			collection.aggregate([{ $group: { _id: "$ZONE_NAME" } }], function (e, keys) {
				res.json([output, keys]);
			});
		});
	});
});



router.get('/:ZONE_NAME/:FROM_YEAR/:FROM_MONTH/:TO_YEAR/:TO_MONTH', function (req, res) {
	var db = req.db;
	var collection = db.get("services");
	collection.aggregate([{ $match: { "ZONE_NAME": req.params['ZONE_NAME'] } }, { $group: { _id: "$RANGE_NAME", "count": { $sum: "$COMPLAINT_TOTAL" } } }, { $sort: { _id: 1 } }], function (e, total) {
		collection.aggregate([{ $match: { "ZONE_NAME": req.params['ZONE_NAME'] } }, { $group: { _id: "$RANGE_NAME", "count": { $sum: "$COMPLAINT_PENDING" } } }, { $sort: { _id: 1 } }], function (e, pending) {
			var output = JSON.parse(JSON.stringify(total));
			for (i = 0; i < total.length; i++) {
				output[i].count = 0.03;
				for (j = 0; j < pending.length; j++) {
					if (total[i]._id == pending[j]._id) {
						output[i].count = (pending[j].count * 1.0) / total[i].count;
						output[i].count = Math.round(100*output[i].count);
					}
				}
			}
			collection.aggregate([{ $match: { "ZONE_NAME": req.params['ZONE_NAME'] } }, { $group: { _id: "$RANGE_NAME" } }], function (e, keys) {
				res.json([output, keys]);
			});
		});
	});
});

router.get('/:ZONE_NAME/:RANGE_NAME/:FROM_YEAR/:FROM_MONTH/:TO_YEAR/:TO_MONTH', function (req, res) {
	var db = req.db;
	var collection = db.get("services");
	collection.aggregate([{ $match: { "RANGE_NAME": req.params['RANGE_NAME'] } }, { $group: { _id: "$DISTRICT", "count": { $sum: "$COMPLAINT_TOTAL" } } }, { $sort: { _id: 1 } }], function (e, total) {
		collection.aggregate([{ $match: { "RANGE_NAME": req.params['RANGE_NAME'] } }, { $group: { _id: "$DISTRICT", "count": { $sum: "$COMPLAINT_PENDING" } } }, { $sort: { _id: 1 } }], function (e, pending) {
			var output = JSON.parse(JSON.stringify(total));
			for (i = 0; i < total.length; i++) {
				output[i].count = 0.03;
				for (j = 0; j < pending.length; j++) {
					if (total[i]._id == pending[j]._id) {
						output[i].count = (pending[j].count * 1.0) / total[i].count;
						output[i].count = Math.round(100*output[i].count);
					}
				}
			}
			collection.aggregate([{ $match: { "RANGE_NAME": req.params['RANGE_NAME'] } }, { $group: { _id: "$DISTRICT" } }], function (e, keys) {
				res.json([output, keys]);
			});
		});
	});
});

router.get('/:ZONE_NAME/:RANGE_NAME/:DISTRICT/:FROM_YEAR/:FROM_MONTH/:TO_YEAR/:TO_MONTH', function (req, res) {
	var db = req.db;
	var collection = db.get("services");
	collection.aggregate([{ $match: { "DISTRICT": req.params['DISTRICT'] } }, { $group: { _id: "$PS", "count": { $sum: "$COMPLAINT_TOTAL" } } }, { $sort: { _id: 1 } }], function (e, total) {
		collection.aggregate([{ $match: { "DISTRICT": req.params['DISTRICT'] } }, { $group: { _id: "$PS", "count": { $sum: "$COMPLAINT_PENDING" } } }, { $sort: { _id: 1 } }], function (e, pending) {
			var output = JSON.parse(JSON.stringify(total));
			for (i = 0; i < total.length; i++) {
				output[i].count = 0.03;
				for (j = 0; j < pending.length; j++) {
					if (total[i]._id == pending[j]._id) {
						output[i].count = (pending[j].count * 1.0) / total[i].count;
						output[i].count = Math.round(100*output[i].count);
					}
				}
			}
			collection.aggregate([{ $match: { "DISTRICT": req.params['DISTRICT'] } }, { $group: { _id: "$PS" } }], function (e, keys) {
				res.json([output, keys]);
			});
		});
	});
});

*/

module.exports = router;
