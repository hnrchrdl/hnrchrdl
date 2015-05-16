describe("HH Trees App", function () {
  // var el = document.createElement("div");
  // el.id = "myDiv";
  // el.innerHTML = "Hi there!";
  // el.style.background = "#ccc";
  // document.body.appendChild(el);
  //
  // var myEl = document.getElementById('myDiv');
  // it("is in the DOM", function () {
  //     expect(myEl).to.not.equal(null);
  // });
  //
  // it("is a child of the body", function () {
  //     expect(myEl.parentElement).to.equal(document.body);
  // });
  //
  // it("has the right text", function () {
  //     expect(myEl.innerHTML).to.equal("Hi there!");
  // });
  //
  // it("has the right background", function () {
  //     expect(myEl.style.background).to.equal("rgb(204, 204, 204)");
  // });


  it('should have an options object', function() {
    var app = new hhtreesApp();
    expect(app.options).to.be.instanceof(Object);
  });

  it('should have a model, controller and view', function() {
    var app = new hhtreesApp();
    expect(app.model).to.be.instanceof(Object);
    expect(app.controller).to.be.instanceof(Object);
    expect(app.view).to.be.instanceof(Object);
  });

  it('should generate a valid css string', function() {
    var app = new hhtreesApp();
    expect(app.controller.generateCartoCss()).to.be.a('string');
    expect(app.controller.generateCartoCss()).to.have.string('#' + app.options.cartodb.dataset);
  });
});
