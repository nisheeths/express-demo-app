var express = require('express');
var router = express.Router();
var asyncHandler = require('express-async-handler');

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
				$match:
				{
					"RECOVERED_VALUE":
					 {
						 $gt: 0,
						 $lt: 1000000000
					}					
				}
			},
			{
				$group:
				{
					_id: "$ZONE_NAME",
					count: 
					 {
						 $sum: "$RECOVERED_VALUE"
					}
				}
			},
			{
				$sort: { _id: 1 }
			}
		]
	);
	var keys = [];
	for (d in data){
		data[d].count = Math.round(data[d].count/1000)/100;
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
				$match:
				{
					"RECOVERED_VALUE":
					 {
						 $gt: 0
					}
				}
			},
			{
				$group:
				{
					_id: "$RANGE_NAME",
					count: 
					 {
						 $sum: "$RECOVERED_VALUE"
					}
				}
			},
			{
				$sort: { _id: 1 }
			}
		]
	);
	var keys = [];
	for (d in data){
		data[d].count = Math.round(data[d].count/1000)/100;
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
				$match:
				{
					"RECOVERED_VALUE":
					 {
						 $gt: 0
					}
				}
			},
			{
				$group:
				{
					_id: "$DISTRICT",
					count: 
					 {
						 $sum: "$RECOVERED_VALUE"
					}
				}
			},
			{
				$sort: { _id: 1 }
			}
		]
	);
	var keys = [];
	for (d in data){
		data[d].count = Math.round(data[d].count/1000)/100;
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
				$match:
				{
					"RECOVERED_VALUE":
					 {
						 $gt: 0
					}
				}
			},
			{
				$group:
				{
					_id: "$PS",
					count: 
					 {
						 $sum: "$RECOVERED_VALUE"
					}
				}
			},
			{
				$sort: { _id: 1 }
			}
		]
	);
	var keys = [];
	for (d in data){
		data[d].count = Math.round(data[d].count/1000)/100;
		keys.push(data[d]._id);
	}

	res.json([data, keys]);
}));

/*
router.get('/:ZONE_NAME', function(req,res){
	var db = req.db;
	var collection = db.get("firdata");
 	collection.aggregate([{$match: {"ZONE_NAME": req.params['ZONE_NAME']}}, {$match:{"RECOVERED_VALUE": {$gt: 0}}}, {$group:{_id: "$RANGE_NAME", "count": {$sum: "$RECOVERED_VALUE"}}},{$sort:{_id:1}}], function(e, count){		
			collection.aggregate([{$match: {"ZONE_NAME": req.params['ZONE_NAME']}}, {$group: {_id: "$RANGE_NAME"} }], function(e, keys){
			  res.json([count, keys]);
			});	
  	});
});


router.get('/:ZONE_NAME/:RANGE_NAME', function(req,res){
	var db = req.db;
	var collection = db.get("firdata");
	collection.aggregate([{$match: {"RANGE_NAME": req.params['RANGE_NAME']}}, {$match:{"RECOVERED_VALUE": {$gt: 0}}}, {$group:{_id: "$DISTRICT", "count": {$sum: "$RECOVERED_VALUE"}}},{$sort:{_id:1}}], function(e,count){
		collection.aggregate([{$match: {"RANGE_NAME": req.params['RANGE_NAME']}}, {$group: {_id: "$DISTRICT"}}], function(e, keys){
			res.json([count, keys]);
		});
	});
});

router.get('/:ZONE_NAME/:RANGE_NAME/:DISTRICT', function(req,res){
	var db = req.db;
	var collection = db.get("firdata");
	collection.aggregate([{$match: {"DISTRICT": req.params['DISTRICT']}}, {$match:{"RECOVERED_VALUE": {$gt: 0}}}, {$group:{_id: "$PS", "count": {$sum: "$RECOVERED_VALUE"}}},{$sort:{_id:1}}], function(e,count){
		collection.aggregate([{$match: {"DISTRICT": req.params['DISTRICT']}}, {$group: {_id: "$PS"}}], function(e, keys){
			res.json([count, keys]);
		});
	});
});

*/

module.exports = router;
