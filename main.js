const superagent = require('superagent');
const fs = require('fs-extra-promise');

var contents = fs.readFileSync('./smoke/nasa_image20170802.json')
var jsonContent = JSON.parse(contents);
// console.log(jsonContent);
superagent.get(jsonContent.url)
.query(jsonContent.query)
.end((err, res) => {
  if (err) { return console.log('Smoke Test Failed' + err); }
  console.log('Smoke Test Passed!');
  testRun();
  // console.log(res.body);
});

function testRun(){
  fs.readdir('./tests', (err, items) => {
    if (err) {
      return console.log(err)
    }
    for (item of items) {
      contents = fs.readFileSync('./tests/' + item)
      jsonContent = JSON.parse(contents);
      // console.log(jsonContent);
      superagent.get(jsonContent.url)
      .query(jsonContent.query)
      .end((err, res) => {
        if (err) { return console.log(err); }
        // console.log(res.body);
        var check = apiCheck(res.body, jsonContent.baseline, jsonContent.ignore)
        if (check == true) {
          console.log("All Tests Pass");
        } else {
          console.log(check);
        }
      });
    }
  })
}

function apiCheck(response, baseline, ignore) {
  var result = true;
  var error = [];
  for(var respAttribute in response){
    var log = {};
    // console.log(respAttribute, response[respAttribute]);
    var match = response[respAttribute].match(new RegExp(baseline[respAttribute], 'g'));
    if (match = null) {
      result = false;
      log['response'+respAttribute] = response[respAttribute];
      log['baseline'+respAttribute] = baseline[respAttribute];
      error.push(log)
    }
  }
  if (match) {
    return true;
  } else {
    return error;
  }

}

