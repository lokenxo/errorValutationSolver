'use strict';

describe('Directive: outputbox', function () {

  // load the directive's module
  beforeEach(module('errorValutationSolverApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<outputbox></outputbox>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the outputbox directive');
  }));
});
