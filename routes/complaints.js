var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
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
					}
				}
			}
			collection.aggregate([{ $group: { _id: "$ZONE_NAME" } }], function (e, keys) {
				res.json([output, keys]);
			});
		});
	});
});


router.get('/:ZONE_NAME', function (req, res) {
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
					}
				}
			}
			collection.aggregate([{ $match: { "ZONE_NAME": req.params['ZONE_NAME'] } }, { $group: { _id: "$RANGE_NAME" } }], function (e, keys) {
				res.json([output, keys]);
			});
		});
	});
});

router.get('/:ZONE_NAME/:RANGE_NAME', function (req, res) {
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
					}
				}
			}
			collection.aggregate([{ $match: { "RANGE_NAME": req.params['RANGE_NAME'] } }, { $group: { _id: "$DISTRICT" } }], function (e, keys) {
				res.json([output, keys]);
			});
		});
	});
});

router.get('/:ZONE_NAME/:RANGE_NAME/:DISTRICT', function (req, res) {
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
					}
				}
			}
			collection.aggregate([{ $match: { "DISTRICT": req.params['DISTRICT'] } }, { $group: { _id: "$PS" } }], function (e, keys) {
				res.json([output, keys]);
			});
		});
	});
});


module.exports = router;
