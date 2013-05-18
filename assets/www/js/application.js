define(["jquery", "appRouter", "backbone"], 
	function($, AppRouter, Backbone){
		function Application () {
		}
		Application.prototype = {
		    initialize: function () {
		        //this.app_router = new AppRouter();

		        this.bindEvents();
		    },

		    bindEvents: function () {
		        document.addEventListener('deviceready', this.onDeviceReady, false);
		    },

		    onDeviceReady: function () {
		        //this.app_router.on("route:showWorkout", function (id) {
		        //	alert("workout: " + id);
		        //});
		    },

		    getPhoneGapFilePath: function () {
		        var path = window.location.pathname;
		        path = path.substr(path, path.length - 10);
		        return 'file://' + path;
		    }
		};
		
		return Application;
	}
);
