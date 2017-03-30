Ctrl
        .controller("ConversationCtrl", function ($scope, $rootScope, $location, $cookies, $cookieStore, ConversationFactory, $timeout) {
            var currentHash = document.location.hash;
            if (currentHash.search("#/conversations/index") > -1) {
                ConversationFactory.getRecentConversation()
                        .then(
                                function (response) {
                                    $scope.records = response.data;
                                },
                                function (error) {
                                    console.log(error);
                                });
            }
            if (currentHash.search("#/conversations/filtred") > -1) {

            }
        });