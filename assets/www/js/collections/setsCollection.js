define(["jquery", "backbone", "models/setModel", "data/storageManager", "collections/setsCollection"],
	function ($, Backbone, SetModel, StorageManager, SetsCollection) {
	    var SetsCollection = Backbone.Collection.extend({
	        initialize: function (models, options) {
	            this.isFetched = false;
	        },

	        model: SetModel,

	        sync: function (method, model, options) {
	            var self = this;
	            var deferred = $.Deferred();

	            var manager = new StorageManager();
	            manager.getAllWorkoutSets(options.workoutId,
                function (result) {
                    options.success(self, result, options);
                    self.isFetched = true;
                    deferred.resolve();
                },
                function (error) {
                    alert(error)
                });

	            return deferred;
	        }
	    });

	    return SetsCollection;
	});