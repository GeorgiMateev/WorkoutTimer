define(["jquery", "backbone", "data/storageManager"],
	function ($, Backbone, StorageManager) {
	    var SetModel = Backbone.Model.extend({
	        initialize : function () {
	            this.initDurationDisplayValue();
	        },

	        idAttribute: "_id",

	        initDurationDisplayValue: function () {
	            var duration = this.get("Duration");
	            
	            var value = this.getTimeDisplayString(duration);

	            this.set("DurationDisplayValue", value);

	            return value;
	        },

	        parseTime: function (duration) {
	            var parts = duration.split(":");

	            var minutes = parseInt(parts[0]);
	            var seconds = parseInt(parts[1]);

	            var duration = minutes * 60 + seconds;
	            return duration;
	        },

	        getTimeDisplayString : function (time) {
	            var minutes = Math.floor(time / 60);
	            var seconds = time % 60;

	            var minStr = minutes.toString().length == 2 ? minutes : "0" + minutes;
	            var secStr = seconds.toString().length == 2 ? seconds : "0" + seconds;

	            var value = minStr + ":" + secStr;
	            return value;
	        },

	        validate: function (attrs, options) {
	            var errors = [];

	            if (attrs.Name.length == 0) {
	                options.error();
	                errors.push({ field: "Name", message: "Enter name" });
	            }

	            var regex = new RegExp("\\D");
	            var notInteger = regex.test(attrs.Duration);

	            console.log("notInteger: " + notInteger);

	            if (notInteger || attrs.Duration <= 0) {
	                options.error();
	                errors.push({ field: "Duration", message: "Enter integer greater than zero" });
	            }

	            if (errors.length > 0) {
	                return errors;
	            }	            
	        },

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

	            if (method == "update") {
	                manager.updateSet(model.toJSON(),
                    function (updateId) {                        
                        options.success(self, updateId, options);
                        deferred.resolve();
                    },
                    function (error) {
                        alert(error);
                        deferred.resolve();
                    });
	            }

	            if (method == "read") {
	                manager.getSet(options.id,
                        function (result) {                            
                            options.success(self, result, options);
                            model.initDurationDisplayValue();
                            deferred.resolve();
                        },
                        function (error) {
                            alert(error);
                            deferred.resolve();
                        });
	            }

	            if (method == "delete") {
	                manager.deleteSet(options.id,
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

        return SetModel
	});