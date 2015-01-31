describe('avoiding stupidity', function () {
  it('should not store temp value in global space', function () {
    jsConfig.new().set('a', 'b');
    expect(window.tmp).toBeUndefined();
  })
});
