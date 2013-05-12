define(["jquery", "backbone"],
    function ($, Backbone) {
        function Timer() {
            this.isRunning = false;
            this.progressSec = 0;
            this.start = 0;
            this.interval = 0;
            this.callback = null;
            this.pausedAt = 0;

            this.jsTimerObject = null;

            this.reset();
        }
        Timer.prototype = {
            setInterval: function (intervalSec, callback) {
                var self = this;
                this.start = new Date().getTime();
                this.interval = intervalSec;
                this.callback = callback;
                this.isRunning = true;

                this.jsTimerObject = window.setTimeout(function () {
                    self.setIntervalInternal(intervalSec, callback)
                }, 1000);
            },

            setIntervalInternal: function (intervalSec, callback) {
                var self = this;
                this.progressSec++;

                var completed = this.progressSec == intervalSec;
                callback(this.progressSec, completed);

                if (completed) { this.isRunning = false; return; }

                var difference = (new Date().getTime() - this.pausedAt - this.start) - this.progressSec * 1000;

                this.jsTimerObject = window.setTimeout(function () {
                    self.setIntervalInternal(intervalSec, callback)
                }, 1000 - difference);
            },

            reset: function () {
                if (this.jsTimerObject) {
                    window.clearTimeout(this.jsTimerObject);
                }

                this.isRunning = false;
                this.progressSec = 0;
                this.start = 0;
                this.interval = 0;
                this.callback = null;
                this.pausedAt = 0;
                
                this.jsTimerObject = null;
            },

            pause: function () {
                if (this.jsTimerObject) {
                    window.clearTimeout(this.jsTimerObject);
                }
                this.pausedAt = new Date().getTime();
                this.isRunning = false;
            },

            resume: function () {
                var self = this;

                this.isRunning = true;
                this.jsTimerObject = window.setTimeout(function () {
                    self.setIntervalInternal(self.interval, self.callback)
                }, 1000);
            }
        };

        return Timer;
    });