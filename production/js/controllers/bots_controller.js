var orgChart;
function getNodeByClickedBtn(el) {
    //console.log(el.parentNode.parentNode);
    var ifExistId = $(el.parentNode.parentNode).attr('data-node-id');
    if (ifExistId !== undefined) {
        while (el.parentNode.parentNode) {
            el = el.parentNode.parentNode;
            //console.log(el.getAttribute("data-node-id"));
            if (el.getAttribute("data-node-id") !== undefined)
                return el;
        }
    }
    return null;
}

function initEditModal() {
    tinymce.init({
        selector: 'textarea#botResponse',
        height: 180,
        relative_urls: false,
        convert_urls: false,
        theme: 'modern',
        plugins: [
            'advlist autolink lists link image charmap print preview hr anchor pagebreak',
            'searchreplace wordcount visualblocks visualchars code fullscreen',
            'insertdatetime media nonbreaking save table contextmenu directionality',
            'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc'
        ],
        toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
        toolbar2: 'print preview media | forecolor backcolor emoticons | codesample',
        image_advtab: true,
        templates: [{
                title: 'Test template 1',
                content: 'Test 1'
            },
            {
                title: 'Test template 2',
                content: 'Test 2'
            }
        ],
        content_css: [
            '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
            '//www.tinymce.com/css/codepen.min.css'
        ]
    });
}

function submitNode() {
}

function init() {
    //console.log("init");
    var btns = document.getElementsByClassName("btnActionNode");
    for (var i = 0; i < btns.length; i++) {

        btns[i].addEventListener("click", function () {
            var nodeElement = getNodeByClickedBtn(this);
            var action = this.getAttribute("data-action");
            var id = 0;
            if (this.getAttribute("id") === "addNodeEvent") {
                id = null;
            } else {
                id = nodeElement.getAttribute("data-node-id") || null;
            }
            var node = orgChart.nodes[id];
            switch (action) {
                case "add":
                    var pid = id;
                    //console.log(node);
                    $.ajax({
                        url: api_url() + "bots/getNewObjectID",
                        type: "POST",
                        success: function (data, textStatus, jqXHR) {
                            var question = "Ce que l'utlisateur dit";
                            var reponse = "Ce que le bot répond";
                            var keyWords = "";
                            //console.log(orgChart.insertNode(pid, {Question: question, Réponse: reponse, Keywords: keyWords}, data.lastID));
                        }
                    });
                    break;
                case "edit":
                    $(".bs-example-modal-lg").attr('data-node-id', id);
                    $("#submitNode").attr('data-node-id', id);
                    var url = api_url() + "bots/getbotreponsebyid";
                    $.ajax({
                        url: url,
                        type: "POST",
                        data: {
                            Reponse: {
                                id: id
                            }
                        },
                        success: function (response) {
                            var parentID = response.data.Reponse.parentId || "";
                            $("#parentNodeSelect option[value='" + parentID + "']").attr('selected', 'selected');
                            $("#parentNodeSelect").val(parentID).trigger('change')
                            document.getElementById("keyWords").value = response.data.Reponse.extra_data;
                            document.getElementById("humainQuestion").value = response.data.Reponse.in_response_to;
                            tinyMCE.activeEditor.setContent(response.data.Reponse.text, {format: 'raw'});
                            $(".bs-example-modal-lg").modal("toggle");
                        }
                    });
                    break;
                case "delete":
                    orgChart.removeNode(id);
                    break;
            }
        });
    }
}
function draggable() {
    initEditModal();
    setTimeout(function () {
        init();
        $(".mce-notification-inner").parent().remove();
        $(document).on('focusin', function (e) {
            if ($(e.target).closest(".mce-window").length) {
                e.stopImmediatePropagation();
            }
        });
    }, 1000);
    //    $('div.ps-popup-outer').draggable();
}
Ctrl.controller("BotsCtrl", function ($scope, $rootScope, $timeout, $document, $window, $routeParams, $location, $cookies, $cookieStore, BotsFactory) {
    init_dashboard();
    var currentHash = document.location.hash;
    //List Bots function
    if (currentHash === "#/bots/index") {
        $scope.deleteBot = function ($event) {
            $event.preventDefault();
            $(".bs-example-modal-md").modal('toggle');
            //console.log($event.target);
            var botId = $event.target.getAttribute('data-botid');
            //console.log(botId);
            $("#modalDeleteBot").attr('data-botid', botId);

        };
        $scope.deleteBotSubmit = function ($event) {
            $event.preventDefault();
            $(".bs-example-modal-md").modal('toggle');
            var botId = $("#modalDeleteBot").attr('data-botid');
            var dataBot = {
                Bot: {
                    id: botId
                }
            };
            BotsFactory.deleteBot(dataBot)
                    .then(function (response) {
                        toastr.info(response.text);
//                        $(".bs-example-modal-md").modal('toggle');
                        BotsFactory.getAllBots()
                                .then(function (response) {
                                    $scope.records = response.data;
                                }, function (data) {
                                    toastr.error("Le serveur d'api ne répond pas");
                                })
                                .catch(function (fallback) {
                                    //console.log(fallback);
                                });
                    });

        };
        $rootScope.pageTitle = "Liste des bots";
        BotsFactory.getAllBots()
                .then(function (response) {
                    $scope.records = response.data;
                }, function (data) {
                    toastr.error("Le serveur d'api ne répond pas");
                })
                .catch(function (fallback) {
                    //console.log(fallback);
                });
    }
    if (currentHash.search("#/bots/tree-") > -1) {
        $scope.formatFirstName = function () {
            $scope.bot.first_name = "+" + $scope.bot.first_name;
        };
        new Clipboard('#copy-button');
        $rootScope.pageTitle = "Arbre des Q/R";
        var idBot = $routeParams.id;
        $scope.addNode = function ($event) {
            $event.preventDefault();
            BotsFactory.getNewObjectID()
                    .then(function (response) {
                        //console.log(response);
                        var question = "Ce que l'utlisateur dit";
                        var reponse = "Ce que le bot répond";
                        var keyWords = "";
                        orgChart.insertNode("", {Question: question, Réponse: reponse, Keywords: keyWords}, response.lastID);
//                        document.location.reload();
                    });
        };
        $scope.submitNode = function ($event) {
            var nodeID = $event.target.getAttribute('data-node-id');
            var node = orgChart.nodes[nodeID];
            var question = $("#humainQuestion").val();
            var reponse = tinyMCE.activeEditor.getContent();
            //console.log(reponse);
            var keyWords = $("#keyWords").val();
            var dataNode = {
                id: nodeID,
                text: question,
                in_response_to: reponse,
                extra_data: keyWords
            };
            //console.log(dataNode);
            //console.log(node);
            node.data.Keywords = keyWords;
            node.data.Question = question;
            node.data.Réponse = reponse.replace(/(<([^>]+)>)/ig, "");
            node.data.RéponseHtml = reponse;
//            node.data.Réponse = reponse;
            var pidNode = $("#parentNodeSelect :selected").val();
            //console.log(pidNode);
            orgChart.updateNode(node.id, pidNode, node.data);
            $(".bs-example-modal-lg").modal("toggle");
        };
        BotsFactory.getTreeBotByID(idBot)
                .then(function (response) {
                    $scope.botId = idBot;
                    $scope.botname = response.botname;
                    $scope.tree = response.data;
                    var organigramme = [];
                    angular.forEach($scope.tree, function (obj, index) {
                        var parentID = null;
                        if (obj.Reponse.parentId !== null && obj.Reponse.parentId !== undefined && obj.Reponse.parentId !== "null") {
                            parentID = obj.Reponse.parentId["$id"] || obj.Reponse.parentId;
                        }
                        organigramme.push({
                            id: obj.Reponse.id,
                            parentId: parentID,
                            Question: obj.Reponse.in_response_to,
                            Réponse: obj.Reponse.text.replace(/(<([^>]+)>)/ig, ""),
//                            Réponse: obj.Reponse.text,
                            Keywords: obj.Reponse.extra_data
                        });
                    });
                    if (organigramme.length > 0) {
                        orgChart = new getOrgChart(document.getElementById("people"), {
                            primaryFields: ["Réponse", "Question", "Keywords"],
                            theme: "monica",
                            linkType: "B",
                            enableEdit: false,
                            enableGridView: false,
                            enableDetailsView: false,
                            clickNodeEvent: function (sender, args) {
                                if (args.node !== undefined) {
                                    var idNode = args.node.id;
                                    var dataReponse = {
                                        Reponse: {
                                            id: idNode,
                                            bot_id: idBot
                                        }
                                    };
                                    BotsFactory.getParentNodes(dataReponse)
                                            .then(function (response) {
                                                $scope.parentNodes = response.data;
                                                $(".bs-example-modal-lg").removeAttr('tabindex');
                                                $("#parentNodeSelect").select2();
                                            });
                                }
                            },
                            insertNodeEvent: function (sender, args) {
                                console.log(args);
                                console.log(sender);
                                var idNode = args.node.id;
                                //console.log(idNode);
                                var question = "Ce que l'utlisateur dit";
                                var reponse = "Ce que le bot répond";
                                var keyWords = "";
                                var dataTree = {
                                    id: idNode,
                                    text: reponse,
                                    in_response_to: question,
                                    extra_data: keyWords,
                                    bot_id: $routeParams.id,
                                    parentId: args.node.pid || null
                                };
                                //console.log(dataTree);
                                BotsFactory.updateEvent(dataTree)
                                        .then(function (response) {
                                            toastr.info(response.text);
                                        },
                                                function (error) {
                                                    toastr.error("Le serveur d'api ne répond pas");
                                                });
                            },
                            removeNodeEvent: function (sender, args) {
                                var nodeID = args.id;
                                var r = confirm("êtes vous sûr ?");
                                if (r == true) {
                                    BotsFactory.deleteNode(nodeID)
                                            .then(function (response) {
                                                toastr.info(response.text);
                                            }, function (error) {
                                                toastr.error("Le serveur d'api ne répond pas");
                                            });
                                } else {
                                    return false;
                                }

                            },
                            updateNodeEvent: function (sender, args) {
                                //                                    //console.log(sender);
                                //console.log(args.node);
                                var idNode = null;
                                if (isNaN(args.node.id)) {
                                    idNode = args.node.id;
                                }
//                            var dataTree = {
//                                id: idNode,
//                                text: args.node.data.Réponse,
//                                in_response_to: args.node.data.Question,
//                                extra_data: args.node.data.Keywords,
//                                bot_id: $routeParams.id,
//                                parentId: args.node.pid || null
//                            };
                                var dataTree = {
                                    id: idNode,
                                    text: args.node.data.RéponseHtml,
                                    in_response_to: args.node.data.Question,
                                    extra_data: args.node.data.Keywords,
                                    bot_id: $routeParams.id,
                                    parentId: args.node.pid || null
                                };
//                            //console.log(dataTree);
                                BotsFactory.updateEvent(dataTree)
                                        .then(function (response) {
                                            //                                                //console.log(response);
                                            toastr.info(response.text);
                                            var idBot = $routeParams.id;
                                            var length = orgChart.config.dataSource;
                                            //console.log(orgChart.config.dataSource[length - 1]);
                                            //                                                orgChart.da
                                        },
                                                function (error) {
                                                    toastr.error("Le serveur d'api ne répond pas");
                                                });
                            },
                            updatedEvent: function (sender, args) {
                                init();
                            },
                            dataSource: organigramme
                        });
                    } else {
                        orgChart = new getOrgChart(document.getElementById("people"), {
                            primaryFields: ["Réponse", "Question", "Keywords"],
                            theme: "monica",
                            linkType: "B",
                            enableEdit: false,
                            enableGridView: false,
                            enableDetailsView: false,
                            insertNodeEvent: function (sender, args) {
                                console.log(sender);
                                //console.log(args.node);
                                var idNode = null;
                                if (isNaN(args.node.id)) {
                                    idNode = args.node.id;
                                }
                                var dataTree = {
                                    id: idNode,
                                    text: args.node.data.Réponse,
                                    in_response_to: args.node.data.Question,
                                    extra_data: args.node.data.Keywords,
                                    bot_id: $routeParams.id,
                                    parentId: args.node.pid || null
                                };
                                //console.log(dataTree);
                                BotsFactory.updateEvent(dataTree)
                                        .then(function (response) {
//                                                //console.log(response);
                                            toastr.info(response.text);
                                            var idBot = response.lastID;
                                            args.node.id = idBot;
                                            //console.log(args.node);
                                        },
                                                function (error) {
                                                    toastr.error("Le serveur d'api ne répond pas");
                                                });
                            },
                            removeNodeEvent: function (sender, args) {
                                var nodeID = args.id;
                                var r = confirm("êtes vous sûr ?");
                                if (r == true) {
                                    BotsFactory.deleteNode(nodeID)
                                            .then(function (response) {
                                                toastr.info(response.text);
                                            }, function (error) {
                                                toastr.error("Le serveur d'api ne répond pas");
                                            });
                                } else {
                                    return false;
                                }

                            },
                            updateNodeEvent: function (sender, args) {
                                //console.log("UPDATE NODE");
                                //console.log(args.node);
                                var idNode = null;
                                if (isNaN(args.node.id)) {
                                    idNode = args.node.id;
                                }
                                var dataTree = {
                                    id: idNode,
                                    text: args.node.data.Réponse,
                                    in_response_to: args.node.data.Question,
                                    extra_data: args.node.data.Keywords,
                                    bot_id: $routeParams.id,
                                    parentId: args.node.pid || null
                                };
                                //console.log(dataTree);
                                BotsFactory.updateEvent(dataTree)
                                        .then(function (response) {
//                                                //console.log(response);
                                            toastr.info(response.text);
                                            var idBot = $routeParams.id;
                                            var length = orgChart.config.dataSource;
                                            //console.log(orgChart.config.dataSource[length - 1]);
//                                                orgChart.da
                                        },
                                                function (error) {
                                                    toastr.error("Le serveur d'api ne répond pas");
                                                });
                            },
                            updatedEvent: function (sender, args) {
                                init();
                            },
                        });
                    }
                    $("input[placeholder='Search']").attr('placeholder', 'Recherche...');
                    $timeout(draggable, 1000);
                },
                        function (response) {
                            //console.log(data);
                            toastr.error("Le serveur d'api ne répond pas");
                        });
    }
    if (currentHash.search("#/bots/add") > -1) {
        $rootScope.pageTitle = "Ajout Bot";
    }
    if (currentHash.search("#/bots/edit-") > -1) {
        $rootScope.pageTitle = "Modif Bot";
        var idBot = $routeParams.id;
        BotsFactory.getBotByID(idBot)
                .then(function (response) {
                    $timeout(function () {
                        //console.log(response.data);
                        $scope.bot = response.data;
                    }, 599);
                }, function (data) {
                    //console.log(data);
                    toastr.error("Le serveur d'api ne répond pas");
                })
                .catch(function (fallback) {
                    //console.log(fallback);
                });
    }
//edit bot
    $scope.editBot = function ($event) {
        $event.preventDefault();
        if ($scope.bot.Bot.name == undefined) {
            toastr.info("Veuillez choisir un nom pour votre bot");
        } else {
            var dataBot = {
                Bot: {
                    id: $scope.bot.Bot.id,
                    name: $scope.bot.Bot.name,
                    content: $scope.bot.Bot.content
                }
            };
            //                    //console.log(dataBot);
            BotsFactory.saveBot(dataBot)
                    .then(function (response) {
                        toastr.info(response.text);
                        $location.path("/bots/index");
                    }, function (data) {
                        toastr.error("Le serveur d'api ne répond pas");
                    })
                    .catch(function (fallback) {
                        //console.log(fallback);
                    });
        }
        ;
    };
    //path add bot
    $scope.callAdd = function () {
        var botNumber = $scope.records.length;
        if (botNumber < 5) {
            $location.path("/bots/add");
        } else {
            toastr.info("Vous avez atteint le nombre maximal de bot.");
        }
    };
    //call referrer
    $scope.cancel = function () {
        history.go(-1);
    };
    //add bot function
    $scope.addBot = function ($event) {
        $event.preventDefault();
        if ($scope.botName == undefined) {
            toastr.info("Veuillez choisir un nom pour votre bot");
        } else {
            var dataBot = {
                Bot: {
                    name: $scope.botName,
                    content: $scope.botInfo || ""
                }
            };
            //                    //console.log(dataBot);
            BotsFactory.saveBot(dataBot)
                    .then(function (response) {
                        toastr.info(response.text);
                        $location.path("/bots/index");
                    }, function (data) {
                        //console.log(data);
                        toastr.error("Le serveur d'api ne répond pas");
                    })
                    .catch(function (fallback) {
                        //console.log(fallback);
                    });
        }
    };
});