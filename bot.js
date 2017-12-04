  /*Name: Asset Bot*/
      /*version- v06:*/
      /*Last updated:28/11/2017: 10:00 PM*/
      /*Author: Suryadeep*/

var restify = require('restify');
var builder = require('botbuilder');
var sql = require('mssql');
require('json-response');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var app = require('express');
var TYPES = require('tedious').TYPES;
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Configure and create 
var config = {
  userName: 'xxxx', 
  password: 'xxxx', 
  server: 'xxxx', 
   options:{ 
    database: 'xxxx', 
    encrypt: true
  }
}
var connection = new Connection(config);

// set up the database connection
connection.on('connect', function(err) 
   {
     if (err) 
       {
          console.log(err)
       }
    else
       {
          console.log('Connected to database!')
          // queryDatabase()
       }
   }
 );
/*
function queryDatabase()
   { console.log('Reading rows from the Table...');

       // Read all rows from table
     global.requestCountFailure = new Request(
          "select count(distinct([FAILURE_SK])) from [DIM_FAILURE]",
             function(err, rowCount, rows) 
                {
              //      console.log(rowCount + ' row(s) returned');
              //      process.exit();
                }
            );
/*
     request.on('row', function(columns) {
        columns.forEach(function(column) {
           console.log("%s\t%s", column.metadata.colName, column.value);
          //response.send("%s\t%s", column.metadata.colName, column.value)
         });
             });
   //  connection.execSql(request);
   }   */
 
/*connect the bot to my node js server*/  
var connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
});

server.post('/api/messages', connector.listen());
var bot = new builder.UniversalBot(connector);

/*Integrate LUIS framework with bode js server*/
const LuisModelUrl = ' https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/470b8f15-fcbf-4898-96e6-8e75bb7cc901?subscription-key=b32c3c902efa422e8ba42e9164de50a5&verbose=true&timezoneOffset=0&q=';

var recognizer = new builder.LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);  
var intents = new builder.IntentDialog({ recognizers: [recognizer] })

.matches('Greetings',(session,args)=>{
  session.send('Hello');
})

.matches('Reliability',[
  function(session,args){
    session.send('How would you like to know about Reliability?');
    //session.send('1. Failure\n2. Health\n3. Downtime');
    builder.Prompts.number(session,'1. Failure\n2. Health\n3. Downtime');
  },function(session){
      if(session.message.text==1){
      session.send('Please tell me what would you would like to ask about Asset Failure?');
    }
    else if (session.message.text==2) {
      session.send('Please tell me what would you would like to ask about Asset Health?');
    }
    else if (session.message.text==3){
      session.send('Please tell me what would you would like to ask about Asset Downtime?');
    }
}
])

.matches('Performance',(session,args)=>{
  session.send('inside Performance');

/*  var countryEntity= builder.EntityRecognizer.findEntity(args.entities,'country');
  console.log(countryEntity.entity);
  request.on('row', function(columns) {
        columns.forEach(function(column) {
         //  console.log("%s\t%s", column.metadata.colName, column.value);
        session.send("%s\t%s", column.metadata.colName, column.value)
         });
             });
    
connection.execSql(request);
*/
})

.matches('FailureCount',[
  function(session,args){
    global.requestCountFailure = new Request(
          "SELECT COUNT(DISTINCT(DIM_WRK_ORDR.WRK_ORDR_SK)) FROM FCT_WRK_ORDR_DTLS INNER JOIN  DIM_ASSET ON (FCT_WRK_ORDR_DTLS.ASST_SK_KEY = DIM_ASSET.ASST_SK) INNER JOIN DIM_LCTN ON (DIM_ASSET.LCTN_SK = DIM_LCTN.LCTN_SK) INNER JOIN DIM_WRK_ORDR ON (FCT_WRK_ORDR_DTLS.WRK_ORDR_SK_KEY = DIM_WRK_ORDR.WRK_ORDR_SK) INNER JOIN FCT_WO_MAT_TRANS ON (DIM_WRK_ORDR.WRK_ORDR_SK = FCT_WO_MAT_TRANS.WRK_ORDR_SK) INNER JOIN FCT_LBR_TRNS_DTS ON (DIM_WRK_ORDR.WRK_ORDR_SK = FCT_LBR_TRNS_DTS.WRK_ORDR_SK) INNER JOIN DIM_SUPPLIER ON (DIM_ASSET.SPPLR_SK = DIM_SUPPLIER.SPPLR_SK) INNER JOIN DIM_DEPARTMENT ON (DIM_ASSET.DEPT_SK = DIM_DEPARTMENT.DEPT_SK) INNER JOIN FCT_ASST_FAILURE ON (DIM_WRK_ORDR.WRK_ORDR_SK = FCT_ASST_FAILURE.WO_SK) INNER JOIN DIM_FAILURE ON (FCT_ASST_FAILURE.FAILURE_SK = DIM_FAILURE.FAILURE_SK) INNER JOIN FCT_ASSET_STATUS ON (DIM_WRK_ORDR.WRK_ORDR_SK = FCT_ASSET_STATUS.WRK_ORDR_SK) INNER JOIN DIM_DATE ON (FCT_WRK_ORDR_DTLS.DATE_SK_KEY= DIM_DATE.DATE_SK) INNER JOIN DIM_INVENTORY ON (FCT_WO_MAT_TRANS.INVENTORY_SK = DIM_INVENTORY.INVENTORY_ITEM_SK) INNER JOIN DIM_ITEM ON (DIM_INVENTORY.ITEM_SK = DIM_ITEM.ITEM_SK) WHERE [DIM_WRK_ORDR].[WORK_TYPE]='Breakdown' OR [DIM_WRK_ORDR].[WORK_TYPE]='Corrective'",
          function(err, rowCount, rows) {
            if (err) {
              console.log('Error in Failure count intent');
            }
          }
    );
    requestCountFailure.on('row', function(columns) {
      columns.forEach(function(column) {
         //  console.log("%s\t%s", column.metadata.colName, column.value);
      session.send("%s\t%s", column.metadata.colName, column.value)
      });
    });
    connection.execSql(requestCountFailure);
  },function(session){
      session.send('what else would you like to know?');
  }
])


.matches('FailurecountCountry',[
  function(session,args){
    var entityCountry=builder.EntityRecognizer.findEntity(args.entities,'country');
    var entityCountryName= entityCountry.entity;
    console.log(entityCountryName)
    global.requestCountFailureCountry = new Request(
      
        
    //    "SELECT COUNT(DISTINCT(DIM_WRK_ORDR.WRK_ORDR_SK)) FROM FCT_WRK_ORDR_DTLS INNER JOIN  DIM_ASSET ON (FCT_WRK_ORDR_DTLS.ASST_SK_KEY = DIM_ASSET.ASST_SK) INNER JOIN DIM_LCTN ON (DIM_ASSET.LCTN_SK = DIM_LCTN.LCTN_SK) INNER JOIN DIM_WRK_ORDR ON (FCT_WRK_ORDR_DTLS.WRK_ORDR_SK_KEY = DIM_WRK_ORDR.WRK_ORDR_SK) INNER JOIN FCT_WO_MAT_TRANS ON (DIM_WRK_ORDR.WRK_ORDR_SK = FCT_WO_MAT_TRANS.WRK_ORDR_SK) INNER JOIN FCT_LBR_TRNS_DTS ON (DIM_WRK_ORDR.WRK_ORDR_SK = FCT_LBR_TRNS_DTS.WRK_ORDR_SK) INNER JOIN DIM_SUPPLIER ON (DIM_ASSET.SPPLR_SK = DIM_SUPPLIER.SPPLR_SK) INNER JOIN DIM_DEPARTMENT ON (DIM_ASSET.DEPT_SK = DIM_DEPARTMENT.DEPT_SK) INNER JOIN FCT_ASST_FAILURE ON (DIM_WRK_ORDR.WRK_ORDR_SK = FCT_ASST_FAILURE.WO_SK) INNER JOIN DIM_FAILURE ON (FCT_ASST_FAILURE.FAILURE_SK = DIM_FAILURE.FAILURE_SK) INNER JOIN FCT_ASSET_STATUS ON (DIM_WRK_ORDR.WRK_ORDR_SK = FCT_ASSET_STATUS.WRK_ORDR_SK) INNER JOIN DIM_DATE ON (FCT_WRK_ORDR_DTLS.DATE_SK_KEY= DIM_DATE.DATE_SK) INNER JOIN DIM_INVENTORY ON (FCT_WO_MAT_TRANS.INVENTORY_SK = DIM_INVENTORY.INVENTORY_ITEM_SK) INNER JOIN DIM_ITEM ON (DIM_INVENTORY.ITEM_SK = DIM_ITEM.ITEM_SK) WHERE ([DIM_WRK_ORDR].[WORK_TYPE]='Breakdown' OR [DIM_WRK_ORDR].[WORK_TYPE]='Corrective')AND DIM_LCTN.CNTRY=@entityCountryName",
        "SELECT COUNT(DISTINCT(DIM_WRK_ORDR.WRK_ORDR_SK)) FROM FCT_WRK_ORDR_DTLS INNER JOIN  DIM_ASSET ON (FCT_WRK_ORDR_DTLS.ASST_SK_KEY = DIM_ASSET.ASST_SK) INNER JOIN DIM_LCTN ON (DIM_ASSET.LCTN_SK = DIM_LCTN.LCTN_SK) INNER JOIN DIM_WRK_ORDR ON (FCT_WRK_ORDR_DTLS.WRK_ORDR_SK_KEY = DIM_WRK_ORDR.WRK_ORDR_SK) INNER JOIN FCT_WO_MAT_TRANS ON (DIM_WRK_ORDR.WRK_ORDR_SK = FCT_WO_MAT_TRANS.WRK_ORDR_SK) INNER JOIN FCT_LBR_TRNS_DTS ON (DIM_WRK_ORDR.WRK_ORDR_SK = FCT_LBR_TRNS_DTS.WRK_ORDR_SK) INNER JOIN DIM_SUPPLIER ON (DIM_ASSET.SPPLR_SK = DIM_SUPPLIER.SPPLR_SK) INNER JOIN DIM_DEPARTMENT ON (DIM_ASSET.DEPT_SK = DIM_DEPARTMENT.DEPT_SK) INNER JOIN FCT_ASST_FAILURE ON (DIM_WRK_ORDR.WRK_ORDR_SK = FCT_ASST_FAILURE.WO_SK) INNER JOIN DIM_FAILURE ON (FCT_ASST_FAILURE.FAILURE_SK = DIM_FAILURE.FAILURE_SK) INNER JOIN FCT_ASSET_STATUS ON (DIM_WRK_ORDR.WRK_ORDR_SK = FCT_ASSET_STATUS.WRK_ORDR_SK) INNER JOIN DIM_DATE ON (FCT_WRK_ORDR_DTLS.DATE_SK_KEY= DIM_DATE.DATE_SK) INNER JOIN DIM_INVENTORY ON (FCT_WO_MAT_TRANS.INVENTORY_SK = DIM_INVENTORY.INVENTORY_ITEM_SK) INNER JOIN DIM_ITEM ON (DIM_INVENTORY.ITEM_SK = DIM_ITEM.ITEM_SK) WHERE ([DIM_WRK_ORDR].[WORK_TYPE]='Breakdown' OR [DIM_WRK_ORDR].[WORK_TYPE]='Corrective')AND DIM_LCTN.CNTRY=@value",
       function(err, rowCount, rows) {
          if (err) {
              console.log(err);
          }
        }
  );
   requestCountFailureCountry.addParameter('value',TYPES.NVarChar,entityCountry.entity);
requestCountFailureCountry.on('row', function(columns) {
    columns.forEach(function(column) {
         //  console.log("%s\t%s", column.metadata.colName, column.value);
    session.send("%s\t%s", column.metadata.colName, column.value)
    });
  });
  connection.execSql(requestCountFailureCountry);
  }
])
.matches('FailurecountOrganization',[
    function(session,args){
      global.requestCountFailureOrg = new Request(
          //""
          function(err,rowCount,rows){
            if (err) {
              console.log('Error in Failure count org');
            } 
          }
        );
requestCountFailureOrg.on('row', function(columns) {
    columns.forEach(function(column) {
         //  console.log("%s\t%s", column.metadata.colName, column.value);
    session.send("%s\t%s", column.metadata.colName, column.value)
    });
  });
  connection.execSql(requestCountFailureOrg);
    }
  ])
/*LUIS handling not yet done*/
.matches('TopfailedAssetName',[
  function(session,args){
    global.requestCountTopFailureName = new Request(
          "SELECT TOP 3 DIM_ASSET.ASST_DESC, COUNT(Distinct(DIM_WRK_ORDR.WRK_ORDR_SK)) FROM FCT_WRK_ORDR_DTLS INNER JOIN  DIM_ASSET ON (FCT_WRK_ORDR_DTLS.ASST_SK_KEY = DIM_ASSET.ASST_SK) INNER JOIN DIM_LCTN ON (DIM_ASSET.LCTN_SK = DIM_LCTN.LCTN_SK) INNER JOIN DIM_WRK_ORDR ON (FCT_WRK_ORDR_DTLS.WRK_ORDR_SK_KEY = DIM_WRK_ORDR.WRK_ORDR_SK) INNER JOIN FCT_WO_MAT_TRANS ON (DIM_WRK_ORDR.WRK_ORDR_SK = FCT_WO_MAT_TRANS.WRK_ORDR_SK) INNER JOIN FCT_LBR_TRNS_DTS ON (DIM_WRK_ORDR.WRK_ORDR_SK = FCT_LBR_TRNS_DTS.WRK_ORDR_SK) INNER JOIN DIM_SUPPLIER ON (DIM_ASSET.SPPLR_SK = DIM_SUPPLIER.SPPLR_SK) INNER JOIN DIM_DEPARTMENT ON (DIM_ASSET.DEPT_SK = DIM_DEPARTMENT.DEPT_SK) INNER JOIN FCT_ASST_FAILURE ON (DIM_WRK_ORDR.WRK_ORDR_SK = FCT_ASST_FAILURE.WO_SK) INNER JOIN DIM_FAILURE ON (FCT_ASST_FAILURE.FAILURE_SK = DIM_FAILURE.FAILURE_SK) INNER JOIN FCT_ASSET_STATUS ON (DIM_WRK_ORDR.WRK_ORDR_SK = FCT_ASSET_STATUS.WRK_ORDR_SK) INNER JOIN DIM_DATE ON (FCT_WRK_ORDR_DTLS.DATE_SK_KEY= DIM_DATE.DATE_SK) INNER JOIN DIM_INVENTORY ON (FCT_WO_MAT_TRANS.INVENTORY_SK = DIM_INVENTORY.INVENTORY_ITEM_SK) INNER JOIN DIM_ITEM ON (DIM_INVENTORY.ITEM_SK = DIM_ITEM.ITEM_SK) where [DIM_WRK_ORDR].[WORK_TYPE]='Breakdown' OR [DIM_WRK_ORDR].[WORK_TYPE]='Corrective' GROUP BY [DIM_ASSET].[ASST_DESC] ORDER BY COUNT(Distinct(DIM_WRK_ORDR.WRK_ORDR_SK)) DESC",
          function(err,rowCount,rows){
            if (err) {
              console.log('Error in Failure count org');
            } 
          }
        );
requestCountTopFailureName.on('row', function(columns) {
    columns.forEach(function(column) {
         //  console.log("%s\t%s", column.metadata.colName, column.value);
    session.send("%s\t%s", column.metadata.colName, column.value)
    });
  });
  connection.execSql(requestCountTopFailureName);
  }
])

.matches('TopfailedCategories',[
  function(session,args){
     global.requestCountTopFailureCat = new Request(
          "SELECT TOP 3 DIM_ASSET.ASST_CAT, COUNT(Distinct(DIM_WRK_ORDR.WRK_ORDR_SK)) FROM FCT_WRK_ORDR_DTLS INNER JOIN  DIM_ASSET ON (FCT_WRK_ORDR_DTLS.ASST_SK_KEY = DIM_ASSET.ASST_SK) INNER JOIN DIM_LCTN ON (DIM_ASSET.LCTN_SK = DIM_LCTN.LCTN_SK) INNER JOIN DIM_WRK_ORDR ON (FCT_WRK_ORDR_DTLS.WRK_ORDR_SK_KEY = DIM_WRK_ORDR.WRK_ORDR_SK) INNER JOIN FCT_WO_MAT_TRANS ON (DIM_WRK_ORDR.WRK_ORDR_SK = FCT_WO_MAT_TRANS.WRK_ORDR_SK) INNER JOIN FCT_LBR_TRNS_DTS ON (DIM_WRK_ORDR.WRK_ORDR_SK = FCT_LBR_TRNS_DTS.WRK_ORDR_SK) INNER JOIN DIM_SUPPLIER ON (DIM_ASSET.SPPLR_SK = DIM_SUPPLIER.SPPLR_SK) INNER JOIN DIM_DEPARTMENT ON (DIM_ASSET.DEPT_SK = DIM_DEPARTMENT.DEPT_SK) INNER JOIN FCT_ASST_FAILURE ON (DIM_WRK_ORDR.WRK_ORDR_SK = FCT_ASST_FAILURE.WO_SK) INNER JOIN DIM_FAILURE ON (FCT_ASST_FAILURE.FAILURE_SK = DIM_FAILURE.FAILURE_SK) INNER JOIN FCT_ASSET_STATUS ON (DIM_WRK_ORDR.WRK_ORDR_SK = FCT_ASSET_STATUS.WRK_ORDR_SK) INNER JOIN DIM_DATE ON (FCT_WRK_ORDR_DTLS.DATE_SK_KEY= DIM_DATE.DATE_SK) INNER JOIN DIM_INVENTORY ON (FCT_WO_MAT_TRANS.INVENTORY_SK = DIM_INVENTORY.INVENTORY_ITEM_SK) INNER JOIN DIM_ITEM ON (DIM_INVENTORY.ITEM_SK = DIM_ITEM.ITEM_SK) where [DIM_WRK_ORDR].[WORK_TYPE]='Breakdown' OR [DIM_WRK_ORDR].[WORK_TYPE]='Corrective' GROUP BY [DIM_ASSET].[ASST_CAT] ORDER BY COUNT(Distinct(DIM_WRK_ORDR.WRK_ORDR_SK)) DESC",
          function(err,rowCount,rows){
            if (err) {
              console.log('Error in Failure count org');
            } 
          }
        );
requestCountTopFailureCat .on('row', function(columns) {
    columns.forEach(function(column) {
         //  console.log("%s\t%s", column.metadata.colName, column.value);
    session.send("%s\t%s", column.metadata.colName, column.value)
    });
  });
  connection.execSql(requestCountTopFailureCat );
  }
])

.matches('TopfailedTypes',[
  function(session,args){
        global.requestCountTopFailureType = new Request(
          "SELECT TOP 3 DIM_ASSET.ASST_TYPE, COUNT(Distinct(DIM_WRK_ORDR.WRK_ORDR_SK)) FROM FCT_WRK_ORDR_DTLS INNER JOIN  DIM_ASSET ON (FCT_WRK_ORDR_DTLS.ASST_SK_KEY = DIM_ASSET.ASST_SK) INNER JOIN DIM_LCTN ON (DIM_ASSET.LCTN_SK = DIM_LCTN.LCTN_SK) INNER JOIN DIM_WRK_ORDR ON (FCT_WRK_ORDR_DTLS.WRK_ORDR_SK_KEY = DIM_WRK_ORDR.WRK_ORDR_SK) INNER JOIN FCT_WO_MAT_TRANS ON (DIM_WRK_ORDR.WRK_ORDR_SK = FCT_WO_MAT_TRANS.WRK_ORDR_SK) INNER JOIN FCT_LBR_TRNS_DTS ON (DIM_WRK_ORDR.WRK_ORDR_SK = FCT_LBR_TRNS_DTS.WRK_ORDR_SK) INNER JOIN DIM_SUPPLIER ON (DIM_ASSET.SPPLR_SK = DIM_SUPPLIER.SPPLR_SK) INNER JOIN DIM_DEPARTMENT ON (DIM_ASSET.DEPT_SK = DIM_DEPARTMENT.DEPT_SK) INNER JOIN FCT_ASST_FAILURE ON (DIM_WRK_ORDR.WRK_ORDR_SK = FCT_ASST_FAILURE.WO_SK) INNER JOIN DIM_FAILURE ON (FCT_ASST_FAILURE.FAILURE_SK = DIM_FAILURE.FAILURE_SK) INNER JOIN FCT_ASSET_STATUS ON (DIM_WRK_ORDR.WRK_ORDR_SK = FCT_ASSET_STATUS.WRK_ORDR_SK) INNER JOIN DIM_DATE ON (FCT_WRK_ORDR_DTLS.DATE_SK_KEY= DIM_DATE.DATE_SK) INNER JOIN DIM_INVENTORY ON (FCT_WO_MAT_TRANS.INVENTORY_SK = DIM_INVENTORY.INVENTORY_ITEM_SK) INNER JOIN DIM_ITEM ON (DIM_INVENTORY.ITEM_SK = DIM_ITEM.ITEM_SK) where [DIM_WRK_ORDR].[WORK_TYPE]='Breakdown' OR [DIM_WRK_ORDR].[WORK_TYPE]='Corrective' GROUP BY [DIM_ASSET].[ASST_TYPE] ORDER BY COUNT(Distinct(DIM_WRK_ORDR.WRK_ORDR_SK)) DESC",
          function(err,rowCount,rows){
            if (err) {
              console.log('Error in Failure count org');
            } 
          }
        );
requestCountTopFailureType.on('row', function(columns) {
    columns.forEach(function(column) {
         //  console.log("%s\t%s", column.metadata.colName, column.value);
    session.send("%s\t%s", column.metadata.colName, column.value)
    });
  });
  connection.execSql(requestCountTopFailureType);
  }
])
.onDefault((session) => {
    session.send('Sorry, I did not understand \'%s\'.', session.message.text);
       //session.send(LuisModelUrl);
     
});

bot.dialog('/',intents);