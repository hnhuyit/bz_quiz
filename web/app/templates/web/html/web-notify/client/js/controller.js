angular.module('Notify')
    .controller("NotifyController", NotifyController);

function NotifyController($scope, $filter, NotifyService, PubSub) {

    $scope.messages = [];

    var findIndexOfMessage = function(message) {
        return $scope.messages.findIndex(function(element, index, array) {
            //console.log('message id :'+ message._id);
            if (element._id == message._id) {
                return true;
            }
            return false;
        });
    }

    var onMessages = function(data) {
        console.log(data);
        $scope.messages = data;
        $scope.$apply();
    };

    var onMessageCreated = function(message) {
        $scope.messages.push(message);
        $scope.action = "Created: " + message.title;
        $scope.$apply();
    }
    var onMessageDeleted = function(message) {
        console.log(message);
        $scope.action = "Deleted: " + message.title;
        var index = findIndexOfMessage(message);
        console.log(index);
        $scope.messages.splice(index, 1);
        $scope.$apply();
    }
    var onMessageUpdated = function(message) {
        console.log(message);
        $scope.action = "Updated: " + message.title;
        var index = findIndexOfMessage(message);
        $scope.messages[index] = message;
        $scope.$apply();
    }
    var onPriceUpdated = function(message) {
        console.log(message);
        $scope.action = "Updated: " + message.title;
        var index = findIndexOfMessage(message);
        $scope.messages[index] = message;
        $scope.$apply();
    }
    var onRoomJoined = function(data) {
        console.log("Join Room: " + data.room);
        $scope.action = "Join Room: " + data.room;
        $scope.$apply();

        //listening message after join room
        //get messages
        var options = { collectionName: 'messages', action: 'all' };
        PubSub.publish(options, onMessages); //emit
        //listening message change by other user
        PubSub.subscribe({ collectionName: 'message', action: 'created' }, onMessageCreated); //on
        PubSub.subscribe({ collectionName: 'message', action: 'deleted' }, onMessageDeleted);
        PubSub.subscribe({ collectionName: 'message', action: 'updated' }, onMessageUpdated);


        PubSub.subscribe({ collectionName: 'product', action: 'priceUpdated' }, onPriceUpdated);

    }
    $scope.totalMessage = 0;


    //join room
    //var rooms = ['notification','product-1'];
    $scope.joinRoom = function() {
        var rooms = $scope.myrooms;
        var options = { collectionName: 'room', action: 'join' };
        PubSub.publish(options, { roomId: rooms }, onRoomJoined);
    }

    $scope.deleteMessage = function() {

    }
    $scope.updateMessage = function() {

    }
    $scope.newMessage = function() {

    }
};