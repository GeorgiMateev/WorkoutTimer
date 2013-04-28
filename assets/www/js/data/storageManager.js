define(["jquery"],
    function ($) {
        function StorageManager() {

        }
        StorageManager.prototype = {
            getAllWorkouts: function (successCB, errorCB) {
                var db = window.sqlitePlugin.openDatabase({ name: "workouts" });
                console.log("db opened");

                db.transaction(
                    function (tx) {
                        var sql = "SELECT * FROM Workouts";
                        tx.executeSql(sql, [], function (tx, results) {
                            var len = results.rows.length;
                            var workouts = [];
                            for (var i = 0; i < len; i++) {
                                workouts[i] = results.rows.item(i);
                            }
                            console.log("transaction success");
                            successCB(workouts);

                        });
                    },
                    function (tx, error) {
                        console.log("transaction error");
                        errorCB(error);
                    }
                );
                //var w = [{ "_id": 1, "Name": "Tabata", "Description": "bla-bla" }, { "_id": 2, "Name": "Boi", "Description": "blasas-bla"}];
                //successCB(w);
            },

            getWorkout: function (id, successCB, errorCB) {
                var db = window.sqlitePlugin.openDatabase({ name: "workouts" });
                console.log("db opened");

                db.transaction(
                    function (tx) {
                        var sql = "SELECT * FROM Workouts WHERE _id=" + id;
                        tx.executeSql(sql, [], function (tx, results) {
                            var len = results.rows.length;
                            if (len == 0) {
                                alert("Workout with id: " + id + "not found!");
                            }

                            var workout = results.rows.item(0);

                            console.log("transaction success");
                            successCB(workout);
                        });
                    },
                    function (tx, error) {
                        console.log("transaction error");
                        errorCB(error);
                    }
                );
                //var w;
                //if (id == 1) {
                //    w = { "_id": 1, "Name": "Tabata", "Description": "bla-bla" }
                //}
                //if (id == 2) {
                //    w = { "_id": 2, "Name": "Boi", "Description": "blaasasasas-bla" }
                //}

                //successCB(w);
            },

            createWorkout: function (model, successCB, errorCB) {
                //setTimeout(function () { successCB(2) }, 5000);
                var db = window.sqlitePlugin.openDatabase({ name: "workouts" });
                console.log("db opened");

                db.transaction(
                    function (tx) {
                        var sql = "INSERT INTO Workouts (Name, Description) VALUES('" + model.Name + "','" + model.Description + "')";
                        tx.executeSql(sql, [], function (tx, results) {
                            console.log("ierted wow id: "+ results.insertId);
                            successCB(results.insertId);
                        });
                    },
                    function (tx, error) {
                        console.log("transaction error");
                        errorCB(error);
                    }
                );

            }
        };

        return StorageManager;
    }
);