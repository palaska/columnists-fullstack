'use strict';

angular.module('columnistsFullstackApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.allWriters = [];

    $http.get('/api/writers').success(function(allWriters) {
      $scope.allWriters = allWriters.sort(function(a, b) {
        return a.name.localeCompare(b.name);
      });
    });

    $scope.addWriter = function() {
      if($scope.newWriter === '') {
        return;
      }
      $http.post('/api/writers', { name: $scope.newWriter });
      $scope.newWriter = '';
    };

    $scope.deleteWriter = function(writer) {
      $http.delete('/api/writers/' + writer._id);
    };

    $scope.filterWriters = '';

    $scope.selection = [];
    $scope.selectedWriters = [];
    
    $scope.toggle = function(idx){
        var pos = $scope.selection.indexOf(idx);
        if (pos == -1) {
            $scope.selection.push(idx);
            $scope.selectedWriters.push($scope.allWriters[idx]);
        } else {
            $scope.selection.splice(pos, 1);
            $scope.selectedWriters.splice(pos, 1);
        }
        console.log($scope.selectedWriters);
    };

    $scope.remove = function(idx){
        $scope.selection.splice(idx,1);
        $scope.selectedWriters.splice(idx,1);
    };

    $scope.pressSend = function(){
      console.log("pressSend");
      if($scope.emailaddress && $scope.selectedWriters.length != 0){
        swal("Gönderme tamamlandı!", "Seçtiğiniz köşe yazarlarının yazıları \""+$scope.emailaddress+"\" adresine gönderildi.", "success");
        $http.post('/api/forms', { emails:$scope.emailaddress, writers:$scope.selectedWriters });
      } else swal("Gönderme başarısız!", "Lütfen en az bir yazarı seçtiğinizden ve e-mail adresi girdiğinizden emin olun.", "error");
    };

});
