factories
        .factory('BotsFactory', function ($http, $q, $timeout) {
            var factory = {
                products: false,
                post: false,
                saveBot: function (dataBot) {
                    var deferred = $q.defer();
                    var url = api_url() + "bots/save_bot";
                    $http.post(url, dataBot)
                            .success(function (response, status) {
                                factory.response = response;
                                $timeout(function () {
                                    deferred.resolve(factory.response);
                                }, 1);

                            }).error(function (data, status) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                },
                getBotByID: function (idBot) {
                    var deferred = $q.defer();
                    var url = api_url() + "bots/getbotbyid";
                    $http.post(url, {Bot: {id: idBot}})
                            .success(function (response, status) {
                                factory.response = response;
                                $timeout(function () {
                                    deferred.resolve(factory.response);
                                }, 1);

                            }).error(function (data, status) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                },
                getTreeBotByID: function (idBot) {
                    var deferred = $q.defer();
                    var url = api_url() + "bots/getbottreebyid";
                    $http.post(url, {Bot: {id: idBot}})
                            .success(function (response, status) {
                                factory.response = response;
                                $timeout(function () {
                                    deferred.resolve(factory.response);
                                }, 1);

                            }).error(function (data, status) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                },
                updateEvent: function (modelTree) {
                    var deferred = $q.defer();
                    var url = api_url() + "bots/update_tree";
                    $http.post(url, modelTree)
                            .success(function (response, status) {
                                factory.response = response;
                                $timeout(function () {
                                    deferred.resolve(factory.response);
                                }, 1);

                            }).error(function (data, status) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                },
                getAllBots: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "bots/index";
                    $http.post(url)
                            .success(function (response, status) {
                                factory.response = response;
                                $timeout(function () {
                                    deferred.resolve(factory.response);
                                }, 1);

                            }).error(function (data, status) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                },
            };
            return factory;
        });