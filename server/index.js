const mysql = require("mysql");
const cors = require('cors');
const moment = require('moment');

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(express.json({ limit: '200mb' })) ;
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));
//app.use(bodyParser.text({ limit: '200mb' }));

app.use(function (req, res, next) {
    //set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})
app.use(cors());


const con = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'mysql',
    database: 'civileng',
    insecureAuth: true,
  
})
// const con = mysql.createConnection({
//     host: '127.0.0.1',
//     user: 'root',
//     password: 'Amit@3717',
//     database: 'machineerp',
//     insecureAuth: true,
//     // multipleStatements:true
// })
con.connect(error => {
    if (error) throw error;
    console.log("Database Connected Successfully... ")
})




//Department table(1)
app.get("/getcivil", (req, res) => {
    con.query(`SELECT * FROM civil where id=${req.query.id}`, function (err, result, fields) {
        if (err) {
            console.log(err)
        }
        else {
            console.log(JSON.parse(JSON.stringify(result)))
            res.send(result)
        }
    })
})









app.post("/postcivil", (req, res) => {
   // console.log(req.body);
    
    var str= 'insert into civil (name, date, detail)values'

    for(let i=0 ; i<req.body.length;i++){
       tmpstr=  `('${req.body[i].name}','${req.body[i].date}','${req.body[i].detail}'),`
    str =  str+tmpstr;
}
str = str.substring(0, str.length - 1);
console.log(str)
con.query(str, function (err, result) {
                if (err) {
                    res.send({ isSuccess: false, message: 'Something went wrong....!!!' })
                }
                else {
                    res.send({ isSuccess: true })
                }
            })

    
})




app.get("/getcivilinfo", (req, res) => {
    const id = req.body.id;
    con.query(`Select * from civil  where id= ${req.query.id} `, function (err, result, fields) {
        if (err) {
            console.log(err)
        }
        else {
            console.log(JSON.parse(JSON.stringify(result)))
            res.send(result)
        }
    })
})

app.post("/updatecivilinfo", (req, res) => {
    console.log(req.body);

    con.query(`UPDATE  civil  set name='${req.body.name}', date='${req.body.date},detail='${req.body.detail}'  WHERE id= ${req.query.id}`, function (err, result) {
        if (err) {
            console.log(err)
        }
        else {
            res.send({ isSuccess: true })
        }
    })
})

///type table
app.get("/gettype", (req, res) => {
    con.query(`SELECT * FROM type `, function (err, result, fields) {
        if (err) {
            console.log(err)
        }
        else {
            console.log(JSON.parse(JSON.stringify(result)))
            res.send(result)
        }
    })
})

app.post("/posttype",(req, res,) => {
    console.log(req.body);
    const name = req.body.data.name;
    const measurement = req.body.data.measurement;    
    const quantity =req.body.data.quantity;
    console.log("......",quantity)
    //const {name,measurement,quantity}  = req.body
            con.query(`insert into type (name, measurement,quantity)values('${name}','${measurement}','${quantity}')`, function (err, result) {
                if (err) {
                    res.send({ isSuccess: false, message: 'Something went wrong....!!!' })
                }
                else {
                    res.send({ isSuccess: true })
                }
            })
    
    })


    app.get("/gettypebyid", (req, res) => {
        con.query(`SELECT * FROM type  where tid= ${req.query.tid}`, function (err, result, fields) {
            if (err) {
                console.log(err)
            }
            else {
                console.log(JSON.parse(JSON.stringify(result)))
                res.send(result)
            }
        })
    })
    

    // app.get("/getAllDate", (req, res) => {
    //     con.query(`select distinct wdate,itemno,type from civileng.mbdata`, function (err, result, fields) {
    //         if (err) {
    //             console.log(err)
    //         }
    //         else {
    //             console.log(JSON.parse(JSON.stringify(result)))
    //             res.send(result)
    //         }
    //     })
    // })

    app.get("/getAllDate", (req, res) => {
        con.query(`select distinct wdate,itemno,type from civileng.mbdata order by wdate, itemno, type DESC` , function (err, result, fields) {
            if (err) {
                console.log(err)
            }
            else {
                console.log(JSON.parse(JSON.stringify(result)))
                let record = JSON.parse(JSON.stringify(result))
               console.log(record)
                let outPutArr = []
                for (j=0;j<record.length;j++){
                    let date = moment(record[j].wdate).utcOffset("+5:30").format('DD-MM-YYYY');
                    let dummyOb = new Object();
                    dummyOb.wdate =  date;
                    dummyOb.type =  record[j].type;
                    dummyOb.itemno =  record[j].itemno;
                    outPutArr.push(dummyOb)
                 
                }
                res.send(outPutArr)
            }
        })
    })

    app.get("/getdateWiseData", (req, res) => {
       let skip = (req.query.page-1)*100
       console.log(`SELECT *, (select count(*)  FROM civileng.mbdata where wdate='${req.query.wdate}' and itemno=${req.query.itemno} and type=${req.query.type} ) as cnt FROM civileng.mbdata where wdate='${req.query.wdate}' and itemno=${req.query.itemno} and type=${req.query.type} limit 100 OFFSET ${skip} `)
       
        con.query(`SELECT *, (select count(*)  FROM civileng.mbdata where wdate='${req.query.wdate}' and itemno=${req.query.itemno} and type=${req.query.type} ) as cnt FROM civileng.mbdata where wdate='${req.query.wdate}' and itemno=${req.query.itemno} and type=${req.query.type} limit 100 OFFSET ${skip} `, function (err, result, fields) {
            if (err) {
                console.log(err)
            }
            else {
                
                let resultArr= result
                let finalArr = [];
                for(let i=0;i<result.length;i++){
                   // let tmpobj= new Object();
                   let  tmpobj = JSON.parse(resultArr[i].measurement)
                    if(i==0){
                    // tmpobj.date = resultArr[i].wdate;
                     tmpobj.date = moment(resultArr[i].wdate).utcOffset("+5:30").format('DD-MM-YYYY');
                    }

                     tmpobj.partiwork = resultArr[i].partiwork;
                     tmpobj.itemno = resultArr[i].itemno;
                     tmpobj.subitemno = resultArr[i].subitemno;
                     tmpobj.no = resultArr[i].no;
                     tmpobj.count = resultArr[i].cnt
                
                     
                   finalArr.push(tmpobj)
                }
                res.send(finalArr)
            }
        })
    })
    
    app.post("/postmbdata",(req, res,) => {
        console.log(req.body);
    
        const name = req.body.name;
        const irl = req.body.irl;    
        const itemno = req.body.itemno;
        const subitemno = req.body.subitemno;    
        const payment = req.body.payment;
        const date = req.body.date;    
        const partiwork = req.body.partiwork;
        const no = req.body.no; 
        const measurement = req.body.measurement;    

                con.query(`insert into mbdata (name, irl, itemno, subitemno, payment, date, partiwork, no, measurement)values('${name}','${irl}',${itemno},'${subitemno}','${payment}','${date}','${partiwork}',${no},'${measurement}')`, function (err, result) {
                    if (err) {
                        res.send({ isSuccess: false, message: 'Something went wrong....!!!' })
                    }
                    else {
                        res.send({ isSuccess: true })
                    }
                })
        
        })
    
    
    app.post("/postmbd", (req, res) => {
           // console.log(req.body);
             
             var str= 'insert into mbdata (name, irl, itemno, subitemno, payment, wdate, partiwork, no, measurement,type)values'
             let length=  req.body.data.length
            // length =100
             for(let i=0 ; i<length;i++){
                
             let  name= "demo";
             let irl= req.body.data[i].irl ? req.body.data[i].irl: "";
             let itemno =req.body.data[i].itemno?req.body.data[i].itemno:"";
             let subitemno = req.body.data[i].subitemno?req.body.data[i].subitemno:"";
             let payment = req.body.data[i].payment?req.body.data[i].payment:"";
            
             let date = req.body.data[i].date?req.body.data[i].date:"";
             let partiwork = req.body.data[i].partiwork ? req.body.data[i].partiwork :"";
             let no =req.body.data[i].no?req.body.data[i].no:0;
             let measurement =req.body.data[i].measurement ? req.body.data[i].measurement : "";
             let type = req.body.data[i].type ? req.body.data[i].type : "";
               
              tmpstr=  `('${name}','${irl}',${itemno},'${subitemno}','${payment}','${date}','${partiwork}',${no},'${measurement}','${type}'),`
             str =  str+tmpstr;
         }
         str = str.substring(0, str.length - 1);
        //console.log(str);
         con.query(str, function (err, result) {
                         if (err) {
                             res.send({ isSuccess: false, message: 'Something went wrong....!!!'+err
                            
                            
                            
                            })
                         }
                         else {
                             res.send({ isSuccess: true })
                         }
                     })
                    
     })



app.post("/postcivil", (req, res) => {
   // console.log(req.body);
    
    var str= 'insert into civil (name, date, detail)values'

    for(let i=0 ; i<req.body.length;i++){
       tmpstr=  `('${req.body[i].name}','${req.body[i].date}','${req.body[i].detail}'),`
    str =  str+tmpstr;
}
str = str.substring(0, str.length - 1);
console.log(str)
con.query(str, function (err, result) {
                if (err) {
                    res.send({ isSuccess: false, message: 'Something went wrong....!!!' })
                }
                else {
                    res.send({ isSuccess: true })
                }
            })

    
})




app.listen(3002, (err) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log("Your App is connecting with 3002 server ")
    }
})