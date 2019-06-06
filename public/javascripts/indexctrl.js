const app = angular.module("myShoppingList", []); 
app.controller("myCtrl", function($scope,$http,$timeout) {

    $scope.formData = {};
    $scope.errorText = "";
    $scope.successText = "";
    $scope.isMyAdd = true;
    $scope.isMyUpdate = false;
    $scope.isCancel = false;
    $scope.isSuccess = false;
    $scope.isWarning = false;
    $scope.isDelete = false;

    //-------Create/Add item-------
    $scope.addItem = function () {
        var flag = 0;       //defined
        flag = 0;
        if (!$scope.addMe) {
            return;
        }        
        for (var i=0; i< $scope.lists.length; i++) {
            if ($scope.addMe.charAt(0).toUpperCase()+$scope.addMe.slice(1) == $scope.lists[i].productName) {
                flag=1;
            }  
        }
        if (flag == 0) {
            console.log('Adding Item...');
            $scope.formData = {
                item: $scope.addMe.charAt(0).toUpperCase() + $scope.addMe.slice(1)
            };
            $http.post('/api/addValue', $scope.formData)
            .success( function(data) {
                $scope.lists = data; //assigning value from db(Server.js)
                console.log(data);
                $scope.successText = "Item added successfully.";
                $scope.isSuccess = true;
                //5 seconds delay
                $timeout( function(){
                    $scope.isSuccess = false;
                }, 5000 );
            })
            .error( function(data) {
                console.log('Error: ');
            });
            $scope.addMe = "";
            $scope.showValues();
        } else {
            $scope.errorText = "This item is already in your shopping list.";
            $scope.addMe = "";
            $scope.isWarning = true;
            //5 seconds delay
            $timeout( function(){
                $scope.isWarning = false;
            }, 5000 );
        }
    }

    //-------Read/Showing Data-------
    console.log("Showing values from DB");
        //fetching values from db(Server.js)
        $http.get('/api/showData')
        .success(function(data) {
            $scope.lists = data;
            for (var a=0; a<$scope.lists.length; a++) {     //To view edit in right side
                  $scope.lists[a].edit = true;
            }
            console.log(data);
        })
        .error(function(data) {
            console.log('Error in Showing Data: ' + data);
        });

    //-------Update/Edit item-------
    $scope.updateItem = function (item,index) {     //Edit btn function
        $scope.isMyAdd = false;     //Changes in button
        $scope.isMyUpdate = true;
        $scope.lists[index].edit = false;       //Changes in badge
        for (var a=0; a<$scope.lists.length; a++) {
            if (a!=index){
                $scope.lists[a].isCancel = false;
                $scope.lists[a].edit = true;
            } else {
                $scope.lists[index].isCancel = true;
            }
        }
        var old;
        $scope.old = item;
        $scope.addMe = item; //Showing old value in addMe input
    }
    $scope.cancelItem = function (index) {      //Edit btn function
        $scope.isMyAdd = true;      //Changes in button
        $scope.isMyUpdate = false;
        $scope.lists[index].edit = true;        //Changes in badge
        $scope.lists[index].isCancel = false;
        $scope.addMe = "";
    }
    $scope.updItem = function(){      //Update btn function
        var flag = 0;      //defined
        flag = 0;
        if (!$scope.addMe) {
            return;
        }
        for (var i=0; i< $scope.lists.length; i++) {
            if( $scope.addMe.charAt(0).toUpperCase()+$scope.addMe.slice(1) == $scope.lists[i].productName){
                flag = 1;
            }  
        }
        if (flag == 0) {  
            console.log('Updation Process...');
            $scope.formData = {
                oldProductName: $scope.old, 
                newProductName: $scope.addMe
            };
            console.log($scope.formData);
            $http.post('/api/updateValue', $scope.formData )
            .success(function(data) {
                $scope.lists = data;        //assigning value from db(Server.js)
                console.log(data);
                $scope.isSuccess = true;
                $scope.successText = "Item updated successfully.";
                //5 seconds delay
                $timeout( function(){
                    $scope.isSuccess = false;
                }, 5000 );
            })
            .error(function(data) {
                console.log('Error: Updating');
            });
            $scope.showValues();
            $scope.addMe = "";
            $scope.isMyAdd = true;
            $scope.isMyUpdate = false;
        }
        else {
            $scope.errorText = "This item is already in your shopping list.";
            $scope.addMe = "";
            $scope.isWarning = true;
            //5 seconds delay
            $timeout( function(){
                $scope.isWarning=false;
            }, 5000 );
         }
    }
    
    //-------Delete/Remove item-------
    $scope.removeItem = function (item) {
        var result = confirm("Are you sure to delete?");
        if(result){
            $scope.errorText = "";    
            console.log('Item Removing... '+ item);
            $scope.formData = { productName: item }; 
            $http.post('/api/removeValue', $scope.formData )
            .success( function(data) {
                $scope.lists = data;        //assigning value from db(Server.js)
                console.log(data);
                $scope.isDelete = true;
                $scope.deleteText = "Item removed successfully.";
                //5 seconds delay
                $timeout( function(){
                    $scope.isDelete = false;
                }, 5000 );
            })
            .error(function(data) {
                console.log('Error: ');
            });
            $scope.showValues();
        }
    }

    //-------Read/Showing Data via function call-------
    $scope.showValues = function(){
        console.log("Showing Values from DB via function call");
        //fetching values from db(Server.js)
        $http.get('/api/showData')
        .success(function(data) {
            $scope.lists = data;
            for(var a=0;a<$scope.lists.length;a++) {        //To view edit in right side  
                $scope.lists[a].edit=true;
            }
            console.log(data);
        })
        .error(function(data) {
              console.log('Error: ' + data);
        });
    }

    //-------Alerts Close Functions-------
    $scope.succClose = function(){
        $scope.isSuccess=false;
    }
    $scope.warnClose = function(){
        $scope.isWarning=false;
    }
    $scope.delClose = function(){
        $scope.isDelete=false;
    }
});