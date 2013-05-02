define(["jquery", "backbone", "collections/setsCollection", "data/storageManager"],
	function ($, Backbone, SetsCollection, StorageManager) {
	    var WorkoutModel = Backbone.Model.extend({
	        initialize: function () {
	            this.setsCollection = new SetsCollection([], {});
	        },

	        idAttribute: "_id",

	        sync: function (method, model, options) {
	            console.log("sync with method: " + method);

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
	            }

	            if (method == "update") {
	                manager.updateWorkout(model.toJSON(),
                    function (updateId) {
                        options.success(self, updateId, options);
                        deferred.resolve();
                    },
                    function (error) {
                        alert(error);
                        deferred.resolve();
                    });
	            }

	            if (method == "delete") {
	                manager.deleteWorkout(options.id,
                    function (result) {
                        options.success(self, result, options);
                        deferred.resolve();
                    },
                    function (error) {
                        alert(error);
                        deferred.resolve();
                    });
	            }

	            return deferred;
	        }
	    });

	    return WorkoutModel;
	});