const app = angular.module("myShoppingList", []); 
app.controller("myCtrl", function($scope,$http) {
    $scope.formData={};

    //$scope.regex = "/^[a-zA-Z\s]*$/";
    $scope.myAdd=true;
    $scope.myUpd=false;
    $scope.cancel=false;
    $scope.success=false;
    $scope.warning=false;


    //-------Create/Add item-------
    $scope.addItem = function () {
       flag=0;//defined
       $scope.flag=0;
       $scope.errorText = "";

       console.log($scope.lists.length);
       if (!$scope.addMe) {return;}        
       for( var i=0; i< $scope.lists.length ; i++)
       {
         if( $scope.addMe.charAt(0).toUpperCase()+$scope.addMe.slice(1) == $scope.lists[i].productName)
          {
            $scope.flag=1;
            /*console.log($scope.flag); //checking
            console.log($scope.addMe.charAt(0).toUpperCase()+$scope.addMe.slice(1)+" equal "+$scope.lists[i].productname);*/
          }  
        }
        if($scope.flag==0){
            console.log('Add Item Working');
            console.log($scope.addMe);

            $scope.formData = {
                   item: $scope.addMe.charAt(0).toUpperCase()+ $scope.addMe.slice(1)
                };

            $http.post('/api/addValue', $scope.formData)
              .success(function(data) {
                $scope.lists = data; //assigning value from db(Server.js)
                console.log(data);
                $scope.success=true;
              })
              .error(function(data) {
                console.log('Error: ');
              });

            $scope.flag=0;
            $scope.addMe="";
            $scope.showValues();
          }
         else {
            $scope.errorText = "This item is already in your shopping list.";
            $scope.addMe="";
            $scope.warning=true;
         }
    }


    //-------Read/Showing Data-------
      console.log("Showing values from DB");
      //fetching values from db(Server.js)
          $http.get('/api/showData')
            .success(function(data) {
              $scope.lists = data;
              for(var a=0;a<$scope.lists.length;a++)  //To view edit in right side
              {
                  $scope.lists[a].edit=true;
              }
              console.log(data);
            })
            .error(function(data) {
              console.log('Error: ' + data);
            });


    //-------Update/Edit item-------
    $scope.updateItem = function (x,i) {  //Edit btn function
      $scope.myAdd=false; //Changes in button
      $scope.myUpd=true;
      $scope.lists[i].edit=false; //Changes in badge
      console.log("edit "+$scope.lists.length);
      for(var a=0;a<$scope.lists.length;a++)
      {
        if(a!=i){
          $scope.lists[a].cancel=false;
          $scope.lists[a].edit=true;
        }
        else{
          $scope.lists[i].cancel=true;
        }
      }
      console.log("Edit Button Working "+ x);
      var old;
      $scope.old=x;
      $scope.addMe=x; //Showing old value in addMe input
    }
    $scope.cancelItem = function (i) {  //Edit btn function
      $scope.myAdd=true; //Changes in button
      $scope.myUpd=false;
      $scope.lists[i].edit=true; //Changes in badge
      $scope.lists[i].cancel=false;
      console.log("Cancel Working ");
      $scope.addMe="";
    }
    $scope.updItem=function(){          //Update btn function
       console.log("Update Button Working "+ $scope.old);
       flag=0;//defined
       $scope.flag=0;
       $scope.errorText = "";
       console.log($scope.lists.length);
       if (!$scope.addMe) {return;}        
       for( var i=0; i< $scope.lists.length ; i++)
       {
         if( $scope.addMe.charAt(0).toUpperCase()+$scope.addMe.slice(1) == $scope.lists[i].productName)
          {
            $scope.flag=1;
            /*console.log($scope.flag); //checking
            console.log($scope.addMe.charAt(0).toUpperCase()+$scope.addMe.slice(1)+" equal "+$scope.lists[i].productname);*/
          }  
        } 
        if($scope.flag==0){
          $scope.errorText = "";    
          console.log('Updation Process..');
          $scope.formData = {
                    oldProductName: $scope.old, 
                    newProductName: $scope.addMe
                };
          console.log($scope.formData);
          $http.post('/api/updateValue', $scope.formData )
            .success(function(data) {
                $scope.lists = data; //assigning value from db(Server.js)
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: Updating');
            });
            $scope.showValues();
            $scope.addMe="";
            $scope.myAdd=true;
            $scope.myUpd=false;
        }
        else {
            $scope.errorText = "This item is already in your shopping list.";
            $scope.addMe="";
            $scope.warning=true;
         }
  }

    
    //-------Delete/Remove item-------
    $scope.removeItem = function (x) {
        var result = confirm("Are you sure to delete?");
        if(result){
          $scope.errorText = "";    
          console.log('Remove Item Working'+ x);
          $scope.formData = { productName: x }; 
          $http.post('/api/removeValue', $scope.formData )
            .success(function(data) {
                $scope.lists = data; //assigning value from db(Server.js)
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ');
            });
            $scope.showValues();
        }
    }


    //-------Read/Showing Data via function call-------
    $scope.showValues=function(){
      console.log("Showing Values from DB via function call");
      //fetching values from db(Server.js)
      $http.get('/api/showData')
        .success(function(data) {
              $scope.lists = data;
              for(var a=0;a<$scope.lists.length;a++) //To view edit in right side
              {
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
      $scope.success=false;
    }
    $scope.warnClose = function(){
      $scope.warning=false;
    }
});