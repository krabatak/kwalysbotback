factories
        .factory('HomeFactory', function ($http, $q, $timeout) {
            var factory = {
                products: false,
                post: false,
                initDashboard: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "pages/dashboard";
                    $http.post(url)
                            .success(function (response, status) {
                                factory.kpis = response;
                                $timeout(function () {
                                    deferred.resolve(factory.kpis);
                                }, 1);

                            }).error(function (data, status) {
                        console.log(data);
                        //deferred.reject('impossible !!!');
                    });
                    return deferred.promise;
                }
            };
            return factory;
        })
        .factory('LoginFactory', function ($http, $q, $timeout) {
            var factory = {
                products: false,
                post: false,
                loginAction: function (dataUser, txtBtnLogin) {
                    var deferred = $q.defer();
                    var url = api_url() + "users/login";
                    $http.post(url, dataUser)
                            .success(function (response, status) {
                                factory.user = response;
                                $timeout(function () {
                                    deferred.resolve(factory.user);
                                }, 1);

                            }).error(function (data, status) {
                        $("#loginBtn").val(txtBtnLogin).attr('disabled', false);

                        toastr.error("Erreur serveur");
                        //deferred.reject('impossible !!!');
                    });
                    return deferred.promise;
                }
            };
            return factory;
        });