define(["jquery", "backbone"],
    function ($, Backbone) {
        function Timer() {
            this.isRunning = false;
            this.progressSec = 0;
            this.progressSecInternal = 0;
            this.start = 0;
            this.interval = 0;
            this.callback = null;

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
                this.progressSecInternal++;

                var completed = this.progressSecInternal == intervalSec;
                callback(this.progressSec, completed);

                if (completed) { this.isRunning = false; return; }

                var difference = (new Date().getTime() - this.start) - this.progressSecInternal * 1000;
                //console.log("current: " + new Date().getTime());
                //console.log("diff: " + difference);
                //console.log("paused at: " + this.pausedAt);
                //console.log("started: "+ this.start);

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
                this.progressSecInternal = 0;
                this.start = 0;
                this.interval = 0;
                this.callback = null;
                this.pausedAt = 0;
                
                this.jsTimerObject = null;
            },

            stop: function () {
                this.reset();
            },

            pause: function () {
                if (this.jsTimerObject) {
                    window.clearTimeout(this.jsTimerObject);
                }
                this.isRunning = false;
            },

            resume: function () {
                var self = this;

                this.progressSecInternal = 0;
                this.isRunning = true;
                this.start = new Date().getTime();
                this.jsTimerObject = window.setTimeout(function () {
                    self.setIntervalInternal(self.interval - self.progressSec, self.callback)
                }, 1000);
            }
        };

        return Timer;
    });