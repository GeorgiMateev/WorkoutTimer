define(["jquery", "backbone", "data/storageManager"],
	function ($, Backbone, StorageManager) {
	    var WorkoutModel = Backbone.Model.extend({
	        idAttribute: "_id",

	        sync: function (method, model, options) {
	            var manager = new StorageManager();
	            var deferred = $.Deferred();
	            var self = this;

	            if (method == "read") {
	                manager.getWorkout(options.id,
                    function (result) {
                        options.success(self, result, options);
                        deferred.resolve();
                    },
                    function (error) {
                        alert(error);
                        deferred.resolve();
                    });

	                return deferred;
	            }

	            if (method == "create") {
	                manager.createWorkout(model.toJSON(),
                    function (insertId) {
                        model.set("_id", insertId);
                        options.success(self, insertId, options);
                        deferred.resolve();
                    },
                    function (error) {
                        alert(error);
                        deferred.resolve();
                    });

	                return deferred;
	            }
	        }
	    });

	    return WorkoutModel;
	});