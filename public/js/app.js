// *** Clear session storage on refresh ***
if (performance.navigation.type == 1) {
  sessionStorage.clear();
}
try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
  }
catch(e) {
  console.error(e);
  $('.no-browser-support').show();
  $('.app').hide();
}

recognition.onstart = function() {
  console.log('Voice recognition activated.');
  // active()
}

function active(){
  $("#speak").animate({backgroundColor: "#ff0"}, 500)
  $("#speak").animate({backgroundColor: "#fff"}, 500)
  active()
}

recognition.onspeechend = function() {
  console.log('You were quiet for a while so voice recognition turned itself off.');
//setTimeout necessary to get query (for now)
  setTimeout(function(){
    submitQuery()
    $("input").val("")
  }, 500)
}

recognition.onerror = function(event) {
  if(event.error == 'no-speech') {
    console.log('No speech was detected. Try again.');
  };
}

  recognition.onresult = function(event) {
    var noteContent =''
    // event is a SpeechRecognitionEvent object.
    // It holds all the lines we have captured so far.
    // We only need the current one.
    var current = event.resultIndex;

    // Get a transcript of what was said.
    var transcript = event.results[current][0].transcript;

    // Add the current transcript to the contents of our Note.
    noteContent += transcript;
    $('#input').val(noteContent);
    console.log(event.results)
  }


var paramS = [],
    paramSkey = [],
    urlparams,
    totalPages,
    currentPage = 0;

function submitQuery(){
  var query = $('input').val().trim(),
      previousParams = {
      ACT_score:     sessionStorage.getItem('ACT_score'),
      SAT_score:     sessionStorage.getItem('SAT_score'),
      school_size:   sessionStorage.getItem('school_size'),
      school_size1:  sessionStorage.getItem('school_size1'),
      regionId:      sessionStorage.getItem('regionId'),
      "geo-city":    sessionStorage.getItem('geo-city'),
      state:         sessionStorage.getItem('state'),
      womenOnly:     sessionStorage.getItem('womenOnly'),
      menOnly:       sessionStorage.getItem('menOnly'),
      family_income: sessionStorage.getItem('school_cost'),
      major:         sessionStorage.getItem('major'),
      degree_type:   sessionStorage.getItem('degree_type')
  }

  previousParams = JSON.stringify(previousParams)

  $.post('/results', {query: query, prevParams: previousParams}, function(data, status){
      var info        = JSON.parse(data),
          finalParams = info.finalParams,
          school      = info.schools;
          urlparams   = info.urlParams;
      if (info.metadata !== undefined){
        total = info.metadata.total;
        totalPages  = Math.ceil(total/20);
      }
      // store all params in session storage
      for (key in finalParams){
          //don't log school_size1
          if(key === "school_size1"){
              continue
          }
          sessionStorage.setItem(key, finalParams[key])
// *** Param append to DOM ***
          if (finalParams[key] !== ""){
            if (paramS.includes(finalParams[key])){
            } else {
              console.log(paramS)
              console.log(paramSkey)
              if (paramSkey.includes(key)){
                $(`#${key}`).animate({opacity: "0"})
              }
              paramS.push(finalParams[key])
              paramSkey.push(key)
              var pv
              switch (key){
                case "ACT_score":
                  pv = "ACT: "+finalParams[key]
                  break
                case "SAT_score":
                  pv = "SAT: "+finalParams[key]
                  break
                case "major":
                  pv = finalParams[key].substr(0,6)
                  break
                case "family_income":
                  pv = "$"+finalParams[key]
                  break
                case "geo-city":
                  pv = finalParams[key].substr(0,6)
                  break
                case "degree_type":
                  if (finalParams[key] == 2){
                    pv = "ASSOC"
                  } else {
                    pv = "BACH"
                  }
                  break
                case "menOnly":
                  pv = "MEN"
                  break
                case "womenOnly":
                  pv = "WOMEN"
                  break
                case "school_size":
                  if (!isNaN(finalParams[key])){
                    if (finalParams[key]>=100000){
                      pv = "100K+ PPL"
                      break
                    }else {
                      pv = finalParams[key]+" PPL"
                      break
                    }
                  } else {
                    pv = finalParams[key]
                    break
                  }
                case "regionId":
                  switch (finalParams[key]){
                    case "0":
                     pv = "US SERV"
                     break
                    case "1":
                     pv = "N EAST"
                     break
                    case "2":
                     pv = "MID EAST"
                     break
                    case "3":
                     pv = "NORTH"
                     break
                    case "4":
                     pv = "MIDWEST"
                     break
                    case "5":
                     pv = "NORTH"
                     break
                    case "6":
                     pv = "S EAST"
                     break
                    case "7":
                     pv = "S WEST"
                     break
                    case "8":
                     pv = "WEST"
                     break
                    case "9":
                     pv = "US TERR"
                     break
                  }
                  break
                default:
                  pv = finalParams[key]
                  break
              }
              console.log(pv)
              pv = pv.toUpperCase()
// *** Param HTML ***
              $("#params").append(
                "<div id='"+key+"' class='param' value='"+key+"'>"+pv+"</div>"
              )
              $("#params").animate({left:"-=120px"}, 600)

            }
          }
      }
// *** Schools append to DOM ***
      $("#results").html(" ")
      if(school){
        for (i=0;i<school.length;i++){
          var own
          switch (school[i]['school.ownership']){
            case 1:
              own = "Public School"
              var cost = school[i]['2015.cost.avg_net_price.public']
              break
            case 2:
              own = "Private Non-Profit School"
              var cost = school[i]['2015.cost.avg_net_price.private']
              break
            case 3:
              own = "Private For-Profit School"
              var cost = school[i]['2015.cost.avg_net_price.private']
              break
            }
          var menO
          switch (school[i]['school.men_only']){
            case 1:
              menO = "Men Only<br>"
              break
            case 0:
              menO = ""
              break
            }
          var womenO
          switch (school[i]['school.women_only']){
            case 1:
              womenO = "Women Only<br>"
              break
            case 0:
              womenO = ""
              break
          }
          if (school[i]['2015.admissions.admission_rate.overall'] !== null){
            var adm = (school[i]['2015.admissions.admission_rate.overall']*100).toString().substr(0,2)+"%"
          } else {
            var adm = "n/a"
          }
          if (school[i]['2015.aid.pell_grant_rate'] !== null){
            var pell = (school[i]['2015.aid.pell_grant_rate']*100).toString().substr(0,2)+"%"
          } else {
            var pell = "n/a"
          }
          if (school[i]['2015.admissions.sat_scores.average.overall'] !== null){
            var admSat = school[i]['2015.admissions.sat_scores.average.overall']
          } else {
            var admSat = "n/a"
          }
          if (school[i]['2015.student.size'] !== null){
            var size = school[i]['2015.student.size']
          } else {
            var size = "n/a"
          }
          if (school[i]['2015.aid.loan_principal'] !== null){
            var debt = school[i]['2015.aid.loan_principal']
          } else {
            var debt = "n/a"
          }
// *** Result HTML ***
          $("#results").append(
            `<div id='${school[i]['school.name']}' class='result' value="${school[i].id}">
              <div class='result-title'>
                ${school[i]['school.name']}
              </div>
              <div class='result-info'>
                <hr>
                URL: <a href="https://${school[i]['school.school_url']}" target="_blank">${school[i]['school.school_url']}</a><br>
                Price Calculator: <a href="${school[i]['school.price_calculator_url']}">${school[i]['school.price_calculator_url']}</a><br>
                Location: ${school[i]['school.city']}, ${school[i]['school.state']} ${school[i]['school.zip']}<br>
                ${own}<br>
                Average Cost: $${cost}<br>
                ${menO}
                ${womenO}
                Admission Rate: ${adm}<br>
                Avg SAT Score Admitted: ${admSat}<br>
                Student Size: ${size}<br>
                Percentage of Pell Grant Recipiants: ${pell}<br>
                Median Debt for Graduates: ${debt}<br>
              </div>
            </div>`
          )
          $("#results").animate({opacity: "1", top: "120px"}, 600)
        }
        $(".result").animate({opacity: "1"}, 600)
        $("#results").animate({top: "120px"}, 600)
        if (total !== undefined){
  // *** Total update on Dom ***
          $("#total").html(`Total: ${total}`)
          $("#total").animate({right: "-32px"})
  // *** Pagination update on Dom ***
          if (currentPage != totalPages){
            $("#next").animate({opacity: "1"})
          }
          $("#current-page").html(currentPage+1)
          $("#total-pages").html(totalPages)
          $("#page-number").animate({bottom: "0"})
        } else {
  // *** No search results error ***
          $("#err").animate({opacity: "1"}, 600)
          setTimeout(()=>{
            $("#err").animate({opacity: "0"}, 600)
          }, 3000)
        }
      }else{
        //DISPLAYING THE ERROR MESSAGE CAN GO HERE
        reset()
        $("#err").animate({opacity: "1"}, 600)
        setTimeout(()=>{
          $("#err").animate({opacity: "0"}, 600)
        }, 3000)
      }
  })
}

//upsert schools into DB
function upsertDB(id, name) {
  $.ajax('/api/colleges', {
    method: 'PUT',
    data: {
      schoolid: id,
      schoolname: name
    },
    success: function(data, status){
      console.log(data)
    },
    error: function(something, string){
      console.log('Fuck...')
    }
  })
}

// *** Start ***
$("#a").on("click", function(){
  $("#start-info").fadeOut(500)
  $("#start").animate({height: "60px"}, 500, function(){
    $("#start").animate({width: "100px"}, 500, function(){
      $("#logo").fadeIn(500)
    })
  })
})

// *** Press enter ***
$("#input").on("keydown", function(){
  if (event.keyCode === 13){
    $("#submit").css("backgroundColor", "#00f100")
  }
})
$("#input").on("keyup", function(){
  if (event.keyCode === 13){
    event.preventDefault()
    $("#submit").css("backgroundColor", "#eee")
    submitQuery()
    $("input").val("")
  }
})

// *** Submit button ***
$("#submit").on("mouseenter", function(){
  $("#submit").animate({backgroundColor: "#00ff00"}, 500)
})
$("#submit").on("mouseleave", function(){
  $("#submit").animate({backgroundColor: "#eee"}, 500)
})
$("#submit").on("mousedown", function(){
  $("#submit").css("backgroundColor", "#00f100")
})
$("#submit").on("mouseup", function(){
  $("#submit").css("backgroundColor", "#00ff00")
})
$("#submit").on("click", function(){
  event.preventDefault()
  submitQuery()
  $("input").val("")
})

// *** Reset button ***
$("#reset").on("mouseenter", function(){
  $("#reset").animate({backgroundColor: "#ff0000"}, 500)
})
$("#reset").on("mouseleave", function(){
  $("#reset").animate({backgroundColor: "#000000"}, 500)
})
$("#reset").on("click", function(){
  reset()
})

function reset(){
  sessionStorage.clear();
  paramS = []
  $("#results").fadeOut(500, function(){
    $("#results").html("").fadeIn(100)
  })
  $("#params").fadeOut(500, function(){
    $("#params").css("left", "100%").html("").fadeIn(100)
  })
  $("#total").animate({right: "-63px"})
  $("#page-number").animate({bottom: "-50px"})
}

// *** Speak button ***
$("#speak").on("mouseenter", function(){
  $("#speak").animate({backgroundColor: "#ff0"}, 500)
})
$("#speak").on("mouseleave", function(){
  $("#speak").animate({backgroundColor: "#fff"}, 500)
})
$('#speak').on('click', function(e) {
  recognition.start();
});

// *** Click param ***
$("#params").on("mousedown", ".param", function(){
  $(this).css("background-color", "red")
})
$("#params").on("click", ".param", function(){
  $(this).animate({opacity: "0"})
  $("#params").animate({left: "+=120px"})
  sessionStorage.removeItem($(this).attr("value"))
  submitQuery()
})

// *** Click result ***
$("#results").on("click", ".result", ".open", function(){
  resultClose()
  var id = $(this).attr("value"),
      name = $(this).attr("id")
      console.log(id+" "+name)
  upsertDB(id, name)
  $(this).delay(600).animate({marginLeft: "680px"}, function(){
    $(this).css("position", "fixed")
      .animate({top: "120px", bottom: "0"})
      .toggleClass("result open");
      $(".result-title", this).animate({fontSize: "30px"})
      $(".result-info", this).fadeIn(300)
  })
})

function resultClose(){
  $(".result-title").animate({fontSize: "15px"})
  $(".result-info").fadeOut(300)
  $(".open").animate({height: "25px"}, function(){
    $(".open").animate({marginLeft: "200px"})
      .css({"position": "static", "height": "auto", "top": "auto", "bottom": "auto"})
      .toggleClass("result open");
  })
}

// *** Next page ***
$("#next").on("click", function(){
  console.log(currentPage)
  $("#results").animate({opacity: "0", top: "150px"}, 500, function(){
    $("#results").html("")
    currentPage++
    console.log(currentPage)
      $.get(`https://api.data.gov/ed/collegescorecard/v1/schools.json?${urlparams}_page=${currentPage}&school.operating__not=0&_fields=2015.aid.loan_principal,2015.aid.pell_grant_rate,2015.cost.avg_net_price.private,2015.cost.avg_net_price.public,2015.student.size,2015.admissions.sat_scores.average.overall,school.women_only,school.men_only,2015.admissions.admission_rate.overall,school.men_only,school.women_only,school.ownership,id,school.name,school.city,school.state,school.zip,school.school_url,school.price_calculator_url&api_key=zZciBMZkRuMWxEaFwOxiHQAltnZnufev2B97VRn8`, function(data){
        var school = data.results
        console.log(data)
        for (i=0;i<school.length;i++){
          var own
          switch (school[i]['school.ownership']){
            case 1:
              own = "Public School"
              var cost = school[i]['2015.cost.avg_net_price.public']
              break
            case 2:
              own = "Private Non-Profit School"
              var cost = school[i]['2015.cost.avg_net_price.private']
              break
            case 3:
              own = "Private For-Profit School"
              var cost = school[i]['2015.cost.avg_net_price.private']
              break
            }
          var menO
          switch (school[i]['school.men_only']){
            case 1:
              menO = "Men Only<br>"
              break
            case 0:
              menO = ""
              break
            }
          var womenO
          switch (school[i]['school.women_only']){
            case 1:
              womenO = "Women Only<br>"
              break
            case 0:
              womenO = ""
              break
          }
          if (school[i]['2015.admissions.admission_rate.overall'] !== null){
            var adm = (school[i]['2015.admissions.admission_rate.overall']*100).toString().substr(0,2)+"%"
          } else {
            var adm = "n/a"
          }
          if (school[i]['2015.aid.pell_grant_rate'] !== null){
            var pell = (school[i]['2015.aid.pell_grant_rate']*100).toString().substr(0,2)+"%"
          } else {
            var pell = "n/a"
          }
          if (school[i]['2015.admissions.sat_scores.average.overall'] !== null){
            var admSat = school[i]['2015.admissions.sat_scores.average.overall']
          } else {
            var admSat = "n/a"
          }
          if (school[i]['2015.student.size'] !== null){
            var size = school[i]['2015.student.size']
          } else {
            var size = "n/a"
          }
          if (school[i]['2015.aid.loan_principal'] !== null){
            var debt = school[i]['2015.aid.loan_principal']
          } else {
            var debt = "n/a"
          }
// *** Result HTML ***
          $("#results").append(
            `<div id='${school[i]['school.name']}' class='result' value="${school[i].id}">
              <div class='result-title'>
                ${school[i]['school.name']}
              </div>
              <div class='result-info'>
                <hr>
                URL: <a href="https://${school[i]['school.school_url']}" target="_blank">${school[i]['school.school_url']}</a><br>
                Price Calculator: <a href="https://${school[i]['school.price_calculator_url']}" target="_blank">${school[i]['school.price_calculator_url']}</a><br>
                Location: ${school[i]['school.city']}, ${school[i]['school.state']} ${school[i]['school.zip']}<br>
                ${own}<br>
                Average Cost: $${cost}<br>
                ${menO}
                ${womenO}
                Admission Rate: ${adm}<br>
                Avg SAT Score Admitted: ${admSat}<br>
                Student Size: ${size}<br>
                Percentage of Pell Grant Recipiants: ${pell}<br>
                Median Debt for Graduates: ${debt}<br>
              </div>
            </div>`
          )
        }
        console.log(currentPage+1 >= totalPages)
        if (currentPage+1 >= totalPages) {
          $("#prev").animate({opacity: "1"})
          $("#next").animate({opacity: "0"})
        } else {
          $("#prev").animate({opacity: "1"})
        }
        console.log(currentPage)
        $(".result").css("opacity", "1")
        $("#results").animate({opacity: "1", top: "120px"}, 600)
        $("#current-page").html(currentPage+1)
      })
  })
})

// *** Prev page ***
$("#prev").on("click", function(){
  $("#results").animate({opacity: "0", top: "150px"}, 500, function(){
    $("#results").html("")
    currentPage--
    // if (page*20-total <= 0) {
      $.get(`https://api.data.gov/ed/collegescorecard/v1/schools.json?${urlparams}_page=${currentPage}&school.operating__not=0&_fields=2015.aid.loan_principal,2015.aid.pell_grant_rate,2015.cost.avg_net_price.private,2015.cost.avg_net_price.public,2015.student.size,2015.admissions.sat_scores.average.overall,school.women_only,school.men_only,2015.admissions.admission_rate.overall,school.men_only,school.women_only,school.ownership,id,school.name,school.city,school.state,school.zip,school.school_url,school.price_calculator_url&api_key=zZciBMZkRuMWxEaFwOxiHQAltnZnufev2B97VRn8`, function(data){
        var school = data.results
        for (i=0;i<school.length;i++){
          var own
          switch (school[i]['school.ownership']){
            case 1:
              own = "Public School"
              var cost = school[i]['2015.cost.avg_net_price.public']
              break
            case 2:
              own = "Private Non-Profit School"
              var cost = school[i]['2015.cost.avg_net_price.private']
              break
            case 3:
              own = "Private For-Profit School"
              var cost = school[i]['2015.cost.avg_net_price.private']
              break
            }
          var menO
          switch (school[i]['school.men_only']){
            case 1:
              menO = "Men Only<br>"
              break
            case 0:
              menO = ""
              break
            }
          var womenO
          switch (school[i]['school.women_only']){
            case 1:
              womenO = "Women Only<br>"
              break
            case 0:
              womenO = ""
              break
          }
          if (school[i]['2015.admissions.admission_rate.overall'] !== null){
            var adm = (school[i]['2015.admissions.admission_rate.overall']*100).toString().substr(0,2)+"%"
          } else {
            var adm = "n/a"
          }
          if (school[i]['2015.aid.pell_grant_rate'] !== null){
            var pell = (school[i]['2015.aid.pell_grant_rate']*100).toString().substr(0,2)+"%"
          } else {
            var pell = "n/a"
          }
          if (school[i]['2015.admissions.sat_scores.average.overall'] !== null){
            var admSat = school[i]['2015.admissions.sat_scores.average.overall']
          } else {
            var admSat = "n/a"
          }
          if (school[i]['2015.student.size'] !== null){
            var size = school[i]['2015.student.size']
          } else {
            var size = "n/a"
          }
          if (school[i]['2015.aid.loan_principal'] !== null){
            var debt = school[i]['2015.aid.loan_principal']
          } else {
            var debt = "n/a"
          }
// *** Result HTML ***
          $("#results").append(
            `<div id='${school[i]['school.name']}' class='result' value="${school[i].id}">
              <div class='result-title'>
                ${school[i]['school.name']}
              </div>
              <div class='result-info'>
                <hr>
                URL: <a href="https://${school[i]['school.school_url']}" target="_blank">${school[i]['school.school_url']}</a><br>
                Price Calculator: <a href="https://${school[i]['school.price_calculator_url']}" target="_blank">${school[i]['school.price_calculator_url']}</a><br>
                Location: ${school[i]['school.city']}, ${school[i]['school.state']} ${school[i]['school.zip']}<br>
                ${own}<br>
                Average Cost: $${cost}<br>
                ${menO}
                ${womenO}
                Admission Rate: ${adm}<br>
                Avg SAT Score Admitted: ${admSat}<br>
                Student Size: ${size}<br>
                Percentage of Pell Grant Recipiants: ${pell}<br>
                Median Debt for Graduates: ${debt}<br>
              </div>
            </div>`
          )
        }
        if (currentPage == 0) {
          $("#prev").animate({opacity: "0"})
          $("#next").animate({opacity: "1"})
        }
        $(".result").css("opacity", "1")
        $("#results").animate({opacity: "1", top: "120px"}, 600)
        $("#current-page").html(currentPage+1)
      })
    // }
  })
})

// *** Popular click ***
$("#most-popular").on("click", function(event){
   console.log("ok")
   event.preventDefault();
   $.get("/api/colleges", function(data, status){
     console.log(JSON.parse(data))
     data = JSON.parse(data)
     school = data.schools
     for (i=0;i<school.length;i++){
       var own
       switch (school[i]['school.ownership']){
         case 1:
           own = "Public School"
           var cost = school[i]['2015.cost.avg_net_price.public']
           break
         case 2:
           own = "Private Non-Profit School"
           var cost = school[i]['2015.cost.avg_net_price.private']
           break
         case 3:
           own = "Private For-Profit School"
           var cost = school[i]['2015.cost.avg_net_price.private']
           break
         }
       var menO
       switch (school[i]['school.men_only']){
         case 1:
           menO = "Men Only<br>"
           break
         case 0:
           menO = ""
           break
         }
       var womenO
       switch (school[i]['school.women_only']){
         case 1:
           womenO = "Women Only<br>"
           break
         case 0:
           womenO = ""
           break
       }
       if (school[i]['2015.admissions.admission_rate.overall'] !== null){
         var adm = (school[i]['2015.admissions.admission_rate.overall']*100).toString().substr(0,2)+"%"
       } else {
         var adm = "n/a"
       }
       if (school[i]['2015.aid.pell_grant_rate'] !== null){
         var pell = (school[i]['2015.aid.pell_grant_rate']*100).toString().substr(0,2)+"%"
       } else {
         var pell = "n/a"
       }
       if (school[i]['2015.admissions.sat_scores.average.overall'] !== null){
         var admSat = school[i]['2015.admissions.sat_scores.average.overall']
       } else {
         var admSat = "n/a"
       }
       if (school[i]['2015.student.size'] !== null){
         var size = school[i]['2015.student.size']
       } else {
         var size = "n/a"
       }
       if (school[i]['2015.aid.loan_principal'] !== null){
         var debt = school[i]['2015.aid.loan_principal']
       } else {
         var debt = "n/a"
       }
  // *** Result HTML ***
       $("#results").append(
         `<div id='${school[i]['school.name']}' class='result' value="${school[i].id}">
           <div class='result-title'>
             ${school[i]['school.name']}
           </div>
           <div class='result-info'>
             <hr>
             URL: <a href="https://${school[i]['school.school_url']}" target="_blank">${school[i]['school.school_url']}</a><br>
             Price Calculator: <a href="https://${school[i]['school.price_calculator_url']}" target="_blank">${school[i]['school.price_calculator_url']}</a><br>
             Location: ${school[i]['school.city']}, ${school[i]['school.state']} ${school[i]['school.zip']}<br>
             ${own}<br>
             Average Cost: $${cost}<br>
             ${menO}
             ${womenO}
             Admission Rate: ${adm}<br>
             Avg SAT Score Admitted: ${admSat}<br>
             Student Size: ${size}<br>
             Percentage of Pell Grant Recipiants: ${pell}<br>
             Median Debt for Graduates: ${debt}<br>
           </div>
         </div>`
       )
     }
     $(".result").animate({opacity: "1"})
     $("#results").animate({opacity: "1", top: "120px"}, 600)
     $("#current-page").html(currentPage+1)
   })
})
