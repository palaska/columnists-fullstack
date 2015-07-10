'use strict';

angular.module('columnistsFullstackApp')
  .controller('MainCtrl', function($scope, $http) {
    $scope.allWriters = [];
    $scope.today = new Date().toJSON().slice(0, 10);

    $scope.query = '';
    $scope.addedNewspapers = ['Hürriyet', 'Cumhuriyet', 'Habertürk', 'Vatan', 'Milliyet', 'Sözcü', 'Akşam', 'Star', 'Zaman', 'Bugün', 'T24'];

    $scope.filterByNewspaper = function(writer) {
      return ($scope.addedNewspapers.indexOf(writer.lastarticlesnewspaper) !== -1);
    };

    $http.get('/api/writers').success(function(allWriters) {
      $scope.allWriters = allWriters;
      for (var i = 0; i < $scope.allWriters.length; i++) {
        if ($scope.today == $scope.allWriters[i].lastarticlesdate) {
          $scope.allWriters[i].isUpdated = "updated";
        } else {
          $scope.allWriters[i].isUpdated = "";
        }
      }
    });

    $scope.addWriter = function() {
      if ($scope.newWriter === '') {
        return;
      }
      $http.post('/api/writers', {
        name: $scope.newWriter
      });
      $scope.newWriter = '';
    };

    $scope.deleteWriter = function(writer) {
      $http.delete('/api/writers/' + writer._id);
    };


    $scope.selection = [];
    $scope.selectedWriters = [];

    $scope.toggle = function(idx) {
      var pos = $scope.selection.indexOf($scope.allWriters.indexOf($scope.filteredWriters[idx]));
      if (pos == -1) {
        $scope.selection.push($scope.allWriters.indexOf($scope.filteredWriters[idx]));
        $scope.selectedWriters.push($scope.filteredWriters[idx]);
      } else {
        $scope.selection.splice(pos, 1);
        $scope.selectedWriters.splice(pos, 1);
      }
      console.log($scope.selection);
    };

    $scope.remove = function(idx) {
      $scope.selection.splice(idx, 1);
      $scope.selectedWriters.splice(idx, 1);
    };

    $scope.pressSend = function() {
      console.log("pressSend");
      if ($scope.emailaddress && $scope.selectedWriters.length != 0) {
        swal("Gönderme tamamlandı!", "Seçtiğiniz köşe yazarlarının yazıları \"" + $scope.emailaddress + "\" adresine gönderildi.", "success");
        $http.post('/api/forms', {
          emails: $scope.emailaddress,
          writers: $scope.selectedWriters
        });
      } else swal("Gönderme başarısız!", "Lütfen en az bir yazarı seçtiğinizden ve e-mail adresi girdiğinizden emin olun.", "error");
    };

  });
