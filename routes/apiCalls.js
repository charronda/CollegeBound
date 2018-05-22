var axios  = require('axios'),
    token  = 'a58a86a575424bf1afed7628ed2cac06',
    apiKey = 'zZciBMZkRuMWxEaFwOxiHQAltnZnufev2B97VRn8'

//Helper functions
var State               = require('./helperFuncs').state,
    City                = require("./helperFuncs").city,
    RegionId            = require("./helperFuncs").regionId,
    WomenOnly           = require("./helperFuncs").womenOnly,
    MenOnly             = require("./helperFuncs").menOnly,
    determineMajor      = require('./helperFuncs').determineMajor,
    determineSchoolSize = require('./helperFuncs').determineSchoolSize,
    determineIncome     = require('./helperFuncs').determineIncome

var noResultsPhrases = [
  `I couldn't find any results!
  Try searching again`,
  `I couldn't find any results!
  Go with your gut instead`,
  `I couldn't find any results!`,
  `Look to the person on your left. Now look to the person on your right.
  Hopefully one of them knows, because I couldn't find any results!`,
  `I couldn't find any results!
  So just like, follow your heart or something...`,
  `I couldn't find any results!
  Maybe college isn't for you`,
  `In the future jobs will be obsolete because computers like me will run everything, so you won't really need to go to college.
  Also, I couldn't find any results!`
]

function callDialogApi (query, prevParams, res) {
  //TODO - change this to req.body.prevParams when the front end is incorporated

  prevParams = JSON.parse(prevParams)

  axios.post('https://api.dialogflow.com/v1/query?v=20150910',
  {
      "lang": "en",
      "query": query,
      "sessionId": "12345",
      "timezone": "America/New_York",
  },
  {
      headers: {
          Authorization: 'Bearer ' + token
      }
  }).then(result => {
      var data = result.data
      console.log(data)
      return data.result
  }).then( result => {
      console.log(result.parameters)
      //if the AI couldn't detect what the user was saying...
      var fallbackMsg = result.fulfillment.speech
      if(result.metadata.intentName === "Default Fallback Intent"){
          res.send(JSON.stringify(fallbackMsg))
          return
        }
      callCollegeAPI(result.parameters, prevParams, res)
  }).catch(err => {
      console.log('------ERROR---------')
      console.log(err)
  })
}

function callCollegeAPI (params, prevParams, res) {

    var paramsObj         = packageParams(params, prevParams),
        urlParams         = paramsObj.urlParams,
        finalParams       = paramsObj.finalParams,
        fieldsReturned    = '2015.aid.loan_principal,2015.aid.pell_grant_rate,2015.cost.avg_net_price.private,2015.cost.avg_net_price.public,2015.student.size,2015.admissions.sat_scores.average.overall,school.women_only,school.men_only,2015.admissions.admission_rate.overall,school.men_only,school.women_only,school.ownership,id,school.name,school.city,school.state,school.zip,school.school_url,school.price_calculator_url',
        incomeFieldString = determineIncome(finalParams.family_income)

        fieldsReturned += incomeFieldString

    var pathES6 = `https://api.data.gov/ed/collegescorecard/v1/schools.json?${urlParams}school.operating__not=0&_fields=${fieldsReturned}&api_key=${apiKey}`


    console.log('Final url: ' + pathES6)

    axios.get(pathES6).then(result => {
        //search was succesful, but no schools matched
        if(result.data.results.length === 0){
            var randNum = Math.floor(Math.random() * noResultsPhrases.length),
            phrase = noResultsPhrases[randNum]
            res.end(JSON.stringify({errorMsg: phrase}))
            return
        }
        //search was successful
        res.end(JSON.stringify({urlParams: urlParams, metadata: result.data.metadata, schools: result.data.results, finalParams: finalParams}))
    }).catch(err => {
        console.log('---SOMETHING WENT WRONG------')
        var randNum = Math.floor(Math.random() * noResultsPhrases.length),
            phrase = noResultsPhrases[randNum]
        res.end(JSON.stringify({errorMsg: phrase}))
    })
}

//alter this as more parameters, turns parameters into url strings for use in college scorecard API call
function packageParams (params, prevParams) {

  var finalParams = reconcileParams(params, prevParams)
  //might need to change the refernces on params later...
  var SAT_score = finalParams.SAT_score ? `2015.admissions.sat_scores.average.overall__range=${Number(finalParams.SAT_score) - 400}..${Number(finalParams.SAT_score) + 150}&` : '',
  //search for range of ACT scores (+3, -6)
      ACT_score   = finalParams.ACT_score ? `2015.admissions.act_scores.midpoint.cumulative__range=${Number(finalParams.ACT_score) - 6}..${Number(finalParams.ACT_score) + 3}&` : '',
      degree_type = finalParams.degree_type ? `school.degrees_awarded.highest=${finalParams.degree_type}&` : ''
      school_size = determineSchoolSize(finalParams.school_size, finalParams.school_size1),
      major       = determineMajor(finalParams.major),
      state       = State(finalParams.state),
      city        = City(finalParams['geo-city']),
      regionId    = RegionId(finalParams.regionId),
      womenOnly   = WomenOnly(finalParams.womenOnly),
      menOnly     = MenOnly(finalParams.menOnly)

  var urlParams =  ACT_score + SAT_score + degree_type+ school_size + major + state + city + regionId + womenOnly + menOnly
  console.log('Url: ' + urlParams)
  return {
    urlParams: urlParams,
    finalParams: finalParams
  }
}


//take previous paramaters and combine or replace with new user parameters
function reconcileParams (params, prevParams) {
    //---IMPORTANT-----
    //keys in params and prevParams MUST have same names
    var finalParams = {}

    //if there's a new input use that, if not use sessionStorage item, if not use an empty string
    for (key in params){
        finalParams[key] = params[key] ? params[key].trim() : prevParams[key] ? prevParams[key].trim() : ''
        //get rid of olf city if there's only a new state (and not a new city)
        if (key === "geo-city"){
            if(params['state'] && !params['geo-city']){
                finalParams[key] = ''
            }
        }
        console.log('-----'+key+'------')
        console.log("Old: " + prevParams[key])
        console.log('New: ' + params[key])
        console.log('Final: ' + finalParams[key])
    }

    console.log('Final params: ' + JSON.stringify(finalParams))
    console.log('prev params: ' + JSON.stringify(prevParams))
    return(finalParams)
}
module.exports = callDialogApi
