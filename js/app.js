/**
 * Created by VenkatNag on 11/12/2017.
 */
var hack = angular.module('hack', ['ngRoute', 'ngSanitize']);
hack.controller('events', ['$scope', '$location', '$window','$http', function($scope, $location, $window,$http) {
    // var typeController = this;
    $scope.typedata = function () {
        $http.get('https://api.typeform.com/v1/form/CoImKd?key=55e00617d059ccba49ccce3b3bf2da03f9a46fc2&completed=true').then(function (response) {
        var data=response.data;
        $scope.responses = data.responses;
        })

        };

    $scope.pop=function () {
        $http.get('http://127.0.0.1:8081/userDetails',"success").then(function (response) {
            var details = response.data;
            console.log(details);
            $scope.results = details;
        })
    }

    $scope.insert=function () {
        var doc={
            'teamname':document.getElementById("name").value,
            'pptlink':document.getElementById("ppt").value,
            'githublink':document.getElementById("github").value,
            'youtubelink':document.getElementById("youtube").value,
            'emailid':document.getElementById("email").value
        };
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }
        $http.post('http://127.0.0.1:8081/reserve',doc).then(function (response) {
            var d = {};
            d.email = doc.emailid;
            console.log(doc.emailid);
            $('#exampleModal').modal('hide');
            $http.post('http://127.0.0.1:8081/push',d).then(function (response) {
                console.log(response.data);
            });
            $scope.pop();

        });

        }
    $scope.typedata();
    $scope.pop();

    }


]);

