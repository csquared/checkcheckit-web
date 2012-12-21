var crypto  = require('crypto');
var moment  = require('./public/javascripts/moment.min')

module.exports = {}

var hexdigest = function(string){
  return crypto.createHash('sha1').update(string).digest('hex')
}

module.exports.fromJSON = function(list){
  list.start_time = moment().format('MMMM Do YYYY, h:mm:ss a')
  list.id  = hexdigest(JSON.stringify(list) + new Date().toString())
  list.checked = []
  return list
}

module.exports.parse = function(string, name){
  var lines = string.split("\n")
  var list = { name: name }

  var first_line = lines[0].trim();
  if(first_line[0] == '#'){
    list.description = first_line.replace(/^\#/,'').trim()
  }

  lines = lines.reverse();
  var steps = []
  var current_step = null;
  while(lines.length > 0){
    var line = lines.pop();
    if( line[0] == '-'){
      //create a new step
      current_step = {
        'name' : line.replace(/^-/,'').trim(),
        'body'  : ''
      }
      steps.push(current_step)
    }
    else if(current_step){
      // add the line to the body
      if( current_step.body != ''){ line = '\n' + line }
      current_step.body = current_step.body + line
    }
  }

  list.steps = steps
  return module.exports.fromJSON(list)
}

