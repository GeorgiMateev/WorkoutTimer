define(["jquery", "backbone", "data/storageManager"],
	function ($, Backbone, StorageManager) {
	    var SetModel = Backbone.Model.extend({
	        idAttribute: "_id",

	        sync: function (method, model, options) {
	            console.log("sync with method: " + method);

	            var manager = new StorageManager();
	            var deferred = $.Deferred();
	            var self = this;

	            if (method == "create") {
	                manager.createSet(model.toJSON(),
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

	            return deffered;
	        }
	    });

        return SetModel
	});