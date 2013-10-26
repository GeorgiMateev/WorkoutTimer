define(["jquery",
    "backbone",
    "models/workoutModel",
    "models/setModel",
    "models/timerModel",
    "collections/workoutsCollection",
    "views/workoutsView",
    "views/workoutDetailsView",
    "views/workoutFormView",
    "views/setFormView",
    "views/setDetailsView",
    "views/timerView",
    "jquerymobile"],

	function ($, Backbone, WorkoutModel, SetModel, TimerModel, WorkoutsCollection, WorkoutsView, WorkoutDetailsView, WorkoutFormView, SetFormView, SetDetailsView, TimerView) {
	    var AppRouter = Backbone.Router.extend({
	        initialize: function () {
	            var self = this;

	            var workoutsCollection = new WorkoutsCollection([], {});

	            this.workoutsView = new WorkoutsView({
	                el: "#workouts-view",
	                collection: workoutsCollection
	            });

	            this.workoutDetailsView = new WorkoutDetailsView({
	                el: "#workout-details",

	                //if a model is deleted, it has to be removed from the collection
	                collection: workoutsCollection
	            });

	            this.workoutFormView = new WorkoutFormView({
	                el: "#workout-form",

                    //the crated models are added to this collection
	                collection: workoutsCollection
	            });

	            this.setFormView = new SetFormView({
	                el: "#set-form",
	            });

	            this.setDetailsView = new SetDetailsView({
	                el: "#set-details",
	            });

	            this.timerView = new TimerView({
	                el: "#timer-view",
                    model: new TimerModel()
	            });	            

	            Backbone.history.start();
	        },

	        routes: {
	            "": "home",
	            "workoutDetails?:id": "workoutDetails",
	            "createWorkout": "createWorkout",
	            "editWorkout?:id": "editWorkout",
	            "createSet?:id": "createSet",
	            "setDetails?id=:id&w=:workoutId": "setDetails",
	            "editSet?id=:id&w=:workoutId": "editSet",
                "startWorkout?:id": "startWorkout"
	        },

	        home: function () {
	            var self = this;
	            $.mobile.loading("show");

	            var deferred = $.Deferred();

	            if (!this.workoutsView.collection.isFetched) {
	                this.workoutsView.collection.fetch().done(function () {
	                    deferred.resolve();
	                });
	            }
	            else deferred.resolve();

	            deferred.done(function () {
	                $.mobile.changePage("#workouts-view", { reverse: false, changeHash: false });

	                self.workoutsView.render();

	                $(".wotActionsButton").click(function (event) {
	                    console.log("actions button clicked");
	                    var id = $(this).attr('id');
	                    $("#menu-" + id).popup("option", "positionTo", "#" + id);
	                    $("#menu-" + id).popup("open", { transition: "slide" });
	                });

	                $.mobile.loading("hide");
	            });
	        },

	        createWorkout: function () {

	            this.workoutFormView.changeModel(new WorkoutModel());
	            this.workoutFormView.mode = "create";

	            $.mobile.changePage("#workout-form", { reverse: false, changeHash: false });
	            this.workoutFormView.render();
	        },

	        workoutDetails: function (id) {
	            $.mobile.loading("show");
	            var self = this;

	            var deferred = $.Deferred();

	            var workoutModel = this.workoutsView.collection.get(id);

	            if (!workoutModel.setsCollection.isFetched) {
	                workoutModel.setsCollection.fetch({ "workoutId": id })
                    .done(function () {
                        deferred.resolve();
                    });
	            }
	            else deferred.resolve();

	            deferred.done(function () {
	                self.workoutDetailsView.changeModel(workoutModel);

	                $.mobile.changePage("#workout-details", { reverse: false, changeHash: false });
	                self.workoutDetailsView.render();

	                $.mobile.loading("hide");
	            });
	        },

	        editWorkout: function (id) {
	            $.mobile.loading("show");

	            this.workoutFormView.mode = "edit";

	            var workoutModel = this.workoutsView.collection.get(id);

	            this.workoutFormView.changeModel(workoutModel);

	            $.mobile.changePage("#workout-form", { reverse: false, changeHash: false });
	            this.workoutFormView.render();

	            $.mobile.loading("hide");
	        },

	        createSet: function (id) {
	            this.setFormView.mode = "create";

	            this.setFormView.changeModel(new SetModel());
	            this.setFormView.model.set("Workout_id", id);

	            var workoutModel = this.workoutsView.collection.get(id);
	            this.setFormView.set_collection(workoutModel.setsCollection);

	            $.mobile.changePage("#set-form", { reverse: false, changeHash: false });
	            this.setFormView.render();
	        },

	        setDetails: function (id, workoutId) {
	            $.mobile.loading("show");

	            var workoutModel = this.workoutsView.collection.get(workoutId);
	            var setModel = workoutModel.setsCollection.get(id);

	            this.setDetailsView.changeModel(setModel);
	            this.setDetailsView.set_collection(workoutModel.setsCollection);

	            $.mobile.changePage("#set-details", { reverse: false, changeHash: false });

	            this.setDetailsView.render();

	            $.mobile.loading("hide");
	        },

	        editSet: function (id, workoutId) {
	            $.mobile.loading("show");

	            this.setFormView.mode = "edit";

	            var workoutModel = this.workoutsView.collection.get(workoutId);
	            var setModel = workoutModel.setsCollection.get(id);

	            this.setFormView.changeModel(setModel);
	            this.setFormView.set_collection(workoutModel.setsCollection);

	            $.mobile.changePage("#set-form", { reverse: false, changeHash: false });
	            this.setFormView.render();

	            $.mobile.loading("hide");
	        },

	        startWorkout: function (id) {
	            $.mobile.loading("show");
	            var self = this;
	            this.timerView.model.fetch({ "id": id }).done(function () {
	                $.mobile.changePage("#timer-view", { reverse: false, changeHash: false });

	                $.mobile.loading("hide");

                    //TODO: retrieve this variables from config or db
	                var vibrateMs = 2000;
	                var path = window.app.getPhoneGapFilePath();
	                var src = path + "res/media/BoxingBell.mp3";
	                
	                self.timerView.model.startTimer(true, function () {
	                    var deferred = $.Deferred();
	                    
	                    navigator.notification.vibrate(vibrateMs);
	                    var media = new Media(src, function () {
	                        deferred.resolve();
	                    });
	                    media.play();

	                    return deferred;
	                });
	            })
	            .fail(function () {
	                self.navigate("workoutDetails?" + id, { trigger: true, replace: true });
	            });
	        }
	    });

	    return AppRouter;
	}
);