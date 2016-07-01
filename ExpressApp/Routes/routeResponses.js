exports.SendDocumentIfFound = (req, res, promise) => {
  promise
  .then(data => {
    res.status(200).send(data)
  })
  .catch(err => {
    res.status(500).send({
      error: err.message
    })
  })
}

exports.SendFileNotFoundResponse = (req, res) => {
  res.sendStatus(404)
}

exports.redirectToIndex = (req, res) => {
  res.render('index')
}
