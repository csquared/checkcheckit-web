var assert     = require('assert');
var listParser = require('../list');

describe('List', function(){
  describe('::parseList(string)', function(){

    it('should assume all lines that start with a dash are steps', function(){
      var list = listParser.parse("- apples\n- bananas\n- cheese")
      assert.equal('apples',  list.steps[0].name);
      assert.equal('bananas', list.steps[1].name);
      assert.equal('cheese',  list.steps[2].name);
    })

    it('should assume everything beneath a step is the body', function(){
      var list = listParser.parse("- apples\n tasty treats\n good to eat\n- bananas")
      assert.equal('apples',  list.steps[0].name);
      assert.equal(' tasty treats\n good to eat',  list.steps[0].body);
      assert.equal('bananas', list.steps[1].name);
    })

    it('should assume the first line is a description if it begins with #', function(){
      var list = listParser.parse("# Groceries \n- apples\n tasty treats\n good to eat\n- bananas")
      assert.equal('Groceries',  list.description);
      assert.equal('apples',  list.steps[0].name);
      assert.equal('bananas', list.steps[1].name);
    })

    it('should handle complicated lists', function(){
      var list_string = '# My List \n'
      list_string += '- do a thing\n make it good\n  > `run this command`\n'
      list_string += '- again!\n'
      list_string += '- now you\'ve got it! \n yay!'

      var list = listParser.parse(list_string);
      assert.equal('My List',    list.description);
      assert.equal('do a thing', list.steps[0].name);
      assert.equal(' make it good\n  > `run this command`', list.steps[0].body);
      assert.equal('again!', list.steps[1].name);
      assert.equal("now you've got it!", list.steps[2].name);
      assert.equal(" yay!", list.steps[2].body);
    })
  })
})
