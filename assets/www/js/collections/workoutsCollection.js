define(["jquery", "backbone", "models/workoutModel", "data/storageManager"],
	function ($, Backbone, WorkoutModel, StorageManager) {
	    var WorkoutsCollection = Backbone.Collection.extend({
	        initialize: function (models, options) {
	        },

	        model: WorkoutModel,

	        sync: function (method, model, options) {
	            var self = this;
	            var deferred = $.Deferred();

	            var manager = new StorageManager();
	            manager.getAllWorkouts(
                function (result) {
	                options.success(self, result, options);
	                self.trigger("added");
	                deferred.resolve();
	            },
                function(error){
                    alert(error)
                });

	            return deferred;
	        }
	    });

	    return WorkoutsCollection;
	});