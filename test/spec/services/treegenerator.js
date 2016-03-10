'use strict';

describe('Service: treeGenerator', function () {

  // load the service's module
  beforeEach(module('errorValutationSolverApp'));

  // instantiate service
  var treeGenerator;
  beforeEach(inject(function (_treeGenerator_) {
    treeGenerator = _treeGenerator_;
  }));

  it('should do something', function () {
    expect(!!treeGenerator).toBe(true);
  });

});
