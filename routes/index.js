var express = require('express');
var router = express.Router();

const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
businessNetworkConnection = new BusinessNetworkConnection();
businessNetworkConnection.connect('hlfv1', 'object-storage-network', 'PeerAdmin', 'adminpw')
.then((result) => {
  businessNetworkDefinition = result;
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.put('/:accountid', function(req, res, next){
  console.log("account creation request received");
  let serializer = global.businessNetworkDefinition.getSerializer();
    
  let resource = serializer.fromJSON({
    '$class': 'org.acme.objectstore.CreateAccount',
    'accountId': req.params.accountid,
  });
  
  businessNetworkConnection.submitTransaction(resource)
  .then(function (){
    res.send('Account ' + req.params.accountid + ' is created');
  }).catch(function (error){
    res.send(error);
  });
});

router.get('/:accountid', function(req, res, next){
  console.log("listing containers for " + req.params.accountid);

  var selectStatement = businessNetworkConnection.buildQuery('SELECT org.acme.objectstore.Container WHERE (account == _$class)');
  businessNetworkConnection.query(selectStatement, { "class": "resource:org.acme.objectstore.Account#" + req.params.accountid })
  .then(function(results) {
    let containers = "";
    for(let i=0; i<results.length; i++){
      containers += results[i].containerId;
      containers += ",";
    }
    res.send(containers);
  }).catch(function (error){
    res.send(error);
  });
});

router.put('/:accountid/:containerid', function(req, res, next){
  console.log("container creation request received");
  let serializer = businessNetworkDefinition.getSerializer();
  let account_id = "resource:org.acme.objectstore.Account#" + req.params.accountid;

  let resource = serializer.fromJSON({
    '$class': 'org.acme.objectstore.CreateContainer',
    'account': account_id,
    'containerId': req.params.containerid
  });
  
  businessNetworkConnection.submitTransaction(resource)
  .then(function(){
    res.send('Container ' + req.params.containerid + ' is created');
  }).catch(function (error){
    res.send(error);
  });
});

router.get('/:accountid/:containerid', function(req, res, next){
  console.log("listing objects for " + req.params.accountid + " in " + req.params.containerid);
  var selectStatement = businessNetworkConnection.buildQuery('SELECT org.acme.objectstore.Object WHERE (container == _$class)');
  var accountContainerId = req.params.accountid + "/" + req.params.containerid;
  businessNetworkConnection.query(selectStatement, { "class": "resource:org.acme.objectstore.Container#" + accountContainerId })
  .then(function(results) {
    let objects = "";
    for(let i=0; i<results.length; i++){
      objects += results[i].objectId;
      objects += ",";
    }
    res.send(objects);
  }).catch(function (error){
    res.send(error);
  });
});

router.put('/:accountid/:containerid/:objectid', function(req, res, next){
  console.log("object creation request received with id=" + req.params.objectid + " and value=" + req.body);
  let serializer = businessNetworkDefinition.getSerializer();
  let account_id = "resource:org.acme.objectstore.Account#" + req.params.accountid;
  let account_container_id = "resource:org.acme.objectstore.Container#" + req.params.accountid + "/" + req.params.containerid;

  let resource = serializer.fromJSON({
    '$class': 'org.acme.objectstore.CreateObject',
    'account': account_id,
    'container': account_container_id,
    'objectId': req.params.objectid,
    'value': req.body
  });
  
  businessNetworkConnection.submitTransaction(resource)
  .then(function(){
    res.send('Object ' + req.params.objectid + ' is created');
  }).catch(function(error){
    res.send("failed to create the object");
  });
});

router.get('/:accountid/:containerid/:objectid', function(req, res, next){
  console.log("showing value of object " + req.params.objectid + " for " + req.params.accountid + " in " + req.params.containerid);
  var selectStatement = businessNetworkConnection.buildQuery('SELECT org.acme.objectstore.Object WHERE (accountContainerObjectId == _$id)');
  var accountContainerObjectId = req.params.accountid + "/" + req.params.containerid + "/" + req.params.objectid;
  businessNetworkConnection.query(selectStatement, { "id": accountContainerObjectId })
  .then(function(results) {
    res.send(String(results[0].value));
  }).catch(function (error){
    res.send(error);
  });
});

module.exports = router;
