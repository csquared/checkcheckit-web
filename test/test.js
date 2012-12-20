var assert     = require('assert');
var listParser = require('../list');

describe('List', function(){
  describe('::parseList(string)', function(){

    it('should assume all lines that start with a dash are steps', function(){
      var list = listParser.parse("- apples\n- bananas\n- cheese")
      assert.equal('apples',  list.steps[0].title);
      assert.equal('bananas', list.steps[1].title);
      assert.equal('cheese',  list.steps[2].title);
    })

    it('should assume everything beneath a step is the body', function(){

    })
  })
})
