var express = require('express');
var router = express.Router();

router.get('/', function(req,res){
	var db = req.db;
	var collection = db.get("firdata");
	collection.aggregate([{$match:{"RECOVERED_VALUE": {$gt: 0}}}, {$group:{_id: "$ZONE_NAME", "count": {$sum: "$RECOVERED_VALUE"}}},{$sort:{_id:1}}], function(e,count){
		collection.aggregate([{$group: {_id: "$ZONE_NAME"}}], function(e, keys){
			res.json([count, keys]);
		});
	});
});

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

module.exports = router;
