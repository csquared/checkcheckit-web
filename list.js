module.exports = {}

module.exports.parse = function(string){
  var steps = []
  var lines = string.split("\n").reverse()
  var current_step = null;

  while(lines.length > 0){
    var line = lines.pop();
    if( line[0] == '-'){
      current_step = {
        'title' : line.replace(/^-/,'').trim()
      }
      steps.push(current_step)
    }
  }

  return {
    'steps' : steps
  }

}
