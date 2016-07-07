export default app => {
    app.factory('examFactory', $resource => {
      let examResource = $resource('/api/exams/:board/:instrument/:grade', {board: '@board', instrument: '@instrument', grade: '@grade'});
      return examResource;
    });
};


