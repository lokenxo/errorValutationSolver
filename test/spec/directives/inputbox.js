'use strict';

describe('Directive: inputbox', function () {

  // load the directive's module
  beforeEach(module('errorValutationSolverApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<inputbox></inputbox>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the inputbox directive');
  }));
});
