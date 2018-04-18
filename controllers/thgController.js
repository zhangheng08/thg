//Require the express package and use express.Router()
const OktaJwtVerifier = require('@okta/jwt-verifier');
const express = require('express');
const bibtexparser = require('bibtex-parser');
const router = express.Router();

//GET HTTP method to /members
const memberList = require('../models/members');
const publicationList = require('../models/publication');

const membersBriefList = require('../models/membersBrief');

const oktaJwtVerifier = new OktaJwtVerifier({
    issuer: 'https://dev-568215.oktapreview.com/oauth2/default',
    assertClaims: {
        aud: 'api://default',
    }
});

function authenticationRequired(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const match = authHeader.match(/Bearer (.+)/);

    if (!match) {
        return res.status(401).end();
    }

    const accessToken = match[1];

    console.log('token is : ' + JSON.stringify(accessToken ,null, 2));

    return oktaJwtVerifier.verifyAccessToken(accessToken)
        .then((jwt) => {
            console.log("123123" + jwt);
            req.jwt = jwt;
            next();
        }).catch((err) => {
            res.status(401).send(err.message);
    });
}

//GET HTTP method to /bucketlist
router.get('/findAll', (req,res) => {
    memberList.getAllLists((err, lists)=> {
        if(err) {
            res.json({success:false, message: `Failed to load all lists. Error: ${err}`});
        } else {
            res.write(JSON.stringify({success: true, lists:lists},null,2));
            res.end();
        }
    });
});


router.get('/findAllBrief', (req,res) => {
    membersBriefList.getAllBriefList((err, lists)=> {
        if(err) {
            res.json({success:false, message: `Failed to load all lists. Error: ${err}`});
        } else {
            res.write(JSON.stringify({success: true, lists:lists},null,2));
            res.end();
        }
    });
});

router.post('/findById', authenticationRequired, (req, res) => {

    let id = req.body._id;

    memberList.findMemberById(id, (err, member) => {

        console.log(member);

        if(err) {
            res.json({success:false, message: `Failed to get member by Id with Error: ${err}`});
        } else {
            res.write(JSON.stringify(member, null, 2));
            res.end();
        }
    });

});

router.post('/findBriefById', authenticationRequired, (req, res) => {

    let id = req.body._id;

    membersBriefList.findBriefById(id, (err, brief) => {

        console.log(brief);

        if(err) {
            res.json({success:false, message: `Failed to get member by Id with Error: ${err}`});
        } else {
            res.write(JSON.stringify(brief, null, 2));
            res.end();
        }
    });

});

router.post('/findByEmail', (req, res) => {

    let email = req.body.email;

    memberList.findMemberByEmail(email, (err, member) => {

        console.log(member);

        if(err) {
            res.json({success:false, message: `Failed to get member by Id with Error: ${err}`});
        } else {
            res.write(JSON.stringify(member, null, 2));
            res.end();
        }

    });

});

router.post('/parserbibtex', authenticationRequired,(req,res) => {

    let id = req.body._id;

/*    var bibliography = "@article{su2017ferroelectric,\n" +
        "  title={A Ferroelectric Nonvolatile Processor with 46$$\\backslash$mu $ s System-Level Wake-up Time and 14$$\\backslash$mu $ s Sleep Time for Energy Harvesting Applications},\n" +
        "  author={Su, Fang and Liu, Yongpan and Wang, Yiqun and Yang, Huazhong},\n" +
        "  journal={IEEE Transactions on Circuits and Systems I: Regular Papers},\n" +
        "  volume={64},\n" +
        "  number={3},\n" +
        "  pages={596--607},\n" +
        "  year={2017},\n" +
        "  publisher={IEEE}\n" +
        "}";*/

    var bibliography = req.body.bibtexStr;


    //-------------------------------modify
    var pdf = req.body.pdf;
    var slider = req.body.slider;

    var obj;

    var bibtexObj = bibtexparser(bibliography);

    for(var key in bibtexObj) {

        obj = bibtexObj[key];
        obj['HEADER'] = key;
        obj['pdf'] = pdf;
        obj['slider'] = slider;
        console.log("333333333333: " + JSON.stringify(bibtexObj[key], null, 2));
        break;

    }

    console.log(JSON.stringify(obj, null, 2));

    memberList.findAndUpdate(id, obj, function (err, list) {
        //-------------------------------modify

        if(err) {
            res.json({success:false, message: `Failed to update the list. Error: ${err}`});
        }
        else
            res.json({success:true});

        //res.write(JSON.stringify({success: true, lists:bibtexparser(bibliography)},null,2));

    });

});

//POST HTTP method to /members

router.post('/add', authenticationRequired, function (req,res,next) {//-------------------------------modify

    let newList = new memberList({
        active: req.body.active,
        address: req.body.address,
        avatar: req.body.avatar,
        brief: req.body.brief,
        chineseName: req.body.chineseName,
        cv: req.body.cv,
        email: req.body.email,
        enrolledYear: req.body.enrolledYear,
        firstName: req.body.firstName,
        introduction:req.body.introduction,
        lastName: req.body.lastName,
        mobile: req.body.mobile,
        name: req.body.name,
        position: req.body.position,
        publications: []
    });

    memberList.addList(newList, function (err, list) {//-------------------------------modify

    if(err) {
        res.json({success: false, message: `Failed to create a new list. Error: ${err}`});
    } else
        res.json({success:true, message: "Added successfully."});
    });

});

router.post('/addBrief', authenticationRequired, function ( req, res, next) {//-------------------------------modify

    let newBriefList = new membersBriefList({
        id: req.body.memberId,
        active: req.body.active,
        avatar: req.body.avatar,
        brief: req.body.brief,
        enrolledYear: req.body.enrolledYear,
        name: req.body.name,
        position: req.body.position
    });

    membersBriefList.addList(newBriefList, function (err, list) {//-------------------------------modify
    if(err) {
        res.json({success: false, message: `Failed to create a new list. Error: ${err}`});
    } else res.json({success:true, message: "Added successfully."});
    });

});

router.post('/findAndUpdate', authenticationRequired, function(req, res) {//-------------------------------modify

    let id = req.body._id;

    let plist = new publicationList ({

        pdf : req.body.pdf,
        author : req.body.author

    });


    memberList.findAndUpdate(id, plist, function (err, list) {//-------------------------------modify

            if(err) {
                res.json({success:false, message: `Failed to update the list. Error: ${err}`});
            }
            else
                res.json({success:true});

    });

});

router.post('/update', authenticationRequired, function(req, res) {//-------------------------------modify

    let id = req.body._id;
    let jsonString = req.body.objmod;
    console.log(jsonString);

    membersBriefList.updateById(id, jsonString, function (err, list) {});//-------------------------------modify

    memberList.updateById(id, jsonString, function (err, list) {//-------------------------------modify

    if(err) {
        res.json({success:false, message: `Failed to update the list. Error: ${err}`});
    }
    else
        res.json({success:true});

    });

});

router.post('/deletePublication', authenticationRequired, function (req, res) {//-------------------------------modify

    let id = req.body._id;
    let pid = req.body.pid;


    memberList.deletePublicationById(id, pid, function (err, list) {//-------------------------------modify

        if(err) {
            res.json({success:false, message: `Failed to update the list. Error: ${err}`});
        }
        else
            res.json({success:true});

    });

});

router.delete('/:id', authenticationRequired, function(req,res,next) {//-------------------------------modify
    //access the parameter which is the id of the item to be deleted
    let id = req.params.id;
//Call the model method deleteListById
    memberList.deleteListById(id, function(err,list) {//-------------------------------modify
        if(err) {
            res.json({success:false, message: `Failed to delete the list. Error: ${err}`});
        }
        else if(list) {
            res.json({success:true, message: "Deleted successfully"});
        }
        else
            res.json({success:false});
    });
});

module.exports = router;