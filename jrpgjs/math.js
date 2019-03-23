Math.randomRange = function(min, max) {
  return min + (Math.random() * (max - min));
};

Math.choose = function() {
  return arguments[Math.floor(Math.random() * arguments.length)];
};