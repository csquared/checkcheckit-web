module.exports = {}

module.exports.parse = function(string){
  var lines = string.split("\n")
  var list = {
    'checked': []
  };

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
  return list
}
