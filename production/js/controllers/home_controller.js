function init_dashboard() {
//    console.log("INIT DASHBOARD");
    $("#sidebar-menu").attr('data-apply', 1);
    $("#sidebar_html").show();
    $("#topbar_html").show();
    $("footer").show();
    init_sparklines();
    init_flot_chart();
    init_sidebar();
    init_wysiwyg();
    init_InputMask();
    init_JQVmap();
    init_cropper();
    init_knob();
    init_IonRangeSlider();
    init_ColorPicker();
    init_TagsInput();
    init_parsley();
    init_daterangepicker();
    init_daterangepicker_right();
    init_daterangepicker_single_call();
    init_daterangepicker_reservation();
    init_SmartWizard();
    init_EasyPieChart();
    init_charts();
    init_echarts();
    init_morris_charts();
    init_skycons();
    init_select2();
    init_validator();
    init_DataTables();
    init_chart_doughnut();
    init_gauge();
    init_PNotify();
    init_starrr();
    init_calendar();
    init_compose();
    init_CustomNotification();
    init_autosize();
    init_autocomplete();
}
function clearSession() {
    localStorage.clear();
    sessionStorage.clear();
    var cookies = document.cookie;

    for (var i = 0; i < cookies.split(";").length; ++i)
    {
        var myCookie = cookies[i];
        if (myCookie != undefined) {
            var pos = myCookie.indexOf("=");
            var name = pos > -1 ? myCookie.substr(0, pos) : myCookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }
}
Ctrl
        .controller("LoginCtrl", function ($scope, $rootScope, $location, $cookies, $cookieStore, LoginFactory, $timeout) {
            $rootScope.pageTitle = "Identification";
            $("#sidebar_html").hide();
            $("#topbar_html").hide();
            $("footer").hide();
            $scope.logout = function () {
                sessionStorage.removeItem('connected');
                $timeout(function () {
//                    console.log($scope);
                    $scope.$apply(function () {
                        $location.path('/login');
                        $("#sidebar_html").hide();
                        $("#topbar_html").hide();
                        $("footer").hide();
                    });
                }, 500);
                clearSession();
            };
            $scope.loginAction = function ($event) {
                $event.preventDefault();
//                console.log($scope);
                var oldValLogin = $("#loginBtn").val();
                $("#loginBtn").val("Chargement...").attr('disabled', true);
                LoginFactory.loginAction($scope.User, oldValLogin)
                        .then(function (response) {
                            $("#loginBtn").val(oldValLogin).attr('disabled', false);
                            toastr.info(response.text);
                            $timeout(function () {
                                sessionStorage.setItem('connected', true);
                                $scope.$apply(function () {
                                    $location.path('/dashboard');
                                    init_dashboard();
                                });
                            }, 500);
                        },
                                function (data) {
                                    console.log('error');
                                    // Handle error here
                                });
            };
        })
        .controller("HomeCtrl", function ($scope, $rootScope, $cookies, $cookieStore, HomeFactory) {
            $rootScope.pageTitle = "Tableau de bord";
        });