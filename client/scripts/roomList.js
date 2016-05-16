var roomList = angular.module('roomList', []);

roomList.controller('roomController', ['$scope', '$location', 'roomList', function($scope, $location, roomList) {    
    $scope.currentroom = roomList;    
    
    
    
}])

roomList.factory("roomList", function() {
    var roomInfo = {};
    function getQueryVariable(variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
    roomInfo.current = getQueryVariable("room");
   
    
    return roomInfo;
})
