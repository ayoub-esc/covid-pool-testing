
var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pass4root",
    port: 3306
});


var express = require('express')
var app = express()
var port = 3000

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

var lastTech = "";
var currentPool = "";
var currentMap = ""; 
var progress = "";
var loginEmail = ""; 
var barcodes = [];

app.listen(port, () => {
    console.log(`Server Started`)
})


app.get('/lablogin', (req, res) => {
    response = ` <!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Lab Login Page</title>
		<style>
		.login{
			width: 300px;
			margin: 0 auto;
			font-family: Geneva;
        
    }
    .login input, b {
        font-size:16pt;
    
    }
		</style>
	</head>
	<body>
		<div class="login">
			<h1>Lab Login Page </h1>
            <form action="labauth" method="POST">
            <b> Lab ID: </b>   <input type="text" name="labID"  required/>
            <br></br>
			<b> Password: </b>	<input type="password" name="password" required/>
				<input type="submit" value = "Lab Login"/>
			</form>
		</div>
	</body>
</html>
`
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(response);
    res.end();
});

app.post('/labauth', function (req, res) {
    var labid = req.body.labID;
    var password = req.body.password;
    con.query(`SELECT * FROM finalproject.LabEmployee WHERE labID = '` + labid + `' AND password = '` + password + `'`, function (err, results) {
        if (err) throw err;
        if (results.length > 0) {
            lastTech = labid
            res.redirect('/labhome');
        } else {

            res.send('Incorrect Username and/or Password');
        }
        res.end();
    });

});

app.get('/labhome', (req, res) => {
    currentPool = "";
    barcodes = [];

        response = ` <!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Lab Home</title>
		<style>
		.home{
			width: 300px;
			margin: 0 auto;
            font-family: Geneva;
            display:table
        

    }     input {
        -webkit-appearance: button;
        font-size:26pt;
        width: 100%;
        margin: 5px; 
  
    
    }  h1 {

        text-align:center;

    }

		</style>
	</head>
	<body>
		<div class="home">
			<h1>Lab Home</h1>
            <form action="collection" method="GET">
			<input type="submit" value = "Test Collection"/>
            </form>
            <form action="pool" method="GET">
			<input  type="submit" value = "Pool Mapping"/>
            </form>
            <form action="well" method="GET">
			<input type="submit" value = "Well Testing"/>
            </form>
		</div>
	</body>
</html>
`





        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(response);
    res.end();
});

app.get('/collection', (req, res) => {
    response = ` <!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Test Collestion</title>
		<style>
		.test{
			width: 300px;
			margin: 0 auto;
			font-family: Geneva;
        
    }
    .test input, b {
        font-size:14pt;
    
    }
		</style>
	</head>
	<body>
		<div class="test">
			<h1>Test Collection</h1>
            <form action="collectionInsert" method="POST">
            <b> Employee ID: </b>   <input type="text" name="employeeID"  required/>
            <br></br>
			<b> Test Barcode: </b>	<input type="Text" name="barcode" required/>
				<input type="submit" value = "Add"/>
			</form>
        </div>
        <br></br>
        <div class="test">
            <form action="collectionDelete" method="POST">
            <table border="1">
            <tbody>
                <tr>
                    <th></th>
                    <th>Employee ID</th>
                    <th>Test Barcode</th>
                </tr>
`
var sql='SELECT * FROM finalproject.EmployeeTest';
con.query(sql, function (err, result) {
if (err) throw err;
for (let x of result){
    response += `
    <tr>
            <td> <input type="radio" name="delete" value="` + x.testBarcode + `"> </td>
            <td>` +x.employeeID +`</td>
            <td>` +x.testBarcode +`</td> 
    </tr>
    `
}
response += `</tbody> </table>`
if (result.length > 0){
response += `<input type="submit" value = "Delete"/>`
}
response += `</form> <a href="/labhome">back</a>  </div> </body> </html>`

res.writeHead(200, { "Content-Type": "text/html" });
res.write(response);
res.end();
});
});

app.post('/collectionInsert', function (req, res) {
    var employeeID = req.body.employeeID;
    var barcode = req.body.barcode;
    con.query(`INSERT INTO finalproject.EmployeeTest (testBarcode, EmployeeID, collectedBy) VALUES ('` + barcode + `','` + employeeID + `','` + lastTech + `');`, function (err, results) {
        if (err) throw err;
        res.redirect('/collection');
    
        res.end();
    });

});


app.post('/collectionDelete', function (req, res) {
var result = req.body.delete;
if (typeof result != "object"){
    result = [result]
}
for (let x of result){
    con.query(`DELETE FROM finalproject.EmployeeTest WHERE testBarcode = '`+x+`';`, function (err, results) {
       if (err) throw err;
    });
}
res.redirect('/collection');
    
res.end();

});


app.get('/pool', function (req, res) {
    if(currentPool == ""){
    response = ` <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <title>Pool Mapping</title>
            <style>
            .map{
                width: 300px;
                margin: 0 auto;
                font-family: Geneva;
            
        }
        .map input, b {
            font-size:14pt;
        
        }
            </style>
        </head>
        <body>
            <div class="map">
                <h1>Pool Mapping</h1>
                <form>
                <b> Pool Barcode: </b>   <input type="text" name="pool"  required/>
                <br></br>
                
            </div>
            <br></br>
            <div class="map">
                <b> Test Barcodes: </b>
                <table>
                <tbody>
                    <tr>
                    <input type="Text" name="barcode" required/> </tr>
                    </tbody>
                    <input type="submit" formmethod="Post" formaction="/addRow" value = "Add more rows"/>
                    </table>
                    <br></br>
                    <input type="submit" formmethod="Post" formaction="/insertPool" value = "Submit Pool"/>

                </form>
                </div>
            <div class="map">
            <form>
            <table border="1">
            <tbody>
                <tr>
                    <th></th>
                    <th>Pool Barcode</th>
                    <th>Test Barcodes</th>
                </tr>
            `
            var sql='SELECT * FROM finalproject.PoolMap';
            var lastPool = "";
            con.query(sql, function (err, result) {
            if (err) throw err;
            for(x of result){
            if (x.poolBarcode != lastPool){
            if (lastPool != ""){
                response +=   
             `</td> 
             </tr>
             `
            }
            response += `
            
            <tr>
            <td> <input type="radio" name="edit" value="` + x.poolBarcode + `"> </td>
            <td> ` +x.poolBarcode +` </td>
            <td>
             `
            }
            temp = ` `+x.testBarcode+`,`;
            response += temp;
            lastPool = x.poolBarcode;
            }

            response +=   
            `</td> 
            </tr>
            `
        
        
          response +=  
            `
            </tbody>
            </table>
            <input type="submit" formmethod="Post" formaction="/editPool" value = "Edit"/> 
            <input type="submit" formmethod="Post" formaction="/deletePool" value = "Delete"/> 
            </form> <a href="/labhome">back</a>  </div> </body> </html>
            </div>
                </body>
                </html>`
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(response);
        res.end();
            });
 } else{
      response =   
        ` <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <title>Pool Mapping</title>
            <style>
            .map{
                width: 300px;
                margin: 0 auto;
                font-family: Geneva;
            
        }
        .map input, b {
            font-size:14pt;
        
        }
            </style>
        </head>
        <body>
            <div class="map">
                <h1>Pool Mapping</h1>
                <form>
                <b> Pool Barcode: </b>   <input type="text" name="pool" value="`+currentPool+`"/>
                <br></br>    
            </div>
            <div class="map">
                <b> Test Barcodes: </b>
                <table>
                <tbody>
            `
            for (let x of barcodes){

               response += `<tr> <td>  <input type="Text" name="barcode" value= "`+x+`"/>  </td> 
               <td> <input type="submit" formmethod="Post"  name = "`+x+`" formaction="/deleteRow" value = "Delete"/> </td>
               </tr>`
            }
            response += `<tr><input type="Text" name="barcode"/> </tr>
            </tbody>
            </table>
                    <input type="submit" formmethod="Post" formaction="/addRow" value = "Add more rows"/>
                
                    <br></br>
                    <input type="submit" formmethod="Post" formaction="/insertPool" value = "Submit Pool"/>

                </form>
                </div>`
            response += `
                <div class="map">
                <form>
                <table border="1">
                <tbody>
                    <tr>
                        <th></th>
                        <th>Pool Barcode</th>
                        <th>Test Barcodes</th>
                    </tr>
                    
                `
                var sql='SELECT * FROM finalproject.PoolMap';
                var lastPool = "";
                con.query(sql, function (err, result) {
                if (err) throw err;
                for(x of result){
                if (x.poolBarcode != lastPool){
                if (lastPool != ""){
                    response +=   
                 `</td> 
                 </tr>
                 `
                }
                response += `
                
                <tr>
                <td> <input type="radio" name="edit" value="` + x.poolBarcode + `"> </td>
                <td> ` +x.poolBarcode +` </td>
                <td>
                 `
                }
                temp = ` `+x.testBarcode+`,`;
                response += temp;
                lastPool = x.poolBarcode;
                }
    
                response +=   
                `</td> 
                </tr>
                `
            
            
              response +=  
                `
                </tbody>
                </table>
                <input type="submit" formmethod="Post" formaction="/editPool" value = "Edit"/> 
                <input type="submit" formmethod="Post" formaction="/deletePool" value = "Delete"/> 
                </form>
                </div>
                    </body>
                    </html>`
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(response);
            res.end();
                });

    
}

    });


    app.post('/addRow', function (req, res) {
        barcodes = [] 
        currentPool = req.body.pool;
        var result = req.body.barcode;
        if (typeof result != "object"){
            result = [result];
        }
        for (let x of result){
            barcodes.push(x);
        }
        res.redirect('/pool');
        res.end();

    });

    app.post('/deleteRow', function (req, res) {
       for (i = 0; i < barcodes.length; i++) { 
            if (Object.prototype.hasOwnProperty.call(req.body, barcodes[i])){
            barcodes.splice(i,1);
            }
      }
      res.redirect('/pool');
      res.end();
    });



    app.post('/insertPool', function (req, res) {
        barcodes = []
        pool = req.body.pool;
        var result = req.body.barcode;


        con.query(`INSERT INTO finalproject.Pool (poolBarcode) VALUES ('` + pool + `');`, function (err, results) {
            if (err) throw err;
     
        });


        if (typeof result != "object"){
            result = [result];
        }
        for (let x of result){
        con.query(`INSERT INTO finalproject.PoolMap (poolBarcode, testBarcode) VALUES ('` + pool + `','` + x + `');`, function (err, results) {
            if (err) throw err;
     
        });
    }
    
        currentPool = "";
        barcodes = [];

       res.redirect('/pool');
       res.end();
     });



     app.post('/deletePool', function (req, res) {
        pool = req.body.edit;
        con.query(`DELETE FROM finalproject.PoolMap WHERE poolBarcode='`+pool+`';`, function (err, results) {
            if (err) throw err;
            con.query(`DELETE FROM finalproject.Pool WHERE poolBarcode='`+pool+`';`, function (err, results) {
                if (err) throw err;
             });
        res.redirect('/pool');
        res.end();
         });
     });


     app.post('/editPool', function (req, res) {
        barcodes = [];
        pool = req.body.edit;
        currentPool = pool;
        con.query(`SELECT testBarcode FROM finalproject.PoolMap WHERE poolBarcode='`+pool+`';`, function (err, results) {
            if (err) throw err;
            for(x of results){
            barcodes.push(x.testBarcode);
            }
            con.query(`DELETE FROM finalproject.PoolMap WHERE poolBarcode='`+pool+`';`, function (err, results) {
            if (err) throw err;
            con.query(`DELETE FROM finalproject.Pool WHERE poolBarcode='`+pool+`';`, function (err, results) {
                if (err) throw err;
             });

             
        res.redirect('/pool');
        res.end();
         });
     });
    });


    app.get('/well', function (req, res) {
        if(currentPool == ""){
            response = ` <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>Well Testing</title>
                    <style>
                    .map{
                        width: 300px;
                        margin: 0 auto;
                        font-family: Geneva;
                    
                }
                .map input, b {
                    font-size:14pt;
                
                }
                    </style>
                </head>
                <body>
                    <div class="map">
                        <h1>Well Testing</h1>
                        <form>
                        <b> Well Barcode: </b>   <input type="text" name="well"  required/>
                        <br></br>
                        <b> Pool Barcodes: </b><input type="Text" name="pool" required/> 
                            <select name ="progress"> 
                            <option value="In Progress"> In Progress</option>
                            <option value="Positive"> Positive</option>
                            <option value="Negative"> Negative</option> 
                    
                        </select>
                            <input type="submit" formmethod="Post"  formaction="/insertWell" value = "Add"/>
        
                        </form>
                        <br></br>
                        </div>
                    <div class="map">
                    <form>
                    <table border="1">
                    <tbody>
                        <tr>
                            <th></th>
                            <th>Pool Barcode</th>
                            <th>Test Barcodes</th>
                            <th>Result</th>
                        </tr>
                    `
                    var sql='SELECT * FROM finalproject.WellTesting';
                    con.query(sql, function (err, result) {
                    if (err) throw err;
                    for(x of result){
                        response +=   
                     `</td> 
                     </tr>
                     `
            
                    response += `
                    
                    <tr>
                    <td> <input type="radio" name="edit" value="` + x.wellBarcode + `"> </td>
                    <td> ` +x.wellBarcode +` </td>
                    <td> ` +x.poolBarcode +` </td>
                    <td> ` +x.result+` </td>
                     `
                    }
        
                    response +=   
                    `</td> 
                    </tr>
                    `
                
                
                  response +=  
                    `
                    </tbody>
                    </table>
                    <input type="submit" formmethod="Post" formaction="/editWell" value = "Edit"/> 
                    <input type="submit" formmethod="Post" formaction="/deleteWell" value = "Delete"/> 
                    </form> <a href="/labhome">back</a>  </div> </body> </html>
                    </div>
                        </body>
                        </html>`
                res.writeHead(200, { "Content-Type": "text/html" });
                res.write(response);
                res.end();
                    });
         } else{
            response = ` <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>Well Testing</title>
                    <style>
                    .map{
                        width: 300px;
                        margin: 0 auto;
                        font-family: Geneva;
                    
                }
                .map input, b {
                    font-size:14pt;
                
                }
                    </style>
                </head>
                <body>
                    <div class="map">
                        <h1>Well Testing</h1>
                        <form>
                        <b> Well Barcode: </b>   <input type="text" name="well" value = "` + currentMap +`"/>
                        <br></br>
                        <b> Pool Barcodes: </b><input type="Text" name="pool" value = "` + currentPool +`" /> `


                    if(progress == "In Progress"){
                        response +=
                         `
                            <select name ="progress"> 
                            <option value="In Progress"> In Progress</option>
                            <option value="Positive"> Positive</option>
                            <option value="Negative"> Negative</option> 
                         `
                    }
                    else if(progress == "Positive"){
                        response +=
                         `
                            <select name ="progress"> 
                            <option value="Positive"> Positive</option>
                            <option value="In Progress"> In Progress</option>
                            <option value="Negative"> Negative</option> 
                         `
                    }
                    else {
                        response +=
                         `
                            <select name ="progress"> 
                            <option value="Negative"> Negative</option> 
                            <option value="Positive"> Positive</option>
                            <option value="In Progress"> In Progress</option>
                         `
                    }
                    response +=
                    `
                        </select>
                            <input type="submit" formmethod="Post"  formaction="/insertWell" value = "Add"/>
        
                        </form>
                        <br></br>
                        </div>
                    <div class="map">
                    <form>
                    <table border="1">
                    <tbody>
                        <tr>
                            <th></th>
                            <th>Pool Barcode</th>
                            <th>Test Barcodes</th>
                            <th>Result</th>
                        </tr>
                    `
                    var sql='SELECT * FROM finalproject.WellTesting';
                    con.query(sql, function (err, result) {
                    if (err) throw err;
                    for(x of result){
                        response +=   
                     `</td> 
                     </tr>
                     `
            
                    response += `
                    
                    <tr>
                    <td> <input type="radio" name="edit" value="` + x.wellBarcode + `"> </td>
                    <td> ` +x.wellBarcode +` </td>
                    <td> ` +x.poolBarcode +` </td>
                    <td> ` +x.result+` </td>
                     `
                    }
        
                    response +=   
                    `</td> 
                    </tr>
                    `
                
                
                  response +=  
                    `
                    </tbody>
                    </table>
                    <input type="submit" formmethod="Post" formaction="/editWell" value = "Edit"/> 
                    <input type="submit" formmethod="Post" formaction="/deleteWell" value = "Delete"/> 
                    </form> <a href="/labhome">back</a>  </div> </body> </html>
                    </div>
                        </body>
                        </html>`
                res.writeHead(200, { "Content-Type": "text/html" });
                res.write(response);
                res.end();
                    });
            
        }
        
            });

        app.post('/insertWell', function (req, res) {
            currentPool = ""
            currentMap = ""; 
            progress = "";
            well = req.body.well;
            pool = req.body.pool;
            prog = req.body.progress;
        
        
                con.query(`INSERT INTO finalproject.Well (wellBarcode) VALUES ('` + well + `');`, function (err, results) {
                    if (err) throw err;
             
                });

            
                con.query(`INSERT INTO finalproject.WellTesting (wellBarcode, poolBarcode, result ) VALUES ('` + well + `','` + pool + `','`+ prog+`');`, function (err, results) {
                    if (err) throw err;
             
                });
    
            
        
               res.redirect('/well');
               res.end();
             });
        
        
        
        app.post('/deleteWell', function (req, res) {
                well = req.body.edit;
                con.query(`DELETE FROM finalproject.WellTesting WHERE wellBarcode='`+well+`';`, function (err, results) {
                    if (err) throw err;
                    con.query(`DELETE FROM finalproject.Well WHERE wellBarcode='`+well+`';`, function (err, results) {
                        if (err) throw err;
                     });
                res.redirect('/Well');
                res.end();
                 });
             });
        
        
        app.post('/editWell', function (req, res) {
                well = req.body.edit;
                currentMap = well;
                con.query(`SELECT poolBarcode, result FROM finalproject.WellTesting WHERE wellBarcode='`+well+`';`, function (err, results) {
                    if (err) throw err;
                    for (x of results){
                    currentPool = x.poolBarcode;
                    progress = x.result;
                    }
                    con.query(`DELETE FROM finalproject.WellTesting WHERE wellBarcode='`+well+`';`, function (err, results) {
                    if (err) throw err;
                    con.query(`DELETE FROM finalproject.Well WHERE wellBarcode='`+well+`';`, function (err, results) {
                        if (err) throw err;
                     });
        
                     
                res.redirect('/well');
                res.end();
                 });
             });
            });
            
            
    app.get('/emplogin', (req, res) => {
                response = ` <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>Employee Login</title>
                    <style>
                    .login{
                        width: 300px;
                        margin: 0 auto;
                        font-family: Geneva;
                    
                }
                .login input, b {
                    font-size:16pt;
                
                }
                    </style>
                </head>
                <body>
                    <div class="login">
                        <h1>Employee Login</h1>
                        <form action="empauth" method="POST">
                        <b> Email: </b>   <input type="text" name="email"  required/>
                        <br></br>
                        <b> Password: </b>	<input type="password" name="password" required/>
                            <input type="submit" value = "Login"/>
                        </form>
                    </div>
                </body>
            </html>
            `
                res.writeHead(200, { "Content-Type": "text/html" });
                res.write(response);
                res.end();
            });
    
    app.post('/empauth', function (req, res) {
                var email = req.body.email;
                var password = req.body.password;
                con.query(`SELECT * FROM finalproject.Employee WHERE email = '` + email + `' AND passcode = '` + password + `'`, function (err, results) {
                    if (err) throw err;
                    if (results.length > 0) {
                        loginEmail = email;
                        res.redirect('/emphome');
                    } else {
                        res.send('Incorrect Username and/or Password');
                    }
                    res.end();
                });
            
            });

            app.get('/emphome', (req, res) => {
                response = ` <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>Employee Home</title>
                    <style>
                    .test{
                        width: 300px;
                        margin: 0 auto;
                        font-family: Geneva;
                    
                }
                .test input, b {
                    font-size:14pt;
                
                }
                    </style>
                </head>
                <body>
                    <div class="test">
                        <h1>Employee Home</h1>
                
                    <br></br>
                        <table border="1">
                        <tbody>
                            <tr>
                                <th>Collection Date</th>
                                <th>Result</th>
                            </tr>
            `
            var sql= `SELECT employeeID FROM finalproject.Employee WHERE email='`+loginEmail+`';`;
            con.query(sql, function (err, result) {
            if (err) throw err;
            for (let employee of result){
            var sql2= `SELECT DATE_FORMAT((collectionTime), '%d/%m/%Y') AS Time, testBarcode FROM finalproject.EmployeeTest WHERE employeeID='`+employee.employeeID+`';`;
            con.query(sql2, function (err, result2) { 
            if (err) throw err;
            for (let x of result2){
            var sql3= `SELECT poolBarcode FROM finalproject.PoolMap WHERE testBarcode='`+x.testBarcode+`';`;
            con.query(sql3, function (err, result3) { 
            if (err) throw err;
            for (let y of result3){
            var sql4= `SELECT result FROM finalproject.WellTesting WHERE poolBarcode='`+y.poolBarcode+`';`;
            con.query(sql4, function (err, result4) {
            for (let z of result4){
                response += `
                <tr>
                        <td>` +x.Time +`</td>
                        <td>` +z.result +`</td> 
                </tr>
                `
            }
            response += `</tbody> </table> </div> </body> </html>`
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(response);
            res.end();
            });
            }
            });
            }

            });
            }
            });
            });
    


