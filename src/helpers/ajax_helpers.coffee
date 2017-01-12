HPP.Helpers.Ajax = {
  executeRequest: (url, method, data, headers = {}) ->
    headers['Accept'] = headers['Content-Type'] = 'application/json'
    options = {
      method: method
      url: url
      data: JSON.stringify(if data is undefined then {} else data)
      headers: headers
      dataType: 'json'
      responseType: 'json'
    }
    options.type = options.method
    options.body = options.data
    HPP.http_function(options.url, options)
}
