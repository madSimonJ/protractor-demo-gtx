export default app => {
    
    app.controller('mainCtrl', $scope => {
       $scope.header = 'Ductia';
       $scope.welcomeText = 'A website for searching for exam pieces and the ideal books to get them with';
    });
};
